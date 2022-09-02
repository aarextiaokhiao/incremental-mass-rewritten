let EXOTIC = {
	setup() {
		return {
			unl: false,
			amt: D(0),
			gain: D(1),

			chal: {},
			ec: 0,

			toned: 0,
			ar39: D(0),

			ax: AXION.setup(),
			gb: GLUBALL.setup()
		}
	},

	unl(disp) {
		return (disp && player.chal.comps[12].gte(1)) || player.ext?.unl || PORTAL.unl()
	},
	gain() {
		let s = player.supernova.times
			.mul(player.chal.comps[12].add(1))
			.div(500)
		if (hasTree("feat11")) s = s.mul(1.2)

		let r = player.mass.max(1).log10().div(1e9).add(1).pow(s)
		return this.amt(r)
	},
	extLvl() {
		let l = 0
		if (hasTree("feat9")) l++
		if (hasTree("feat10")) l++
		return l
	},
	rawAmt(r) {
		return D(player.ext?.amt ?? 0)
	},
	amt(r) {
		r = D(r)
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
		player.ext.amt = EXT.reduce(EXT.extLvl(), EXT.rawAmt())
		player.ext.gain = EXT.reduce(EXT.extLvl(), player.ext.gain)
	},
	eff(r) {
		if (!r) r = EXT.rawAmt()
		if (this.extLvl() >= 2) r = expMult(r, 1/0.8)
		if (this.extLvl() >= 1) r = D(10).pow(r.div(10).root(5)).div(10)
		return r
	},

	reset(force, restart) {
		let can = player.chal.comps[12].gt(0)
		if (!force && !can) return
		if ((!force || restart) && player.confirms.ext && !confirm("Are you sure?")) return false
		if (can) {
			if (!player.ext) player.ext = EXT.setup()
			if (!EXT.unl()) {
				player.ext.unl = true
				addPopup(POPUP_GROUPS.layer_5)
			}
			player.ext.amt = player.ext.amt.add(player.ext.gain)
		}
		EXT.doReset()
	},
	doReset(pres) {
		player.ext.time = 0
		player.ext.gain = D(1)
		player.ext.chal.f7 = true
		player.ext.chal.f8 = true
		player.ext.chal.f9 = true
		tmp.pass = true

		player.ranks.pent = D(0)
		for (let c = 9; c <= 12; c++) player.chal.comps[c] = D(0)

		player.supernova.times = D(0)
		player.supernova.stars = D(0)

		let list = []
		if (hasExtMilestone(0)) list.push("c")
		if (hasExtMilestone(1)) list.push("qol8")

		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			let it = player.supernova.tree[x]
			if (list.includes(it)) list_keep.push(it)
			else if (it.includes("qol") || it.includes("feat")) list_keep.push(it)
			else if (TREE_UPGS.ids[it] && TREE_UPGS.ids[it].perm) list_keep.push(it)
		}
		player.supernova.tree = list_keep

		player.supernova.bosons = {
			pos_w: D(0),
			neg_w: D(0),
			z_boson: D(0),
			photon: D(0),
			gluon: D(0),
			graviton: D(0),
			hb: D(0),
		}
		player.supernova.b_upgs = {
			photon: [ D(0), D(0), D(0), D(0) ],
			gluon: [ D(0), D(0), D(0), D(0) ],
		}
		player.supernova.fermions = {
			unl: false,
			points: [D(0),D(0)],
			tiers: [[D(0),D(0),D(0),D(0),D(0),D(0)],[D(0),D(0),D(0),D(0),D(0),D(0)]],
			choosed: "",
			choosed2: "",
			dual: player.supernova.fermions.dual
		}
		player.supernova.radiation = {
			hz: D(0),
			ds: [ D(0), D(0), D(0), D(0), D(0), D(0), D(0) ],
			bs: [ D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0) ],
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
		if (!player.ext) return
		if (EXT.rawAmt().gt(0)) player.ext.unl = true
		if (!player.ext.unl) return

		player.ext.time += dt

		//FEATS
		if (player.mass.lt(uni("ee10")) && tmp.supernova.bulk.sub(player.supernova.times).round().gte(15)) player.ext.chal.f6 = true
		if (tmp.chal.outside) player.ext.chal.f7 = false
		if (player.supernova.fermions.choosed == "") player.ext.chal.f9 = false
		player.ext.gain = D(player.ext.gain).max(this.gain())

		//AXIONS
		if (AXION.unl()) AXION.calc(dt)

		//GLUEBALLS
		if (player.ext.gb.unl) GLUBALL.calc(dt)
		else if (player.chal.comps[13].gte(9)) {
			addPopup(POPUP_GROUPS.chroma)
			player.ext.gb.unl = true
		}

		//EXTRA RESOURCES
		player.ext.ar39 = D(player.ext.ar39).add(getCosmicArgonProd().mul(dt))
	}
}
let EXT = EXOTIC

//HTML
function updateExoticHTML() {
	elm.app_ext.setDisplay(tmp.tab == 6)
	if (tmp.tab == 6) {
		updateExoticHeader()
		if (tmp.stab[6] == 0) updateAxionHTML()
		if (tmp.stab[6] == 1) updateExtMilestonesHTML()
	}
}

function updateExoticHeader() {
	elm.extDiv2.setDisplay(tmp.stab[6] == 0 || tmp.stab[6] == 1)
	elm.extAmt2.setHTML(format(EXT.rawAmt(),1)+(player.chal.comps[12].gt(0)?"<br>"+formatGainOrGet(EXT.rawAmt(), player.ext.gain):""))

	elm.polarDiv.setDisplay(false)
	elm.polarEff.setHTML(format(tmp.polarize)+"x Buildings")

	elm.ar39Div.setDisplay(false)
	elm.ar39Eff.setHTML("+"+format(player.ext.ar39)+"x <sup>39</sup>Ar")

	elm.toneDiv.setDisplay(GLUBALL.unl())
	elm.extTone.setHTML(toned()==TONES.max?"Maxed!":format(player.ext.toned,0)+"<br>"+(TONES.can() ? "(+" + format(1,0) + ")":"(requires " + format(TONES.req()) + ")"))
}

/* [ EXOTIC ERA CONTENT ] */

// MILESTONES
const EXT_MILESTONES = [
	{
		req: 1,
		desc: "Start with [c] upgrade, gain 10x more Supernovae resources, and unlock Extra Building Upgrades."
	}, {
		req: 3,
		desc: "Automate Neutron Tree without requirements (not implemented), and keep [qol8]. Additionally, auto-Sweeper threshold is 10."
	}, {
		req: 10,
		desc: "Automate Radiation Boosters at 100,000 radiation, and Buildings don't spend anything."
	}, {
		req: 30,
		desc: "You can bulk Pent and unlock Y-Axions."
	}, {
		req: 100,
		desc: "Automate Supernovae at where you would gain 30% more."
	}, {
		req: 300,
		desc: "Going Supernovae automatically gives Pent."
	}, {
		req: 1e3,
		desc: "You can automatically sweep Fermions without requirements."
	}, {
		req: 3e3,
		desc: "You can automatically sweep Challenges without requirements."
	}, {
		req: 1e4,
		desc: "Unlock Exotic Challenges and Shortcuts."
	}, {
		req: 1e5,
		desc: "Cleanse softcaps of MD Upgrades 1, 3, and 8; but nullify MD Upgrade 12."
	}, {
		req: 1e6,
		desc: "Bring Particle Powers back to former glory. (Removes Mg-12, several buffs, and softcaps)"
	}, {
		req: 1e7,
		desc: "Argon-18 raises Tickspeed Power instead."
	}, {
		req: 1e8,
		desc: "Outside of Exotic Challenges, automate Challenges 1 - 11 and Up - Top Quark Fermions without entering."
	},
	/*{
		req: 2,
		desc: "???",
		eff: {
			eff: () => 1,
			disp: (x) => format(x)
		}
	}*/
]

function hasExtMilestone(index) {
	return EXT.rawAmt().gte(EXT.amt(EXT_MILESTONES[index].req))
}

function hasExtMilestoneEff(index) {
	return EXT_MILESTONES[index].eff.eff()
}

function setupExtMilestonesHTML() {
	let html = ""
	for (let [index, ms] of Object.entries(EXT_MILESTONES)) {
		html += `<div id='extMilestone${index}'>
			<b class="milestoneReq" id='extMilestone${index}Req'>${format(EXT.amt(ms.req),0) + " Exotic Matter"}</b><br>
			${ms.desc}
			${ms.eff ? "<br><span class='milestoneEff'>Currently: <b id='extMilestone${index}Eff'>???</b></span>" : ""}
		</div><br>`
	}

	document.getElementById("extMilestones").innerHTML = html
}

function updateExtMilestonesHTML() {
	let gotBefore = true
	for (let [index, ms] of Object.entries(EXT_MILESTONES)) {
		elm[`extMilestone${index}`].setDisplay(gotBefore)
		elm[`extMilestone${index}`].setClasses({ bought: hasExtMilestone(index) })
		//elm[`extMilestone${index}Req`].setTxt(format(EXT.amt(ms.req), 0) + " Exotic Matter")
		//if (ms.eff) elm[`extMilestone${index}Eff`].setTxt(ms.eff.disp(ms.eff.eff()))

		if (!hasExtMilestone(index)) gotBefore = false
	}
}

function hasExtMilestone13() {
	return hasExtMilestone(12) && !player.ext.ec
}

// POLARIZER
function updatePolarizeTemp() {
	tmp.polarize = D(1)
	//it will get a new boost soon
}

// COSMIC ARGONS
function getCosmicArgonProd() {
	let r = D(0)
	return r
}