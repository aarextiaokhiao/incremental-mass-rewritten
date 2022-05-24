const UPGS = {
    mass: {
        cols: 3,
        autoOnly: [0,1,2],
		temp() {
			for (let x = this.cols; x >= 1; x--) {
				let dx = tmp.upgs.mass[x]
				let data = this.getData(x)
				dx.cost = data.cost
				dx.bulk = data.bulk
				
				dx.bonus = this[x].bonus&&!CHALS.inChal(14)?this[x].bonus():E(0)
				dx.eff = this[x].effect(player.massUpg[x]||E(0))
			}
		},
        autoSwitch(x) {
            player.autoMassUpg[x] = !player.autoMassUpg[x]
        },
        buy(x, manual=false) {
            if (CHALS.inChal(14)) return

            let cost = manual ? this.getData(x).cost : tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!hasUpgrade('bh',1)) player.mass = player.mass.sub(cost)
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].add(1)
            }
        },
        buyMax(x) {
            if (CHALS.inChal(14)) return

            let bulk = tmp.upgs.mass[x].bulk
            let cost = tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].max(bulk.floor().max(player.massUpg[x].plus(1)))
                if (!hasUpgrade('bh',1)) player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
            if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
            if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
            if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
            let lvl = player.massUpg[i]||E(0)
			let scale = scalingInitPower("massUpg")
            let cost = inc.pow(lvl.scaleEvery("massUpg").pow(scale)).mul(upg.start)
            let bulk = player.mass.div(upg.start).max(1).log(inc).root(scale).scaleEvery("massUpg", 1).add(1).floor()
            if (player.mass.lt(upg.start)) bulk = E(0)

            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return player.ranks.rank.gte(1) || hasUpgrade('atom',1) },
            title: "Muscler",
            start: E(10),
            inc: E(1.5),
            effect(x) {
                let step = E(1)
                if (player.ranks.rank.gte(3)) step = step.add(RANKS.effect.rank[3]())
                step = step.mul(tmp.upgs.mass[2]?tmp.upgs.mass[2].eff.eff:1)
                let total = x.add(tmp.upgs.mass[1].bonus)
                if (player.ranks.pent.gte(200)) total = total.mul(RANKS.effect.rank[3]().pow(RANKS.effect.pent[200]()))
                if (player.ranks.pent.gte(10)) total = total.pow(RANKS.effect.pent[10]())
                let ret = step.mul(total)
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+formatMass(eff.step),
                    eff: "+"+formatMass(eff.eff)+" to mass gain"
                }
            },
            bonus() {
                let x = E(0)
                if (hasUpgrade('rp',1)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][1].effect:E(0))
                if (hasUpgrade('rp',2)) x = x.add(tmp.upgs.mass[2].bonus)
                return x
            },
        },
        2: {
            unl() { return player.ranks.rank.gte(2) || hasUpgrade('atom',1) },
            title: "Booster",
            start: E(100),
            inc: E(4),
            effect(x) {
                let step = E(2)
                if (player.ranks.rank.gte(5)) step = step.add(RANKS.effect.rank[5]())
                step = step.pow(tmp.upgs.mass[3]?tmp.upgs.mass[3].eff.eff:1)
                let total = x.add(tmp.upgs.mass[2].bonus)
                if (player.ranks.pent.gte(200)) total = total.mul(RANKS.effect.rank[5]().pow(RANKS.effect.pent[200]()))
                if (player.ranks.pent.gte(10)) total = total.pow(RANKS.effect.pent[10]())
                let ret = step.mul(total).add(1)
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Muscler Power"
                }
            },
            bonus() {
                let x = E(0)
                if (hasUpgrade('rp',2)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][2].effect:E(0))
                if (hasUpgrade('rp',7)) x = x.add(tmp.upgs.mass[3].bonus)
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) || hasUpgrade('atom',1) },
            title: "Stronger",
            start: E(1000),
            inc: E(9),
			effect(x) {
				let step = E(1).add(RANKS.effect.tetr[2]())
				if (hasUpgrade('rp',9)) step = step.add(0.25)
				if (hasUpgrade('rp',12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:E(0))
				if (hasElement(4)) step = step.mul(tmp.elements.effect[4])
				if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)
				if (player.ranks.pent.gte(300)) step = step.mul(RANKS.effect.pent[300]())

				//2/3 [toned] + 0.75 [RU12] + 0.8 [Be-4] + 1/3 [MD4] = 2.55
				//Tickspeed power: ^1/3 log * 27/20 = 9/20 [+0.45 -> 3]
				//Not included: 2/3 [Tetr 2], beaten by MU12

				let ss = E(10)
				let sp = 0.5
				if (player.ranks.rank.gte(34)) ss = ss.add(2)
				if (hasUpgrade('bh',9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:E(0))
				if (hasUpgrade('atom',9)) sp *= 1.15
				if (player.ranks.tier.gte(30)) sp *= 1.1
				if (player.ranks.pent.gte(80)) sp *= (2/3) / 0.55 / 1.15

				let total = x.add(tmp.upgs.mass[3].bonus)
				let ret = step.mul(total).add(1).softcap(ss,sp,0).softcap(1.8e5,0.5,0)
				return {step: step, eff: ret, ss: ss}
			},
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Booster Power"+getSoftcapHTML(eff.eff,eff.ss,1.8e5)
                }
            },
            bonus() {
                let x = E(0)
                if (hasUpgrade('rp',7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:0)
                return x
            },
        },
    },
    main: {
		temp() {
			for (let x = 1; x <= this.cols; x++) {
				let ux = this[x]
				for (let y = 1; y <= this[x].lens; y++) {
					let uy = ux[y]
					if (uy.effDesc) tmp.upgs.main[x][y] = { effect: uy.effect() }
				}
			}
		},
        ids: [null, 'rp', 'bh', 'atom'],
        cols: 3,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "Rage Upgrades",
            res: "Rage Power",
            getRes() { return player.rp.points },
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !hasUpgrade('rp',x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            auto_unl() { return hasUpgrade('bh',5) },
            lens: 15,
            1: {
                desc: "Boosters add Musclers.",
                cost: E(1),
                effect() {
                    let ret = E(player.massUpg[2]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Musclers"
                },
            },
            2: {
                desc: "Strongers add Boosters.",
                cost: E(10),
                effect() {
                    let ret = E(player.massUpg[3]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Boosters"
                },
            },
            3: {
                desc: "You can automatically buys mass upgrades.",
                cost: E(25),
            },
            4: {
                desc: "Ranks no longer resets anything.",
                cost: E(50),
            },
            5: {
                desc: "You can automatically rank up.",
                cost: E(1e4),
            },
            6: {
                desc: "You can automatically tier up.",
                cost: E(1e5),
            },
            7: {
                desc: "For every 3 tickspeeds adds Stronger.",
                cost: E(1e7),
                effect() {
                    let ret = player.tickspeed.div(3).add(hasElement(38)?tmp.elements.effect[38]:0).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Stronger"
                },
            },
            8: {
                desc: "Mass Upgrade scalings are weaker by Rage Points.",
                cost: E(1e15),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(E(1).sub(x).mul(100))+"% weaker"+getSoftcapHTML(x.log(0.9),2.5)
                },
            },
            9: {
                unl() { return player.bh.unl },
                desc: "Stronger Power is added +^0.25.",
                cost: E(1e31),
            },
            10: {
                unl() { return player.bh.unl },
                desc: "Super Rank scaling is 20% weaker.",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "Black Hole mass's gain is boosted by Rage Points.",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+getSoftcapHTML(x,"1e4000")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "Rage Power adds Stronger power.",
                cost: E(1e120),
                effect() {
                    let ret = player.rp.points.max(1).log10().softcap(200,0.75,0).div(1000)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+^"+format(x)+getSoftcapHTML(x,0.2)
                },
            },
            13: {
                unl() { return player.chal.unl },
                desc: "Mass gain softcap starts 3x later for every Rank you have.",
                cost: E(1e180),
                effect() {
                    let ret = E(3).pow(player.ranks.rank)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Hyper Tickspeed starts 50 later.",
                cost: E('e320'),
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Mass boost Atom gain.",
                cost: E('e480'),
                effect() {
                    let ret = player.mass.max(1).log10().pow(1.25)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
        },
        2: {
            title: "Black Hole Upgrades",
            res: "Dark Matter",
            getRes() { return player.bh.dm },
            unl() { return player.bh.unl },
            auto_unl() { return hasUpgrade('atom',2) },
            can(x) { return player.bh.dm.gte(this[x].cost) && !hasUpgrade('bh',x) },
            buy(x) {
                if (this.can(x)) {
                    player.bh.dm = player.bh.dm.sub(this[x].cost)
                    player.mainUpg.bh.push(x)
                }
            },
            lens: 15,
            1: {
                desc: "Mass Upgardes no longer spends mass.",
                cost: E(1),
            },
            2: {
                desc: "Tickspeed boosts BH Condenser Power.",
                cost: E(10),
                effect() {
                    let ret = player.tickspeed.add(1).root(8)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            3: {
                desc: "Super Mass Upgrade scales later based on mass of Black Hole.",
                cost: E(100),
                effect() {
                    let ret = player.bh.mass.max(1).log10().pow(1.5).softcap(100,1/3,0).floor()
                    return ret.min(400)
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"+getSoftcapHTML(x,100)
                },
            },
            4: {
                desc: "Tiers no longer reset anything.",
                cost: E(1e4),
            },
            5: {
                desc: "You can automatically buy tickspeed and Rage Power upgrades.",
                cost: E(5e5),
            },
            6: {
                desc: "Gain 100% of Rage Power gained from reset per second. Rage Powers are boosted by mass of Black Hole.",
                cost: E(2e6),
                effect() {
                    let ret = player.bh.mass.max(1).log10().add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            7: {
                unl() { return player.chal.unl },
                desc: "Mass gain softcap start later based on mass of Black Hole.",
                cost: E(1e13),
                effect() {
                    let ret = player.bh.mass.add(1).root(3)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x later"
                },
            },
            8: {
                unl() { return player.chal.unl },
                desc: "Raise Rage Power gain by 1.15.",
                cost: E(1e17),
            },
            9: {
                unl() { return player.chal.unl },
                desc: "Stronger Effect's softcap start later based on unspent Dark Matters.",
                cost: E(1e27),
                effect() {
                    let ret = player.bh.dm.max(1).log10().sqrt().min(1e8)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+" later"
                },
            },
            10: {
                unl() { return player.chal.unl },
                desc: "Mass gain is boosted by OoM of Dark Matters.",
                cost: E(1e33),
                effect() {
                    let ret = E(2).pow(player.bh.dm.add(1).log10().softcap(11600,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+getSoftcapHTML(x.max(1).log2(),11600)
                },
            },
            11: {
                unl() { return player.atom.unl },
                desc: "Mass gain softcap is 10% weaker.",
                cost: E(1e80),
            },
            12: {
                unl() { return player.atom.unl },
                desc: "Hyper Tickspeed scales 15% weaker.",
                cost: E(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "Quark gain is multiplied by 10.",
                cost: E(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Neutron Powers boosts mass of Black Hole gain.",
                cost: E(1e210),
                effect() {
                    let ret = player.atom.powers[1].add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Atomic Powers adds Black Hole Condensers at a reduced rate.",
                cost: E('e420'),
                effect() {
                    let ret = player.atom.atomic.add(1).log(5)
                    if (AXION.unl()) ret = ret.mul(tmp.ax.eff[16])
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
        },
        3: {
            title: "Atom Upgrades",
            res: "Atom",
            getRes() { return player.atom.points },
            unl() { return player.atom.unl },
            can(x) { return player.atom.points.gte(this[x].cost) && !hasUpgrade('atom',x) },
            buy(x) {
                if (this.can(x)) {
                    player.atom.points = player.atom.points.sub(this[x].cost)
                    player.mainUpg.atom.push(x)
                }
            },
            auto_unl() { return hasTree("qol1") },
            lens: 12,
            1: {
                desc: "Start with Mass upgrades unlocked.",
                cost: E(1),
            },
            2: {
                desc: "You can automatically buy BH Condenser and upgrades. Tickspeed no longer spent Rage Powers.",
                cost: E(100),
            },
            3: {
                desc: "[Tetr Era] Unlock Tetr.",
                cost: E(25000),
            },
            4: {
                desc: "Keep 1-4 Challenge on reset. BH Condensers adds Cosmic Rays Power at a reduced rate.",
                cost: E(1e10),
                effect() {
                    let ret = player.bh.condenser.pow(0.8).mul(0.01)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+"x"
                },
            },
            5: {
                desc: "You can automatically Tetr up. Super Tier starts 10 later.",
                cost: E(1e16),
            },
            6: {
                desc: "Gain 100% of Dark Matters gained from reset per second. Mass gain from Black Hole softcap starts later based on Atomic Powers.",
                cost: E(1e18),
                effect() {
                    let ret = player.atom.atomic.add(1).pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x later"
                },
            },
            7: {
                desc: "Tickspeed boost each particle powers gain.",
                cost: E(1e25),
                effect() {
                    let ret = E(1.025).pow(player.tickspeed)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            8: {
                desc: "Atomic Powers boosts Quark gain.",
                cost: E(1e35),
                effect() {
                    let ret = player.atom.atomic.max(1).log10().add(1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            9: {
                desc: "Stronger effect softcap is 15% weaker.",
                cost: E(2e44),
            },
            10: {
                desc: "Tier requirement is halved. Hyper Rank starts later based on Tiers you have.",
                cost: E(5e47),
                effect() {
                    let ret = player.ranks.tier.mul(2).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"
                },
            },
            11: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "Dilated mass also boost BH Condenser & Cosmic Ray powers at a reduced rate.",
                cost: E('e1640'),
                effect() {
                    let ret = player.md.mass.max(1).log10().add(1).pow(0.1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            12: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "Mass from Black Hole effect is better.",
                cost: E('e2015'),
                effect() {
                    let ret = E(1)
                    return ret
                },
            },
        },
    },
}

/*
1: {
    desc: "Placeholder.",
    cost: E(1),
    effect() {
        let ret = E(1)
        return ret
    },
    effDesc(x=this.effect()) {
        return format(x)+"x"
    },
},
*/

function hasUpgrade(id,x) { return player.mainUpg[id].includes(x) }
function hasUpgEffect(id,x,def=E(1)) { return tmp.upgs.main[id][x]||def }