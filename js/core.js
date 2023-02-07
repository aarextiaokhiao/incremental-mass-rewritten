var diff = 0;
var date = Date.now();
function loop() {
	diff = Date.now()-date;
	updateTemp()
	updateHTML()
	if (!paused) calc(diff/1000*tmp.offlineMult,diff/1000);
	date = Date.now();
	player.offline.current = date
}

function calc(dt, dt_offline) {
	//PRE-DARK MATTER
	player.mass = addProdWorth(player.mass, "mass", dt)
	player.supernova.maxMass = player.supernova.maxMass.max(player.mass)
	if (GLUBALL.unl() && tmp.md.active && player.mass.gt(player.stats.maxMass)) player.ext.chal.f11 = true
	player.stats.maxMass = player.stats.maxMass.max(player.mass)

	if (hasUpgrade('rp',3)) for (let x = 1; x <= UPGS.mass.cols; x++) if (player.autoMassUpg[x] && (hasRank("rank", x) || hasUpgrade('atom',1))) UPGS.mass.buyMax(x)
	if (FORMS.tickspeed.autoUnl() && player.autoTickspeed) FORMS.tickspeed.buyMax()
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		if (RANKS.autoUnl[rn]() && player.auto_ranks[rn]) RANKS.reset(rn, true)
	}
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let upg = UPGS.main[x]
		if (upg.auto_unl ? upg.auto_unl() : false) if (player.auto_mainUpg[id]) for (let y = 1; y <= upg.lens; y++) if (upg[y].unl ? upg[y].unl() : true) upg.buy(y)
	}
	if (hasUpgrade('bh',6) || hasUpgrade('atom',6)) player.rp.points = player.rp.points.add(tmp.rp.gain.mul(dt))

	//DARK MATTER
	if (hasUpgrade('atom',6)) player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain.mul(dt))
	if (player.bh.unl && tmp.pass) {
		if (FORMS.bh.condenser.autoUnl() && player.bh.autoCondenser) FORMS.bh.condenser.buyMax()
		player.bh.mass = addProdWorth(player.bh.mass, "bh", dt)
	}

	chalTick()
	calcAtoms(dt, dt_offline)
	calcSupernova(dt, dt_offline)
	EXT.calc(dt)

	player.offline.time = Math.max(player.offline.time-tmp.offlineMult*dt_offline,0)
	player.supernova.time += dt
	player.time += dt
	tmp.tree_time = (tmp.tree_time+dt_offline) % 3

	tmp.pass = true
	if (gameStarted() && !metaSave.started) {
		metaSave.started = true
		setMetaSave()
	}
}

const BUILDINGS = ["massUpg", "tickspeed", "bh_condenser", "gamma_ray"]
const FORMS = {
	baseMassGain() {
		let x = D(inNGM() ? 2 : 1)
		x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
		if (hasRank("rank", 6)) x = x.mul(RANKS.effect.rank[6]())
		if (hasRank("rank", 13)) x = x.mul(3)
		x = x.mul(tmp.tickspeedEffect.eff||D(1))
		if (player.bh.unl) x = x.mul(tmp.bh.effect)
		if (hasUpgrade('bh',10)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][10].effect:D(1))
		x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
		x = x.mul(tmp.atom.particles[1].powerEffect.eff2)
		if (hasRank("rank", 380)) x = x.mul(RANKS.effect.rank[380]())
		x = x.mul(tmp.stars.effect.eff)
		if (hasTree("m1")) x = x.mul(treeEff("m1"))
		x = x.mul(tmp.bosons.effect.pos_w[0])
		x = x.mul(tmp.supernova.mult)

		return x
	},
	massGain() {
		let exp = D(1)
		if (hasRank("tier", 2)) exp = exp.mul(1.15)
		if (hasRank("rank", 180)) exp = exp.mul(1.025)
		if (!CHALS.inDirect(3)) exp = exp.mul(CHALS.eff(3))
		if (tmp.md.active && hasElement(28)) exp = exp.mul(1.5)

		let x = this.baseMassGain().pow(exp)
		if (tmp.md.active) {
			x = MASS_DILATION.applyDil(x)
			if (hasElement(28)) x = x.pow(1.5)
		}
		if (CHALS.in(9)) x = expMult(x,0.9)

		return x.softcap(tmp.massSoftGain1,tmp.massSoftPower1,0).softcap(tmp.massSoftGain2,tmp.massSoftPower2,0).softcap(tmp.massSoftGain3,tmp.massSoftPower3,0)
	},
	massSoftGain() {
		let s = D(1.5e156)
		if (CHALS.in(3)) s = s.div(1e150)
		if (CHALS.in(4)) s = s.div(1e100)
		if (hasUpgrade('bh',7)) s = s.mul(tmp.upgs.main?tmp.upgs.main[2][7].effect:D(1))
		if (hasUpgrade('rp',13)) s = s.mul(tmp.upgs.main?tmp.upgs.main[1][13].effect:D(1))
		s = s.pow(getRadiationEff(2))
		if (tmp.massSoftGain2) s = s.min(tmp.massSoftGain2)
		return s
	},
	massSoftPower() {
		let p = D(1/3)
		if (CHALS.in(3)) p = p.mul(4)
		if (CHALS.in(7)) p = p.mul(6)
		if (hasUpgrade('bh',11)) p = p.mul(0.9)
		if (hasRank("rank", 800)) p = p.mul(RANKS.effect.rank[800]())
		return D(1).div(p.add(1))
	},
	massSoftGain2() {
		let s = D('1.5e1000056')
		if (hasTree("m2")) s = s.pow(1.5)
		if (hasTree("m2")) s = s.pow(treeEff("m3"))
		if (hasRank("tetr", 8)) s = s.pow(1.5)
		s = s.pow(tmp.bosons.effect.neg_w[0])
		s = s.pow(getRadiationEff(2))
		if (tmp.massSoftGain3) s = s.min(tmp.massSoftGain3)
		return s
	},
	massSoftPower2() {
		let p = D(0.25)
		if (hasElement(51)) p = p.pow(0.9)
		return p
	},
	massSoftGain3() {
		let s = uni("ee8")
		if (hasTree("m3")) s = s.pow(treeEff("m3"))
		s = s.pow(getRadiationEff(2))
		return s
	},
	massSoftPower3() {
		let p = D(0.2)
		return p
	},
	tickspeed: {
		cost(x=player.tickspeed) { return D(2).pow(x).floor() },
		can() { return player.rp.points.gte(tmp.tickspeedCost) && !CHALS.in(2) && !CHALS.in(6) && !CHALS.in(10) },
		buy() {
			if (this.can()) {
				if (!hasUpgrade('atom',2) && !hasExtMilestone("qol", 3)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
				player.tickspeed = player.tickspeed.add(1)
			}
		},
		buyMax() { 
			if (this.can()) {
				if (!hasUpgrade('atom',2) && !hasExtMilestone("qol", 3)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
				player.tickspeed = tmp.tickspeedBulk
			}
		},
		effect() {
			let t = player.tickspeed
			if (!isScalingToned("tickspeed") && hasElement(63)) t = t.mul(25)

			let bonus = D(0)
			if (player.atom.unl) bonus = bonus.add(tmp.atom.atomicEff)
			let step = D(1.5)
				step = step.add(CHALS.eff(6))
				step = step.add(CHALS.eff(2))
				step = step.add(tmp.atom.particles[0].powerEffect.eff2)
				if (hasRank("tier", 4)) step = step.add(RANKS.effect.tier[4]())
				if (hasRank("rank", 40)) step = step.add(RANKS.effect.rank[40]())
				step = step.mul(tmp.md.mass_eff)
			step = step.mul(tmp.bosons.effect.z_boson[0])
			if (hasTree("t1")) step = step.pow(1.15)
			//if (AXION.unl()) step = step.pow(tmp.ax.eff[19])
			if (hasExtMilestone("boost", 1) && hasElement(18)) step = step.pow(tmp.elements.effect[18])

			let ss = D(1e50)
			ss = ss.mul(getRadiationEff(5))
			if (isScalingToned("tickspeed")) ss = EINF
			else if (isScalingToned("tickspeed")) step = step.softcap(ss,0.1,0)
			
			let eff = step.pow(t.add(bonus))
			if (!hasExtMilestone("boost", 1) && hasElement(18)) eff = eff.pow(tmp.elements.effect[18])
			if (hasRank("tetr", 3)) eff = eff.pow(1.05)
			return {step: step, eff: eff, bonus: bonus, ss: ss}
		},
		autoUnl() { return hasUpgrade('bh',5) },
		autoSwitch() { player.autoTickspeed = !player.autoTickspeed },
	},
	rp: {
		gain() {
			if (player.mass.lt(1e15) || CHALS.in(7)) return D(0)
			let gain = player.mass.div(1e15).root(3)
			if (hasRank("rank", 14)) gain = gain.mul(2)
			if (hasRank("rank", 45)) gain = gain.mul(RANKS.effect.rank[45]())
			if (hasRank("tier", 6)) gain = gain.mul(RANKS.effect.tier[6]())
			if (hasUpgrade('bh',6)) gain = gain.mul(tmp.upgs.main?tmp.upgs.main[2][6].effect:D(1))
			gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
			if (hasTree("rp1")) gain = gain.mul(treeEff("rp1"))
			gain = gain.mul(tmp.supernova.mult)

			if (hasUpgrade('bh',8)) gain = gain.pow(1.15)
			gain = gain.pow(CHALS.eff(4))
			if (CHALS.in(4)) gain = gain.root(10)
			if (tmp.md.active) gain = MASS_DILATION.applyDil(gain)
			return gain.floor()
		},
		reset() {
			if (tmp.rp.can && toConfirm('rp')) {
				player.rp.points = player.rp.points.add(tmp.rp.gain)
				if (!player.rp.unl) addPopup(POPUP_GROUPS.layer_1)
				player.rp.unl = true
				this.doReset()
			}
		},
		doReset() {
			if (inNGM()) {
				player.mg.amt = D(0)
				MAGIC.doReset()
			} else {
				player.ranks.tetr = D(0)
				RANKS.doReset.tetr()
			}
		},
	},
	bh: {
		see() { return player.rp.unl },
		DM_gain() {
			let gain = player.rp.points.div(1e20)
			if (CHALS.in(7)) gain = player.mass.div(1e180)
			if (gain.lt(1)) return D(0)
			gain = gain.root(4)

			if (hasTree("bh1")) gain = gain.mul(treeEff("bh1"))
			gain = gain.mul(tmp.bosons.upgs.photon[0].effect)
			gain = gain.mul(tmp.supernova.mult)

			if (CHALS.in(7)) gain = gain.root(6)
			gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
			if (CHALS.in(8)) gain = gain.root(8)
			gain = gain.pow(CHALS.eff(8).dm)
			if (tmp.md.active && !CHALS.in(12) && !CHALS.in(15)) gain = MASS_DILATION.applyDil(gain)
			return gain.floor()
		},
		massPowerGain() {
			let x = D(0.33)
			if (FERMIONS.onActive("11")) return D(-1)
			if (hasElement(59)) x = D(0.45)
			x = x.add(getRadiationEff(4, 0))
			return x
		},
		massGain() {
			let x = player.bh.mass.add(1).pow(tmp.bh.massPowerGain).mul(this.condenser.effect().eff)
			if (hasUpgrade('rp',11)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][11].effect:D(1))
			if (hasUpgrade('bh',14)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][14].effect:D(1))
			if (hasElement(46)) x = x.mul(tmp.elements.effect[46])
			x = x.mul(tmp.bosons.upgs.photon[0].effect)
			x = x.mul(tmp.supernova.mult)

			if (CHALS.in(8)) x = x.root(8)
			x = x.pow(CHALS.eff(8).bh)
			if (tmp.md.active && !CHALS.in(12) && !CHALS.in(15)) x = MASS_DILATION.applyDil(x)
			return x.softcap(tmp.bh.massSoftGain, tmp.bh.massSoftPower, 0)
		},
		massSoftGain() {
			let s = D(1.5e156)
			if (hasUpgrade('atom',6)) s = s.mul(tmp.upgs.main?tmp.upgs.main[3][6].effect:D(1))
			return s
		},
		massSoftPower() {
			return D(0.5)
		},
		reset() {
			if (tmp.bh.dm_can && toConfirm('bh')) {
				player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain)
				if (!player.bh.unl) addPopup(POPUP_GROUPS.layer_2)
				player.bh.unl = true
				this.doReset()
			}
		},
		doReset() {
			let keep = []
			for (let x = 0; x < player.mainUpg.rp.length; x++) if ([3,5,6].includes(player.mainUpg.rp[x])) keep.push(player.mainUpg.rp[x])
			player.mainUpg.rp = keep
			player.rp.points = D(0)
			player.tickspeed = D(0)
			player.bh.mass = D(0)
			FORMS.rp.doReset()
		},
		effect() {
			return hasUpgrade('atom',12)
			?player.bh.mass.add(1).pow(1.25)
			:player.bh.mass.add(1).root(4)
		},
		condenser: {
			autoSwitch() { player.bh.autoCondenser = !player.bh.autoCondenser },
			autoUnl() { return hasUpgrade('atom',2) },
			can() { return player.bh.dm.gte(tmp.bh.condenser_cost) && !CHALS.in(6) && !CHALS.in(10) },
			buy() {
				if (CHALS.in(14)) return
				if (this.can()) {
					if (!hasExtMilestone("qol", 5)) player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
					player.bh.condenser = player.bh.condenser.add(1)
				}
			},
			buyMax() {
				if (CHALS.in(14)) return
				if (this.can()) {
					if (!hasExtMilestone("qol", 5)) player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
					player.bh.condenser = tmp.bh.condenser_bulk
				}
				buyExtraBuildings("bh",2)
				buyExtraBuildings("bh",3)
			},
			effect() {
				let t = player.bh.condenser
				let pow = D(2)
					pow = pow.add(CHALS.eff(6))
					if (hasUpgrade('bh',2)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[2][2].effect:D(1))
					pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
					if (hasUpgrade('atom',11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:D(1))
					pow = pow.mul(tmp.bosons.upgs.photon[1].effect)
					if (hasTree("bh2")) pow = pow.pow(1.15)
				let eff = pow.pow(t.add(tmp.bh.condenser_bonus))
				return {pow: pow, eff: eff}
			},
			bonus() {
				if (CHALS.in(14)) return D(0)
				let x = D(0)
				if (hasUpgrade('bh',15)) x = x.add(tmp.upgs.main?tmp.upgs.main[2][15].effect:D(0))
				return x
			}
		},

		radSoftStart() {
			let r = player.md.mass
			let exp = 0.92
			//if (AXION.unl()) exp += tmp.ax.eff[18]

			r = expMult(r, exp).pow(1e3)
			//if (AXION.unl()) r = r.pow(tmp.ax.eff[8])
			return r
		}
	}
}

const TOOLTIPS = {
	mass: {
		full: "Mass",
		desc: () => `You have pushed <b>${formatMass(player.mass)}</b> of existence.<br>
		Your strongest object holds <b>${formatMass(player.stats.maxMass)}</b>.`
	},
	mg: {
		full: "Magic",
		desc: () => `<i class="purple">IM:A- Exclusive</i><br>
		You have summoned <b>${format(MAGIC.amt())}</b> magic.<br><br>
		Require ${formatMass(2e4)} to reset prior features`
	},
	rp: {
		full: "Rage",
		desc: () => `<i class="red">Layer 1 resource</i><br>
		You have enraged <b>${format(player.rp.points)}</b> Rage Power.<br><br>
		Require ${formatMass(1e18)} to reset prior features`
	},
	dm: {
		full: "Dark Matter",
		desc: () => `<i class="yellow">Layer 2 resource</i><br>
		You have extracted <b>${format(player.bh.dm)}</b> Dark Matter.<br><br>
		Require ${format(1e20, 0)} Rage Power to reset prior features`
	},
	bh: {
		full: "Black Hole",
		desc: () => `<i class="yellow">Layer 2 resource</i><br>
		Your Black Hole consumed <b>${formatMass(player.bh.mass)}</b>.`
	},
	atom: {
		full: "Atomic",
		desc: () => `<i>Layer 3 resource</i><br>
		You have composed <b>${format(player.atom.points)}</b> Atoms.
		<br><br>
		Require ${formatMass(uni(1e100))} black hole mass to reset prior features`
	},
	qk: {
		full: "Quarks",
		desc: () => `<i>Layer 3 resource</i><br>
		You have <b>${format(player.atom.quarks)}</b> unassigned Quarks.<br><br>
		Require ${formatMass(uni(1e100))} black hole mass to reset prior features`
	},
	md: {
		full: "Dilation",
		desc: () => `<i>Layer 3 resource</i><br>
		You have <b>${format(player.md.particles)}</b> Relativistic Particles<br>
		You have <b>${format(player.md.mass)}</b> dilated mass<br><br>
		Click to ${player.md.active?'undo mass dilation':'dilate mass'}.`
	},
	star: {
		full: "Stars",
		desc: () => `<i>Layer 3 resource</i><br>
		You have collapsed <b>${format(player.stars.points)}</b> stars.`
	},
	sn: {
		full: "Supernovae",
		desc: () => `<i class='magenta'>Layer 4 resource</i><br>
		You became <b>${format(player.supernova.times, 0)}</b> Supernovae.<br><br>
		Reach ${format(tmp.supernova.maxlimit)} collapsed stars to be a Supernova.`
	},
	ns: {
		full: "Neutron Stars",
		desc: () => `<i class='magenta'>Layer 4 resource</i><br>
		You have unravelled <b>${format(player.supernova.stars)}</b> Neutron Stars from nebulae remnants.`
	},
	ext: {
		full: "Exotic",
		desc: () => `<i class='scarlet'>Layer 5 resource</i><br>
		You risen up <b>${format(EXT.amt())}</b> Exotic Matter.<br><br>
		Require Challenge 12 to rise the exotic particles!`
	}
}

function changeFont(x) {
	if (x) player.options.font = x
	document.documentElement.style.setProperty('--font', player.options.font)
}