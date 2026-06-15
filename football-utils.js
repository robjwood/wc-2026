const TEAM_ASSIGNMENTS = require("./team-assignments");

const ROOT = "https://api.football-data.org/v4/competitions/WC";

function crestPath(name) {
  return `/images/crests/${name.replace(/ /g, '-').toLowerCase()}.svg`;
}

function familyMemberFor(teamName) {
  return TEAM_ASSIGNMENTS[teamName] ?? 'Unknown';
}

module.exports = { ROOT, crestPath, familyMemberFor };
