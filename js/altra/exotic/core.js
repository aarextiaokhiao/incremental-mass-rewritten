let EXOTIC = {
	setup() {
		return {
			unl: false,
			amt: E(0),
			gain: E(1),

			chal: {},
			ec: 0,

			toned: 0,
			ar39: E(0),

			ax: AXION.setup(),
			ch: GLUBALL.setup(),
			pr: PRIM.setup()
		}
	},

	unl(disp) {
		return (disp && player.chal.comps[12].gte(1)) || player.ext.unl || PRES.unl()
	},
	gain() {
		let s = player.supernova.times
			.mul(player.chal.comps[12].add(1))
			.div(500)
		if (hasTree("feat11")) s = s.mul(1.2)
		if (hasTree("ext_u1")) s = s.mul(E(1.01).pow(player.chal.comps[12].add(1)))
		if (GLUBALL.got("p1_3")) s = s.mul(GLUBALL.eff("p1_3"))
		if (GLUBALL.got("p1_2")) s = s.mul(GLUBALL.eff("p1_2"))

		let r = player.mass.max(1).log10().div(1e9).add(1).pow(s)
		return this.amt(r)
	},
	extLvl() {
		let l = 0
		if (hasTree("feat9")) l++
		if (hasTree("feat10")) l++
		return l
	},
	amt(r) {
		r = E(r)
		if (this.extLvl() >= 1) r = this.reduce(1, r)
		if (this.extLvl() >= 2) r = this.reduce(2, r)
		return r
	},
	reduce(t, x) {
		if (t == 1) return x.max(1).mul(10).log10().pow(5).mul(10)
		if (t == 2) return expMult(x, 0.8)
		return x
	},
	reduceAmt() {
		player.ext.amt = EXT.reduce(EXT.extLvl(), player.ext.amt)
		player.ext.gain = EXT.reduce(EXT.extLvl(), player.ext.gain)
	},
	eff(r) {
		if (!r) r = player.ext.amt
		if (this.extLvl() >= 2) r = expMult(r, 1/0.8)
		if (this.extLvl() >= 1) r = E(10).pow(r.div(10).root(5)).div(10)
		if (GLUBALL.got("p1_1")) r = expMult(r,GLUBALL.eff("p1_1"))
		return r
	},

	reset(force) {
		let can = player.chal.comps[12].gt(0)
		if (!force) {
			if (!can) return
			if (player.confirms.ext && !confirm("Are you sure?")) return false
		}
		player.ext.amt = player.ext.amt.add(player.ext.gain)
		EXT.doReset()
		return true
	},
	doReset(pres) {
		player.ext.time = 0
		player.ext.gain = E(1)
		player.ext.chal.f7 = true
		player.ext.chal.f8 = true
		player.ext.chal.f9 = true
		tmp.pass = true

		if (!pres) {
			let list = []
			if (hasTree("qol_ext4")) list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5","chal6","chal7")
			if (hasTree("qol_ext5")) list = list.concat("s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")
			if (hasTree("qol_ext6")) list = list.concat("bs1","bs2","bs3","bs4","fn1","fn2","fn3","fn4","fn5","fn6","fn7","fn8")
			if (hasTree("qol_ext7")) list = list.concat("unl1","rad1","rad2","rad3","rad4","rad5")

			let list_keep = []
			for (let x = 0; x < player.supernova.tree.length; x++) {
				let it = player.supernova.tree[x]
				if (list.includes(it)) list_keep.push(it)
				else if (it.includes("qol") || it.includes("feat")) list_keep.push(it)
				else if (it.includes("ext")) list_keep.push(it)
				else if (TREE_UPGS.ids[it] && TREE_UPGS.ids[it].perm) list_keep.push(it)
			}
			player.supernova.tree = list_keep
		}

		player.supernova.times = E(0)
		player.supernova.stars = E(0)

		for (let c = 1; c <= 12; c++) player.chal.comps[c] = E(hasTree("qol_ext4") && c <= 8 ? 50 : hasTree("qol_ext6") && c <= 11 ? 10 : 0)

		player.supernova.bosons = {
			pos_w: E(0),
			neg_w: E(0),
			z_boson: E(0),
			photon: E(0),
			gluon: E(0),
			graviton: E(0),
			hb: E(0),
		}
		player.supernova.b_upgs = {
			photon: [ E(0), E(0), E(0), E(0) ],
			gluon: [ E(0), E(0), E(0), E(0) ],
		}
		player.supernova.fermions = {
			unl: false,
			points: [E(0),E(0)],
			tiers: [[E(0),E(0),E(0),E(0),E(0),E(0)],[E(0),E(0),E(0),E(0),E(0),E(0)]],
			choosed: player.supernova.fermions.choosed,
			choosed2: player.supernova.fermions.choosed2,
			dual: player.supernova.fermions.dual
		}
		if (hasTree("qol_ext4")) {
			for (var i = 0; i < 2; i++) {
				for (var t = 0; t < 6; t++) player.supernova.fermions.tiers[i][t] = E(10)
			}
		}
		player.supernova.radiation = {
			hz: E(0),
			ds: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			bs: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
		}
		player.supernova.auto = {
			toggle: player.supernova.auto.toggle,
			on: -2,
			t: 0
		}

		player.ext.pr.bp = E(0)
		player.ext.pr.pt = E(0)
		for (var i = 0; i < 8; i++) player.ext.pr.prim[i] = E(0)

		SUPERNOVA.doReset()
		updateTemp()

		tmp.pass = false
	},

	calc(dt) {
		if (player.ext.amt.gt(0)) player.ext.unl = true
		if (!player.ext.unl) return

		if (player.mass.lt(uni("ee10")) && tmp.supernova.bulk.sub(player.supernova.times).round().gte(15)) player.ext.chal.f6 = true
		if (tmp.chal.outside) player.ext.chal.f7 = false
		if (player.supernova.fermions.choosed == "") player.ext.chal.f9 = false
		player.ext.gain = player.ext.gain.max(this.gain())

		if (hasPrim("p1_0")) player.ext.ar39 = player.ext.ar39.add(tmp.pr.eff.p1_0.mul(dt))

		//AXIONS
		player.ext.ax.res[0] = player.ext.ax.res[0].add(AXION.prod(0).mul(dt))
		player.ext.ax.res[1] = player.ext.ax.res[1].add(AXION.prod(1).mul(dt))
		player.ext.ax.res[2] = player.ext.ax.res[2].add(AXION.prod(2).mul(dt))

		if (AXION.unl()) {
			let needUpdate = false
			if (tmp.ax.lvl[24].gt(0)) for (var i = 0; i < 8; i++) if (AXION.buy(i,1)) needUpdate = true
			if (needUpdate) updateAxionLevelTemp()
		}

		//GLUEBALLS
		if (!player.ext.ch.unl && player.chal.comps[13].gte(13)) {
			addPopup(POPUP_GROUPS.chroma)
			player.ext.ch.unl = true
		} else if (player.ext.ch.unl) GLUBALL.calc(dt)

		//PRIMORDIUMS
		if (!player.ext.pr.unl && AXION.unl() && E(tmp.ax.lvl[26]).gt(0)) {
			addPopup(POPUP_GROUPS.prim)
			player.ext.pr.unl = true
		} else if (player.ext.pr.unl) PRIM.calc(dt)
	}
}
let EXT = EXOTIC

//HTML
function updateExoticHTML() {
	elm.app_ext.setDisplay(tmp.tab == 6)
	if (tmp.tab == 6) {
		updateExoticHeader()
		if (tmp.stab[6] == 0) updateAxionHTML()
		if (tmp.stab[6] == 1) updateGlueballHTML()
		if (tmp.stab[6] == 2) updatePrimHTML()
	}
}

function updateExoticHeader() {
	elm.extDiv2.setDisplay(tmp.stab[6] == 0)
	elm.extAmt2.setHTML(format(player.ext.amt,1)+(player.chal.comps[12].gt(0)?"<br>"+formatGainOrGet(player.ext.amt, player.ext.gain):""))

	elm.polarDiv.setDisplay(tmp.stab[6] == 1)
	elm.polarEff.setHTML(format(tmp.polarize)+"x Buildings")

	elm.ar39Div.setDisplay(tmp.stab[6] == 2)
	elm.ar39Eff.setHTML("+"+format(player.ext.ar39)+"x <sup>39</sup>Ar")

	elm.toneDiv.setDisplay(GLUBALL.unl())
	elm.extTone.setHTML(toned()==TONES.max?"Maxed!":format(player.ext.toned,0)+"<br>"+(TONES.can() ? "(+" + format(1,0) + ")":"(requires " + format(TONES.req()) + ")"))
}

/* [ EXOTIC ERA CONTENT ] */

// Extra Buildings
let EXTRA_BUILDINGS = {
	unls: {
		2: () => hasTree("eb1"),
		3: () => hasTree("eb2")
	},
	max: 3,
	kind: ["bh", "ag"],
	start: {
		bh: 2,
		ag: 2
	},
	res: {
		bh: () => player.bh.dm,
		ag: () => player.atom.points,
	},
	saves: {
		bh: () => player.bh,
		ag: () => player.atom,
	},
	bh2: {
		start: E("e2e6"),
		mul: E("ee6"),
		pow: E(2),
		eff(x) {
			let r = x.times(5).add(1).log(2).div(500)
			if (AXION.unl()) r = r.mul(tmp.ax.eff[9])
			return r
		}
	},
	bh3: {
		start: E("e5e8"),
		mul: E("ee9"),
		pow: E(3),
		eff(x) {
			if (x.eq(0)) return E(0)
			if (AXION.unl() && tmp.bh && player.bh.mass.lt(tmp.bh.rad_ss)) x = x.pow(tmp.ax.eff[10])

			let r = x.add(1).log10().add(5).div(25)
			if (GLUBALL.got("p3_2")) r = r.add(GLUBALL.eff("p3_2"))
			return r
		}
	},
	ag2: {
		start: E("ee6"),
		mul: E("e5e5"),
		pow: E(2.5),
		eff(x) {
			//1.4 * 0.75 = 1.05
			return x.times(tmp.atom ? tmp.atom.atomicEff : E(0)).pow(.75).div(3e3).softcap(1e11,5/6*1/1.05,0)
		},
		softcapHTML: (x) => getSoftcapHTML(x, 1e11)
	},
	ag3: {
		start: E("e7.5e9"),
		mul: E("e2.5e9"),
		pow: E(2),
		eff(x) {
			if (x.eq(0)) return E(0)
			let exp = x.add(1).log(3).div(100)
			return E(tmp.atom ? tmp.atom.atomicEff : E(0)).add(1).pow(exp.min(1/20)).sub(1).mul(hasTree("rad4")?1:2/3)
		}
	}
}

function updateExtraBuildingHTML(type, x) {
	let unl = EXTRA_BUILDINGS.unls[x]()
	let id = type+"_b"+x+"_"
	let data = tmp.eb[type+x]
	let data2 = EXTRA_BUILDINGS[type+x]
	elm[id+"div"].setDisplay(unl)
	if (!unl) return

	elm[id+"cost"].setHTML(format(data.cost,0))
	elm[id+"btn"].setClasses({btn: true, locked: data.gain.lte(getExtraBuildings(type,x))})
	elm[id+"lvl"].setHTML(format(getExtraBuildings(type,x),0))
	elm[id+"pow"].setHTML(format(data.eff,type=="bh"&&x==3?3:2) + (data2.softcapHTML ? data2.softcapHTML(data.eff) : ""))
}

function updateExtraBuildingsHTML(type) {
	for (let b = EXTRA_BUILDINGS.start[type]; b <= EXTRA_BUILDINGS.max; b++) updateExtraBuildingHTML(type, b)
}

function updateExtraBuildingTemp() {
	let data = {}
	tmp.eb = data
	for (let k = 0; k < EXTRA_BUILDINGS.kind.length; k++) {
		let id = EXTRA_BUILDINGS.kind[k]
		for (let b = EXTRA_BUILDINGS.start[id]; b <= EXTRA_BUILDINGS.max; b++) {
			if (EXTRA_BUILDINGS.unls[b]()) {
				let amt = getExtraBuildings(id, b)
				let data = EXTRA_BUILDINGS[id+b]
				let cost = data.mul.pow(amt.pow(data.pow)).mul(data.start)
				let res = EXTRA_BUILDINGS.res[id]()
				tmp.eb[id+b] = {
					cost: cost,
					gain: cost.gt(res) ? E(0) : res.div(data.start).log(data.mul).root(data.pow).add(1).floor(),
					eff: data.eff(amt),
				}
			}
		}
	}
}

function getExtraBuildings(type, x) {
	return E(EXTRA_BUILDINGS.saves[type]()["eb"+x] || 0)
}
function resetExtraBuildings(type) {
	let s = EXTRA_BUILDINGS.saves[type]()
	for (let b = EXTRA_BUILDINGS.start[type]; b <= EXTRA_BUILDINGS.max; b++) {
		if (type == "bh" && b == 2 && GLUBALL.got("t2_1")) s["eb"+b] = s["eb"+b].pow(GLUBALL.eff("t2_1"))
		else delete s["eb"+b]
	}
}
function buyExtraBuildings(type, x) {
	if (CHALS.inChal(14)) return
	if (!EXTRA_BUILDINGS.unls[x]()) return
	if (tmp.eb[type+x].gain.lt(getExtraBuildings(type,x))) return
	EXTRA_BUILDINGS.saves[type]()["eb"+x] = tmp.eb[type+x].gain
}

// SHORTCUTS
function updateShortcuts() {
	let edit = SHORTCUT_EDIT.mode
	let quick = player.md.active || CHALS.lastActive() || player.supernova.fermions.choosed
	let data = []
	if (edit == 0) data = player.shrt.order
	else {
		data = [[0],[1],[2]]
		if (AXION.unl && tmp.ax.lvl[27].gt(0)) data.push([3])
	}

	for (var i = 0; i < 7; i++) {
		let unl = i < data.length
		if (edit == 0) unl = unl && (i < 4 || (AXION.unl() && tmp.ax.lvl[27].gt(0)))
		elm["shrt_"+i].setVisible(unl)
		if (unl) {
			let id = data[i]
			let mode = id[0] + 1
			let ix = id[1]
			document.getElementById("shrt_"+i).setAttribute("src", "images/" + (!edit && mode == 3 ? "ferm-" + ["qua","lep"][Math.floor(ix / 10)] : ix > 0 && mode == 2 ? "chal_" + ["dm","atom","sn","ext"][Math.ceil(ix/4)-1] : ["empty", "md", "chal", "ferm", "exit"][mode]) + ".png")
			document.getElementById("shrt_"+i+"_tooltip").setAttribute("tooltip", ix >= 0 && mode == 3 ? FERMIONS.sub_names[Math.floor(ix / 10)][ix % 10] : ix > 0 && mode == 2 ? CHALS[id[1]].title : ["Add Shortcut", "Mass Dilation", "Challenge (Proceed to Challenges tab)", "Fermion (Proceed to Fermions tab)", "Exit"][mode])
		} else document.getElementById("shrt_"+i+"_tooltip").removeAttribute("tooltip")
	}
	document.getElementById("shrt_m").setAttribute("src", "images/" + (edit ? (quick ? "quick" : "cancel") : ["click", "edit", "remove"][SHORTCUT_EDIT.cur]) + ".png")
	document.getElementById("shrt_m_tooltip").setAttribute("tooltip", (edit ? (quick ? "Quick Add" : "Cancel (discard your changes)") : ["Mode: Normal (click to switch)", "Mode: Edit", "Mode: Remove"][SHORTCUT_EDIT.cur]))
}

function doShortcut(a, b) {
	if (a == 0) MASS_DILATION.onactive()
	if (a == 1) {
		if (b == -1) CHALS.exit()
		else {
			player.chal.choosed = b
			CHALS.enter()
		}
	}
	if (a == 2) FERMIONS.choose(Math.floor(b / 10), b % 10)
	if (a == 3) {
		if (player.md.active) MASS_DILATIOn.onactive()
		else if (player.supernova.fermions.choosed) FERMIONS.backNormal()
		else if (CHALS.lastActive()) CHALS.exit()
	}
}

function editShortcut(x) {
	SHORTCUT_EDIT.mode = 1
	SHORTCUT_EDIT.pos = x
}

function switchShortcut() {
	if (SHORTCUT_EDIT.mode) {
		if (player.md.active) player.shrt.order[SHORTCUT_EDIT.pos] = [0, -1]
		else if (player.supernova.fermions.choosed) player.shrt.order[SHORTCUT_EDIT.pos] = [2, parseInt(player.supernova.fermions.choosed)]
		else if (CHALS.lastActive()) player.shrt.order[SHORTCUT_EDIT.pos] = [1, CHALS.lastActive()]
		SHORTCUT_EDIT.mode = 0
		return
	}
	SHORTCUT_EDIT.cur = (SHORTCUT_EDIT.cur + 1) % 3
	updateShortcuts()
}

function clickShortcut(x) {
	if (SHORTCUT_EDIT.mode) {
		if (x == 0 || x == 3) {
			player.shrt.order[SHORTCUT_EDIT.pos] = [x, -1]
			SHORTCUT_EDIT.mode = 0
		}
		if (x == 1) TABS.choose(3)
		if (x == 2) {
			TABS.choose(5)
			tmp.stab[5] = 2
		}
		return
	}
	let d = player.shrt.order[x]
	let m = SHORTCUT_EDIT.cur
	if (d[0] < 0 || m == 1) editShortcut(x)
	else if (m == 2) {
		if (!confirm("Are you sure do you want to delete this shortcut?")) return
		player.shrt.order[x] = [-1, -1]
		updateShortcuts()
	} else doShortcut(d[0], d[1])
}

let SHORTCUT_EDIT = {
	mode: 0,
	pos: 0,
	cur: 0
}

// POLARIZER
function updatePolarizeTemp() {
	tmp.polarize = E(1)
	if (GLUBALL.got("s3_1")) tmp.polarize = tmp.polarize.mul(GLUBALL.eff("s3_1"))
}

// COSMIC ARGONS
function getCosmicArgonProd() {
	let r = E(0)
	if (hasPrim("p2_0")) r = tmp.pr.eff.p2_0
	if (AXION.unl()) r = r.mul(tmp.ax.eff[23])
}

// TECHNICAL FUNCTIONS
function hasQolExt9() {
	return hasTree("qol_ext9") && player.ext.ec < 14
}