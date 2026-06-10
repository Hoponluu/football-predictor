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

  return res.status(400).json({ error: 'Unknown action' });
};
