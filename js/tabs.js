const TABS = {
    choose(x, stab=false) {
		if (!stab) {
			if (x==5||x==7) tmp.sn_tab = tmp.tab
			tmp.tab = x
			if (x!=5&&x!=7) {
				tmp.sn_tab = tmp.tab
				tree_update = true
			}
		} else if (tmp.tab == 4 && x == 3) tmp.tab = 5
		else if (tmp.tab == 5 && x == 4) tmp.tab = 7
		else tmp.stab[tmp.tab] = x
	},
    1: [
        { id: "Main" },
        { id: "Stats" },
        { id: "Upgrades", unl() { return player.rp.unl } },
        { id: "Challenges", unl() { return player.chal.unl } },
        { id: "Atom", unl() { return player.atom.unl }, style: "atom" },
        { id: "Supernova", unl() { return (player.supernova.times.gte(1) || quUnl()) && !player.exotic.times.gte(1) }, style: "sn" },
        { id: "Quantum", unl() { return quUnl() }, style: "qu" },
        { id: "Galactic", unl() { return player.superGal.gt(0) || player.supernova.times.gte(SUPERNOVA_GALAXY.req()) }, style: "gal" },
        { id: "Exotic", unl() { return player.exotic.times.gte(1) }, style: "ext" },
        { id: "Options" },
    ],
    2: {
        0: [
            { id: "Mass" },
            { id: "Black Hole", unl() { return player.bh.unl }, style: "bh" },
            { id: "Atomic Generator", unl() { return player.atom.unl }, style: "atom" },
            { id: "Indescribable Matter", unl() { return quUnl() }, style: "qu" },
            { id: "Prestigious", unl() { return hasUpgrade("br", 9) }, style: "pm" },
            { id: "Eternal", unl() { return player.et.times.gt(0) }, style: "et" },
            { id: "Ascendent", unl() { return hasUpgrade("br", 9) }, style: "bh" },
        ],
        1: [
            { id: "Ranks Rewards" },
            { id: "Prestige Rewards", unl() { return hasUpgrade("br",9) } },
            { id: "Ascension Rewards", unl() { return hasAscension(0,1) } },
            { id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
        2: [
            { id: "Upgrades" },
            { id: "Neutron Tree", unl() { return quUnl() } },
            { id: "Elements", unl() { return player.chal.comps[7].gte(16) || player.supernova.times.gte(1) || quUnl() } },
        ],
        3: [
            { id: "Challenges" },
            { id: "Quantum Challenges", unl() { return hasTree("unl3") }, style: "qu" },
            { id: "Galactic Challenges", unl() { return hasElement(267) }, style: "gal" },
        ],
        4: [
            { id: "Particles" },
            { id: "Mass Dilation", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
            { id: "Stars", unl() { return STARS.unlocked() }, style: "star" },
            { id: "Supernova", unl() { return player.exotic.times.gte(1) }, style: "sn" },
        ],
        5: [
            { id: "Neutron Tree", unl() { return !quUnl() } },
            { id: "Bosons", unl() { return player.supernova.post_10 } },
            { id: "Fermions", unl() { return player.supernova.fermions.unl } },
            { id: "Radiation", unl() { return tmp.radiation.unl } },
            { id: "Galactic", unl() { return hasElement(218) || player.superGal.gte(1) }, style: "gal" },
        ],
        6: [
            { id: "Chroma" },
            { id: "Primordium", unl() { return PRIM.unl() } },
            { id: "Entropy", unl() { return player.qu.en.unl } },
            { id: "Break Dilation", unl() { return hasUpgrade("br",9) }, style: "break_dilation" },
            { id: "Quantum Milestones" },
            { id: "Auto-Quantum", unl() { return tmp.qu.mil_reached[6] } },
        ],
        7: [
            { id: "Main", unl() { return true } },
            { id: "G-Fermions", unl() { return hasElement(237) } },
            { id: "G-Particles", unl() { return hasElement(251) } },
            { id: "Cluster", unl() { return hasElement(387) || player.superCluster.gte(1) }, style: "gal" },
        ],
        8: [
            { id: "Exotic Milestones" },
            { id: "RC Boosters", unl() { return hasUpgrade("exotic",5) } },
            { id: "Exotic Boosts", unl() { return hasUpgrade("exotic",10) } },
            { id: "Darkness", unl() { return hasUpgrade("exotic",15) } },
        ],
    },
}