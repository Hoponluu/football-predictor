const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body || {};
  const sb = getServiceClient();

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

  if (action === 'auto_update_statuses') {
    try {
      const now = new Date().toISOString();
      const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { data: opened } = await sb
        .from('matches')
        .update({ status: 'open' })
        .eq('status', 'not-open')
        .gt('match_date', now)
        .lte('match_date', in24h)
        .select('id');

      const { data: closed } = await sb
        .from('matches')
        .update({ status: 'not-open' })
        .eq('status', 'open')
        .lte('match_date', now)
        .select('id');

      return res.status(200).json({
        opened: opened?.length || 0,
        closed: closed?.length || 0
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
};
