let EXOTIC = {
	setup() {
		return {
			unl: false,
			amt: E(0),
			chal: {},
			toned: 0,
			ec: 0,
			ax: AXION.setup(),
			ch: CHROMA.setup(),
			pr: PRIM.setup()
		}
	},

	unl(disp) {
		return (disp && player.chal.comps[12].gte(1)) || player.ext.unl
	},
	gain() {
		if (player.chal.comps[12].eq(0)) return E(0)

		let s = player.supernova.times
			.mul(player.chal.comps[12].add(1))
			.div(500)
		if (hasTree("feat11")) s = s.mul(1.2)
		if (hasTree("ext_u1")) s = s.mul(E(1.01).pow(player.chal.comps[12].add(1)))
		if (CHROMA.got("p1_3")) s = s.mul(CHROMA.eff("p1_3"))
		if (CHROMA.got("p1_2")) s = s.mul(CHROMA.eff("p1_2"))

		let r = player.mass.add(1).log10().div(1e9).add(1).pow(s)
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
		if (t == 2) return expMult(x, 0.8)
		return x
	},
	eff(r) {
		if (!r) r = player.ext.amt
		if (this.extLvl() >= 2) r = expMult(r, 1/0.8)
		if (this.extLvl() >= 1) r = E(10).pow(r.div(10).root(5)).div(10)
		if (CHROMA.got("p1_1")) r = expMult(r,CHROMA.eff("p1_1"))
		return r
	},

	reset(force) {
		let can = player.chal.comps[12].gt(0)
		if (!force && player.confirms.ext && !confirm("Are you sure?")) return false
		if (can) player.ext.amt = player.ext.amt.add(EXT.gain())
		EXT.doReset()
		return true
	},
	doReset(zeta) {
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

		let perm_lvl = zeta ? 2 : 1
		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			let it = player.supernova.tree[x]
			if (list.includes(it)) list_keep.push(it)
			else if (it.includes("qol") || it.includes("feat")) list_keep.push(it)
			else if (it.includes("ext") && perm_lvl == 1) list_keep.push(it)
			else if (TREE_UPGS.ids[it] && TREE_UPGS.ids[it].perm >= perm_lvl) list_keep.push(it)
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

		//AXIONS
		player.ext.ax.res[0] = player.ext.ax.res[0].add(AXION.prod(0).mul(dt))
		player.ext.ax.res[1] = player.ext.ax.res[1].add(AXION.prod(1).mul(dt))
		player.ext.ax.res[2] = player.ext.ax.res[2].add(AXION.prod(2).mul(dt))

		if (AXION.unl()) {
			let needUpdate = false
			if (tmp.ax.lvl[20].gt(0)) for (var i = 0; i < 8; i++) if (AXION.buy(i,1)) needUpdate = true
			if (needUpdate) updateAxionLevelTemp()
		}

		//CHROMA
		if (!player.ext.ch.unl && player.chal.comps[13].gte(13)) {
			addPopup(POPUP_GROUPS.chroma)
			player.ext.ch.unl = true
		} else if (player.ext.ch.unl) CHROMA.calc(dt)

		//PRIMORDIUMS
		if (!player.ext.pr.unl && AXION.unl() && E(tmp.ax.lvl[22]).gt(0)) {
			addPopup(POPUP_GROUPS.prim)
			player.ext.pr.unl = true
		} else if (player.ext.pr.unl) PRIM.calc(dt)
	}
}
let EXT = EXOTIC

function updateExoticHTML() {
	elm.app_ext.setDisplay(tmp.tab == 6)
	if (tmp.tab == 6) {
		elm.extAmt2.setHTML(format(player.ext.amt,2)+"<br>"+formatGainOrGet(player.ext.amt, EXT.gain()))
		elm.extTone.setHTML(format(player.ext.toned,0)+(canTone() ? "<br>(+" + format(1,0) + ")" : ""))
		if (tmp.stab[6] == 0) updateAxionHTML()
		if (tmp.stab[6] == 1) updateChromaHTML()
		if (tmp.stab[6] == 2) updatePrimHTML()
	}
}

function setupExtHTML() {
	//AXIONS
	var html = ""
	for (var y = -1; y < AXION.maxRows; y++) {
		html += "</tr><tr>"
		for (var x = -1; x < 5; x++) {
			var x_empty = x == -1 || x == 4
			var y_empty = y == -1
			if (x_empty && y_empty) html += "<td class='ax'></td>"
			if (!x_empty && y_empty) html += `<td class='ax'><button class='btn_ax normal' id='ax_upg`+x+`' onmouseover='hoverAxion("u`+x+`")' onmouseleave='hoverAxion()' onclick="AXION.buy(`+x+`)">X`+(x+1)+`</button></td>`
			if (x_empty && !y_empty && y < 4) {
				var type = x == 4 ? 2 : 1
				html += `<td class='ax'><button class='btn_ax normal' id='ax_upg` +(y+4*type)+`' onmouseover='hoverAxion("u`+(y+4*type)+`")' onmouseleave='hoverAxion()' onclick="AXION.buy(`+(y+4*type)+`)">`+["","Y","Z"][type]+(y+1)+`</button></td>`
			}
			if (!x_empty && !y_empty) html += `<td class='ax'><button class='btn_ax' id='ax_boost`+(y*4+x)+`' onmouseover='hoverAxion("b`+(y*4+x)+`")' onmouseleave='hoverAxion()'><img src='images/axion/b`+(y*4+x)+`.png' style="position: relative"></img></button></td>`
		}
	}
	new Element("ax_table").setHTML(html)

	//CHROMA
	var html = ""
	var sData = CHROMA.spices
	for (var y = 0; y < sData.rows.length; y++) {
		var sp = sData.rows[y]
		html += `<div class="table_center">`
		for (var x = 0; x < 4; x++) {
			if (x == 0) html += `<button id="cs_${sp}_a" onclick="CHROMA.get('${sp}')"></button>`
			else if (sData.all.includes(sp+"_"+x)) html += `<div class="boost_cs" id="cs_${sp}_${x}" style='border-color: ${sData[sp+"_"+x].color}'></div>`
			else html += `<div class="boost_cs"></div>`
		}
		html += `</div>`
	}
	new Element("ch_table").setHTML(html)

	//PRIM
	var html = ""
	for (var y = 0; y < 4; y++) {
		var conv = PRIM.conv[y]
		html += `</tr><tr id='pr_cr${y}'>`
		for (var x = 0; x < 4; x++) {
			var ratio = conv.ratios[x]
			var div = PRIM.disp(ratio[0], conv.res[0], true) + " -> "
			var l = 0
			for (var i = 1; i < conv.ratios[0].length; i++) {
				if (ratio[i] == 0) continue
				if (l) div += ", "
				div += PRIM.disp(ratio[i], conv.res[i])
				l++
			}
			html += `<td class='pr'><button class='btn' id='pr_c${y*10+x}' style='width: 150px; height: 48px' onclick='PRIM.toggle(${y}, ${x})'>${div}</button></td>`
		}
	}
	new Element("pr_cloud").setHTML(html)

	var html = ""
	for (var x = 0; x < 8; x++) {
		html += `
		<div class="primordium table_center">
			<div style="width: 240px; height: 54px;">
				<h2>${PRIM.prim[x].name} Particles [${PRIM.prim[x].sym}]</h2><br>[<span id="pr_${x}"></span>]
			</div><div style="width: 240px; height: 54px; background: transparent; box-shadow: 0 0 6px #ffdf00; color: white" id="pr_eff${x}"></div>
		</div>
		`
	}
	new Element("pr_table").setHTML(html)
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
			if (hasPrim("p2_0")) r = r.add(tmp.pr.eff["p2_0"])
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
			if (CHROMA.got("p3_2")) r = r.add(CHROMA.eff("p3_2"))
			return r
		}
	},
	ag2: {
		start: E("ee6"),
		mul: E("e5e5"),
		pow: E(2.5),
		eff(x) {
			//1.4 * 0.75 = 1.05
			return x.times(tmp.atom ? tmp.atom.atomicEff : E(0)).pow(.75).div(3e3)
		}
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
		if (type == "bh" && b == 2 && CHROMA.got("t2_1")) s["eb"+b] = s["eb"+b].pow(CHROMA.eff("t2_1"))
		else delete s["eb"+b]
	}
}
function buyExtraBuildings(type, x) {
	if (CHALS.inChal(14)) return
	if (!EXTRA_BUILDINGS.unls[x]()) return
	if (tmp.eb[type+x].gain.lt(getExtraBuildings(type,x))) return
	EXTRA_BUILDINGS.saves[type]()["eb"+x] = tmp.eb[type+x].gain
}


//TONES
function canTone() {
	let reqs = [E(1e20), E(1e70), E("1e600"), E("e1e6"), E("e1e8")]
	return player.ext.amt.gte(EXT.amt(reqs[player.ext.toned])) && player.ext.toned < 5
}

function tone() {
	let colors = ["Red", "Green", "Blue", "Violet", "Ultraviolet"]
	let res = ["Mass Upgrades", "BH Condensers", "Cosmic Rays", "Ranks", "Supernovae and Fermions"]

	if (!canTone()) return
	if (!confirm("[" + colors[player.ext.toned] + " Tone] This will perform a Supernova reset to change " + res[player.ext.toned] + ". Colors await...")) return
	player.ext.toned++
	SUPERNOVA.doReset()
}

function toned() {
	return player.ext.toned
}