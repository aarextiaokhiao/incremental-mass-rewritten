const TREE_TAB = [
    {title: "Main"},
    {title: "Quality of Life"},
    {title: "Challenge"},
    {title: "Post-Supernova", unl() { return player.supernova.post_10 } },
    {title: "Feats", unl() { return hasTree("rad1") || EXT.unl() } },
]

const TREE_IDS = [
	[
		['c'],
		['qol1','qol2','qol3','qol4'],
		['chal1'],
		['','bs1','','','unl1','rad1'],
		['feat1','feat2','feat3','feat4','feat5'],
	],[
		['s1','m1','rp1','bh1','sn1'],
		['qol7','qol6','qol5'],
		['chal2','chal4a','chal3'],
		['bs4','bs2','fn1','bs3','','','rad2','rad3'],
		['feat6','feat7','feat8','feat9','feat10'],
	],[
		['s2','m2','t1','d1','bh2','gr1','sn2'],
		['qol8','qol9','qol10'],
		['chal4'],
		['fn3','fn4','fn2','fn5','','','rad4',''],
		['feat11','feat12'],
	],[
		['s3','m3','gr2','sn3'],
		[],
		['chal5','chal6','chal7'],
		['','fn6','fn7','fn8','','','',''],
		[],
	],[
		['s4','sn5','sn4'],
		[],
		[],
		['eb1', 'eb2'],
		[],
	],[
		[],
		[],
		[],
		[],
		[],
	],
]

var tree_canvas,tree_ctx=true

const TREE_UPGS = {
	buy(x) {
		player.supernova.stars = player.supernova.stars.sub(this.ids[x].cost).max(0)
		player.supernova.tree.push(x)
		if (TREE_UPGS.ids[x].onBuy) TREE_UPGS.ids[x].onBuy()
	},
	checkBuy(x) {
		if (tmp.supernova.tree_afford[x]) TREE_UPGS.buy(x)
	},
	click(x) {
		if (tmp.supernova.tree_choosed == x) TREE_UPGS.checkBuy(x)
		tmp.supernova.tree_choosed = x
	},
	ids: {
        c: {
            desc: `Start generating 0.1 Neutron Stars per second. (no offline)`,
			req() {
				return player.supernova.times.gte(1)
			},
            reqDesc() { return `1 Supernova.` },
            cost: D(0),
        },
        sn1: {
            branch: ["c"],
            desc: `Tickspeed boosts Neutron Stars, at a reduced rate.`,
            cost: D(10),
            effect() {
                let x = player.tickspeed.add(1).pow(0.25)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn2: {
            branch: ["sn1"],
            desc: `Supernovae boost Neutron Stars.`,
            cost: D(350),
            effect() {
                let x = D(2).add(hasTree("sn4")?treeEff("sn4"):0).pow(player.supernova.times.softcap(15,0.8,0).softcap(25,0.5,0))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn3: {
            branch: ["sn2"],
            desc: `Blue Stars boost Neutron Stars, at a reduced rate.`,
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 Supernovae.`,
            cost: D(50000),
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
            cost: D(1e8),
            effect() {
                let x = player.supernova.times.mul(0.1).softcap(1.5,0.75,0)
                return x
            },
            effDesc(x) { return "+"+format(x)+getSoftcapHTML(x,1.5) },
        },
        m1: {
            branch: ["c"],
            desc: `Neutron Stars boost Mass.`,
            cost: D(100),
            effect() {
                let x = D(1e100).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e100),1e3) },
        },
        m2: {
            branch: ["m1"],
            desc: `Mass softcap^2 starts ^1.5 later.`,
            cost: D(800),
        },
        m3: {
            branch: ["m2"],
            unl() { return player.supernova.fermions.unl && hasTree("fn1") },
            desc: `Mass softcaps^2-3 scales later based on Supernovae.`,
            cost: D(1e46),
            effect() {
                let x = player.supernova.times.mul(0.0125).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x)+" later" },
        },
        t1: {
            branch: ["m1", 'rp1'],
			req() {
				return player.supernova.chal.noTick && player.mass.gte(D("1.5e1.650056e6").pow(hasTree('bh2')?1.46:1))
			},
            reqDesc() {return `Reach ${formatMass(D("1.5e1.650056e6").pow(hasTree('bh2')?1.46:1))} without buying Tickspeed in Supernova run. You can still obtain Tickspeed from Cosmic Rays.`},
            desc: `Raise Tickspeed Power by ^1.15.`,
            cost: D(1500),
        },
        rp1: {
            branch: ["c"],
            desc: `Neutron Stars boost Rage Power.`,
            cost: D(200),
            effect() {
                let x = D(1e50).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e50),1e3)},
        },
        bh1: {
            branch: ["c"],
            desc: `Neutron Stars boost Dark Matter.`,
            cost: D(400),
            effect() {
                let x = D(1e35).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x.max(1).log(1e35),1e3) },
        },
        bh2: {
            branch: ['bh1'],
			req() {
				return player.supernova.chal.noBHC && player.bh.mass.gte("1.5e1.7556e4")
			},
            reqDesc() {return `Reach ${format("e1.75e4")} uni of black hole without buying any BH Condenser in Supernova run.`},
            desc: `Raise BH Condenser Power by ^1.15.`,
            cost: D(1500),
        },
        s1: {
            branch: ["c"],
            desc: `Neutron Stars boost last-unlocked Stars.`,
			req() {
				return player.supernova.times.gte(1)
			},
            reqDesc() { return `1 Supernova.` },
            cost: D(400),
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
            cost: D(2500),
        },
        s3: {
            branch: ["s2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Supernovae raise Star Generators.`,
            cost: D(10000),
            effect() {
                return player.supernova.times.max(0).root(10).mul(0.1).add(1)
                //Toned Supernovae: ^0.2
                //S3 Reduction: ^0.1
                //Star Generators: ^5 (w/ milestone)
                //Product: ^0.1
                //Left: ^1.25 - ^1.1 = ^0.15
            },
            effDesc(x) { return "^"+format(x) },
        },
        s4: {
            branch: ["s3"],
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 Supernovae.`,
            desc: `Beyond unlocking stars, Star Unlocker will transform into Booster.`,
            cost: D(1e5),
        },
        qol1: {
            req() { return player.supernova.times.gte(2) },
            reqDesc: `2 Supernovae.`,
            desc: `Start with Silicon-14 & Argon-18 unlocked. You can now automatically buy Elements & Atom upgrades.`,
            cost: D(1500),
        },
        qol2: {
            branch: ["qol1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 Supernovae.`,
            desc: `Start with Chromium-24 and Atom upgrade 6 unlocked.`,
            cost: D(2000),
        },
        qol3: {
            branch: ["qol2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Start with Techntium-43 unlocked, improve their element better. Passively generate Relativistic particles.`,
            cost: D(10000),
        },
        qol4: {
            branch: ["qol3"],
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(12) },
            reqDesc: `12 Supernovae.`,
            desc: `Automatically buy Star Unlockers & Boosters.`,
            cost: D(1e8),
        },
        qol5: {
            branch: ["qol4"],
            req() { return player.supernova.times.gte(16) },
            reqDesc: `16 Supernovae.`,
            desc: `Tetrs no longer reset.`,
            cost: D(1e13),
        },
        qol6: {
            branch: ["qol5"],
            req() { return player.supernova.times.gte(17) },
            reqDesc: `17 Supernovae.`,
            desc: `While in any challenge, you can now automatically complete it before exiting.`,
            cost: D(1e15),
        },
        qol7: {
            branch: ["qol6"],
            unl() { return player.supernova.fermions.unl && hasTree("fn2") },
            req() { return player.supernova.times.gte(40) },
            reqDesc: `40 Supernovae.`,
            desc: `You can now automatically buy Photon & Gluon upgrades, they no longer spent their amount.`,
            cost: D(1e48),
        },
        chal1: {
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 Supernovae.`,
            desc: `Add 100 more C7 & C8 maximum completions.`,
            cost: D(6000),
        },
        chal2: {
            branch: ["chal1"],
            req() {
                for (let x = 1; x <= 4; x++) if (player.chal.comps[x].gte(1)) return false
                return player.mass.gte(D('e2.05e6').mul(1.5e56))
            },
            reqDesc() { return `Reach ${format('e2.05e6')} uni without challenge 1-4 completions in Supernova run.` },
            desc: `Keep challenge 1-4 completions on reset.`,
            cost: D(1e4),
        },
        chal3: {
            branch: ["chal1"],
            req() {
                for (let x = 5; x <= 8; x++) if (player.chal.comps[x].gte(1)) return false
                return player.bh.mass.gte(D('e1.75e4').mul(1.5e56))
            },
            reqDesc() { return `Reach ${format('e1.75e4')} uni of black hole without challenge 5-8 completions in Supernova run.` },
            desc: `Keep challenge 5-8 completions on reset.`,
            cost: D(1e4),
        },
        chal4: {
            branch: ["chal2","chal3"],
            desc: `Unlock new challenge.`,
            cost: D(1.5e4),
        },
        chal4a: {
            unl() { return player.supernova.post_10 },
            branch: ["chal4"],
            desc: `Make 9th Challenges effect better.`,
            cost: D(1e8),
        },
        chal5: {
            branch: ["chal4"],
            desc: `Unlock new challenge.`,
            cost: D(1e17),
        },
        gr1: {
            branch: ["bh1"],
            desc: `BH Condenser Power synergizes Cosmic Ray Power.`,
            req() { return player.supernova.times.gte(7) },
            reqDesc: `7 Supernovae.`,
            cost: D(1e6),
            effect() {
                let x = tmp.bh?tmp.bh.condenser_eff.pow.max(1).root(3):D(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        gr2: {
            unl() { return player.supernova.fermions.unl },
            branch: ["gr1"],
            desc: `Raise Cosmic Ray Power by ^1.25.`,
            cost: D(1e20),
        },
        bs1: {
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(15) },
            reqDesc: `15 Supernovae`,
            desc: `Tickspeed boosts Higgs Bosons.`,
            cost: D(1e13),
            effect() {
                let x = player.tickspeed.add(1).pow(0.6)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs2: {
            branch: ["bs1"],
            desc: `Photons and Gluons power-up each other.`,
            cost: D(1e14),
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
            cost: D(1e14),
            effect() {
                let x = tmp.bosons.effect.graviton[0].add(1).root(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs4: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs2"],
            desc: `Raise Z Bosons by ^1.5.`,
            cost: D(1e24),
        },
        fn1: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs1"],
            desc: `Tickspeed boost Fermions at a reduced rate.`,
            cost: D(1e27),
            effect() {
                let x = D(1.25).pow(player.tickspeed.pow(0.4))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        fn2: {
            branch: ["fn1"],
            req() { return player.mass.div('1.5e56').gte("ee6") && player.md.active && FERMIONS.onActive("01") },
            reqDesc() { return `Reach ${formatMass(D('e1e6').mul(1.5e56))} while dilating mass in [Down]` },
            desc: `Unlock 2 new types of U-Quark & U-Fermion.`,
            cost: D(1e33),
        },
        fn3: {
            branch: ["fn1"],
            req() { return player.supernova.fermions.points[0].gte(1e7) || player.supernova.fermions.points[1].gte(1e7) },
            reqDesc() { return `Reach ${format(1e7)} of any Fermions` },
            desc: `Super Fermions scale 7.5% weaker.`,
            cost: D(1e30),
        },
        fn4: {
            unl() { return hasTree("fn2") },
            branch: ["fn1"],
            desc: `2nd Photon & Gluon upgrades are slightly stronger.`,
            cost: D(1e39),
        },
        fn5: {
            unl() { return hasTree("fn2") },
            branch: ["fn1"],
            req() { return player.atom.quarks.gte("e12500") && FERMIONS.onActive("10") },
            reqDesc() { return `Reach ${format("e12500")} quarks while in [Electron]` },
            desc: `[Electron] max tier is increased by 35. Its effect softcap is weaker.`,
            cost: D(1e42),
        },
        fn6: {
            branch: ["fn2"],
            req() { return player.mass.gte(uni('e4e4')) && FERMIONS.onActive("02") && CHALS_NEW.in(5) },
            reqDesc() { return `Reach ${formatMass(uni("e4e4"))} while in [Charm] & Challenge 5.` },
            desc: `Unlock 2 new more types of U-Quark & U-Fermion.`,
            cost: D(1e48),
        },
        d1: {
            unl() { return hasTree("fn6") },
            branch: ["rp1"],
            desc: `Generating Relativistic particles outside Mass dilation is 25% stronger.`,
            cost: D(1e51),
        },
        unl1: {
            unl() { return hasTree("qol7") },
            req() { return player.supernova.times.gte(44) },
            reqDesc: `44 Supernovae.`,
            desc: `Unlock Radiation.`,
            cost: D(5e52),
        },
        rad1: {
            branch: ["unl1"],
            unl() { return tmp.radiation.unl },
            desc: `Gain more frequency based on Supernova, any more radiation if you unlocked next radiation.`,
            cost: D(1e54),
            effect() {
                let x = player.supernova.times.add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        rad2: {
            branch: ["rad1"],
            desc: `Gain more Radiation based on Supernovae.`,
            cost: D(1e72),
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
            cost: D(1e20),
        },
        fn7: {
            branch: ["fn6"],
            unl() { return hasTree("rad1") },
            desc: `Unlock 2 even more types of U-Quark & U-Fermion.`,
            cost: D(1e80),
        },
        chal6: {
            branch: ["chal5"],
            desc: `Unlock new challenge and reduce auto-Sweep threshold to 10.`,
            cost: D(1e94),
        },
        sn5: {
            branch: ["sn4"],
            unl() { return hasTree("rad1") },
            desc: `Supernova scalings are no longer rounded down to a integer.`,
            cost: D(1e90),
        },
        fn8: {
            branch: ["fn7"],
            desc: `Unlock 2 final types of U-Quark & U-Fermion.`,
            cost: D(1e128),
        },
        rad3: {
            branch: ["rad1"],
            desc: `Extra levels are raised based on radiation types.`,
            cost: D(4.56789e123),
        },
        qol9: {
            branch: ["qol8"],
            desc: `You can enter both U-Quarks and U-Leptons.`,
            cost: D(1e105),
        },
        chal7: {
            branch: ["chal6"],
            desc: `Unlock the finale of Supernova Challenges, Challenge 12.`,
            cost: D(1e165),
        },
        qol10: {
            branch: ["qol9"],
            desc: `You can manually sweep Challenges or Fermions.`,
            cost: D(1e120),
        },
        rad4: {
            unl() { return EXT.unl() },
            branch: ["rad2"],
            desc: `All Radiation Meta-Boosts are 50% stronger.`,
            cost: D(1e190),
        },

		/* EXOTIC */
        eb1: {
            unl() { return hasExtMilestone("unl", 1) },
            desc: `Unlock Black Hole and Atomic Buildings #2.`,
            cost: D(1e10),
			perm: 1,
        },
        eb2: {
			branch: ["eb1"],
            desc: `Unlock Black Hole and Atomic Buildings #3.`,
            cost: D(1e200),
			perm: 1,
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
			cost: D(1e130),
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
			cost: D(1e140),
		},
		feat3: {
			req() { return player.mass.gte(uni("e2.5e10")) && player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length < 30 },
			failed() { return player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length >= 30 },
			reqDesc: () => "Get " + formatMass(uni("e2.5e10")) + " with at most 30 Main Upgrades." + failedHTML(player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length < 30, true, " (" + (player.mainUpg.rp.length + player.mainUpg.bh.length + player.mainUpg.atom.length) + " / 30)"),
			desc: `Pre-Ultra Tickspeed scalings scale 15% weaker.`,
			cost: D(1e155)
		},
		feat4: {
			unl() { return EXT.unl() },
			req() {
				if (player.mass.lt(mlt(1))) return false
				return !TREE_UPGS.ids.feat4.failed()
			},
			failed() {
				let sum = D(0)
				for (var i = 1; i <= CHAL_NUM; i++) sum = sum.add(player.chal.comps[i])
				for (var i = 1; i <= 8; i++) if (player.chal.comps[i].lte(sum.mul(.05))) return true
				return false
			},
			reqDesc() { return `Get ${formatMass(mlt(1))} mass with one of C1-8s having < 5% total.` },
			desc: `Reduce the auto-sweeper threshold to 7.`,
			cost: D(1e100),
		},
		feat5: {
			unl() { return EXT.unl() },
			req() { return player.mass.gte(mlt(1)) && EXT.time() <= 3600 },
			failed() { return EXT.time() > 3600 },
			reqDesc() { return `Reach ${formatMass(mlt(1))} mass in 1 hour. ` + failedHTML(EXT.time() <= 3600, false, "(" + formatTime(EXT.time()) + " / 1:00:00)") },
			desc: `+^0.05 to Mass and Rage gain exponents and their caps.`,
			cost: D(1e40),
		},
		feat6: {
			unl() { return EXT.unl() },
			req() { return player.ext?.chal?.f6 },
			reqDesc() { return `Get +15 Supernova gains in under ${formatMass(uni("ee10"))} mass.` + failedHTML(player.ext?.chal?.f6, true) },
			desc: `Pre-Ultra Supernova scalings start 1 later.`,
			cost: D(0),
		},
		feat7: {
			unl() { return EXT.unl() },
			req() { return player.mass.gte(uni("ee11")) && player.ext?.chal?.f7 },
			failed() { return !player.ext?.chal?.f7 },
			reqDesc() { return `Reach ${formatMass(uni("ee11"))} mass, but always in a Challenge.` + failedHTML(player.ext?.chal?.f7) },
			desc: `Hardened Challenges scaling is 4% weaker.`,
			cost: D(0),
		},
		feat8: {
			unl() { return GLUBALL.unl() },
			req() { return player.mass.gte(mlt(100)) & player.ext?.chal?.f8 },
			failed() { return !player.ext?.chal?.f8 },
			reqDesc() { return `Get ${formatMass(mlt(100))} mass, but can only gain >= 5 Supernovae after 20.` + failedHTML(player.ext?.chal?.f8) },
			desc: `Supernova scalings start 2 later.`,
			cost: D(0),
		},
		feat9: {
			unl() { return GLUBALL.unl() },
			req() { return player.mass.gte(mlt(1e4)) & player.ext?.chal?.f9 },
			failed() { return !player.ext?.chal?.f9 },
			reqDesc() { return `Get ${formatMass(mlt(1e4))} mass, but in any U-Lepton.` + failedHTML(player.ext?.chal?.f9) },
			desc: `???`,
			cost: D(0)
		},
		feat10: {
			unl() { return GLUBALL.unl() },
			req() { return player.ext?.chal?.f10 },
			reqDesc() { return `Gain 10% more Supernovae after 100 in Dual Fermions.` + failedHTML(player.ext?.chal?.f10, true) },
			desc: `???`,
			cost: D(0)
		},
		feat11: {
			unl() { return GLUBALL.unl() },
			req() { return player.ext?.chal?.f11 },
			reqDesc() { return `Raise best mass in Mass Dilation.` },
			desc: `Raise Exotic Matter by ^1.2.`,
			cost: D(0)
		},
		feat12: {
			unl() { return GLUBALL.unl() },
			req() { return player.mass.lt(10) && CHALS_NEW.in(10) },
			failed() { return !player.mass.gte(10) || !CHALS_NEW.in(10) },
			reqDesc() { return `Get your mass less than 10 g in Reality I.` },
			desc: `Luminosity starts 1,000x earlier.`,
			cost: D(0)
		},

        /*
        x: {
            unl() { return true },
            req() { return true },
            reqDesc: ``,
            desc: `Placeholder.`,
            cost: EINF,
            effect() {
                let x = D(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        */
    },
}

function hasTree(id) { return player.supernova.tree.includes(id) }
function treeEff(id,def=1) { return tmp.supernova.tree_eff[id]||D(def) }
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
                table += `<button id="treeUpg_${id}" class="btn_tree" onclick="TREE_UPGS.click('${id}')" ${option}>${img}</button>`
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
		perm = t_ch.perm ? `<span class='scarlet'> [Kept on Exotic]</span>` : ``
	}
	elm.tree_desc.setHTML(
		tmp.supernova.tree_choosed == "" ? `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click any tree upgrade to show)</span></div>`
		: `<div style="font-size: 12px; font-weight: bold;"><span class="gray">(click again to buy if affordable)</span>${req}</div>
		<span class="sky">[${tmp.supernova.tree_choosed}] ${t_ch.desc}</span>${perm}<br>
		<span>Cost: ${format(t_ch.cost,2)} Neutron Stars</span><br>
		<span class="green">${t_ch.effDesc?"Currently: "+t_ch.effDesc(tmp.supernova.tree_eff[tmp.supernova.tree_choosed]):""}</span>
		`
	)

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

    if (tree_canvas.width == 0 || tree_canvas.height == 0) resizeCanvas()
    drawTree()

	elm.feat_warn.setDisplay(tmp.tree_tab == 5)
}