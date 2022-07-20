const BOSONS = {
    unl: () => player.supernova.times >= 10 || CHALS.inChal(13),

    names: ['pos_w','neg_w','z_boson','photon','gluon','graviton','hb'],
    gain: {
        pos_w() {
            let x = E(0.01).mul(tmp.bosons.effect.neg_w?tmp.bosons.effect.neg_w[1]:1).mul(tmp.bosons.effect.z_boson?tmp.bosons.effect.z_boson[1]:1).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
        neg_w() {
            let x = E(0.01).mul(tmp.bosons.effect.pos_w?tmp.bosons.effect.pos_w[1]:1).mul(tmp.bosons.effect.z_boson?tmp.bosons.effect.z_boson[1]:1).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
        z_boson() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            if (hasTree("sn4")) x = x.pow(1.5)
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
        photon() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            x = x.mul(tmp.bosons.upgs.photon[2]?tmp.bosons.upgs.photon[2].effect:1)
            if (hasTree("bs2") && tmp.supernova.tree_eff.bs2) x = x.mul(tmp.supernova.tree_eff.bs2[1])
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
        gluon() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1)
            x = x.mul(tmp.bosons.upgs.gluon[2]?tmp.bosons.upgs.gluon[2].effect:1)
            if (hasTree("bs2") && tmp.supernova.tree_eff.bs2) x = x.mul(tmp.supernova.tree_eff.bs2[0])
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
        graviton() {
            let x = E(0.01).mul(tmp.bosons.effect.graviton?tmp.bosons.effect.graviton[0]:1).mul(tmp.fermions.effs[1][1])
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
        hb() {
            let x = E(0.01).mul(tmp.fermions.effs[1][1])
            if (hasTree("bs1")) x = x.mul(treeEff("bs1",1))
            x = x.mul(tmp.supernova.timeMult)
            return x
        },
    },
    effect: {
        pos_w(x) {
            let a = FERMIONS.onActive(15) ? E(1) : x.add(1).pow(2e4)
            let b = expMult(x.add(1),2/3,2)
            return [a,b]
        },
        neg_w(x) {
            let a = FERMIONS.onActive(15) ? E(1) : x.add(1).log10().add(1).root(3)
            let b = expMult(x.add(1),0.75,2)
            return [a,b]
        },
        z_boson(x) {
            let a = x.add(1).log10().add(1).pow(tmp.fermions.effs[0][2])
            let b = x.add(1).pow(2/3)
            return [a,b]
        },
        graviton(x) {
            let a = expMult(x.add(1),0.5).pow(tmp.bosons.effect.hb?tmp.bosons.effect.hb[0]:1)
            if (bosonsMastered()) a = x.add(1).sqrt()
            return [a]
        },
        hb(x) {
            let a = x.add(1).log10().max(0).root(2)
            if (bosonsMastered()) a = x.max(1).log10().max(1).log10().max(1).sqrt().min(1.7)
            return [a]
        },
    },
    upgs: {
        ids: ['photon','gluon'],
        buy(id,x) {
            if (tmp.bosons.upgs[id][x].can) {
                player.supernova.b_upgs[id][x] = player.supernova.b_upgs[id][x].max(tmp.bosons.upgs[id][x].bulk)
                if (!hasTree("qol7")) player.supernova.bosons[id] = player.supernova.bosons[id].sub(BOSONS.upgs[id][x].cost(tmp.bosons.upgs[id][x].bulk.sub(1))).max(0)
            }
        },
        photon: [
            {
                desc: () => bosonsMastered() ? "Raise Tickspeed Effect." : "Photons multiply Dark Matter and BH Mass.",
                cost(x) { return E(1.5).pow(x.pow(1.25)).mul(10) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(10) ? x.div(10).max(1).log(1.5).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
					if (bosonsMastered()) return x.add(1).log10().div(20).add(1)
					return player.supernova.bosons.photon.add(1).pow(x.mul(tmp.radiation.bs.eff[7]).pow(0.8).mul(100))
				},
                effDesc(x) { return bosonsMastered() ? "^"+format(x) : format(x)+"x" },
            },{
                desc: () => bosonsMastered() ? "Tickspeed Power multiplies Star Booster Power." : "Boost BH Condenser Power.",
                cost(x) { return E(2).pow(x.pow(1.25)).mul(100) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(100) ? x.div(100).max(1).log(2).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
					if (bosonsMastered()) return tmp.tickspeedEffect ? tmp.tickspeedEffect.step.pow(x.min(1e8).div(1e13)) : E(1)
					let a = x.add(1).pow(0.75)
					if (hasTree("fn4")) a = a.pow(2)
					return a
				},
                effDesc(x) { return format(x)+"x" },
            },{
                desc: () => bosonsMastered() ? "Produce more Photons." : "Collapsed stars boost Photons.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(500) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(500) ? x.div(500).max(1).log(5).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
					if (bosonsMastered()) return E(1.5).pow(x.pow(1.25))
					return player.stars.points.add(1).log10().add(1).pow(x.mul(0.2)).softcap(1e15,0.6,0)
				},
                effDesc(x) { return format(x)+"x"+(bosonsMastered()?"":getSoftcapHTML(x,1e15)) },
            },{
                desc: () => "Photons boost Stars.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(1e5) },
                bulk(x=player.supernova.bosons.photon) { return x.gte(1e5) ? x.div(1e5).max(1).log(5).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
					return player.supernova.bosons.photon.add(1).log10().add(1).pow(x.pow(tmp.fermions.effs[0][3]).mul(0.5)).min("ee14")
				},
                effDesc(x) { return format(x)+"x" },
            },
        ],
        gluon: [
            {
                desc: () => bosonsMastered() ? "Gain more bonus Cosmic Rays." : "Gain more Atoms & Atomic Powers based on Gluon.",
                cost(x) { return E(1.5).pow(x.pow(1.25)).mul(10) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(10) ? x.div(10).max(1).log(1.5).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
					if (bosonsMastered()) return x.add(1).log10().div(10).add(1)
					return player.supernova.bosons.gluon.add(1).pow(x.mul(tmp.radiation.bs.eff[7]).pow(0.8).mul(100)).min("e3e13")
				},
                effDesc(x) { return format(x)+"x" },
            },{
                desc: () => bosonsMastered() ? "Cosmic Ray Power softcap scales later." : "Boost Cosmic Ray Power.",
                cost(x) { return E(2).pow(x.pow(1.25)).mul(100) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(100) ? x.div(100).max(1).log(2).root(1.25).add(1).floor() : E(0) },
                effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
                    let a = x.add(1).pow(0.75)
                    if (hasTree("fn4")) a = a.pow(2)
                    return a
                },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: () => bosonsMastered() ? "Produce more Gluons." : "Quarks boost Gluons.",
                cost(x) { return E(5).pow(x.pow(1.25)).mul(500) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(500) ? x.div(500).max(1).log(5).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)
					if (bosonsMastered()) return E(1.5).pow(x.pow(1.25))
					return player.atom.quarks.add(1).log10().add(1).pow(x.mul(0.125)).softcap(1e15,0.6,0)
				},
                effDesc(x) { return format(x)+"x"+(bosonsMastered()?"":getSoftcapHTML(x,1e15)) },
            },{
                desc: () => "Gluons weaken Supernovae scaling.",
                cost(x) { return E(10).pow(x.pow(1.25)).mul(1e5) },
                bulk(x=player.supernova.bosons.gluon) { return x.gte(1e5) ? x.div(1e5).max(1).log(10).root(1.25).add(1).floor() : E(0) },
				effect(x) {
					if (FERMIONS.onActive(15)) return E(1)

					let exp = E(1/3)
					exp = exp.mul(tmp.fermions.effs[0][3])
					return player.supernova.bosons.gluon.add(1).log10().add(1).log10().mul(x.pow(exp)).div(10).add(1)
				},
                effDesc(x) { return "/"+format(x) },
            },
        ],
    },
}

function setupBosonsHTML() {
    for (let x in BOSONS.upgs.ids) {
        let id = BOSONS.upgs.ids[x]
        let new_table = new Element(id+"_upgs_table")
        let table = ""
        for (let y in BOSONS.upgs[id]) {
            let id2 = id+"_upg"+y
            table += `
            <button class="btn b_btn full" id="${id2}_div" onclick="BOSONS.upgs.buy('${id}',${y})">
                <div style="min-height: 80px">
                    [Level <span id="${id2}_lvl">X</span>]<br>
                    <span id="${id2}_desc"></span><br>
                    Currently: <span id="${id2}_eff">X</span><br>
                </div>
                Cost: <span id="${id2}_cost">X</span> ${capitalFirst(id)}
            </button>
            `
        }
        new_table.setHTML(table)
    }
}

function updateBosonsTemp() {
    if (!tmp.bosons) {
        tmp.bosons = {
            gain: {},
            effect: {},
            upgs: {},
        }
        for (let x in BOSONS.upgs.ids) tmp.bosons.upgs[BOSONS.upgs.ids[x]] = []
    }
    for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        tmp.bosons.gain[id] = BOSONS.gain[id]?BOSONS.gain[id]():E(0)
        if (BOSONS.effect[id]) tmp.bosons.effect[id] = BOSONS.effect[id](player.supernova.bosons[id])

        if (BOSONS.upgs.ids.includes(id)) for (let y in BOSONS.upgs[id]) {
            let upg = BOSONS.upgs[id][y]
            tmp.bosons.upgs[id][y] = {
                cost: upg.cost(player.supernova.b_upgs[id][y]),
                bulk: upg.bulk(),
                effect: upg.effect(player.supernova.b_upgs[id][y]),
            }
            tmp.bosons.upgs[id][y].can = player.supernova.bosons[id].gte(tmp.bosons.upgs[id][y].cost)
        }
    }
}

function updateBosonsHTML() {
    for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        elm[id+"_amt"].setTxt(format(player.supernova.bosons[id])+" "+formatGain(player.supernova.bosons[id],tmp.bosons.gain[id]))
        if (tmp.bosons.effect[id]) for (let y in tmp.bosons.effect[id]) elm[id+"_eff"+y].setTxt(format(tmp.bosons.effect[id][y]))

        if (BOSONS.upgs.ids.includes(id)) for (let y in BOSONS.upgs[id]) {
            let id2 = id+"_upg"+y
            elm[id2+"_div"].setDisplay(y < 3 || !scalingToned("supernova"))
            elm[id2+"_div"].setClasses({btn: true, full: true, b_btn: true, locked: !tmp.bosons.upgs[id][y].can})
            elm[id2+"_desc"].setTxt(BOSONS.upgs[id][y].desc())
            elm[id2+"_lvl"].setTxt(format(player.supernova.b_upgs[id][y],0,"sc"))
            elm[id2+"_eff"].setHTML(BOSONS.upgs[id][y].effDesc(tmp.bosons.upgs[id][y].effect))
            elm[id2+"_cost"].setTxt(format(tmp.bosons.upgs[id][y].cost))
        }
    }
}

function bosonsMastered() {
	return GLUBALL.got("p3_3")
}