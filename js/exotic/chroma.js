let CHROMA = {
	unl: () => player.ext.ch.unl,

	setup() {
		return {
			unl: false,
			tones: [false, false, false, false],
			bp: E(0),
			upg: [],
		}
	},
	calc(dt) {
		if (tmp.ch.toned && tmp.ch.bp_bulk.gt(player.ext.ch.bp)) player.ext.ch.bp = tmp.ch.bp_bulk
	},

	tones: {
		colors: ["Red", "Green", "Blue", "Ultraviolet"],
		effs: ["Mass Upgrades", "BH Condensers", "Cosmic Rays", "Rank"],
		reqs: [E(0), EINF, EINF, EINF],
		toggle(x) {
			if (!player.ext.ch.tones[x] && !this.can(x)) return
			player.ext.ch.tones[x] = !player.ext.ch.tones[x]
			EXOTIC.reset(player.chal.comps[12].eq(0), true)
		},
		can(x) {
			return player.ext.amt.gte(tmp.ch.req) && player.ext.amt.gte(this.reqs[x])
		}
	},

	spices: {
		all: [
			"p1_1", "p2_1", "p3_1",
			"p1_2", "p2_2", "p3_2",
			"p1_3", "p2_3", "p3_3",

			"s1_1", "s2_1", "s3_1",
			"s1_2", "s2_2", "s3_2",

			"t1_1", "t2_1", "t3_1", "t4_1", "t5_1", "t6_1",
		],
		power() {
			let log = player.mass.max(1).log(mlt(3e4))
			if (log.lt(1)) return E(0)
			return log.log10().add(1).pow(.75).sub(1)
		},
		get(x) {
			if (!CHROMA.can(x)) return
			player.ext.ch.upg.push(x)
		},
		can(x) {
			return false
		},

		//PRIMARY
		p1_1: {
			desc: (x) => "Strengthen Exotic Matter by ^"+format(x)+".",
			eff(x) {
				return E(3).sub(E(2).div(x.div(2).add(1)))
			},
		},
		p2_1: {
			desc: (x) => "Raise mass outside of MD, by ^"+format(x)+".",
			eff(x) {
				return x.div(4).add(1).min(2)
			},
		},
		p3_1: {
			desc: (x) => "Raise Radiation self-boosts by ^"+format(x)+".",
			eff(x) {
				return E(1)
			},
		},
		p1_2: {
			desc: (x) => "C12 raises Exotic Matter by ^"+format(x)+".",
			eff(x) {
				return E(1).add(x.div(100)).min(1.05).pow(player.chal.comps[12])
			},
		},
		p2_2: {
			desc: (x) => "Reduce the Mass Dilation penalty by "+format((1-1/x)*100)+"%.",
			eff(x) {
				return x.div(4).add(1).toNumber()
			},
		},
		p3_2: {
			desc: (x) => "Add Neutron Condensers by +^"+format(x,3)+".",
			eff(x) {
				return x.div(30)
			},
		},
		p1_3: {
			desc: (x) => "Supernovae raises Exotic Matter by ^"+format(x)+".",
			eff(x) {
				return player.supernova.times.div(300).add(1).pow(x.mul(0.5).min(2))
			},
		},
		p2_3: {
			desc: (x) => "Green-1 equalizes Ni-28.",
			eff(x) {
				return CHROMA.eff("p2_1").max(1.5)
			},
		},
		p3_3: {
			desc: (x) => "Master Bosons, with new effects.",
			eff(x) {
				return 1
			},
		},

		//SECONDARY
		s1_1: {
			desc: (x) => "Weaken Ultra Fermion scaling by "+format(E(1).sub(E(1).div(x)).mul(100))+"%.",
			eff(x) {
				return x.mul(0.4).add(1)
			},
		},
		s2_1: {
			desc: (x) => "Strengthen Star Boosters by "+format(x)+"x.",
			eff(x) {
				return x.div(2.5).add(1)
			},
		},
		s3_1: {
			desc: (x) => "Weaken Pre-Atom buildings by "+format(x)+"x.",
			eff(x) {
				return E(1.5).pow(x)
			},
		},
		s1_2: {
			desc: (x) => "Dual Fermions give +"+format(x,0)+" Tiers.",
			eff(x) {
				return x.mul(5).floor()
			},
		},
		s2_2: {
			desc: (x) => "Rank boosts Mass by "+format(x)+"x.",
			eff(x) {
				return E(1.1).pow(player.ranks.rank.pow(3))
			},
		},
		s3_2: {
			desc: (x) => "Weaken Cosmic Rays by "+format(x)+"x.",
			eff(x) {
				return E(1.5).pow(x.sub(1)).max(1)
			},
		},

		//TERITARY
		t1_1: {
			desc: (x) => "Bank "+format(x.mul(100))+"% of black hole mass.",
			eff(x) {
				return x.mul(.05).add(.3).min(.7)
			},
		},
		t2_1: {
			desc: (x) => "Bank "+format(x.mul(100))+"% of Hawking Radiation.",
			eff(x) {
				return x.mul(.05).add(.5).min(.7)
			},
		},
		t3_1: {
			desc: (x) => "Cosmic Ray Power weakens pre-Atom Buildings.",
			eff(x) {
				if (!tmp.atom) return E(1)
				return tmp.atom.gamma_ray_eff.pow.log(1e20).max(1)
			},
		},
		t4_1: {
			desc: (x) => "“rad2” and “Os-73” synergize at "+format(x.mul(100))+"% power.",
			eff(x) {
				return x.div(40).min(1)
			},
		},
		t5_1: {
			desc: (x) => "Raise 4th Photon Upgrade by ^"+format(x)+".",
			eff(x) {
				return x.div(10).add(1).min(1.5)
			},
		},
		t6_1: {
			desc: (x) => "Multiply Axion Boosts by "+format(x)+"x.",
			eff(x) {
				return x.div(4).add(1)
			},
		},
	},

	eff(i,v=1) {
		return tmp.ch.eff[i]
	},
	got(i) {
		return tmp.ch.eff && player.ext.ch.upg.includes(i)
	},
}

function updateChromaTemp() {
	let data = {}
	let save = player.ext.ch
	tmp.ch = data
	if (!save.unl) return

	data.toned = 0
	for (var i = 0; i < save.tones.length; i++) if (save.tones[i]) data.toned++
	data.req = EXT.amt([E(0), E("ee100"), E("ee100"), E("ee100")][data.toned])

	data.bp_next = E(10).pow(E(1.6).pow(save.bp).mul(6e13))
	data.bp_bulk = player.mass.div(uni(1)).log10().div(6e13).log(1.6).floor().add(1)
	if (player.mass.lte("e6e13")) data.bp_bulk = E(0)

	let s = CHROMA.spices
	data.pwr = s.power()
	data.eff = {}
	for (var i = 0; i < s.all.length; i++) {
		let id = s.all[i]
		data.eff[id] = s[id].eff(data.pwr)
	}
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
		tmp.el["ch_tone_" + i].setTxt(unl ? CHROMA.tones.colors[i] + (save.tones[i] ? ": ON" : ": OFF") : "Locked")
		tmp.el["ch_eff_" + i].setTxt(unl ? CHROMA.tones.effs[i] : "Req: " + format(CHROMA.tones.reqs[i]) + " EM")
	}

	let s = CHROMA.spices
	let all = s.all
	for (var i = 0; i < all.length; i++) {
		let id = all[i]
		tmp.el["cs_"+id].setTxt(s[id].desc(tmp.ch.eff[id]))
		tmp.el["cs_"+id].setOpacity(CHROMA.got(id) ? 1 : 0.25)
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