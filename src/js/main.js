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

function teamBlock(name, crest, familyMember, reversed = false) {
  if (name === 'TBC') return '';
  const nameEl = `<p>${esc(name)}</p>`;
  const avatarEl = `<img src="/images/family/${esc(familyMember.toLowerCase())}.svg" width="16" height="16" class="family-icon">`;
  const memberEl = `<p class="family-member">${esc(familyMember)}</p>`;
  const lozengeEl = `
    <div class="family-lozenge">
      ${reversed ? memberEl + avatarEl : avatarEl + memberEl}
    </div>`;
  return nameEl + lozengeEl;
}

function renderFixtures(data) {
  if (!data.length) return '<p>No fixtures scheduled.</p>';

  return data.map(({ date, matches }) => `
    <section class="fixture">
      <div class="fixture__wrapper flow">
      <h2>${esc(date)}</h2>
      ${matches.map(m => `
        <div class="fixture__details">
          ${m.status === 'TIMED' ? `
            <div class="fixture__info text-shadow">
              <span class="fixture__stage">${esc(m.group)}</span>
              <span class="fixture__time">${esc(m.time)}</span>
            </div>` : ''}
          <div class="fixture__teams">
            <div class="fixture__home">
              ${teamBlock(m.homeTeam, m.homeTeamCrest, m.familyMemberHome, true)}
            </div>
            <span class="fixture__vs">v</span>
            <div class="fixture__away">
              ${teamBlock(m.awayTeam, m.awayTeamCrest, m.familyMemberAway)}
            </div>
          </div>
      </div>`).join('')}
      </div>
    </section>`).join('');
}

function renderResults(data) {
  if (!data.length) return '<p>No results yet.</p>';

  return data.map(({ date, matches }) => `
    <section class="fixture">
      <div class="fixture__wrapper flow">
        <h2>${esc(date)}</h2>
        ${matches.map(m => `
          <div class="fixture__details results">
            <div class="fixture__info text-shadow">
              <span class="fixture__stage">${esc(m.group)}</span>
            </div>
            <div class="fixture__teams">
              <div class="fixture__home">
                ${teamBlock(m.homeTeam, m.homeTeamCrest, m.familyMemberHome, true)}
              </div>
              <span class="fixture__vs">${esc(m.scoreHomeTeam)}–${esc(m.scoreAwayTeam)}</span>
              <div class="fixture__away">
                ${teamBlock(m.awayTeam, m.awayTeamCrest, m.familyMemberAway)}
              </div>
            </div>
          </div>`).join('')}
      </div>
    </section>`).join('');
}

function renderStandings(data) {
  if (!data.length) return '<p>No standings available yet.</p>';

  return `
    <div class="standings__grid flow">
      ${data.map(standing => `
        <section class="standings flow">
          <h2>${esc(standing.group)}</h2>
          <table class="c-card group-table">
            <thead class="c-card__header">
              <tr>
                <th>Team</th>
                <th>Pl</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>P</th>
              </tr>
            </thead>
            <tbody>
              ${standing.table.map(team => `
                <tr class="standings__team">
                  <th scope="row">
                    <div class="standings__team-details">
                      <div class="standings__team-wrapper">
                        <span>${esc(team.team)}</span>
                      </div>
                      <div class="standings__family-wrapper">
                        <div class="family-member">${esc(team.familyMember)}</div>
                      </div>
                    </div>
                  </th>
                  <td>${esc(team.playedGames)}</td>
                  <td></td>
                  <td></td>
                  <td></td>
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

init('fixtures-root',      'fixtures', renderFixtures);
init('results-root',       'results',  renderResults);
init('standings-root',     'standings', renderStandings);
init('scorers-root',       'scorers',  renderScorers);
init('home-fixtures-root', 'fixtures', data => renderFixtures(data.slice(0, 1)));
init('home-scorers-root',  'scorers',  data => renderScorers(data.slice(0, 5)));
