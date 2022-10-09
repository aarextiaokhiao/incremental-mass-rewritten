
const ETERNITY_LAYER = {
    gain() {
        let x = tmp.preQUGlobalSpeed.add(1).log("1e2000");
        if (x.lt(1) || player.supernova.fermions.choosed.startsWith("2") || player.supernova.fermions.choosed.startsWith("3")) return E(0)
		let power = E(1)
		if (hasUpgrade('inf',15))power = power.add(2)
		if (hasUpgrade('inf',17))power = power.add(3)
        x = x.pow(power).sub(1);
		x = overflow(x,10,2);
		
        if (hasPrestige(2,4)) x = x.mul(prestigeEff(2,4));
        if (hasPrestige(1,26)) x = x.mul(prestigeEff(1,26));
        if (hasPrestige(0,250)) x = x.mul(prestigeEff(0,250));
        if (hasPrestige(2,42)) x = x.mul(prestigeEff(2,42));
		if (hasElement(121)) x = x.mul(tmp.elements.effect[121]);
		if (hasElement(123)) x = x.mul(tmp.elements.effect[123]);
		if (hasElement(127)) x = x.mul(tmp.elements.effect[127]);
        if (player.ranks.oct.gte(10)) x = x.mul(RANKS.effect.oct[10]())
		x = x.mul(SUPERNOVA_GALAXY.effects.inf())
        return x
    },
    gainTimes() {
        let x = E(1)
		if (hasElement(217)) x = x.mul(tmp.elements.effect[217]);
		if (hasElement(243)) x = x.mul(tmp.elements.effect[243]);
        x = x.mul(SUPERNOVA_GALAXY.effects.qut2())
        return x
    },
    enter() {
        let x = tmp.preQUGlobalSpeed.add(1).log("1e2000");
        if (x.lt(1) || player.supernova.fermions.choosed.startsWith("2") || player.supernova.fermions.choosed.startsWith("3")) return
        if (player.confirms.et) if (confirm("Are you sure to go Eternity? Going Eternity will reset all previous except QoL mechanicals and Prestiges")?!confirm("ARE YOU SURE ABOUT IT???"):true) return
		ETERNITY_LAYER.doReset()
    },
    doReset(force=false) {
		updateInfinityTemp()
        player.et.points = player.et.points.add(tmp.et.gain)
        player.et.times = player.et.times.add(tmp.et.gainTimes)
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
		if(!hasUpgrade('inf',3))player.qu.times = E(0)
		if(hasUpgrade('inf',3))player.qu.times = E(200)
		player.qu.bp = E(0)
		player.qu.cosmic_str = E(0)
		player.qu.chroma = [E(0),E(0),E(0)]
		player.qu.prim.theorems = E(0)
		player.qu.prim.particles = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]
		if(!hasUpgrade('inf',3))player.qu.qc.shard = SUPERNOVA_GALAXY.effects.qs();
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
        player.inf.points = new Decimal(0)
        player.inf.times = new Decimal(1)
		player.atom.points = E(1e100)
		player.atom.quarks = E(1e100)
		player.chal.comps[9] = E(0)
		player.chal.comps[10] = E(0)
		player.chal.comps[11] = E(0)
		player.chal.comps[12] = E(0)
        tmp.pass = false
    },
    shardsGain() {
        let x = E(1);
		if(tmp.et.shard_gen_eff)x = x.mul(tmp.et.shard_gen_eff.eff);
		if(hasElement(119))x = x.mul(tmp.elements.effect[119]);
		if(hasElement(161))x = x.mul(tmp.elements.effect[161]);
        return x
    },
    shard_gen: {
        buy() {
            if (tmp.et.shard_gen_can) {
				player.et.points = player.et.points.sub(tmp.et.shard_gen_cost).max(0)
				player.et.shard_gen = player.et.shard_gen.add(1)
			}
        },
        buyMax() {
            if (tmp.et.shard_gen_can) {
				player.et.shard_gen = tmp.et.shard_gen_bulk
				player.et.points = player.et.points.sub(tmp.et.shard_gen_cost).max(0)
			}
        },
        eff() {
            let pow = E(2)
			if (hasElement(122)) pow = pow.mul(1.5)
			if (hasElement(209)) pow = pow.mul(tmp.chal?tmp.chal.eff[19]:1)
            let x = pow.pow(player.et.shard_gen)
            return {pow: pow, eff: x}
        },
    },
}

function calcShardsEffect() {
	let eff = player.et.shards.add(1).log10().add(1).log10().add(1).pow(0.1);
	if(hasUpgrade('br',16))eff = eff.pow(1.1);
	if(hasUpgrade('br',17))eff = eff.pow(1.2);
	if(hasUpgrade('br',18))eff = eff.pow(1.1);
	if(hasUpgrade('br',19))eff = eff.pow(1.5);
	if(hasElement(148))eff = eff.pow(1.1);
	if(hasElement(223))eff = eff.pow(1.4);
	if(hasElement(226))eff = eff.pow(1.3);
	if(hasElement(238))eff = eff.pow(1.2);
	return eff;
}