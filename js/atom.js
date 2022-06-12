const ATOM = {
    gain() {
        if (CHALS.inChal(13)) return E(0)
        let x = player.bh.mass.div(1.5e156)
        if (x.lt(1)) return E(0)
        x = x.root(5)
        if (hasUpgrade('rp',15)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][15].effect:E(1))
        if (!bosonsMastered()) x = x.mul(tmp.bosons.upgs.gluon[0].effect)
        if (hasElement(17)) x = x.pow(1.1)
        if (FERMIONS.onActive("10")) x = expMult(x,0.625)
        return x.floor()
    },
    quarkGain() {
        if (CHALS.inChal(13)) return E(0)
        if (tmp.atom.gain.lt(1)) return E(0)
        x = tmp.atom.gain.max(1).log10().pow(1.1).add(1)
        if (hasElement(1)) x = E(1.25).pow(tmp.atom.gain.max(1).log10())
        if (hasUpgrade('bh',13)) x = x.mul(10)
        if (hasUpgrade('atom',8)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][8].effect:E(1))
        if (hasRank("rank", 300)) x = x.mul(RANKS.effect.rank[300]())
        if (hasElement(6)) x = x.mul(tmp.elements.effect[6])
        if (hasElement(42)) x = x.mul(tmp.elements.effect[42])
        if (hasElement(67)) x = x.mul(tmp.elements.effect[67])
        if (player.md.upgs[6].gte(1)) x = x.mul(tmp.md.upgs[6].eff)
        x = x.mul(tmp.md.upgs[9].eff)
        if (hasElement(47)) x = x.pow(1.1)
        return x.floor()
    },
    canReset() { return tmp.atom.gain.gte(1) },
    reset() {
        if (tmp.atom.canReset) if (player.confirms.atom?confirm("Are you sure to reset?"):true) {
            player.atom.points = player.atom.points.add(tmp.atom.gain)
            player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain)
            player.atom.unl = true
            this.doReset()
        }
    },
    doReset(chal_reset=true) {
        player.atom.atomic = E(0)
        player.bh.dm = E(0)
        player.bh.condenser = E(0)
		resetExtraBuildings("bh")
        let keep = []
        for (let x = 0; x < player.mainUpg.bh.length; x++) if ([5].includes(player.mainUpg.bh[x])) keep.push(player.mainUpg.bh[x])
        player.mainUpg.bh = keep
        if (chal_reset && !hasUpgrade('atom',4) && !hasTree("chal2") ) for (let x = 1; x <= 4; x++) player.chal.comps[x] = E(0)
        FORMS.bh.doReset()
    },
    atomic: {
        gain() {
            let x = tmp.atom.gamma_ray_eff?tmp.atom.gamma_ray_eff.eff:E(0)
            if (hasElement(3)) x = x.mul(tmp.elements.effect[3])
            if (hasElement(52)) x = x.mul(tmp.elements.effect[52])
            if (!bosonsMastered()) x = x.mul(tmp.bosons.upgs.gluon[0].effect)
            if (FERMIONS.onActive("00")) x = expMult(x,0.6)
            if (tmp.md.active) x = MASS_DILATION.applyDil(x)
            return x
        },
		softcap() {
			let r = E(5e4)
			if (AXION.unl()) r = r.mul(tmp.ax.eff[1])
			return r
		},
		effect() {
			if (CHALS.inChal(14)) return E(0)
			let sc = ATOM.atomic.softcap()
			let x = player.atom.atomic.max(1).log(hasElement(23)?1.5:1.75).softcap(sc,0.75,0).softcap(sc.mul(800),0.25,0)
			return x.floor()
		},
    },
    gamma_ray: {
        buy() {
			if (CHALS.inChal(14)) return
            if (tmp.atom.gamma_ray_can) {
                player.atom.points = player.atom.points.sub(tmp.atom.gamma_ray_cost).max(0)
                player.atom.gamma_ray = player.atom.gamma_ray.add(1)
            }
        },
        buyMax() {
			if (CHALS.inChal(14)) return
            if (tmp.atom.gamma_ray_can) {
                player.atom.gamma_ray = tmp.atom.gamma_ray_bulk
                player.atom.points = player.atom.points.sub(tmp.atom.gamma_ray_cost).max(0)
            }
			buyExtraBuildings("ag",2)
			buyExtraBuildings("ag",3)
        },
        effect() {
            let t = player.atom.gamma_ray
            if (!scalingToned("gamma_ray")) t = t.mul(tmp.radiation.bs.eff[10])
            let pow = E(2)
            if (hasUpgrade('atom',4)) pow = pow.add(tmp.upgs.main?tmp.upgs.main[3][4].effect:E(0))
            if (hasUpgrade('atom',11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
            if (hasTree("gr1")) pow = pow.mul(treeEff("gr1"))
            if (!bosonsMastered()) pow = pow.mul(tmp.bosons.upgs.gluon[1].effect)
            if (hasTree("gr2")) pow = pow.pow(1.25)
            pow = pow.softcap(tmp.atom.gamma_ray_ss,10,3)
            let eff = pow.pow(t.add(tmp.atom.gamma_ray_bonus)).sub(1)
            return {pow: pow, eff: eff}
        },
        bonus() {
			if (CHALS.inChal(14)) return E(0)
            let x = tmp.fermions.effs[0][0]||E(0)
            return x
        },
    },
    particles: {
        names: ['Proton', 'Neutron', 'Electron'],
        disabled(x) {
            return CHALS.inChal(9) || FERMIONS.onActive("12")
        },
        assign(x) {
            if (player.atom.quarks.lt(1) || this.disabled()) return
            let m = player.atom.ratio
            let spent = m > 0 ? player.atom.quarks.mul(RATIO_MODE[m]).ceil() : E(1)
            player.atom.quarks = player.atom.quarks.sub(spent).max(0)
            player.atom.particles[x] = player.atom.particles[x].add(spent)
        },
        assignAll() {
            let sum = player.atom.dRatio[0]+player.atom.dRatio[1]+player.atom.dRatio[2]
            if (player.atom.quarks.lt(sum) || this.disabled()) return
            let spent = player.atom.quarks.div(sum).floor()
            for (let x = 0; x < 3; x++) {
                let add = spent.mul(player.atom.dRatio[x])
                player.atom.quarks = player.atom.quarks.sub(add).max(0)
                player.atom.particles[x] = player.atom.particles[x].add(add)
            }
        },
		mg12(p) {
			if (!p) p = player.atom.particles[0].max(player.atom.particles[1].max(player.atom.particles[2]))
			let e, m = [E(1), E(1)]
			if (tmp.chal) {
				e = tmp.chal.eff[9].exp.div(4)
				m = tmp.chal.eff[9].mul
			}
			return p.add(1).log10().add(1).pow(e).mul(m) //Maximum of ^1.325
		},
        effect(i) {
            let p = player.atom.particles[i]
            let x = p.pow(2)
            if (hasElement(12) && !hasTree("ext_u3")) x = p.pow(this.mg12(p))
			if (AXION.unl()) x = x.pow(tmp.ax.eff[4])
            if (!hasTree("ext_u3")) x = x.softcap('e3.8e4',0.9,2).softcap('e1.6e5',0.9,2).softcap('e1e11',0.9,2)
            return x
        },
        gain(i) {
            let x = tmp.atom.particles[i]?tmp.atom.particles[i].effect:E(0)
            if (hasUpgrade('atom',7)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][7].effect:E(1))
            return x
        },
        powerEffect: [
            x=>{
                let a = x.add(1).pow(3)
                let b = hasElement(29) ? x.add(1).log2().pow(1.25).mul(0.01) : x.add(1).pow(2.5).log2().mul(0.01)
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = x.add(1).pow(2)
                let b = hasElement(19)
                ?player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(10).mul(x.max(1).log(10)).root(2.75))
                :player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(100).mul(x.max(1).log(100)).root(3))
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = x.add(1)
                let b = hasElement(30) ? x.add(1).log2().pow(1.2).mul(0.01) : x.add(1).pow(2).log2().mul(0.01)
                return {eff1: a, eff2: b}
            },
        ],
        desc: [
            x=>{ return `
                Multiplies Mass gain by ${format(x.eff1)}<br><br>
                Adds Tickspeed Power by ${format(x.eff2.mul(100))}%
            ` },
            x=>{ return `
                Multiplies Rage Power gain by ${format(x.eff1)}<br><br>
                Makes Mass gain boosted by Rage Power - ${format(x.eff2)}x<br><br>
            ` },
            x=>{ return `
                Multiplies Dark Matter gain by ${format(x.eff1)}<br><br>
                Adds BH Condenser Power by ${format(x.eff2)}
            ` },
        ],
        colors: ['#0f0','#ff0','#f00'],
    },
}

const RATIO_MODE = [null, 0.25, 1]
const RATIO_ID = ["+1", '25%', '100%']

function calcAtoms(dt, dt_offline) {
	if (hasElement(14)) player.atom.quarks = player.atom.quarks.add(tmp.atom.quarkGain.mul(dt*tmp.atom.quarkGainSec))
	if (hasElement(24)) player.atom.points = player.atom.points.add(tmp.atom.gain.mul(dt))
	if (player.atom.unl && tmp.pass) {
		player.atom.atomic = player.atom.atomic.add(tmp.atom.atomicGain.mul(dt))
		for (let x = 0; x < 3; x++) player.atom.powers[x] = player.atom.powers[x].add(tmp.atom.particles[x].powerGain.mul(dt))
	}
	if (hasElement(30) && !ATOM.particles.disabled()) for (let x = 0; x < 3; x++) player.atom.particles[x] = player.atom.particles[x].add(player.atom.quarks.mul(dt/10))
	if (hasElement(18) && player.atom.auto_gr) ATOM.gamma_ray.buyMax()

	//ELEMENTS
	if (hasTree("qol1")) for (let x = 1; x <= tmp.elements.unl_length; x++) if (x<=tmp.elements.upg_length) ELEMENTS.buyUpg(x)

	//MASS DILATION
	if (hasElement(21)) {
		player.md.mass = player.md.mass.add(tmp.md.mass_gain.mul(dt))
		if (hasTree("qol3")) player.md.particles = player.md.particles.add(player.md.active ? tmp.md.rp_gain.mul(dt) : tmp.md.passive_rp_gain.mul(dt))
	}
	if (hasElement(43)) {
		for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) if ((hasTree("qol3") || player.md.upgs[x].gte(1)) && (MASS_DILATION.upgs.ids[x].unl?MASS_DILATION.upgs.ids[x].unl():true)) MASS_DILATION.upgs.buy(x)
	}

	//STARS
	calcStars(dt, dt_offline)
}

function updateAtomTemp() {
    if (!tmp.atom) tmp.atom = {}
    if (!tmp.atom.particles) tmp.atom.particles = {}
    tmp.atom.gain = ATOM.gain()
    tmp.atom.quarkGain = ATOM.quarkGain()
    tmp.atom.quarkGainSec = 0.05
    if (hasElement(16)) tmp.atom.quarkGainSec += tmp.elements.effect[16]
    tmp.atom.canReset = ATOM.canReset()
    tmp.atom.atomicGain = ATOM.atomic.gain()
    tmp.atom.atomicEff = ATOM.atomic.effect()

	let fp = scalingToned("gamma_ray") ? E(30) : E(1)
	if (CHROMA.got("s3_2")) fp = fp.div(CHROMA.eff("s3_2"))
	if (hasPrim("p3_0")) fp = fp.div(tmp.pr.eff["p3_0"])

	let scale = scalingInitPower("gamma_ray")
    tmp.atom.gamma_ray_cost = E(2).pow(player.atom.gamma_ray.scaleEvery("gamma_ray").mul(fp).pow(scale)).floor()
    tmp.atom.gamma_ray_bulk = player.atom.points.max(1).log(2).root(scale).div(fp).scaleEvery("gamma_ray", 1).add(1).floor()
    if (player.atom.points.lt(1)) tmp.atom.gamma_ray_bulk = E(0)

    tmp.atom.gamma_ray_can = player.atom.points.gte(tmp.atom.gamma_ray_cost)
    tmp.atom.gamma_ray_bonus = ATOM.gamma_ray.bonus()
    tmp.atom.gamma_ray_ss = E(1e20)
    if (bosonsMastered()) tmp.atom.gamma_ray_ss = tmp.atom.gamma_ray_ss.mul(tmp.bosons.upgs.gluon[1].effect)
    tmp.atom.gamma_ray_eff = ATOM.gamma_ray.effect()

    for (let x = 0; x < ATOM.particles.names.length; x++) {
        tmp.atom.particles[x] = {
            effect: ATOM.particles.effect(x),
            powerGain: ATOM.particles.gain(x),
            powerEffect: ATOM.particles.powerEffect[x](player.atom.powers[x]),
        }
    }
}

function setupAtomHTML() {
    let particles_table = new Element("particles_table")
	let table = ""
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        table += `
        <div style="width: 30%"><button id="particle_${x}_assign" class="btn" onclick="ATOM.particles.assign(${x})">Assign</button><br><br>
            <div style="color: ${ATOM.particles.colors[x]}; min-height: 120px">
                <h2><span id="particle_${x}_amt">X</span> ${ATOM.particles.names[x]}s</h2><br>
                Which generates <span id="particle_${x}_amtEff">X</span> ${ATOM.particles.names[x]} Powers<span id="particle_${x}_sc">X</span> <br>
                You have <span id="particle_${x}_power">X</span> ${ATOM.particles.names[x]} Powers, which:
            </div><br><div id="particle_${x}_powerEff"></div>
        </div>
        `
    }
	particles_table.setHTML(table)
}

function updateAtomicHTML() {
    elm.atomicAmt.setHTML(format(player.atom.atomic)+" "+formatGain(player.atom.atomic, tmp.atom.atomicGain))
	elm.atomicEff.setHTML(format(tmp.atom.atomicEff,0)+getSoftcapHTML(tmp.atom.atomicEff,ATOM.atomic.softcap(),ATOM.atomic.softcap().mul(800)))
	elm.gamma_ray_lvl.setTxt(format(player.atom.gamma_ray,0)+(tmp.atom.gamma_ray_bonus.gte(1)?" + "+format(tmp.atom.gamma_ray_bonus,0):""))
	elm.gamma_ray_btn.setClasses({btn: true, locked: !tmp.atom.gamma_ray_can})
	elm.gamma_ray_scale.setTxt(getScalingName('gamma_ray'))
	elm.gamma_ray_cost.setTxt(format(tmp.atom.gamma_ray_cost,0))
	elm.gamma_ray_pow.setHTML(format(tmp.atom.gamma_ray_eff.pow)+"x"+getSoftcapHTML(tmp.atom.gamma_ray_eff.pow,tmp.atom.gamma_ray_ss))
	elm.gamma_ray_eff.setHTML(format(tmp.atom.gamma_ray_eff.eff))
    elm.gamma_ray_auto.setDisplay(hasElement(18))
	elm.gamma_ray_auto.setTxt(player.atom.auto_gr?"ON":"OFF")

	updateExtraBuildingHTML("ag", 2)
	updateExtraBuildingHTML("ag", 3)
}

function updateAtomHTML() {
    elm.particles_assign.setDisplay(!EXT.unl())
    elm.atom_ratio.setTxt(RATIO_ID[player.atom.ratio])
    elm.unassignQuarkAmt.setTxt(format(player.atom.quarks,0))
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        elm["particle_"+x+"_assign"].setDisplay(!EXT.unl())
        elm["particle_"+x+"_amt"].setTxt(format(player.atom.particles[x],0))
        elm["particle_"+x+"_amtEff"].setHTML(format(tmp.atom.particles[x].powerGain))
        elm["particle_"+x+"_sc"].setHTML(hasTree("ext_u3") ? "" : getSoftcapHTML(tmp.atom.particles[x].powerGain,'e3.8e4','e1.6e5','e1e11'))
        elm["particle_"+x+"_power"].setTxt(format(player.atom.powers[x])+" "+formatGain(player.atom.powers[x],tmp.atom.particles[x].powerGain))
        elm["particle_"+x+"_powerEff"].setHTML(ATOM.particles.desc[x](tmp.atom.particles[x].powerEffect))
    }
}