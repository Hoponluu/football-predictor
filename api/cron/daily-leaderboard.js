const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

module.exports = async function handler(req, res) {
  // Vercel Cron sends GET requests
  if (req.method !== 'GET') return res.status(405).end();

  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Get all groups
    const { data: groups } = await sb.from('groups').select('id, name');
    if (!groups || groups.length === 0) return res.status(200).json({ message: 'No groups' });

    for (const group of groups) {
      // Get players in group with their total points
      const { data: memberships } = await sb
        .from('player_groups')
        .select('players (id, name, favorite_points, predictions (total_points))')
        .eq('group_id', group.id);

      if (!memberships || memberships.length < 2) continue;

      const leaderboard = memberships
        .map(m => m.players)
        .filter(Boolean)
        .map(p => {
          const predPoints = (p.predictions || []).reduce((s, pr) => s + (pr.total_points || 0), 0);
          return { id: p.id, name: p.name, points: predPoints + (p.favorite_points || 0) };
        })
        .sort((a, b) => b.points - a.points);

      if (leaderboard.length < 2) continue;

      const top1 = leaderboard[0];
      const top2 = leaderboard[1];
      const gap = top1.points - top2.points;

      if (top1.points === 0) continue;

      // Notify all players in this group about the leader
      const playerIds = leaderboard.map(p => p.id);
      const rows = playerIds.map(pid => ({
        player_id: pid,
        type: 'leaderboard',
        title: `${top1.name} đang dẫn đầu!`,
        body: gap > 0
          ? `Top 1 với ${top1.points} điểm, hơn ${top2.name} ${gap} điểm.`
          : `Đồng hạng nhất với ${top2.name} — ${top1.points} điểm!`,
        match_id: null,
        action: 'leaderboard',
        seen: false
      }));

      await sb.from('notifications').insert(rows);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
