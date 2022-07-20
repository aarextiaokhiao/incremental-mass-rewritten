var diff = 0;
var date = Date.now();
var player

const CONFIRMS = ['rp', 'bh', 'atom', 'sn', 'ext', 'ec', 'pres']
const CONFIRMS_PNG = {
	rp: "rp",
	bh: "dm",
	atom: "atom",
	sn: "sn",
	ext: "ext",
	ec: "chal_ext",
	pres: "six"
}
const CONFIRMS_UNL = {
	rp: () => player.rp.unl && !EXT.unl(),
	bh: () => player.bh.unl && !EXT.unl(),
	atom: () => player.atom.unl && !EXT.unl(),
	sn: () => player.supernova.unl,
	ext: () => EXT.unl(),
	ec: () => GLUBALL.unl(),
	pres: () => PRES.unl()
}

const FORMS = {
	baseMassGain() {
		let x = E(1)
		x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
		if (hasRank("rank", 6)) x = x.mul(RANKS.effect.rank[6]())
		if (hasRank("rank", 13)) x = x.mul(3)
		x = x.mul(tmp.tickspeedEffect.eff||E(1))
		if (player.bh.unl) x = x.mul(tmp.bh.effect)
		if (hasUpgrade('bh',10)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][10].effect:E(1))
		x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
		x = x.mul(tmp.atom.particles[1].powerEffect.eff2)
		if (hasRank("rank", 380)) x = x.mul(RANKS.effect.rank[380]())
		x = x.mul(tmp.stars.effect.eff)
		if (hasTree("m1")) x = x.mul(treeEff("m1"))
		x = x.mul(tmp.bosons.effect.pos_w[0])
		if (GLUBALL.got("s2_2")) x = x.mul(GLUBALL.eff("s2_2"))

		return x
	},
	massGain() {
		let exp = E(1)
		if (hasRank("tier", 2)) exp = exp.mul(1.15)
		if (hasRank("rank", 180)) exp = exp.mul(1.025)
		if (!CHALS.inChal(3)) exp = exp.mul(tmp.chal.eff[3])
		if (tmp.md.active && hasElement(28)) exp = exp.mul(1.5)
		if (GLUBALL.got("p2_1")) exp = exp.mul(GLUBALL.eff("p2_1"))

		let x = this.baseMassGain().pow(exp)
		if (tmp.md.active) x = MASS_DILATION.applyDil(x)
		if (CHALS.inChal(9) || FERMIONS.onActive("12")) x = expMult(x,0.9)

		return x.softcap(tmp.massSoftGain1,tmp.massSoftPower1,0).softcap(tmp.massSoftGain2,tmp.massSoftPower2,0).softcap(tmp.massSoftGain3,tmp.massSoftPower3,0)
	},
	massSoftGain() {
		let s = E(1.5e156)
		if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e150)
		if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e100)
		if (hasUpgrade('bh',7)) s = s.mul(tmp.upgs.main?tmp.upgs.main[2][7].effect:E(1))
		if (hasUpgrade('rp',13)) s = s.mul(tmp.upgs.main?tmp.upgs.main[1][13].effect:E(1))
		return s.min(tmp.massSoftGain2||1/0)
	},
	massSoftPower() {
		let p = E(1/3)
		if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) p = p.mul(4)
		if (CHALS.inChal(7) || CHALS.inChal(10)) p = p.mul(6)
		if (hasUpgrade('bh',11)) p = p.mul(0.9)
		if (hasRank("rank", 800)) p = p.mul(RANKS.effect.rank[800]())
		return E(1).div(p.add(1))
	},
	massSoftGain2() {
		let s = E('1.5e1000056')
		if (hasTree("m2")) s = s.pow(1.5)
		if (hasTree("m2")) s = s.pow(treeEff("m3"))
		if (hasRank("tetr", 8)) s = s.pow(1.5)
		s = s.pow(tmp.bosons.effect.neg_w[0])
		return s.min(tmp.massSoftGain3||1/0)
	},
	massSoftPower2() {
		let p = E(0.25)
		if (hasElement(51)) p = p.pow(0.9)
		return p
	},
	massSoftGain3() {
		let s = uni("ee8")
		if (hasTree("m3")) s = s.pow(treeEff("m3"))
		s = s.pow(tmp.radiation.bs.eff[2])
		return s
	},
	massSoftPower3() {
		let p = E(0.2)
		return p
	},
	tickspeed: {
		cost(x=player.tickspeed) { return E(2).pow(x).floor() },
		can() { return player.rp.points.gte(tmp.tickspeedCost) && !CHALS.inChal(2) && !CHALS.inChal(6) && !CHALS.inChal(10) },
		buy() {
			if (this.can()) {
				if (!hasUpgrade('atom',2) && !hasTree("qol_ext5")) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
				player.tickspeed = player.tickspeed.add(1)
			}
		},
		buyMax() { 
			if (this.can()) {
				if (!hasUpgrade('atom',2) && !hasTree("qol_ext5")) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
				player.tickspeed = tmp.tickspeedBulk
			}
		},
		effect() {
			let t = player.tickspeed
			if (!scalingToned("tickspeed") && hasElement(63)) t = t.mul(25)
			t = t.mul(tmp.radiation.bs.eff[1])

			let bonus = E(0)
			if (player.atom.unl) bonus = bonus.add(tmp.atom.atomicEff)
			let step = E(1.5)
				step = step.add(tmp.chal.eff[6])
				step = step.add(tmp.chal.eff[2])
				step = step.add(tmp.atom.particles[0].powerEffect.eff2)
				if (hasRank("tier", 4)) step = step.add(RANKS.effect.tier[4]())
				if (hasRank("rank", 40)) step = step.add(RANKS.effect.rank[40]())
				step = step.mul(tmp.md.mass_eff)
			step = step.mul(tmp.bosons.effect.z_boson[0])
			if (hasTree("t1")) step = step.pow(1.15)
			if (AXION.unl()) step = step.pow(tmp.ax.eff[19])
			if (hasTree("ext_u2") && hasElement(18)) step = step.pow(tmp.elements.effect[18])

			let ss = E(1e50).mul(tmp.radiation.bs.eff[13])
			if (scalingToned("tickspeed")) ss = EINF
			else if (scalingToned("tickspeed")) step = step.softcap(ss,0.1,0)
			
			let eff = step.pow(t.add(bonus))
			if (!hasTree("ext_u2") && hasElement(18)) eff = eff.pow(tmp.elements.effect[18])
            if (bosonsMastered()) eff = eff.pow(tmp.bosons.upgs.photon[0].effect)
			if (hasRank("tetr", 3)) eff = eff.pow(1.05)
			return {step: step, eff: eff, bonus: bonus, ss: ss}
		},
		autoUnl() { return hasUpgrade('bh',5) },
		autoSwitch() { player.autoTickspeed = !player.autoTickspeed },
	},
	rp: {
		gain() {
			if (player.mass.lt(1e15) || CHALS.inChal(7) || CHALS.inChal(10)) return E(0)
			let gain = player.mass.div(1e15).root(3)
			if (hasRank("rank", 14)) gain = gain.mul(2)
			if (hasRank("rank", 45)) gain = gain.mul(RANKS.effect.rank[45]())
			if (hasRank("tier", 6)) gain = gain.mul(RANKS.effect.tier[6]())
			if (hasUpgrade('bh',6)) gain = gain.mul(tmp.upgs.main?tmp.upgs.main[2][6].effect:E(1))
			gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
			if (hasTree("rp1")) gain = gain.mul(treeEff("rp1"))
			if (hasUpgrade('bh',8)) gain = gain.pow(1.15)
			gain = gain.pow(tmp.chal.eff[4])
			if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) gain = gain.root(10)
			if (tmp.md.active) gain = MASS_DILATION.applyDil(gain)
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
			if (CHALS.inChal(7) || CHALS.inChal(10)) gain = player.mass.div(1e180)
			if (gain.lt(1)) return E(0)
			gain = gain.root(4)

			if (hasTree("bh1")) gain = gain.mul(treeEff("bh1"))
			if (!bosonsMastered()) gain = gain.mul(tmp.bosons.upgs.photon[0].effect)

			if (CHALS.inChal(7) || CHALS.inChal(10)) gain = gain.root(6)
			gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
			if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) gain = gain.root(8)
			gain = gain.pow(tmp.chal.eff[8].dm)
			if (tmp.md.active && !CHALS.inChal(12)) gain = MASS_DILATION.applyDil(gain)
			return gain.floor()
		},
		massPowerGain() {
			let x = E(0.33)
			if (FERMIONS.onActive("11")) return E(-1)
			if (hasElement(59)) x = E(0.45)
			x = x.add(tmp.radiation.bs.eff[4])
			return x
		},
		massGain() {
			let x = player.bh.mass.add(1).pow(tmp.bh.massPowerGain).mul(this.condenser.effect().eff)
			if (hasUpgrade('rp',11)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][11].effect:E(1))
			if (hasUpgrade('bh',14)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][14].effect:E(1))
			if (hasElement(46)) x = x.mul(tmp.elements.effect[46])
			if (!bosonsMastered()) x = x.mul(tmp.bosons.upgs.photon[0].effect)
			if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) x = x.root(8)
			x = x.pow(tmp.chal.eff[8].bh)
			if (tmp.md.active && !CHALS.inChal(12)) x = MASS_DILATION.applyDil(x)
			return x.softcap(tmp.bh.massSoftGain, tmp.bh.massSoftPower, 0)
		},
		massSoftGain() {
			let s = E(1.5e156)
			if (hasUpgrade('atom',6)) s = s.mul(tmp.upgs.main?tmp.upgs.main[3][6].effect:E(1))
			return s
		},
		massSoftPower() {
			return E(0.5)
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
			if (GLUBALL.got("t1_1") && GLUBALL.eff("t1_1").gt(0)) player.bh.mass = expMult(player.bh.mass,GLUBALL.eff("t1_1"))
			else player.bh.mass = E(0)
			FORMS.rp.doReset()
		},
		effect() {
			let x = hasUpgrade('atom',12)
			?player.bh.mass.add(1).pow(1.25)
			:player.bh.mass.add(1).root(4)
			if (AXION.unl()) x = x.pow(tmp.ax.eff[21])
			return x
		},
		condenser: {
			autoSwitch() { player.bh.autoCondenser = !player.bh.autoCondenser },
			autoUnl() { return hasUpgrade('atom',2) },
			can() { return player.bh.dm.gte(tmp.bh.condenser_cost) && !CHALS.inChal(6) && !CHALS.inChal(10) },
			buy() {
				if (CHALS.inChal(14)) return
				if (this.can()) {
					if (!hasTree("qol_ext5")) player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
					player.bh.condenser = player.bh.condenser.add(1)
				}
			},
			buyMax() {
				if (CHALS.inChal(14)) return
				if (this.can()) {
					if (!hasTree("qol_ext5")) player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
					player.bh.condenser = tmp.bh.condenser_bulk
				}
				buyExtraBuildings("bh",2)
				buyExtraBuildings("bh",3)
			},
			effect() {
				let t = player.bh.condenser
				if (!scalingToned("bh_condenser")) t = t.mul(tmp.radiation.bs.eff[5])
				let pow = E(2)
					pow = pow.add(tmp.chal.eff[6])
					if (hasUpgrade('bh',2)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[2][2].effect:E(1))
					pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
					if (hasUpgrade('atom',11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
					if (!bosonsMastered()) pow = pow.mul(tmp.bosons.upgs.photon[1].effect)
					if (hasTree("bh2")) pow = pow.pow(1.15)
					if (hasRank("pent", 50)) pow = pow.pow(RANKS.effect.pent[50]())
				let eff = pow.pow(t.add(tmp.bh.condenser_bonus))
				return {pow: pow, eff: eff}
			},
			bonus() {
				if (CHALS.inChal(14)) return E(0)
				let x = E(0)
				if (hasUpgrade('bh',15)) x = x.add(tmp.upgs.main?tmp.upgs.main[2][15].effect:E(0))
				return x
			}
		},

		radSoftStart() {
			let r = player.md.mass
			let exp = 0.92
			if (AXION.unl()) exp += tmp.ax.eff[18]

			r = expMult(r, exp).pow(1e3)
			if (hasElement(80)) r = r.pow(2)
			if (AXION.unl()) r = r.pow(tmp.ax.eff[8])
			return r
		}
	},
	reset_msg: {
		msgs: {
			rp: "Require over 1e9 tonne of mass to reset previous features for gain Rage Power",
			dm: "Require over 1e20 Rage Power to reset all previous features for gain Dark Matter",
			atom: "Require over 1e100 uni of black hole to reset all previous features for gain Atoms & Quarks",
			md: "Dilate mass, then cancel",
			ext: "Require Challenge 12 to rise the exotic particles!",
			pres: "Prestige to embrace Primordial Gods!",
		},
		set(id) {
			if (id=="sn") {
				player.reset_msg = "Reach over "+format(tmp.supernova.maxlimit)+" collapsed stars to be Supernova"
				return
			}
			player.reset_msg = this.msgs[id]
		},
		reset() { player.reset_msg = "" },
	},
}

function loop() {
	diff = Date.now()-date;
	updateTemp()
	updateHTML()
	calc(diff/1000*tmp.offlineMult,diff/1000);
	date = Date.now();
	player.offline.current = date
}

function turnOffline() { player.offline.active = !player.offline.active }

function expMult(a,b,base=10) { return E(a).gte(1) ? E(base).pow(E(a).log(base).pow(b)) : E(0) }

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}

function changeFont(x) {
	if (x) player.options.font = x
	document.documentElement.style.setProperty('--font', player.options.font)
}