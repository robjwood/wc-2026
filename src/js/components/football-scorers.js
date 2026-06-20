import { fetchData } from '../utils/fetch-football.js';

class FootballScorers extends HTMLElement {
  async connectedCallback() {
    try {
      const data = await fetchData('scorers');
      const limit = this.hasAttribute('limit') ? parseInt(this.getAttribute('limit')) : Infinity;
      const scorers = data.slice(0, limit);
      if (!scorers.length) { this.textContent = 'No scorers yet.'; return; }

      const table  = this.querySelector('[data-template="table"]').content.cloneNode(true);
      const rowTpl = this.querySelector('[data-template="row"]');
      const tbody  = table.querySelector('tbody');

      for (const s of scorers) {
        const row = rowTpl.content.cloneNode(true);
        const img = row.querySelector('[data-field="crest"]');
        img.src = s.crest;
        img.alt = s.team;
        row.querySelector('[data-field="player"]').textContent  = s.player;
        row.querySelector('[data-field="goals"]').textContent   = s.goals;
        row.querySelector('[data-field="assists"]').textContent = s.assists;
        tbody.appendChild(row);
      }

      this.textContent = '';
      this.appendChild(table);
    } catch {
      this.textContent = 'Unable to load scorers.';
    }
  }
}

customElements.define('football-scorers', FootballScorers);
