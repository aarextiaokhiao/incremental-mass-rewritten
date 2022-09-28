var diff = 0;
var date = Date.now();
var player

const ST_NAMES = [
	null, [
		["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
		["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
		["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
	],[
		["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"],
		["","Me","Du","Tr","Te","Pe","He","Hp","Ot","En"],
		["","c","Ic","TCn","TeC","PCn","HCn","HpC","OCn","ECn"],
		["","Hc","DHe","THt","TeH","PHc","HHe","HpH","OHt","EHc"]
	]
]
const CONFIRMS = ['rp', 'bh', 'atom', 'sn', 'qu', 'br', 'inf', 'et']

const FORMS = {
    getPreQUGlobalSpeed() {
        let x = E(1)
        if (tmp.qu.mil_reached[1]) x = x.mul(10)
        if (quUnl()) x = x.mul(tmp.qu.bpEff)
        if (hasElement(103)) x = x.mul(tmp.elements.effect[103])
		if(hasTree('qc5')) x = x.mul(treeEff('qc5'));
		if (hasPrestige(0,60)) x = x.mul(prestigeEff(0,60,[E(1),E(1)])[0]);
		if (hasUpgrade('inf',9)) x = x.mul(upgEffect(5,9));
        if (hasElement(136)) x = x.mul(tmp.elements.effect[136])
		if (player.ranks.hept.gte(6)) x = x.mul(player.ranks.hept.add(1));
		x = x.mul(SUPERNOVA_GALAXY.effects.pqgs());
        if (player.mainUpg.br.includes(3)) x = x.pow(tmp.upgs.main[4][3].effect)
        if (hasPrestige(0,5)) x = x.pow(2)
		x = x.pow(calcShardsEffect())
	
        if (QCs.active()) x = x.div(tmp.qu.qc_eff[1])
		if (player.gc.active) x = GCeffect(x)
			
		return x
    },
    massGain() {
        let x = E(1)
        x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
        if (player.ranks.rank.gte(6)) x = x.mul(RANKS.effect.rank[6]())
        if (player.ranks.rank.gte(13)) x = x.mul(3)
        x = x.mul(tmp.tickspeedEffect.eff||E(1))
        if (player.bh.unl) x = x.mul(tmp.bh.effect)
        if (player.mainUpg.bh.includes(10)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][10].effect:E(1))
        x = x.mul(tmp.atom.particles[1].powerEffect.eff2)
        if (player.ranks.rank.gte(380)) x = x.mul(RANKS.effect.rank[380]())
        x = x.mul(tmp.stars.effect)
        if (hasTree("m1")) x = x.mul(tmp.supernova.tree_eff.m1)

        x = x.mul(tmp.bosons.effect.pos_w[0])
		
        x = x.mul(SUPERNOVA_GALAXY.effects.pqgs())
        if (!hasElement(105)) x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
        else x = x.pow(tmp.atom.particles[0].powerEffect.eff1)

		if (!hasElement(134)) x = x.mul(tmp.tickspeedEffect.eff||E(1))
        else x = x.pow(tmp.tickspeedEffect.eff||E(1))
	
        if (player.ranks.tier.gte(2)) x = x.pow(1.15)
        if (player.ranks.rank.gte(180)) x = x.pow(1.025)
        if (!(player.chal.active == 3)) x = x.pow(tmp.chal.eff[3])
        if (player.md.active || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) {
            x = expMult(x,tmp.md.pen)
            if (hasElement(28)) x = x.pow(1.5)
        }else{
            if (hasElement(28) && player.ranks.hex.gte(28)) x = x.pow(1.5)
		}
        if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
        if (player.ranks.hex.gte(36)) x = x.pow(tmp.stars.effectPower)
		if (hasUpgrade('bh',19)) x = x.pow(tmp.upgs.main?tmp.upgs.main[2][19].effect:E(1))
        if (hasUpgrade('br',20)) x = x.pow(tmp.upgs.main?tmp.upgs.main[4][20].effect:E(1))
		if (hasElement(213)) x = x.pow(tmp.chal.eff[20])
		
		x = x.pow(tmp.fermions.effs[2][2]||E(1))	
		
		
		x = x.pow(SUPERNOVA_GALAXY.galPow0_eff())
		
		if (CHALS.inChal(9) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("12")) x = expMult(x,0.9)
        x = x.softcap(tmp.massSoftGain,tmp.massSoftPower,0)
        .softcap(tmp.massSoftGain2,tmp.massSoftPower2,0)
        .softcap(tmp.massSoftGain3,tmp.massSoftPower3,0)
        .softcap(tmp.massSoftGain4,tmp.massSoftPower4,0)
        .softcap(tmp.massSoftGain5,tmp.massSoftPower5,0)
        .softcap(tmp.massSoftGain6,tmp.massSoftPower6,0)
        .softcap(tmp.massSoftGain7,tmp.massSoftPower7,0)
        .softcap(tmp.massSoftGain8,tmp.massSoftPower8,0)
        .softcap(tmp.massSoftGain9,tmp.massSoftPower9,0)

        if (hasElement(117)) x = x.pow(10)
		
		
		if (CHALS.inChal(20)) x = x.add(1).log10()
		
		if (player.gc.active) x = GCeffect(x)
	
		tmp.massOverflowStart = E("ee84")
		if (player.ranks.hex.gte(120))tmp.massOverflowStart = tmp.massOverflowStart.pow(10)
		if (hasUpgrade('rp',19))tmp.massOverflowStart = tmp.massOverflowStart.pow(10)
		if (hasElement(164))tmp.massOverflowStart = tmp.massOverflowStart.pow(tmp.chal.eff[15])
        if (hasPrestige(2,19))tmp.massOverflowStart = tmp.massOverflowStart.pow(tmp.bosons.effect.neg_w[0])
			
		if (CHALS.inChal(15) || CHALS.inChal(19))tmp.massOverflowStart = E(10)
		
		tmp.massOverflowPower = E(0.8)
		if (player.ranks.hept.gte(1))tmp.massOverflowPower = tmp.massOverflowPower.pow(RANKS.effect.hept[1]())
		if (CHALS.inChal(15) || CHALS.inChal(19))tmp.massOverflowPower = tmp.massOverflowPower.pow(12)
			
		tmp.massOverflow = overflow(x,tmp.massOverflowStart,tmp.massOverflowPower).log(x);
		x = overflow(x,tmp.massOverflowStart,tmp.massOverflowPower);
        return x
    },
    massSoftGain() {
        let s = E(1.5e156)
        if (CHALS.inChal(3) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("03")) s = s.div(1e150)
        if (CHALS.inChal(4) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("03")) s = s.div(1e100)
        if (player.mainUpg.bh.includes(7)) s = s.mul(tmp.upgs.main?tmp.upgs.main[2][7].effect:E(1))
        if (player.mainUpg.rp.includes(13)) s = s.mul(tmp.upgs.main?tmp.upgs.main[1][13].effect:E(1))
        if (hasPrestige(0,1)) s = s.pow(10)
        return s.min(tmp.massSoftGain2||1/0)
    },
    massSoftPower() {
        if (player.ranks.hex.gte(1)) return E(1)
        let p = E(1/3)
        if (CHALS.inChal(3) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("03")) p = p.mul(4)
        if (CHALS.inChal(7) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) ) p = p.mul(6)
        if (player.mainUpg.bh.includes(11)) p = p.mul(0.9)
        if (player.ranks.rank.gte(800)) p = p.mul(RANKS.effect.rank[800]())
        return E(1).div(p.add(1))
    },
    massSoftGain2() {
        let s = E('1.5e1000056')
        if (hasTree("m2")) s = s.pow(1.5)
        if (hasTree("m2")) s = s.pow(tmp.supernova.tree_eff.m3)
        if (player.ranks.tetr.gte(8)) s = s.pow(1.5)

        s = s.pow(tmp.bosons.effect.neg_w[0])
        if (hasPrestige(0,1)) s = s.pow(10)

        return s.min(tmp.massSoftGain3||1/0)
    },
    massSoftPower2() {
        if (player.ranks.hex.gte(4)) return E(1)
        let p = E(player.qu.rip.active ? 0.1 : 0.25)
        if (hasElement(51)) p = p.pow(0.9)
        if (player.prestiges[0].gte(51)) p = p.pow(0.5)
        return p
    },
    massSoftGain3() {
        let s = player.qu.rip.active ? uni("ee7") : uni("ee8")
        if (hasTree("m3")) s = s.pow(tmp.supernova.tree_eff.m3)
        s = s.pow(tmp.radiation.bs.eff[2])
        if (hasPrestige(0,1)) s = s.pow(10)
        if (hasPrestige(0,101)) s = s.pow(tmp.bosons.effect.neg_w[0])
        return s
    },
    massSoftPower3() {
        if (player.ranks.hex.gte(8)) return E(1)
        let p = E(player.qu.rip.active ? 0.1 : 0.2)
        if (hasElement(77)) p = p.pow(player.qu.rip.active?0.95:0.825)
        if (hasPrestige(0,80)) p = p.pow(0.9)
        if (hasPrestige(0,82)) p = p.pow(0.5)
        return p
    },
    massSoftGain4() {
        let s = mlt(player.qu.rip.active ? 0.1 : 1e4)
        if (player.ranks.pent.gte(8)) s = s.pow(RANKS.effect.pent[8]())
        if (hasTree('qc1')) s = s.pow(treeEff('qc1'))
        if (hasPrestige(0,1)) s = s.pow(10)
        if (hasPrestige(0,101)) s = s.pow(tmp.bosons.effect.neg_w[0])
        return s
    },
    massSoftPower4() {
        if (player.ranks.hex.gte(13)) return E(1)
        let p = E(0.1)
        if (hasElement(100)) p = p.pow(player.qu.rip.active?0.8:0.5)
        return p
    },
    massSoftGain5() {
        let s = mlt(player.qu.rip.active?1e4:1e12)
        if (hasPrestige(0,8)) s = s.pow(prestigeEff(0,8))
        if (hasUpgrade("br",12)) s = s.pow(upgEffect(4,12))
        if (hasPrestige(0,101)) s = s.pow(tmp.bosons.effect.neg_w[0])
        return s
    },
    massSoftPower5() {
        if (player.ranks.hex.gte(21)) return E(1)
        let p = E(0.05)
        return p
    },
    massSoftGain6() {
        let s = E("e1e29")
        if (hasPrestige(0,101)) s = s.pow(tmp.bosons.effect.neg_w[0])
        return s
    },
    massSoftPower6() {
        if (player.ranks.hex.gte(33)) return E(1)
        let p = E(0.1)
		if (hasUpgrade("inf",6)) p = p.pow(0.5);
        return p
    },
    massSoftGain7() {
        let s = E("e1e39")
        if (hasPrestige(0,140)) s = s.pow(tmp.bosons.effect.neg_w[0])
        return s
    },
    massSoftPower7() {
        if (player.ranks.hex.gte(54)) return E(1)
        let p = E(0.1)
		if (hasUpgrade("inf",6)) p = p.pow(0.5);
        return p
    },
    massSoftGain8() {
        let s = E("e1e54")
        return s
    },
    massSoftPower8() {
        if (player.ranks.hex.gte(64)) return E(1)
        let p = E(0.1)
		if (hasUpgrade("inf",10)) p = p.pow(0.5);
		if (hasUpgrade("inf",13)) p = p.pow(0.99);
        return p
    },
    massSoftGain9() {
        let s = E("e1e69")
        return s
    },
    massSoftPower9() {
        if (player.ranks.hex.gte(75)) return E(1)
        let p = E(0.1)
		if (hasUpgrade("inf",13)) p = p.pow(0.99);
        if (player.ranks.hex.gte(51)) p = p.pow(0.9);
        return p
    },
    tickspeed: {
        cost(x=player.tickspeed) { return E(2).pow(x).floor() },
        can() { return player.rp.points.gte(tmp.tickspeedCost) && !CHALS.inChal(2) && !CHALS.inChal(6) && !CHALS.inChal(10) && !CHALS.inChal(14) && !CHALS.inChal(19) },
        buy() {
            if (this.can()) {
                if (!player.mainUpg.atom.includes(2)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
                player.tickspeed = player.tickspeed.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!player.mainUpg.atom.includes(2)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
                player.tickspeed = tmp.tickspeedBulk
            }
        },
        effect() {
            let t = player.tickspeed
            if (hasElement(63)) t = t.mul(25)
            if (player.ranks.hex.gte(63)) t = t.mul(25)
            t = t.mul(tmp.prim.eff[1][1])
            t = t.mul(tmp.radiation.bs.eff[1])
            let bonus = E(0)
            if (player.atom.unl) bonus = bonus.add(tmp.atom.atomicEff)
            bonus = bonus.mul(getEnRewardEff(4))
            let step = E(1.5)
            step = step.add(tmp.chal.eff[6])
            step = step.add(tmp.chal.eff[2])
            if (!hasElement(156))step = step.add(tmp.atom.particles[0].powerEffect.eff2)
            if (player.ranks.tier.gte(4)) step = step.add(RANKS.effect.tier[4]())
            if (player.ranks.rank.gte(40)) step = step.add(RANKS.effect.rank[40]())
					
				
			step = step.mul(SUPERNOVA_GALAXY.effects.tsMult())
			
            step = step.mul(tmp.bosons.effect.z_boson[0])
            step = tmp.md.bd3 ? step.pow(tmp.md.mass_eff) : step.mul(tmp.md.mass_eff)
            step = step.pow(tmp.qu.chroma_eff[0])
            if (hasTree("t1")) step = step.pow(1.15)
            if (player.ranks.hex.gte(86)) step = step.pow(2)
			if (hasElement(134) && hasElement(137)) step = step.pow(tmp.accelEffect.eff||1)
			if (hasElement(156))step = step.pow(tmp.atom.particles[0].powerEffect.eff2)
               
		   
			step = step.pow(SUPERNOVA_GALAXY.effects.ts())
            let ss = E(1e50).mul(tmp.radiation.bs.eff[13])
            let p = 0.1
            if (hasElement(86)) {
                ss = ss.pow(2)
                p **= 0.5
            }
            if (hasPrestige(0,6)) ss = ss.pow(100)
            if (hasElement(102)) ss = ss.pow(100)
			if (hasUpgrade('rp',16)) ss = EINF
            else step = step.softcap(ss,p,0)
            
			if(FERMIONS.onActive("25")||FERMIONS.onActive("35"))step = step.log10().add(1)
			
            let eff = step.pow(t.add(bonus).mul(hasElement(80)?25:1))
            if (hasElement(18) && !hasElement(134)) eff = eff.pow(tmp.elements.effect[18])
            if (player.ranks.tetr.gte(3) && !hasElement(134)) eff = eff.pow(1.05)
		
			let eff_bottom = eff
			if (hasElement(134)){
				eff = eff.add(9).log10().add(9).log10().pow(tmp.accelEffect.eff.mul(0.1));
				eff_bottom = eff_bottom.pow(tmp.accelEffect.eff);
				if (player.ranks.tetr.gte(3)) eff = eff.pow(1.05),eff_bottom = eff_bottom.pow(1.05);
			}
			
            return {step: step, eff: eff, bonus: bonus, ss: ss, eff_bottom: eff_bottom}
        },
        autoUnl() { return player.mainUpg.bh.includes(5) },
        autoSwitch() { player.autoTickspeed = !player.autoTickspeed },
    },
    accel: {
        cost(x=player.accelerator) { return Decimal.pow(10,Decimal.pow(1.5,x)).floor() },
        can() { return player.rp.points.gte(tmp.accelCost) },
        buy() {
            if (this.can()) {
                player.accelerator = player.accelerator.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                player.accelerator = tmp.accelBulk
            }
        },
        effect() {
			let step = E(0.0004)
			if(hasElement(135))step = step.mul(tmp.elements.effect[135])
            if (player.ranks.hex.gte(124)) step = step.mul(RANKS.effect.hex[124]())
            if (player.ranks.hex.gte(126)) step = step.mul(RANKS.effect.hex[126]())
            if (player.ranks.hex.gte(140)) step = step.mul(RANKS.effect.hex[140]())
			if(hasPrestige(1,33))step = step.mul(prestigeEff(1,33)||1)
			if (hasUpgrade('atom',20)) step = step.mul(upgEffect(3,20))
			if (hasUpgrade('rp',20)) step = step.mul(upgEffect(1,20))
            if (player.ranks.hept.gte(4)) step = step.mul(RANKS.effect.hept[4]())
			
			step = step.mul(SUPERNOVA_GALAXY.effects.apMult())
            let x = player.accelerator.mul(step).add(1)
			
            let ss = E(100)
            let p = 0.5
            let ss2 = E(200)
            let p2 = 0.1
			
			if(hasElement(253))p = p ** 0.7, p2 = p2 ** 0.7
			
			ss = ss.mul(SUPERNOVA_GALAXY.effects.aesc())
			
			ss2 = ss2.mul(SUPERNOVA_GALAXY.effects.aesc())
			
			
			
			ss = ss.mul(tmp.fermions.effs[3][2]||E(1))	
		
		
			ss2 = ss2.mul(tmp.fermions.effs[3][2]||E(1))
			
			if(player.ranks.oct.gte(9))ss2 = ss2.mul(2.5)
			if(player.ranks.oct.gte(9))p2 = p2 ** 0.9
			if(player.ranks.oct.gte(21))ss2 = ss2.mul(2)
			if(player.ranks.oct.gte(21))p2 = p2 ** 0.9
			x = overflow(overflow(x,ss,p),ss2,p2)
			
			return {step: step, eff: x,  ss: ss}
        },
        autoUnl() { return true },
        autoSwitch() { player.autoAccel = !player.autoAccel },
    },
    rp: {
        gain() {
            if (player.mass.lt(1e15) || CHALS.inChal(7) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19)) return E(0)
            let gain = player.mass.div(1e15).root(3)
            if (player.ranks.rank.gte(14)) gain = gain.mul(2)
            if (player.ranks.rank.gte(45)) gain = gain.mul(RANKS.effect.rank[45]())
            if (player.ranks.tier.gte(6)) gain = gain.mul(RANKS.effect.tier[6]())
            if (player.mainUpg.bh.includes(6)) gain = gain.mul(tmp.upgs.main?tmp.upgs.main[2][6].effect:E(1))
            if (hasTree("rp1")) gain = gain.mul(tmp.supernova.tree_eff.rp1)

            if (!hasElement(105)) gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
            else gain = gain.pow(tmp.atom.particles[1].powerEffect.eff1)

            if (player.mainUpg.bh.includes(8)) gain = gain.pow(1.15)
            gain = gain.pow(tmp.chal.eff[4])
            if (CHALS.inChal(4) || CHALS.inChal(10) || CHALS.inChal(14)  || CHALS.inChal(19) || FERMIONS.onActive("03")) gain = gain.root(10)
            gain = gain.pow(tmp.prim.eff[1][0])

			gain = gain.pow(SUPERNOVA_GALAXY.effects.rp())
            if (QCs.active()) gain = gain.pow(tmp.qu.qc_eff[4])
		 gain = gain.pow(tmp.fermions.effs[2][3]||E(1))	
            if (player.md.active || CHALS.inChal(10) || CHALS.inChal(14)  || CHALS.inChal(19) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) gain = expMult(gain,tmp.md.pen)
            
		
			if (FERMIONS.onActive("23"))gain = gain.add(1).log10()
				
			if (player.gc.active) gain = GCeffect(gain)
			return gain.floor()
        },
        reset() {
            if (tmp.rp.can) if (player.confirms.rp?confirm("Are you sure to reset?"):true) {
                player.rp.points = player.rp.points.add(tmp.rp.gain)
                player.rp.unl = true
                this.doReset()
            }
        },
        doReset() {
            player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
            RANKS.doReset[RANKS.names[RANKS.names.length-1]]()
        },
    },
    bh: {
        see() { return player.rp.unl },
        DM_gain() {
            let gain = player.rp.points.div(1e20)
            if (CHALS.inChal(7) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19)) gain = player.mass.div(1e180)
            if (gain.lt(1)) return E(0)
            gain = gain.root(4)

            if (hasTree("bh1")) gain = gain.mul(tmp.supernova.tree_eff.bh1)
            gain = gain.mul(tmp.bosons.upgs.photon[0].effect)

            if (CHALS.inChal(7) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19)) gain = gain.root(6)
            if (!hasElement(105)) gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
            else gain = gain.pow(tmp.atom.particles[2].powerEffect.eff1)
            if (CHALS.inChal(8) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("12")) gain = gain.root(8)
            gain = gain.pow(tmp.chal.eff[8])
            gain = gain.pow(tmp.prim.eff[2][0])

            if (QCs.active()) gain = gain.pow(tmp.qu.qc_eff[4])
            if (player.md.active || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) gain = expMult(gain,tmp.md.pen)
				
			
			if (FERMIONS.onActive("32"))gain = gain.add(1).log10().pow(5)
				
			
			if (player.gc.active) gain = GCeffect(gain)
				
            return gain.floor()
        },
        massPowerGain() {
            let x = E(0.33)
            if (FERMIONS.onActive("11")) return E(-1)
            if (hasElement(59)) x = E(0.45)
            if (player.ranks.hex.gte(59)) x = E(0.5)
            x = x.add(tmp.radiation.bs.eff[4])
            return x
        },
        massGain() {
            let x = tmp.bh.f
            .mul(this.condenser.effect().eff)
            if (player.mainUpg.rp.includes(11)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][11].effect:E(1))
            if (player.mainUpg.bh.includes(14)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][14].effect:E(1))
            if (hasElement(46) && !player.ranks.hex.gte(46)) x = x.mul(tmp.elements.effect[46])
            x = x.mul(tmp.bosons.upgs.photon[0].effect)
            if (CHALS.inChal(8) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("12")) x = x.root(8)
            x = x.pow(tmp.chal.eff[8])

            if (QCs.active()) x = x.pow(tmp.qu.qc_eff[4])
            if (hasElement(46) && player.ranks.hex.gte(46)) x = x.pow(tmp.elements.effect[46])
				
			
		 x = x.pow(SUPERNOVA_GALAXY.effects.bh())
		x = x.pow(SUPERNOVA_GALAXY.galPow2_eff())
		
            if (player.md.active || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) x = expMult(x,tmp.md.pen)
            x = x.softcap(tmp.bh.massSoftGain, tmp.bh.massSoftPower, 0)
			
			if (FERMIONS.onActive("31")) x = x.add(1).log10().pow(100)
			
		
			if (player.gc.active) x = GCeffect(x)
				
			tmp.bhOverflowStart = E("e1e34")
			if (hasUpgrade('bh',16))tmp.bhOverflowStart = tmp.bhOverflowStart.pow(10)
			if (CHALS.inChal(15) || CHALS.inChal(19))tmp.bhOverflowStart = E(10)
			
			let x_original = x
			if(!hasElement(327))x = overflow(x,tmp.bhOverflowStart,CHALS.inChal(19)?0.04:CHALS.inChal(15)?0.05:(hasElement(262)?0.9:hasElement(241)?0.82:hasUpgrade('bh',20)?0.81:0.8));
			let bhOverflowStart2 = tmp.bhOverflowStart.pow(1e65);
			if(x.gte(bhOverflowStart2)){
				x = x.log10().log10().div(bhOverflowStart2.log10().log10()).pow(0.8).mul(bhOverflowStart2.log10().log10());
				x = Decimal.pow(10,x);x = Decimal.pow(10,x);
			}
			if(x.gte("eee10")){
				x = Decimal.tetrate(10,x.slog().sub(4).div(1.1).add(4));
			}
			tmp.bhOverflow = x.log(x_original);
		    if(hasElement(327))tmp.bhOverflow = x.add(100).log10().log(x_original.add(100).log10());
			return x
        },
        f() {
            let x = player.bh.mass.add(1).pow(tmp.bh.massPowerGain).softcap(tmp.bh.fSoftStart,tmp.bh.fSoftPower,2)
			return x
        },
        fSoftStart() {
            let x = uni("e3e9")
            if (hasElement(71)) x = x.pow(tmp.elements.effect[71])
            x = x.pow(tmp.radiation.bs.eff[20])
            return x
        },
        fSoftPower() {
			if(hasUpgrade('bh',17)) return 1
            let x = 0.95
            if (hasTree("qu3")) x **= 0.7
            return x
        },
        massSoftGain() {
            let s = E(1.5e156)
            if (player.mainUpg.atom.includes(6)) s = s.mul(tmp.upgs.main?tmp.upgs.main[3][6].effect:E(1))
            return s
        },
        massSoftPower() {
            let p = E(0.5)
			if(hasUpgrade('bh',17)) p = p.pow(0.9)
			if(player.ranks.hex.gte(71)) p = p.pow(RANKS.effect.hex[71]())
			return p
        },
        reset() {
            if (tmp.bh.dm_can) if (player.confirms.bh?confirm("Are you sure to reset?"):true) {
                player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain)
                player.bh.unl = true
                this.doReset()
            }
        },
        doReset() {
            let keep = []
            for (let x = 0; x < player.mainUpg.rp.length; x++) if ([3,5,6].includes(player.mainUpg.rp[x])) keep.push(player.mainUpg.rp[x])
            player.mainUpg.rp = keep
            player.rp.points = E(0)
            player.tickspeed = E(0)
            player.accelerator = E(0)
            player.bh.mass = E(0)
            FORMS.rp.doReset()
        },
        effect() {
            let x = player.mainUpg.atom.includes(12)
            ?player.bh.mass.add(1).pow(1.25)
            :player.bh.mass.add(1).root(4)
            if (hasElement(89)) x = x.pow(tmp.elements.effect[89])
            return x
        },
        condenser: {
            autoSwitch() { player.bh.autoCondenser = !player.bh.autoCondenser },
            autoUnl() { return player.mainUpg.atom.includes(2) },
            can() { return player.bh.dm.gte(tmp.bh.condenser_cost) && !CHALS.inChal(6)  && !CHALS.inChal(10) && !CHALS.inChal(14) && !CHALS.inChal(19)},
            buy() {
                if (this.can()) {
                    player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
                    player.bh.condenser = player.bh.condenser.add(1)
                }
            },
            buyMax() {
                if (this.can()) {
                    player.bh.condenser = tmp.bh.condenser_bulk
                    player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
                }
            },
            effect() {
                let t = player.bh.condenser
                t = t.mul(tmp.radiation.bs.eff[5])
                let pow = E(2)
                    pow = pow.add(tmp.chal.eff[6])
                    if (player.mainUpg.bh.includes(2)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[2][2].effect:E(1))
                    pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
                    if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
                    pow = pow.mul(tmp.bosons.upgs.photon[1].effect)
                    pow = pow.mul(tmp.prim.eff[2][1])
                    pow = pow.mul(getEnRewardEff(3)[1])
                    if (hasTree('bs5')) pow = pow.mul(tmp.bosons.effect.z_boson[0])
                    if (hasTree("bh2")) pow = pow.pow(1.15)
                    if (hasElement(346))pow = pow.pow(tmp.atom.particles[2].powerEffect.eff2)
                
                let eff = pow.pow(t.add(tmp.bh.condenser_bonus))
                return {pow: pow, eff: eff}
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.bh.includes(15)) x = x.add(tmp.upgs.main?tmp.upgs.main[2][15].effect:E(0))
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
    },
    reset_msg: {
        msgs: {
            rp: "Require over 1e9 tonne of mass to reset previous features for gain Rage Powers",
            dm: "Require over 1e20 Rage Power to reset all previous features for gain Dark Matters",
            atom: "Require over 1e100 uni of black hole to reset all previous features for gain Atoms & Quarks",
            md: "Dilate mass, then cancel",
            br: "Big Rip the Dimension, then go back",
            eternity: "Require over 1e2000 of Pre-Quantum Global Speed to become Eternal",
        },
        set(id) {
            if (id=="sn") {
                player.reset_msg = "Reach over "+format(tmp.supernova.maxlimit)+" collapsed stars to be Supernova"
				if (player.supernova.times.gte(SUPERNOVA_GALAXY.req()) && !hasElement(291)) player.reset_msg = "You reached the maximum Supernova limit!";
                return
            }
            if (id=="superGal") {
                player.reset_msg = "Reach over "+format(SUPERNOVA_GALAXY.req())+" Supernova to get a Supernova Galaxy"
                return
            }
            if (id=="qu") {
                player.reset_msg = "Require over "+formatMass(mlt(1e4))+" of mass to "+(QCs.active()?"complete Quantum Challenge":"go Quantum")
                return
            }
            if (id=="infinity") {
                player.reset_msg = "Require over "+format(E(Number.MAX_VALUE))+" of Quantum Foam to go Infinity"
                return
            }
            player.reset_msg = this.msgs[id]
        },
        reset() { player.reset_msg = "" },
    },
}

function loop() {
    diff = Date.now()-date;
    ssf[1]()
    updateTemp()
    updateHTML()
    calc(diff/1000*tmp.offlineMult,diff/1000);
    date = date+diff;
    player.offline.current = date
}

function format(ex, acc=4, max=12, type=player.options.notation) {
    ex = E(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + 'Infinity'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()
    switch (type) {
        case "sc":
            if (ex.log10().lt(Math.min(-acc,0)) && acc > 1) {
                let e = ex.log10().ceil()
                let m = ex.div(e.eq(-1)?E(0.1):E(10).pow(e))
                let be = e.mul(-1).max(1).log10().gte(9)
                return neg+(be?'':m.toFixed(4))+'e'+format(e, 0, max, "sc")
            } else if (e.lt(max)) {
                let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
                return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
            } else {
                if (ex.gte("eeee10")) {
                    let slog = ex.slog()
                    return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + format(slog.floor(), 0)
                }
                let m = ex.div(E(10).pow(e))
                let be = e.log10().gte(9)
                return neg+(be?'':m.toFixed(4))+'e'+format(e, 0, max, "sc")
            }
        case "st":
            let e3 = ex.log(1e3).floor()
			if (e3.lt(1)) {
				return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
			} else {
				let e3_mul = e3.mul(3)
				let ee = e3.log10().floor()
				if (ee.gte(3000)) return "e"+format(e, acc, max, "st")

				let final = ""
				if (e3.lt(4)) final = ["", "K", "M", "B"][Math.round(e3.toNumber())]
				else {
					let ee3 = Math.floor(e3.log(1e3).toNumber())
					if (ee3 < 100) ee3 = Math.max(ee3 - 1, 0)
					e3 = e3.sub(1).div(E(10).pow(ee3*3))
					while (e3.gt(0)) {
						let div1000 = e3.div(1e3).floor()
						let mod1000 = e3.sub(div1000.mul(1e3)).floor().toNumber()
						if (mod1000 > 0) {
							if (mod1000 == 1 && !ee3) final = "U"
							if (ee3) final = FORMATS.standard.tier2(ee3) + (final ? "-" + final : "")
							if (mod1000 > 1) final = FORMATS.standard.tier1(mod1000) + final
						}
						e3 = div1000
						ee3++
					}
				}

				let m = ex.div(E(10).pow(e3_mul))
				return neg+(ee.gte(10)?'':(m.toFixed(E(3).sub(e.sub(e3_mul)).add(acc==0?0:1).toNumber()))+' ')+final
			}
        default:
            return neg+FORMATS[type].format(ex, acc, max)
    }
}

function turnOffline() { player.offline.active = !player.offline.active }
function turnMassDisplay() { player.mass_display = ((player.mass_display || 0) + 1) % 4 }
function turnShowSupernova() { player.show_supernova = ((player.show_supernova || 0) + 1) % 2 }

const ARV = ['mlt','mgv','giv','tev','pev','exv','zev','yov']

function getMltValue(mass){
	mass = E(mass);
	if(mass.lte(1e50)){
		return mass.div(1.5e56).mul(Decimal.log10(Decimal.exp(1))).div(1e9);
	}else{
		return mass.div(1.5e56).add(1).log10().div(1e9);
	}
}
function formatARV(ex,gain=false) {
    let mlt = getMltValue(ex);
    if (gain) mlt = ex
    let arv = mlt.log10().div(15).floor()
	if (player.mass_display == 3)arv = E(0)
	if(arv.add(2).gte(1000))return format(mlt.log10().div(15).add(2))+" arvs";
    return format(mlt.div(Decimal.pow(1e15,arv))) + " " + (arv.gte(8)?"arv^"+format(arv.add(2),0):ARV[arv.toNumber()])
}

function formatMass(ex) {
    ex = E(ex)
	if (player.mass_display == 1)return format(ex) + ' g'
	if (player.mass_display == 2)return format(ex.div(1.5e56)) + ' uni'
	if (player.mass_display == 3)return formatARV(ex)
    if (ex.gte(E(1.5e56).mul('ee9'))) return formatARV(ex)
    if (ex.gte(1.5e56)) return format(ex.div(1.5e56)) + ' uni'
    if (ex.gte(2.9835e45)) return format(ex.div(2.9835e45)) + ' MMWG'
    if (ex.gte(1.989e33)) return format(ex.div(1.989e33)) + ' M☉'
    if (ex.gte(5.972e27)) return format(ex.div(5.972e27)) + ' M⊕'
    if (ex.gte(1.619e20)) return format(ex.div(1.619e20)) + ' MME'
    if (ex.gte(1e6)) return format(ex.div(1e6)) + ' tonne'
    if (ex.gte(1e3)) return format(ex.div(1e3)) + ' kg'
    if (ex.gte(1)) return format(ex) + ' g'
    if (ex.gte(1e-3)) return format(ex.div(1e-3)) + ' mg'
    if (ex.gte(1e-6)) return format(ex.div(1e-6)) + ' μg'
    if (ex.gte(1e-9)) return format(ex.div(1e-9)) + ' ng'
    return format(ex.div(1.66053886e-24)) + ' u'
}

function formatGain(amt, gain, isMass=false) {
    let f = isMass?formatMass:format
    let next = amt.add(gain)
    let rate
    let ooms = next.max(1).log10().div(amt.max(1).log10())
    if (((ooms.gte(10) && amt.gte('ee100')) || ooms.gte(10**0.05) && amt.gte('ee1000')) && (!isMass || player.mass_display == 1 || player.mass_display == 2)) {
        ooms = ooms.log10().mul(20)
        rate = "(+"+format(ooms) + " OoMs^2/sec)"
    }else{
		ooms = next.div(amt)
		if ((ooms.gte(10) && amt.gte(1e100)) || (isMass && player.mass_display == 3)) {
        ooms = ooms.log10().mul(20)
        if (isMass && ((amt.gte(mlt(1)) && ooms.gte(1e6)) || player.mass_display == 3) && player.mass_display != 1 && player.mass_display != 2){
			let mlt_amt = getMltValue(amt)
			let mlt_next = getMltValue(amt.add(gain.div(20)))
			rate = "(+"+formatARV(mlt_next.sub(mlt_amt).mul(20),true) + "/sec)"
		}
        else rate = "(+"+format(ooms) + " OoMs/sec)"
		if (player.mass_display == 0 && isMass){
			let arv_amt = getMltValue(amt).log10().div(15);
			let arv_next = getMltValue(amt.add(gain.div(20))).log10().div(15);
			if (getMltValue(gain).log10().div(15).gte(1000) || arv_next.sub(arv_amt).gte(10))rate = "(+"+format(arv_next.sub(arv_amt).mul(20)) + " arvs/sec)"
		}
    }
    else rate = "(+"+f(gain)+"/sec)"
	}
    return rate
}

function formatTime(ex,acc=2,type="s") {
    ex = E(ex)
    if (ex.gte(86400)) return format(ex.div(86400).floor(),0,12,"sc")+":"+formatTime(ex.mod(86400),acc,'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0,12,"sc")+":"+formatTime(ex.mod(3600),acc,'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0,12,"sc")+":"+formatTime(ex.mod(60),acc,'m')
    return (ex.gte(10)||type!="m" ?"":"0")+format(ex,acc,12,"sc")
}

function formatReduction(ex) { ex = E(ex); return format(E(1).sub(ex).mul(100))+"%" }

function formatPercent(ex) { ex = E(ex); return format(ex.mul(100))+"%" }

function formatMult(ex,acc=4) { ex = E(ex); return ex.gte(1)?"×"+ex.format(acc):"/"+ex.pow(-1).format(acc)}

function expMult(a,b,base=10) { return E(a).gte(1) ? E(base).pow(E(a).log(base).pow(b)) : E(0) }

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}