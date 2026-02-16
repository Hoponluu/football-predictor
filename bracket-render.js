// ============================================
// BRACKET RENDER - ULTIMATE FIX
// Support CẢ HAI: actualScore.homeScore VÀ home_score
// Dựa trên cấu trúc Supabase thực tế
// ============================================

function renderKnockoutBracket() {
    const container = document.getElementById('scheduleKnockout');
    if (!container) return;
    
    const knockoutMatches = matches.filter(m => 
        ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'].includes(m.group || m.match_group)
    );
    
    if (knockoutMatches.length === 0) {
        container.innerHTML = `
            <div class="bracket-empty">
                <div class="bracket-empty-icon">🏆</div>
                <div class="bracket-empty-text">
                    Sơ đồ knockout sẽ xuất hiện khi có trận loại trực tiếp
                </div>
            </div>
        `;
        return;
    }
    
    const rounds = {
        R32: knockoutMatches.filter(m => (m.group || m.match_group) === 'R32').sort((a, b) => a.date - b.date),
        R16: knockoutMatches.filter(m => (m.group || m.match_group) === 'R16').sort((a, b) => a.date - b.date),
        QF: knockoutMatches.filter(m => (m.group || m.match_group) === 'QF').sort((a, b) => a.date - b.date),
        SF: knockoutMatches.filter(m => (m.group || m.match_group) === 'SF').sort((a, b) => a.date - b.date),
        '3RD': knockoutMatches.filter(m => (m.group || m.match_group) === '3RD'),
        FINAL: knockoutMatches.filter(m => (m.group || m.match_group) === 'FINAL')
    };
    
    container.innerHTML = `
        <div class="tournament-bracket">
            <div class="bracket-hint">← Vuốt ngang để xem toàn bộ →</div>
            
            <div class="bracket-wrapper">
                <div class="bracket-round" data-round="r32">
                    <div class="round-title">Vòng 1/32</div>
                    <div class="round-matches">
                        ${rounds.R32.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <div class="bracket-round" data-round="r16">
                    <div class="round-title">Vòng 1/16</div>
                    <div class="round-matches">
                        ${rounds.R16.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <div class="bracket-round" data-round="qf">
                    <div class="round-title">Tứ kết</div>
                    <div class="round-matches">
                        ${rounds.QF.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <div class="bracket-round" data-round="sf">
                    <div class="round-title">Bán kết</div>
                    <div class="round-matches">
                        ${rounds.SF.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <div class="bracket-round final-round" data-round="final">
                    <div class="round-title">Chung kết</div>
                    <div class="round-matches">
                        ${rounds.FINAL.map((m, i) => renderSimpleBracketMatch(m, i, true)).join('')}
                        ${rounds['3RD'].map((m, i) => renderSimpleBracketMatch(m, i, false, true)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    attachBracketMatchHandlers();
}

// ============================================
// HELPER: Lấy scores từ match object
// Support cả actualScore và home_score trực tiếp
// ============================================
function getMatchScores(match) {
    // Option 1: Nếu có actualScore object (đã được transform)
    if (match.actualScore && match.actualScore.homeScore !== undefined) {
        return {
            homeScore: match.actualScore.homeScore,
            awayScore: match.actualScore.awayScore,
            homePenalty: match.actualScore.home_penalty || null,
            awayPenalty: match.actualScore.away_penalty || null
        };
    }
    
    // Option 2: Dùng trực tiếp từ Supabase (home_score, away_score)
    if (match.home_score !== undefined) {
        return {
            homeScore: match.home_score,
            awayScore: match.away_score,
            homePenalty: match.home_penalty || null,
            awayPenalty: match.away_penalty || null
        };
    }
    
    // Option 3: Không có score
    return {
        homeScore: null,
        awayScore: null,
        homePenalty: null,
        awayPenalty: null
    };
}

function renderSimpleBracketMatch(match, index, isFinal = false, isThird = false) {
    const homeTeam = match.home || match.home_team || 'TBD';
    const awayTeam = match.away || match.away_team || 'TBD';
    
    if (!countries[homeTeam] || !countries[awayTeam]) {
        return '';
    }
    
    const homeData = countries[homeTeam];
    const awayData = countries[awayTeam];
    const isFinished = match.status === 'finished';
    const hasPrediction = match.userPrediction;
    const notOpen = match.status === 'not-open';
    
    // Lấy scores
    const scores = getMatchScores(match);
    
    let homeWinner = false;
    let awayWinner = false;
    
    if (isFinished && scores.homeScore !== null) {
        const homeScore = scores.homePenalty !== null ? scores.homePenalty : scores.homeScore;
        const awayScore = scores.awayPenalty !== null ? scores.awayPenalty : scores.awayScore;
        homeWinner = homeScore > awayScore;
        awayWinner = awayScore > homeScore;
    }
    
    const dateStr = match.date ? match.date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' }) : '';
    const timeStr = match.date ? match.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
    
    let scoreDisplay = '';
    if (isFinished && scores.homeScore !== null) {
        const hasPenalty = scores.homePenalty !== null;
        if (hasPenalty) {
            scoreDisplay = `${scores.homeScore}(${scores.homePenalty}) - ${scores.awayScore}(${scores.awayPenalty})`;
        } else {
            scoreDisplay = `${scores.homeScore} - ${scores.awayScore}`;
        }
    }
    
    const classes = ['simple-match'];
    if (notOpen) classes.push('not-open');
    if (isFinal) classes.push('final-match');
    if (isThird) classes.push('third-match');
    if (hasPrediction) classes.push('predicted');
    
    return `
        <div class="${classes.join(' ')}" data-match-id="${match.id}">
            <div class="match-date-time">
                <span>${dateStr}</span>
                <span>${timeStr}</span>
            </div>
            
            <div class="match-teams">
                <div class="team ${homeWinner ? 'winner' : ''}">
                    <span class="flag" style="background: ${homeData.color}">${homeData.flag}</span>
                    <span class="name">${homeTeam}</span>
                    ${isFinished && scores.homeScore !== null ? `<span class="score">${scores.homeScore}</span>` : ''}
                </div>
                
                <div class="team ${awayWinner ? 'winner' : ''}">
                    <span class="flag" style="background: ${awayData.color}">${awayData.flag}</span>
                    <span class="name">${awayTeam}</span>
                    ${isFinished && scores.awayScore !== null ? `<span class="score">${scores.awayScore}</span>` : ''}
                </div>
            </div>
            
            ${hasPrediction ? '<div class="match-status">✓</div>' : ''}
            ${scoreDisplay && scores.homePenalty !== null ? '<div class="penalty-note">(Penalty)</div>' : ''}
        </div>
    `;
}

function attachBracketMatchHandlers() {
    document.querySelectorAll('.simple-match').forEach(card => {
        const matchId = card.getAttribute('data-match-id');
        const match = matches.find(m => m.id === matchId);
        if (!match) return;
        
        if (!currentPlayer) {
            card.onclick = () => {
                alert('Vui lòng đăng nhập để dự đoán!');
                openLoginModal();
            };
        } else if (match.status === 'finished') {
            card.onclick = () => openResultsModal(match);
        } else if (match.status === 'open' || match.userPrediction) {
            card.onclick = () => openModal(match);
        } else if (match.status === 'not-open') {
            card.onclick = null;
            card.style.cursor = 'default';
        }
    });
}

// ============================================
// ⭐ MINI MATCH CARD - UNIVERSAL VERSION
// Support CẢ HAI: actualScore VÀ home_score trực tiếp
// ============================================
function renderMiniMatchCard(match) {
    // Team names - theo Supabase: home_team, away_team
    const homeTeam = match.home || match.home_team || 'TBD';
    const awayTeam = match.away || match.away_team || 'TBD';
    
    // ✅ Lấy scores - support cả 2 formats
    const scores = getMatchScores(match);
    const homeScore = scores.homeScore !== null && scores.homeScore !== undefined 
                      ? scores.homeScore : '-';
    const awayScore = scores.awayScore !== null && scores.awayScore !== undefined 
                      ? scores.awayScore : '-';
    
    // Countries
    const homeData = countries[homeTeam] || { flag: '🏴', color: '#f0f0f0' };
    const awayData = countries[awayTeam] || { flag: '🏴', color: '#f0f0f0' };
    
    // Format date and time - theo Supabase: match_date
    const matchDate = match.date || (match.match_date ? new Date(match.match_date) : new Date());
    const day = matchDate.getDate();
    const month = matchDate.getMonth() + 1;
    const hours = String(matchDate.getHours()).padStart(2, '0');
    const minutes = String(matchDate.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    // User points
    const userPoints = match.points || 0;
    const hasPrediction = match.userPrediction || userPoints > 0;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'mini-match-card';
    if (hasPrediction) card.classList.add('predicted');
    
    card.innerHTML = `
        <div class="mini-match-header">
            <span class="mini-match-date">${day} thg ${month}</span>
            <span class="mini-match-time">${timeStr}</span>
            <span class="mini-match-icon">⚽</span>
        </div>
        <div class="mini-match-teams">
            <div class="mini-team-row">
                <span class="team-flag" style="background: ${homeData.color}">${homeData.flag}</span>
                <span class="team-name">${homeTeam}</span>
                <span class="team-score">${homeScore}</span>
            </div>
            <div class="mini-team-row">
                <span class="team-flag" style="background: ${awayData.color}">${awayData.flag}</span>
                <span class="team-name">${awayTeam}</span>
                <span class="team-score">${awayScore}</span>
            </div>
        </div>
        ${userPoints > 0 ? `<div class="mini-match-points">+${userPoints}</div>` : ''}
    `;
    
    // Add click handler
    if (!currentPlayer) {
        card.onclick = () => {
            alert('Vui lòng đăng nhập để dự đoán!');
            openLoginModal();
        };
    } else if (match.status === 'finished') {
        card.onclick = () => openResultsModal(match);
    } else if (match.status === 'open' || match.userPrediction) {
        card.onclick = () => openModal(match);
    } else if (match.status === 'not-open') {
        card.onclick = null;
        card.style.cursor = 'default';
    } else {
        card.onclick = () => openModal(match);
    }
    
    return card;
}

function renderScheduleGroupStageOnly() {
    const container = document.getElementById('scheduleGroupStage');
    if (!container) return;
    
    container.innerHTML = '';
    
    const groupStageMatches = matches.filter(m => {
        const group = m.group || m.match_group || '';
        return /^[A-L]$/.test(group) || /^GROUP [A-L]$/i.test(group) || /^Bảng [A-L]$/i.test(group);
    });
    
    const groups = {};
    groupStageMatches.forEach(match => {
        const group = match.group || match.match_group || 'Other';
        if (!groups[group]) groups[group] = [];
        groups[group].push(match);
    });
    
    // Render each group as compact card
    Object.keys(groups).sort().forEach(groupName => {
        const groupMatches = groups[groupName].sort((a, b) => {
            const aDate = a.date || new Date(a.match_date);
            const bDate = b.date || new Date(b.match_date);
            return aDate - bDate;
        });
        
        const groupCard = document.createElement('div');
        groupCard.className = 'compact-group-card';
        
        // Group title
        const title = document.createElement('div');
        title.className = 'compact-group-title';
        title.textContent = `Bảng ${groupName.replace(/^GROUP /i, '').replace(/^Bảng /i, '')}`;
        groupCard.appendChild(title);
        
        // Matches in columns
        const matchesGrid = document.createElement('div');
        matchesGrid.className = 'compact-group-grid';
        
        groupMatches.forEach(match => {
            matchesGrid.appendChild(renderMiniMatchCard(match));
        });
        
        groupCard.appendChild(matchesGrid);
        container.appendChild(groupCard);
    });
}
