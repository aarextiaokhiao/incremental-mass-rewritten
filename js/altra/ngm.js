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
	}
}