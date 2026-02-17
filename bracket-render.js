// ============================================
// BRACKET RENDER - v3
// Group stage: table row cards
// Knockout: mini-cards with round-colored borders
// ============================================

// Round border colors for knockout mini-cards
const ROUND_COLORS = {
    R32: '#3B82F6',   // Blue
    R16: '#10B981',   // Green
    QF:  '#F59E0B',   // Orange
    SF:  '#8B5CF6',   // Purple
    '3RD': '#6B7280', // Gray
    FINAL: '#F59E0B'  // Gold
};

// ============================================
// HELPER: Get scores from match object
// ============================================
function getMatchScores(match) {
    if (match.actualScore && match.actualScore.homeScore !== undefined) {
        return {
            homeScore: match.actualScore.homeScore,
            awayScore: match.actualScore.awayScore,
            homePenalty: match.actualScore.home_penalty ?? null,
            awayPenalty: match.actualScore.away_penalty ?? null,
            minute: match.actualScore.minute ?? null
        };
    }
    if (match.home_score !== undefined) {
        return {
            homeScore: match.home_score,
            awayScore: match.away_score,
            homePenalty: match.home_penalty ?? null,
            awayPenalty: match.away_penalty ?? null,
            minute: match.minute ?? null
        };
    }
    return { homeScore: null, awayScore: null, homePenalty: null, awayPenalty: null, minute: null };
}

// ============================================
// GROUP STAGE: Table Row Card
// Layout: [HOME_ABBR flag score min' score flag AWAY_ABBR] [date/time] [points]
// ============================================
function renderMatchRowCard(match) {
    const homeTeam = match.home || match.home_team || 'TBD';
    const awayTeam = match.away || match.away_team || 'TBD';
    const homeData = countries[homeTeam] || { flag: '🏴', color: '#f0f0f0' };
    const awayData = countries[awayTeam] || { flag: '🏴', color: '#f0f0f0' };

    const isFinished = match.status === 'finished';
    const scores = getMatchScores(match);
    const notOpen = match.status === 'not-open';

    // Determine winner/loser
    let homeWin = false, awayWin = false;
    if (isFinished && scores.homeScore !== null) {
        const hs = scores.homePenalty != null ? scores.homePenalty : scores.homeScore;
        const as = scores.awayPenalty != null ? scores.awayPenalty : scores.awayScore;
        homeWin = hs > as;
        awayWin = as > hs;
    }

    // Date/time
    const matchDate = match.date || (match.match_date ? new Date(match.match_date) : new Date());
    const dateStr = matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const timeStr = matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Score center section
    let centerHTML = '';
    if (isFinished && scores.homeScore !== null) {
        const minDisplay = scores.minute ? `${scores.minute}'` : 'FT';
        centerHTML = `
            <span class="row-score ${homeWin ? 'winner' : ''}">${scores.homeScore}</span>
            <span class="row-minute">${minDisplay}</span>
            <span class="row-score ${awayWin ? 'winner' : ''}">${scores.awayScore}</span>
        `;
    } else {
        centerHTML = `<span class="row-vs">vs</span>`;
    }

    // Points
    let pointsHTML = '';
    if (isFinished && match.userPrediction && match.points) {
        const total = (match.points.rank || 0) + (match.points.exactScore || 0) + (match.points.minute || 0);
        pointsHTML = `<div class="row-points">+${total}</div>`;
    } else if (isFinished && !match.userPrediction) {
        pointsHTML = `<div class="row-points zero">+0</div>`;
    } else if (match.userPrediction) {
        pointsHTML = `<div class="row-predicted">✓</div>`;
    }

    // Status class
    let statusClass = '';
    if (notOpen) statusClass = 'not-open';
    else if (isFinished) statusClass = 'finished';
    else if (match.userPrediction) statusClass = 'predicted';

    const card = document.createElement('div');
    card.className = `match-row-card ${statusClass}`;
    card.setAttribute('data-match-id', match.id);

    card.innerHTML = `
        <div class="row-match-content">
            <div class="row-team home ${homeWin ? 'winner' : ''} ${awayWin ? 'loser' : ''}">
                <span class="row-team-code">${typeof getCountryCode === 'function' ? getCountryCode(homeTeam) : homeTeam.substring(0,3).toUpperCase()}</span>
                <span class="row-team-flag" style="background: ${homeData.color}">${homeData.flag}</span>
            </div>
            <div class="row-center">
                ${centerHTML}
            </div>
            <div class="row-team away ${awayWin ? 'winner' : ''} ${homeWin ? 'loser' : ''}">
                <span class="row-team-flag" style="background: ${awayData.color}">${awayData.flag}</span>
                <span class="row-team-code">${typeof getCountryCode === 'function' ? getCountryCode(awayTeam) : awayTeam.substring(0,3).toUpperCase()}</span>
            </div>
        </div>
        <div class="row-meta">
            <span class="row-datetime">${dateStr} ${timeStr}</span>
            ${pointsHTML}
        </div>
    `;

    // Click handler
    if (!currentPlayer) {
        card.onclick = () => { alert('Vui lòng đăng nhập để dự đoán!'); openLoginModal(); };
    } else if (isFinished && match.actualScore) {
        card.onclick = () => openResultsModal(match);
    } else if (match.status === 'open' || (match.userPrediction && !isFinished)) {
        card.onclick = () => openModal(match);
    } else if (notOpen) {
        card.style.cursor = 'default';
    }

    return card;
}

// ============================================
// GROUP STAGE RENDERER
// ============================================
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
        const groupMatches = groups[groupName].sort((a, b) => {
            const aDate = a.date || new Date(a.match_date);
            const bDate = b.date || new Date(b.match_date);
            return aDate - bDate;
        });

        const groupCard = document.createElement('div');
        groupCard.className = 'compact-group-card';

        const title = document.createElement('div');
        title.className = 'compact-group-title';
        title.textContent = `Bảng ${groupName.replace(/^GROUP /i, '').replace(/^Bảng /i, '')}`;
        groupCard.appendChild(title);

        const matchesList = document.createElement('div');
        matchesList.className = 'compact-group-list';

        groupMatches.forEach(match => {
            matchesList.appendChild(renderMatchRowCard(match));
        });

        groupCard.appendChild(matchesList);
        container.appendChild(groupCard);
    });
}

// ============================================
// KNOCKOUT BRACKET - Mini cards with round colors
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
                ${renderBracketRound(rounds.R32, 'R32', 'Vòng 32', 'r32')}
                ${renderBracketRound(rounds.R16, 'R16', 'Vòng 16', 'r16')}
                ${renderBracketRound(rounds.QF, 'QF', 'Tứ kết', 'qf')}
                ${renderBracketRound(rounds.SF, 'SF', 'Bán kết', 'sf')}
                <div class="bracket-round final-round" data-round="final">
                    <div class="round-title" style="border-color: ${ROUND_COLORS.FINAL}">Chung kết</div>
                    <div class="round-matches">
                        ${rounds.FINAL.map(m => renderBracketMiniCard(m, 'FINAL')).join('')}
                        ${rounds['3RD'].map(m => renderBracketMiniCard(m, '3RD')).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    attachBracketMatchHandlers();

    // Draw connector lines after DOM is ready
    requestAnimationFrame(() => drawBracketConnectors());
}

function renderBracketRound(roundMatches, roundKey, title, dataRound) {
    if (roundMatches.length === 0) return '';

    // Group matches into pairs for bracket connector lines
    let matchesHTML = '';
    for (let i = 0; i < roundMatches.length; i += 2) {
        if (i + 1 < roundMatches.length) {
            matchesHTML += `
                <div class="bracket-pair">
                    ${renderBracketMiniCard(roundMatches[i], roundKey)}
                    ${renderBracketMiniCard(roundMatches[i + 1], roundKey)}
                </div>
            `;
        } else {
            // Odd match (no pair)
            matchesHTML += renderBracketMiniCard(roundMatches[i], roundKey);
        }
    }

    return `
        <div class="bracket-round" data-round="${dataRound}">
            <div class="round-title" style="border-color: ${ROUND_COLORS[roundKey]}">${title}</div>
            <div class="round-matches">
                ${matchesHTML}
            </div>
        </div>
    `;
}

function renderBracketMiniCard(match, roundKey) {
    const homeTeam = match.home || match.home_team || 'TBD';
    const awayTeam = match.away || match.away_team || 'TBD';

    if (!countries[homeTeam] || !countries[awayTeam]) return '';

    const homeData = countries[homeTeam];
    const awayData = countries[awayTeam];
    const isFinished = match.status === 'finished';
    const hasPrediction = match.userPrediction;
    const notOpen = match.status === 'not-open';
    const scores = getMatchScores(match);

    let homeIsLoser = false, awayIsLoser = false;
    if (isFinished && scores.homeScore !== null) {
        const hs = scores.homePenalty != null ? scores.homePenalty : scores.homeScore;
        const as = scores.awayPenalty != null ? scores.awayPenalty : scores.awayScore;
        homeIsLoser = hs < as;
        awayIsLoser = as < hs;
    }

    const dateStr = match.date ? match.date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' }) : '';
    const timeStr = match.date ? match.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

    const borderColor = ROUND_COLORS[roundKey] || '#46FF6F';
    const isFinal = roundKey === 'FINAL';
    const isThird = roundKey === '3RD';

    const classes = ['bracket-mini-card'];
    if (notOpen) classes.push('not-open');
    if (isFinal) classes.push('final-match');
    if (isThird) classes.push('third-match');
    if (hasPrediction && !isFinished) classes.push('predicted');

    // Points badge
    let badgeHTML = '';
    if (isFinished && hasPrediction && match.points) {
        const total = (match.points.rank || 0) + (match.points.exactScore || 0) + (match.points.minute || 0);
        badgeHTML = `<div class="bracket-mini-points">+${total}</div>`;
    } else if (hasPrediction && !isFinished) {
        badgeHTML = `<div class="bracket-mini-predicted">✓</div>`;
    }

    const homeCode = typeof getCountryCode === 'function' ? getCountryCode(homeTeam) : homeTeam.substring(0,3).toUpperCase();
    const awayCode = typeof getCountryCode === 'function' ? getCountryCode(awayTeam) : awayTeam.substring(0,3).toUpperCase();

    return `
        <div class="${classes.join(' ')}" data-match-id="${match.id}" style="border-top-color: ${borderColor}">
            <div class="bracket-mini-datetime">
                <span>${dateStr}</span>
                <span>${timeStr}</span>
            </div>
            <div class="bracket-mini-teams">
                <div class="bracket-mini-team ${homeIsLoser ? 'loser' : ''}">
                    <span class="bracket-mini-flag" style="background: ${homeData.color}">${homeData.flag}</span>
                    <span class="bracket-mini-code">${homeCode}</span>
                    ${isFinished && scores.homeScore !== null ? `<span class="bracket-mini-score">${scores.homeScore}</span>` : ''}
                </div>
                <div class="bracket-mini-team ${awayIsLoser ? 'loser' : ''}">
                    <span class="bracket-mini-flag" style="background: ${awayData.color}">${awayData.flag}</span>
                    <span class="bracket-mini-code">${awayCode}</span>
                    ${isFinished && scores.awayScore !== null ? `<span class="bracket-mini-score">${scores.awayScore}</span>` : ''}
                </div>
            </div>
            ${badgeHTML}
            ${isFinished && scores.homePenalty != null ? '<div class="bracket-mini-penalty">PEN</div>' : ''}
        </div>
    `;
}

function attachBracketMatchHandlers() {
    document.querySelectorAll('.bracket-mini-card').forEach(card => {
        const matchId = card.getAttribute('data-match-id');
        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        if (!currentPlayer) {
            card.onclick = () => { alert('Vui lòng đăng nhập để dự đoán!'); openLoginModal(); };
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
// BRACKET CONNECTOR LINES (SVG overlay)
// Shows which match winners advance to next round
// ============================================
function drawBracketConnectors() {
    const wrapper = document.querySelector('.bracket-wrapper');
    if (!wrapper) return;

    // Remove existing SVG
    const existing = wrapper.querySelector('.bracket-connectors');
    if (existing) existing.remove();

    // Ensure wrapper is positioned for absolute SVG
    wrapper.style.position = 'relative';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('bracket-connectors');
    svg.setAttribute('width', wrapper.scrollWidth);
    svg.setAttribute('height', wrapper.scrollHeight);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';

    // Round flow: R32→R16→QF→SF→FINAL
    const roundFlow = ['r32', 'r16', 'qf', 'sf'];

    for (let ri = 0; ri < roundFlow.length; ri++) {
        const currentRound = wrapper.querySelector(`.bracket-round[data-round="${roundFlow[ri]}"]`);
        if (!currentRound) continue;

        // Determine next round
        let nextRound;
        if (ri < roundFlow.length - 1) {
            nextRound = wrapper.querySelector(`.bracket-round[data-round="${roundFlow[ri + 1]}"]`);
        } else {
            // SF → final round (FINAL match only)
            nextRound = wrapper.querySelector(`.bracket-round[data-round="final"]`);
        }
        if (!nextRound) continue;

        // Get all pairs in current round
        const pairs = [...currentRound.querySelectorAll('.bracket-pair')];
        // Get target cards in next round (individual cards, not in pairs)
        const nextCards = [...nextRound.querySelectorAll('.bracket-mini-card:not(.third-match)')];

        pairs.forEach((pair, pairIdx) => {
            const cards = [...pair.querySelectorAll('.bracket-mini-card')];
            if (cards.length < 2) return;

            const target = nextCards[pairIdx];
            if (!target) return;

            const card1 = cards[0];
            const card2 = cards[1];

            // Get positions relative to wrapper
            const pos1 = getOffsetRelativeTo(card1, wrapper);
            const pos2 = getOffsetRelativeTo(card2, wrapper);
            const posT = getOffsetRelativeTo(target, wrapper);

            const y1 = pos1.top + pos1.height / 2;
            const y2 = pos2.top + pos2.height / 2;
            const x1 = pos1.left + pos1.width; // right edge of source cards
            const xT = posT.left;              // left edge of target
            const yT = posT.top + posT.height / 2;
            const xMid = (x1 + xT) / 2;

            // Determine connector color based on round
            const roundKey = roundFlow[ri].toUpperCase();
            const color = ROUND_COLORS[roundKey] || '#CBD5E1';
            const lineColor = hexToRgba(color, 0.35);

            // Draw bracket path:
            // card1 right → mid (horizontal)
            // card2 right → mid (horizontal)
            // mid y1 → y2 (vertical)
            // mid yT → target left (horizontal)
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', [
                `M ${x1} ${y1} H ${xMid}`,
                `M ${x1} ${y2} H ${xMid}`,
                `M ${xMid} ${y1} V ${y2}`,
                `M ${xMid} ${yT} H ${xT}`
            ].join(' '));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', lineColor);
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-linecap', 'round');

            svg.appendChild(path);
        });
    }

    wrapper.appendChild(svg);
}

// Helper: get element position relative to an ancestor
function getOffsetRelativeTo(el, ancestor) {
    const elRect = el.getBoundingClientRect();
    const aRect = ancestor.getBoundingClientRect();
    return {
        top: elRect.top - aRect.top,
        left: elRect.left - aRect.left,
        width: elRect.width,
        height: elRect.height
    };
}

// Helper: convert hex color to rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
