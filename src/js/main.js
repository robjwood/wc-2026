const API = '/api/football';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchData(type) {
  const res = await fetch(`${API}?type=${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  return res.json();
}

function teamBlock(name, crest, familyMember) {
  if (name === 'TBC') return '';
  return `
    <div class="fixture__team-details">
      <img src="${esc(crest)}" alt="Flag of ${esc(name)}" width="24" height="18" class="crest" />
      <p>${esc(name)}</p>
    </div>
    <div class="family-lozenge">
      <img src="/images/family/${esc(familyMember.toLowerCase())}.svg" width="16" height="16" class="family-icon">
      <p class="family-member">${esc(familyMember)}</p>
    </div>`;
}

function renderFixtures(data) {
  if (!data.length) return '<p>No fixtures scheduled.</p>';

  return data.map(({ date, matches }) => `
    <section class="fixture flow">
      <h2>${esc(date)}</h2>
      <div class="fixture__grid">
        ${matches.map(m => `
          <div class="c-card">
            <div class="fixture__details">
              <div class="fixture__teams flow">
                <div class="fixture__home">
                  <div class="fixture__team">
                    ${teamBlock(m.homeTeam, m.homeTeamCrest, m.familyMemberHome)}
                  </div>
                </div>
                <div class="fixture__away">
                  <div class="fixture__team">
                    ${teamBlock(m.awayTeam, m.awayTeamCrest, m.familyMemberAway)}
                  </div>
                </div>
              </div>
              ${m.status === 'TIMED' ? `
                <div class="fixture__info flow">
                  <span class="fixture__stage">${esc(m.group)}</span>
                  <span class="fixture__time">${esc(m.time)}</span>
                </div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </section>`).join('');
}

function renderResults(data) {
  if (!data.length) return '<p>No results yet.</p>';

  return data.map(({ date, matches }) => `
    <section class="fixture flow">
      <h2>${esc(date)}</h2>
      <div class="fixture__grid">
        ${matches.map(m => `
          <div class="c-card">
            <div class="fixture__details results">
              <div class="fixture__teams flow">
                <div class="fixture__home">
                  <div class="fixture__team">
                    <div class="fixture__team-details">
                      <img src="${esc(m.homeTeamCrest)}" alt="Flag of ${esc(m.homeTeam)}" width="24" height="18" class="crest" />
                      <p>${esc(m.homeTeam)}</p>
                    </div>
                    <div class="family-lozenge">
                      <img src="/images/family/${esc(m.familyMemberHome.toLowerCase())}.svg" width="16" height="16" class="family-icon">
                      <p class="family-member">${esc(m.familyMemberHome)}</p>
                    </div>
                  </div>
                  <p class="fixture__score">${esc(m.scoreHomeTeam)}</p>
                </div>
                <div class="fixture__away">
                  <div class="fixture__team">
                    <div class="fixture__team-details">
                      <img src="${esc(m.awayTeamCrest)}" alt="Flag of ${esc(m.awayTeam)}" width="24" height="18" class="crest" />
                      <p>${esc(m.awayTeam)}</p>
                    </div>
                    <div class="family-lozenge">
                      <img src="/images/family/${esc(m.familyMemberAway.toLowerCase())}.svg" width="16" height="16" class="family-icon">
                      <p class="family-member">${esc(m.familyMemberAway)}</p>
                    </div>
                  </div>
                  <p class="fixture__score">${esc(m.scoreAwayTeam)}</p>
                </div>
              </div>
              <div class="fixture__info flow">
                <span class="fixture__stage">${esc(m.group)}</span>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </section>`).join('');
}

function renderStandings(data) {
  if (!data.length) return '<p>No standings available yet.</p>';

  return `
    <div class="standings__grid">
      ${data.map(standing => `
        <section class="standings flow">
          <h2>${esc(standing.group)}</h2>
          <table class="c-card group-table">
            <thead class="c-card__header">
              <tr>
                <th>Team</th>
                <th>Pld</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              ${standing.table.map(team => `
                <tr class="standings__team">
                  <th scope="row">
                    <div class="standings__team-details">
                      <div class="standings__team-wrapper">
                        <img src="${esc(team.crest)}" alt="Flag of ${esc(team.team)}" width="24" height="18" class="crest" />
                        <span>${esc(team.team)}</span>
                      </div>
                      <div class="standings__family-wrapper">
                        <div class="family-member">${esc(team.familyMember)}</div>
                      </div>
                    </div>
                  </th>
                  <td>${esc(team.playedGames)}</td>
                  <td>${esc(team.goalDifference)}</td>
                  <td>${esc(team.points)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </section>`).join('')}
    </div>`;
}

function renderScorers(data) {
  if (!data.length) return '<p>No scorers yet.</p>';

  return `
    <table class="c-card group-table">
      <thead class="c-card__header">
        <tr>
          <th>Name</th>
          <th>Goals</th>
          <th>Assists</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(s => `
          <tr>
            <td class="player__details">
              <img src="${esc(s.crest)}" alt="Flag of ${esc(s.team)}" width="24" height="18" class="crest" />
              <p>${esc(s.player)}</p>
            </td>
            <td><p>${esc(s.goals)}</p></td>
            <td><p>${esc(s.assists)}</p></td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

async function init(id, type, renderer) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = '<p class="loading">Loading…</p>';

  try {
    const data = await fetchData(type);
    el.innerHTML = renderer(data);
  } catch {
    el.innerHTML = '<p>Unable to load data.</p>';
  }
}

init('fixtures-root',  'fixtures',  renderFixtures);
init('results-root',   'results',   renderResults);
init('standings-root', 'standings', renderStandings);
init('scorers-root',   'scorers',   renderScorers);
