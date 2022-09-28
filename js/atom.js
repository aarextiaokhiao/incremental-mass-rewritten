const ATOM = {
    gain() {
        if (CHALS.inChal(12) || CHALS.inChal(14) || CHALS.inChal(19)) return E(0)
        let x = player.bh.mass.div(player.mainUpg.br.includes(1)?1.5e156**0.5:1.5e156)
        if (x.lt(1)) return E(0)
        x = x.root(5)
        if (player.mainUpg.rp.includes(15)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][15].effect:E(1))
        x = x.mul(tmp.bosons.upgs.gluon[0].effect)
	
	
        if (hasElement(17)) x = x.pow(1.1)
        if (player.ranks.hex.gte(17)) x = x.pow(1.1)
        x = x.pow(tmp.prim.eff[3][0])
        if (hasElement(111)) x = x.pow(tmp.elements.effect[111])

        if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
        if (FERMIONS.onActive("10")) x = expMult(x,0.625)
			
		if (FERMIONS.onActive("34")) x = x.add(1).log10().pow(3000)
		
		if (player.gc.active) x = GCeffect(x)
			
        return x.floor()
    },
    quarkGain() {
        if (tmp.atom.gain.lt(1)) return E(0)
        x = tmp.atom.gain.max(1).log10().pow(1.1).add(1)
        if (hasElement(1)) x = E(1.25).pow(tmp.atom.gain.max(1).log10())
        if (hasElement(1) && player.ranks.hex.gte(1)) x = E(1.5).pow(tmp.atom.gain.max(1).log10())
        if (player.mainUpg.bh.includes(13)) x = x.mul(10)
        if (player.mainUpg.atom.includes(8)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][8].effect:E(1))
        if (player.ranks.rank.gte(300)) x = x.mul(RANKS.effect.rank[300]())
        if (hasElement(6)) x = x.mul(tmp.elements.effect[6])
        if (hasElement(42)) x = x.mul(tmp.elements.effect[42])
        if (hasElement(67)) x = x.mul(tmp.elements.effect[67])
        if (player.md.upgs[6].gte(1)) x = x.mul(tmp.md.upgs[6].eff)
        x = x.mul(tmp.md.upgs[9].eff)
        if (hasElement(47)) x = x.pow(1.1)
        if (player.ranks.hex.gte(47)) x = x.pow(1.1)
        if (hasPrestige(1,7)) x = x.pow(prestigeEff(1,7))
        if (hasElement(67) && player.ranks.hex.gte(67)) x = x.pow(tmp.elements.effect[67])
		x = x.pow(SUPERNOVA_GALAXY.galPow1_eff())
        if (hasElement(231)) x = x.pow(tmp.elements.effect[231])
			
		
		if (FERMIONS.onActive("30")) x = x.add(1).log10()
		
		
		if (player.gc.active) x = GCeffect(x)
			
        return x.floor();
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
        let keep = []
        for (let x = 0; x < player.mainUpg.bh.length; x++) if ([5].includes(player.mainUpg.bh[x])) keep.push(player.mainUpg.bh[x])
        if(player.qu.times.gt(0))for (let x = 0; x < player.mainUpg.bh.length; x++) if ([6].includes(player.mainUpg.bh[x])) keep.push(player.mainUpg.bh[x])
        player.mainUpg.bh = keep
        if (chal_reset && !player.mainUpg.atom.includes(4) && !hasTree("chal2") ) for (let x = 1; x <= 4; x++) player.chal.comps[x] = E(0)
        FORMS.bh.doReset()
    },
    atomic: {
        gain() {
            let x = tmp.atom.gamma_ray_eff?tmp.atom.gamma_ray_eff.eff:E(0)
            if (hasElement(3)) x = x.mul(tmp.elements.effect[3])
            if (hasElement(52)) x = x.mul(tmp.elements.effect[52])
            x = x.mul(tmp.bosons.upgs.gluon[0].effect)
			x = x.pow(tmp.fermions.effs[2][0]||E(1))
			
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
            if (FERMIONS.onActive("00")) x = expMult(x,0.6)
            if (player.md.active || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) x = expMult(x,tmp.md.pen)
            
			if (FERMIONS.onActive("20")) x = x.add(1).log10()
			
			if (player.gc.active) x = GCeffect(x)
				
			tmp.atomicOverflowPower = E(0.8)
			tmp.atomicOverflow = overflow(x,"e1e3000",tmp.atomicOverflowPower).log(x);
			return overflow(x,"e1e3000",tmp.atomicOverflowPower);
        },
        effect() {
            let x = player.atom.atomic.max(1).log(player.ranks.hex.gte(23)?1.2:hasElement(23)?1.5:1.75).pow(getEnRewardEff(1))
            if (!hasElement(75)) x = x.softcap((player.prestiges[0].gte(50) && hasUpgrade("atom",13))?6e5:5e4,hasUpgrade("atom",19)?0.9:0.75,0).softcap((player.prestiges[0].gte(50) && hasUpgrade("atom",13))?4.8e7:4e6,hasUpgrade("atom",19)?0.5:0.25,0)
            if (!hasElement(337)) x = x.softcap(hasUpgrade("atom",13)?(player.prestiges[0].gte(50)?1.2e11:1e11):1e10,hasUpgrade("atom",19)?0.105:0.1,0)
			x = overflow(x,"ee9",hasElement(337)?0.3:0.25);
            return x.floor()
        },
    },
    gamma_ray: {
        buy() {
            if (tmp.atom.gamma_ray_can) {
                player.atom.points = player.atom.points.sub(tmp.atom.gamma_ray_cost).max(0)
                player.atom.gamma_ray = player.atom.gamma_ray.add(1)
            }
        },
        buyMax() {
            if (tmp.atom.gamma_ray_can) {
                player.atom.gamma_ray = tmp.atom.gamma_ray_bulk
                player.atom.points = player.atom.points.sub(tmp.atom.gamma_ray_cost).max(0)
            }
        },
        effect() {
            let t = player.atom.gamma_ray
            t = t.mul(tmp.radiation.bs.eff[10])
            let pow = E(2)
            if (player.mainUpg.atom.includes(4)) pow = pow.add(tmp.upgs.main?tmp.upgs.main[3][4].effect:E(0))
            if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
            if (hasTree("gr1")) pow = pow.mul(tmp.supernova.tree_eff.gr1)
            pow = pow.mul(tmp.bosons.upgs.gluon[1].effect)
            pow = pow.mul(tmp.prim.eff[3][1])
            pow = pow.mul(getEnRewardEff(3)[1])
            if (hasTree('bs5')) pow = pow.mul(tmp.bosons.effect.z_boson[0])
            if (hasTree("gr2")) pow = pow.pow(1.25)
            let eff = pow.pow(t.add(tmp.atom.gamma_ray_bonus)).sub(1)
            return {pow: pow, eff: eff}
        },
        bonus() {
            let x = tmp.fermions.effs[0][0]||E(0)
            x = x.mul(getEnRewardEff(4))
            return x
        },
    },
    particles: {
        names: ['Protons', 'Neutrons', 'Electrons'],
        assign(x) {
            if (player.atom.quarks.lt(1) || CHALS.inChal(9) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("12")) return
            let m = player.atom.ratio
            let spent = m > 0 ? player.atom.quarks.mul(RATIO_MODE[m]).ceil() : E(1)
            player.atom.quarks = player.atom.quarks.sub(spent).max(0)
            player.atom.particles[x] = player.atom.particles[x].add(spent)
        },
        gassign(x) {
            if (player.galQk.lt(1)) return
            let m = player.atom.ratio
            let spent = m > 0 ? player.galQk.mul(RATIO_MODE[m]).ceil() : E(1)
            player.galQk = player.galQk.sub(spent).max(0)
            player.galParticles[x] = player.galParticles[x].add(spent)
        },
        assignAll() {
            let sum = player.atom.dRatio[0]+player.atom.dRatio[1]+player.atom.dRatio[2]
            if (player.atom.quarks.lt(sum) || CHALS.inChal(9) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("12")) return
            let spent = player.atom.quarks.div(sum).floor()
            for (let x = 0; x < 3; x++) {
                let add = spent.mul(player.atom.dRatio[x])
                player.atom.quarks = player.atom.quarks.sub(add).max(0)
                player.atom.particles[x] = player.atom.particles[x].add(add)
            }
        },
        gassignAll() {
            let sum = player.atom.dRatio[0]+player.atom.dRatio[1]+player.atom.dRatio[2]
            if (player.galQk.lt(sum)) return
            let spent = player.galQk.div(sum).floor()
            for (let x = 0; x < 3; x++) {
                let add = spent.mul(player.atom.dRatio[x])
                player.galQk = player.galQk.sub(add).max(0)
                player.galParticles[x] = player.galParticles[x].add(add)
            }
        },
        effect(i) {
            let p = player.atom.particles[i]
            let x = p.pow(2)
            if (hasElement(12)) x = p.pow(p.add(1).log10().add(1).root(4).pow(tmp.chal.eff[9]).softcap(40000,0.1,0))
            if (player.ranks.hex.gte(12)) x = p.pow(p.add(1).log10().add(1).root(4).pow(tmp.chal.eff[9]).softcap(40000,0.99,0))
            x = x.softcap('e3.8e4',0.9,2).softcap('e1.6e5',0.9,2)
            if (hasElement(61)) x = x.mul(p.add(1).root(2))
            if (player.ranks.hex.gte(61)) x = x.mul(p.add(1).root(2))
            return x.softcap('ee11',0.9,2).softcap('ee13',0.9,2)
        },
        gain(i) {
            let x = tmp.atom.particles[i]?tmp.atom.particles[i].effect:E(0)
            if (player.mainUpg.atom.includes(7)) x = x.mul(tmp.upgs.main?tmp.upgs.main[3][7].effect:E(1))
            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
			x = x.pow(player.galParticles[i].add(1).log10().add(1).pow(3));
		if (player.gc.active) x = GCeffect(x)
            return x
        },
        powerEffect: [
            x=>{
                let a = hasElement(105) ? x.add(1).log10().add(1).log10().root(2).div(10).add(1) : x.add(1).pow(3)
                let b = hasElement(29) ? x.add(1).log2().pow(1.25).mul(0.01) : x.add(1).pow(2.5).log2().mul(0.01)
				if(player.ranks.hex.gte(29))b = x.add(1).log2().pow(2);
				if(hasElement(156)){
					a = a.pow(5);
					b = a;
					if(player.ranks.hex.gte(29))b = b.pow(2);
				}
				
				a = a.pow(galParticleEffect(0));
				b = b.pow(galParticleEffect(0));
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = hasElement(105) ? x.add(1).log10().add(1).log10().root(2).div(10).add(1) : x.add(1).pow(2)
                let b = player.ranks.hex.gte(19)
                ?player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(2).mul(x.max(1).log(2)).root(2.1))
                :hasElement(19)
                ?player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(10).mul(x.max(1).log(10)).root(2.75))
                :player.mass.max(1).log10().add(1).pow(player.rp.points.max(1).log(100).mul(x.max(1).log(100)).root(3))
				
				b = overflow(b,"ee28000000",0.5);
				
				a = a.pow(galParticleEffect(1));
				b = b.pow(galParticleEffect(1));
                return {eff1: a, eff2: b}
            },
            x=>{
                let a = hasElement(105) ? x.add(1).log10().add(1).log10().root(2).div(10).add(1) : x.add(1)
                let b = hasElement(30) ? x.add(1).log2().pow(1.2).mul(0.01) : x.add(1).pow(2).log2().mul(0.01)
				if(player.ranks.hex.gte(30))b = x.add(1).log2().pow(2);
				if(hasElement(346))b = a;
				
				a = a.pow(galParticleEffect(2));
				b = b.pow(galParticleEffect(2));
                return {eff1: a, eff2: b}
            },
        ],
        desc: [
            x=>{ return `
                Boosts Mass gain by ${hasElement(105)?"^"+format(x.eff1):format(x.eff1)+"x"}<br><br>`+
				(hasElement(156)?` Boosts Tickspeed Power by ^`+format(x.eff2):
                `Adds Tickspeed Power by ${format(x.eff2.mul(100))}%`)
			},
            x=>{ return `
                Boosts Rage Power gain by ${hasElement(105)?"^"+format(x.eff1):format(x.eff1)+"x"}<br><br>
                Makes Mass gain boosted by Rage Powers - ${format(x.eff2)}x<br><br>
            ` },
            x=>{ return `
                Boosts Dark Matter gain by ${hasElement(105)?"^"+format(x.eff1):format(x.eff1)+"x"}<br><br>`+
				(hasElement(346)?` Boosts BH Condenser Power by ^`+format(x.eff2):
                `Adds BH Condenser Power by ${format(x.eff2)}`)
            },
        ],
        colors: ['#0f0','#ff0','#f00'],
    },
}

const RATIO_MODE = [null, 0.25, 1]
const RATIO_ID = ["+1", '25%', '100%']

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

    let fp = tmp.fermions.effs[1][5]

    tmp.atom.gamma_ray_cost = E(2).pow(player.atom.gamma_ray.scaleEvery("gamma_ray",false,[1,1,1,fp])).floor()
    tmp.atom.gamma_ray_bulk = E(0)
    if (player.atom.points.gte(1)) tmp.atom.gamma_ray_bulk = player.atom.points.max(1).log(2).scaleEvery("gamma_ray",true,[1,1,1,fp]).add(1).floor()
    tmp.atom.gamma_ray_can = player.atom.points.gte(tmp.atom.gamma_ray_cost)
    tmp.atom.gamma_ray_bonus = ATOM.gamma_ray.bonus()
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
        <div style="width: 30%"><button class="btn" onclick="ATOM.particles.assign(${x})">Assign</button><br><br>
            <div style="color: ${ATOM.particles.colors[x]}; min-height: 120px">
                <h2><span id="particle_${x}_amt">X</span> ${ATOM.particles.names[x]}</h2><br>
                Which generates <span id="particle_${x}_amtEff">X</span> ${ATOM.particles.names[x]} Powers<br>
                You have <span id="particle_${x}_power">X</span> ${ATOM.particles.names[x]} Powers, which:
            </div><br><div id="particle_${x}_powerEff"></div>
        </div>
        `
    }
	particles_table.setHTML(table)
    let gparticles_table = new Element("gparticles_table")
	table = ""
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        table += `
        <div style="width: 30%"><button class="btn" onclick="ATOM.particles.gassign(${x})">Assign</button><br><br>
            <div style="color: ${ATOM.particles.colors[x]}; min-height: 120px">
                <h2><span id="gparticle_${x}_amt">X</span> Galactic ${ATOM.particles.names[x]}</h2><br>
				<span id="gparticle_${x}_eff"></div>
			</div><br>
        </div>
        `
    }
	gparticles_table.setHTML(table)
}

function updateAtomicHTML() {
    tmp.el.atomicAmt.setHTML(format(player.atom.atomic)+" "+formatGain(player.atom.atomic, tmp.atom.atomicGain.mul(tmp.preQUGlobalSpeed)))
	tmp.el.atomicEff.setHTML(format(tmp.atom.atomicEff,0)+(tmp.atom.atomicEff.gte(5e4)?" <span class='soft'>(softcapped)</span>":""))

	tmp.el.gamma_ray_lvl.setTxt(format(player.atom.gamma_ray,0)+(tmp.atom.gamma_ray_bonus.gte(1)?" + "+format(tmp.atom.gamma_ray_bonus,0):""))
	tmp.el.gamma_ray_btn.setClasses({btn: true, locked: !tmp.atom.gamma_ray_can})
	tmp.el.gamma_ray_scale.setTxt(getScalingName('gamma_ray'))
	tmp.el.gamma_ray_cost.setTxt(format(tmp.atom.gamma_ray_cost,0))
	tmp.el.gamma_ray_pow.setTxt(format(tmp.atom.gamma_ray_eff.pow))
	tmp.el.gamma_ray_eff.setHTML(format(tmp.atom.gamma_ray_eff.eff))
    tmp.el.gamma_ray_auto.setDisplay(hasElement(18))
	tmp.el.gamma_ray_auto.setTxt(player.atom.auto_gr?"ON":"OFF")
	
	
    tmp.el.atomicOverflow.setDisplay(tmp.atom.atomicGain.gte("ee3000"))
	tmp.el.atomicOverflow2.setTxt(format(tmp.atomicOverflow))
}

function updateAtomHTML() {
    tmp.el.atom_ratio.setTxt(RATIO_ID[player.atom.ratio])
    tmp.el.atom_ratio_gq.setTxt(RATIO_ID[player.atom.ratio])
    tmp.el.unassignQuarkAmt.setTxt(format(player.atom.quarks,0))
    tmp.el.unassignGQuarkAmt.setTxt(format(player.galQk,0))
    for (let x = 0; x < ATOM.particles.names.length; x++) {
        tmp.el["particle_"+x+"_amt"].setTxt(format(player.atom.particles[x],0))
        tmp.el["particle_"+x+"_amtEff"].setTxt(format(tmp.atom.particles[x].powerGain))
        tmp.el["particle_"+x+"_power"].setTxt(format(player.atom.powers[x])+" "+formatGain(player.atom.powers[x],tmp.atom.particles[x].powerGain.mul(tmp.preQUGlobalSpeed)))
        tmp.el["particle_"+x+"_powerEff"].setHTML(ATOM.particles.desc[x](tmp.atom.particles[x].powerEffect))
        tmp.el["gparticle_"+x+"_amt"].setTxt(format(player.galParticles[x],0))
        tmp.el["gparticle_"+x+"_eff"].setTxt("Which are raising "+ATOM.particles.names[x]+" Powers effect and gain by ^"+format(galParticleEffect(x)))
    }
}

function galParticleEffect(x){
	let ret=player.galParticles[x].add(1).log10().add(1).pow(3);
	ret=overflow(ret,1.2e5,5);
	ret=overflow(ret,5e5,3);
	ret=overflow(ret,1e7,0.2);
	//ret=ret.min(2e9);
	return ret;
}