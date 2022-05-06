let CHROMA = {
	unl: () => player.chal.comps[13].gte(13) || player.ext.ch.unl,

	setup() {
		return {
			unl: false,
			tones: [false, false, false, false],
			bp: E(0),
			sp: [],
		}
	},
	calc(dt) {
		if (tmp.ch.toned && tmp.ch.bp_bulk.gt(player.ext.ch.bp)) player.ext.ch.bp = tmp.ch.bp_bulk
	},

	tones: {
		colors: ["Red", "Green", "Blue", "Ultraviolet"],
		reqs: [E(0), E(1/0), E(1/0), E(1/0)],
		toggle(x) {
			if (!player.ext.ch.tones[x] && !this.can(x)) return
			player.ext.ch.tones[x] = !player.ext.ch.tones[x]
			EXOTIC.reset(player.chal.comps[12].eq(0), true)
		},
		can(x) {
			return player.ext.amt.gte(tmp.ch.req) && player.ext.amt.gte(this.reqs[x])
		}
	},
	colors: {
		power() {
			let start = mlt(2e4)
			if (player.mass.lt(start)) return E(0)
			return player.mass.log(start).log10().add(1).pow(0.5).sub(1)
		},
	}
}

function updateChromaTemp() {
	let data = {}
	let save = player.ext.ch
	tmp.ch = data
	if (!save.unl) return

	data.toned = 0
	for (var i = 0; i < save.tones.length; i++) if (save.tones[i]) data.toned++
	data.req = EXT.amt([E(0), E(1/0), E(1/0), E(1/0)][data.toned])

	data.bp_next = E(10).pow(E(1.1).pow(save.bp).mul(6e13))
	data.bp_bulk = player.mass.div(uni(1)).log10().div(6e13).log(1.1).floor().add(1)
	if (player.mass.lte("e6e13")) data.bp_bulk = E(0)

	data.pwr = CHROMA.colors.power()
}

function updateChromaHTML() {
	let save = player.ext.ch
	tmp.el.ch_req.setTxt(format(tmp.ch.req))
	tmp.el.ch_bp.setTxt(format(save.bp, 0) + " Beauty Pigments")
	tmp.el.ch_nxt.setTxt(tmp.ch.toned ? "(next at " + formatMass(tmp.ch.bp_next) + ")" : "")

	for (var i = 0; i < save.tones.length; i++) {
		let choosed = save.tones[i]
		let unl = player.ext.amt.gte(CHROMA.tones.reqs[i])
		let unavailable = !CHROMA.tones.can(i) && !choosed
		tmp.el["ch_tone_" + i + "_btn"].setClasses({btn: true, btn_ch: true, unavailable: unavailable, choosed: choosed})
		tmp.el["ch_tone_" + i].setTxt(unl ? CHROMA.tones.colors[i] + (save.tones[i] ? ": ON" : ": OFF") : "Locked (" + format(CHROMA.tones.reqs[i]) + ")")
	}

	tmp.el.ch_pwr.setTxt("Luminosity: " + format(tmp.ch.pwr.mul(100)) + "%")
}

function toggleChromaBG() {
	if (player.options.noChroma && !confirm("Warning! This will cause high performance for your PC / phone! Are you sure about that?!")) return
	player.options.noChroma = !player.options.noChroma
}

function updateChromaScreen() {
	let unl = CHROMA.unl() && !player.options.noChroma
	tmp.el.chroma_bg.setDisplay(unl)
	if (!unl) return

	let progress = player.stats.maxMass.log10().log10().sub(14).div(16).max(0).min(1).toNumber()
	tmp.el.chroma_bg1.setOpacity(progress)
	tmp.el.chroma_bg2.setOpacity(progress)

	//WARNING: PERFORMANCE!
	let high = false
	tmp.el.chroma_bg2.style.setProperty('background', high ? "linear-gradient(45deg, transparent, white, transparent, transparent)" : "linear-gradient(45deg, transparent, white)")
	tmp.el.chroma_bg3.setDisplay(high)
	if (high) tmp.el.chroma_bg3.setOpacity(progress)
}