import { esc } from './esc.js';
import { teamBlock } from './team-block.js';

export function renderMatchDay({ date, matches }, { showTime = false, showScore = false } = {}) {
  const detailsClass = showScore ? 'fixture__details results' : 'fixture__details';

  return `
    <section class="fixture">
      <div class="fixture__wrapper flow">
        <h2>${esc(date)}</h2>
        ${matches.map(m => `
          <div class="${detailsClass}">
            ${showScore || (showTime && m.status === 'TIMED') ? `
              <div class="fixture__info text-shadow">
                <span class="fixture__stage">${esc(m.group)}</span>
                ${showTime && m.status === 'TIMED' ? `<span class="fixture__time">${esc(m.time)}</span>` : ''}
              </div>` : ''}
            <div class="fixture__teams">
              <div class="fixture__home">
                ${teamBlock(m.homeTeam, m.homeTeamCrest, m.familyMemberHome, true)}
              </div>
              <span class="fixture__vs">
                ${showScore ? `${esc(m.scoreHomeTeam)}–${esc(m.scoreAwayTeam)}` : 'v'}
              </span>
              <div class="fixture__away">
                ${teamBlock(m.awayTeam, m.awayTeamCrest, m.familyMemberAway)}
              </div>
            </div>
          </div>`).join('')}
      </div>
    </section>`;
}
