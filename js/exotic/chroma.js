let CHROMA = {
	unl: () => player.chal.comps[13].gte(13),

	setup() {
		return {
			unl: false,
			tones: [false, false, false, false],
			bp: E(0),
			sp: [],
		}
	},
	calc(dt) {
		//if (tmp.ch.toned && tmp.ch.bp_bulk.gt(player.ext.ch.bp)) player.ext.ch.bp = tmp.ch.bp_bulk
	},

	tones: {
		colors: ["Red", "Green", "Blue", "Ultraviolet"],
		reqs: [E(0), E(1/0), E(1/0), E(1/0)],
		toggle(x) {
			if (!player.ext.ch.tones[x] && player.ext.amt.lt(tmp.ch.req)) return
			if (x > 0) return
			player.ext.ch.tones[x] = !player.ext.ch.tones[x]
			EXOTIC.reset(player.chal.comps[12].eq(0), true)
		},
	},
	colors: {
		power() {
			return player.mass.add(1).log10().add(1).log10().sqrt().div(4)
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
	data.bp_bulk = player.mass.div(uni(1)).max(1).log10().div(6e13).max(1).log(1.1).floor().add(1)
}

function updateChromaHTML() {
	let save = player.ext.ch
	tmp.el.ch_req.setTxt(format(tmp.ch.req))
	tmp.el.ch_bp.setTxt("You have " + format(save.bp, 0) + " Beauty Pigments")
	tmp.el.ch_nxt.setTxt(formatMass(tmp.ch.bp_next))

	for (var i = 0; i < save.tones.length; i++) tmp.el["ch_tone_" + i].setTxt(CHROMA.tones.colors[i] + (save.tones[i] ? ": ON" : ": OFF"))
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