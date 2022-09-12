let EXOTIC = {
	setup() {
		return {
			unl: false,
			time: 0,
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

		let r = expMult(player.supernova.stars.max(1).log10().pow(5), 1.5)
		return this.amt(r)
	},
	rawAmt(r) {
		return D(player.ext?.amt ?? 0)
	},
	amt(r) {
		return r
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
		if (hasExtMilestone("qol", 1)) list.push("c")
		if (hasExtMilestone("qol", 2)) list.push("qol8")

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

		player.ext.time = EXT.time() + dt

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
	},

	time() {
		return player.ext?.time ?? 0
	}
}
let EXT = EXOTIC

//HTML
function updateExoticHTML() {
	elm.app_ext.setDisplay(tmp.tab == 6)
	if (tmp.tab == 6) {
		updateExoticHeader()
		if (tmp.stab[6] == 0) updateAxionHTML()
		if (tmp.stab[6] == 3) updateExtMilestonesHTML()
	}
}

function updateExoticHeader() {
	elm.extDiv2.setDisplay(tmp.stab[6] == 0 || tmp.stab[6] == 3)
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
const EXT_MILESTONES = {
	qol: [
		{
			req: 1,
			desc: "Start with [c] upgrade."
		}, {
			req: 3,
			desc: "Automate Neutron Tree without requirements (not implemented), and keep [qol8]. Additionally, auto-Sweeper threshold is 10."
		}, {
			req: 10,
			desc: "Automate Radiation Boosters at 100,000 radiation, and Buildings don't spend anything."
		}, {
			req: 30,
			desc: "You can bulk Pent."
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
			desc: "Unlock Shortcuts."
		}, {
			req: 1e8,
			desc: "Outside of Exotic Challenges, automate Challenges 1 - 11 and Up - Top Quark Fermions without entering."
		},
	],
	boost: [
		{
			req: 1,
			desc: "Star Generations generate 5x faster and gain 5x more Supernovae resources."
		}, {
			req: 100,
			desc: "Argon-18 raises Tickspeed Power instead."
		}, {
			req: 1e3,
			desc: "Mass multiplies Relativistic Particles at a reduced rate."
		}, {
			req: 1e4,
			desc: "Meta-Boost I is stronger based on Pents."
		}, {
			req: 1e5,
			desc: "Cleanse softcaps of MD Upgrades 1, 3, and 8; but nullify MD Upgrade 12."
		}, {
			req: 1e6,
			desc: "Bring Particle Powers back to former glory. (Removes Mg-12, several buffs, and softcaps)"
		}, {
			req: 1e7,
			desc: "Dilated mass raises Tickspeed Power instead."
		}
	],
	axion: [
		{
			req: 1,
			desc: "Unlock X-Axions. X-Axions raise Challenge 12 reward."
		}, {
			req: 30,
			desc: "Unlock Y-Axions. Y-Axions make [s3] raise M-Type Stars."
		}, {
			req: 1e3,
			desc: "X-Axions raise Challenge 10 reward."
		}, {
			req: 1e5,
			desc: "Y-Axions subtract Radiation Booster's cost scaling exponent."
		}, {
			req: 1e8,
			desc: "Unlock Z-Axions. Z-Axions make Tickspeed Power multiplies Star Booster Base."
		}, {
			req: 1e10,
			desc: "X-Axions multiply Neutron Condensers."
		}, {
			req: 1e15,
			desc: "Y-Axions multiply Hawking Radiation."
		}, {
			req: 1e20,
			desc: "Z-Axions add Polarizer Base."
		}
	],
	unl: [
		{
			req: 1,
			desc: "Unlock Extra Building Upgrades. [located in Neutron Tree]"
		}, {
			req: 1e4,
			desc: "Unlock Exotic Challenges."
		}
	],
	/*{
		req: 2,
		desc: "???",
		eff: {
			eff: () => 1,
			disp: (x) => format(x)
		}
	}*/
}

function hasExtMilestone(type, index) {
	return EXT.rawAmt().gte(EXT_MILESTONES[type][index - 1].req)
}

function hasExtMilestoneEff(type, index) {
	return EXT_MILESTONES[type][index].eff.eff()
}

function setupExtMilestonesHTML() {
	for (let [ti, type] of Object.entries(EXT_MILESTONES)) {
		let html = document.createElement("div")
		html.id = `extMilestone_${ti}`
		html.className = "table_center milestones"

		let dom = ""
		for (let [msi, ms] of Object.entries(type)) {
			dom += `<div id='extMilestone_${ti}_${msi}'>
				<b class="milestoneReq" id='extMilestone_${ti}_${msi}_req'></b><br>
				${ms.desc}
				${ms.eff ? "<br><span class='milestoneEff'>Currently: <b id='extMilestone_${ti}_${msi}_eff'></b></span>" : ""}
				<b class="milestoneId">${ti}${Number(msi)+1}</b>
			</div>`
		}
		html.innerHTML = dom

		new Element("extMilestones").append(html)
	}
}

function updateExtMilestonesHTML() {
	for (let [ti, type] of Object.entries(EXT_MILESTONES)) {
		elm[`extMilestone_${ti}_tab`].setClasses({
			btn_tab: true,
			normal: true,
			choosed: tmp.ext_ms_view == ti
		})
		elm[`extMilestone_${ti}`].setDisplay(tmp.ext_ms_view == ti)
		if (tmp.ext_ms_view == ti) {
			let gotBefore = true
			for (let [msi, ms] of Object.entries(type)) {
				let has = hasExtMilestone(ti, Number(msi) + 1)
				elm[`extMilestone_${ti}_${msi}`].setDisplay(gotBefore)
				elm[`extMilestone_${ti}_${msi}`].setClasses({ bought: has })
				elm[`extMilestone_${ti}_${msi}_req`].setHTML(format(ms.req, 1) + " Exotic Matter")
				if (ms.eff) elm[`extMilestone_${ti}_${msi}_eff`].setHTML(ms.eff.disp(ms.eff.eff))
				if (!has) gotBefore = false
			}
		}
	}
}

function hasExtMilestoneQ10() {
	return hasExtMilestone("qol", 10) && !player.ext.ec
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