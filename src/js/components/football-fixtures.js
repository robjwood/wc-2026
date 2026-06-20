import { fetchData } from '../utils/fetch-football.js';
import { renderMatchDay } from '../utils/render-match.js';

class FootballFixtures extends HTMLElement {
  async connectedCallback() {
    try {
      const data = await fetchData('fixtures');
      const limit = this.hasAttribute('limit') ? parseInt(this.getAttribute('limit')) : Infinity;
      this.innerHTML = data.slice(0, limit).map(day => renderMatchDay(day, { showTime: true })).join('')
        || '<p>No fixtures scheduled.</p>';
    } catch {
      this.innerHTML = '<p>Unable to load fixtures.</p>';
    }
  }
}

customElements.define('football-fixtures', FootballFixtures);
