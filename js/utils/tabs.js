const TABS = {
	choose(x, stab=false) {
		if (!stab) {
			tmp.prev_tab = tmp.tab
			tmp.tab = x
		} else tmp.stab[tmp.tab] = x
	},
	back() {
		tmp.tab = tmp.prev_tab
		tmp.prev_tab = tmp.tab
	},
	order: [0,1,2,3,8,4,5,6,7],
	1: [
		{ id: "Main" },
		{ id: "Stats", unl() { return player.rp.unl } },
		{ id: "Upgrades", unl() { return player.rp.unl } },
		{ id: "Challenges", unl() { return player.chal.unl } },
		{ id: "Atom", unl() { return player.atom.unl }, style: "atom" },
		{ id: "Supernova", unl() { return player.supernova.unl }, style: "sn" },
		{ id: "Exotic", unl() { return EXT.unl() }, style: "ext" },
		{ id: "Options" },
		// NG- TABS
		{ id: "Magic", unl() { return MAGIC.unl() }, style: "magic" },
	],
	2: {
		0: [
			{ id: "Mass" },
			{ id: "Black Hole", unl() { return player.bh.unl }, style: "bh" },
			{ id: "Atomic Generator", unl() { return player.atom.unl }, style: "atom" },
			{ id: "Stars", unl() { return STARS.unlocked() }, style: "star" },
		],
		1: [
			{ id: "General" },
			{ id: "Rewards" },
			{ id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
			{ id: "Compression", unl() { return EXT.unl() } },
		],
		3: [
			{ id: "Challenges" },
			{ id: "Virtual", unl() { return future || PORTAL.unl() } },
			{ id: "Entropic", unl() { return future || PORTAL.unl() }, style: "ent" },
			{ id: "Vacuum Decay", unl() { return future || PORTAL.unl() }, style: "vac" },
		],
		4: [
			{ id: "Particles" },
			{ id: "Elements", unl() { return player.chal.comps[7].gte(16) || player.supernova.unl } },
			{ id: "Mass Dilation", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
		],
		5: [
			{ id: "Neutron Tree" },
			{ id: "Bosons", unl() { return BOSONS.unl() } },
			{ id: "Fermions", unl() { return player.supernova.fermions.unl } },
			{ id: "Radiation", unl() { return tmp.radiation.unl } },
		],
		6: [
			{ id: "Axions" },
			{ id: "Glueball", unl() { return false }, style: "ch" },
			{ id: "Primordiums", unl() { return false }, style: "pr" },
			{ id: "Milestones" }
		],
	},
}