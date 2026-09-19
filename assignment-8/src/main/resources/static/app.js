const state = { matches: [], selectedId: null, selected: null, filter: 'ALL', stream: null, teams: [] };
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || `Request failed (${response.status})`); }
  return response.status === 204 ? null : response.json();
}

function badge(team) { return `<span class="team-badge" style="background:${esc(team?.color || '#6b7f79')}">${esc(team?.shortName || '—')}</span>`; }
function matchScore(match, team) {
  if (match.battingTeam?.id === team.id) return `<strong>${match.runs}/${match.wickets}</strong>`;
  if (match.firstInnings?.battingTeam?.id === team.id) return `<strong>${match.firstInnings.runs}/${match.firstInnings.wickets}</strong>`;
  return '<small>Yet to bat</small>';
}
function renderMatchList() {
  const visible = state.filter === 'ALL' ? state.matches : state.matches.filter(m => m.status === state.filter);
  $('#match-count').textContent = `${visible.length} ${visible.length === 1 ? 'match' : 'matches'}`;
  $('#match-list-title').textContent = ({ALL:'All fixtures',LIVE:'Live now',SCHEDULED:'Upcoming fixtures',COMPLETED:'Recent results'})[state.filter];
  $('#match-list').innerHTML = visible.length ? visible.map(m => `
    <button class="match-card ${m.id === state.selectedId ? 'selected' : ''}" data-match-id="${m.id}">
      <div class="match-meta"><span>${esc(m.format)} · ${esc(m.venue.split(',')[0])}</span><span class="status ${m.status.toLowerCase()}">${m.status}</span></div>
      <div class="match-teams">
        <div class="team-line">${badge(m.teamA)}<span>${esc(m.teamA.name)}</span>${matchScore(m,m.teamA)}</div>
        <div class="team-line">${badge(m.teamB)}<span>${esc(m.teamB.name)}</span>${matchScore(m,m.teamB)}</div>
      </div>
    </button>`).join('') : '<div class="empty-state"><p>No matches in this view.</p></div>';
  document.querySelectorAll('[data-match-id]').forEach(el => el.addEventListener('click', () => selectMatch(Number(el.dataset.matchId))));
}

function playerLine(player, stat, striker = false) {
  return `<div class="player-row"><span class="${striker ? 'on-strike' : ''}">${esc(player?.name || '—')}</span><strong>${stat?.runs || 0}</strong><span>${stat?.ballsFaced || 0}</span><span>${stat?.strikeRate?.toFixed(1) || '0.0'}</span></div>`;
}
function findStat(match, id) { return match.playerStats?.find(s => s.player.id === id); }
function renderDashboard(match) {
  if (!match) { $('#dashboard').innerHTML = '<div class="empty-state"><p>Select a match to open its match centre.</p></div>'; return; }
  if (match.status === 'SCHEDULED') {
    const date = new Intl.DateTimeFormat(undefined, {dateStyle:'full', timeStyle:'short'}).format(new Date(match.scheduledAt));
    $('#dashboard').innerHTML = `<div class="scheduled-panel"><div><p class="kicker">${esc(match.format)} · ${esc(match.venue)}</p><h2>${esc(match.teamA.name)} vs ${esc(match.teamB.name)}</h2><p>${esc(date)}</p></div><button class="primary-button" id="start-match">Start match</button></div>`;
    $('#start-match').onclick = () => startMatch(match);
    return;
  }
  const strikerStat = findStat(match, match.striker?.id), nonStrikerStat = findStat(match, match.nonStriker?.id), bowlerStat = findStat(match, match.bowler?.id);
  const commentary = (match.recentEvents || []).map(e => `<div class="comment ${e.wicket ? 'wicket' : (e.runs >= 4 ? 'boundary' : '')}"><span class="ball">${e.over}.${e.ball}</span><div><p>${esc(e.description)}</p><small>${e.wicket ? 'Wicket' : e.runs + ' run' + (e.runs === 1 ? '' : 's')} · Innings ${e.innings}</small></div></div>`).join('') || '<p class="muted">Waiting for the first delivery.</p>';
  const battingStats = (match.playerStats || []).filter(s => s.player.teamId === match.battingTeam?.id && s.ballsFaced > 0).slice(0,6);
  const statsRows = battingStats.map(s => `<tr><td>${esc(s.player.name)}</td><td>${s.runs}</td><td>${s.ballsFaced}</td><td>${s.fours}</td><td>${s.sixes}</td><td>${s.strikeRate.toFixed(1)}</td></tr>`).join('');
  const firstInnings = match.firstInnings ? `<span>${esc(match.firstInnings.battingTeam.shortName)} ${match.firstInnings.runs}/${match.firstInnings.wickets} (${match.firstInnings.overs})</span>` : '';
  $('#dashboard').innerHTML = `
    ${match.result ? `<div class="result-banner">${esc(match.result)}</div>` : ''}
    <article class="score-panel">
      <div class="score-top"><div><p>${esc(match.format)} · ${esc(match.venue)}</p><h2>${esc(match.title)}</h2><p>${firstInnings}</p></div><span class="live-label">${match.status === 'LIVE' ? '● Live' : 'Final'}</span></div>
      <div class="score-main"><div><div class="batting-name">${badge(match.battingTeam)} ${esc(match.battingTeam?.name)}</div><div class="giant-score">${match.runs}/${match.wickets}<sup>${match.overs} ov</sup></div></div><div class="target-box">Innings ${match.inningsNumber}<strong>${match.target ? `Target ${match.target}` : `${match.maxOvers} overs`}</strong>${match.target ? `${Math.max(0, match.target-match.runs)} needed` : ''}</div></div>
      <div class="player-board"><div class="player-row header"><span>Batters</span><span>R</span><span>B</span><span>SR</span></div>${playerLine(match.striker,strikerStat,true)}${playerLine(match.nonStriker,nonStrikerStat)}</div>
      <div class="bowler-strip"><span>Bowling&nbsp; <strong>${esc(match.bowler?.name || '—')}</strong></span><span><strong>${bowlerStat?.wickets || 0}/${bowlerStat?.runsConceded || 0}</strong> · ${bowlerStat?.overs || '0.0'} ov</span></div>
      ${match.status === 'LIVE' ? `<div class="score-controls"><button data-runs="0">0</button><button data-runs="1">1</button><button data-runs="2">2</button><button data-runs="3">3</button><button data-runs="4">4</button><button data-runs="6">6</button><button data-wide="1">Wd</button><button class="wicket-button" data-wicket="1">Wicket</button><button class="sim-button" id="simulation">${match.simulationEnabled ? 'Pause simulation' : 'Run live simulation'}</button></div>` : ''}
    </article>
    <aside class="side-stack">
      <section class="card"><div class="card-head"><h3>Ball-by-ball</h3><span>Latest first</span></div><div class="commentary-list">${commentary}</div></section>
      <section class="card"><div class="card-head"><h3>Batting card</h3><span>Innings ${match.inningsNumber}</span></div><table class="stats-table"><thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr></thead><tbody>${statsRows || '<tr><td colspan="6">No batting data yet</td></tr>'}</tbody></table></section>
    </aside>`;
  document.querySelectorAll('[data-runs]').forEach(b => b.onclick = () => addScore(Number(b.dataset.runs), false, 'RUNS'));
  document.querySelector('[data-wide]')?.addEventListener('click', () => addScore(1, false, 'WIDE'));
  document.querySelector('[data-wicket]')?.addEventListener('click', () => addScore(0, true, 'WICKET'));
  $('#simulation')?.addEventListener('click', () => toggleSimulation(match));
}

async function loadMatches(preferredId) {
  state.matches = await api('/api/matches');
  if (preferredId) state.selectedId = preferredId;
  if (!state.selectedId || !state.matches.some(m => m.id === state.selectedId)) state.selectedId = state.matches.find(m => m.status === 'LIVE')?.id || state.matches[0]?.id;
  renderMatchList();
  if (state.selectedId) await selectMatch(state.selectedId, false);
}
async function selectMatch(id, refreshList = true) {
  state.selectedId = id; if (refreshList) renderMatchList();
  try { state.selected = await api(`/api/matches/${id}`); renderDashboard(state.selected); connectStream(id); }
  catch (error) { showToast(error.message); }
}
function connectStream(id) {
  state.stream?.close(); setConnection(false);
  const stream = new EventSource(`/api/matches/${id}/stream`); state.stream = stream;
  stream.addEventListener('connected', () => setConnection(true));
  stream.addEventListener('score-update', event => {
    const match = JSON.parse(event.data); state.selected = match;
    const index = state.matches.findIndex(m => m.id === match.id); if (index >= 0) state.matches[index] = match;
    renderDashboard(match); renderMatchList(); setConnection(true);
  });
  stream.onerror = () => setConnection(false);
}
function setConnection(connected) { $('#connection').classList.toggle('connected', connected); $('#connection span').textContent = connected ? 'Live connected' : 'Reconnecting'; }
async function addScore(runs, wicket, eventType) { try { const match = await api(`/api/matches/${state.selectedId}/score`, {method:'POST', body:JSON.stringify({runs,wicket,eventType})}); state.selected = match; renderDashboard(match); } catch(e) { showToast(e.message); } }
async function toggleSimulation(match) { try { await api(`/api/matches/${match.id}/simulation`, {method:'POST', body:JSON.stringify({enabled:!match.simulationEnabled})}); showToast(match.simulationEnabled ? 'Simulation paused' : 'Live simulation started'); } catch(e) { showToast(e.message); } }
async function startMatch(match) { try { await api(`/api/matches/${match.id}/start`, {method:'POST', body:JSON.stringify({battingTeamId:match.teamA.id})}); await loadMatches(match.id); showToast('Match is now live'); } catch(e) { showToast(e.message); } }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600); }

document.querySelectorAll('.nav-item').forEach(button => button.onclick = () => { document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active')); button.classList.add('active'); state.filter = button.dataset.filter; renderMatchList(); });
$('#open-create').onclick = async () => { try { if (!state.teams.length) state.teams = await api('/api/teams'); const options = state.teams.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join(''); $('#create-form [name=teamAId]').innerHTML = options; $('#create-form [name=teamBId]').innerHTML = options; $('#create-form [name=teamBId]').selectedIndex = 1; const date = new Date(Date.now()+3600000); date.setMinutes(date.getMinutes()-date.getTimezoneOffset()); $('#create-form [name=scheduledAt]').value = date.toISOString().slice(0,16); $('#create-dialog').showModal(); } catch(e) { showToast(e.message); } };
$('#close-create').onclick = () => $('#create-dialog').close();
$('#create-form').onsubmit = async event => { event.preventDefault(); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(form); payload.teamAId=Number(payload.teamAId); payload.teamBId=Number(payload.teamBId); payload.maxOvers=Number(payload.maxOvers); payload.scheduledAt=new Date(payload.scheduledAt).toISOString(); try { const created = await api('/api/matches',{method:'POST',body:JSON.stringify(payload)}); $('#create-dialog').close(); await loadMatches(created.id); showToast('Fixture created'); } catch(e) { $('#form-error').textContent=e.message; } };
loadMatches().catch(error => { $('#dashboard').innerHTML = `<div class="empty-state"><p>${esc(error.message)}. Is the server running?</p></div>`; showToast(error.message); });
