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
	order: [0,1,2,3,7,4,5,6,8],
    1: [
        { id: "Main" },
        { id: "Stats", unl() { return player.rp.unl } },
        { id: "Upgrades", unl() { return player.rp.unl } },
        { id: "Challenges", unl() { return player.chal.unl } },
        { id: "Atom", unl() { return player.atom.unl }, style: "atom" },
        { id: "Supernova", unl() { return player.supernova.unl }, style: "sn" },
        { id: "Exotic", unl() { return EXT.unl() }, style: "ext" },
        { id: "Magic", unl() { return inNGM() && player.mg.unl }, style: "magic" },
        { id: "Options" },
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
        ],
        3: [
            { id: "Challenges" },
            { id: "Entropic Grid", unl() { return future || PRES.unl() }, style: "ext" },
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
            { id: "Glueballs", unl() { return player.ext.ch.unl || PRES.unl() }, style: "ch" },
            { id: "Primordium", unl() { return PRIM.unl() || PRES.unl() }, style: "pr" },
            { id: "False Vacuum", unl() { return future || PRES.unl() } }
        ],
    },
}