const TABS = {
	choose(x, stab=false) {
		if (!stab) {
			tmp.prev_tab = tmp.tab
			tmp.tab = x
		} else if (tmp.tab == 4 && x == 5) {
			TABS.choose(5)
		} else {
			tmp.stab[tmp.tab] = x
		}
	},
	back() {
		this.choose(tmp.prev_tab)
	},
    1: [
        { id: "Main" },
        { id: "Stats" },
        { id: "Upgrades", unl() { return player.rp.unl } },
        { id: "Challenges", unl() { return player.chal.unl } },
        { id: "Atom", unl() { return player.atom.unl }, style: "atom" },
        { id: "Supernova", unl() { return player.supernova.times.gte(1) || quUnl() }, style: "sn" },
        { id: "Quantum", unl() { return quUnl() }, style: "qu" },
        { id: "Darkness", unl() { return player.dark.unl }, style: "dark" },
        { id: "Options" },
    ],
    2: {
        0: [
            { id: "Mass" },
            { id: "Black Hole", unl() { return player.bh.unl }, style: "bh" },
            { id: "Atomic Generator", unl() { return player.atom.unl }, style: "atom" },
            { id: "Indescribable Matter", unl() { return quUnl() }, style: "qu" },
            { id: "Prestigous", unl() { return hasUpgrade('br',9) } },
        ],
        1: [
            { id: "Ranks Rewards" },
            { id: "Beyond-Ranks Rewards", unl() { return tmp.brUnl } },
            { id: "Prestige Rewards", unl() { return hasUpgrade("br",9) } },
            { id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
        2: [
            { id: "Upgrades" },
            { id: "Neutron Tree", unl() { return quUnl() }, style: "sn" },
            { id: "Elements", unl() { return tmp.elements.unl_length }, style: "atom" },
            { id: "Elements+", unl() { return tmp.elements.unl_length > 118 }, style: "dark" },
        ],
        3: [
            { id: "Challenges" },
            { id: "Quantum Challenge", unl() { return hasTree("unl3") }, style: "qu" },
            { id: "Corruption", unl() { return player.dark.c16.first }, style: "c16" },
        ],
        4: [
            { id: "Particles" },
            { id: "Mass Dilation", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
            { id: "Stars", unl() { return STARS.unlocked() }, style: "star" },
        ],
        5: [
            { id: "Neutron Tree", unl() { return !quUnl() } },
            { id: "Bosons", unl() { return player.supernova.post_10 }, style: "boson" },
            { id: "Fermions", unl() { return player.supernova.fermions.unl }, style: "ferm" },
            { id: "Radiation", unl() { return tmp.radiation.unl }, style: "rad" },
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
            { id: "Dark Effects" },
            { id: "Dark Run", unl() { return tmp.darkRunUnlocked } },
            { id: "The Matters", unl() { return tmp.matterUnl } },
        ]
    },
}