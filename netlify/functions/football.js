const { ROOT, crestPath, familyMemberFor } = require("../../football-utils");

const API_PATHS = {
  fixtures: '/matches?status=SCHEDULED',
  results:  '/matches?status=FINISHED',
  standings: '/standings',
  scorers:  '/scorers?limit=100',
};

function dateString(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).replace(/, /g, ' ');
}

function stageLabel(match) {
  const raw = match.stage === 'GROUP_STAGE' ? match.group : match.stage;
  return raw.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

const transformers = {
  fixtures(res) {
    return Object.entries(
      res.matches.reduce((acc, match) => {
        const homeTeam = match.homeTeam.name ?? 'TBC';
        const awayTeam = match.awayTeam.name ?? 'TBC';
        const key = dateString(match.utcDate);

        (acc[key] ??= []).push({
          date: key,
          group: stageLabel(match),
          homeTeam,
          awayTeam,
          homeTeamCrest: match.homeTeam.name ? crestPath(homeTeam) : '',
          awayTeamCrest: crestPath(awayTeam),
          time: new Date(match.utcDate).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/London'
          }),
          familyMemberHome: familyMemberFor(match.homeTeam.name),
          familyMemberAway: familyMemberFor(match.awayTeam.name),
          status: match.status,
        });

        return acc;
      }, {})
    ).map(([date, matches]) => ({ date, matches }));
  },

  results(res) {
    return Object.entries(
      res.matches.reduce((acc, match) => {
        const homeTeam = match.homeTeam.name ?? 'TBC';
        const awayTeam = match.awayTeam.name ?? 'TBC';
        const key = dateString(match.utcDate);

        (acc[key] ??= []).push({
          group: stageLabel(match),
          homeTeam,
          awayTeam,
          homeTeamCrest: crestPath(homeTeam),
          awayTeamCrest: crestPath(awayTeam),
          scoreHomeTeam: match.score.fullTime.home,
          scoreAwayTeam: match.score.fullTime.away,
          familyMemberHome: familyMemberFor(match.homeTeam.name),
          familyMemberAway: familyMemberFor(match.awayTeam.name),
          status: match.status,
        });

        return acc;
      }, {})
    )
      .map(([date, matches]) => ({ date, matches }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  standings(res) {
    return res.standings.map(standing => ({
      group: standing.group,
      table: standing.table.map(entry => ({
        position: entry.position,
        team: entry.team.name,
        shortName: entry.team.tla,
        crest: crestPath(entry.team.name),
        playedGames: entry.playedGames,
        won: entry.won,
        draw: entry.draw,
        lost: entry.lost,
        points: entry.points,
        goalsFor: entry.goalsFor,
        goalsAgainst: entry.goalsAgainst,
        goalDifference: entry.goalDifference,
        familyMember: familyMemberFor(entry.team.name),
      })),
    }));
  },

  scorers(res) {
    return res.scorers
      .map(scorer => ({
        player: scorer.player.lastName,
        crest: crestPath(scorer.team.name),
        team: scorer.team.name,
        goals: scorer.goals,
        assists: scorer.assists ?? 0,
      }))
      .sort((a, b) =>
        b.goals - a.goals ||
        b.assists - a.assists ||
        a.player.localeCompare(b.player)
      );
  },
};

exports.handler = async (event) => {
  const type = event.queryStringParameters?.type;

  if (!API_PATHS[type]) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid type parameter' }) };
  }

  try {
    const response = await fetch(`${ROOT}${API_PATHS[type]}`, {
      headers: { 'X-Auth-Token': process.env.API_KEY }
    });

    if (!response.ok) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      };
    }

    const data = transformers[type](await response.json());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
