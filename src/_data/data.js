const EleventyFetch = require("@11ty/eleventy-fetch");
const { ROOT, crestPath, familyMemberFor } = require("../../football-utils");

const FETCH_OPTIONS = {
  type: "json",
  fetchOptions: {
    headers: { 'X-Auth-Token': process.env.API_KEY }
  }
};

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
