let ACHS = {
	rank: { name: "Lifting Up", desc: "Get Rank 1.", req: _ => player.ranks.rank.gte(1) },
	tier: { name: "General Lifter", desc: "Get Tier 1.", req: _ => player.ranks.tier.gte(1) },
	rp: { name: "Outrageous", desc: "Get a Rage Power.", req: _ => player.rp.points.gte(1) },
	ext: { name: "The New Foam", desc: "Rise Exotic", req: _ => EXT.unl() },
}
let FEATS = {
	f1: { name: "...", desc: "Impossible", req: _ => false },
}

//Obtaining
function getAch(x, time) {
	player.ach[x] = { time: time }
	notify(`<b>${ACHS[x].name}</b><br>${ACHS[x].desc}<hr>Got it in ${formatTime(time)}!`, 10)
}

function hasAch(x) {
	return player.ach[x] !== undefined
}

function onObtainAchCheck(x) {
	if (hasAch(x)) return
	getAch(x, player.time)
}

function obtainAchs() {
	for (var [i, d] of Object.entries(ACHS)) {
		if (d.req()) onObtainAchCheck(i)
	}
}

//Data & HTML
function setupAchs() {
	let html = "<tr>"
	let setup = 0
	for (var [i, d] of Object.entries(ACHS)) {
		html += `<td>
			<div class='ach' id='ach_${i}'>
				<b>${d.name}</b><br>
				${d.desc}
			</div>
		</td>`
		setup++
		if (setup % 5 == 0) html += "</tr><tr>"
	}
	html += "</tr>"
	new Element("ach_div").setHTML(html)
}

function updateAchs() {
	for (var [i, d] of Object.entries(ACHS)) {
		elm["ach_"+i].setClasses({ ach: true, on: hasAch(i) })
	}
}