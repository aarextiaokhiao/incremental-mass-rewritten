let GLUBALL = {
	unl: () => player.ext.ch.unl,

	setup() {
		return {
			unl: false,
			bp: E(0),
			upg: [],
		}
	},
	calc(dt) {
		if (player.ext.toned && tmp.ch.bp_bulk.gt(player.ext.ch.bp)) player.ext.ch.bp = tmp.ch.bp_bulk
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
			if (hasPrim("p0_0")) start = start.root(tmp.pr.eff.p0_0)

			let log = player.mass.max(1).log(start)
			if (log.lt(1)) return E(0)
			return log.log10().div(2).add(1).root(TONES.power(2)).sub(1)
		},
		cost(x) {
			return tmp.ch.mlt.mul(player.ext.ch.upg.length).floor()
		},
		next(x) {
			if (GLUBALL.got(x+"_2")) return x+"_3"
			if (GLUBALL.got(x+"_1")) return x+"_2"
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
				return x.div(3).add(1).pow(1.5).min(2)
			},
		},
		p2_1: {
			desc: (x) => "Raise mass by ^"+format(x)+". [reduced in MD]",
			color: "#007f00",
			eff(x) {
				return x.div(tmp.md && tmp.md.active ? 10 : 2).add(1).cbrt().min(1.5)
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
				return E(1.03).pow(player.chal.comps[12])
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
				return x.div(15)
			},
		},
		p1_3: {
			desc: (x) => "Supernovae raises Exotic Matter by ^"+format(x)+".",
			color: "#ff0000",
			eff(x) {
				return player.supernova.times.div(300).add(1).pow(x.mul(0.5).min(1))
			},
		},
		p2_3: {
			desc: (x) => "Mass Dilation doesn't affect Atomic Power.",
			color: "#00ff00",
			eff(x) {
				return 1
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
				return x.div(2).add(1)
			},
		},
		s3_1: {
			desc: (x) => "Unlock Polarizer. ("+format(x)+"x to Pre-Atom)",
			color: "#7f007f",
			eff(x) {
				let b = E(1.5)
				if (hasPrim("p3_0")) b = b.mul(tmp.pr.eff.p3_0)
				return b.pow(x)
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
				return E(10).pow(player.ranks.rank.mul(x.div(50).min(.08)).pow(3))
			},
		},
		s3_2: {
			desc: (x) => "Polarizer weakens Cosmic Rays by "+format(x)+"x.",
			color: "#bf00bf",
			eff(x) {
				return tmp.polarize ? tmp.polarize.div(2).max(1) : E(1)
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
			desc: (x) => "Add +^"+format(x,3)+" to Neutron Condensers.",
			color: "#007f3f",
			eff(x) {
				return x.div(10)
			},
		},
		t4_1: {
			desc: (x) => "Raise Neutron Stars by ^"+format(x)+".",
			color: "#003f7f",
			eff(x) {
				return x.min(10).mul(50).add(1)
			},
		},
		t5_1: {
			desc: (x) => "Tier scales linearly, but nullify Neutrino.",
			color: "#3f007f",
			eff(x) {
				return 1
			},
		},
		t6_1: {
			desc: (x) => "Add Axion Strength by "+formatMultiply(x)+".",
			color: "#7f003f",
			eff(x) {
				return x.div(30).add(1)
			},
		},
	},

	eff(i,v=1) {
		return tmp.ch.eff[i]
	},
	can(x) {
		if (player.ext.ch.bp.lt(GLUBALL.spices.cost())) return false

		let next = GLUBALL.spices.next(x)
		if (GLUBALL.got(next)) return false
		if (!GLUBALL.spices.all.includes(next)) return false

		if (next[0] == "p") {
			if (next[3] == "1") return true

			let left = next[1] == 1 ? 3 : next[1] - 1
			let right = next[1]
			if (next[3] == "2") return GLUBALL.got("s" + left + "_1") && GLUBALL.got("s" + right + "_1")

			let count = 0
			if (GLUBALL.got("t" + (left * 2) + "_1")) count++
			if (GLUBALL.got("t" + (left * 2 - 1) + "_1")) count++
			if (GLUBALL.got("t" + (right * 2) + "_1")) count++
			if (GLUBALL.got("t" + (right * 2 - 1) + "_1")) count++
			return count >= 1 //2
		}
		if (next[0] == "s") {
			if (next[3] != "1") return GLUBALL.got("t" + (next[1] * 2) + "_" + (next[3] - 1)) && GLUBALL.got("t" + (next[1] * 2 - 1) + "_" + (next[3] - 1))
			return GLUBALL.got("p" + next[1] + "_" + next[3]) && GLUBALL.got("p" + (next[1] % 3 + 1) + "_" + next[3])
		}
		if (next[0] == "t") return GLUBALL.got("s" + Math.ceil(next[1] / 2) + "_" + next[3]) && GLUBALL.got("s" + (Math.ceil(next[1] / 2) % 3 + 1) + "_" + next[3])
		return false
	},
	get(x) {
		if (!GLUBALL.can(x)) return
		player.ext.ch.upg.push(GLUBALL.spices.next(x))
	},
	got(i) {
		return tmp.ch.eff && player.ext.ch.upg.includes(i)
	},
	respec() {
		if (!confirm("Are you sure do you want to respec your Glueball?")) return
		EXT.reset(true)
		player.ext.ch.upg = []
	}
}

function updateGlueballTemp() {
	let data = {}
	let save = player.ext.ch
	tmp.ch = data
	if (!save.unl) return


	let extra = E(0)
	let fP = E(1)
	if (tmp.chal) {
		extra = tmp.chal.eff[14].fg_add
		fP = tmp.chal.eff[14].fg_mul
	}
	if (AXION.unl()) fP = fP.mul(tmp.ax.eff[22])
	if (hasPrim("p7_0")) fP = fP.mul(tmp.pr.eff.p7_0)

	let em_log = EXT.eff().max(10).log10()
	data.bp_next = E(10).pow(E(1.75).pow(save.bp.sub(extra).div(fP)).mul(1e15).div(em_log))
	data.bp_bulk = player.mass.max(1).log10().mul(em_log).div(1e15).log(1.75).mul(fP).add(extra).floor().add(1)

	let s = GLUBALL.spices
	data.pwr = s.power()
	data.mlt = E(1)
	data.eff = {}
	for (var i = 0; i < s.all.length; i++) {
		let id = s.all[i]
		data.eff[id] = s[id].eff(data.pwr)
		if (GLUBALL.got(id)) {
			if (id[3] != "1") data.mlt = data.mlt.mul(0.8)
			else if (id[0] == "p") data.mlt = data.mlt.mul(1.2)
			else if (id[0] == "s") data.mlt = data.mlt.mul(1.5)
			else if (id[0] == "t") {
				let b = E(2)
				if (hasPrim("p6_0")) b = b.root(tmp.pr.eff.p6_0)
				data.mlt = data.mlt.mul(b)
			}
		}
	}
}

//HTML
function setupGlueballHTML() {
	var html = ""
	var sData = GLUBALL.spices
	for (var y = 0; y < sData.rows.length; y++) {
		var sp = sData.rows[y]
		html += `<div class="table_center">`
		for (var x = 0; x < 4; x++) {
			if (x == 0) html += `<button id="cs_${sp}_a" onclick="GLUBALL.get('${sp}')"></button>`
			else if (sData.all.includes(sp+"_"+x)) html += `<div class="boost_cs" id="cs_${sp}_${x}" style='border-color: ${sData[sp+"_"+x].color}'></div>`
			else html += `<div class="boost_cs"></div>`
		}
		html += `</div>`
	}
	new Element("ch_table").setHTML(html)
}

function updateGlueballHTML() {
	let save = player.ext.ch
	elm.ch_bp.setTxt(format(save.bp, 0) + " Free Gluons")
	elm.ch_nxt.setTxt(player.ext.toned ? "(next at " + formatMass(tmp.ch.bp_next) + ")" : "")

	let s = GLUBALL.spices
	let all = s.all
	for (var i = 0; i < all.length; i++) {
		let id = all[i]
		elm["cs_"+id].setTxt(s[id].desc(tmp.ch.eff[id]))
		elm["cs_"+id].setOpacity(GLUBALL.got(id) ? 1 : 0.25)
		elm["cs_"+id].setDisplay(s.unl(id))
	}
	let rows = s.rows
	for (var i = 0; i < rows.length; i++) {
		let id = rows[i]
		elm["cs_"+id+"_a"].setClasses({btn: true, locked: !GLUBALL.can(id), btn_cs: true})
		elm["cs_"+id+"_a"].setTxt(GLUBALL.got(id+"_1") ? "Extend" : id[0] == "p" ? "Assign" : "Spread")
		elm["cs_"+id+"_a"].setDisplay(s.unl(id+"_1"))
	}

	elm.ch_rs.setVisible(save.upg.length > 0)
	elm.ch_pwr.setTxt(save.upg.length > 0 ? "Luminosity: " + format(tmp.ch.pwr.mul(100)) + "%" : "")
	elm.ch_nxt_assign.setTxt(save.upg.length > 0 && save.upg.length < 21 ? "Next: " + format(GLUBALL.spices.cost(),0) + " Free Gluons" : "")
}

function toggleChromaBG() {
	if (player.options.noChroma && !confirm("Warning! This will cause high performance for your PC / phone! Are you sure about that?!")) return
	player.options.noChroma = !player.options.noChroma
}

function updateChromaScreen() {
	let unl = GLUBALL.unl() && !PRES.unl() && !player.options.noChroma
	elm.chroma_bg.setDisplay(unl)
	if (!unl) return

	let progress = player.stats.maxMass.log10().log10().div(21).log(4).max(0).min(1)
	elm.chroma_bg1.setOpacity(progress)
	elm.chroma_bg2.setOpacity(progress)

	//WARNING: PERFORMANCE!
	let high = false
	elm.chroma_bg2.style.setProperty('background', high ? "linear-gradient(45deg, transparent, white, transparent, transparent)" : "linear-gradient(45deg, transparent, white)")
	elm.chroma_bg3.setDisplay(high)
	if (high) elm.chroma_bg3.setOpacity(progress)
}