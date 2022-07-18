const TREE_TAB = [
    {title: "Main"},
    {title: "Quality of Life"},
    {title: "Challenge"},
    {title: "Post-Supernova", unl() { return player.supernova.post_10 } },
    {title: "Exotic", unl() { return EXT.unl() } },
    {title: "Feats", unl() { return hasTree("rad1") || EXT.unl() } },
]

const TREE_IDS = [
	[
		['c'],
		['qol1','qol2','qol3','qol4'],
		['chal1'],
		['','bs1','','','unl1','rad1'],
		['eb1','eb2','ext_u1','ext_u2'],
		['feat1','feat2','feat3','feat4','feat5'],
	],[
		['s1','m1','rp1','bh1','sn1'],
		['qol7','qol6','qol5'],
		['chal2','chal4a','chal3'],
		['bs4','bs2','fn1','bs3','','','rad2','rad3'],
		['','','ext_c','','ext_u3'],
		['feat6','feat7','feat8','feat9','feat10'],
	],[
		['s2','m2','t1','d1','bh2','gr1','sn2'],
		['qol8','qol9','qol10'],
		['chal4','chal8'],
		['fn3','fn4','fn2','fn5','','','rad4','rad5'],
		["ext_l1","","ext_b1"],
		['feat11'],
	],[
		['s3','m3','gr2','sn3'],
		['qol_ext1','qol_ext2','qol_ext3','qol_ext4','qol_ext5'],
		['chal5','chal6','chal7'],
		['','fn6','fn7','fn8','','','',''],
		["ext_l2","ext_l3","ext_e1","ext_b2","ext_b3"],
		[],
	],[
		['s4','sn5','sn4'],
		['qol_ext6','qol_ext7','qol_ext8','qol_ext9','qol_ext10'],
		[],
		[],
		["ext_l4","ext_l5"],
		[],
	],[
		[],
		['', '', 'qol_shrt', '', 'qol_ext11'],
		[],
		[],
		[],
		[],
	],
]

var tree_canvas,tree_ctx,tree_update=true

const TREE_UPGS = {
    buy(x) {
        if (tmp.supernova.tree_choosed == x && tmp.supernova.tree_afford[x]) {
            player.supernova.stars = player.supernova.stars.sub(this.ids[x].cost).max(0)
            player.supernova.tree.push(x)
            if (TREE_UPGS.ids[x].onBuy) TREE_UPGS.ids[x].onBuy()
        }
    },
    ids: {
        c: {
            desc: `Start generating 0.1 Neutron Star per second (not affected by offline production).`,
			perm: 2,
            cost: E(0),
        },
        sn1: {
            branch: ["c"],
            desc: `Tickspeed boosts Neutron Stars, at a reduced rate.`,
            cost: E(10),
            effect() {
                let x = player.tickspeed.add(1).pow(0.25)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn2: {
            branch: ["sn1"],
            desc: `Supernovae boost Neutron Stars.`,
            cost: E(350),
            effect() {
                let x = E(2).add(hasTree("sn4")?treeEff("sn4"):0).pow(player.supernova.times.softcap(15,0.8,0).softcap(25,0.5,0))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn3: {
            branch: ["sn2"],
            desc: `Blue Stars boost Neutron Stars, at a reduced rate.`,
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 Supernovae.`,
            cost: E(50000),
            effect() {
                let x = player.stars.generators[4].max(1).log10().add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn4: {
            branch: ["sn3"],
            desc: `Supernovae adds “sn2”'s base.`,
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(15) },
            reqDesc: `15 Supernovae.`,
            cost: E(1e8),
            effect() {
                let x = player.supernova.times.mul(0.1).softcap(1.5,0.75,0)
                return x
            },
            effDesc(x) { return "+"+format(x)+getSoftcapHTML(x,1.5) },
        },
        m1: {
            branch: ["c"],
            desc: `Neutron Stars boost Mass.`,
            cost: E(100),
            effect() {
                let x = E(1e100).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e100),1e3) },
        },
        m2: {
            branch: ["m1"],
            desc: `Mass softcap^2 starts ^1.5 later.`,
            cost: E(800),
        },
        m3: {
            branch: ["m2"],
            unl() { return player.supernova.fermions.unl && hasTree("fn1") },
            desc: `Mass softcaps^2-3 scales later based on Supernovae.`,
            cost: E(1e46),
            effect() {
                let x = player.supernova.times.mul(0.0125).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x)+" later" },
        },
        t1: {
            branch: ["m1", 'rp1'],
			req() {
				if (hasTree("qol_ext1")) return true
				return player.supernova.chal.noTick && player.mass.gte(E("1.5e1.650056e6").pow(hasTree('bh2')?1.46:1))
			},
            reqDesc() {return `Reach ${formatMass(E("1.5e1.650056e6").pow(hasTree('bh2')?1.46:1))} without buying Tickspeed in Supernova run. You can still obtain Tickspeed from Cosmic Rays.`},
            desc: `Raise Tickspeed Power by ^1.15.`,
            cost: E(1500),
        },
        rp1: {
            branch: ["c"],
            desc: `Neutron Stars boost Rage Power.`,
            cost: E(200),
            effect() {
                let x = E(1e50).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e50),1e3)},
        },
        bh1: {
            branch: ["c"],
            desc: `Neutron Stars boost Dark Matter.`,
            cost: E(400),
            effect() {
                let x = E(1e35).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e35),1e3) },
        },
        bh2: {
            branch: ['bh1'],
			req() {
				if (hasTree("qol_ext1")) return true
				return player.supernova.chal.noBHC && player.bh.mass.gte("1.5e1.7556e4")
			},
            reqDesc() {return `Reach ${format("e1.75e4")} uni of black hole without buying any BH Condenser in Supernova run.`},
            desc: `Raise BH Condenser Power by ^1.15.`,
            cost: E(1500),
        },
        s1: {
            branch: ["c"],
            desc: `Neutron Stars boost last-unlocked Stars.`,
            cost: E(400),
            effect() {
                let x = player.supernova.stars.add(1).pow(1.4)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        s2: {
            branch: ["s1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovae.`,
            desc: `Weaken Tetr to Stars' softcap by 50%.`,
            cost: E(2500),
        },
        s3: {
            branch: ["s2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Supernovae raise Star Generators.`,
            cost: E(10000),
            effect() {
                let x = player.supernova.times.max(0).root(10).mul(0.1).add(1)
                if (future) x = x.pow(5) //Max: ^10 (Inflation)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        s4: {
            branch: ["s3"],
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 Supernovae.`,
            desc: `Beyond unlocking stars, Star Unlocker will transform into Booster.`,
            cost: E(1e5),
        },
        qol1: {
            req() { return player.supernova.times.gte(2) },
            reqDesc: `2 Supernovae.`,
            desc: `Start with Silicon-14 & Argon-18 unlocked. You can now automatically buy Elements & Atom upgrades.`,
            cost: E(1500),
        },
        qol2: {
            branch: ["qol1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovae.`,
            desc: `Start with Chromium-24 and Atom upgrade 6 unlocked.`,
            cost: E(2000),
        },
        qol3: {
            branch: ["qol2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Start with Techntium-43 unlocked, improve their element better. You can automatically gain Relativistic particles from mass.`,
            cost: E(10000),
        },
        qol4: {
            branch: ["qol3"],
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(12) },
            reqDesc: `12 Supernovae.`,
            desc: `Automatically buy Star Unlockers & Boosters.`,
            cost: E(1e8),
        },
        qol5: {
            branch: ["qol4"],
            req() { return player.supernova.times.gte(16) },
            reqDesc: `16 Supernovae.`,
            desc: `Tetrs no longer reset.`,
            cost: E(1e13),
        },
        qol6: {
            branch: ["qol5"],
            req() { return player.supernova.times.gte(17) },
            reqDesc: `17 Supernovae.`,
            desc: `While in any challenge, you can now automatically complete it before exiting.`,
            cost: E(1e15),
        },
        qol7: {
            branch: ["qol6"],
            unl() { return player.supernova.fermions.unl && hasTree("fn2") },
            req() { return player.supernova.times.gte(40) },
            reqDesc: `40 Supernovae.`,
            desc: `You can now automatically buy Photon & Gluon upgrades, they no longer spent their amount.`,
            cost: E(1e48),
        },
        chal1: {
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Add 100 more C7 & C8 maximum completions.`,
            cost: E(6000),
        },
        chal2: {
            branch: ["chal1"],
            req() {
				if (hasTree("qol_ext1")) return true
                for (let x = 1; x <= 4; x++) if (player.chal.comps[x].gte(1)) return false
                return player.mass.gte(E('e2.05e6').mul(1.5e56))
            },
            reqDesc() { return `Reach ${format('e2.05e6')} uni without challenge 1-4 completions in Supernova run.` },
            desc: `Keep challenge 1-4 completions on reset.`,
            cost: E(1e4),
        },
        chal3: {
            branch: ["chal1"],
            req() {
				if (hasTree("qol_ext1")) return true
                for (let x = 5; x <= 8; x++) if (player.chal.comps[x].gte(1)) return false
                return player.bh.mass.gte(E('e1.75e4').mul(1.5e56))
            },
            reqDesc() { return `Reach ${format('e1.75e4')} uni of black hole without challenge 5-8 completions in Supernova run.` },
            desc: `Keep challenge 5-8 completions on reset.`,
            cost: E(1e4),
        },
        chal4: {
            branch: ["chal2","chal3"],
            desc: `Unlock new challenge.`,
            cost: E(1.5e4),
        },
        chal4a: {
            unl() { return player.supernova.post_10 },
            branch: ["chal4"],
            desc: `Make 9th Challenges effect better.`,
            cost: E(1e8),
        },
        chal5: {
            branch: ["chal4"],
            desc: `Unlock new challenge.`,
            cost: E(1e17),
        },
        gr1: {
            branch: ["bh1"],
            desc: `BH Condenser Power synergizes Cosmic Ray Power.`,
            req() { return player.supernova.times.gte(7) },
            reqDesc: `7 Supernovae.`,
            cost: E(1e6),
            effect() {
                let x = tmp.bh?tmp.bh.condenser_eff.pow.max(1).root(3):E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        gr2: {
            unl() { return player.supernova.fermions.unl },
            branch: ["gr1"],
            desc: `Raise Cosmic Ray Power by ^1.25.`,
            cost: E(1e20),
        },
        bs1: {
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(15) },
            reqDesc: `15 Supernovae`,
            desc: `Tickspeed boosts Higgs Bosons.`,
            cost: E(1e13),
            effect() {
                let x = player.tickspeed.add(1).pow(0.6)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs2: {
            branch: ["bs1"],
            desc: `Photons and Gluons power-up each other.`,
            cost: E(1e14),
            effect() {
                let x = expMult(player.supernova.bosons.photon.max(1),1/2,2)
                let y = expMult(player.supernova.bosons.gluon.max(1),1/2,2)
                return [x,y]
            },
            effDesc(x) { return format(x[1])+"x to Photon, "+format(x[0])+"x to Gluon" },
        },
        bs3: {
            branch: ["bs1"],
            desc: `Neutrons gain is affected by Graviton's effect at a reduced rate.`,
            cost: E(1e14),
            effect() {
                let x = tmp.bosons.effect.graviton[0].add(1).root(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs4: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs2"],
            desc: `Raise Z Bosons gain to the 1.5th power.`,
            cost: E(1e24),
        },
        fn1: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs1"],
            desc: `Tickspeed boost Fermions at a reduced rate.`,
            cost: E(1e27),
            effect() {
                let x = E(1.25).pow(player.tickspeed.pow(0.4))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        fn2: {
            branch: ["fn1"],
            req() { return hasTree("qol_ext1") || (player.mass.div('1.5e56').gte("ee6") && player.md.active && FERMIONS.onActive("01")) },
            reqDesc() { return `Reach ${formatMass(E('e1e6').mul(1.5e56))} while dilating mass in [Down]` },
            desc: `Unlock 2 new types of U-Quark & U-Fermion.`,
            cost: E(1e33),
        },
        fn3: {
            branch: ["fn1"],
            req() { return player.supernova.fermions.points[0].gte(1e7) || player.supernova.fermions.points[1].gte(1e7) },
            reqDesc() { return `Reach ${format(1e7)} of any Fermions` },
            desc: `Super Fermions scale 7.5% weaker.`,
            cost: E(1e30),
        },
        fn4: {
            unl() { return hasTree("fn2") },
            branch: ["fn1"],
            desc: `2nd Photon & Gluon upgrades are slightly stronger.`,
            cost: E(1e39),
        },
        fn5: {
            unl() { return hasTree("fn2") },
            branch: ["fn1"],
            req() { return hasTree("qol_ext1") || (player.atom.quarks.gte("e12500") && FERMIONS.onActive("10")) },
            reqDesc() { return `Reach ${format("e12500")} quarks while in [Electron]` },
            desc: `[Electron] max tier is increased by 35. Its effect softcap is weaker.`,
            cost: E(1e42),
        },
        fn6: {
            branch: ["fn2"],
            req() { return hasTree("qol_ext1") || (player.mass.gte(uni('e4e4')) && FERMIONS.onActive("02") && CHALS.inChal(5)) },
            reqDesc() { return `Reach ${formatMass(uni("e4e4"))} while in [Charm] & Challenge 5.` },
            desc: `Unlock 2 new more types of U-Quark & U-Fermion.`,
            cost: E(1e48),
        },
        d1: {
            unl() { return hasTree("fn6") },
            branch: ["rp1"],
            desc: `Generating Relativistic particles outside Mass dilation is 25% stronger.`,
            cost: E(1e51),
        },
        unl1: {
            unl() { return hasTree("qol7") },
            req() { return player.supernova.times.gte(44) },
            reqDesc: `44 Supernovae.`,
            desc: `Unlock Radiation.`,
            cost: E(5e52),
        },
        rad1: {
            branch: ["unl1"],
            unl() { return tmp.radiation.unl },
            desc: `Gain more frequency based on Supernova, any more radiation if you unlocked next radiation.`,
            cost: E(1e54),
            effect() {
                let x = player.supernova.times.add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        rad2: {
            branch: ["rad1"],
            desc: `Gain more Radiation based on Supernovae.`,
            cost: E(1e72),
            effect() {
				let sn = player.supernova.times
				let b = sn.div(300).add(1)
				let e = sn.sub(40).max(0)
                return b.pow(e).sub(1).div(10).add(1)
            },
            effDesc(x) { return format(x)+"x" },
        },
        qol8: {
            branch: ["qol6"],
            req() { return player.supernova.times.gte(20) },
            reqDesc: `20 Supernovae.`,
            desc: `You can automatically sweep challenges and fermions. [Req: 50 Challenge completions / 15 Fermion tiers]`,
            cost: E(1e20),
        },
        fn7: {
            branch: ["fn6"],
            unl() { return hasTree("rad1") },
            desc: `Unlock 2 even more types of U-Quark & U-Fermion.`,
            cost: E(1e80),
        },
        chal6: {
            branch: ["chal5"],
            desc: `Unlock new challenge, and reduce auto-sweep threshold to 10.`,
            cost: E(1e94),
        },
        sn5: {
            branch: ["sn4"],
            unl() { return hasTree("rad1") },
            desc: `Supernova scalings are no longer rounded down to a integer, and unlock Pent.`,
            cost: E(1e90),
        },
        fn8: {
            branch: ["fn7"],
            desc: `Unlock 2 final types of U-Quark & U-Fermion.`,
            cost: E(1e128),
        },
        rad3: {
            branch: ["rad1"],
            desc: `Extra levels are raised based on radiation types.`,
            cost: E(4.56789e123),
        },
        qol9: {
            branch: ["qol8"],
            desc: `You can enter both U-Quarks and U-Leptons.`,
            cost: E(1e105),
        },
        chal7: {
            branch: ["chal6"],
            desc: `Unlock the finale of Supernova Challenges, Challenge 12.`,
            cost: E(1e165),
        },
        qol10: {
            branch: ["qol9"],
            desc: `You can manually sweep Challenges or Fermions.`,
            cost: E(1e120),
        },
        rad4: {
            unl() { return EXT.unl() },
            branch: ["rad2"],
            desc: `All Radiation Meta-Boosts are 50% stronger.`,
            cost: E(1e190),
        },

		/* EXOTIC */
        eb1: {
            unl() { return EXT.unl() },
            desc: `Unlock Black Hole and Atomic Buildings #2.`,
            cost: E(1e10),
			perm: 2,
        },
        eb2: {
			branch: ["eb1"],
            desc: `Unlock Black Hole and Atomic Buildings #3.`,
            cost: E(1e200),
			perm: 2,
        },
		chal8: {
			branch: ["chal7"],
			req() { return player.ext.amt.gte(EXT.amt(1e32)) },
			reqDesc() { return "Get " + format(EXT.amt(1e32)) + " Exotic Matter." },
			desc: `Unlock the introduction challenge of the Exotic side, Challenge 13.`,
			cost: E(0),
			perm: 1,
		},
		rad5: {
			unl() { return EXT.unl() },
			branch: ["rad3"],
			desc: `Meta-Boost I is stronger based on Pents.`,
			cost: E("1e370"),
			effect() {
				return player.ranks.pent.div(5).add(1).log10().div(2)
			},
			effDesc(x) {
				return "n -> " + format(x) + "n^2.5"
			},
		},
		ext_c: {
			branch: ["eb2"],
			req() { return player.ext.amt.gte(EXT.amt(1e5)) },
			reqDesc() { return "Get " + format(EXT.amt(1e5)) + " Exotic Matter." },
			desc: `Start producing Y-Axions based on Supernovae.`,
			cost: E("3.333e333"),
		},
		ext_l1: {
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXT.amt(1e8)) },
			reqDesc() { return "Get " + format(EXT.amt(1e8)) + " Exotic Matter." },
			desc: `Axion Levels increase costs 20% slower.`,
			cost: E("1e400"),
		},
		ext_l2: {
			branch: ["ext_l1"],
			req() { return player.ext.amt.gte(EXT.amt(hasTree("ext_l3") ? 1e40 : 1e11)) },
			reqDesc() { return "Get " + format(EXT.amt(hasTree("ext_l3") ? 1e40 : 1e11)) + " Exotic Matter. [increased with ext_l3]" },
			desc: `Axion Levels synergize with ones from the other side.`,
			cost: E(0),
			icon: "ext_l",
		},
		ext_l3: {
			branch: ["ext_l1"],
			req() { return player.ext.amt.gte(EXT.amt(hasTree("ext_l2") ? 1e40 : 1e11)) },
			reqDesc() { return "Get " + format(EXT.amt(hasTree("ext_l2") ? 1e40 : 1e11)) + " Exotic Matter. [increased with ext_l2]" },
			desc: `Axion Levels cheapen the nearest ones.`,
			cost: E(0),
			icon: "ext_l",
		},
		ext_l4: {
			branch: ["ext_l2", "ext_l3"],
			req() { return hasTree("ext_l2") && hasTree("ext_l3") },
			reqDesc() { return "Get 'ext_l2' and 'ext_l3' upgrades." },
			desc: `Axion Levels cheapen ones on the right / underneath.`,
			cost: E("1e1800"),
			icon: "ext_l",
		},
		ext_l5: {
			unl() { return GLUBALL.unl() },
			branch: ["ext_l4"],
			req() { return player.ext.amt.gte(EXT.amt("e2e3")) },
			reqDesc() { return "Get " + format(EXT.amt("e2e3")) + " Exotic Matter." },
			desc: `Exotic Matter weakens Axion Upgrades.`,
            effect() {
                return EXT.eff().add(1).log10().div(5e3).add(1).log10().div(6).add(1).min(2)
            },
            effDesc(x) { return format(x)+"x" },
			cost: E("1e4500"),
		},
		ext_b1: {
			unl() { return hasTree("ext_l2") || hasTree("ext_l3") },
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXT.amt(3e23)) },
			reqDesc() { return "Get " + format(EXT.amt(3e23)) + " Exotic Matter." },
			desc: `Row-4 levels synergize with row-1 levels.`,
			cost: E(0),
		},
		ext_b2: {
			unl() { return GLUBALL.unl() },
			branch: ["ext_b1"],
			req() { return player.ext.amt.gte(EXT.amt(hasTree("ext_b3") ? "e600" : 1e150)) },
			reqDesc() { return "Get " + format(EXT.amt(hasTree("ext_b3") ? "e600" : 1e150)) + " Exotic Matter." },
			desc: `X Axion Upgrades multiply levels.`,
			cost: E(0),
		},
		ext_b3: {
			unl() { return GLUBALL.unl() },
			branch: ["ext_b1"],
			req() { return player.ext.amt.gte(EXT.amt(hasTree("ext_b2") ? "e600" : 1e150)) },
			reqDesc() { return "Get " + format(EXT.amt(hasTree("ext_b2") ? "e600" : 1e150)) + " Exotic Matter." },
			desc: `Y Axion Upgrades multiply levels.`,
			cost: E(0),
		},
		ext_e1: {
			unl() { return GLUBALL.unl() },
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXT.amt(1e65)) },
			reqDesc() { return "Get " + format(EXT.amt(1e65)) + " Exotic Matter." },
			desc: `Start producing Z-Axions based on log^2(EM). <span class='scarlet'>[Z-Axion Upgrades multiply!]</span>`,
			cost: E(0),
		},
		ext_u1: {
			unl() { return EXT.unl() },
			branch: ["ext_c"],
			req() { return player.ext.amt.gte(EXT.amt(1e15)) },
			reqDesc() { return "Get " + format(EXT.amt(1e15)) + " Exotic Matter." },
			desc: `Cleanse softcaps of MD Upgrades 1, 3, and 8; but nullify MD Upgrade 12.`,
			cost: E(0),
			perm: 2,
		},
		ext_u2: {
			unl() { return EXT.unl() },
			branch: ["ext_u1"],
			req() { return player.ext.amt.gte(EXT.amt(1e50)) },
			reqDesc() { return "Get " + format(EXT.amt(1e50)) + " Exotic Matter." },
			desc: `Square Argon-18, but boosts Tickspeed Power instead.`,
			cost: E(0),
			perm: 2,
		},
		ext_u3: {
			unl() { return EXT.unl() },
			branch: ["ext_u2"],
			req() { return player.ext.amt.gte(EXT.amt(1e280)) },
			reqDesc() { return "Get " + format(EXT.amt(1e280)) + " Exotic Matter." },
			desc: `Remove Mg-12, but rebalance Particles. [Bring Particle Powers back to glory]`,
			cost: E(0),
			perm: 2,
		},
		qol_ext1: {
			branch: ["qol1"],
			unl() { return EXT.unl() },
			req() { return player.supernova.times.gte(4) },
			reqDesc() { return `${format(4,0)} Supernovae` },
			desc: `You don't need to do requirements before buying several Supernova upgrades.`,
			cost: E(2000),
			icon: "qol_ext"
		},
		qol_ext2: {
			branch: ["qol_ext1"],
			req() { return player.ext.amt.gte(EXT.amt(10)) },
			reqDesc() { return format(EXT.amt(10)) + " Exotic Matter" },
			desc: `Reduce the auto-sweeper threshold to 10, and auto-sweep Challenge 12.`,
			cost: E(1e100),
			icon: "qol_ext"
		},
		qol_ext3: {
			branch: ["qol_ext1"],
			desc: `Radiation Boosters are fully automated for at least 100,000 radiation.`,
			cost: E(1e185),
			icon: "qol_ext"
		},
		qol_ext4: {
			branch: ["qol_ext1"],
			req() {
				let sum = E(0)
				for (var i = 1; i <= CHALS.cols; i++) sum = sum.add(player.chal.comps[i])
				return sum.round().gte(6e3)
			},
			reqDesc: `Get 6,000 challenge completions.`,
			desc: `Keep the 'chal' upgrades except you start with 50 completions and 10 tiers for each Fermion.`,
			cost: E(1e200),
			icon: "qol_ext"
		},
		qol_ext5: {
			branch: ["qol_ext1"],
			desc: `Keep the core Supernova upgrades.`,
			cost: E(1e170),
			icon: "qol_ext"
		},
		qol_ext6: {
			branch: ["qol_ext1"],
			desc: `Keep the Boson - Fermion upgrades, and start with 10 completions for C9 - 11.`,
			cost: E(1e250),
			icon: "qol_ext"
		},
		qol_ext7: {
			branch: ["qol_ext1"],
			desc: `Keep the Radiation upgrades.`,
			cost: E("1e400"),
			icon: "qol_ext"
		},
		qol_ext8: {
			branch: ["qol_ext1"],
			desc: `Automatically gain C1 - 8 completions without entering.`,
			cost: E("1e800"),
			icon: "qol_ext"
		},
		qol_ext9: {
			branch: ["qol_ext8"],
			desc: `If not in C14 - 16, automatically gain C9 - 11 completions and Up - Top Quark tiers.`,
			cost: E("e1e7"),
			icon: "qol_ext"
		},
		qol_ext10: {
			branch: ["qol_ext5"],
			desc: `Gain Supernovae at least 30% more, passively during a sweep.`,
			cost: E("1e2500"),
			icon: "qol_ext"
		},
		qol_ext11: {
			branch: ["qol_ext4"],
			desc: `You can stay in Mass Dilation on reset.`,
			cost: E("1e1e4"),
			icon: "qol_ext"
		},
		qol_shrt: {
			branch: ["qol_ext1"],
			desc: `Unlock Shortcuts.`,
			cost: E("1e300"),
		},

		/* FEATS */
		feat1: {
			req() {
				if (!FERMIONS.outside()) return
				if (!featCheck()) return

				return player.mass.lt(player.stats.maxMass.pow(3e-3))
			},
			reqDesc: () => `Get mass below ^0.002 best in Fermion, with automation on.` +
				(FERMIONS.outside() ? " (not in Fermion)" : " (" + formatMass(player.mass) + " / " + formatMass(player.stats.maxMass.pow(2e-3)) + ")"),
			failed: () => FERMIONS.outside(),
			desc: `Gain 3x more Radiation.`,
			cost: E(1e130),
		},
		feat2: {
			req() {
				if (player.chal.active || !player.md.active) return
				if (!featCheck()) return

				return player.mass.gte(player.supernova.maxMass.pow(0.1))
			},
			reqDesc: () => `Get ^0.1 of best Supernova mass only in Mass Dilation, with automation on.` +
				(player.chal.active ? " (in challenge)" : !player.md.active ? " (not in dilation)" : " (" + formatMass(player.mass) + " / " + formatMass(player.supernova.maxMass.pow(0.1)) + ")"),
			failed: () => player.chal.active,
			desc: `Add ^0.015 to Titanium-73 effect.`,
			cost: E(1e140),
		},
		feat3: {
			req() { return player.mass.gte(uni("e2.5e10")) && player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length < 30 },
			failed() { return player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length >= 30 },
			reqDesc: () => "Get " + formatMass(uni("e2.5e10")) + " with at most 30 Main Upgrades." + failedHTML(player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length < 30, true, " (" + (player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length) + " / 30)"),
			desc: `Pre-Ultra Tickspeed scalings scale 15% weaker.`,
			cost: E(1e155)
		},
		feat4: {
			unl() { return EXT.unl() },
			req() {
				if (player.mass.lt(mlt(1))) return false
				return !TREE_UPGS.ids.feat4.failed()
			},
			failed() {
				let sum = E(0)
				for (var i = 1; i <= CHALS.cols; i++) sum = sum.add(player.chal.comps[i])
				for (var i = 1; i <= 8; i++) if (player.chal.comps[i].lte(sum.mul(.05))) return true
				return false
			},
			reqDesc() { return `Get ${formatMass(mlt(1))} mass with one of C1-8s having < 5% total.` },
			desc: `Reduce the auto-sweeper threshold to 7.`,
			cost: E(1e100),
		},
		feat5: {
			unl() { return EXT.unl() },
			req() { return player.mass.gte(mlt(1)) && player.ext.time <= 3600 },
			failed() { return player.ext.time > 3600 },
			reqDesc() { return `Reach ${formatMass(mlt(1))} mass in 1 hour. ` + failedHTML(player.ext.time <= 3600, false, "(" + formatTime(player.ext.time) + " / 1:00:00)") },
			desc: `+^0.05 to Mass and Rage gain exponents and their caps.`,
			cost: E(1e40),
		},
		feat6: {
			unl() { return EXT.unl() },
			req() { return player.ext.chal.f6 },
			reqDesc() { return `Get +15 Supernova gains in under ${formatMass(uni("ee10"))} mass.` + failedHTML(player.ext.chal.f6, true) },
			desc: `Pre-Ultra Supernova scalings start 1 later.`,
			cost: E(0),
		},
		feat7: {
			unl() { return EXT.unl() },
			req() { return player.mass.gte(uni("ee11")) && player.ext.chal.f7 },
			failed() { return !player.ext.chal.f7 },
			reqDesc() { return `Reach ${formatMass(uni("ee11"))} mass, but always in a Challenge.` + failedHTML(player.ext.chal.f7) },
			desc: `Hardened Challenges scaling is 4% weaker.`,
			cost: E(0),
		},
		feat8: {
			unl() { return GLUBALL.unl() },
			req() { return player.mass.gte(mlt(100)) & player.ext.chal.f8 },
			failed() { return !player.ext.chal.f8 },
			reqDesc() { return `Get ${formatMass(mlt(100))} mass, but can only gain >= 5 Supernovae after 20.` + failedHTML(player.ext.chal.f8) },
			desc: `Supernova scalings start 2 later.`,
			cost: E(0),
		},
		feat9: {
			unl() { return GLUBALL.unl() },
			req() { return player.mass.gte(mlt(1e4)) & player.ext.chal.f9 },
			failed() { return !player.ext.chal.f9 },
			reqDesc() { return `Get ${formatMass(mlt(1e4))} mass, but in any U-Lepton.` + failedHTML(player.ext.chal.f9) },
			desc: `Make Exotic Matter stranger than before! [More efficient, but less EM]`,
			cost: E(0),
			onBuy: () => EXT.reduceAmt()
		},
		feat10: {
			unl() { return GLUBALL.unl() },
			req() { return player.ext.chal.f10 },
			reqDesc() { return `Gain 10% more Supernovae after 100 in Dual Fermions.` + failedHTML(player.ext.chal.f10, true) },
			desc: `Make Exotic Matter stranger than before! [More efficient, but less EM]`,
			cost: E(0),
			onBuy: () => EXT.reduceAmt()
		},
		feat11: {
			unl() { return GLUBALL.unl() },
			req() { return player.ext.chal.f11 },
			reqDesc() { return `Raise best mass in Mass Dilation.` },
			desc: `Raise Exotic Matter by ^1.2.`,
			cost: E(0)
		},

        /*
        x: {
            unl() { return true },
            req() { return true },
            reqDesc: ``,
            desc: `Placeholder.`,
            cost: EINF,
            effect() {
                let x = E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        */
    },
}

function hasTree(id) { return player.supernova.tree.includes(id) }
function treeEff(id,def=1) { return tmp.supernova.tree_eff[id]||E(def) }
function featCheck() {
	if (player == undefined) return
	if (!(player.auto_ranks.rank && player.auto_ranks.tier && player.auto_ranks.tetr && player.auto_ranks.pent)) return
	if (!(player.autoMassUpg[1] && player.autoMassUpg[2] && player.autoMassUpg[3] && player.autoTickspeed)) return
	if (!(player.auto_mainUpg.rp && player.auto_mainUpg.bh && player.auto_mainUpg.atom)) return
	if (!(player.bh.autoCondenser && player.atom.auto_gr)) return
	if (player.chal.active) return
	if (player.supernova.time < 5) return
	return true
}

function failedHTML(x, pass, html) {
	if (html) return "<b style='color:"+(x?"green":"red")+"'>"+html+"</b>"
	if (pass) return x ? " <b style='color:green'>(passed)</b>" : ""
	return x ? "" : " <b style='color:red'>(failed)</b>"
}

function setupTreeHTML() {
    let tree_table = new Element("tree_table")
    let tree_tab_table = new Element("tree_tab_table")
	let table = ``
    let table2 = ``
    for (let j = 0; j < TREE_TAB.length; j++) {
        table2 += `
        <div style="width: 145px">
            <button onclick="tmp.tree_tab = ${j}" class="btn_tab" id="tree_tab${j}_btn">${TREE_TAB[j].title}<b id="tree_tab${j}_notify" style="color: red"> [!]</b></button>
        </div>
        `
        table += `<div id="tree_tab${j}_div">`
        for (let i = 0; i < TREE_IDS.length; i++) {
            table += `<div class="tree_table_column">`
            for (let k = 0; k < TREE_IDS[i][j].length; k++) {
                let id = TREE_IDS[i][j][k]
                let option = id == "" ? `style="visibility: hidden"` : ``
				let img = !TREE_UPGS.ids[id] ? `` : TREE_UPGS.ids[id].icon ? ` <img src="images/tree/${TREE_UPGS.ids[id].icon}.png">` : TREE_UPGS.ids[id].noIcon ? ` <img src="images/tree/placeholder.png">` : `<img src="images/tree/${id}.png">`
                table += `<button id="treeUpg_${id}" class="btn_tree" onclick="TREE_UPGS.buy('${id}'); tmp.supernova.tree_choosed = '${id}'" ${option}>${img}</button>`
            }
            table += `</div>`
        }
        table += `</div>`
    }

	tree_table.setHTML(table)
    tree_tab_table.setHTML(table2)
}

function retrieveCanvasData() {
	let treeCanv = document.getElementById("tree_canvas")
	if (treeCanv===undefined||treeCanv===null) return false;
    tree_canvas = treeCanv
	tree_ctx = tree_canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
    if (!retrieveCanvasData()) return
	tree_canvas.width = 0;
	tree_canvas.height = 0;
	tree_canvas.width = tree_canvas.clientWidth
	tree_canvas.height = tree_canvas.clientHeight
}

function drawTreeHTML() {
    if (tmp.tab == 5) {
        if (tree_canvas.width == 0 || tree_canvas.height == 0) resizeCanvas()
        drawTree()
    }
}

function drawTree() {
	if (!retrieveCanvasData()) return;
	tree_ctx.clearRect(0, 0, tree_canvas.width, tree_canvas.height);
	for (let x in tmp.supernova.tree_had2[tmp.tree_tab]) {
        let id = tmp.supernova.tree_had2[tmp.tree_tab][x]
        let branch = TREE_UPGS.ids[id].branch||[]
        if (branch.length > 0 && tmp.supernova.tree_unlocked[id]) for (let y in branch) if (tmp.supernova.tree_unlocked[branch[y]]) {
			drawTreeBranch(branch[y], id)
		}
	}
}

function treeCanvas() {
    if (!retrieveCanvasData()) return
    if (tree_canvas && tree_ctx) {
        window.addEventListener("resize", resizeCanvas)

        tree_canvas.width = tree_canvas.clientWidth
        tree_canvas.height = tree_canvas.clientHeight
    }
}

const TREE_ANIM = ["Circle", "Square", "OFF"]
const CR = 5
const SR = 7.0710678118654755

function drawTreeBranch(num1, num2) {
    var start = document.getElementById("treeUpg_"+num1).getBoundingClientRect();
    var end = document.getElementById("treeUpg_"+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
    var y1 = start.top + (start.height / 2) - (window.innerHeight-tree_canvas.height);
    var x2 = end.left + (end.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
    var y2 = end.top + (end.height / 2) - (window.innerHeight-tree_canvas.height);
    tree_ctx.lineWidth=10;
    tree_ctx.beginPath();
    tree_ctx.strokeStyle = hasTree(num2)?"#00520b":tmp.supernova.tree_afford[num2]?"#fff":"#333";
    tree_ctx.moveTo(x1, y1);
    tree_ctx.lineTo(x2, y2);
    tree_ctx.stroke();

    if (player.options.tree_animation != 2) {
        tree_ctx.fillStyle = player.supernova.tree.includes(num2)?"#4b0":"#444";
        let tt = [tmp.tree_time, (tmp.tree_time+1)%3, (tmp.tree_time+2)%3]
        for (let i = 0; i < 3; i++) {
            let [t, dx, dy] = [tt[i], x2-x1, y2-y1]
            let [x, y] = [x1+dx*t/3, y1+dy*t/3]
            tree_ctx.beginPath();
            if (player.options.tree_animation == 1) {
                let a = Math.atan2(y1-y2,dx)-Math.PI/4
                tree_ctx.moveTo(x+SR*Math.cos(a), y-SR*Math.sin(a))
                for (let j = 1; j <= 3; j++) tree_ctx.lineTo(x+SR*Math.cos(a+Math.PI*j/2), y-SR*Math.sin(a+Math.PI*j/2))
            } else if (player.options.tree_animation == 0) {
                tree_ctx.arc(x, y, CR, 0, Math.PI*2, true);
            }
            tree_ctx.fill();
        }
    }
}

function changeTreeAnimation() {
    player.options.tree_animation = (player.options.tree_animation + 1) % 3;
}

function updateTreeHTML() {
	let req = ""
	let perm = ""
	let t_ch = TREE_UPGS.ids[tmp.supernova.tree_choosed]
	if (tmp.supernova.tree_choosed != "") {
		req = t_ch.req?`<span class="${t_ch.req()?"green":"red"}">${t_ch.reqDesc?" Require: "+(typeof t_ch.reqDesc == "function"?t_ch.reqDesc():t_ch.reqDesc):""}</span>`:""
		perm = t_ch.perm ? `<span class='yellow'> [Permanent]</span>` : ``
	}
	elm.tree_desc.setHTML(
		tmp.supernova.tree_choosed == "" ? `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click any tree upgrade to show)</span></div>`
		: `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click again to buy if affordable)</span>${req}</div>
		<span class="sky">[${tmp.supernova.tree_choosed}] ${t_ch.desc}</span>${perm}<br>
		<span>Cost: ${format(t_ch.cost,2)} Neutron star</span><br>
		<span class="green">${t_ch.effDesc?"Currently: "+t_ch.effDesc(tmp.supernova.tree_eff[tmp.supernova.tree_choosed]):""}</span>
		`
	)
    tree_update = true

	for (let i = 0; i < TREE_TAB.length; i++) {
		elm["tree_tab"+i+"_btn"].setDisplay(TREE_TAB[i].unl?TREE_TAB[i].unl():true)
		elm["tree_tab"+i+"_notify"].setDisplay(tmp.supernova.tree_afford2[i].length>0)
		elm["tree_tab"+i+"_div"].setDisplay(tmp.tree_tab == i)
		if (tmp.tree_tab == i) for (let x = 0; x < tmp.supernova.tree_had2[i].length; x++) {
			let id = tmp.supernova.tree_had2[i][x]
			let unl = tmp.supernova.tree_unlocked[id]
			elm["treeUpg_"+id].setVisible(unl)
			if (unl) elm["treeUpg_"+id].setClasses({btn_tree: true, locked: !tmp.supernova.tree_afford[id], failed: TREE_UPGS.ids[id].failed && TREE_UPGS.ids[id].failed(id), bought: hasTree(id), perm: hasTree(id) && TREE_UPGS.ids[id].perm, choosed: id == tmp.supernova.tree_choosed})
		}
	}

	elm.feat_warn.setDisplay(tmp.tree_tab == 5)
}