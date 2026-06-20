import { fetchData } from '../utils/fetch-football.js';

class FootballStandings extends HTMLElement {
  async connectedCallback() {
    try {
      const data = await fetchData('standings');
      if (!data.length) { this.textContent = 'No standings available yet.'; return; }

      const groupTpl = this.querySelector('[data-template="group"]');
      const rowTpl   = this.querySelector('[data-template="row"]');
      const wrapper  = document.createElement('div');
      wrapper.className = 'standings__grid flow';

      for (const standing of data) {
        const group = groupTpl.content.cloneNode(true);
        group.querySelector('[data-field="group"]').textContent = standing.group;
        const tbody = group.querySelector('tbody');

        for (const team of standing.table) {
          const row = rowTpl.content.cloneNode(true);
          row.querySelector('[data-field="team"]').textContent             = team.team;
          row.querySelector('[data-field="crest"]').src                  = team.crest;
          row.querySelector('[data-field="familyMember"]').setAttribute('name', team.familyMember);
          row.querySelector('[data-field="playedGames"]').textContent    = team.playedGames;
          row.querySelector('[data-field="goalDifference"]').textContent = team.goalDifference;
          row.querySelector('[data-field="points"]').textContent         = team.points;
          tbody.appendChild(row);
        }

        wrapper.appendChild(group);
      }

      this.textContent = '';
      this.appendChild(wrapper);
    } catch {
      this.textContent = 'Unable to load standings.';
    }
  }
}

customElements.define('football-standings', FootballStandings);
