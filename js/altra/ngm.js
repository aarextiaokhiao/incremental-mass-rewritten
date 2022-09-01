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
	unl: () => player.mg?.unl,
	setup() {
		let flows = []
		for (var i = 0; i < MAGIC_NORMAL.flows.length; i++) flows.push([])
		return {
			unl: false,
			amt: D(0),

			normal: {
				amt: D(0),
				flows: flows
			}
		}
	},
	calc(dt) {
		
	},
	updateTmp() {
		if (!MAGIC.unl()) {
			delete tmp.mg
			return
		}
		if (!tmp.mg) tmp.mg = {}

		MAGIC_NORMAL.updateTmp()
	},

	//PRESTIGE FUNCTIONS
	can() {
		return player.mass.gte(2e4)
	},
	gain() {
		if (!this.can()) return D(0)
		return player.mass.div(2e4).pow(.2).floor()
	},
	reset() {
		if (!MAGIC.can()) return
		if (player.confirms.mg && !confirm("Are you sure to reset?")) return

		if (!MAGIC.unl()) {
			player.mg = MAGIC.setup()
			player.mg.unl = true
		}

		player.mg.amt = player.mg.amt.add(MAGIC.gain())
		MAGIC.doReset()
	},
	doReset() {
		player.ranks.tetr = D(0)
		RANKS.doReset.tetr()
	},

	//AMOUNT
	amt() {
		return player.magic?.amt ?? D(0)
	}
}

let MAGIC_NORMAL = {
	unl: () => tmp.mg != undefined,
	boosts: [
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		},
		{
			name: "???",
			abb: "?",
			eff: (m) => D(1),
			desc: (x) => "Placeholder.",
		}
	],
	flows: [
		{
			unl: () => true,
			order: [[0,D(5)],[1,D(5)],[2,D(5)],[3,D(5)]]
		},
		{
			unl: () => true,
			order: [[4,D(5)],[5,D(5)],[6,D(5)],[7,D(5)]]
		}
	],

	eff: (x) => tmp.mg.normal.eff[x],

	updateTmp() {
		let data = {
			eff: []
		}
		for (var i = 0; i < 8; i++) data.eff[i] = this.boosts[i].eff(D(0))
		tmp.mg.normal = data
	}
}