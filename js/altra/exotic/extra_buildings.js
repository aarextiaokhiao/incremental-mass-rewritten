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
		start: D("e2e6"),
		mul: D("ee6"),
		pow: D(2),
		eff(x) {
			let r = x.times(5).add(1).log(2).div(500)
			//if (AXION.unl()) r = r.mul(tmp.ax.eff[9])
			return r.softcap(1e12,2,3)
		},
		dispHTML: (x) => format(x,3) + "x" + getSoftcapHTML(x, 1e12)
	},
	bh3: {
		start: D("e5e8"),
		mul: D("ee9"),
		pow: D(3),
		eff(x) {
			if (x.eq(0)) return D(0)
			//if (AXION.unl() && tmp.bh && player.bh.mass.lt(tmp.bh.rad_ss)) x = x.pow(tmp.ax.eff[10])

			let r = x.add(1).log10().add(5).div(25)
			return r.softcap(1,3,1)
		},
		dispHTML: (x) => "^" + format(x,3) + getSoftcapHTML(x,1)
	},
	ag2: {
		start: D("ee6"),
		mul: D("e5e5"),
		pow: D(2.5),
		eff(x) {
			//1.4 * 0.75 = 1.05
			return x.times(tmp.atom ? tmp.atom.atomicEff : D(0)).pow(.75).div(3e3).softcap(1e11,5/6*1/1.05,0)
		},
		dispHTML: (x) => getSoftcapHTML(x, 1e11)
	},
	ag3: {
		start: D("e7.5e9"),
		mul: D("e2.5e9"),
		pow: D(2),
		eff(x) {
			if (x.eq(0)) return D(0)
			let exp = x.add(1).log(3).div(100)
			return D(tmp.atom ? tmp.atom.atomicEff : D(0)).add(1).pow(exp.min(1/20)).sub(1).mul(2/3)
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
	elm[id+"pow"].setHTML(data2.dispHTML ? data2.dispHTML(data.eff) : format(data.eff,type=="bh"&&x==3?3:2))
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
					gain: cost.gt(res) ? D(0) : res.div(data.start).log(data.mul).root(data.pow).add(1).floor(),
					eff: data.eff(amt),
				}
			}
		}
	}
}

function getExtraBuildings(type, x) {
	return D(EXTRA_BUILDINGS.saves[type]()["eb"+x] || 0)
}
function resetExtraBuildings(type) {
	let s = EXTRA_BUILDINGS.saves[type]()
	for (let b = EXTRA_BUILDINGS.start[type]; b <= EXTRA_BUILDINGS.max; b++) {
		delete s["eb"+b]
	}
}
function buyExtraBuildings(type, x) {
	if (CHALS_NEW.in(14)) return
	if (!EXTRA_BUILDINGS.unls[x]()) return
	if (tmp.eb[type+x].gain.lt(getExtraBuildings(type,x))) return
	EXTRA_BUILDINGS.saves[type]()["eb"+x] = tmp.eb[type+x].gain
}