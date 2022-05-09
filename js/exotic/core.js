let EXOTIC = {
	setup() {
		return {
			amt: E(0),
			chal: { },
			ec: 0,
			ax: AXION.setup(),
			ch: CHROMA.setup()
		}
	},

	unl(disp) {
		return (disp && player.chal.comps[12].gte(1)) || player.ext.amt.gte(1) || player.ranks.hex.gte(1)
	},
	gain() {
		if (player.chal.comps[12].eq(0)) return E(0)

		let r = player.mass.add(1).log10().div(1e9).add(1)
			.pow(player.supernova.times.mul(player.chal.comps[12].add(1)).div(500))
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
		if (t == 1) return x.eq(0) ? E(0) : x.mul(10).log10().max(0).pow(5).mul(10)
		if (t == 2) return x.div(10).sqrt().mul(10)
		return x
	},
	eff() {
		let r = player.ext.amt
		if (this.extLvl() >= 2) r = r.div(10).pow(2).mul(10)
		if (this.extLvl() >= 1) r = E(10).pow(r.div(10).root(5)).div(10)
		return r
	},

	reset(force, auto) {
		if (!force) {
			if (player.chal.comps[12].eq(0)) return false
			player.ext.amt = player.ext.amt.add(EXT.gain())
		} else if (!auto && player.confirms.ext && !confirm("Are you sure?")) return false
		EXT.doReset()
		return true
	},
	doReset(hex) {
		player.ext.time = 0
		player.ext.chal.f7 = true
		player.ext.chal.f8 = true
		player.ext.chal.f9 = true
		tmp.pass = true

		let list = []
		if (hasTree("qol_ext4")) list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5","chal6","chal7")
		if (hasTree("qol_ext5")) list = list.concat("s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")
		if (hasTree("qol_ext6")) list = list.concat("bs1","bs2","bs3","bs4","fn1","fn2","fn3","fn4","fn5","fn6","fn7","fn8")
		if (hasTree("qol_ext7")) list = list.concat("unl1","rad1","rad2","rad3","rad4","rad5")

		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			let it = player.supernova.tree[x]
			if (list.includes(it)) list_keep.push(it)
			else if (hex && TREE_UPGS.ids[it] && TREE_UPGS.ids[it].perm === 2) list_keep.push(it)
			else if (!hex && TREE_UPGS.ids[it] && TREE_UPGS.ids[it].perm) list_keep.push(it)
		}
		player.supernova.tree = list_keep
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

		SUPERNOVA.doReset()
		updateTemp()

		tmp.pass = false
	},

	calc(dt) {
		if (player.mass.lt(uni("ee10")) && tmp.supernova.bulk.sub(player.supernova.times).round().gte(15)) player.ext.chal.f6 = true
		if (tmp.chal.outside) player.ext.chal.f7 = false
		if (true) player.ext.chal.f9 = false

		//AXIONS
		player.ext.ax.res[0] = player.ext.ax.res[0].add(AXION.prod(0).mul(dt))
		player.ext.ax.res[1] = player.ext.ax.res[1].add(AXION.prod(1).mul(dt))
		player.ext.ax.res[2] = player.ext.ax.res[2].add(AXION.prod(2).mul(dt))

		//CHROMA
		if (!player.ext.ch.unl && CHROMA.unl()) {
			addPopup(POPUP_GROUPS.chroma)
			player.ext.ch.unl = true
		}
		if (player.ext.ch.unl) CHROMA.calc(dt)
	}
}
let EXT = EXOTIC

function updateExoticHTML() {
	tmp.el.app_ext.setDisplay(tmp.tab == 6)
	if (tmp.tab == 6) {
		tmp.el.extAmt2.setHTML(format(player.ext.amt,2)+"<br>"+formatGainOrGet(player.ext.amt, EXT.gain()))
		if (tmp.stab[6] == 0) updateAxionHTML()
		if (tmp.stab[6] == 1) updateChromaHTML()

		tmp.el.hexDisp.setDisplay(RANKS.unl.hex())
		tmp.el.hexAmt.setHTML(format(player.ranks.hex,0))
	}
}


//Extra Buildings
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
			return r
		}
	},
	ag2: {
		start: E("ee6"),
		mul: E("e5e5"),
		pow: E(2.5),
		eff(x) {
			//1.4 * 0.75 = 1.05
			return x.times(tmp.atom ? tmp.atom.atomicEff : E(0)).pow(.75).div(3e3).softcap(1e15, 1/1.05, 0)
		},
		softcapHTML(x) {
			return getSoftcapHTML(x, 1e15)
		}
	},
	ag3: {
		start: E("e7.5e9"),
		mul: E("e2.5e9"),
		pow: E(2),
		eff(x) {
			if (x.eq(0)) return E(0)
			let exp = x.add(1).log(3).div(100)
			return E(tmp.atom ? tmp.atom.atomicEff : E(0)).add(1).pow(exp.min(1/10)).sub(1).mul(hasTree("rad4")?1:2/3).mul(exp.mul(10).max(1))
		}
	}
}

function updateExtraBuildingHTML(type, x) {
	let unl = EXTRA_BUILDINGS.unls[x]()
	let id = type+"_b"+x+"_"
	let data = tmp.eb[type+x]
	let data2 = EXTRA_BUILDINGS[type+x]
	tmp.el[id+"div"].setDisplay(unl)
	if (!unl) return

	tmp.el[id+"cost"].setHTML(format(data.cost,0))
	tmp.el[id+"btn"].setClasses({btn: true, locked: data.gain.lte(getExtraBuildings(type,x))})
	tmp.el[id+"lvl"].setHTML(format(getExtraBuildings(type,x),0))
	tmp.el[id+"pow"].setHTML(format(data.eff) + (data2.softcapHTML ? data2.softcapHTML(data.eff) : ""))
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
	for (let b = EXTRA_BUILDINGS.start[type]; b <= EXTRA_BUILDINGS.max; b++) delete EXTRA_BUILDINGS.saves[type]()["eb"+b]
}
function buyExtraBuildings(type, x) {
	if (CHALS.inChal(14)) return
	if (!EXTRA_BUILDINGS.unls[x]()) return
	if (tmp.eb[type+x].gain.lt(getExtraBuildings(type,x))) return
	EXTRA_BUILDINGS.saves[type]()["eb"+x] = tmp.eb[type+x].gain
}