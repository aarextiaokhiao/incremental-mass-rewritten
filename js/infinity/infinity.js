const INFINITY_LAYER = {
    gain() {
        let x = player.qu.points.add(1).log(Number.MAX_VALUE);
        let y = player.qu.rip.amt.add(1).log(Number.MAX_VALUE);
        if (x.lt(1) || CHALS.inChal(18) || CHALS.inChal(19) || player.supernova.fermions.choosed.startsWith("2") || player.supernova.fermions.choosed.startsWith("3")) return E(0)
        if (y.lt(1)) y=E(1)
		if (hasUpgrade('inf',20))y = y.pow(2)
		let power = E(2)
		if (hasUpgrade('inf',7))power = power.add(1)
		if (hasUpgrade('inf',14))power = power.add(2)
		if (hasUpgrade('inf',16))power = power.add(1)
		if (hasUpgrade('inf',18))power = power.add(1)
		if (hasUpgrade('inf',19))power = power.add(1)
		if (hasElement(205))power = power.add(tmp.chal?tmp.chal.eff[18]:0);
		if (hasElement(146)){
			let z = player.qu.en.amt.add(1).log(Number.MAX_VALUE);
			if (z.lt(1)) z=E(1)
			x = x.mul(z)
		}
		if (hasElement(163)){
			let z = ((tmp.prestiges?tmp.prestiges.base:E(1))||E(1)).add(1).log(Number.MAX_VALUE);
			if (z.lt(1)) z=E(1)
			x = x.mul(z)
		}
		if (hasElement(189)){
			let z = player.inf.points.add(1).log(Number.MAX_VALUE);
			if (z.lt(1)) z=E(1)
			x = x.mul(z)
		}
		if (hasElement(304)){
			let z = player.et.points.add(1).log(Number.MAX_VALUE);
			if (z.lt(1)) z=E(1)
			x = x.mul(z)
		}
        x = x.mul(y).pow(power).sub(1);
		x = overflow(x,1e5,2);

		let m = player.mass.add(1).log10().add(1).log10().add(1).sqrt();
		x = x.mul(m);
		if (hasUpgrade('inf',8))x = x.mul(m.pow(0.5))
		if (hasUpgrade('inf',9))x = x.mul(m.pow(0.5))
		let p = player.prestigeMass.add(1).log10().add(1).log10().add(1).sqrt();
		x = x.mul(p);
		if (hasUpgrade('inf',10))x = x.mul(p)
        if (hasUpgrade('inf',4)) x = x.mul(upgEffect(5,4))
		if (hasUpgrade('inf',7)) x = x.mul(2)
        if (hasPrestige(2,3)) x = x.mul(prestigeEff(2,3));
        if (hasPrestige(1,18)) x = x.mul(prestigeEff(1,18));
        if (hasPrestige(0,165)) x = x.mul(prestigeEff(0,165));
		if (hasElement(120)) x = x.mul(tmp.elements.effect[120]);
		if (hasUpgrade('inf',17)) x = x.mul(upgEffect(5,17));
		if (hasElement(124)) x = x.mul(tmp.elements.effect[124]);
		if (hasUpgrade('rp',18)) x = x.mul(upgEffect(1,18));
		if (hasUpgrade('bh',18)) x = x.mul(upgEffect(2,18));
		if (hasUpgrade('atom',18)) x = x.mul(upgEffect(3,18));
		if (hasElement(128)) x = x.mul(tmp.elements.effect[128]);
		if (hasTree('im1')) x = x.mul(treeEff('im1'));
        if (player.ranks.hex.gte(127)) x = x.mul(RANKS.effect.hex[127]())
        if (player.ranks.oct.gte(10)) x = x.mul(RANKS.effect.oct[10]())
		x = x.mul(SUPERNOVA_GALAXY.effects.inf())
        return x
    },
    gainTimes() {
        let x = E(1)
        if (hasUpgrade('inf',12)) x = x.mul(upgEffect(5,12));
		if (hasElement(120)) x = x.mul(tmp.elements.effect[120]);
		if (hasElement(123)) x = x.mul(tmp.elements.effect[123]);
        x = x.mul(SUPERNOVA_GALAXY.effects.qut2())
        return x
    },
    enter() {
        let x = player.qu.points.add(1).log(Number.MAX_VALUE);
        if (x.lt(1) || player.supernova.fermions.choosed.startsWith("2") || player.supernova.fermions.choosed.startsWith("3")) return
        if (player.confirms.inf) if (confirm("Are you sure to go Infinity? Going Infinity will reset all previous except QoL mechanicals and Prestiges")?!confirm("ARE YOU SURE ABOUT IT???"):true) return
		INFINITY_LAYER.doReset()
    },
    doReset(force=false) {
		updateInfinityTemp()
        player.inf.points = player.inf.points.add(tmp.inf.gain)
        player.inf.times = player.inf.times.add(tmp.inf.gainTimes)
		if(player.superGal.lt(5))if(!hasUpgrade('inf',2))player.supernova.tree = ['qol1','qol2','qol3','qol4','qol5','qol6','fn2','fn5','fn6','fn7','fn8','fn9','fn10','fn11','qol8','qol9','c','qol7','unl1','qu_qol1','qu_qol4']
		else{
			
        let keep = ['qol1','qol2','qol3','qol4','qol5','qol6','fn2','fn5','fn6','fn7','fn8','fn9','fn10','fn11']
        for (let x = 0; x < tmp.supernova.tree_had.length; x++) if (TREE_UPGS.ids[tmp.supernova.tree_had[x]].qf) keep.push(tmp.supernova.tree_had[x])
        keep.push('chal1','chal2','chal3','chal4','chal4a','chal5','chal6','chal7','c','qol7','chal4b','chal7a','chal8')
        keep.push('unl1')
        keep.push('qol8','qol9')

        let save_keep = []
        for (let x in keep) if (hasTree(keep[x])) save_keep.push(keep[x])
        player.supernova.tree = save_keep
		}
		player.qu.points = E(0)
		if(!hasUpgrade('inf',3))player.qu.times = SUPERNOVA_GALAXY.effects.qut()
		if(hasUpgrade('inf',3))player.qu.times = SUPERNOVA_GALAXY.effects.qut().add(200)
		player.qu.bp = E(0)
		player.qu.cosmic_str = E(0)
		player.qu.chroma = [E(0),E(0),E(0)]
		player.qu.prim.theorems = E(0)
		player.qu.prim.particles = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]
		if(!hasUpgrade('inf',3))player.qu.qc.shard =SUPERNOVA_GALAXY.effects.qs();
		if(!hasUpgrade('inf',3))player.qu.qc.mods = [0,0,0,0,0,0,0,0]
		player.qu.qc.active = false
		player.qu.en.amt = E(0)
		player.qu.en.eth = [false,E(0),E(0),0]
		player.qu.en.hr = [false,E(0),E(0),0]
		player.qu.en.rewards = []
		player.qu.rip.active = player.gc.active && player.gc.rip
		player.qu.rip.amt = E(0)
		for (let x = 0; x < ENTROPY.rewards.length; x++) player.qu.en.rewards.push(E(0))
		if(!hasUpgrade('inf',3))player.mainUpg.br = []
		if(!hasUpgrade('inf',3))player.mainUpg.rp = []
		if(!hasUpgrade('inf',3))player.mainUpg.bh = []
		if(!hasUpgrade('inf',3))player.mainUpg.atom = []
		if(!hasUpgrade('inf',5) && player.superGal.lt(8))player.atom.elements=SUPERNOVA_GALAXY.effects.elem();
		player.md.break.energy = E(0)
		player.md.break.mass = E(0)
        QUANTUM.doReset()
		player.atom.points = E(1e100)
		player.atom.quarks = E(1e100)
		player.chal.comps[9] = E(0)
		player.chal.comps[10] = E(0)
		player.chal.comps[11] = E(0)
		player.chal.comps[12] = E(0)
        tmp.pass = false
    },
}

function calcInfinity(dt, dt_offline) {
    if (player.qu.points.gte(Number.MAX_VALUE) && !player.inf.reached) {
        player.inf.reached = true
        addPopup(POPUP_GROUPS.inf)
    }
	if (player.inf.times.gt(0)){
		if (hasUpgrade('inf',11)){
			updateInfinityTemp()
			player.inf.points = player.inf.points.add(tmp.inf.gain.mul(dt))
			player.inf.times = player.inf.times.add(tmp.inf.gainTimes.mul(dt))
		}
	}
	if (hasElement(195)){
		updateInfinityTemp()
		player.et.points = player.et.points.add(tmp.et.gain.mul(dt))
		player.et.times = player.et.times.add(tmp.et.gainTimes.mul(dt))
	}
	if (player.et.times.gt(0)){
		player.et.shards = player.et.shards.add(tmp.et.shardsGain.mul(dt))
	}
}

function updateInfinityTemp() {
    tmp.inf.gain = INFINITY_LAYER.gain()
    tmp.inf.gainTimes = INFINITY_LAYER.gainTimes()
    tmp.et.gain = ETERNITY_LAYER.gain()
    tmp.et.gainTimes = ETERNITY_LAYER.gainTimes()
    tmp.et.shardsGain = ETERNITY_LAYER.shardsGain()

    tmp.et.shard_gen_cost = E(2).pow(player.et.shard_gen.scaleEvery("shard_gen").add(1)).div(1e3)
    tmp.et.shard_gen_bulk = player.et.points.mul(1e3).max(1).log(2).scaleEvery("shard_gen",true).add(scalingActive('shard_gen',player.et.shard_gen.max(tmp.et.shard_gen_bulk),'super')?1:0).floor()

    tmp.et.shard_gen_can = player.et.points.gte(tmp.et.shard_gen_cost)
    tmp.et.shard_gen_eff = ETERNITY_LAYER.shard_gen.eff()
	
	if(hasElement(220))player.et.shard_gen = player.et.shard_gen.max(tmp.et.shard_gen_bulk)
}


function updateInfinityHTML() {
    let gain2 = hasUpgrade('inf',11)
    let unl = player.inf.reached || player.superGal.gt(0)
    tmp.el.infinity_div.setDisplay(unl)
    tmp.el.eternity_div.setDisplay(hasUpgrade('inf',14))
	tmp.el.etAmt.setHTML(formatMass(player.et.points,0)+"<br>"+(hasElement(195)?player.et.points.formatGain(tmp.et.gain,1):"(+"+formatMass(tmp.et.gain,0)+")"));
    if (unl) tmp.el.infAmt.setHTML(formatMass(player.inf.points,0)+"<br>"+(gain2?player.inf.points.formatGain(tmp.inf.gain,1):"(+"+formatMass(tmp.inf.gain,0)+")"))
	tmp.el.shardsAmt.setHTML(format(player.et.shards,0)+player.et.shards.formatGain(tmp.et.shardsGain,0));
	tmp.el.shardsEff.setHTML(format(calcShardsEffect()));
        tmp.el.shard_gen_lvl.setTxt(format(player.et.shard_gen,0))
        tmp.el.shard_gen_btn.setClasses({btn: true, locked: !tmp.et.shard_gen_can})
        tmp.el.shard_gen_scale.setTxt(getScalingName('shard_gen'))
        tmp.el.shard_gen_cost.setTxt(formatMass(tmp.et.shard_gen_cost,0))
        tmp.el.shard_gen_pow.setTxt(format(tmp.et.shard_gen_eff.pow))
        tmp.el.shard_gen_eff.setHTML(format(tmp.et.shard_gen_eff.eff))
}