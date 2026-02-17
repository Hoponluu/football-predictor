// ============================================
// BRACKET RENDER - v4
// Group stage: table row cards (sorted by date)
// Knockout: mini-cards ordered by FIFA bracket position (match_number)
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
// FIFA World Cup 2026 Official Bracket Structure
// Defines bracket DISPLAY ORDER for each round.
// Matches are rendered in this order (top→bottom) so that
// consecutive pairs [0,1], [2,3]... connect to next round [0], [1]...
//
// Source: FIFA.com knockout stage match schedule
// ============================================
const FIFA_BRACKET = {
    // R32 bracket order (top to bottom on the bracket)
    // Pairs: (M74,M77)→M89, (M73,M75)→M90, (M76,M78)→M91, (M79,M80)→M92,
    //        (M83,M84)→M93, (M81,M82)→M94, (M86,M88)→M95, (M85,M87)→M96
    R32: [74, 77, 73, 75, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85, 87],
    // R16 bracket order
    // Pairs: (M89,M90)→M97, (M91,M92)→M99, (M93,M94)→M98, (M95,M96)→M100
    R16: [89, 90, 91, 92, 93, 94, 95, 96],
    // QF bracket order
    // Pairs: (M97,M99)→M101, (M98,M100)→M102
    QF: [97, 99, 98, 100],
    // SF bracket order
    SF: [101, 102],
    FINAL: [104],
    '3RD': [103]
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

// Helper: sort matches by FIFA bracket position
function sortByBracketPosition(matchesArr, bracketOrder) {
    if (!bracketOrder || bracketOrder.length === 0) return matchesArr;

    return matchesArr.sort((a, b) => {
        const aNum = a.match_number || 0;
        const bNum = b.match_number || 0;
        const aIdx = bracketOrder.indexOf(aNum);
        const bIdx = bracketOrder.indexOf(bNum);
        // Matches in bracket order first, unknown matches at the end (by date)
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return (a.date || 0) - (b.date || 0);
    });
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

    let homeWin = false, awayWin = false;
    if (isFinished && scores.homeScore !== null) {
        const hs = scores.homePenalty != null ? scores.homePenalty : scores.homeScore;
        const as = scores.awayPenalty != null ? scores.awayPenalty : scores.awayScore;
        homeWin = hs > as;
        awayWin = as > hs;
    }

    const matchDate = match.date || (match.match_date ? new Date(match.match_date) : new Date());
    const dateStr = matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const timeStr = matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

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

    let pointsHTML = '';
    if (isFinished && match.userPrediction && match.points) {
        const total = (match.points.rank || 0) + (match.points.exactScore || 0) + (match.points.minute || 0);
        pointsHTML = `<div class="row-points">+${total}</div>`;
    } else if (isFinished && !match.userPrediction) {
        pointsHTML = `<div class="row-points zero">+0</div>`;
    } else if (match.userPrediction) {
        pointsHTML = `<div class="row-predicted">✓</div>`;
    }

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
// GROUP STAGE RENDERER (sorted by date — chronological)
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
// KNOCKOUT BRACKET — sorted by FIFA bracket position (match_number)
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

    // Sort each round by FIFA bracket position (not date!)
    const rounds = {
        R32: sortByBracketPosition(
            knockoutMatches.filter(m => (m.group || m.match_group) === 'R32'),
            FIFA_BRACKET.R32
        ),
        R16: sortByBracketPosition(
            knockoutMatches.filter(m => (m.group || m.match_group) === 'R16'),
            FIFA_BRACKET.R16
        ),
        QF: sortByBracketPosition(
            knockoutMatches.filter(m => (m.group || m.match_group) === 'QF'),
            FIFA_BRACKET.QF
        ),
        SF: sortByBracketPosition(
            knockoutMatches.filter(m => (m.group || m.match_group) === 'SF'),
            FIFA_BRACKET.SF
        ),
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

    return `
        <div class="bracket-round" data-round="${dataRound}">
            <div class="round-title" style="border-color: ${ROUND_COLORS[roundKey]}">${title}</div>
            <div class="round-matches">
                ${roundMatches.map(m => renderBracketMiniCard(m, roundKey)).join('')}
            </div>
        </div>
    `;
}

// ============================================
// BRACKET MINI CARD — handles both real teams and TBD
// ============================================
function renderBracketMiniCard(match, roundKey) {
    const homeTeam = match.home || match.home_team || 'TBD';
    const awayTeam = match.away || match.away_team || 'TBD';

    const homeData = countries[homeTeam] || null;
    const awayData = countries[awayTeam] || null;
    const isTBD = !homeData || !awayData;

    const isFinished = match.status === 'finished';
    const hasPrediction = match.userPrediction;
    const notOpen = match.status === 'not-open';
    const scores = getMatchScores(match);
    const matchNum = match.match_number;

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
    if (isTBD) classes.push('tbd');
    if (isFinal) classes.push('final-match');
    if (isThird) classes.push('third-match');
    if (hasPrediction && !isFinished) classes.push('predicted');

    // Match number label
    const matchNumHTML = matchNum ? `<span class="bracket-mini-matchnum">M${matchNum}</span>` : '';

    // Points badge
    let badgeHTML = '';
    if (isFinished && hasPrediction && match.points) {
        const total = (match.points.rank || 0) + (match.points.exactScore || 0) + (match.points.minute || 0);
        badgeHTML = `<div class="bracket-mini-points">+${total}</div>`;
    } else if (hasPrediction && !isFinished) {
        badgeHTML = `<div class="bracket-mini-predicted">✓</div>`;
    }

    // Team display — handle TBD
    const homeFlag = homeData ? homeData.flag : '❓';
    const awayFlag = awayData ? awayData.flag : '❓';
    const homeBg = homeData ? homeData.color : '#E5E7EB';
    const awayBg = awayData ? awayData.color : '#E5E7EB';
    const homeCode = homeData
        ? (typeof getCountryCode === 'function' ? getCountryCode(homeTeam) : homeTeam.substring(0,3).toUpperCase())
        : homeTeam.substring(0, 6);
    const awayCode = awayData
        ? (typeof getCountryCode === 'function' ? getCountryCode(awayTeam) : awayTeam.substring(0,3).toUpperCase())
        : awayTeam.substring(0, 6);

    return `
        <div class="${classes.join(' ')}" data-match-id="${match.id}" style="border-top-color: ${borderColor}">
            <div class="bracket-mini-datetime">
                ${matchNumHTML}
                <span>${dateStr}</span>
                <span>${timeStr}</span>
            </div>
            <div class="bracket-mini-teams">
                <div class="bracket-mini-team ${homeIsLoser ? 'loser' : ''}">
                    <span class="bracket-mini-flag" style="background: ${homeBg}">${homeFlag}</span>
                    <span class="bracket-mini-code">${homeCode}</span>
                    ${isFinished && scores.homeScore !== null ? `<span class="bracket-mini-score">${scores.homeScore}</span>` : ''}
                </div>
                <div class="bracket-mini-team ${awayIsLoser ? 'loser' : ''}">
                    <span class="bracket-mini-flag" style="background: ${awayBg}">${awayFlag}</span>
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
// Pairs consecutive cards [0,1]→next[0], [2,3]→next[1]
// ============================================
function drawBracketConnectors() {
    const wrapper = document.querySelector('.bracket-wrapper');
    if (!wrapper) return;

    const existing = wrapper.querySelector('.bracket-connectors');
    if (existing) existing.remove();

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

    const roundFlow = ['r32', 'r16', 'qf', 'sf'];

    for (let ri = 0; ri < roundFlow.length; ri++) {
        const currentRound = wrapper.querySelector(`.bracket-round[data-round="${roundFlow[ri]}"]`);
        if (!currentRound) continue;

        let nextRound;
        if (ri < roundFlow.length - 1) {
            nextRound = wrapper.querySelector(`.bracket-round[data-round="${roundFlow[ri + 1]}"]`);
        } else {
            nextRound = wrapper.querySelector(`.bracket-round[data-round="final"]`);
        }
        if (!nextRound) continue;

        const currentCards = [...currentRound.querySelectorAll('.bracket-mini-card')];
        const nextCards = [...nextRound.querySelectorAll('.bracket-mini-card:not(.third-match)')];

        for (let i = 0; i < currentCards.length - 1; i += 2) {
            const card1 = currentCards[i];
            const card2 = currentCards[i + 1];
            const target = nextCards[Math.floor(i / 2)];
            if (!target) continue;

            const pos1 = getOffsetRelativeTo(card1, wrapper);
            const pos2 = getOffsetRelativeTo(card2, wrapper);
            const posT = getOffsetRelativeTo(target, wrapper);

            const y1 = pos1.top + pos1.height / 2;
            const y2 = pos2.top + pos2.height / 2;
            const x1 = pos1.left + pos1.width;
            const xT = posT.left;
            const yT = posT.top + posT.height / 2;
            const xMid = (x1 + xT) / 2;

            const roundKey = roundFlow[ri].toUpperCase();
            const color = ROUND_COLORS[roundKey] || '#CBD5E1';
            const lineColor = hexToRgba(color, 0.35);

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
        }
    }

    wrapper.appendChild(svg);
}

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

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
