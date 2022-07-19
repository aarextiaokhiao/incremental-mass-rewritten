let TONES = {
	amt: () => player.ext.toned,
	max: 30,

	base_reqs: [],
	req(x = toned()) {
		let c = EINF
		if (x < 5) c = this.base_reqs[x]
		else if (x < 30) c = E(10).pow(E(10).pow(Math.pow(1.15, Math.pow(x-6, 4/3)) * 10))
		return EXT.amt(c)
	},

	can() {
		return player.ext.amt.gte(this.req()) && toned() < this.max
	},
	tone() {
		if (!TONES.can()) return

		let amt = toned()
		let color = ""
		let res = ""
		let layer = 1
		let reset = ""
		if (amt < 5) {
			color = ["Red", "Green", "Blue", "Violet", "Ultraviolet"][amt]
			res = ["Mass Upgrades", "BH Condensers", "Cosmic Rays", "Ranks", "Supernovae and Fermions"][amt]
			reset = "Supernova"
		} else if (amt < 30) {
			color = "Extreme " + LETTERS[amt - 5]
			res = "Buildings"
			reset = "Exotic"
		} else {
			color = "Gamma " + LETTERS[amt - 30]
			res = "Exotic"
			reset = "Prestige"
			layer = 2
		}

		if (!confirm(
			"[" + color + " Tone] " +
			"This will perform a " + reset + " reset to change " + res + "." + (
				amt >= 5 ? "(^" + this.power(layer).toFixed(3) + " -> ^" + this.power(layer, true).toFixed(3) + ")" : ""
			) + " Colors await...")) return
		player.ext.toned++

		// if (amt >= 30) - For Prestige
		if (amt >= 5) EXOTIC.reset(true)
		else SUPERNOVA.doReset()
	},

	power(layer, next) {
		let amt = toned()
		if (next) amt++
		if (layer == 1) amt -= 5
		if (layer == 2) amt -= 30
		amt = Math.min(Math.max(amt, 0), 25)

		if (layer == 2 && amt < 12.5) return 5 / (amt / 12.5 + 3)
		return 1 + 1 / Math.pow(2, amt / 12.5 + 1)
	}
}

function tone() {
	TONES.tone()
}
function toned() {
	return TONES.amt()
}