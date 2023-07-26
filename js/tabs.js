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
        { id: "Main", icon: "pajamas:weight" },
        { id: "Stats", icon: "material-symbols:query-stats" },
        { id: "Upgrades", icon: "carbon:upgrade", unl() { return player.rp.unl } },
        { id: "Challenges", icon: "material-symbols:star", unl() { return player.chal.unl } },
        { id: "Atom", icon: "eos-icons:atom-electron", color: "cyan", unl() { return player.atom.unl }, style: "atom" },
        { id: "Supernova", icon: "material-symbols:explosion-outline", color: "magenta", unl() { return player.supernova.times.gte(1) || quUnl() }, style: "sn" },
        { id: "Quantum", icon: "material-symbols:grid-4x4-rounded", color: "lightgreen", unl() { return quUnl() }, style: "qu" },
        { id: "Darkness", icon: "ic:baseline-remove-red-eye", color: "grey", unl() { return player.dark.unl }, style: "dark" },
        { id: "Infinity", icon: "game-icons:infinity", color: "orange", unl() { return tmp.inf_unl }, style: "inf" },
        { id: "Options", icon: "mdi:gear" },
    ],
    2: {
        0: [
            { id: "Mass" },
            { id: "Black Hole", unl() { return player.bh.unl }, style: "bh" },
            { id: "Generators", unl() { return player.atom.unl }, style: "atom" },
            { id: "Prestigous", unl() { return hasUpgrade('br',9) } },
            { id: "Ascendant", unl() { return tmp.ascensions_unl } },
        ],
        1: [
            { id: "Ranks Rewards" },
            { id: "Prestige Rewards", unl() { return hasUpgrade("br",9) } },
            { id: "Ascension Rewards", unl() { return tmp.ascensions_unl } },
            { id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
        2: [
            { id: "Upgrades" },
            { id: "Elemental", unl() { return tmp.elements.unl_length }, style: "atom" },
            { id: "Infinity Upgrades", style: "inf" },
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
            { id: "Neutron Tree" },
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
            { id: "Exotic Atoms", unl() { return tmp.eaUnl } },
        ],
        8: [
            { id: "Core" },
            { id: "Core Effect" },
            { id: "Corrupted Star", unl() { return tmp.CS_unl }, style: "c16" },
        ],
        9: [
            { id: "Options" },
            { id: "Resource Hider" },
        ],
    },
}