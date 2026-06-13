const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = new Date().toISOString();
  const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data: opened } = await sb
      .from('matches')
      .update({ status: 'open' })
      .eq('status', 'not-open')
      .gt('match_date', now)
      .lte('match_date', in24h)
      .select('id');

    const { data: closed } = await sb
      .from('matches')
      .update({ status: 'closed' })
      .eq('status', 'open')
      .lte('match_date', now)
      .select('id');

    const { data: directClosed } = await sb
      .from('matches')
      .update({ status: 'closed' })
      .eq('status', 'not-open')
      .lte('match_date', now)
      .select('id');

    return res.status(200).json({
      opened: opened?.length || 0,
      closed: (closed?.length || 0) + (directClosed?.length || 0)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
