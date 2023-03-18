const UPGS = {
    mass: {
        cols: 4,
        temp() {
            for (let x = this.cols; x >= 1; x--) {
                let d = tmp.upgs.mass
                let data = this.getData(x)
                d[x].cost = data.cost
                d[x].bulk = data.bulk
                
                d[x].bonus = this[x].bonus?this[x].bonus():E(0)
                d[x].eff = this[x].effect(player.massUpg[x]||E(0))
                d[x].effDesc = this[x].effDesc(d[x].eff)
            }
        },
        autoSwitch(x) {
            player.autoMassUpg[x] = !player.autoMassUpg[x]
        },
        buy(x, manual=false) {
            let cost = manual ? this.getData(x).cost : tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].add(1)
            }
        },
        buyMax(x) {
            let d = tmp.upgs.mass[x]
            let bulk = d.bulk
            let cost = d.cost
            if (player.mass.gte(cost)) {
                let m = player.massUpg[x]
                if (!m) m = E(0)
                m = m.max(bulk.floor().max(m.plus(1)))
                player.massUpg[x] = m
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            let start = upg.start
            let lvl = player.massUpg[i]||E(0)
            let cost, bulk

            if (i==4) {
                cost = mlt(inc.pow(lvl.scaleEvery("massUpg4")).mul(start))
                bulk = player.mass.div(1.5e56).max(1).log10().div(start.mul(1e9)).max(1).log(inc).scaleEvery("massUpg4",true).add(1).floor()
                if (player.mass.lt(start)) bulk = E(0)
            } else {
                if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
                if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
                if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
                if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
                cost = inc.pow(lvl.scaleEvery("massUpg")).mul(start)
                bulk = E(0)
                if (player.mass.gte(start)) bulk = player.mass.div(start).max(1).log(inc).scaleEvery("massUpg",true).add(1).floor()
            }
        
            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return player.ranks.rank.gte(1) || player.mainUpg.atom.includes(1) },
            title: "Muscler",
            start: E(10),
            inc: E(1.5),
            effect(x) {
                let step = E(1)
                if (player.ranks.rank.gte(3)) step = step.add(RANKS.effect.rank[3]())
                step = step.mul(tmp.upgs.mass[2]?tmp.upgs.mass[2].eff.eff:1)
                let ret = step.mul(x.add(tmp.upgs.mass[1].bonus))
				if(hasElement(174))ret = ret.pow(tmp.elements.effect[174]||1);
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
                if (player.mainUpg.rp.includes(1)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][1].effect:E(0))
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.mass[2].bonus)
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        2: {
            unl() { return player.ranks.rank.gte(2) || player.mainUpg.atom.includes(1) },
            title: "Booster",
            start: E(100),
            inc: E(4),
            effect(x) {
                let step = E(2)
                if (player.ranks.rank.gte(5)) step = step.add(RANKS.effect.rank[5]())
				if (hasElement(472)) step = step.mul(tmp.tickspeedEffect?(tmp.tickspeedEffect.step||E(1)):E(1))
                step = step.pow(tmp.upgs.mass[3]?tmp.upgs.mass[3].eff.eff:1)
                let ret = step.mul(x.add(tmp.upgs.mass[2].bonus)).add(1)
				if(hasElement(173))ret = ret.pow(tmp.elements.effect[173]||1);
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
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][2].effect:E(0))
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.mass[3].bonus)
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) || player.mainUpg.atom.includes(1) },
            title: "Stronger",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let xx = x.add(tmp.upgs.mass[3].bonus)
                if (hasElement(81)) xx = xx.pow(1.1)
                if (hasChargedElement(81)) xx = xx.pow(2)
                let ss = E(10)
                if (player.ranks.rank.gte(34)) ss = ss.add(2)
                if (player.mainUpg.bh.includes(9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:E(0))
                if (hasElement(331)) ss = EINF
                let step = E(1)
				if (player.ranks.tetr.gte(2) || player.superGal.lt(1)) step = step.add(RANKS.effect.tetr[2]())
                if (player.mainUpg.rp.includes(9)) step = step.add(0.25)
                if (player.mainUpg.rp.includes(12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:E(0))
                if (hasElement(4)) step = step.mul(tmp.elements.effect[4])
                if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)
					
				if (hasUpgrade("exotic",3))step = step.pow(tmp.upgs.mass[4]?tmp.upgs.mass[4].eff.eff:1)
					
                let sp = 0.5
                if (player.mainUpg.atom.includes(9)) sp *= 1.15
                if (player.ranks.tier.gte(30)) sp *= 1.1
                let sp2 = 0.1
                let ss2 = E(5e15)
                if (hasElement(85)) {
                    sp2 **= 0.9
                    ss2 = ss2.mul(3)
                }
				if (hasUpgrade('rp',17))sp = sp ** 0.75
                let ret = step.mul(xx.mul(hasElement(80)?25:1)).add(1).softcap(ss,sp,0)
				if (!hasElement(292))ret = ret.softcap(1.8e5,hasPrestige(0,12)?0.525:0.5,0)
                ret = ret.mul(tmp.prim.eff[0])
                if (!player.ranks.pent.gte(15) && (!hasElement(292))) ret = ret.softcap(ss2,sp2,0)
				tmp.strongerOverflowPower = player.ranks.oct.gte(8)?0.6:0.5;
				if (hasElement(305))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.9;
				if (hasElement(315))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.8;
				if (hasPrestige(2,81))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.5;
				if (player.ranks.enne.gte(3))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.99;
				if (hasChargedElement(77))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.99;
				if (hasChargedElement(80))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.997;
				if (hasChargedElement(85))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.997;
				if (hasChargedElement(110))tmp.strongerOverflowPower = tmp.strongerOverflowPower ** 0.95;
				tmp.strongerOverflow = overflow(ret, "e4e6", tmp.strongerOverflowPower).log(ret);
				ret = overflow(ret, "e4e6", tmp.strongerOverflowPower);
                return {step: step, eff: ret, ss: ss}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Booster Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped${(eff.eff.gte(1.8e5)&&(!hasElement(292)))?eff.eff.gte(5e15)&&!player.ranks.pent.gte(15)?"^3":"^2":""})</span>`:"")
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:0)
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        4: {
            unl() { return hasUpgrade("exotic",3) },
            title: "Overpower",
            start: E("ee10"),
            inc: E("ee10"),
            effect(x) {
                let xx = x.add(tmp.upgs.mass[4].bonus)
				let step = E(0.03)
				if (player.prestiges[2].gte(165))step = step.add(tmp.prestigeRPEffect)
                let ss = E(10)
				let sp = 0.5
                let ss2 = E(1000)
				let sp2 = 0.1
                
                let ret = step.mul(xx).add(1).softcap(ss,sp,0).softcap(ss2,sp2,0)
                return {step: step, eff: ret, ss: ss, ss2: ss2}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Stronger Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped${eff.eff.gte(eff.ss2)?"^2":""})</span>`:"")
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.exotic.includes(6)) x = x.add(tmp.upgs.main?tmp.upgs.main[6][6].effect:0)
                return x
            },
        },
    },
    prestigeMass: {
        cols: 4,
        temp() {
            for (let x = this.cols; x >= 1; x--) {
                let d = tmp.upgs.prestigeMass
                let data = this.getData(x)
                d[x].cost = data.cost
                d[x].bulk = data.bulk
                
                d[x].bonus = this[x].bonus?this[x].bonus():E(0)
                d[x].eff = this[x].effect(player.prestigeMassUpg[x]||E(0))
                d[x].effDesc = this[x].effDesc(d[x].eff)
            }
        },
        autoSwitch(x) {
            player.autoprestigeMassUpg[x] = !player.autoprestigeMassUpg[x]
        },
        buy(x, manual=false) {
            let cost = manual ? this.getData(x).cost : tmp.upgs.prestigeMass[x].cost
            if (player.prestigeMass.gte(cost)) {
                if (!player.prestigeMassUpg[x]) player.prestigeMassUpg[x] = E(0)
                player.prestigeMassUpg[x] = player.prestigeMassUpg[x].add(1)
            }
        },
        buyMax(x) {
            let d = tmp.upgs.prestigeMass[x]
            let bulk = d.bulk
            let cost = d.cost
            if (player.prestigeMass.gte(cost)) {
                let m = player.prestigeMassUpg[x]
                if (!m) m = E(0)
                m = m.max(bulk.floor().max(m.plus(1)))
                player.prestigeMassUpg[x] = m
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            let start = upg.start
            let lvl = player.prestigeMassUpg[i]||E(0)
            let cost, bulk

            if (i==4) {
                cost = mlt(inc.pow(lvl).mul(start))
                bulk = player.prestigeMass.div(1.5e56).max(1).log10().div(start.mul(1e9)).max(1).log(inc).add(1).floor()
                if (player.prestigeMass.lt(mlt(start))) bulk = E(0)
			} else {
				cost = inc.pow(lvl).mul(start)
				bulk = E(0)
				if (player.prestigeMass.gte(start)) bulk = player.prestigeMass.div(start).max(1).log(inc).add(1).floor()
			}
            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return hasPrestige(2,38) },
            title: "Prestige Muscler",
            start: E(10),
            inc: E(1.5),
            effect(x) {
                let step = player.prestiges[0]
                if (hasPrestige(2,51)) step = step.mul(prestigeEff(2,51))
                step = step.mul(tmp.upgs.prestigeMass[2]?tmp.upgs.prestigeMass[2].eff.eff:1)
                let ret = step.mul(x).add(1)
				if(hasPrestige(3,24))ret = ret.pow(prestigeEff(3,24));
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step),
                    eff: "x"+format(eff.eff)+" to Prestige Mass gain"
                }
            },
        },
        2: {
            unl() { return hasPrestige(2,39) },
            title: "Prestige Booster",
            start: E(100),
            inc: E(4),
            effect(x) {
                let step = player.prestiges[1]
                if (hasPrestige(2,52)) step = step.mul(prestigeEff(2,52))
                step = step.pow(tmp.upgs.prestigeMass[3]?tmp.upgs.prestigeMass[3].eff.eff:1)
                let ret = step.mul(x).add(1)
				if(hasPrestige(3,28))ret = ret.pow(prestigeEff(3,28));
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Prestige Muscler Power"
                }
            },
        },
        3: {
            unl() { return hasPrestige(2,40) },
            title: "Prestige Stronger",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let step = E(0.001)
                if (hasPrestige(2,53)) step = step.mul(prestigeEff(2,53))
                if (hasPrestige(3,11)) step = step.mul(prestigeEff(3,11))
                step = step.mul(tmp.upgs.prestigeMass[4]?tmp.upgs.prestigeMass[4].eff.eff:1)
				let ret = step.mul(x).add(1).softcap(2000,0.5,0);
                return {step: step, eff: ret, ss: 2000}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Prestige Booster Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped)</span>`:"")
                }
            },
        },
        4: {
            unl() { return hasUpgrade("exotic",4) },
            title: "Prestige Overpower",
            start: E(1e-4),
            inc: E(1.0005),
            effect(x) {
                let step = E(0.001)
				if(hasElement(378))step = step.mul(2)
				let ret = step.mul(x).add(1);
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Prestige Stronger Power"
                }
            }
        },
    },
    ascensionMass: {
        cols: 4,
        temp() {
            for (let x = this.cols; x >= 1; x--) {
                let d = tmp.upgs.ascensionMass
                let data = this.getData(x)
                d[x].cost = data.cost
                d[x].bulk = data.bulk
                
                d[x].bonus = this[x].bonus?this[x].bonus():E(0)
                d[x].eff = this[x].effect(player.ascensionMassUpg[x]||E(0))
                d[x].effDesc = this[x].effDesc(d[x].eff)
            }
        },
        autoSwitch(x) {
            player.autoascensionMassUpg[x] = !player.autoascensionMassUpg[x]
        },
        buy(x, manual=false) {
            let cost = manual ? this.getData(x).cost : tmp.upgs.ascensionMass[x].cost
            if (player.ascensionMass.gte(cost)) {
                if (!player.ascensionMassUpg[x]) player.ascensionMassUpg[x] = E(0)
                player.ascensionMassUpg[x] = player.ascensionMassUpg[x].add(1)
            }
        },
        buyMax(x) {
            let d = tmp.upgs.ascensionMass[x]
            let bulk = d.bulk
            let cost = d.cost
            if (player.ascensionMass.gte(cost)) {
                let m = player.ascensionMassUpg[x]
                if (!m) m = E(0)
                m = m.max(bulk.floor().max(m.plus(1)))
                player.ascensionMassUpg[x] = m
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            let start = upg.start
            let lvl = player.ascensionMassUpg[i]||E(0)
            let cost, bulk

            if (i==4) {
                cost = mlt(inc.pow(lvl).mul(start))
                bulk = player.ascensionMass.div(1.5e56).max(1).log10().div(start.mul(1e9)).max(1).log(inc).add(1).floor()
                if (player.ascensionMass.lt(mlt(start))) bulk = E(0)
			} else {
				cost = inc.pow(lvl).mul(start)
				bulk = E(0)
				if (player.ascensionMass.gte(start)) bulk = player.ascensionMass.div(start).max(1).log(inc).add(1).floor()
			}
            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return hasAscension(1,4) },
            title: "Ascension Muscler",
            start: E(10),
            inc: E(1.5),
            effect(x) {
                let step = player.ascensions[0]
                step = step.mul(tmp.upgs.ascensionMass[2]?tmp.upgs.ascensionMass[2].eff.eff:1)
                let ret = step.mul(x).add(1)
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step),
                    eff: "x"+format(eff.eff)+" to Ascension Mass gain"
                }
            },
        },
        2: {
            unl() { return hasAscension(1,5) },
            title: "Ascension Booster",
            start: E(100),
            inc: E(4),
            effect(x) {
                let step = player.ascensions[1]
                step = step.pow(tmp.upgs.ascensionMass[3]?tmp.upgs.ascensionMass[3].eff.eff:1)
                let ret = step.mul(x).add(1)
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Ascension Muscler Power"
                }
            },
        },
        3: {
            unl() { return hasAscension(1,6) },
            title: "Ascension Stronger",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let step = E(0.1)
                step = step.mul(tmp.upgs.ascensionMass[4]?tmp.upgs.ascensionMass[4].eff.eff:1)
				let ret = step.mul(x).add(1).softcap(2000,0.5,0);
                return {step: step, eff: ret, ss: 2000}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "^"+format(eff.eff)+" to Ascension Booster Power"+(eff.eff.gte(eff.ss)?` <span class='soft'>(softcapped)</span>`:"")
                }
            },
        },
        4: {
            unl() { return false },
            title: "Ascension Overpower",
            start: E(1e-4),
            inc: E(1.0005),
            effect(x) {
                let step = E(0.001)
				let ret = step.mul(x).add(1);
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "x"+format(eff.eff)+" to Ascension Stronger Power"
                }
            }
        },
    },
    main: {
        temp() {
            for (let x = 1; x <= this.cols; x++) {
                for (let y = 1; y <= this[x].lens; y++) {
                    let u = this[x][y]
                    if (u.effDesc) tmp.upgs.main[x][y] = { effect: u.effect(), effDesc: u.effDesc() }
                }
            }
        },
        ids: [null, 'rp', 'bh', 'atom', 'br', 'inf', 'exotic'],
        cols: 6,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "Rage Upgrades",
            res: "Rage Power",
            getRes() { return player.rp.points },
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !player.mainUpg.rp.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            auto_unl() { return player.mainUpg.bh.includes(5) },
            lens: 25,
            1: {
                desc: "Boosters adds Musclers.",
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
                desc: "Strongers adds Boosters.",
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
                desc: "Super, Hyper Mass Upgrades scaling is weaker by Rage Points.",
                cost: E(1e15),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(E(1).sub(x).mul(100))+"% weaker"+(x.log(0.9).gte(2.5)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            9: {
                unl() { return player.bh.unl || player.chal.unl},
                desc: "Stronger Power is added +^0.25.",
                cost: E(1e31),
            },
            10: {
                unl() { return player.bh.unl || player.chal.unl},
                desc: "Super Rank scaling is 20% weaker.",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "Black Hole mass's gain is boosted by Rage Points.",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return overflow(ret,"ee11000",0.5);
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.gte("e4000")?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "For every OoM of Rage Powers adds Stronger Power at a reduced rate.",
                cost: E(1e120),
                effect() {
                    let ret = player.rp.points.max(1).log10().softcap(200,hasUpgrade('rp',23)?0.8:0.75,0).div(1000)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+^"+format(x)+(x.gte(0.2)?" <span class='soft'>(softcapped)</span>":"")
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
            16: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Remove Tickspeed Power Softcap.",
                cost: E('ee99'),
            },
            17: {
                unl() { return hasUpgrade('inf',15) },
                desc: "The first Stronger Softcap is weaker.",
                cost: E('e2e101'),
            },
            18: {
                unl() { return hasUpgrade('inf',15) },
                desc() {return "Rage Power boost Infinity Mass."},
                cost: E('e1e113'),
                effect() {
                    let ret = player.rp.points.add(1).log10().add(1).log10().sub(111).max(1).log2().add(1);
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            19: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Mass Overflow starts ^10 later.",
                cost: E('e2e123'),
            },
            20: {
                unl() { return hasUpgrade('inf',15) && hasElement(134) },
                desc() {return "Rage Power boost Accelerator Power."},
                cost: E('ee151'),
                effect() {
                    let ret = player.rp.points.add(1).log10().add(1).log10().add(1).log10().add(1).pow(0.1);
					if(hasUpgrade('rp',25))ret = ret.pow(20);
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            21: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Super Overpower starts 1.08x later.",
                cost: E('ee1.04e14'),
            },
            22: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Rage Power boost Tickspeed Power.",
                cost: E('ee1.25e14'),
                effect() {
                    let ret = expMult(player.rp.points.add(1e10),player.rp.points.add(1e10).log10().add(1).log10().add(1).log10().div(500).add(0.001));
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            23: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "The softcap of Rage Upgrade 12 is weaker.",
                cost: E('ee1.5e14'),
            },
            24: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Rage Upgrade 18 boost Galactic Quarks.",
                cost: E('ee2.22222222e14'),
            },
            25: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Rage Power Upgrade 20 is better.",
                cost: E('ee4.5e14'),
            },
        },
        2: {
            title: "Black Hole Upgrades",
            res: "Dark Matter",
            getRes() { return player.bh.dm },
            unl() { return player.bh.unl },
            auto_unl() { return player.mainUpg.atom.includes(2) },
            can(x) { return player.bh.dm.gte(this[x].cost) && !player.mainUpg.bh.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.bh.dm = player.bh.dm.sub(this[x].cost)
                    player.mainUpg.bh.push(x)
                }
            },
            lens: 25,
            1: {
                desc: "Mass Upgardes no longer spends mass.",
                cost: E(1),
            },
            2: {
                desc: "Tickspeeds boosts BH Condenser Power.",
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
                    return "+"+format(x,0)+" later"+(x.gte(100)?" <span class='soft'>(softcapped)</span>":"")
                },
            },
            4: {
                desc: "Tiers no longer resets anything.",
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
                    let ret = player.bh.dm.max(1).log10().pow(0.5)
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
                    let ret = E(2).pow(overflow(player.bh.dm.add(1).log10().softcap(11600,0.5,0),"e5e13",0.2))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.max(1).log2().gte(11600)?" <span class='soft'>(softcapped)</span>":"")
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
                    return ret//.softcap("ee13",0.9,2)
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
                    let ret = player.atom.atomic.add(1).log(5).softcap(2e9,0.25,0).softcap(1e10,0.1,0)
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
            16: {
                unl() { return hasUpgrade('inf',15) },
                desc: "The start of Black Hole Overflow is raised by 10.",
                cost: E('ee100'),
            },
            17: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Remove mass of Black Hole formula softcap. Mass of Black Hole gain softcap is 10% weaker.",
                cost: E('e3e102'),
            },
            18: {
                unl() { return hasUpgrade('inf',15) },
                desc() {return "Dark Matter boost Infinity Mass."},
                cost: E('e1e116'),
                effect() {
                    let ret = player.bh.dm.add(1).log10().add(1).log10().sub(113).max(1).log2().add(1);
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            19: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Black Hole effect exponentially boost mass gain.",
                cost: E('e2e130'),
                effect() {
					if(hasChargedElement(71))return (tmp.bh?(tmp.bh.effect||E(1)):E(1)).add(1).log10();
					if(hasElement(279))return expMult((tmp.bh?(tmp.bh.effect||E(1)):E(1)).add(1).log10(),0.8);
                    return (tmp.bh?(tmp.bh.effect||E(1)):E(1)).add(1).log10().add(1).log10().pow(0.1);
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            20: {
                unl() { return hasUpgrade('inf',15) },
                desc: "The first Black Hole Overflow effect is weaker.",
                cost: E('ee170'),
            },
            21: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Dark Matter boost BH Condenser Power.",
                cost: E('ee1.22e14'),
                effect() {
                    let ret = expMult(player.bh.dm.add(1e10),player.bh.dm.add(1e10).log10().add(1).log10().add(1).log10().div(500).add(0.001));
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            22: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Dark Matter Upgrade 18 boost Galactic Quarks.",
                cost: E('ee1.5e14'),
            },
            23: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Black Hole Overflow is weaker.",
                cost: E('ee2.33333333e14'),
            },
            24: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Change the effect of [Neut-Tau], and the Meta scaling of BH Condensers and Cosmic Rays are affected by [Neut-Tau]. Improve the effect of Entropic Multiplier.",
                cost: E('ee3.6e14'),
            },
            25: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Mass of Black Hole boost Exotic Matter gain.",
                cost: E('ee4.7e14'),
                effect() {
                    let ret = player.bh.mass.add(1e10).slog();
					if(player.exotic.dark_run.upgs[5].gte(1))ret = Decimal.pow(10,ret.add(1).sqrt());
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
        },
        3: {
            title: "Atom Upgrades",
            res: "Atom",
            getRes() { return player.atom.points },
            unl() { return player.atom.unl },
            can(x) { 
				if (x >= 13 && x <= 15 && player.prestiges[0].gte(50))return player.atom.points.gte(this[x].cost.pow(1/20000)) && !player.mainUpg.atom.includes(x);
				return player.atom.points.gte(this[x].cost) && !player.mainUpg.atom.includes(x) 
			},
            buy(x) {
				if (x >= 13 && x <= 15 && player.prestiges[0].gte(50)){
					if (this.can(x)) {
						player.atom.points = player.atom.points.sub(this[x].cost.pow(1/20000))
						player.mainUpg.atom.push(x)
					}
				}
                if (this.can(x)) {
                    player.atom.points = player.atom.points.sub(this[x].cost)
                    player.mainUpg.atom.push(x)
                }
            },
            auto_unl() { return hasTree("qol1") },
            lens: 25,
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
            },
            13: {
                unl() { return player.md.break.active && (player.qu.rip.active || player.prestiges[0].gte(50)) },
                desc() {if(player.prestiges[0].gte(50))return "Cosmic Ray effect's all softcaps starts x12 later."; return "Cosmic Ray effect's final softcap starts x10 later.";},
                cost: E('e3.2e11'),
            },
            14: {
                unl() { return player.md.break.active && (player.qu.rip.active || player.prestiges[0].gte(50)) },
                desc() {if(player.prestiges[0].gte(50))return "Tickspeed, Black Hole Condenser and Cosmic Ray scalings up to Meta start x12 later."; return "Tickspeed, Black Hole Condenser and Cosmic Ray scalings up to Meta start x10 later.";},
                cost: E('e4.3e13'),
            },
            15: {
                unl() { return player.md.break.active && (player.qu.rip.active || player.prestiges[0].gte(50)) },
                desc() {if(player.prestiges[0].gte(50))return "Reduce Cosmic Ray scaling by 24%."; return "Reduce Cosmic Ray scaling by 20%.";},
                cost: E('e3.4e14'),
            },
            16: {
                unl() { return hasUpgrade('inf',15) },
                desc() {return "Unlock more elements."},
                cost: E('e1e88'),
            },
            17: {
                unl() { return hasUpgrade('inf',15) },
                desc() {return "Ultra Tier scaling is 20% weaker."},
                cost: E('e5e89'),
            },
            18: {
                unl() { return hasUpgrade('inf',15) },
                desc() {return "Atoms boost Infinity Mass."},
                cost: E('e1e101'),
                effect() {
                    let ret = player.atom.points.add(1).log10().add(1).log10().sub(99).max(1).log2().add(1);
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            19: {
                unl() { return hasUpgrade('inf',15) },
                desc() {return "Cosmic Ray effect softcaps are weaker."},
                cost: E('e3e108'),
            },
            20: {
                unl() { return hasUpgrade('inf',15) && hasElement(134) },
                desc() {return "Atomic Powers boost Accelerator Power."},
                cost: E('e2e124'),
                effect() {
                    let ret = player.atom.atomic.add(1).log10().add(1).log10().add(1).log10().add(1).pow(0.1);
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            21: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Quark gain formula is better, and raise Electron Power's 2nd effect by 4.",
                cost: E('ee1.92e11'),
            },
            22: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Boost Star Generators gain.",
                cost: E('ee2.1e11'),
            },
            23: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Atom Upgrade 13 Boost Galactic Quarks.",
                cost: E('ee3e11'),
            },
            24: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Remove Atomic Overflow.",
                cost: E('ee4.2e11'),
            },
            25: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Unlock Element Tier 4.",
                cost: E('ee1e12'),
            },
        },
        4: {
            title: "Big Rip Upgrades",
            res: "Death Shard",
            getRes() { return player.qu.rip.amt },
            unl() { return player.qu.rip.first },
            can(x) { return player.qu.rip.amt.gte(this[x].cost) && !player.mainUpg.br.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.qu.rip.amt = player.qu.rip.amt.sub(this[x].cost)
                    player.mainUpg.br.push(x)
                }
            },
            auto_unl() { return false },
            lens: 25,
            1: {
                desc: `Start with Hydrogen-1 unlocked in Big Rip.`,
                cost: E(5),
            },
            2: {
                desc: `Mass Upgrades & Ranks are no longer nerfed by 8th QC modifier.`,
                cost: E(10),
            },
            3: {
                desc: `Pre-Quantum Global Speed is raised based on Death Shards (before division).`,
                cost: E(50),
                effect() {
                    let x = overflow(player.qu.rip.amt.add(1).log10().div(25).add(1).softcap(500,0.25,0),1e9,0.5);
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x)+(x.gte(500)?" <span class='soft'>(softcapped"+(x.gte(1e9)?"^2":"")+")</span>":"") },
            },
            4: {
                desc: `Start with 2 tiers of each Fermion in Big Rip.`,
                cost: E(250),
            },
            5: {
                desc: `Reduce Star Booster’s starting cost to ^0.1. Star Booster’s base is increased based on Death Shards.`,
                cost: E(2500),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().add(1).pow(3)
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            6: {
                desc: `Start with all Radiation features unlocked.`,
                cost: E(15000),
            },
            7: {
                desc: `Hybridized Uran-Astatine is twice effective, while Big Ripped.`,
                cost: E(100000),
            },
            8: {
                desc: `Passively gain 10% of Quantum Foams & Death Shards you would get from resetting each second.`,
                cost: E(750000),
            },
            9: {
                desc: `Unlock Break Dilation.`,
                cost: E(1e7),
            },
            10: {
                unl() { return player.md.break.active },
                desc: `Chromas are 10% stronger.`,
                cost: E(2.5e8),
            },
            11: {
                unl() { return player.md.break.active },
                desc: `Prestige Level no longer resets anything.`,
                cost: E(1e10),
            },
            12: {
                unl() { return player.md.break.active },
                desc: `Mass gain softcap^5 starts later based on Atom.`,
                cost: E(1e16),
                effect() {
                    let x = player.atom.points.add(1).log10().add(1).log10().add(1).root(3)
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x)+" later" },
            },
            13: {
                unl() { return player.md.break.active },
                desc: `Death Shard gain is boosted based on Prestige Base.`,
                cost: E(1e17),
                effect() {
                    let x = (tmp.prestiges.base||E(1)).add(1).log10().tetrate(1.5).add(1)
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            14: {
                unl() { return player.md.break.active },
                desc: `Super Fermion Tier starts 10 later (after QC8 nerf).`,
                cost: E(1e22),
            },
            15: {
                unl() { return player.md.break.active },
                desc: `Blueprint Particles give slightly more Pre-Quantum Global Speed.`,
                cost: E(1e24),
            },
            16: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Timeshard Effect is slightly stronger.",
                cost: E(1e229),
            },
            17: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Timeshard Effect is slightly stronger again.",
                cost: E(1e232),
            },
            18: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Timeshard Effect is slightly stronger again.",
                cost: E(1e266),
            },
            19: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Timeshard Effect is slightly stronger again.",
                cost: E("1e337"),
            },
            20: {
                unl() { return hasUpgrade('inf',15) },
                desc: "Death Shards boost mass gain.",
                cost: E("1e375"),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().add(1).log10().add(1).pow(1.5);
					if(hasElement(313))x = expMult(player.qu.rip.amt.add(100),0.75);
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x) },
            },
            21: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Remove Death Shard gain softcap.",
                cost: E('e1.8e13'),
            },
            22: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Change the effect of C14.",
                cost: E('e1.5e14'),
            },
            23: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Death Shards boost Exotic Matter gain.",
                cost: E('e4e14'),
				effect(){
					return player.qu.rip.amt.add(1e10).slog().pow(2.5);
				},
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            24: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "The Impossible scaling of All Challenges is 20% weaker.",
                cost: E('e6e14'),
            },
            25: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Base Quantum Foam gain ^(16/9)",
                cost: E('e2.4e15'),
            },
        },
        5: {
            title: "Infinity Upgrades",
            res: "Infinity Mass",
            getRes() { return player.inf.points },
            unl() { return player.inf.times.gte(1) },
            can(x) { return player.inf.points.gte(this[x].cost) && !player.mainUpg.inf.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.inf.points = player.inf.points.sub(this[x].cost)
                    player.mainUpg.inf.push(x)
                }
            },
            auto_unl() { return false },
            lens: 25,
            1: {
                desc: `Multiply your quantum times gain by (200+Infinity times). Infinity Mass boost Quantum Foam gain. The actual cost of this upgrade is 1 mg of Infinity Mass.`,
                cost: E(1e-3),
                effect() {
                    let x = player.inf.points.add(1).pow(2);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            2: {
                desc: `Keep your neutron tree when Infinity. Infinity Mass boost Entropy gain and cap.`,
                cost: E(1),
                effect() {
                    let x = player.inf.points.mul(20).add(1);
					if(hasUpgrade('inf',16))x = x.pow(2);
					if(hasElement(211))x = x.pow(1.2);
					if(hasElement(321))x = x.pow(5);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x.pow(0.1).mul(2))+" to gain, x"+format(x)+" to cap" },
            },
            3: {
                desc: `Keep your upgrades and Quantum Shards when Infinity. Gain 200 Quantums when Infinity. Infinity Mass boost Death Shards gain.`,
                cost: E(1),
                effect() {
					if(hasElement(308))return player.inf.points.add(1).pow(2);
                    let x = overflow(player.inf.points.add(1).pow(2),1e10,hasUpgrade('inf',18)?0.6:0.5);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x)+(x.gte(1e10)&&!hasElement(308)?" <span class='soft'>(softcapped)</span>":"") },
            },
            4: {
                desc: `Infinity times boost Infinity Mass.`,
                cost: E(2),
                effect() {
                    let x = player.inf.times.add(1);
					if(hasUpgrade('inf',23))x = expMult(x.add(100),1.5);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            5: {
                desc: `Keep your elements when Infinity. Infinity Mass boost Prestige Mass gain.`,
                cost: E(5),
                effect() {
					if(hasElement(430))return player.inf.points.add(1).pow(0.5);
                    let x = overflow(player.inf.points.add(1).pow(0.5),"1e2500",hasUpgrade("inf",22)?0.7:0.5);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x)+((x.gte("1e2500") && !hasElement(430))?" <span class='soft'>(softcapped)</span>":"") },
            },
            6: {
                desc: `Mass gain softcap^6-7 are 50% weaker.`,
                cost: E(100),
            },
            7: {
                desc: `Infinity Mass base formula is better.`,
                cost: E(200),
            },
            8: {
                desc: `Infinity Mass formula from normal mass is better.`,
                cost: E(1000),
            },
            9: {
                desc: `Infinity Mass formula from normal mass is better. Infinity Mass boost Pre-Quantum Global Speed.`,
                cost: E(10000),
                effect() {
                    let x = overflow(player.inf.points.add(1).pow(hasElement(341)?1:0.4),"1e2000",hasElement(341)?1:0.5);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x)+(x.gte("1e2000")&&!hasElement(341)?" <span class='soft'>(softcapped)</span>":"") },
            },
            10: {
                desc: `Infinity Mass formula from Prestige mass is better. Mass gain softcap^8 is 50% weaker.`,
                cost: E(5e6),
            },
            11: {
                desc: `Gain 100% of Infinity Mass gain per second. Gain 1 Infinity count per second.`,
                cost: E(1e8),
            },
            12: {
                desc: `Infinity Mass Boost Infinity count gain.`,
                cost: E(5e10),
                effect() {
                    let x = player.inf.points.add(1).log10();
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            13: {
                desc: `Mass gain softcap^8-9 are 1% weaker.`,
                cost: E(1e12),
            },
            14: {
                desc: `Infinity Mass base formula is better.`,
                cost: E(6e12),
            },
            15: {
                desc: `Unlock More Upgrades. Eternity Mass base formula is better.`,
                cost: E(3e13),
            },
            16: {
                unl() { return hasUpgrade('inf',15) },
                desc: `Infinity Mass base formula is better, and Infinity Upgrade 2 is squared.`,
                cost: E(1e14),
            },
            17: {
                unl() { return hasUpgrade('inf',15) },
                desc: `Timeshards boost Infinity Mass. Eternity Mass base formula is better.`,
                cost: E(1e16),
                effect() {
                    let x = player.et.shards.add(1).pow(0.05);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            18: {
                unl() { return hasUpgrade('inf',15) },
                desc: `Infinity Mass base formula is better, and Infinity Upgrade 3's softcap is weaker.`,
                cost: E(1e27),
            },
            19: {
                unl() { return hasUpgrade('inf',15) },
                desc: `Infinity Mass base formula is better, and Death Shard gain softcap is weaker.`,
                cost: E(1e34),
            },
            20: {
                unl() { return hasUpgrade('inf',15) },
                desc: `Infinity Mass formula from Death Shards is better, and Death Shard gain softcap is weaker.`,
                cost: E(1e51),
            },
            21: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Reduce Supernova Galaxies Requirements.",
                cost: E('e110000'),
            },
            22: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Infinity Upgrade 5's softcap is weaker.",
                cost: E('e120000'),
            },
            23: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Infinity Upgrade 4 is better.",
                cost: E('e123000'),
            },
            24: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Infinity Mass boost Exotic Matter.",
                cost: E('e126000'),
                effect() {
                    let x = player.inf.points.add(1).log10().add(1).log10();
					if(hasElement(471))x = player.inf.points.add(1).log10().pow(0.2);
					if(hasElement(447))x = x.pow(2);
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            25: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Infinity Upgrade 24 boost Galactic Quarks.",
                cost: E('e141000'),
            },
        },
        6: {
            title: "Exotic Upgrades",
            res: "Exotic Matter",
            getRes() { return player.exotic.points },
            unl() { return player.exotic.times.gte(1) },
            can(x) { return player.exotic.points.gte(this[x].cost) && !player.mainUpg.exotic.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.exotic.points = player.exotic.points.sub(this[x].cost)
                    player.mainUpg.exotic.push(x)
                }
            },
            auto_unl() { return false },
            lens: 25,
            1: {
                desc: `Multiply your Eternity times gain by (200+Exotic reset times). Remove Mass and Star Overflow.`,
                cost: E(1),
            },
            2: {
                desc: `Super Supernova Galaxies starts 5 later.`,
                cost: E(5),
            },
            3: {
                desc: `Unlock Mass Upgrade 4.`,
                cost: E(15),
            },
            4: {
                desc: `Unlock Prestige Mass Upgrade 4.`,
                cost: E(30),
            },
            5: {
                desc: `Unlock Reset Count Booster.`,
                cost: E(150),
            },
            6: {
                unl() { return hasUpgrade('exotic',5) },
                desc: "Prestige Overpower provide free Overpower.",
                cost: E(750),
                effect() {
                    let ret = player.prestigeMassUpg[4].div(40);
					if(hasUpgrade('exotic',7))ret = ret.mul(2);
					if(hasUpgrade('exotic',9))ret = ret.mul(2.5);
					if(hasUpgrade('exotic',14))ret = ret.mul(2);
					if(hasUpgrade('exotic',16))ret = ret.mul(2);
					if(hasUpgrade('exotic',23))ret = ret.mul(2);
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" Overpower"
                },
            },
            7: {
                unl() { return hasUpgrade('exotic',5) },
                desc: "Double the effect of Exotic Upgrade 6.",
                cost: E(10000)
            },
            8: {
                unl() { return hasUpgrade('exotic',5) },
                desc: "Hawking Radiation gain is better.",
                cost: E(25000)
            },
            9: {
                unl() { return hasUpgrade('exotic',5) },
                desc: "Multiply the effect of Exotic Upgrade 6 by 2.5.",
                cost: E(50000)
            },
            10: {
                unl() { return hasUpgrade('exotic',5) },
                desc: "Unlock Exotic Boosts.",
                cost: E(200000)
            },
            11: {
                unl() { return hasUpgrade('exotic',10) },
                desc: "Unlock a new Exotic Boost type.",
                cost: E(800000)
            },
            12: {
                unl() { return hasUpgrade('exotic',10) },
                desc: "Break Dilation Upgrade 5 affects Meta-Pent.",
                cost: E(2000000)
            },
            13: {
                unl() { return hasUpgrade('exotic',10) },
                desc: "Raise Neutron and Electron Power effects by 5.",
                cost: E(4000000)
            },
            14: {
                unl() { return hasUpgrade('exotic',10) },
                desc: "Double the effect of Exotic Upgrade 6.",
                cost: E(10000000)
            },
            15: {
                unl() { return hasUpgrade('exotic',10) },
                desc: "Unlock Darkness.",
                cost: E(1e8)
            },
            16: {
                unl() { return hasUpgrade('exotic',15) },
                desc: "Double the effect of Exotic Upgrade 6.",
                cost: E(1e9)
            },
            17: {
                unl() { return hasUpgrade('exotic',15) },
                desc: "Multiply Exotic Matter gain by (1+Exotic reset times).",
                cost: E(1e10)
            },
            18: {
                unl() { return hasUpgrade('exotic',15) },
                desc: "Unlock a new Exotic Boost type.",
                cost: E(3e11)
            },
            19: {
                unl() { return hasUpgrade('exotic',15) },
                desc: "Permanently keep all upgrades, and unlock more upgrades.",
                cost: E(3e12)
            },
            20: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Unlock a new Exotic Boost type.",
                cost: E(1e14)
            },
            21: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Meta-Pent starts later based on Exotic Matter.",
                cost: E(2e15),
				effect(){
					return overflow(player.exotic.points.add(1),1e10,hasAscension(1,8)?2.5:2);
				},
                effDesc(x=this.effect()) { return "x"+format(x)+" later"; },
            },
            22: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Exotic Matter gain formula is better.",
                cost: E(2e16),
            },
            23: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Double the effect of Exotic Upgrade 6.",
                cost: E(2e20),
            },
            24: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Unlock a new Exotic Boost type.",
                cost: E(1e25),
            },
            25: {
                unl() { return hasUpgrade('exotic',19) },
                desc: "Unlock the final Exotic Boost type, Exotic Boost Importing and Exotic Boost Exporting.",
                cost: E(1e30),
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
function upgEffect(id,x,def=E(1)) { return tmp.upgs.main[id][x]?tmp.upgs.main[id][x].effect:def }