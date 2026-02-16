// ============================================
// BRACKET RENDER - FIXED VERSION
// Fix lỗi "undefined" bằng cách dùng đúng field names từ Supabase
// Database fields: home_team, away_team, home_score, away_score
// ============================================

// ============================================
// MAIN FUNCTION - RENDER MINI MATCH CARD (FIXED)
// ============================================
function renderMiniMatchCard(match) {
    // ✅ FIX: Dùng match.home_team và match.away_team (ĐÚNG với database)
    // ❌ KHÔNG DÙNG: match.home_team_name, match.homeTeam (không tồn tại)
    const homeTeamName = match.home_team || 'TBD';
    const awayTeamName = match.away_team || 'TBD';
    
    // Tỉ số - check null/undefined
    const homeScore = match.home_score !== null && match.home_score !== undefined 
                      ? match.home_score : '-';
    const awayScore = match.away_score !== null && match.away_score !== undefined 
                      ? match.away_score : '-';
    
    // User points (nếu có)
    const userPoints = match.user_points || 0;
    
    // Format date and time
    const matchDate = new Date(match.match_date);
    const day = matchDate.getDate();
    const month = matchDate.getMonth() + 1;
    const hours = String(matchDate.getHours()).padStart(2, '0');
    const minutes = String(matchDate.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    // Get flag emojis
    const homeFlag = getTeamFlag(homeTeamName);
    const awayFlag = getTeamFlag(awayTeamName);
    
    return `
        <div class="mini-match-card">
            <div class="mini-match-header">
                <span class="mini-match-date">${day} thg ${month}</span>
                <span class="mini-match-time">${timeStr}</span>
                <span class="mini-match-icon">⚽</span>
            </div>
            <div class="mini-match-teams">
                <div class="mini-team-row">
                    <span class="team-flag">${homeFlag}</span>
                    <span class="team-name">${homeTeamName}</span>
                    <span class="team-score">${homeScore}</span>
                </div>
                <div class="mini-team-row">
                    <span class="team-flag">${awayFlag}</span>
                    <span class="team-name">${awayTeamName}</span>
                    <span class="team-score">${awayScore}</span>
                </div>
            </div>
            ${userPoints > 0 ? `<div class="mini-match-points">+${userPoints}</div>` : ''}
        </div>
    `;
}

// ============================================
// HELPER FUNCTION - GET TEAM FLAG
// ============================================
function getTeamFlag(teamName) {
    if (!teamName || teamName === 'TBD') return '🏴';
    
    const flagMap = {
        // Group A-H (48 teams World Cup 2026)
        'Italy': '🇮🇹',
        'Vietnam': '🇻🇳',
        'France': '🇫🇷',
        'Netherlands': '🇳🇱',
        'Brasil': '🇧🇷',
        'Brazil': '🇧🇷',
        'Ecuador': '🇪🇨',
        'Germany': '🇩🇪',
        'Spain': '🇪🇸',
        'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Argentina': '🇦🇷',
        'Portugal': '🇵🇹',
        'Belgium': '🇧🇪',
        'Mexico': '🇲🇽',
        'USA': '🇺🇸',
        'Canada': '🇨🇦',
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'Korea Republic': '🇰🇷',
        'Australia': '🇦🇺',
        'Uruguay': '🇺🇾',
        'Colombia': '🇨🇴',
        'Chile': '🇨🇱',
        'Peru': '🇵🇪',
        'Costa Rica': '🇨🇷',
        'Jamaica': '🇯🇲',
        'Morocco': '🇲🇦',
        'Senegal': '🇸🇳',
        'Tunisia': '🇹🇳',
        'Egypt': '🇪🇬',
        'Nigeria': '🇳🇬',
        'Ghana': '🇬🇭',
        'Cameroon': '🇨🇲',
        'Switzerland': '🇨🇭',
        'Denmark': '🇩🇰',
        'Croatia': '🇭🇷',
        'Poland': '🇵🇱',
        'Sweden': '🇸🇪',
        'Austria': '🇦🇹',
        'Czech Republic': '🇨🇿',
        'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
        'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'Serbia': '🇷🇸',
        'Ukraine': '🇺🇦',
        'Turkey': '🇹🇷',
        'IR Iran': '🇮🇷',
        'Iran': '🇮🇷',
        'Saudi Arabia': '🇸🇦',
        'Qatar': '🇶🇦',
        'Iraq': '🇮🇶',
        'China': '🇨🇳',
        'Thailand': '🇹🇭',
        'Indonesia': '🇮🇩',
        'Malaysia': '🇲🇾',
        'New Zealand': '🇳🇿',
    };
    
    return flagMap[teamName] || '🏴';
}

// ============================================
// HELPER FUNCTION - GET FLAG EMOJI FROM CODE
// ============================================
function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length < 2) return '🏴';
    
    // Convert 3-letter ISO code to 2-letter if needed
    const iso2Map = {
        'ITA': 'IT',
        'VNM': 'VN',
        'FRA': 'FR',
        'NLD': 'NL',
        'BRA': 'BR',
        'ECU': 'EC',
        'DEU': 'DE',
        'GER': 'DE',
        'ESP': 'ES',
        'ENG': 'GB',
        'ARG': 'AR',
        'POR': 'PT',
        'BEL': 'BE',
        'MEX': 'MX',
        'USA': 'US',
        'CAN': 'CA',
        'JPN': 'JP',
        'KOR': 'KR',
        'AUS': 'AU',
        'URU': 'UY',
        'COL': 'CO',
        'CHI': 'CL',
        'PER': 'PE',
        'CRC': 'CR',
        'JAM': 'JM',
        'MAR': 'MA',
        'SEN': 'SN',
        'TUN': 'TN',
        'EGY': 'EG',
        'NGA': 'NG',
        'GHA': 'GH',
        'CMR': 'CM',
        'SUI': 'CH',
        'DEN': 'DK',
        'CRO': 'HR',
        'POL': 'PL',
        'SWE': 'SE',
        'AUT': 'AT',
        'CZE': 'CZ',
        'WAL': 'GB',
        'SCO': 'GB',
        'SRB': 'RS',
        'UKR': 'UA',
        'TUR': 'TR',
        'IRN': 'IR',
        'KSA': 'SA',
        'QAT': 'QA',
        'IRQ': 'IQ',
        'CHN': 'CN',
        'THA': 'TH',
        'IDN': 'ID',
        'MAS': 'MY',
        'NZL': 'NZ',
    };
    
    const code2 = iso2Map[countryCode.toUpperCase()] || countryCode.substring(0, 2);
    
    const codePoints = code2
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
}

// ============================================
// RENDER BIG MATCH CARD (unchanged from before)
// ============================================
function renderMatchCard(match) {
    const homeTeamName = match.home_team || 'TBD';
    const awayTeamName = match.away_team || 'TBD';
    const homeScore = match.home_score !== null && match.home_score !== undefined 
                      ? match.home_score : '-';
    const awayScore = match.away_score !== null && match.away_score !== undefined 
                      ? match.away_score : '-';
    const userPoints = match.user_points || 0;
    
    const matchDate = new Date(match.match_date);
    const day = matchDate.getDate();
    const month = matchDate.getMonth() + 1;
    const hours = String(matchDate.getHours()).padStart(2, '0');
    const minutes = String(matchDate.getMinutes()).padStart(2, '0');
    
    const homeFlag = getTeamFlag(homeTeamName);
    const awayFlag = getTeamFlag(awayTeamName);
    
    return `
        <div class="match-card">
            <div class="match-header">
                <span class="match-date">${day} tháng ${month}</span>
                <span class="match-time">${hours}:${minutes}</span>
                <span class="match-location">${match.location || 'TBD'}</span>
            </div>
            <div class="match-teams">
                <div class="team">
                    <span class="team-flag">${homeFlag}</span>
                    <span class="team-name">${homeTeamName}</span>
                    <span class="team-score">${homeScore}</span>
                </div>
                <div class="vs">vs</div>
                <div class="team">
                    <span class="team-flag">${awayFlag}</span>
                    <span class="team-name">${awayTeamName}</span>
                    <span class="team-score">${awayScore}</span>
                </div>
            </div>
            ${userPoints > 0 ? `<div class="match-points">Điểm dự đoán: +${userPoints}</div>` : ''}
        </div>
    `;
}

// ============================================
// RENDER KNOCKOUT BRACKET (Simple version)
// ============================================
function renderKnockoutBracket(matches) {
    // Organize matches by round
    const rounds = {
        'R32': matches.filter(m => m.round === 'R32' || m.round === 'Round of 32'),
        'R16': matches.filter(m => m.round === 'R16' || m.round === 'Round of 16'),
        'QF': matches.filter(m => m.round === 'QF' || m.round === 'Quarter-finals'),
        'SF': matches.filter(m => m.round === 'SF' || m.round === 'Semi-finals'),
        'FINAL': matches.filter(m => m.round === 'FINAL' || m.round === 'Final'),
    };
    
    let html = '<div class="bracket-container">';
    
    // Render each round
    for (const [roundName, roundMatches] of Object.entries(rounds)) {
        if (roundMatches.length === 0) continue;
        
        html += `
            <div class="bracket-round" data-round="${roundName}">
                <h3 class="round-title">${getRoundTitle(roundName)}</h3>
                <div class="round-matches">
        `;
        
        roundMatches.forEach(match => {
            html += renderSimpleMatch(match);
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// ============================================
// RENDER SIMPLE MATCH (for bracket)
// ============================================
function renderSimpleMatch(match) {
    const homeTeamName = match.home_team || 'TBD';
    const awayTeamName = match.away_team || 'TBD';
    const homeScore = match.home_score !== null && match.home_score !== undefined 
                      ? match.home_score : '-';
    const awayScore = match.away_score !== null && match.away_score !== undefined 
                      ? match.away_score : '-';
    
    const homeFlag = getTeamFlag(homeTeamName);
    const awayFlag = getTeamFlag(awayTeamName);
    
    return `
        <div class="simple-match">
            <div class="simple-team">
                <span class="team-flag">${homeFlag}</span>
                <span class="team-name">${homeTeamName}</span>
                <span class="team-score">${homeScore}</span>
            </div>
            <div class="simple-team">
                <span class="team-flag">${awayFlag}</span>
                <span class="team-name">${awayTeamName}</span>
                <span class="team-score">${awayScore}</span>
            </div>
        </div>
    `;
}

// ============================================
// HELPER FUNCTION - GET ROUND TITLE
// ============================================
function getRoundTitle(round) {
    const titles = {
        'R32': 'Vòng 1/16',
        'R16': 'Vòng 1/8',
        'QF': 'Tứ kết',
        'SF': 'Bán kết',
        'FINAL': 'Chung kết'
    };
    return titles[round] || round;
}

// ============================================
// RENDER SCHEDULE - GROUP STAGE ONLY (with compact groups)
// ============================================
function renderScheduleGroupStageOnly(matches) {
    // Group matches by group (A, B, C, etc.)
    const groups = {};
    matches.forEach(match => {
        const group = match.group || 'Unknown';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(match);
    });
    
    let html = '<div class="compact-groups-container">';
    
    // Render each group as compact card
    for (const [groupName, groupMatches] of Object.entries(groups).sort()) {
        html += `
            <div class="compact-group-card">
                <h3 class="group-title">Bảng ${groupName}</h3>
                <div class="group-matches-grid">
        `;
        
        groupMatches.forEach(match => {
            html += renderMiniMatchCard(match);
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// ============================================
// DEBUG FUNCTION (optional - for testing)
// ============================================
function debugMatchObject(match) {
    console.log('=== MATCH DEBUG ===');
    console.log('home_team:', match.home_team);
    console.log('away_team:', match.away_team);
    console.log('home_score:', match.home_score);
    console.log('away_score:', match.away_score);
    console.log('match_date:', match.match_date);
    console.log('Full object:', match);
    console.log('==================');
}

// ============================================
// EXPORT (if using modules)
// ============================================
// export { 
//     renderMiniMatchCard, 
//     renderMatchCard, 
//     renderKnockoutBracket,
//     renderScheduleGroupStageOnly,
//     getTeamFlag,
//     getFlagEmoji 
// };
