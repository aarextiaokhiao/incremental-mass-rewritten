let CHROMA = {
	unl: () => player.ext.ch.unl,

	setup() {
		return {
			unl: false,
			tones: [false, false, false, false, false],
			bp: E(0),
			upg: [],
		}
	},
	calc(dt) {
		if (tmp.ch.toned && tmp.ch.bp_bulk.gt(player.ext.ch.bp)) player.ext.ch.bp = tmp.ch.bp_bulk
	},

	tones: {
		colors: ["Red", "Green", "Blue", "Violet", "Ultraviolet"],
		effs: ["Mass Upgrades", "BH Condensers", "Cosmic Rays", "Rank - Tetr", "Supernovae - Fermions"],
		reqs: [E(0), E(1e70), E("1e600"), E("1e125000"), E("1e10000000")],
		reqs_toggle: [E(0), E(1e100), E("1e3000"), E("1e1000000"), E("1e10000000")],
		toggle(x) {
			if (!player.ext.ch.tones[x] && !this.can(x)) return
			player.ext.ch.tones[x] = !player.ext.ch.tones[x]
			EXOTIC.reset(true)
		},
		can(x) {
			return player.ext.amt.gte(tmp.ch.req) && player.ext.amt.gte(EXT.amt(this.reqs[x]))
		}
	},

	spices: {
		rows: [
			"p1", "t1", "s1", "t2",
			"p2", "t3", "s2", "t4",
			"p3", "t5", "s3", "t6",
		],
		all: [
			"p1_1", "p2_1", "p3_1",
			"p1_2", "p2_2", "p3_2",
			"p1_3", "p2_3", "p3_3",

			"s1_1", "s2_1", "s3_1",
			"s1_2", "s2_2", "s3_2",

			"t1_1", "t2_1", "t3_1", "t4_1", "t5_1", "t6_1",
		],
		power() {
			let start = mlt(1e4)
			if (hasPrim("p0_0")) start = start.root(tmp.pr.eff["p0_0"])

			let log = player.mass.max(1).log(start)
			if (log.lt(1)) return E(0)
			return log.log10().div(2).add(1).pow(.6).sub(1)
		},
		cost(x) {
			return tmp.ch.mlt.add(player.ext.ch.upg.length).floor()
		},
		next(x) {
			if (CHROMA.got(x+"_2")) return x+"_3"
			if (CHROMA.got(x+"_1")) return x+"_2"
			return x+"_1"
		},
		unl(x) {
			if (x[0] == "t" || x[3] == "3") return PRIM.unl()
			return true
		},

		//PRIMARY
		p1_1: {
			desc: (x) => "Strengthen Exotic Matter by ^"+format(x)+".",
			color: "#7f0000",
			eff(x) {
				return x.div(4).add(1).min(1.5)
			},
		},
		p2_1: {
			desc: (x) => "Raise mass outside of MD, by ^"+format(x)+".",
			color: "#007f00",
			eff(x) {
				return x.div(2).add(1).cbrt().min(1.5)
			},
		},
		p3_1: {
			desc: (x) => "Raise Radiation self-boosts by ^"+format(x,3)+".",
			color: "#00007f",
			eff(x) {
				return E(1.15).pow(x)
			},
		},
		p1_2: {
			desc: (x) => "C12 raises Exotic Matter by ^"+format(x)+".",
			color: "#bf0000",
			eff(x) {
				return E(1).add(x.div(100)).min(1.05).pow(player.chal.comps[12])
			},
		},
		p2_2: {
			desc: (x) => "Reduce the Mass Dilation penalty by "+format((1-1/x)*100)+"%.",
			color: "#00bf00",
			eff(x) {
				return x.div(4).add(1).toNumber()
			},
		},
		p3_2: {
			desc: (x) => "Add Neutron Condensers by +^"+format(x,3)+".",
			color: "#0000bf",
			eff(x) {
				return x.div(30)
			},
		},
		p1_3: {
			desc: (x) => "Supernovae raises Exotic Matter by ^"+format(x)+".",
			color: "#ff0000",
			eff(x) {
				return player.supernova.times.div(300).add(1).pow(x.mul(0.5).min(2))
			},
		},
		p2_3: {
			desc: (x) => "Placeholder.",
			color: "#00ff00",
			eff(x) {
				return E(0)
			},
		},
		p3_3: {
			desc: (x) => "Master Bosons, with new effects.",
			color: "#0000ff",
			eff(x) {
				return 1
			},
		},

		//SECONDARY
		s1_1: {
			desc: (x) => "Dual Fermions give +"+format(x,0)+" Tiers.",
			color: "#7f7f00",
			eff(x) {
				return x.mul(10).floor()
			},
		},
		s2_1: {
			desc: (x) => "Strengthen Star Boosters by "+format(x)+"x.",
			color: "#007f7f",
			eff(x) {
				return x.div(3.5).add(1)
			},
		},
		s3_1: {
			desc: (x) => "Weaken Pre-Atom buildings by "+format(x)+"x.",
			color: "#7f007f",
			eff(x) {
				return E(1.2).pow(x)
			},
		},
		s1_2: {
			desc: (x) => "U-Lepton Boost shares with U-Quarks.",
			color: "#bfbf00",
			eff(x) {
				return E(0)
			},
		},
		s2_2: {
			desc: (x) => "Rank boosts Mass by "+format(x)+"x.",
			color: "#00bfbf",
			eff(x) {
				return E(1.01).pow(player.ranks.rank.pow(3))
			},
		},
		s3_2: {
			desc: (x) => "Weaken Cosmic Rays by "+format(x)+"x.",
			color: "#bf00bf",
			eff(x) {
				return E(1.2).pow(x.sub(1)).max(1)
			},
		},

		//TERITARY
		t1_1: {
			desc: (x) => "Bank "+format(x.mul(100))+"% of black hole mass.",
			color: "#7f3f00",
			eff(x) {
				return x.mul(.05).add(.3).min(.7)
			},
		},
		t2_1: {
			desc: (x) => "Bank "+format(x.mul(100))+"% of Hawking Radiation.",
			color: "#3f7f00",
			eff(x) {
				return x.mul(.05).add(.5).min(.7)
			},
		},
		t3_1: {
			desc: (x) => "Cosmic Ray Power weakens pre-Atom Buildings.",
			color: "#007f3f",
			eff(x) {
				if (!tmp.atom) return E(1)
				return tmp.atom.gamma_ray_eff.pow.log(1e20).max(1)
			},
		},
		t4_1: {
			desc: (x) => "“rad2” and “Os-73” synergize at "+format(x.mul(100))+"% power.",
			color: "#003f7f",
			eff(x) {
				return x.div(40).min(1)
			},
		},
		t5_1: {
			desc: (x) => "Raise 4th Photon Upgrade by ^"+format(x)+".",
			color: "#3f007f",
			eff(x) {
				return x.div(10).add(1).min(2)
			},
		},
		t6_1: {
			desc: (x) => "Multiply Axion Boosts by "+format(x)+"x.",
			color: "#7f003f",
			eff(x) {
				return x.div(4).add(1)
			},
		},
	},

	eff(i,v=1) {
		return tmp.ch.eff[i]
	},
	can(x) {
		if (player.ext.ch.bp.lt(CHROMA.spices.cost())) return false

		let next = CHROMA.spices.next(x)
		if (CHROMA.got(next)) return false
		if (!CHROMA.spices.all.includes(next)) return false

		if (next[0] == "p") {
			if (next[3] != "1") return CHROMA.got("s" + next[1] + "_" + (next[3] - 1)) && CHROMA.got("s" + (next[1] == "1" ? 3 : next[1] - 1) + "_" + (next[3] - 1))
			return true
		}
		if (next[0] == "s") {
			if (next[3] != "1") return CHROMA.got("t" + (next[1] * 2) + "_" + (next[3] - 1)) && CHROMA.got("t" + (next[1] * 2 - 1) + "_" + (next[3] - 1))
			return CHROMA.got("p" + next[1] + "_" + next[3]) && CHROMA.got("p" + (next[1] % 3 + 1) + "_" + next[3])
		}
		if (next[0] == "t") return CHROMA.got("s" + Math.ceil(next[1] / 2) + "_" + next[3]) && CHROMA.got("s" + (Math.ceil(next[1] / 2) % 3 + 1) + "_" + next[3])
		return false
	},
	get(x) {
		if (!CHROMA.can(x)) return
		player.ext.ch.upg.push(CHROMA.spices.next(x))
	},
	got(i) {
		return tmp.ch.eff && player.ext.ch.upg.includes(i)
	},
	respec() {
		if (!confirm("Are you sure do you want to respec your Chroma?")) return
		player.ext.ch.upg = []
		EXT.reset(true)
	}
}

function updateChromaTemp() {
	let data = {}
	let save = player.ext.ch
	tmp.ch = data
	if (!save.unl) return

	data.toned = 0
	for (var i = 0; i < save.tones.length; i++) if (save.tones[i]) data.toned++
	data.req = EXT.amt(CHROMA.tones.reqs_toggle[data.toned])

	let em_log = EXT.eff().add(1).log10().add(1).sqrt()
	let fP = E(data.toned).sqrt()
	if (tmp.chal) fP = tmp.chal.eff[15]

	data.bp_next = E(10).pow(E(1.75).pow(save.bp.div(fP)).mul(1e15).div(em_log))
	data.bp_bulk = player.mass.max(1).log10().mul(em_log).div(1e15).log(1.75).mul(fP).floor().add(1)

	let s = CHROMA.spices
	data.pwr = s.power()
	data.mlt = E(1)
	data.eff = {}
	for (var i = 0; i < s.all.length; i++) {
		let id = s.all[i]
		data.eff[id] = s[id].eff(data.pwr)
		if (CHROMA.got(id)) {
			if (id[3] != "1") data.mlt = data.mlt.mul(0.8)
			else if (id[0] == "p") data.mlt = data.mlt.mul(2)
			else if (id[0] == "s") data.mlt = data.mlt.mul(2)
			else if (id[0] == "t") data.mlt = data.mlt.mul(1.5)
		}
	}
}

function updateChromaHTML() {
	let save = player.ext.ch
	elm.ch_req.setTxt(tmp.ch.toned ? "(Your next tone requires " + format(tmp.ch.req) + " EM!)" : "")
	elm.ch_bp.setTxt(format(save.bp, 0) + " Beauty Pigments")
	elm.ch_nxt.setTxt(tmp.ch.toned ? "(next at " + formatMass(tmp.ch.bp_next) + ")" : "")

	for (var i = 0; i < save.tones.length; i++) {
		let choosed = save.tones[i]
		let unl = player.ext.amt.gte(EXT.amt(CHROMA.tones.reqs[i]))
		let unavailable = !CHROMA.tones.can(i) && !choosed
		elm["ch_tone_" + i + "_btn"].setClasses({btn: true, btn_ch: true, locked: unavailable, choosed: choosed})
		elm["ch_tone_" + i].setTxt(unl ? CHROMA.tones.colors[i] + (save.tones[i] ? ": ON" : ": OFF") : "Locked")
		elm["ch_eff_" + i].setTxt(unl ? CHROMA.tones.effs[i] : "Req: " + format(EXT.amt(CHROMA.tones.reqs[i])) + " EM")
	}

	let s = CHROMA.spices
	let all = s.all
	for (var i = 0; i < all.length; i++) {
		let id = all[i]
		elm["cs_"+id].setTxt(s[id].desc(tmp.ch.eff[id]))
		elm["cs_"+id].setOpacity(CHROMA.got(id) ? 1 : 0.25)
		elm["cs_"+id].setDisplay(s.unl(id))
	}
	let rows = s.rows
	for (var i = 0; i < rows.length; i++) {
		let id = rows[i]
		elm["cs_"+id+"_a"].setClasses({btn: true, locked: !CHROMA.can(id), btn_cs: true})
		elm["cs_"+id+"_a"].setTxt(CHROMA.got(id+"_1") ? "Extend" : id[0] == "p" ? "Assign" : "Spread")
		elm["cs_"+id+"_a"].setDisplay(s.unl(id+"_1"))
	}

	elm.ch_rs.setVisible(save.upg.length > 0)
	elm.ch_pwr.setTxt("Luminosity: " + format(tmp.ch.pwr.mul(100)) + "%")
	elm.ch_pwr.setTxt(save.upg.length > 0 ? "Luminosity: " + format(tmp.ch.pwr.mul(100)) + "%" : "")
	elm.ch_nxt_assign.setTxt(save.upg.length > 0 && save.upg.length < 21 ? "Next: " + format(CHROMA.spices.cost(),0) + " Beauty Pigments" : "")
}

function toggleChromaBG() {
	if (player.options.noChroma && !confirm("Warning! This will cause high performance for your PC / phone! Are you sure about that?!")) return
	player.options.noChroma = !player.options.noChroma
}

function updateChromaScreen() {
	let unl = CHROMA.unl() && !player.options.noChroma
	elm.chroma_bg.setDisplay(unl)
	if (!unl) return

	let progress = player.stats.maxMass.log10().log10().sub(14).div(16).max(0).min(1).toNumber()
	elm.chroma_bg1.setOpacity(progress)
	elm.chroma_bg2.setOpacity(progress)

	//WARNING: PERFORMANCE!
	let high = false
	elm.chroma_bg2.style.setProperty('background', high ? "linear-gradient(45deg, transparent, white, transparent, transparent)" : "linear-gradient(45deg, transparent, white)")
	elm.chroma_bg3.setDisplay(high)
	if (high) elm.chroma_bg3.setOpacity(progress)
}

/*
Thinking about reworking the combination for Primary T3.

   Candidates
// 1 Secondary T2s + 0 Tertiary T1s
// 2 Secondary T1s + 2 Tertiary T1s
// 2 Secondary T1s + 1 Tertiary T1s
*/