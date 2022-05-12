//AXIONS
let AXION = {
	unl() {
		return tmp.ax && tmp.ax.eff !== undefined
	},

	setup() {
		return {
			res: [ E(0), E(0), E(0) ],
			upgs: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ]
		}
	},
	maxLvl(x) {
		var sum = E(0)
		var min = E(1/0)
		for (var i = 4 * x; i < 4 * x + 4; i++) {
			sum = tmp.ax.upg[i].add(sum)
			min = tmp.ax.upg[i].min(min)
		}
		if (x == 0) return sum.add(1).div(15/4).min(min.mul(1.2).add(1)).floor().add(1)
		if (x == 1) return sum.div(4).min(min.mul(1.5).add(1)).floor().add(2)
		if (x == 2) return min.add(1)
	},
	cost(i) {
		var normal = E(0)
		var other = E(0)
		var type = Math.floor(i / 4)
		for (var x = 4 * type; x < 4 * type + 4; x++) {
			var lvl = player.ext.ax.upgs[x]
			if (i == x) normal = lvl
			else other = other.add(lvl)
		}
		if (type < 2) {
			if (hasTree("ext_l3")) {
				if (i % 4 < 3) other = other.sub(player.ext.ax.upgs[i + 1].div(2))
				if (i % 4 > 0) other = other.sub(player.ext.ax.upgs[i - 1].div(2))
			}
			if (hasTree("ext_l4")) {
				if (i % 4 > 0) other = other.sub(player.ext.ax.upgs[i - 1].div(3))
				if (i % 4 > 1) other = other.sub(player.ext.ax.upgs[i - 2].div(3))
				if (i % 4 > 2) other = other.sub(player.ext.ax.upgs[i - 3].div(3))
			}
		}

		var inc = E(1)
		if (tmp.chal) inc = inc.mul(tmp.chal.eff[13])
		if (future) inc = E(0)

		var sum = normal.add(other.max(0).mul(inc)).mul(tmp.ax.fp)

		var r = E([2,3,10][type])
			.pow(sum.add(i - 4))
			.mul(i >= 4 ? (1e3 * Math.pow(5, i - 4)) : (50 / (i + 5) * Math.pow(3, i)))
		return r
	},
	costScale() {
		var r = E(1)
		if (hasTree("ext_l1")) r = E(0.8)
		if (hasTree("ext_l5")) r = r.div(treeEff("ext_l5", 1))
		return r
	},
	bulk(p) {
		var type = Math.floor(p / 4)
		var cost = tmp.ax.cost[p]
		if (player.ext.ax.res[type].lt(cost)) return E(0)
		var bulk = player.ext.ax.res[type]
			.div(cost)
			.log([2,3,10][type])
			.div(tmp.ax.fp)
			.add(1).floor()
		bulk = bulk.min(tmp.ax.max[type].sub(player.ext.ax.upgs[p]))
		return bulk
	},
	canBuy(i) {
		if (i % 4 > 0 && player.ext.ax.upgs[i-1].eq(0)) return
		return tmp.ax.bulk[i].gt(0)
	},
	buy(i,a) {
		var bulk = tmp.ax.bulk[i]
		var cost = tmp.ax.cost[i]
		var type = Math.floor(i / 4)
		if (bulk.eq(0)) return
		if (!a) player.ext.ax.res[type] = player.ext.ax.res[type].sub(
			E([2,3,10][type]).pow(
				bulk.sub(1)
				.mul(tmp.ax.fp)
			).mul(cost)
		).max(0)
		player.ext.ax.upgs[i] = player.ext.ax.upgs[i].add(bulk)
		if (!a) updateAxionLevelTemp()
		return true
	},

	prod(x) {
		if (!AXION.unl()) return E(0)

		let r = E(0)
		let em = EXT.eff()
		if (x == 0) r = player.mass.max(1).log10().pow(0.6)
			.mul(em.add(1).log(100).add(1).pow(2))
		if (x == 1 && hasTree("ext_c")) r = player.supernova.times.div(20).max(1).pow(3)
			.mul(em.add(1).log10().add(1).sqrt())
		if (x == 2 && hasTree("ext_e1")) r = player.supernova.radiation.hz.max(1).log10()
			.mul(em.add(1).log10().add(1).sqrt())

		if (hasElement(77)) r = r.mul(tmp.elements && tmp.elements.effect[77])
		return r
	},

	getUpgLvl(i) {
		var r = player.ext.ax.upgs[i]
		var type = Math.floor(i / 4)
		if (hasTree("ext_l2") && type < 2) r = r.add(player.ext.ax.upgs[[i+4,i-4][type]].div([1.5,i*1.5][type]))
		return r.max(0)
	},
	getLvl(p, base) {
		var req = AXION.ids[p].req
		var r = AXION.getBaseLvl(p).add(AXION.getBonusLvl(p))
		if (!base) r = r.sub(req)
		return r.max(0)
	},
	getXLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		return y < 4 ? tmp.ax.upg[x].sub(y * 4).div(y + 1) : E(0)
	},
	getYLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		return tmp.ax.upg[y + 4].sub(x * y).max(0)
	},
	getZLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		var r = E(0)
		if (hasTree("ext_e1")) {
			r = r.add(tmp.ax.upg[y + 8])
			if (y > 0) r = r.add(tmp.ax.upg[y + 7])
			if (y == 5) r = r.add(tmp.ax.upg[y + 6])
		}
		return r
	},
	getBaseLvl(p) {
		return this.getXLvl(p).add(this.getYLvl(p).add(this.getZLvl(p)))
	},
	getBonusLvl(p) {
		var x = p % 4
		var y = Math.floor(p / 4)
		var r = E(0)
		if (y > 0) r = tmp.ax.upg[y + 3].sub((x + 4) * (y + 1)).div(y + 2).max(0)
		if (hasTree("ext_b1") && y == 0) r = AXION.getBaseLvl(p + 12).mul(2).add(r)
		return r
	},
	getEff(p, l) {
		return AXION.ids[p].eff(l)
	},

	maxRows: 6,
	ids: {
		0: {
			title: "Supernova Time",
			desc: "Speed up the Supernova productions.",
			req: E(0),
			eff(x) {
				return x.mul(2).add(1).pow(2)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		1: {
			title: "Cosmic Burst",
			desc: "Cosmic Ray softcap starts later.",
			req: E(0),
			eff(x) {
				if (x.gte(100)) return E(1/0)
				return x.sqrt().div(10).add(1.2).pow(x)
			},
			effDesc(x) {
				return x.eq(1/0) ? "<span class='rainbow'>Removed!</span>" : format(x) + "x later"
			}
		},
		2: {
			title: "Tickspeed Bravery",
			desc: "Weaken Tickspeed scalings inside Challenges.",
			req: E(0),
			eff(x) {
				return x.add(1).log10().div(4).add(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		3: {
			title: "Radiation Scaling",
			desc: "Radiation Boosters scale slower.",
			req: E(0.5),
			eff(x) {
				return x.pow(0.6).div(135).min(0.05)
			},
			effDesc(x) {
				return "-^"+format(x)
			}
		},

		4: {
			title: "Excited Atomic",
			desc: "Raise the base Atomic Power gains.",
			req: E(1),
			eff(x) {
				return x.div(3).add(1).log(3).add(1)
			},
			effDesc(x) {
				return "^" + format(x)
			}
		},
		5: {
			title: "Outrageous",
			desc: "Multiply the cap increases to Rage Power.",
			req: E(0.5),
			eff(x) {
				return x.add(1).div(x.max(1).log(5).add(1))
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},
		6: {
			title: "Superranked",
			desc: "Meta Rank scaling is weaker.",
			req: E(5),
			eff(x) {
				return E(1).div(x.add(1).log(5).div(3).add(1))
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},
		7: {
			title: "Meta Zone",
			desc: "Multiply Meta Boosts based on radiation types.",
			req: E(7),
			eff(x) {
				return x.add(1).cbrt().div(10).add(1)
			},
			effDesc(x) {
				return format(x) + "x"
			}
		},

		8: {
			title: "Supermassive",
			desc: "Hawking Radiation softcap starts later.",
			unl: () => CHROMA.unl(),
			req: E(40),
			eff(x) {
				return x.add(1).cbrt()
			},
			effDesc(x) {
				return "^" + format(x)
			}
		},
		9: {
			title: "Dark Radiation",
			desc: "Multiply Hawking Radiation effect.",
			req: E(10),
			eff(x) {
				return x.div(3).add(1).sqrt().softcap(4,2/3,0)
			},
			effDesc(x) {
				return format(x) + "x" + getSoftcapHTML(x,4)
			}
		},
		10: {
			title: "Quark Condenser",
			desc: "Raise Neutron Condensers until HR softcap.",
			unl: () => CHROMA.unl(),
			req: E(40),
			eff(x) {
				return x.add(1).sqrt().softcap(4,4,3)
			},
			effDesc(x) {
				return "^" + format(x) + getSoftcapHTML(x,4)
			}
		},
		11: {
			title: "Lepton Anomaly",
			desc: "Weaken Neutrino and Neut-Muon softcaps.",
			req: E(5),
			eff(x) {
				return x.add(8).cbrt().add(3).min(10).div(5)
			},
			effDesc(x) {
				return "^" + format(x,3)
			}
		},

		12: {
			title: "Supernovae",
			desc: "Cheapen Supernovae.",
			unl: () => CHROMA.unl(),
			req: E(100),
			eff(x) {
				return E(1.01).pow(x)
			},
			effDesc(x) {
				return "^1/"+format(x)
			}
		},
		13: {
			title: "Challenge",
			desc: "Increase the cap of Challenges 7, 9 - 12.",
			req: E(0),
			eff(x) {
				return x.times(25)
			},
			effDesc(x) {
				return "+" + format(x)
			}
		},
		14: {
			title: "Impossible",
			desc: "Weaken Impossible Challenge scaling.",
			req: E(5),
			eff(x) {
				return E(1).div(x.add(1).div(100).add(1))
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},
		15: {
			title: "Pent",
			desc: "Pent scales slower.",
			req: E(1),
			eff(x) {
				return E(1).div(x.mul(2).add(1).log2().div(10).add(1))
			},
			effDesc(x) {
				return format(E(1).sub(x).mul(100)) + "%"
			}
		},

		16: {
			title: "Dyson Sphere",
			desc: "Multiply BH Upgrade 15.",
			unl: () => CHROMA.unl(),
			req: E(10),
			eff(x) {
				return x.pow(.75).div(15).add(1).min(3)
			},
			effDesc(x) {
				return "x"+format(x,3)
			}
		},
		17: {
			title: "Quasar",
			desc: "Increase the cap of C8.",
			unl: () => CHROMA.unl(),
			req: E(30),
			eff(x) {
				return x.add(1).log(2).mul(100)
			},
			effDesc(x) {
				return "+"+format(x)
			}
		},
		18: {
			title: "Temporal Dimensionality",
			desc: "Strengthen Tickspeed-Cap Boost.",
			unl: () => CHROMA.unl(),
			req: E(1),
			eff(x) {
				return x.div(10).add(1).log10().div(5).add(1)
			},
			effDesc(x) {
				return "^"+format(x,3)
			}
		},
		19: {
			title: "General Relativity",
			desc: "Dilated Mass raises Tickspeed power.",
			req: E(100),
			unl: () => CHROMA.unl(),
			eff(x) {
				if (x.lte(0)) return E(1)
				let r = player.md.mass.add(1).log10().add(1).log10().add(1) // log^2(Dilated mass)
				r = r.pow(x.add(1).log10().div(10)) // log(Levels)
				return r.min(3)
			},
			effDesc(x) {
				return "^"+format(x)
			}
		},

		20: {
			title: "X-Automation",
			desc: "Automate X AXION.",
			unl: () => CHROMA.unl(),
			req: E(50)
		},
		21: {
			title: "Y-Automation",
			desc: "Automate Y AXION.",
			unl: () => CHROMA.unl(),
			req: E(100)
		},
		22: {
			title: "Monochromacy Challenge",
			desc: "Unlock Challenge 14.",
			unl: () => CHROMA.unl(),
			req: E(1/0)
		},
		23: {
			title: "Shortcut Mastery",
			desc: "Unlock 3 more slots and Exit type for Shortcuts.",
			unl: () => CHROMA.unl(),
			req: E(20)
		},
	}
}

function setupAxionHTML() {
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
}

function updateAxionHTML() {
	tmp.el.st_res0.setHTML(format(player.ext.ax.res[0]))
	tmp.el.st_res1.setHTML(format(player.ext.ax.res[1]))
	tmp.el.st_res2.setHTML(format(player.ext.ax.res[2]))
	tmp.el.st_gain0.setHTML(formatGain(player.ext.ax.res[0], AXION.prod(0)))
	tmp.el.st_gain1.setHTML(formatGain(player.ext.ax.res[1], AXION.prod(1)))
	tmp.el.st_gain2.setHTML(formatGain(player.ext.ax.res[2], AXION.prod(2)))
	tmp.el.st_res2_disp.setDisplay(hasTree("ext_e1"))

	for (var i = 0; i < 12; i++) {
		tmp.el["ax_upg"+i].setClasses({btn_ax: true, locked: !AXION.canBuy(i)})
		tmp.el["ax_upg"+i].setOpacity(tmp.ax.hover.hide.includes("u"+i) ? 0.25 : 1)
		tmp.el["ax_upg"+i].setDisplay(i < 8 || hasTree("ext_e1"))
	}
	for (var i = 0; i < AXION.maxRows * 4; i++) {
		tmp.el["ax_boost"+i].setClasses({btn_ax: true, locked: tmp.ax.lvl[i].eq(0), bonus: tmp.ax.hover.bonus.includes("b"+i)})
		tmp.el["ax_boost"+i].setDisplay(AXION.ids[i].unl === undefined || AXION.ids[i].unl())
		tmp.el["ax_boost"+i].setOpacity(tmp.ax.hover.bonus.includes("b"+i) ? 1 : tmp.ax.hover.hide.includes("b"+i) || tmp.ax.lvl[i].eq(0) ? 0.25 : 1)
	}

	tmp.el.ax_desc.setOpacity(tmp.ax.hover.id ? 1 : 0)
	if (tmp.ax.hover.id) {
		if (tmp.ax.hover.id[0] == "u") {
			var id = Number(tmp.ax.hover.id.split("u")[1])
			var type = Math.floor(id / 4)
			var name = ["X","Y","Z"][type]
			tmp.el.ax_title.setTxt(name + "-Axion Upgrade " + ((id % 4) + 1))
			tmp.el.ax_req.setHTML("Cost: " + format(tmp.ax.cost[id]) + " " + name + "-Axions")
			tmp.el.ax_req.setClasses({"red": !AXION.canBuy(id)})
			tmp.el.ax_eff.setHTML("Level: " + format(player.ext.ax.upgs[id], 0) + " / " + format(tmp.ax.max[type], 0) + " (" + format(tmp.ax.upg[id]) + ")")
		}
		if (tmp.ax.hover.id[0] == "b") {
			var id = Number(tmp.ax.hover.id.split("b")[1])
			var locked = tmp.ax.lvl[id].eq(0)
			tmp.el.ax_title.setTxt(AXION.ids[id].title + " (ax-b" + id + ")")
			tmp.el.ax_req.setTxt(locked ? "Locked (requires " + format(AXION.getLvl(id, true)) + " / " + format(AXION.ids[id].req, 0) + ")" : AXION.ids[id].desc)
			tmp.el.ax_req.setClasses({"red": locked})
			tmp.el.ax_eff.setHTML(locked ? "" : "Level: " + format(AXION.getBaseLvl(id).sub(AXION.ids[id].req.sub(1)), 0) + (AXION.getBonusLvl(id).gt(0) ? "+" + format(AXION.getBonusLvl(id)) : "") + (id < 20 ? ", Currently: " + AXION.ids[id].effDesc(tmp.ax.eff[id]) : ""))
		}
	}
}

function updateAxionLevelTemp() {
	let d = tmp.ax
	d.upg = {}
	d.lvl = {}
	d.max = {}
	for (var i = 0; i < 12; i++) d.upg[i] = AXION.getUpgLvl(i)
	for (var i = 0; i < AXION.maxRows * 4; i++) d.lvl[i] = AXION.getLvl(i)
	for (var i = 0; i < 3; i++) d.max[i] = AXION.maxLvl(i)
}

function updateAxionTemp() {
	if (!EXT.unl(true)) {
		tmp.ax = {}
		return
	}

	let d = tmp.ax || {}
	tmp.ax = d
	if (!tmp.ax.lvl) {
		updateAxionLevelTemp()
		tmp.ax.hover = {id: "", hide: [], bonus: []}
	}

	d.cost = {}
	d.bulk = {}
	d.eff = {}
	d.str = E(future ? 3 : 1)
	d.fp = AXION.costScale(i)
	for (var i = 0; i < 12; i++) {
		d.cost[i] = AXION.cost(i)
		d.bulk[i] = AXION.bulk(i)
	}
	for (var i = 0; i < 20; i++) d.eff[i] = AXION.getEff(i, d.lvl[i].mul(d.str))
}

function hoverAxion(x) {
	tmp.ax.hover.id = x
	tmp.ax.hover.hide = []
	tmp.ax.hover.bonus = []
	if (!x) return
	if (tmp.ax.hover.id[0] == "u") {
		let id = Number(tmp.ax.hover.id.split("u")[1])
		for (var i = 0; i < 12; i++) if (i != id) tmp.ax.hover.hide.push("u"+i)
		for (var i = 0; i < 20; i++) {
			let [px,py] = [i%4, Math.floor(i/4)]

			let hide = true
			let bonus = false
			if (id >= 8) {
				hide = py != id - 8 && py != id - 7
			} else if (id >= 4) {
				bonus = py == id - 3 && tmp.ax.upg[id].gt((px + 4) * (py + 1))
				hide = !bonus && (py == id - 4 ? tmp.ax.upg[id].lte(px * py) : true)
			} else hide = (px != id) || (tmp.ax.upg[id].lte(py*4))
			if (hide) tmp.ax.hover.hide.push("b"+i)
			if (bonus) tmp.ax.hover.bonus.push("b"+i)
		}
	}
	if (tmp.ax.hover.id[0] == "b") {
		let id = Number(tmp.ax.hover.id.split("b")[1])
		let [px, py] = [id%4, Math.floor(id/4)]
		for (var i = 0; i < 20; i++) if (i != id) tmp.ax.hover.hide.push("b"+i)
		for (var i = 0; i < 12; i++) {
			let hide = true
			if (py < 5) {
				if (i < 4 && px == i && tmp.ax.upg[i].gt(py * 4)) hide = false
				if (i >= 4 && py == i - 4 && tmp.ax.upg[i].gt(px * py)) hide = false
				if (i >= 4 && py == i - 3 && tmp.ax.upg[i - 1].div(py + 2).gt((px + 4) * py)) hide = false
			}
			if (hide) tmp.ax.hover.hide.push("u"+i)
		}
	}
}