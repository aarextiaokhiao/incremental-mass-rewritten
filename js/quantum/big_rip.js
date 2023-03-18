const BIG_RIP = {
    rip() {
		if (CHALS.inChal(14) || CHALS.inChal(19)) return
		if (player.gc.active && player.gc.rip) return
        if (!player.qu.rip.active && player.confirms.br) if (!confirm(`Are you sure you want to Big Rip the Dimension?
        When Big Rip the Dimension, Entropy Rewards don’t work, all Primordium effects are 50% weaker except Epsilon Particles that don’t work, tree [qu2, qu10] doesn’t work, and you are trapped in Quantum Challenge with modifiers [10,2,10,10,5,0,2,10].
        Death Shards are gained based on your normal mass while Big Ripped.
        Unlock various upgrades from Big Rip.`)) return
        if (player.qu.rip.active) player.qu.rip.amt = player.qu.rip.amt.add(tmp.rip.gain)
        player.qu.qc.active = false
        player.qu.rip.first = true
        player.qu.rip.active = !player.qu.rip.active
        QUANTUM.enter(false,true,true)
    },
    gain() {
		if (CHALS.inChal(13) || CHALS.inChal(19)) return E(0)
        let x = player.mass.add(1).log10().div(2e5).max(0)
        if (!(player.qu.rip.active || hasTree('qu_qol12')) || x.lt(1)) return E(0)
        if (hasTree('br1')) x = x.mul(treeEff('br1'))
        if (hasElement(90)) x = x.mul(tmp.elements.effect[90]||1)
        if (player.qu.rip.active){
			if (hasElement(94)) x = x.mul(tmp.elements.effect[94]||1)
		}else{
			let eff=0
			if (hasTree('br3'))eff += 0.1
			if (hasElement(130))eff += 0.1
			if (hasElement(179))eff += 0.1
			if (hasElement(203))eff += 0.1
			if (hasElement(263))eff += 0.1
			if (hasElement(282))eff = 1
			if (hasElement(94)) x = x.mul(E(tmp.elements.effect[94]||1).pow(eff))
		}
        if (hasPrestige(0,2)) x = x.mul(4)
        if (player.md.break.upgs[6].gte(1)) x = x.mul(tmp.bd.upgs[6].eff?tmp.bd.upgs[6].eff[1]:1)
        if (hasUpgrade('br',13)) x = x.mul(upgEffect(4,13))
        if (hasPrestige(0,55)) x = x.mul(player.prestiges[0].max(1))
		if (hasPrestige(0,98)) x = x.mul(prestigeEff(0,98,[E(1),E(1)])[0]);
        if (hasUpgrade('inf',3)) x = x.mul(upgEffect(5,3))
			
		if(hasUpgrade('br',22)){
			x = x.pow(tmp.chal?tmp.chal.eff[14]:1);
		}
		if(hasChargedElement(90)) x = x.pow(tmp.elements.ceffect[90]||1)
		if (!hasUpgrade('br',21)) x = overflow(x,Number.MAX_VALUE,E(hasUpgrade('inf',20)?0.35:hasUpgrade('inf',19)?0.3:0.25).pow(hasElement(159)?(tmp.chal?tmp.chal.eff[14]:1):1));
        return x.floor()
    },
}

const BIG_RIP_QC = [10,2,10,10,5,0,2,10]

function updateBigRipTemp() {
    tmp.rip.gain = BIG_RIP.gain()
}