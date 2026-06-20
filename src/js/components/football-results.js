import { fetchData } from '../utils/fetch-football.js';
import { renderMatchDay } from '../utils/render-match.js';

class FootballResults extends HTMLElement {
  async connectedCallback() {
    try {
      const data = await fetchData('results');
      this.innerHTML = data.map(day => renderMatchDay(day, { showScore: true })).join('')
        || '<p>No results yet.</p>';
    } catch {
      this.innerHTML = '<p>Unable to load results.</p>';
    }
  }
}

customElements.define('football-results', FootballResults);
