// ============================================
// KNOCKOUT BRACKET RENDER WITH CONNECTORS
// ============================================

function renderKnockoutBracket() {
    const container = document.getElementById('scheduleKnockout');
    if (!container) return;
    
    // Filter knockout matches - Use m.group (not m.match_group!)
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
    
    // Group matches by round - Use m.group (not m.match_group!)
    const rounds = {
        R32: knockoutMatches.filter(m => (m.group || m.match_group) === 'R32').sort((a, b) => a.date - b.date),
        R16: knockoutMatches.filter(m => (m.group || m.match_group) === 'R16').sort((a, b) => a.date - b.date),
        QF: knockoutMatches.filter(m => (m.group || m.match_group) === 'QF').sort((a, b) => a.date - b.date),
        SF: knockoutMatches.filter(m => (m.group || m.match_group) === 'SF').sort((a, b) => a.date - b.date),
        '3RD': knockoutMatches.filter(m => (m.group || m.match_group) === '3RD'),
        FINAL: knockoutMatches.filter(m => (m.group || m.match_group) === 'FINAL')
    };
    
    // Split matches into left and right brackets
    const leftR32 = rounds.R32.slice(0, 8);  // First 8 R32 matches on left
    const rightR32 = rounds.R32.slice(8, 16); // Last 8 R32 matches on right
    
    const leftR16 = rounds.R16.slice(0, 4);  // First 4 R16 matches on left
    const rightR16 = rounds.R16.slice(4, 8); // Last 4 R16 matches on right
    
    const leftQF = rounds.QF.slice(0, 2);    // First 2 QF matches on left
    const rightQF = rounds.QF.slice(2, 4);   // Last 2 QF matches on right
    
    const leftSF = rounds.SF.slice(0, 1);    // First SF match on left
    const rightSF = rounds.SF.slice(1, 2);   // Second SF match on right
    
    // Build bracket HTML with unique IDs for positioning
    container.innerHTML = `
        <div class="bracket-container">
            <div class="bracket-scroll-hint">← Vuốt để xem toàn bộ sơ đồ →</div>
            <div class="bracket-scroll-wrapper">
                <!-- SVG Connector Layer -->
                <svg class="bracket-connectors-svg" id="bracketConnectorsSvg">
                    <!-- Connectors will be drawn here -->
                </svg>
                
                <div class="bracket-grid">
                    <!-- R32 Left Column -->
                    <div class="bracket-column r32-left" id="col-r32-left">
                        ${leftR32.map((m, i) => renderBracketMatch(m, 'R32', `r32-l-${i}`)).join('')}
                    </div>
                    
                    <!-- R16 Left Column -->
                    <div class="bracket-column r16-left" id="col-r16-left">
                        ${leftR16.map((m, i) => renderBracketMatch(m, 'R16', `r16-l-${i}`)).join('')}
                    </div>
                    
                    <!-- QF Left Column -->
                    <div class="bracket-column qf-left" id="col-qf-left">
                        ${leftQF.map((m, i) => renderBracketMatch(m, 'QF', `qf-l-${i}`)).join('')}
                    </div>
                    
                    <!-- Center Column (SF Left + Final + 3rd + SF Right) -->
                    <div class="bracket-column center" id="col-center">
                        ${leftSF.map((m, i) => renderBracketMatch(m, 'SF', `sf-l-${i}`)).join('')}
                        ${rounds.FINAL.map((m, i) => renderBracketMatch(m, 'FINAL', `final-${i}`)).join('')}
                        ${rounds['3RD'].map((m, i) => renderBracketMatch(m, '3RD', `third-${i}`)).join('')}
                        ${rightSF.map((m, i) => renderBracketMatch(m, 'SF', `sf-r-${i}`)).join('')}
                    </div>
                    
                    <!-- QF Right Column -->
                    <div class="bracket-column qf-right" id="col-qf-right">
                        ${rightQF.map((m, i) => renderBracketMatch(m, 'QF', `qf-r-${i}`)).join('')}
                    </div>
                    
                    <!-- R16 Right Column -->
                    <div class="bracket-column r16-right" id="col-r16-right">
                        ${rightR16.map((m, i) => renderBracketMatch(m, 'R16', `r16-r-${i}`)).join('')}
                    </div>
                    
                    <!-- R32 Right Column -->
                    <div class="bracket-column r32-right" id="col-r32-right">
                        ${rightR32.map((m, i) => renderBracketMatch(m, 'R32', `r32-r-${i}`)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers to bracket matches
    attachBracketMatchHandlers();
    
    // Draw connectors after DOM is ready
    setTimeout(() => drawBracketConnectors(), 100);
}

function renderBracketMatch(match, roundLabel, uniqueId) {
    if (!countries[match.home] || !countries[match.away]) {
        console.error(`Team not found: ${match.home} or ${match.away}`);
        return '';
    }
    
    const homeData = countries[match.home];
    const awayData = countries[match.away];
    
    const isFinished = match.status === 'finished' && match.actualScore;
    const hasPrediction = match.userPrediction;
    const notOpen = match.status === 'not-open';
    
    // Determine winner/loser for styling
    let homeWinner = false;
    let awayWinner = false;
    let homeLoser = false;
    let awayLoser = false;
    
    if (isFinished) {
        const homeScore = match.actualScore.home_penalty !== null ? match.actualScore.home_penalty : match.actualScore.homeScore;
        const awayScore = match.actualScore.away_penalty !== null ? match.actualScore.away_penalty : match.actualScore.awayScore;
        
        if (homeScore > awayScore) {
            homeWinner = true;
            awayLoser = true;
        } else if (awayScore > homeScore) {
            awayWinner = true;
            homeLoser = true;
        }
    }
    
    // Format date
    const dateStr = match.date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
    
    // Round label mapping
    const roundLabels = {
        'R32': '1/32',
        'R16': '1/16',
        'QF': 'TỨ KẾT',
        'SF': 'BÁN KẾT',
        '3RD': 'HẠNG 3',
        'FINAL': 'CHUNG KẾT'
    };
    
    // Build score display
    let homeScoreDisplay = '';
    let awayScoreDisplay = '';
    let matchInfo = '';
    
    if (isFinished) {
        const hasPenalty = match.actualScore.home_penalty !== null && 
                          match.actualScore.home_penalty !== undefined;
        
        if (hasPenalty) {
            homeScoreDisplay = `${match.actualScore.homeScore}<span class="penalty">(${match.actualScore.home_penalty})</span>`;
            awayScoreDisplay = `${match.actualScore.awayScore}<span class="penalty">(${match.actualScore.away_penalty})</span>`;
        } else {
            homeScoreDisplay = match.actualScore.homeScore;
            awayScoreDisplay = match.actualScore.awayScore;
        }
        matchInfo = `<span class="minute">${match.actualScore.minute}'</span>`;
    } else if (hasPrediction) {
        matchInfo = '✓ Đã dự đoán';
    } else if (match.status === 'open') {
        matchInfo = 'Mở dự đoán';
    } else {
        matchInfo = 'Chưa mở';
    }
    
    // Build CSS classes
    const matchClasses = ['bracket-match'];
    if (notOpen) matchClasses.push('not-open');
    if (roundLabel === 'FINAL') matchClasses.push('final');
    if (roundLabel === '3RD') matchClasses.push('third-place');
    if (hasPrediction) matchClasses.push('user-predicted');
    
    return `
        <div class="${matchClasses.join(' ')}" data-match-id="${match.id}" id="match-${uniqueId}">
            <div class="bracket-match-header">
                <div class="bracket-match-date">${dateStr}</div>
                <div class="bracket-match-round">${roundLabels[roundLabel] || roundLabel}</div>
            </div>
            
            <div class="bracket-teams">
                <div class="bracket-team ${homeWinner ? 'winner' : ''} ${homeLoser ? 'loser' : ''}">
                    <div class="bracket-team-flag" style="background: ${homeData.color}">
                        ${homeData.flag}
                    </div>
                    <div class="bracket-team-name">${match.home}</div>
                    ${isFinished ? `<div class="bracket-team-score">${homeScoreDisplay}</div>` : ''}
                </div>
                
                <div class="bracket-team ${awayWinner ? 'winner' : ''} ${awayLoser ? 'loser' : ''}">
                    <div class="bracket-team-flag" style="background: ${awayData.color}">
                        ${awayData.flag}
                    </div>
                    <div class="bracket-team-name">${match.away}</div>
                    ${isFinished ? `<div class="bracket-team-score">${awayScoreDisplay}</div>` : ''}
                </div>
            </div>
            
            <div class="bracket-match-status ${hasPrediction ? 'predicted' : ''}">
                ${matchInfo}
            </div>
        </div>
    `;
}

function drawBracketConnectors() {
    const svg = document.getElementById('bracketConnectorsSvg');
    if (!svg) return;
    
    // Clear existing connectors
    svg.innerHTML = '';
    
    // Define connector mappings (which matches connect to which)
    const connections = [
        // R32 Left -> R16 Left
        { from: ['match-r32-l-0', 'match-r32-l-1'], to: 'match-r16-l-0' },
        { from: ['match-r32-l-2', 'match-r32-l-3'], to: 'match-r16-l-1' },
        { from: ['match-r32-l-4', 'match-r32-l-5'], to: 'match-r16-l-2' },
        { from: ['match-r32-l-6', 'match-r32-l-7'], to: 'match-r16-l-3' },
        
        // R16 Left -> QF Left
        { from: ['match-r16-l-0', 'match-r16-l-1'], to: 'match-qf-l-0' },
        { from: ['match-r16-l-2', 'match-r16-l-3'], to: 'match-qf-l-1' },
        
        // QF Left -> SF Left
        { from: ['match-qf-l-0', 'match-qf-l-1'], to: 'match-sf-l-0' },
        
        // R32 Right -> R16 Right
        { from: ['match-r32-r-0', 'match-r32-r-1'], to: 'match-r16-r-0' },
        { from: ['match-r32-r-2', 'match-r32-r-3'], to: 'match-r16-r-1' },
        { from: ['match-r32-r-4', 'match-r32-r-5'], to: 'match-r16-r-2' },
        { from: ['match-r32-r-6', 'match-r32-r-7'], to: 'match-r16-r-3' },
        
        // R16 Right -> QF Right
        { from: ['match-r16-r-0', 'match-r16-r-1'], to: 'match-qf-r-0' },
        { from: ['match-r16-r-2', 'match-r16-r-3'], to: 'match-qf-r-1' },
        
        // QF Right -> SF Right
        { from: ['match-qf-r-0', 'match-qf-r-1'], to: 'match-sf-r-0' },
        
        // SF -> Final
        { from: ['match-sf-l-0', 'match-sf-r-0'], to: 'match-final-0' }
    ];
    
    // Draw each connection
    connections.forEach(conn => {
        drawConnector(svg, conn.from, conn.to);
    });
}

function drawConnector(svg, fromIds, toId) {
    // Get elements
    const from1 = document.getElementById(fromIds[0]);
    const from2 = document.getElementById(fromIds[1]);
    const to = document.getElementById(toId);
    
    if (!from1 || !from2 || !to) {
        console.warn('Connector elements not found:', fromIds, toId);
        return;
    }
    
    // Get positions relative to SVG container
    const svgRect = svg.getBoundingClientRect();
    const from1Rect = from1.getBoundingClientRect();
    const from2Rect = from2.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    // Calculate positions
    const from1X = from1Rect.right - svgRect.left;
    const from1Y = from1Rect.top + from1Rect.height / 2 - svgRect.top;
    
    const from2X = from2Rect.right - svgRect.left;
    const from2Y = from2Rect.top + from2Rect.height / 2 - svgRect.top;
    
    const toX = toRect.left - svgRect.left;
    const toY = toRect.top + toRect.height / 2 - svgRect.top;
    
    // Calculate middle point
    const midY = (from1Y + from2Y) / 2;
    const connectorWidth = 30; // Width of connector
    const midX = from1X + connectorWidth;
    
    // Create SVG path using the provided structure
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    const pathData = `
        M ${from1X} ${from1Y}
        H ${midX - 8}
        C ${midX - 4} ${from1Y} ${midX} ${from1Y + 4} ${midX} ${from1Y + 8}
        V ${midY}
        
        M ${from2X} ${from2Y}
        H ${midX - 8}
        C ${midX - 4} ${from2Y} ${midX} ${from2Y - 4} ${midX} ${from2Y - 8}
        V ${midY}
        
        M ${midX} ${midY}
        H ${toX}
    `.trim().replace(/\s+/g, ' ');
    
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'bracket-connector-path');
    
    svg.appendChild(path);
}

function attachBracketMatchHandlers() {
    const bracketMatches = document.querySelectorAll('.bracket-match');
    
    bracketMatches.forEach(card => {
        const matchId = card.getAttribute('data-match-id');
        const match = matches.find(m => m.id === matchId);
        
        if (!match) return;
        
        // Click handler
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

// New function: Only render group stage (A-L)
function renderScheduleGroupStageOnly() {
    const container = document.getElementById('scheduleGroupStage');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Group matches by match_group - ONLY GROUP STAGE
    const groupStageMatches = matches.filter(m => {
        const group = m.group || m.match_group || '';  // Prioritize m.group
        // Only include A-L groups (single letter or "GROUP X" format)
        return /^[A-L]$/.test(group) || /^GROUP [A-L]$/i.test(group) || /^Bảng [A-L]$/i.test(group);
    });
    
    const groups = {};
    groupStageMatches.forEach(match => {
        const group = match.group || match.match_group || 'Other';  // Prioritize m.group
        if (!groups[group]) groups[group] = [];
        groups[group].push(match);
    });
    
    // Render each group
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
