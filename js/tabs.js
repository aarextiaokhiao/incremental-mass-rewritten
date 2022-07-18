const TABS = {
    choose(x, stab=false) {
        if (!stab) {
            tmp.prev_tab = tmp.tab
            tmp.tab = x
        }
        else tmp.stab[tmp.tab] = x
    },
    back() {
        tmp.tab = tmp.prev_tab
        tmp.prev_tab = tmp.tab
    },
    1: [
        { id: "Main" },
        { id: "Stats", unl() { return player.rp.unl && !pres() } },
        { id: "Upgrades", unl() { return player.rp.unl && !pres() } },
        { id: "Challenges", unl() { return player.chal.unl } },
        { id: "Atom", unl() { return player.atom.unl && !pres() }, style: "atom" },
        { id: "Supernova", unl() { return player.supernova.unl }, style: "sn" },
        { id: "Exotic", unl() { return EXT.unl() }, style: "ext" },
        { id: "Prestige", unl() { return pres() } },
        { id: "Options" },
    ],
    2: {
        0: [
            { id: "Mass", unl() { return !pres() } },
            { id: "Black Hole", unl() { return player.bh.unl && !pres() }, style: "bh" },
            { id: "Atomic Generator", unl() { return player.atom.unl && !pres() }, style: "atom" },
            { id: "Stars", unl() { return STARS.unlocked() && !pres() }, style: "star" },
            { id: "Big Rip", unl() { return pres() } },
        ],
        1: [
            { id: "Ranks Rewards" },
            { id: "Scaling", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
        /*3: [
            { id: "Challenges" },
            { id: "Vacuum Decay", unl() { return future } },
        ],*/
        4: [
            { id: "Particles" },
            { id: "Elements", unl() { return player.chal.comps[7].gte(16) || player.supernova.unl } },
            { id: "Mass Dilation", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
        ],
        5: [
            { id: "Neutron Tree" },
            { id: "Bosons", unl() { return player.supernova.post_10 } },
            { id: "Fermions", unl() { return player.supernova.fermions.unl } },
            { id: "Radiation", unl() { return tmp.radiation.unl } },
        ],
        6: [
            { id: "Axions" },
            { id: "Glueballs", unl() { return player.ext.ch.unl || pres() }, style: "ch" },
            { id: "Primordium", unl() { return PRIM.unl() || pres() }, style: "pr" },
            { id: "Entropy", unl() { return pres() } }
        ],
    },
}