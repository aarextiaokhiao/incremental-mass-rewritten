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

			ax: AXION.setup()
		}
	},

	unl(disp) {
		return (disp && player.chal.comps[12].gte(1)) || player.ext?.unl
	},
	gain() {
		let s = player.supernova.times
			.mul(player.chal.comps[12].add(1))
			.div(500)
		if (hasTree("feat11")) s = s.mul(1.2)

		let r = expMult(player.supernova.stars.max(1).log10().pow(3), 1.5)
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
		if (!can && restart) {
			if (!confirm("Are you sure do you want to restart? There will be bare consequences!")) return
			if (!confirm("ARE YOU REALLY SURE? IT TAKES A LONG TIME TO RECOVER!")) return
		} else {
			if (!toConfirm('ext')) return
		}
		if (can) {
			if (!player.ext) player.ext = EXT.setup()
			if (!EXT.unl()) {
				player.ext.unl = true
				addPopup(POPUP_GROUPS.layer_5)
			}
			player.ext.amt = EXT.rawAmt().add(player.ext.gain)
		}
		EXT.doReset()
	},
	doReset(order = "ext") {
		player.ext.time = 0
		player.ext.gain = D(1)
		player.ext.chal.f7 = true
		player.ext.chal.f8 = true
		player.ext.chal.f9 = true
		tmp.pass = true

		player.ranks.pent = D(0)
		CHALS.clear(2)

		player.supernova.times = D(0)
		player.supernova.stars = D(0)

		let list = []
		if (hasExtMilestone("qol", 1)) list.push("c", "m1", "qol1", "qol2", "qol8", "qol10")
		if (hasExtMilestone("qol", 2)) list.push("qol3", "qol4", "qol5", "qol6", "qol7", "chal4", "chal4a", "chal5", "chal6", "chal7")

		let list_keep = []
		for (let x = 0; x < player.supernova.tree.length; x++) {
			let it = player.supernova.tree[x]
			if (list.includes(it)) list_keep.push(it)
			else if (TREE_UPGS.ids[it] && TREE_UPGS.ids[it].perm) list_keep.push(it)
		}
		player.supernova.tree = list_keep

		player.supernova.post_10 = false
		player.supernova.unl = false
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

		player.bh.unl = false
		player.chal.unl = false
		player.atom.unl = false
		player.mainUpg.rp = []
		player.mainUpg.bh = []
		player.mainUpg.atom = []
		TABS.fix()

		SUPERNOVA.doReset(order)
		updateTemp()
	},

	calc(dt) {
		if (!player.ext) return
		if (EXT.rawAmt().gt(0)) player.ext.unl = true
		if (!player.ext.unl) return

		player.ext.time = EXT.time() + dt

		//FEATS
		if (player.mass.lt(uni("ee10")) && tmp.supernova.bulk.sub(player.supernova.times).round().gte(15)) player.ext.chal.f6 = true
		if (!CHALS.inAny()) player.ext.chal.f7 = false
		if (player.supernova.fermions.choosed == "") player.ext.chal.f9 = false
		player.ext.gain = D(player.ext.gain).max(this.gain())

		//AXIONS
		if (AXION.unl()) AXION.calc(dt)

		//EXTRA RESOURCES
		player.ext.ar39 = D(player.ext.ar39).add(getCosmicArgonProd().mul(dt))
	},
	updateTmp() {
		tmp.extMult = D(1)
		if (hasExtMilestone("boost", 0)) tmp.extMult = D(3)

		//updateGlueballTemp()
		updateAxionTemp()
		updatePolarizeTemp()
		updateExtraBuildingTemp()
	},

	time() {
		return player.ext?.time ?? 0
	}
}
let EXT = EXOTIC

//HTML
function updateExoticHTML() {
	elm.ext_bg.setDisplay(tmp.tab == 4)
	elm.main_res.setDisplay(tmp.tab != 4)
	elm.ext_res.setDisplay(tmp.tab == 4)
	if (tmp.tab == 4) {
		updateExoticHeader()
		if (tmp.stab[4] == 0) updateAxionHTML()
		if (tmp.stab[4] == 1) updateExtMilestonesHTML()
	}
}

function updateExoticHeader() {
	elm.extDiv2.setDisplay(tmp.stab[4] == 0 || tmp.stab[4] == 1)
	elm.extAmt2.setHTML(format(EXT.rawAmt(),1)+(player.chal.comps[12].gt(0)?"<br>"+formatGainOrGet(EXT.rawAmt(), player.ext.gain):""))

	elm.polarDiv.setDisplay(false)
	elm.polarEff.setHTML(format(tmp.polarize)+"x Buildings")

	elm.ar39Div.setDisplay(false)
	elm.ar39Eff.setHTML("+"+format(player.ext.ar39)+"x <sup>39</sup>Ar")
}

/* [ EXOTIC ERA CONTENT ] */

// MILESTONES
const EXT_MILESTONES = ["ext_qol", "ext_boost", "ext_unl"]
MILESTONE.ext_qol = {
	title: "Quality of Life",
	unl: _ => EXT.unl(),
	res: _ => EXT.rawAmt(),
	resDisp: i => format(i, 0) + " Exotic Matter",
	data: [
		{
			req: 0,
			desc: "Start with Na-11 upgrade. Neutron Stars can generate in offline progress. Auto-Sweeper threshold is reduced to 10."
		}, {
			req: 2,
			desc: "Keep [c], [m1], [qol1] - [qol3], [qol8], and [qol10] upgrades. Automate Neutron Tree upgrades. Auto-Sweeper threshold is reduced to 5."
		}, {
			req: 10,
			desc: "Keep [qol3] - [qol7] and [chal4] - [chal10]. Automate Radiation Boosters at 100,000 Radiation. Auto-Sweeper threshold is reduced to 3."
		}, {
			req: 30,
			desc: "You can bulk Pent. Going Supernovae automatically gives Pent. Auto-Sweeper threshold is reduced to 2."
		}, {
			req: 100,
			desc: "Neutron Tree doesn't require anything except Supernovae requirements. Auto-Sweeper threshold is reduced to 1."
		}, {
			req: 300,
			desc: "Buildings don't spend anything. Auto-Sweeper threshold is reduced to 0."
		}, {
			req: 1e3,
			desc: "You can automatically sweep Fermions without requirements."
		}, {
			req: 3e3,
			desc: "You can automatically sweep Challenges without requirements."
		}, {
			req: 1e4,
			desc: "Unlock Shortcuts. [currently in refactor]"
		}, {
			req: 1e8,
			desc: "Outside of Exotic Challenges, automate Challenges 1 - 11 and Up - Top Quark Fermions without entering."
		},
	]
}
MILESTONE.ext_boost = {
	title: "Boosts",
	unl: _ => EXT.unl(),
	res: _ => EXT.rawAmt(),
	resDisp: i => format(i, 0) + " Exotic Matter",
	data: [
		{
			req: 0,
			desc: "2x pre-Supernovae resources, 25x Star Generators, and 3x Supernovae-layer resources."
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
	]
}
MILESTONE.ext_unl = {
	title: "Unlocks",
	unl: _ => EXT.unl(),
	res: _ => EXT.rawAmt(),
	resDisp: i => format(i, 0) + " Exotic Matter",
	data: [
		{
			req: 1,
			desc: "Unlock 2nd Building for Black Hole and Atomic Generators."
		}, {
			req: 2,
			desc: "Unlock 3rd Building for Black Hole and Atomic Generators."
		}, {
			req: 1e4,
			desc: "Unlock Exotic Challenges, starting at Challenge 13."
		}
	]
}

function hasExtMilestone(type, index) {
	return hasMilestone("ext_"+type, index)
}

function extMilestoneEff(type, index, def) {
	return milestoneEff("ext_"+type, index, def)
}

function hasExtMilestoneQ9() {
	return hasMilestone("ext_qol", 9) && !player.ext.ec
}

function setupExtMilestonesHTML() {
	html1 = html2 = ``
	for (let i of EXT_MILESTONES) {
		html1 += `<div style='width: 145px'><button id="milestone_tab_${i}" onclick="tmp.ext_ms_view = '${i}'">${MILESTONE[i].title}</button></div>`
		html2 += `<div id='milestones_${i}'></div>`
	}
	new Element("ext_milestones").setHTML(`<div class='table_center'>${html1}</div><br>${html2}`)
}

function updateExtMilestonesHTML() {
	for (let type of EXT_MILESTONES) {
		elm[`milestone_tab_${type}`].setClasses({
			btn_tab: true,
			ext: true,
			choosed: tmp.ext_ms_view == type
		})
		elm[`milestones_${type}`].setDisplay(tmp.ext_ms_view == type)
	}
	updateMilestoneHTML(tmp.ext_ms_view)
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