// ============================================
// BRACKET RENDER - v4
// Group stage: table row cards (sorted by date)
// Knockout: mini-cards ordered by FIFA bracket position (match_number)
// ============================================

// Round border colors for knockout mini-cards
// Timezone constant — all display and input uses GMT+7 (Vietnam)
const TZ_VIETNAM = 'Asia/Ho_Chi_Minh';

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
    // TOP HALF:  (M74,M77)→M89, (M73,M75)→M90, (M83,M84)→M93, (M81,M82)→M94
    // BOT HALF:  (M76,M78)→M91, (M79,M80)→M92, (M86,M88)→M95, (M85,M87)→M96
    R32: [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87],
    // R16 bracket order
    // TOP HALF:  (M89,M90)→M97, (M93,M94)→M98
    // BOT HALF:  (M91,M92)→M99, (M95,M96)→M100
    R16: [89, 90, 93, 94, 91, 92, 95, 96],
    // QF bracket order
    // (M97,M98)→M101, (M99,M100)→M102
    QF: [97, 98, 99, 100],
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
    const notOpen = match.status === 'not-open' || match.status === 'closed';

    let homeWin = false, awayWin = false;
    if (isFinished && scores.homeScore !== null) {
        const hs = scores.homePenalty != null ? scores.homePenalty : scores.homeScore;
        const as = scores.awayPenalty != null ? scores.awayPenalty : scores.awayScore;
        homeWin = hs > as;
        awayWin = as > hs;
    }

    const matchDate = match.date || (match.match_date ? new Date(match.match_date) : new Date());
    const dateStr = matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', timeZone: TZ_VIETNAM });
    const timeStr = matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: TZ_VIETNAM });

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
    } else if (match.status === 'closed') {
        card.style.cursor = 'default';
    } else if (match.status === 'open' || (match.userPrediction && !isFinished)) {
        card.onclick = () => openModal(match);
    } else if (notOpen) {
        card.style.cursor = 'default';
    }

    return card;
}

// ============================================
// GROUP STANDINGS — calculate from match results
// FIFA World Cup rules: Pts (W=3,D=1,L=0) → GD → GF → H2H
// ============================================
function calculateGroupStandings(groupMatches) {
    const teams = {};

    groupMatches.forEach(match => {
        const home = match.home || match.home_team;
        const away = match.away || match.away_team;
        if (!home || !away) return;

        if (!teams[home]) teams[home] = { name: home, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
        if (!teams[away]) teams[away] = { name: away, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };

        if (match.status !== 'finished' || !match.actualScore) return;

        const hs = match.actualScore.homeScore;
        const as = match.actualScore.awayScore;
        if (hs === null || hs === undefined) return;

        teams[home].mp++; teams[away].mp++;
        teams[home].gf += hs; teams[home].ga += as;
        teams[away].gf += as; teams[away].ga += hs;

        if (hs > as) { teams[home].w++; teams[away].l++; }
        else if (hs < as) { teams[away].w++; teams[home].l++; }
        else { teams[home].d++; teams[away].d++; }
    });

    const result = Object.values(teams)
        .map(t => ({ ...t, pts: t.w * 3 + t.d, gd: t.gf - t.ga }));

    const hasPlayed = result.some(t => t.mp > 0);
    if (hasPlayed) {
        result.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    } else {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
}

function renderStandingsTableV2(standings, groupLabel) {
    if (standings.length === 0) return '';

    const rows = standings.map((t, i) => {
        const flag = (typeof countries !== 'undefined' && countries[t.name]?.flag) || '';
        const teamName = t.name;
        const isQualify = i < 2;
        const rowClass = isQualify ? 'qualify-row-v2' : '';
        const qualifyBar = isQualify ? '<span class="standings-qualify-bar"></span>' : '';

        return `<tr class="${rowClass}">
            <td>
                <div class="standings-team-cell">
                    ${qualifyBar}
                    <span class="standings-team-rank">${i + 1}</span>
                    <span class="standings-team-flag">${flag}</span>
                    <span class="standings-team-name">${teamName}</span>
                </div>
            </td>
            <td>${t.mp}</td>
            <td>${t.w}</td>
            <td>${t.d}</td>
            <td>${t.l}</td>
            <td>${t.gf}</td>
            <td>${t.ga}</td>
            <td style="font-weight:600;color:${t.gd > 0 ? '#059669' : t.gd < 0 ? '#DC2626' : '#6B7280'}">${t.gd > 0 ? '+' : ''}${t.gd}</td>
            <td class="standings-pts-cell">${t.pts}</td>
        </tr>`;
    }).join('');

    return `<div class="standings-card-v2">
        <div class="standings-header-bar">
            <span class="standings-header-title">Bảng ${groupLabel}</span>
        </div>
        <div style="overflow-x:auto;">
            <table class="standings-table-v2">
                <thead><tr>
                    <th>Đội</th><th>Trận</th><th>Thắng</th><th>Hoà</th><th>Thua</th>
                    <th>BT</th><th>BB</th><th>+/-</th><th>Điểm</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        <div class="standings-legend">
            <span><strong>BT:</strong> Bàn thắng</span>
            <span><strong>BB:</strong> Bàn bại</span>
            <span><strong>+/-:</strong> Hiệu số</span>
        </div>
    </div>`;
}

// ============================================
// GROUP STAGE RENDERER (sorted by date — chronological)
// ============================================
function getGroupStageData() {
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

    return groups;
}

var standingsPageIndex = 0;
var standingsGroupKeys = [];
var standingsGroupData = {};

function getStandingsPerPage() {
    return window.innerWidth > 768 ? 2 : 1;
}

function getStandingsTotalPages() {
    const perPage = getStandingsPerPage();
    return Math.ceil(standingsGroupKeys.length / perPage);
}

function renderGroupStandings() {
    const container = document.getElementById('scheduleGroupStandings');
    if (!container) return;

    const groups = getGroupStageData();
    standingsGroupKeys = Object.keys(groups).sort();
    standingsGroupData = {};

    standingsGroupKeys.forEach(groupName => {
        const groupMatches = groups[groupName];
        const standings = calculateGroupStandings(groupMatches);
        const label = groupName.replace(/^GROUP /i, '').replace(/^Bảng /i, '');
        standingsGroupData[groupName] = { standings, label };
    });

    if (standingsGroupKeys.length === 0) {
        container.innerHTML = '';
        return;
    }

    const totalPages = getStandingsTotalPages();
    if (standingsPageIndex >= totalPages) standingsPageIndex = 0;

    renderStandingsCarouselPage(container);
    renderThirdPlaceComparison();
}

function renderStandingsCarouselPage(container) {
    if (!container) container = document.getElementById('scheduleGroupStandings');
    if (!container || standingsGroupKeys.length === 0) return;

    const perPage = getStandingsPerPage();
    const totalPages = getStandingsTotalPages();
    const startIdx = standingsPageIndex * perPage;
    const pageKeys = standingsGroupKeys.slice(startIdx, startIdx + perPage);

    const tablesHTML = pageKeys.map(key => {
        const { standings, label } = standingsGroupData[key];
        return renderStandingsTableV2(standings, label);
    }).join('');

    const dots = Array.from({ length: totalPages }, (_, i) => {
        const active = i === standingsPageIndex ? 'active' : '';
        return `<span class="standings-nav-dot ${active}" onclick="goToStandingsPage(${i})"></span>`;
    }).join('');

    container.innerHTML = `
        <div class="standings-carousel-grid">${tablesHTML}</div>
        <div class="standings-nav">
            <button class="standings-nav-btn" onclick="prevStandingsPage()">&#8249;</button>
            <div class="standings-nav-dots">${dots}</div>
            <button class="standings-nav-btn" onclick="nextStandingsPage()">&#8250;</button>
        </div>
    `;
}

function prevStandingsPage() {
    const totalPages = getStandingsTotalPages();
    standingsPageIndex = (standingsPageIndex - 1 + totalPages) % totalPages;
    renderStandingsCarouselPage();
}

function nextStandingsPage() {
    const totalPages = getStandingsTotalPages();
    standingsPageIndex = (standingsPageIndex + 1) % totalPages;
    renderStandingsCarouselPage();
}

function goToStandingsPage(idx) {
    standingsPageIndex = idx;
    renderStandingsCarouselPage();
}

function renderScheduleGroupStageOnly() {
    const container = document.getElementById('scheduleGroupStage');
    if (!container) return;

    container.innerHTML = '';
    const groups = getGroupStageData();

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
    const notOpen = match.status === 'not-open' || match.status === 'closed';
    const scores = getMatchScores(match);
    const matchNum = match.match_number;

    let homeIsLoser = false, awayIsLoser = false;
    if (isFinished && scores.homeScore !== null) {
        const hs = scores.homePenalty != null ? scores.homePenalty : scores.homeScore;
        const as = scores.awayPenalty != null ? scores.awayPenalty : scores.awayScore;
        homeIsLoser = hs < as;
        awayIsLoser = as < hs;
    }

    const dateStr = match.date ? match.date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', timeZone: TZ_VIETNAM }) : '';
    const timeStr = match.date ? match.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: TZ_VIETNAM }) : '';

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

// ============================================
// 3RD PLACE COMPARISON TABLE
// World Cup 2026: 8 best 3rd-placed teams advance to R32
// ============================================
function renderThirdPlaceComparison() {
    const container = document.getElementById('thirdPlaceComparison');
    if (!container || !standingsGroupData || standingsGroupKeys.length === 0) {
        if (container) container.innerHTML = '';
        return;
    }

    const thirdPlaceTeams = [];
    standingsGroupKeys.forEach(groupName => {
        const { standings, label } = standingsGroupData[groupName];
        if (standings.length >= 3) {
            const team = standings[2];
            thirdPlaceTeams.push({ ...team, group: label });
        }
    });

    if (thirdPlaceTeams.length === 0) {
        container.innerHTML = '';
        return;
    }

    const hasPlayed = thirdPlaceTeams.some(t => t.mp > 0);
    if (hasPlayed) {
        thirdPlaceTeams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    } else {
        thirdPlaceTeams.sort((a, b) => a.group.localeCompare(b.group));
    }

    const qualifyCount = 8;

    const rows = thirdPlaceTeams.map((t, i) => {
        const flag = (typeof countries !== 'undefined' && countries[t.name]?.flag) || '';
        const isQualify = hasPlayed && i < qualifyCount;
        const rowClass = isQualify ? 'third-qualify' : '';

        return `<tr class="${rowClass}">
            <td style="text-align:center;font-weight:600;font-size:12px;color:var(--text-tertiary);">${i + 1}</td>
            <td>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="font-size:14px;">${flag}</span>
                    <span style="font-weight:600;font-size:13px;">${t.name}</span>
                    <span style="font-size:10px;color:var(--text-tertiary);background:var(--bg);padding:1px 5px;border-radius:4px;">${t.group}</span>
                </div>
            </td>
            <td style="text-align:center;">${t.mp}</td>
            <td style="text-align:center;">${t.w}</td>
            <td style="text-align:center;">${t.d}</td>
            <td style="text-align:center;">${t.l}</td>
            <td style="text-align:center;">${t.gf}:${t.ga}</td>
            <td style="text-align:center;font-weight:600;color:${t.gd > 0 ? '#059669' : t.gd < 0 ? '#DC2626' : '#6B7280'}">${t.gd > 0 ? '+' : ''}${t.gd}</td>
            <td style="text-align:center;font-weight:700;">${t.pts}</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <div style="background:var(--surface);border-radius:var(--border-radius);border:1px solid var(--stroke);overflow:hidden;">
            <div style="padding:12px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--stroke);">
                <span style="font-size:16px;">🔄</span>
                <span style="font-weight:700;font-size:14px;color:var(--text-primary);">SO SÁNH CÁC ĐỘI HẠNG 3</span>
                <span style="font-size:11px;color:var(--text-tertiary);margin-left:auto;">Top 8 đi tiếp</span>
            </div>
            <div style="overflow-x:auto;">
                <table class="third-place-table">
                    <thead>
                        <tr>
                            <th style="width:30px;">#</th>
                            <th>Đội</th>
                            <th>T</th>
                            <th>Th</th>
                            <th>H</th>
                            <th>B</th>
                            <th>BT</th>
                            <th>HS</th>
                            <th>Đ</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}
