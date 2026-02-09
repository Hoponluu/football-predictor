// Supabase Client & Helper Functions
// Load Supabase từ CDN và khởi tạo client

// Initialize Supabase Client
const supabase = window.supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Current user state
let currentUser = null;
let currentGroup = null;

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

async function loginUser(email, password) {
  try {
    // For demo: Simple email/password check against players table
    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('email', email)
      .eq('password', password) // ⚠️ In production, use proper auth!
      .single();
    
    if (error) throw error;
    
    currentUser = player;
    localStorage.setItem('currentUserId', player.id);
    
    return { success: true, player };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

async function logoutUser() {
  currentUser = null;
  currentGroup = null;
  localStorage.removeItem('currentUserId');
}

async function getCurrentUser() {
  const userId = localStorage.getItem('currentUserId');
  if (!userId) return null;
  
  try {
    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    currentUser = player;
    return player;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// ============================================
// GROUP FUNCTIONS
// ============================================

async function getGroupByCode(code) {
  try {
    const { data: group, error } = await supabase
      .from('groups')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error) throw error;
    
    currentGroup = group;
    return group;
  } catch (error) {
    console.error('Get group error:', error);
    return null;
  }
}

async function createGroup(name, code) {
  try {
    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        name,
        code,
        created_by: currentUser?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, group };
  } catch (error) {
    console.error('Create group error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// MATCH FUNCTIONS
// ============================================

async function getMatches(groupId) {
  try {
    // NEW LOGIC: Matches are GLOBAL - all groups see same matches
    // Only filter if groupId is explicitly provided (for backward compatibility)
    let query = supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true });
    
    // Optional: filter by group_id if provided
    // But for this app, we load ALL matches regardless of group
    // (Matches are created by admin and shared across all groups)
    
    const { data: matches, error } = await query;
    
    if (error) throw error;
    
    return matches || [];
  } catch (error) {
    console.error('Get matches error:', error);
    return [];
  }
}

async function createMatch(groupId, matchData) {
  try {
    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        group_id: groupId,
        match_group: matchData.group,
        home_team: matchData.home,
        away_team: matchData.away,
        match_date: matchData.date,
        status: matchData.status || 'not-open'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, match };
  } catch (error) {
    console.error('Create match error:', error);
    return { success: false, error: error.message };
  }
}

async function updateMatchStatus(matchId, status) {
  try {
    const { data: match, error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', matchId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, match };
  } catch (error) {
    console.error('Update match status error:', error);
    return { success: false, error: error.message };
  }
}

async function enterMatchResult(matchId, homeScore, awayScore, minute) {
  try {
    const { data: match, error } = await supabase
      .from('matches')
      .update({
        status: 'finished',
        home_score: homeScore,
        away_score: awayScore,
        minute: minute
      })
      .eq('id', matchId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Trigger will automatically calculate points for all predictions
    
    return { success: true, match };
  } catch (error) {
    console.error('Enter match result error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PREDICTION FUNCTIONS
// ============================================

async function getPrediction(matchId, playerId) {
  try {
    const { data: prediction, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)
      .eq('player_id', playerId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return prediction;
  } catch (error) {
    console.error('Get prediction error:', error);
    return null;
  }
}

async function savePrediction(matchId, playerId, homeScore, awayScore, minute) {
  try {
    const { data: prediction, error } = await supabase
      .from('predictions')
      .upsert({
        match_id: matchId,
        player_id: playerId,
        home_score: homeScore,
        away_score: awayScore,
        minute: minute,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'match_id,player_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, prediction };
  } catch (error) {
    console.error('Save prediction error:', error);
    return { success: false, error: error.message };
  }
}

async function getPlayerPredictions(playerId) {
  try {
    const { data: predictions, error } = await supabase
      .from('predictions')
      .select(`
        *,
        matches (*)
      `)
      .eq('player_id', playerId);
    
    if (error) throw error;
    
    return predictions || [];
  } catch (error) {
    console.error('Get player predictions error:', error);
    return [];
  }
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

async function getLeaderboard(groupId) {
  try {
    // Get all players in group with their total points
    const { data: players, error } = await supabase
      .from('players')
      .select(`
        id,
        name,
        predictions (
          total_points,
          points_rank,
          points_exact_score,
          points_minute
        )
      `)
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    // Calculate stats for each player
    const leaderboard = players.map(player => {
      const predictions = player.predictions || [];
      const totalPoints = predictions.reduce((sum, p) => sum + (p.total_points || 0), 0);
      const top1Count = predictions.filter(p => p.points_rank === 4).length;
      const exactScoreCount = predictions.filter(p => p.points_exact_score > 0).length;
      const exactMinuteCount = predictions.filter(p => p.points_minute > 0).length;
      
      return {
        id: player.id,
        name: player.name,
        points: totalPoints,
        top1: top1Count,
        exactScore: exactScoreCount,
        exactMinute: exactMinuteCount
      };
    });
    
    // Sort by points descending
    leaderboard.sort((a, b) => b.points - a.points);
    
    // Add rank
    leaderboard.forEach((player, index) => {
      player.rank = index + 1;
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
}

// ============================================
// FAVORITE TEAM FUNCTIONS
// ============================================

async function getFavoriteTeamSettings(groupId) {
  try {
    const { data: group, error } = await supabase
      .from('groups')
      .select('favorite_team_enabled, favorite_team_locked, favorite_team_deadline, points_round16, points_quarter, points_semi, points_final, points_champion')
      .eq('id', groupId)
      .single();
    
    if (error) throw error;
    
    return group;
  } catch (error) {
    console.error('Get favorite team settings error:', error);
    return null;
  }
}

async function selectFavoriteTeam(playerId, teamName) {
  try {
    const { data: player, error } = await supabase
      .from('players')
      .update({
        favorite_team: teamName,
        favorite_team_status: 'active'
      })
      .eq('id', playerId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, player };
  } catch (error) {
    console.error('Select favorite team error:', error);
    return { success: false, error: error.message };
  }
}

async function updateFavoriteTeamSettings(groupId, settings) {
  try {
    const { data: group, error } = await supabase
      .from('groups')
      .update(settings)
      .eq('id', groupId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, group };
  } catch (error) {
    console.error('Update favorite team settings error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PLAYER FUNCTIONS
// ============================================

async function getPlayers(groupId) {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    return players || [];
  } catch (error) {
    console.error('Get players error:', error);
    return [];
  }
}

async function createPlayer(groupId, name, email, password, isAdmin = false) {
  try {
    const { data: player, error } = await supabase
      .from('players')
      .insert({
        group_id: groupId,
        name,
        email,
        password, // ⚠️ In production, hash this!
        is_admin: isAdmin
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, player };
  } catch (error) {
    console.error('Create player error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

function subscribeToMatches(groupId, callback) {
  const subscription = supabase
    .channel('matches-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'matches',
      filter: `group_id=eq.${groupId}`
    }, callback)
    .subscribe();
  
  return subscription;
}

function subscribeToPredictions(playerId, callback) {
  const subscription = supabase
    .channel('predictions-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'predictions',
      filter: `player_id=eq.${playerId}`
    }, callback)
    .subscribe();
  
  return subscription;
}

// ============================================
// EXPORT TO WINDOW (CRITICAL FOR BROWSER ACCESS)
// ============================================

// Export all functions to window object so they can be accessed globally
window.getCurrentUser = getCurrentUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getGroupByCode = getGroupByCode;
window.createGroup = createGroup;
window.getMatches = getMatches;
window.createMatch = createMatch;
window.updateMatchStatus = updateMatchStatus;
window.enterMatchResult = enterMatchResult;
window.getPrediction = getPrediction;
window.savePrediction = savePrediction;
window.getPlayerPredictions = getPlayerPredictions;
window.getLeaderboard = getLeaderboard;
window.getFavoriteTeamSettings = getFavoriteTeamSettings;
window.selectFavoriteTeam = selectFavoriteTeam;
window.updateFavoriteTeamSettings = updateFavoriteTeamSettings;
window.getPlayers = getPlayers;
window.createPlayer = createPlayer;
window.subscribeToMatches = subscribeToMatches;
window.subscribeToPredictions = subscribeToPredictions;

// Export supabase client
window.supabaseClient = supabase;

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Supabase client initialized');
console.log('📊 Database:', SUPABASE_CONFIG.url);
console.log('👥 Ready to connect to group:', DEMO_GROUP_CODE);
console.log('✅ All functions exported to window object');
