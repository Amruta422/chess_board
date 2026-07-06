import { a4 as head, e as escape_html, a5 as ensure_array_like, a6 as attr, a7 as bind_props } from "../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let playersByTournament, rankingsByTournament, matchesByTournament;
    let data = $$props["data"];
    let form = $$props["form"];
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    playersByTournament = data.tournamentPlayers.reduce(
      (groups, player) => {
        groups[player.tournament_id] = [...groups[player.tournament_id] ?? [], player];
        return groups;
      },
      {}
    );
    rankingsByTournament = data.rankings.reduce(
      (groups, row) => {
        groups[row.tournament_id] = [...groups[row.tournament_id] ?? [], row].filter((rank) => rank.place <= 3);
        return groups;
      },
      {}
    );
    matchesByTournament = data.matches.reduce(
      (groups, match) => {
        groups[match.tournament_id] = [...groups[match.tournament_id] ?? [], match];
        return groups;
      },
      {}
    );
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Chess Tournament Manager</title>`);
      });
    });
    $$renderer2.push(`<main class="shell svelte-1uha8ag"><section class="masthead svelte-1uha8ag"><div><p class="eyebrow svelte-1uha8ag">SQL backed SvelteKit app</p> <h1 class="svelte-1uha8ag">Chess Tournament Manager</h1> <p class="lede svelte-1uha8ag">Create players, build tournaments, pair random matches, and review the top three finishers.</p></div> <div class="board-mark svelte-1uha8ag" aria-hidden="true"><span class="svelte-1uha8ag">CHESS</span></div></section> `);
    if (data.dbError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="notice danger svelte-1uha8ag">Database connection failed: ${escape_html(data.dbError)}</section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="notice success svelte-1uha8ag">${escape_html(form.message)}</section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <section class="workspace svelte-1uha8ag"><div class="panel svelte-1uha8ag"><div class="section-title svelte-1uha8ag"><h2 class="svelte-1uha8ag">Players</h2> <span class="svelte-1uha8ag">${escape_html(data.players.length)} total</span></div> <form method="POST" action="?/createPlayer" class="form-grid svelte-1uha8ag"><label class="svelte-1uha8ag">Name <input name="name" placeholder="Magnus Carlsen" required="" class="svelte-1uha8ag"/></label> <label class="svelte-1uha8ag">Email <input name="email" type="email" placeholder="player@example.com" class="svelte-1uha8ag"/></label> <label class="svelte-1uha8ag">Rating <input name="rating" type="number" min="100" max="4000" value="1200" required="" class="svelte-1uha8ag"/></label> <button type="submit" class="svelte-1uha8ag">Add Player</button></form> <div class="list svelte-1uha8ag">`);
    const each_array = ensure_array_like(data.players);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let player = each_array[$$index];
        $$renderer2.push(`<article class="row svelte-1uha8ag"><form method="POST" action="?/updatePlayer" class="edit-row svelte-1uha8ag"><input type="hidden" name="id"${attr("value", player.id)} class="svelte-1uha8ag"/> <input name="name"${attr("value", player.name)} aria-label="Player name" required="" class="svelte-1uha8ag"/> <input name="email" type="email"${attr("value", player.email ?? "")} aria-label="Player email" class="svelte-1uha8ag"/> <input name="rating" type="number" min="100" max="4000"${attr("value", player.rating)} aria-label="Rating" required="" class="svelte-1uha8ag"/> <button type="submit" class="svelte-1uha8ag">Save</button></form> <form method="POST" action="?/deletePlayer"><input type="hidden" name="id"${attr("value", player.id)} class="svelte-1uha8ag"/> <button type="submit" class="ghost svelte-1uha8ag">Delete</button></form></article>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="empty svelte-1uha8ag">No players yet.</p>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="panel svelte-1uha8ag"><div class="section-title svelte-1uha8ag"><h2 class="svelte-1uha8ag">Tournaments</h2> <span class="svelte-1uha8ag">${escape_html(data.tournaments.length)} total</span></div> <form method="POST" action="?/createTournament" class="form-grid tournament-form svelte-1uha8ag"><label class="svelte-1uha8ag">Name <input name="name" placeholder="City Open" required="" class="svelte-1uha8ag"/></label> <label class="svelte-1uha8ag">Location <input name="location" placeholder="Hyderabad" class="svelte-1uha8ag"/></label> <label class="svelte-1uha8ag">Date <input name="starts_on" type="date"${attr("value", today)} required="" class="svelte-1uha8ag"/></label> <button type="submit" class="svelte-1uha8ag">Add Tournament</button></form> <div class="tournament-list svelte-1uha8ag">`);
    const each_array_1 = ensure_array_like(data.tournaments);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_5 = 0, $$length = each_array_1.length; $$index_5 < $$length; $$index_5++) {
        let tournament = each_array_1[$$index_5];
        $$renderer2.push(`<article class="tournament svelte-1uha8ag"><div class="tournament-head svelte-1uha8ag"><form method="POST" action="?/updateTournament" class="edit-row tournament-edit svelte-1uha8ag"><input type="hidden" name="id"${attr("value", tournament.id)} class="svelte-1uha8ag"/> <input name="name"${attr("value", tournament.name)} aria-label="Tournament name" required="" class="svelte-1uha8ag"/> <input name="location"${attr("value", tournament.location ?? "")} aria-label="Tournament location" class="svelte-1uha8ag"/> <input name="starts_on" type="date"${attr("value", tournament.starts_on)} aria-label="Tournament date" required="" class="svelte-1uha8ag"/> <button type="submit" class="svelte-1uha8ag">Save</button></form> <form method="POST" action="?/deleteTournament"><input type="hidden" name="id"${attr("value", tournament.id)} class="svelte-1uha8ag"/> <button type="submit" class="ghost svelte-1uha8ag">Delete</button></form></div> <div class="tournament-tools svelte-1uha8ag"><form method="POST" action="?/addPlayerToTournament" class="inline-form svelte-1uha8ag"><input type="hidden" name="tournament_id"${attr("value", tournament.id)} class="svelte-1uha8ag"/> <select name="player_id" required="" aria-label="Player" class="svelte-1uha8ag">`);
        $$renderer2.option({ value: "" }, ($$renderer3) => {
          $$renderer3.push(`Choose player`);
        });
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(data.players);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let player = each_array_2[$$index_1];
          $$renderer2.option({ value: player.id }, ($$renderer3) => {
            $$renderer3.push(`${escape_html(player.name)}`);
          });
        }
        $$renderer2.push(`<!--]--></select> <button type="submit" class="svelte-1uha8ag">Add</button></form> <form method="POST" action="?/runRandomMatches"><input type="hidden" name="tournament_id"${attr("value", tournament.id)} class="svelte-1uha8ag"/> <button type="submit" class="accent svelte-1uha8ag">Run Random Matches</button></form></div> <div class="columns svelte-1uha8ag"><div><h3 class="svelte-1uha8ag">Players</h3> <div class="chips svelte-1uha8ag">`);
        const each_array_3 = ensure_array_like(playersByTournament[tournament.id] ?? []);
        if (each_array_3.length !== 0) {
          $$renderer2.push("<!--[-->");
          for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
            let player = each_array_3[$$index_2];
            $$renderer2.push(`<form method="POST" action="?/removePlayerFromTournament" class="chip svelte-1uha8ag"><input type="hidden" name="tournament_id"${attr("value", tournament.id)} class="svelte-1uha8ag"/> <input type="hidden" name="player_id"${attr("value", player.player_id)} class="svelte-1uha8ag"/> <span>${escape_html(player.name)} (${escape_html(player.rating)})</span> <button type="submit"${attr("aria-label", `Remove ${player.name}`)} class="svelte-1uha8ag">x</button></form>`);
          }
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<p class="empty svelte-1uha8ag">No players assigned.</p>`);
        }
        $$renderer2.push(`<!--]--></div></div> <div><h3 class="svelte-1uha8ag">Top 3</h3> <ol class="ranking svelte-1uha8ag">`);
        const each_array_4 = ensure_array_like(rankingsByTournament[tournament.id] ?? []);
        if (each_array_4.length !== 0) {
          $$renderer2.push("<!--[-->");
          for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
            let rank = each_array_4[$$index_3];
            $$renderer2.push(`<li class="svelte-1uha8ag"><strong class="svelte-1uha8ag">${escape_html(rank.place)}</strong> ${escape_html(rank.player_name)} <span class="svelte-1uha8ag">${escape_html(rank.wins)} wins</span></li>`);
          }
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<li class="empty svelte-1uha8ag">Run matches to rank players.</li>`);
        }
        $$renderer2.push(`<!--]--></ol></div></div> <div><h3 class="svelte-1uha8ag">Recent Matches</h3> <div class="match-list svelte-1uha8ag">`);
        const each_array_5 = ensure_array_like(matchesByTournament[tournament.id] ?? []);
        if (each_array_5.length !== 0) {
          $$renderer2.push("<!--[-->");
          for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
            let match = each_array_5[$$index_4];
            $$renderer2.push(`<p class="svelte-1uha8ag">${escape_html(match.white_player)} vs ${escape_html(match.black_player)} <strong class="svelte-1uha8ag">${escape_html(match.winner)}</strong></p>`);
          }
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<p class="empty svelte-1uha8ag">No matches recorded.</p>`);
        }
        $$renderer2.push(`<!--]--></div></div></article>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="empty svelte-1uha8ag">No tournaments yet.</p>`);
    }
    $$renderer2.push(`<!--]--></div></div></section></main>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
