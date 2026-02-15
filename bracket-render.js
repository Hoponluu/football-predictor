// ============================================
// KNOCKOUT BRACKET - TOP/BOTTOM QUADRANT STRUCTURE
// ============================================

function renderKnockoutBracket() {
    const container = document.getElementById('scheduleKnockout');
    if (!container) return;
    
    // Filter knockout matches
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
    
    // Group matches by round
    const rounds = {
        R32: knockoutMatches.filter(m => (m.group || m.match_group) === 'R32').sort((a, b) => a.date - b.date),
        R16: knockoutMatches.filter(m => (m.group || m.match_group) === 'R16').sort((a, b) => a.date - b.date),
        QF: knockoutMatches.filter(m => (m.group || m.match_group) === 'QF').sort((a, b) => a.date - b.date),
        SF: knockoutMatches.filter(m => (m.group || m.match_group) === 'SF').sort((a, b) => a.date - b.date),
        '3RD': knockoutMatches.filter(m => (m.group || m.match_group) === '3RD'),
        FINAL: knockoutMatches.filter(m => (m.group || m.match_group) === 'FINAL')
    };
    
    // Split matches for TOP/BOTTOM quadrant layout
    // LEFT bracket (R32 0-7, R16 0-3, QF 0-1, SF 0)
    const topLeftR32 = rounds.R32.slice(0, 4);      // R32[0-3]
    const bottomLeftR32 = rounds.R32.slice(4, 8);   // R32[4-7]
    const topLeftR16 = rounds.R16.slice(0, 2);      // R16[0-1]
    const bottomLeftR16 = rounds.R16.slice(2, 4);   // R16[2-3]
    const topLeftQF = rounds.QF.slice(0, 1);        // QF[0]
    const bottomLeftQF = rounds.QF.slice(1, 2);     // QF[1]
    
    // RIGHT bracket (R32 8-15, R16 4-7, QF 2-3, SF 1)
    const topRightR32 = rounds.R32.slice(8, 12);    // R32[8-11]
    const bottomRightR32 = rounds.R32.slice(12, 16); // R32[12-15]
    const topRightR16 = rounds.R16.slice(4, 6);     // R16[4-5]
    const bottomRightR16 = rounds.R16.slice(6, 8);  // R16[6-7]
    const topRightQF = rounds.QF.slice(2, 3);       // QF[2]
    const bottomRightQF = rounds.QF.slice(3, 4);    // QF[3]
    
    // SF matches
    const topSF = rounds.SF.slice(0, 1);            // SF[0]
    const bottomSF = rounds.SF.slice(1, 2);         // SF[1]
    
    // Build HTML with top/bottom row structure
    container.innerHTML = `
        <div class="bracket-container">
            <div class="bracket-scroll-hint">← Vuốt để xem toàn bộ sơ đồ →</div>
            <div class="bracket-scroll-wrapper">
                <!-- SVG Connector Layer -->
                <svg class="bracket-connectors-svg" id="bracketConnectorsSvg">
                    <!-- Connectors will be drawn here -->
                </svg>
                
                <div class="bracket-grid">
                    <!-- TOP ROW -->
                    <div class="bracket-row top">
                        <!-- Column 1: R32 Top-Left -->
                        <div class="bracket-column col-1">
                            ${topLeftR32.map((m, i) => renderBracketMatch(m, 'R32', `tl-r32-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 2: R16 Top-Left -->
                        <div class="bracket-column col-2">
                            ${topLeftR16.map((m, i) => renderBracketMatch(m, 'R16', `tl-r16-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 3: QF Top-Left -->
                        <div class="bracket-column col-3">
                            ${topLeftQF.map((m, i) => renderBracketMatch(m, 'QF', `tl-qf-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 4: SF Top -->
                        <div class="bracket-column col-4">
                            ${topSF.map((m, i) => renderBracketMatch(m, 'SF', `t-sf-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 5: QF Top-Right -->
                        <div class="bracket-column col-5">
                            ${topRightQF.map((m, i) => renderBracketMatch(m, 'QF', `tr-qf-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 6: R16 Top-Right -->
                        <div class="bracket-column col-6">
                            ${topRightR16.map((m, i) => renderBracketMatch(m, 'R16', `tr-r16-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 7: R32 Top-Right -->
                        <div class="bracket-column col-7">
                            ${topRightR32.map((m, i) => renderBracketMatch(m, 'R32', `tr-r32-${i}`)).join('')}
                        </div>
                    </div>
                    
                    <!-- CENTER ROW -->
                    <div class="bracket-row center">
                        <div class="bracket-column col-1"></div>
                        <div class="bracket-column col-2"></div>
                        <div class="bracket-column col-3"></div>
                        
                        <!-- Column 4: FINAL + 3RD -->
                        <div class="bracket-column col-4" style="flex-direction: row; gap: 12px; justify-content: center;">
                            ${rounds['3RD'].map((m, i) => renderBracketMatch(m, '3RD', `third-${i}`)).join('')}
                            ${rounds.FINAL.map((m, i) => renderBracketMatch(m, 'FINAL', `final-${i}`)).join('')}
                        </div>
                        
                        <div class="bracket-column col-5"></div>
                        <div class="bracket-column col-6"></div>
                        <div class="bracket-column col-7"></div>
                    </div>
                    
                    <!-- BOTTOM ROW -->
                    <div class="bracket-row bottom">
                        <!-- Column 1: R32 Bottom-Left -->
                        <div class="bracket-column col-1">
                            ${bottomLeftR32.map((m, i) => renderBracketMatch(m, 'R32', `bl-r32-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 2: R16 Bottom-Left -->
                        <div class="bracket-column col-2">
                            ${bottomLeftR16.map((m, i) => renderBracketMatch(m, 'R16', `bl-r16-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 3: QF Bottom-Left -->
                        <div class="bracket-column col-3">
                            ${bottomLeftQF.map((m, i) => renderBracketMatch(m, 'QF', `bl-qf-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 4: SF Bottom -->
                        <div class="bracket-column col-4">
                            ${bottomSF.map((m, i) => renderBracketMatch(m, 'SF', `b-sf-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 5: QF Bottom-Right -->
                        <div class="bracket-column col-5">
                            ${bottomRightQF.map((m, i) => renderBracketMatch(m, 'QF', `br-qf-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 6: R16 Bottom-Right -->
                        <div class="bracket-column col-6">
                            ${bottomRightR16.map((m, i) => renderBracketMatch(m, 'R16', `br-r16-${i}`)).join('')}
                        </div>
                        
                        <!-- Column 7: R32 Bottom-Right -->
                        <div class="bracket-column col-7">
                            ${bottomRightR32.map((m, i) => renderBracketMatch(m, 'R32', `br-r32-${i}`)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers
    attachBracketMatchHandlers();
    
    // Draw connectors
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
    
    // Determine winner/loser
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
    
    // Round labels
    const roundLabels = {
        'R32': '1/32',
        'R16': '1/16',
        'QF': 'TỨ KẾT',
        'SF': 'BÁN KẾT',
        '3RD': 'HẠNG 3',
        'FINAL': 'CHUNG KẾT'
    };
    
    // Score display
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
    
    // CSS classes
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
    
    svg.innerHTML = '';
    
    // Define connections for top bracket
    const topConnections = [
        // Top-Left R32 → R16
        { from: ['match-tl-r32-0', 'match-tl-r32-1'], to: 'match-tl-r16-0' },
        { from: ['match-tl-r32-2', 'match-tl-r32-3'], to: 'match-tl-r16-1' },
        // Top-Left R16 → QF
        { from: ['match-tl-r16-0', 'match-tl-r16-1'], to: 'match-tl-qf-0' },
        // Top-Left QF → SF
        { from: ['match-tl-qf-0'], to: 'match-t-sf-0', single: true },
        
        // Top-Right R32 → R16
        { from: ['match-tr-r32-0', 'match-tr-r32-1'], to: 'match-tr-r16-0' },
        { from: ['match-tr-r32-2', 'match-tr-r32-3'], to: 'match-tr-r16-1' },
        // Top-Right R16 → QF
        { from: ['match-tr-r16-0', 'match-tr-r16-1'], to: 'match-tr-qf-0' },
        // Top-Right QF → SF (connects to top SF)
        { from: ['match-tr-qf-0'], to: 'match-t-sf-0', single: true },
    ];
    
    // Define connections for bottom bracket
    const bottomConnections = [
        // Bottom-Left R32 → R16
        { from: ['match-bl-r32-0', 'match-bl-r32-1'], to: 'match-bl-r16-0' },
        { from: ['match-bl-r32-2', 'match-bl-r32-3'], to: 'match-bl-r16-1' },
        // Bottom-Left R16 → QF
        { from: ['match-bl-r16-0', 'match-bl-r16-1'], to: 'match-bl-qf-0' },
        // Bottom-Left QF → SF
        { from: ['match-bl-qf-0'], to: 'match-b-sf-0', single: true },
        
        // Bottom-Right R32 → R16
        { from: ['match-br-r32-0', 'match-br-r32-1'], to: 'match-br-r16-0' },
        { from: ['match-br-r32-2', 'match-br-r32-3'], to: 'match-br-r16-1' },
        // Bottom-Right R16 → QF
        { from: ['match-br-r16-0', 'match-br-r16-1'], to: 'match-br-qf-0' },
        // Bottom-Right QF → SF
        { from: ['match-br-qf-0'], to: 'match-b-sf-0', single: true },
    ];
    
    // SF → FINAL connections
    const finalConnections = [
        { from: ['match-t-sf-0'], to: 'match-final-0', single: true },
        { from: ['match-b-sf-0'], to: 'match-final-0', single: true },
    ];
    
    // Draw all connections
    [...topConnections, ...bottomConnections, ...finalConnections].forEach(conn => {
        if (conn.single) {
            drawSingleConnector(svg, conn.from[0], conn.to);
        } else {
            drawConnector(svg, conn.from, conn.to);
        }
    });
}

function drawConnector(svg, fromIds, toId) {
    const from1 = document.getElementById(fromIds[0]);
    const from2 = document.getElementById(fromIds[1]);
    const to = document.getElementById(toId);
    
    if (!from1 || !from2 || !to) return;
    
    const svgRect = svg.getBoundingClientRect();
    const from1Rect = from1.getBoundingClientRect();
    const from2Rect = from2.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    const from1X = from1Rect.right - svgRect.left;
    const from1Y = from1Rect.top + from1Rect.height / 2 - svgRect.top;
    
    const from2X = from2Rect.right - svgRect.left;
    const from2Y = from2Rect.top + from2Rect.height / 2 - svgRect.top;
    
    const toX = toRect.left - svgRect.left;
    const toY = toRect.top + toRect.height / 2 - svgRect.top;
    
    const midY = (from1Y + from2Y) / 2;
    const connectorWidth = 30;
    const midX = from1X + connectorWidth;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    const pathData = `
        M ${from1X} ${from1Y}
        H ${midX - 8}
        C ${midX - 4} ${from1Y} ${midX} ${from1Y + (midY > from1Y ? 4 : -4)} ${midX} ${from1Y + (midY > from1Y ? 8 : -8)}
        V ${midY}
        
        M ${from2X} ${from2Y}
        H ${midX - 8}
        C ${midX - 4} ${from2Y} ${midX} ${from2Y + (midY > from2Y ? -4 : 4)} ${midX} ${from2Y + (midY > from2Y ? -8 : 8)}
        V ${midY}
        
        M ${midX} ${midY}
        H ${toX}
    `.trim().replace(/\s+/g, ' ');
    
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'bracket-connector-path');
    svg.appendChild(path);
}

function drawSingleConnector(svg, fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    
    if (!from || !to) return;
    
    const svgRect = svg.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    const fromX = fromRect.right - svgRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - svgRect.top;
    
    const toX = toRect.left - svgRect.left;
    const toY = toRect.top + toRect.height / 2 - svgRect.top;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = `M ${fromX} ${fromY} H ${toX}`;
    
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

// Group stage rendering (unchanged)
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
