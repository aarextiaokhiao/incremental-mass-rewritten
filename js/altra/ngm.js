//MINUS
function getSaveTitle() {
	return inNGM() ? "IM:A Minus" : "IM: Altrascendum"
}
function inNGM() {
	return metaSave.ngm == 1
}
function toggleMinus(start) {
	if (!confirm("Do you wish the altar to switch? You'll be at: " + (metaSave.ngm ? "IM:A" : "IM:A-"))) return
	if (!metaSave.ngm && !confirm("Warning! IM:A Minus is really work in progress, and has a little content balanced! Are you sure?")) return

	metaSave.ngm = (metaSave.ngm + 1) % 2
	if (start) RANKS.reset("rank")
	else {
		save()
		setMetaSave()
		loadGame(false)
	}
}

//MAGIC
let MAGIC = {
	setup() {
		let flows = []
		for (var i = 0; i < MAGIC_NORMAL.flows.length; i++) flows.push([])
		return {
			unl: false,
			amt: E(0),

			normal: {
				amt: E(0),
				flows: flows
			}
		}
	},

	can() {
		return player.mass.gte(2e4)
	},
	gain() {
		if (!this.can()) return E(0)
		return player.mass.div(2e4).pow(.2).floor()
	},
	reset() {
		if (!MAGIC.can()) return
		if (player.confirms.mg && !confirm("Are you sure to reset?")) return
		player.mg.amt = player.mg.amt.add(MAGIC.gain())
		player.mg.unl = true
		RANKS.doReset.highest()
	},
	doReset() {
		RANKS.doReset.highest()
	},

	updateTmp() {
		if (!inNGM() || !player.mg.unl) {
			delete tmp.mg
			return
		}
		if (!tmp.mg) tmp.mg = {}
		MAGIC_NORMAL.updateTmp()
	}
}

let MAGIC_NORMAL = {
	unl: () => tmp.mg != undefined,
	boosts: [
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => E(1),
			desc: (x) => "Placeholder.",
		}
	],
	flows: [
		{
			unl: () => true,
			order: [[0,E(5)],[1,E(5)],[2,E(5)],[3,E(5)]]
		},
		{
			unl: () => true,
			order: [[4,E(5)],[5,E(5)],[6,E(5)],[7,E(5)]]
		}
	],

	eff: (x) => tmp.mg.normal.eff[x],

	updateTmp() {
		let data = {
			eff: []
		}
		for (var i = 0; i < 8; i++) data.eff[i] = this.boosts[i].eff(E(0))
		tmp.mg.normal = data
	}
}