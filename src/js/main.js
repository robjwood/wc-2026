import './components/family-member.js';
import './components/football-fixtures.js';
import './components/football-results.js';
import './components/football-standings.js';
import './components/football-scorers.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
