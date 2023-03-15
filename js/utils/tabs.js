const TABS = {
	unl(tab, stab) {
		let data = stab !== undefined ? this[2][tab][stab] : this[1][tab]
		return data.unl ? data.unl() : true
	},

	choose(x, stab=false) {
		if (!stab) {
			tmp.prev_tab = tmp.tab
			tmp.tab = x
		} else tmp.stab[tmp.tab] = x
		this.fix()
	},
	back() {
		this.choose(tmp.prev_tab)
	},
	fix(stab) {
		let data = stab !== undefined ? this[2][stab] : this[1]
		if (!data) return

		let dataCurr = data[stab !== undefined ? tmp.stab[stab] : tmp.tab]
		if (dataCurr.unl && !dataCurr.unl()) {
			console.log(`Tab '${dataCurr.id}' is locked! Fixing...`)
			if (stab !== undefined) tmp.stab[stab] = 0
			else tmp.tab = 0
		}
		if (stab == undefined) this.fix(tmp.tab)
	},

	1: [
		{ id: "Main" },
		{ id: "Magic", unl() { return MAGIC.unl() }, style: "magic" },
		{ id: "Atom", unl() { return player.atom.unl }, style: "atom" },
		{ id: "Supernova", unl() { return player.supernova.unl }, style: "sn" },
		{ id: "Exotic", unl() { return EXT.unl() }, style: "ext" },

		{ id: "Upgrades", unl() { return player.rp.unl } },
		{ id: "Challenges", unl() { return player.chal.unl } },
		{ id: "Stats", unl() { return player.rp.unl } },
		{ id: "Options" },
	],
	2: {
		0: [
			{ id: "Mass" },
			{ id: "Black Hole", unl() { return player.bh.unl }, style: "bh" },
		],
		1: [
			{ id: "Magic" },
			{ id: "Super Magic", unl() { return player.bh.unl } },
			{ id: "Ultra Magic", unl() { return player.atom.unl } },
			{ id: "The Chart" },
			{ id: "Retrival",  unl() { return player.supernova.unl } }
		],
		2: [
			{ id: "Particles" },
			{ id: "Atomic Generator", unl() { return player.atom.unl } },
			{ id: "Mass Dilation", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
			{ id: "Stars", unl() { return STARS.unlocked() }, style: "star" },
		],
		3: [
			{ id: "Neutron Tree" },
			{ id: "Bosons", unl() { return BOSONS.unl() }, style: "boson" },
			{ id: "Fermions", unl() { return player.supernova.fermions.unl }, style: "ferm" },
			{ id: "Radiation", unl() { return tmp.radiation.unl }, style: "rad" },
		],
		4: [
			{ id: "Axions", style: "ext" },
			{ id: "Milestones" }
		],

		5: [
			{ id: "Main" },
			{ id: "Elements", unl() { return player.chal.comps[7].gte(16) || player.supernova.unl }, style: "atom" },
		],
		6: [
			{ id: "Challenges" }
		],
		7: [
			{ id: "Rewards" },
			{ id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
			{ id: "Compression", unl() { return false } },
		],
	},
}