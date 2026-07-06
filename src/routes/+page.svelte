<script>
  export let data;
  export let form;

  const today = new Date().toISOString().slice(0, 10);

  $: playersByTournament = data.tournamentPlayers.reduce((groups, player) => {
    groups[player.tournament_id] = [...(groups[player.tournament_id] ?? []), player];
    return groups;
  }, {});

  $: rankingsByTournament = data.rankings.reduce((groups, row) => {
    groups[row.tournament_id] = [...(groups[row.tournament_id] ?? []), row].filter((rank) => rank.place <= 3);
    return groups;
  }, {});

  $: matchesByTournament = data.matches.reduce((groups, match) => {
    groups[match.tournament_id] = [...(groups[match.tournament_id] ?? []), match];
    return groups;
  }, {});
</script>

<svelte:head>
  <title>Chess Tournament Manager</title>
</svelte:head>

<main class="shell">
  <section class="masthead">
    <div>
      <p class="eyebrow">SQL backed SvelteKit app</p>
      <h1>Chess Tournament Manager</h1>
      <p class="lede">Create players, build tournaments, pair random matches, and review the top three finishers.</p>
    </div>
    <div class="board-mark" aria-hidden="true">
      <span>CHESS</span>
    </div>
  </section>

  {#if data.dbError}
    <section class="notice danger">
      Database connection failed: {data.dbError}
    </section>
  {/if}

  {#if form?.message}
    <section class="notice success">{form.message}</section>
  {/if}

  <section class="workspace">
    <div class="panel">
      <div class="section-title">
        <h2>Players</h2>
        <span>{data.players.length} total</span>
      </div>

      <form method="POST" action="?/createPlayer" class="form-grid">
        <label>
          Name
          <input name="name" placeholder="Magnus Carlsen" required />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="player@example.com" />
        </label>
        <label>
          Rating
          <input name="rating" type="number" min="100" max="4000" value="1200" required />
        </label>
        <button type="submit">Add Player</button>
      </form>

      <div class="list">
        {#each data.players as player}
          <article class="row">
            <form method="POST" action="?/updatePlayer" class="edit-row">
              <input type="hidden" name="id" value={player.id} />
              <input name="name" value={player.name} aria-label="Player name" required />
              <input name="email" type="email" value={player.email ?? ''} aria-label="Player email" />
              <input name="rating" type="number" min="100" max="4000" value={player.rating} aria-label="Rating" required />
              <button type="submit">Save</button>
            </form>
            <form method="POST" action="?/deletePlayer">
              <input type="hidden" name="id" value={player.id} />
              <button type="submit" class="ghost">Delete</button>
            </form>
          </article>
        {:else}
          <p class="empty">No players yet.</p>
        {/each}
      </div>
    </div>

    <div class="panel">
      <div class="section-title">
        <h2>Tournaments</h2>
        <span>{data.tournaments.length} total</span>
      </div>

      <form method="POST" action="?/createTournament" class="form-grid tournament-form">
        <label>
          Name
          <input name="name" placeholder="City Open" required />
        </label>
        <label>
          Location
          <input name="location" placeholder="Hyderabad" />
        </label>
        <label>
          Date
          <input name="starts_on" type="date" value={today} required />
        </label>
        <button type="submit">Add Tournament</button>
      </form>

      <div class="tournament-list">
        {#each data.tournaments as tournament}
          <article class="tournament">
            <div class="tournament-head">
              <form method="POST" action="?/updateTournament" class="edit-row tournament-edit">
                <input type="hidden" name="id" value={tournament.id} />
                <input name="name" value={tournament.name} aria-label="Tournament name" required />
                <input name="location" value={tournament.location ?? ''} aria-label="Tournament location" />
                <input name="starts_on" type="date" value={tournament.starts_on} aria-label="Tournament date" required />
                <button type="submit">Save</button>
              </form>
              <form method="POST" action="?/deleteTournament">
                <input type="hidden" name="id" value={tournament.id} />
                <button type="submit" class="ghost">Delete</button>
              </form>
            </div>

            <div class="tournament-tools">
              <form method="POST" action="?/addPlayerToTournament" class="inline-form">
                <input type="hidden" name="tournament_id" value={tournament.id} />
                <select name="player_id" required aria-label="Player">
                  <option value="">Choose player</option>
                  {#each data.players as player}
                    <option value={player.id}>{player.name}</option>
                  {/each}
                </select>
                <button type="submit">Add</button>
              </form>

              <form method="POST" action="?/runRandomMatches">
                <input type="hidden" name="tournament_id" value={tournament.id} />
                <button type="submit" class="accent">Run Random Matches</button>
              </form>
            </div>

            <div class="columns">
              <div>
                <h3>Players</h3>
                <div class="chips">
                  {#each playersByTournament[tournament.id] ?? [] as player}
                    <form method="POST" action="?/removePlayerFromTournament" class="chip">
                      <input type="hidden" name="tournament_id" value={tournament.id} />
                      <input type="hidden" name="player_id" value={player.player_id} />
                      <span>{player.name} ({player.rating})</span>
                      <button type="submit" aria-label={`Remove ${player.name}`}>x</button>
                    </form>
                  {:else}
                    <p class="empty">No players assigned.</p>
                  {/each}
                </div>
              </div>

              <div>
                <h3>Top 3</h3>
                <ol class="ranking">
                  {#each rankingsByTournament[tournament.id] ?? [] as rank}
                    <li><strong>{rank.place}</strong> {rank.player_name} <span>{rank.wins} wins</span></li>
                  {:else}
                    <li class="empty">Run matches to rank players.</li>
                  {/each}
                </ol>
              </div>
            </div>

            <div>
              <h3>Recent Matches</h3>
              <div class="match-list">
                {#each matchesByTournament[tournament.id] ?? [] as match}
                  <p>{match.white_player} vs {match.black_player} <strong>{match.winner}</strong></p>
                {:else}
                  <p class="empty">No matches recorded.</p>
                {/each}
              </div>
            </div>
          </article>
        {:else}
          <p class="empty">No tournaments yet.</p>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #17201a;
    background: #f5f6f1;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    min-height: 42px;
    border: 0;
    border-radius: 6px;
    padding: 0.7rem 0.95rem;
    color: #ffffff;
    background: #24543b;
    cursor: pointer;
    white-space: nowrap;
  }

  button:hover {
    background: #1b4230;
  }

  button.ghost {
    color: #8b2f2f;
    background: #f4dddd;
  }

  button.ghost:hover {
    background: #ecc9c9;
  }

  button.accent {
    background: #3653a4;
  }

  button.accent:hover {
    background: #2b4386;
  }

  input,
  select {
    width: 100%;
    min-height: 42px;
    border: 1px solid #c9d0c2;
    border-radius: 6px;
    padding: 0.62rem 0.72rem;
    background: #ffffff;
    color: #17201a;
  }

  label {
    display: grid;
    gap: 0.35rem;
    color: #475148;
    font-size: 0.88rem;
    font-weight: 700;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  .shell {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 28px 0 48px;
  }

  .masthead {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 28px;
    align-items: stretch;
    min-height: 210px;
    margin-bottom: 22px;
    padding: 30px;
    color: #ffffff;
    background:
      linear-gradient(135deg, rgba(22, 33, 27, 0.92), rgba(33, 71, 56, 0.86)),
      repeating-conic-gradient(#e6e2cf 0 25%, #2a352e 0 50%) 50% / 56px 56px;
    border-radius: 8px;
    overflow: hidden;
  }

  .eyebrow {
    margin-bottom: 0.7rem;
    color: #d8eeb6;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  h1 {
    max-width: 780px;
    font-size: clamp(2.1rem, 5vw, 4.6rem);
    line-height: 1;
    letter-spacing: 0;
  }

  .lede {
    max-width: 680px;
    margin-top: 1rem;
    color: #eef3e5;
    font-size: 1.08rem;
    line-height: 1.6;
  }

  .board-mark {
    display: grid;
    place-items: center;
    min-height: 150px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.14), transparent),
      repeating-conic-gradient(#f1ecd8 0 25%, #27352e 0 50%) 50% / 44px 44px;
  }

  .board-mark span {
    padding: 0.55rem 0.8rem;
    color: #203229;
    background: #f1ecd8;
    font-weight: 900;
  }

  .notice {
    margin-bottom: 18px;
    border-radius: 6px;
    padding: 0.9rem 1rem;
    font-weight: 700;
  }

  .notice.success {
    color: #163e2c;
    background: #dff1df;
  }

  .notice.danger {
    color: #742929;
    background: #f5d6d6;
  }

  .workspace {
    display: grid;
    grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.35fr);
    gap: 18px;
  }

  .panel,
  .tournament {
    border: 1px solid #d7ddcf;
    border-radius: 8px;
    background: #ffffff;
  }

  .panel {
    padding: 18px;
  }

  .section-title,
  .tournament-head,
  .tournament-tools,
  .columns,
  .row {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }

  .section-title {
    margin-bottom: 16px;
  }

  .section-title span {
    color: #647064;
    font-size: 0.9rem;
    font-weight: 700;
  }

  h2 {
    font-size: 1.35rem;
  }

  h3 {
    margin-bottom: 8px;
    color: #354238;
    font-size: 0.95rem;
  }

  .form-grid,
  .edit-row {
    display: grid;
    gap: 10px;
  }

  .form-grid {
    grid-template-columns: 1.1fr 1.2fr 0.7fr auto;
    align-items: end;
    margin-bottom: 16px;
  }

  .tournament-form {
    grid-template-columns: 1.1fr 1fr 0.8fr auto;
  }

  .list,
  .tournament-list {
    display: grid;
    gap: 12px;
  }

  .row {
    align-items: stretch;
    padding: 10px;
    border: 1px solid #e2e6dc;
    border-radius: 6px;
    background: #fbfcf8;
  }

  .edit-row {
    flex: 1;
    grid-template-columns: 1fr 1.1fr 88px auto;
  }

  .tournament {
    display: grid;
    gap: 16px;
    padding: 14px;
  }

  .tournament-edit {
    grid-template-columns: 1fr 1fr 150px auto;
  }

  .tournament-tools {
    align-items: stretch;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .inline-form {
    display: flex;
    gap: 10px;
    min-width: min(100%, 360px);
  }

  .columns {
    align-items: flex-start;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(220px, 0.7fr);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 34px;
    border-radius: 999px;
    padding: 0.2rem 0.25rem 0.2rem 0.7rem;
    background: #eef4e9;
    color: #29362d;
    font-size: 0.9rem;
  }

  .chip button {
    min-height: 28px;
    width: 28px;
    padding: 0;
    border-radius: 999px;
    background: #d5e2cf;
    color: #344333;
  }

  .ranking {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ranking li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #edf0e8;
    padding-bottom: 8px;
  }

  .ranking strong {
    display: inline-grid;
    place-items: center;
    width: 28px;
    height: 28px;
    margin-right: 8px;
    border-radius: 50%;
    color: #ffffff;
    background: #3653a4;
  }

  .ranking span,
  .empty {
    color: #6b746a;
  }

  .match-list {
    display: grid;
    gap: 6px;
    max-height: 160px;
    overflow: auto;
    border-top: 1px solid #edf0e8;
    padding-top: 8px;
  }

  .match-list p {
    color: #425044;
    font-size: 0.94rem;
  }

  .match-list strong {
    color: #24543b;
  }

  @media (max-width: 980px) {
    .masthead,
    .workspace {
      grid-template-columns: 1fr;
    }

    .board-mark {
      min-height: 96px;
    }

    .form-grid,
    .tournament-form,
    .edit-row,
    .tournament-edit,
    .columns {
      grid-template-columns: 1fr;
    }

    .row,
    .tournament-head {
      align-items: stretch;
      flex-direction: column;
    }
  }

  @media (max-width: 620px) {
    .shell {
      width: min(100% - 20px, 1180px);
      padding-top: 10px;
    }

    .masthead {
      min-height: auto;
      padding: 20px;
    }

    h1 {
      font-size: 2rem;
    }

    .tournament-tools,
    .inline-form {
      display: grid;
      width: 100%;
    }
  }
</style>
