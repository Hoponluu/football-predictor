const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function getAllPlayerIds(sb) {
  const { data } = await sb.from('players').select('id');
  return (data || []).map(p => p.id);
}

async function createNotifications(sb, playerIds, type, title, body, matchId, action) {
  if (!playerIds || playerIds.length === 0) return;
  const rows = playerIds.map(pid => ({
    player_id: pid, type, title, body: body || null,
    match_id: matchId || null, action: action || null, seen: false
  }));
  await sb.from('notifications').insert(rows);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body || {};
  const sb = getServiceClient();

  // ============================================
  // LOGIN
  // ============================================
  if (action === 'login') {
    const { email, password, groupCode } = req.body;
    try {
      const { data: player, error } = await sb
        .from('players')
        .select('id, name, email, favorite_team, favorite_team_status, favorite_points')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (error) throw error;
      if (!player) return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });

      if (groupCode) {
        const { data: group } = await sb
          .from('groups')
          .select('id')
          .eq('code', groupCode)
          .maybeSingle();

        if (!group) return res.status(400).json({ error: 'Mã nhóm không hợp lệ' });

        const { data: existing } = await sb
          .from('player_groups')
          .select('id')
          .eq('player_id', player.id)
          .eq('group_id', group.id)
          .maybeSingle();

        if (!existing) {
          await sb.from('player_groups').insert({ player_id: player.id, group_id: group.id });
        }
      }

      return res.status(200).json({ player });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================================
  // SAVE PREDICTION
  // ============================================
  if (action === 'save_prediction') {
    const { playerId, matchId, homeScore, awayScore, minute } = req.body;
    if (!playerId || !matchId) return res.status(400).json({ error: 'Missing required fields' });

    try {
      const { data: match } = await sb
        .from('matches')
        .select('status')
        .eq('id', matchId)
        .single();

      if (!match || match.status !== 'open') {
        return res.status(403).json({ error: 'Trận đấu không mở để dự đoán' });
      }

      const { data: prediction, error } = await sb
        .from('predictions')
        .upsert({
          match_id: matchId,
          player_id: playerId,
          home_score: homeScore,
          away_score: awayScore,
          minute: minute,
          updated_at: new Date().toISOString()
        }, { onConflict: 'match_id,player_id' })
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ prediction });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================================
  // SELECT FAVORITE TEAM
  // ============================================
  if (action === 'select_favorite_team') {
    const { playerId, teamName } = req.body;
    if (!playerId || !teamName) return res.status(400).json({ error: 'Missing required fields' });

    try {
      const { data: rules } = await sb
        .from('scoring_rules')
        .select('favorite_team_enabled, favorite_team_locked, favorite_team_deadline')
        .limit(1)
        .maybeSingle();

      if (!rules?.favorite_team_enabled) {
        return res.status(403).json({ error: 'Tính năng đội yêu thích đã bị tắt' });
      }
      if (rules?.favorite_team_locked) {
        return res.status(403).json({ error: 'Đội yêu thích đã bị khóa' });
      }
      if (rules?.favorite_team_deadline && new Date(rules.favorite_team_deadline) < new Date()) {
        return res.status(403).json({ error: 'Đã hết hạn chọn đội yêu thích' });
      }

      const { data: player, error } = await sb
        .from('players')
        .update({ favorite_team: teamName, favorite_team_status: 'active' })
        .eq('id', playerId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ player });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================================
  // AUTO UPDATE MATCH STATUSES + NOTIFICATIONS
  // ============================================
  if (action === 'auto_update_statuses') {
    try {
      const now = new Date().toISOString();
      const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const in1h = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      // not-open → open
      const { data: opened } = await sb
        .from('matches')
        .update({ status: 'open' })
        .eq('status', 'not-open')
        .gt('match_date', now)
        .lte('match_date', in24h)
        .select('id, home_team, away_team');

      // open → closed
      const { data: closed } = await sb
        .from('matches')
        .update({ status: 'closed' })
        .eq('status', 'open')
        .lte('match_date', now)
        .select('id, home_team, away_team');

      // Generate notifications for newly opened matches
      if (opened && opened.length > 0) {
        const allPlayers = await getAllPlayerIds(sb);
        for (const m of opened) {
          await createNotifications(sb, allPlayers,
            'match_open',
            `${m.home_team} vs ${m.away_team}`,
            'Trận đấu đã mở dự đoán!',
            m.id, 'open_match'
          );
        }
      }

      // Generate notifications for closed matches (notify predictors)
      if (closed && closed.length > 0) {
        for (const m of closed) {
          const { data: preds } = await sb
            .from('predictions')
            .select('player_id')
            .eq('match_id', m.id);
          const predictorIds = (preds || []).map(p => p.player_id);
          if (predictorIds.length > 0) {
            await createNotifications(sb, predictorIds,
              'prediction_closed',
              `${m.home_team} vs ${m.away_team}`,
              'Dự đoán của bạn đã được khóa. Chờ kết quả!',
              m.id, 'view_match'
            );
          }
        }
      }

      // Reminder: open matches closing in ~1h, for players who haven't predicted
      const { data: closingSoon } = await sb
        .from('matches')
        .select('id, home_team, away_team')
        .eq('status', 'open')
        .gt('match_date', now)
        .lte('match_date', in1h);

      if (closingSoon && closingSoon.length > 0) {
        const allPlayers = await getAllPlayerIds(sb);
        for (const m of closingSoon) {
          const { data: preds } = await sb
            .from('predictions')
            .select('player_id')
            .eq('match_id', m.id);
          const predictedIds = new Set((preds || []).map(p => p.player_id));
          const unpredicted = allPlayers.filter(pid => !predictedIds.has(pid));

          // Check if reminder already sent (avoid duplicates)
          if (unpredicted.length > 0) {
            const { data: existing } = await sb
              .from('notifications')
              .select('player_id')
              .eq('match_id', m.id)
              .eq('type', 'reminder')
              .in('player_id', unpredicted);
            const alreadyNotified = new Set((existing || []).map(n => n.player_id));
            const toNotify = unpredicted.filter(pid => !alreadyNotified.has(pid));

            if (toNotify.length > 0) {
              await createNotifications(sb, toNotify,
                'reminder',
                `${m.home_team} vs ${m.away_team}`,
                'Sắp đóng dự đoán! Bạn chưa dự đoán trận này.',
                m.id, 'open_match'
              );
            }
          }
        }
      }

      return res.status(200).json({
        opened: opened?.length || 0,
        closed: closed?.length || 0
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================================
  // GET NOTIFICATIONS
  // ============================================
  if (action === 'get_notifications') {
    const { playerId, limit: lim } = req.body;
    if (!playerId) return res.status(400).json({ error: 'Missing playerId' });

    try {
      const { data, error } = await sb
        .from('notifications')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(lim || 50);

      if (error) throw error;

      const { data: countData } = await sb
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('player_id', playerId)
        .eq('seen', false);

      return res.status(200).json({
        notifications: data || [],
        unreadCount: countData?.length ?? 0
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================================
  // MARK NOTIFICATIONS SEEN
  // ============================================
  if (action === 'mark_seen') {
    const { playerId, notificationIds } = req.body;
    if (!playerId) return res.status(400).json({ error: 'Missing playerId' });

    try {
      let query = sb
        .from('notifications')
        .update({ seen: true })
        .eq('player_id', playerId);

      if (notificationIds && notificationIds.length > 0) {
        query = query.in('id', notificationIds);
      }

      const { error } = await query;
      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
};
