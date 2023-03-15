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
				
				dx.bonus = this[x].bonus?this[x].bonus():D(0)
				dx.eff = this[x].effect(player.massUpg[x]||D(0))
			}
		},
        autoSwitch(x) {
            player.autoMassUpg[x] = !player.autoMassUpg[x]
        },
        buy(x, manual=false) {
            let cost = manual ? this.getData(x).cost : tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!hasUpgrade('bh', 1) && !hasExtMilestone("qol", 5)) player.mass = player.mass.sub(cost)
                if (!player.massUpg[x]) player.massUpg[x] = D(0)
                player.massUpg[x] = player.massUpg[x].add(1)
            }
        },
        buyMax(x) {
            let bulk = tmp.upgs.mass[x].bulk
            let cost = tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!player.massUpg[x]) player.massUpg[x] = D(0)
                player.massUpg[x] = player.massUpg[x].max(bulk.floor().max(player.massUpg[x].plus(1)))
                if (!hasUpgrade('bh', 1) && !hasExtMilestone("qol", 5)) player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            if (i == 1 && hasRank("rank", 2)) inc = inc.pow(0.8)
            if (i == 2 && hasRank("rank", 3)) inc = inc.pow(0.8)
            if (i == 3 && hasRank("rank", 4)) inc = inc.pow(0.8)
            if (hasRank("tier", 3)) inc = inc.pow(0.8)
            let lvl = player.massUpg[i]||D(0)
			let scale = getScalingExp("massUpg")
            let cost = inc.pow(lvl.scaleEvery("massUpg").pow(scale)).mul(upg.start)
            let bulk = player.mass.div(upg.start).max(1).log(inc).root(scale).scaleEvery("massUpg", 1).add(1).floor()
            if (player.mass.lt(upg.start)) bulk = D(0)

            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return hasRank("rank", 1) || hasUpgrade('atom',1) },
            title: "Muscler",
            start: D(10),
            inc: D(1.5),
            effect(x) {
                let step = D(1)
                if (hasRank("rank", 3)) step = step.add(RANKS.effect.rank[3]())
                step = step.mul(tmp.upgs.mass[2]?tmp.upgs.mass[2].eff.eff:1)
                let total = x.add(tmp.upgs.mass[1].bonus)
                if (hasRank("pent", 2)) total = total.pow(RANKS.effect.pent[2]())
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
                let x = D(0)
                if (hasUpgrade('rp',1)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][1].effect:D(0))
                if (hasUpgrade('rp',2)) x = x.add(tmp.upgs.mass[2].bonus)
                return x
            },
        },
        2: {
            unl() { return hasRank("rank", 2) || hasUpgrade('atom',1) },
            title: "Booster",
            start: D(100),
            inc: D(4),
            effect(x) {
                let step = D(inNGM() ? 1.25 : 2)
                if (hasRank("rank", 5)) step = step.add(RANKS.effect.rank[5]())
                step = step.pow(tmp.upgs.mass[3]?tmp.upgs.mass[3].eff.eff:1)
                let total = x.add(tmp.upgs.mass[2].bonus)
                if (hasRank("pent", 3)) total = total.pow(RANKS.effect.pent[3]())
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
                let x = D(0)
                if (hasUpgrade('rp',2)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][2].effect:D(0))
                if (hasUpgrade('rp',7)) x = x.add(tmp.upgs.mass[3].bonus)
                return x
            },
        },
        3: {
            unl() { return hasRank("rank", inNGM() ? 4 : 3) || hasUpgrade('atom',1) },
            title: "Stronger",
            start: D(1000),
            inc: D(9),
			effect(x) {
				let step = D(1)
				let ss = D(10)
				let sp = 0.5

				if (hasElement(74)) step = D(200)
				else {
					if (hasRank("tetr", 2)) step = step.add(RANKS.effect.tetr[2]())
					if (hasUpgrade('rp',9)) step = step.add(0.25)
					if (hasUpgrade('rp',12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:D(0))
					if (hasElement(4)) step = step.mul(tmp.elements.effect[4])
					if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)

					if (hasRank("rank", 34)) ss = ss.add(2)
					if (hasUpgrade('bh',9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:D(0))
					if (hasUpgrade('atom',9)) sp *= 1.15
					if (hasRank("tier", 30)) sp *= 1.1
				}

				let total = x.add(tmp.upgs.mass[3].bonus)
				let ret = step.mul(total).add(1)
				if (inNGM()) ret = ret.pow(2/3)
				if (!hasElement(74)) ret = ret.softcap(ss,sp,0).softcap(1.8e5,0.5,0)
				return {step: step, eff: ret, ss: ss}
			},
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Booster Power"+(hasElement(74)?"":getSoftcapHTML(eff.eff,eff.ss,1.8e5))
                }
            },
            bonus() {
                let x = D(0)
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
                cost: D(1),
                effect() {
                    let ret = D(player.massUpg[2]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Musclers"
                },
            },
            2: {
                desc: "Strongers add Boosters.",
                cost: D(10),
                effect() {
                    let ret = D(player.massUpg[3]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Boosters"
                },
            },
            3: {
                desc: "You can automatically buy mass upgrades.",
                cost: D(25),
            },
            4: {
                desc: "Ranks no longer reset.",
                cost: D(50),
            },
            5: {
                desc: "You can automatically rank up.",
                cost: D(1e4),
            },
            6: {
                desc: "You can automatically tier up.",
                cost: D(1e5),
            },
            7: {
                desc: "Tickspeed adds Stronger.",
                cost: D(1e7),
                effect() {
                    let ret = player.tickspeed.div(3).add(hasElement(38)?tmp.elements.effect[38]:0).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Stronger"
                },
            },
            8: {
                desc: "Rage Points weaken Mass Upgrade scalings.",
                cost: D(1e15),
                effect() {
                    let ret = D(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(D(1).sub(x).mul(100))+"% weaker"+getSoftcapHTML(x.log(0.9),2.5)
                },
            },
            9: {
                unl() { return player.bh.unl },
                desc: "Add ^0.25 to Stronger Power.",
                cost: D(1e31),
            },
            10: {
                unl() { return player.bh.unl },
                desc: "Weaken Super Rank by 20%.",
                cost: D(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "Rage Points multiply BH Mass.",
                cost: D(1e72),
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
                desc: "Rage Power adds Stronger Power.",
                cost: D(1e120),
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
                cost: D(1e180),
                effect() {
                    let ret = D(3).pow(player.ranks.rank)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Hyper Tickspeed starts 50 later.",
                cost: D('e320'),
            },
            15: {
                unl() { return player.atom.unl },
                desc: "Mass boosts Atoms.",
                cost: D('e480'),
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
                desc: "Mass Upgrades no longer spent anything.",
                cost: D(1),
            },
            2: {
                desc: "Tickspeed boosts BH Condenser Power.",
                cost: D(10),
                effect() {
                    let ret = player.tickspeed.add(1).root(8)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            3: {
                desc: "Super Mass Upgrade scales later based on Black Hole mass.",
                cost: D(100),
                effect() {
                    let ret = player.bh.mass.max(1).log10().pow(1.5).softcap(100,1/3,0).floor()
                    return ret.min(400)
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" later"+getSoftcapHTML(x,100)
                },
            },
            4: {
                desc: "Tiers no longer reset.",
                cost: D(1e4),
            },
            5: {
                desc: "You can automatically buy Tickspeed and Rage Power upgrades.",
                cost: D(5e5),
            },
            6: {
                desc: "Passively generate Rage Power. Black Hole mass boosts Rage Power.",
                cost: D(2e6),
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
                desc: "Mass softcap scales later based on Black Hole mass.",
                cost: D(1e13),
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
                desc: "Raise Rage Power by ^1.15.",
                cost: D(1e17),
            },
            9: {
                unl() { return player.chal.unl },
                desc: "Stronger Effect's softcap start later based on unspent Dark Matter.",
                cost: D(1e27),
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
                desc: "Dark Matter boosts Mass.",
                cost: D(1e33),
                effect() {
                    let ret = D(2).pow(player.bh.dm.add(1).log10().softcap(11600,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+getSoftcapHTML(x.max(1).log2(),11600)
                },
            },
            11: {
                unl() { return player.atom.unl },
                desc: "Mass softcap scales 10% weaker.",
                cost: D(1e80),
            },
            12: {
                unl() { return player.atom.unl },
                desc: "Hyper Tickspeed scales 15% weaker.",
                cost: D(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "Gain 10x more Quarks.",
                cost: D(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "Neutron Power boosts Black Hole mass.",
                cost: D(1e210),
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
                desc: "Atomic Power adds Black Hole Condensers.",
                cost: D('e420'),
                effect() {
                    let ret = player.atom.atomic.add(1).log(5)
                    //if (AXION.unl()) ret = ret.mul(tmp.ax.eff[16])
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
                desc: "Start with Mass Upgrades.",
                cost: D(1),
            },
            2: {
                desc: "You can automatically buy BH Condenser and Upgrades. Tickspeed no longer spends Rage Power.",
                cost: D(100),
            },
            3: {
                desc: "Unlock Tetr.",
                cost: D(25000),
            },
            4: {
                desc: "Keep C1-4 Completions. BH Condensers add Cosmic Rays Power.",
                cost: D(1e10),
                effect() {
                    let ret = player.bh.condenser.pow(0.8).mul(0.01)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+"x"
                },
            },
            5: {
                desc: "You can automatically Tetr up. Super Tier scales 10 later.",
                cost: D(1e16),
            },
            6: {
                desc: "Passively generate Dark Matter. Atomic Power makes BH Softcap scales later.",
                cost: D(1e18),
                effect() {
                    let ret = player.atom.atomic.add(1).pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x later"
                },
            },
            7: {
                desc: "Tickspeed boosts Particle Powers.",
                cost: D(1e25),
                effect() {
                    let ret = D(1.025).pow(player.tickspeed)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            8: {
                desc: "Atomic Power boosts Quarks.",
                cost: D(1e35),
                effect() {
                    let ret = player.atom.atomic.max(1).log10().add(1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            9: {
                desc: "Stronger softcap scales 15% weaker.",
                cost: D(2e44),
            },
            10: {
                desc: "Halven Tier requirement. Hyper Rank scales later based on Tiers you have.",
                cost: D(5e47),
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
                desc: "Dilated mass boosts BH Condenser & Cosmic Ray Powers.",
                cost: D('e1640'),
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
                desc: "Black Hole effect is better.",
                cost: D('e2015'),
                effect() {
                    let ret = D(1)
                    return ret
                },
            },
        },
    },
}

/*
1: {
    desc: "Placeholder.",
    cost: D(1),
    effect() {
        let ret = D(1)
        return ret
    },
    effDesc(x=this.effect()) {
        return format(x)+"x"
    },
},
*/

function updateUpgradesTemp() {
	tmp.upgs.fp = D(tmp.polarize)

	UPGS.main.temp()
	UPGS.mass.temp()
}

function hasUpgrade(id,x) { return player.mainUpg[id].includes(x) }
function hasUpgEffect(id,x,def=D(1)) { return tmp.upgs.main[id][x]||def }