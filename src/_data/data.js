const EleventyFetch = require("@11ty/eleventy-fetch");

const ROOT = "https://api.football-data.org/v4/competitions/WC";

const FETCH_OPTIONS = {
  type: "json",
  fetchOptions: {
    headers: { 'X-Auth-Token': process.env.API_KEY }
  }
};

const TEAM_ASSIGNMENTS = {
  'Ukraine':     'Rob',
  'Hungary':     'Rob',
  'Denmark':     'Anna',
  'Spain':       'Anna',
  'Poland':      'Grandad',
  'England':     'Grandad',
  'Slovenia':    'Erin',
  'Slovakia':    'Clare',
  'Italy':       'Clare',
  'Portugal':    'Ben',
  'Austria':     'Ben',
  'Albania':     'Evie',
  'Romania':     'Evie',
  'Croatia':     'Harry',
  'Netherlands': 'Oscar',
  'Serbia':      'Oscar',
  'Germany':     'Lola',
  'Belgium':     'Lola',
  'Georgia':     'Freddie',
  'Scotland':    'Freddie',
  'Switzerland': 'Jack',
  'France':      'Steve',
  'Turkey':      'Steve',
  'Czechia':     'Meg',
};

function crestPath(name) {
  return `/images/crests/${name.replace(/ /g, '-').toLowerCase()}.svg`;
}

function familyMemberFor(teamName) {
  return TEAM_ASSIGNMENTS[teamName] ?? 'Unknown';
}

async function safeFetch(url, options, fallback) {
  try {
    return await EleventyFetch(url, options);
  } catch {
    return fallback;
  }
}

module.exports = async function() {
  const teamsRes = await safeFetch(
    `${ROOT}/teams`,
    { ...FETCH_OPTIONS, duration: '1d' },
    { teams: [] }
  );

  const teams = teamsRes.teams.map(team => ({
    name: team.name,
    crest: crestPath(team.name),
    familyMember: familyMemberFor(team.name),
  }));

  const grouped = teams.reduce((acc, team) => {
    (acc[team.familyMember] ??= []).push(team);
    return acc;
  }, {});

  const allocatedTeams = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([familyMember, memberTeams]) => ({
      familyMember,
      teams: memberTeams.map(({ name, crest }) => ({ name, crest })),
    }));

  return { allocatedTeams };
};
