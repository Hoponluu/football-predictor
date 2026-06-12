const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

function getServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token) {
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('base64url');
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function applyFilters(query, filters) {
  if (!filters) return query;
  for (const f of filters) {
    const method = f.method;
    if (typeof query[method] !== 'function') continue;
    if (f.args) {
      query = query[method](...f.args);
    } else {
      query = query[method]();
    }
  }
  return query;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body || {};

  if (action === 'login') {
    const { email, password } = req.body;
    try {
      const sb = getServiceClient();
      const { data: players, error } = await sb
        .from('players')
        .select('id, name, email, is_admin')
        .eq('email', email)
        .eq('password', password)
        .eq('is_admin', true)
        .limit(1);

      if (error) throw error;
      const admin = players?.[0];
      if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

      const token = signToken({ adminId: admin.id, exp: Date.now() + 24 * 60 * 60 * 1000 });
      return res.status(200).json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (action === 'query') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { table, operation, data, filters, options } = req.body;
    if (!table || !operation) {
      return res.status(400).json({ error: 'Missing table or operation' });
    }

    const allowed = ['select', 'insert', 'update', 'delete', 'upsert'];
    if (!allowed.includes(operation)) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    try {
      const sb = getServiceClient();
      let query = sb.from(table);

      if (operation === 'select') {
        query = query.select(data || '*');
      } else if (operation === 'insert') {
        query = query.insert(data, options || {});
      } else if (operation === 'update') {
        query = query.update(data);
      } else if (operation === 'delete') {
        query = query.delete();
      } else if (operation === 'upsert') {
        query = query.upsert(data, options || {});
      }

      query = applyFilters(query, filters);
      const result = await query;
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (action === 'rpc') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { fn, params } = req.body;
    if (!fn) return res.status(400).json({ error: 'Missing function name' });

    try {
      const sb = getServiceClient();
      const result = await sb.rpc(fn, params || {});
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (action === 'notify') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { notifyType, matchId, matchLabel } = req.body;
    const sb = getServiceClient();

    try {
      const { data: allPlayers } = await sb.from('players').select('id');
      const playerIds = (allPlayers || []).map(p => p.id);

      if (notifyType === 'match_result') {
        const rows = playerIds.map(pid => ({
          player_id: pid, type: 'match_result',
          title: matchLabel || 'Kết quả trận đấu',
          body: 'Đã có kết quả! Xem điểm của bạn.',
          match_id: matchId || null, action: 'view_match', seen: false
        }));
        await sb.from('notifications').insert(rows);
      }

      if (notifyType === 'scores_calculated') {
        if (!matchId) return res.status(200).json({ success: true });

        const { data: preds } = await sb
          .from('predictions')
          .select('id, player_id, points_exact_score')
          .eq('match_id', matchId);

        for (const p of (preds || [])) {
          const { data: gs } = await sb
            .from('prediction_group_scores')
            .select('points_rank, points_minute')
            .eq('prediction_id', p.id);

          const hasMinuteBonus = (gs || []).some(s => s.points_minute > 0);
          const hasTop1 = (gs || []).some(s => s.points_rank >= 5);

          const msgs = [];
          if (p.points_exact_score > 0) msgs.push('Dự đoán đúng tỉ số!');
          if (hasMinuteBonus) msgs.push('Dự đoán phút gần nhất!');
          if (hasTop1) msgs.push('Top 1 dự đoán trận này!');

          if (msgs.length > 0) {
            await sb.from('notifications').insert({
              player_id: p.player_id, type: 'congrats',
              title: matchLabel || 'Chúc mừng!',
              body: msgs.join(' '),
              match_id: matchId, action: 'view_match', seen: false
            });
          }
        }
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (action === 'fetch_football_data') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'FOOTBALL_DATA_API_KEY not configured on Vercel' });

    try {
      const { fdMatchId } = req.body;
      let url = 'https://api.football-data.org/v4/competitions/WC/matches';
      if (fdMatchId) url = `https://api.football-data.org/v4/matches/${fdMatchId}`;

      const response = await fetch(url, {
        headers: { 'X-Auth-Token': apiKey }
      });
      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`football-data.org API ${response.status}: ${errBody}`);
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
};
