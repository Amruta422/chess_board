import { fail } from '@sveltejs/kit';
import { query, transaction } from '$lib/server/db.js';

const emptyData = {
  players: [],
  tournaments: [],
  tournamentPlayers: [],
  matches: [],
  rankings: []
};

function value(formData, key) {
  return String(formData.get(key) ?? '').trim();
}

function idValue(formData, key) {
  const id = Number(value(formData, key));
  return Number.isInteger(id) && id > 0 ? id : null;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

async function getRankings() {
  return query(`
    SELECT
      t.id AS tournament_id,
      t.name AS tournament_name,
      p.id AS player_id,
      p.name AS player_name,
      COUNT(m.id)::int AS wins,
      DENSE_RANK() OVER (
        PARTITION BY t.id
        ORDER BY COUNT(m.id) DESC, p.rating DESC, p.name ASC
      )::int AS place
    FROM tournaments t
    JOIN tournament_players tp ON tp.tournament_id = t.id
    JOIN players p ON p.id = tp.player_id
    LEFT JOIN matches m
      ON m.tournament_id = t.id
      AND m.winner_player_id = p.id
    GROUP BY t.id, t.name, p.id, p.name, p.rating
    ORDER BY t.name ASC, place ASC, p.name ASC
  `);
}

export async function load() {
  try {
    const [players, tournaments, tournamentPlayers, matches, rankings] = await Promise.all([
      query('SELECT id, name, email, rating FROM players ORDER BY name ASC'),
      query('SELECT id, name, location, starts_on FROM tournaments ORDER BY starts_on DESC, name ASC'),
      query(`
        SELECT tp.tournament_id, p.id AS player_id, p.name, p.rating
        FROM tournament_players tp
        JOIN players p ON p.id = tp.player_id
        ORDER BY p.name ASC
      `),
      query(`
        SELECT
          m.id,
          m.tournament_id,
          white.name AS white_player,
          black.name AS black_player,
          winner.name AS winner,
          m.played_at
        FROM matches m
        JOIN players white ON white.id = m.white_player_id
        JOIN players black ON black.id = m.black_player_id
        JOIN players winner ON winner.id = m.winner_player_id
        ORDER BY m.played_at DESC, m.id DESC
        LIMIT 40
      `),
      getRankings()
    ]);

    return { ...emptyData, players, tournaments, tournamentPlayers, matches, rankings, dbError: '' };
  } catch (error) {
    return { ...emptyData, dbError: error.message };
  }
}

export const actions = {
  createPlayer: async ({ request }) => {
    const formData = await request.formData();
    const name = value(formData, 'name');
    const email = value(formData, 'email') || null;
    const rating = Number(value(formData, 'rating') || 1200);

    if (!name || !Number.isInteger(rating)) {
      return fail(400, { message: 'Player name and rating are required.' });
    }

    await query('INSERT INTO players (name, email, rating) VALUES ($1, $2, $3)', [name, email, rating]);
    return { message: 'Player created.' };
  },

  updatePlayer: async ({ request }) => {
    const formData = await request.formData();
    const id = idValue(formData, 'id');
    const name = value(formData, 'name');
    const email = value(formData, 'email') || null;
    const rating = Number(value(formData, 'rating'));

    if (!id || !name || !Number.isInteger(rating)) {
      return fail(400, { message: 'Player id, name, and rating are required.' });
    }

    await query('UPDATE players SET name = $1, email = $2, rating = $3 WHERE id = $4', [name, email, rating, id]);
    return { message: 'Player updated.' };
  },

  deletePlayer: async ({ request }) => {
    const formData = await request.formData();
    const id = idValue(formData, 'id');
    if (!id) return fail(400, { message: 'Player id is required.' });

    await query('DELETE FROM players WHERE id = $1', [id]);
    return { message: 'Player deleted.' };
  },

  createTournament: async ({ request }) => {
    const formData = await request.formData();
    const name = value(formData, 'name');
    const location = value(formData, 'location') || null;
    const startsOn = value(formData, 'starts_on');

    if (!name || !startsOn) {
      return fail(400, { message: 'Tournament name and date are required.' });
    }

    await query('INSERT INTO tournaments (name, location, starts_on) VALUES ($1, $2, $3)', [name, location, startsOn]);
    return { message: 'Tournament created.' };
  },

  updateTournament: async ({ request }) => {
    const formData = await request.formData();
    const id = idValue(formData, 'id');
    const name = value(formData, 'name');
    const location = value(formData, 'location') || null;
    const startsOn = value(formData, 'starts_on');

    if (!id || !name || !startsOn) {
      return fail(400, { message: 'Tournament id, name, and date are required.' });
    }

    await query('UPDATE tournaments SET name = $1, location = $2, starts_on = $3 WHERE id = $4', [
      name,
      location,
      startsOn,
      id
    ]);
    return { message: 'Tournament updated.' };
  },

  deleteTournament: async ({ request }) => {
    const formData = await request.formData();
    const id = idValue(formData, 'id');
    if (!id) return fail(400, { message: 'Tournament id is required.' });

    await query('DELETE FROM tournaments WHERE id = $1', [id]);
    return { message: 'Tournament deleted.' };
  },

  addPlayerToTournament: async ({ request }) => {
    const formData = await request.formData();
    const tournamentId = idValue(formData, 'tournament_id');
    const playerId = idValue(formData, 'player_id');

    if (!tournamentId || !playerId) {
      return fail(400, { message: 'Choose a tournament and player.' });
    }

    await query(
      'INSERT INTO tournament_players (tournament_id, player_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [tournamentId, playerId]
    );
    return { message: 'Player added to tournament.' };
  },

  removePlayerFromTournament: async ({ request }) => {
    const formData = await request.formData();
    const tournamentId = idValue(formData, 'tournament_id');
    const playerId = idValue(formData, 'player_id');

    if (!tournamentId || !playerId) {
      return fail(400, { message: 'Tournament and player are required.' });
    }

    await query('DELETE FROM tournament_players WHERE tournament_id = $1 AND player_id = $2', [
      tournamentId,
      playerId
    ]);
    return { message: 'Player removed from tournament.' };
  },

  runRandomMatches: async ({ request }) => {
    const formData = await request.formData();
    const tournamentId = idValue(formData, 'tournament_id');
    if (!tournamentId) return fail(400, { message: 'Tournament id is required.' });

    const created = await transaction(async (client) => {
      const { rows: players } = await client.query(
        'SELECT player_id FROM tournament_players WHERE tournament_id = $1 ORDER BY player_id ASC',
        [tournamentId]
      );

      if (players.length < 2) {
        throw new Error('Add at least two players before creating matches.');
      }

      const randomized = shuffle(players.map((player) => player.player_id));
      const pairs = [];

      for (let index = 0; index + 1 < randomized.length; index += 2) {
        const whitePlayerId = randomized[index];
        const blackPlayerId = randomized[index + 1];
        const winnerPlayerId = Math.random() >= 0.5 ? whitePlayerId : blackPlayerId;
        pairs.push([tournamentId, whitePlayerId, blackPlayerId, winnerPlayerId]);
      }

      for (const pair of pairs) {
        await client.query(
          'INSERT INTO matches (tournament_id, white_player_id, black_player_id, winner_player_id) VALUES ($1, $2, $3, $4)',
          pair
        );
      }

      return pairs.length;
    });

    return { message: `${created} random match${created === 1 ? '' : 'es'} recorded.` };
  }
};
