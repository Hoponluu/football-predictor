// ============================================
// SIMPLE TOURNAMENT BRACKET
// Standard structure like Google/ESPN/FIFA
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
    
    // Simple HTML structure
    container.innerHTML = `
        <div class="tournament-bracket">
            <div class="bracket-hint">← Vuốt ngang để xem toàn bộ →</div>
            
            <div class="bracket-wrapper">
                <!-- Round of 32 -->
                <div class="bracket-round" data-round="r32">
                    <div class="round-title">Vòng 1/32</div>
                    <div class="round-matches">
                        ${rounds.R32.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <!-- Round of 16 -->
                <div class="bracket-round" data-round="r16">
                    <div class="round-title">Vòng 1/16</div>
                    <div class="round-matches">
                        ${rounds.R16.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <!-- Quarter Finals -->
                <div class="bracket-round" data-round="qf">
                    <div class="round-title">Tứ kết</div>
                    <div class="round-matches">
                        ${rounds.QF.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <!-- Semi Finals -->
                <div class="bracket-round" data-round="sf">
                    <div class="round-title">Bán kết</div>
                    <div class="round-matches">
                        ${rounds.SF.map((m, i) => renderSimpleBracketMatch(m, i)).join('')}
                    </div>
                </div>
                
                <!-- Finals -->
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

function renderSimpleBracketMatch(match, index, isFinal = false, isThird = false) {
    if (!countries[match.home] || !countries[match.away]) {
        return '';
    }
    
    const homeData = countries[match.home];
    const awayData = countries[match.away];
    const isFinished = match.status === 'finished' && match.actualScore;
    const hasPrediction = match.userPrediction;
    const notOpen = match.status === 'not-open';
    
    let homeWinner = false;
    let awayWinner = false;
    
    if (isFinished) {
        const homeScore = match.actualScore.home_penalty !== null ? match.actualScore.home_penalty : match.actualScore.homeScore;
        const awayScore = match.actualScore.away_penalty !== null ? match.actualScore.away_penalty : match.actualScore.awayScore;
        homeWinner = homeScore > awayScore;
        awayWinner = awayScore > homeScore;
    }
    
    const dateStr = match.date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
    const timeStr = match.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    let scoreDisplay = '';
    if (isFinished) {
        const hasPenalty = match.actualScore.home_penalty !== null;
        if (hasPenalty) {
            scoreDisplay = `${match.actualScore.homeScore}(${match.actualScore.home_penalty}) - ${match.actualScore.awayScore}(${match.actualScore.away_penalty})`;
        } else {
            scoreDisplay = `${match.actualScore.homeScore} - ${match.actualScore.awayScore}`;
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
                    <span class="name">${match.home}</span>
                    ${isFinished ? `<span class="score">${match.actualScore.homeScore}</span>` : ''}
                </div>
                
                <div class="team ${awayWinner ? 'winner' : ''}">
                    <span class="flag" style="background: ${awayData.color}">${awayData.flag}</span>
                    <span class="name">${match.away}</span>
                    ${isFinished ? `<span class="score">${match.actualScore.awayScore}</span>` : ''}
                </div>
            </div>
            
            ${hasPrediction ? '<div class="match-status">✓</div>' : ''}
            ${scoreDisplay && match.actualScore.home_penalty !== null ? '<div class="penalty-note">(Penalty)</div>' : ''}
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
        } else if (match.status === 'finished' && match.actualScore) {
            card.onclick = () => openResultsModal(match);
        } else if (match.status === 'open' || (match.userPrediction && match.status !== 'finished')) {
            card.onclick = () => openModal(match);
        } else if (match.status === 'not-open') {
            card.onclick = null;
            card.style.cursor = 'default';
        }
    });
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
    
    Object.keys(groups).sort().forEach(groupName => {
        const groupMatches = groups[groupName].sort((a, b) => a.date - b.date);
        
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        
        const title = document.createElement('div');
        title.className = 'group-card-title';
        title.textContent = `Bảng ${groupName.replace(/^GROUP /i, '').replace(/^Bảng /i, '')}`;
        groupCard.appendChild(title);
        
        const matchesList = document.createElement('div');
        matchesList.className = 'group-matches-list';
        
        groupMatches.forEach(match => {
            matchesList.appendChild(renderMiniMatchCard(match));
        });
        
        groupCard.appendChild(matchesList);
        container.appendChild(groupCard);
    });
}
