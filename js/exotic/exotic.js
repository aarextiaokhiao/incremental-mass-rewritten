const EXOTIC = {
    gain() {
		let x = player.mass.max(1).log10().max(1).log10().div(1e12)
        if (x.lt(1)) return E(0)
        x = x.max(0).pow(hasUpgrade('exotic',22)?3:2)
		if (player.qu.times.gte(1e255) && player.exotic.times.gte(1))x = x.mul(3)
		if (player.qu.times.gte(1e295) && player.exotic.times.gte(1))x = x.mul(5)
        if (hasPrestige(2,141)) x = x.mul(prestigeEff(2,141,E(1)));
        if (hasPrestige(3,21)) x = x.mul(prestigeEff(3,21,E(1)));
        if (hasPrestige(3,22)) x = x.mul(prestigeEff(3,22,E(1)));
		if (player.ranks.oct.gte(34)) x = x.mul(RANKS.effect.oct[34]())
		if (player.ranks.enne.gte(5)) x = x.mul(RANKS.effect.enne[5]())
		if(hasUpgrade('exotic', 15)){
			x = x.mul(tmp.ex.dsEff.ex);
		}
		if(hasUpgrade('exotic', 17)){
			x = x.mul(player.exotic.times.add(1));
		}
		if(hasUpgrade('br', 23)){
			x = x.mul(upgEffect(4,23));
		}
		if(hasUpgrade('inf', 24)){
			x = x.mul(upgEffect(5,24));
		}
		if(hasUpgrade('bh', 25)){
			x = x.mul(upgEffect(2,25));
		}
        if (hasAscension(0,2)) x = x.mul(ascensionEff(0,2,E(1)));
        if (hasAscension(1,1)) x = x.mul(ascensionEff(1,1,E(1)));
        if (hasChargedElement(6)) x = x.mul(tmp.elements.ceffect[6]);
		x = x.mul(SUPERNOVA_CLUSTER.effects.eff1())
        if (hasElement(395)) x = x.mul(tmp.elements.effect[395]);
		if(hasElement(406)){
			x = x.mul(tmp.ex.drEff.ex);
		}
        return x.floor()
    },
    gainTimes() {
        let x = E(1)
		if (hasElement(402)) x = x.mul(tmp.ex.rcb_eff[3]?(tmp.ex.rcb_eff[3].eff||1):1);
        return x
    },
    mils: [
        [E(1), `You start with 10 Supernova Galaxies, and keep Elements on Exotic resets. Unlock new Quantum Milestones.`],
        [E(2), `Automatically Gain Prestige Level, Honor, Glory and Renown.`],
        [E(3), `Exotic reset times boost Quantizes and Galactic Quarks gain.`],
        [E(4), `Keep Galactic Fermion Tiers on Exotic resets.`],
        [E(5), `Keep Galactic Shards on Exotic resets.`],
        [E(10), `You start with 15 Supernova Galaxies, and keep C20 completions on Exotic resets.`],
        [E(50), `Automatically Gain Supernova Galaxies, Supernova Galaxies don't reset anything.`],
    ],
    enter() {
        if (EXOTIC.gain().gte(1)) {
            if (player.confirms.exotic) if (confirm("Are you sure to reset for Exotic Matter? This will reset all previous except QoL mechanicals")?!confirm("ARE YOU SURE ABOUT IT???"):true) return
			player.exotic.points = player.exotic.points.add(EXOTIC.gain())
            player.exotic.times = player.exotic.times.add(EXOTIC.gainTimes())
			if(hasUpgrade('exotic', 15)){
				player.exotic.dr = player.exotic.dr.add(EXOTIC.drGain())
			}
            this.doReset()
        }
    },
    doReset(force=false) {
		player.superGal=new Decimal(player.exotic.times.lt(10)?10:15)
		player.galQk=new Decimal(0)
		if(player.exotic.times.lt(5))player.gc.shard=new Decimal(0)
		player.galParticles=[new Decimal(0),new Decimal(0),new Decimal(0)]
		player.galPow=[E(0),E(0),E(0),E(0),E(0),E(0)]
		if(player.exotic.times.lt(4))player.supernova.fermions.tiers[2]=[E(0),E(0),E(0),E(0),E(0),E(0)]
		if(player.exotic.times.lt(4))player.supernova.fermions.tiers[3]=[E(0),E(0),E(0),E(0),E(0),E(0)]
		player.prestigeMassUpg=[E(0),E(0),E(0),E(0),E(0)]
		player.prestigeRP=E(0)
		player.prestigeTickspeed=E(0)
		if(player.exotic.times.lt(10)){
			for (let x = 1; x <= 20; x++) player.chal.comps[x] = E(0)
		}else{
			for (let x = 1; x <= 19; x++) player.chal.comps[x] = E(0)
		}
        SUPERNOVA_GALAXY.reset(true)
        SUPERNOVA_GALAXY.reset(true)
    },
    rcb: {
        buy(i) {
            if (tmp.ex.rcb_can[i]) {
				player.exotic.rcb[i] = player.exotic.rcb[i].add(1)
				player.exotic.points = player.exotic.points.sub(tmp.ex.rcb_cost[i]).max(0)
			}
        },
        buyMax(i) {
            if (tmp.ex.rcb_can[i]) {
				player.exotic.rcb[i] = tmp.ex.rcb_bulk[i]
				player.exotic.points = player.exotic.points.sub(tmp.ex.rcb_cost[i]).max(0)
			}
        },
        eff(i) {
            let pow = E(2)
            let x = pow.pow(player.exotic.rcb[i])
			if(i==3)x = pow.mul(player.exotic.rcb[i]).add(1)
            return {pow: pow, eff: x}
        },
    },
    drGain(){
        let x = E(1);
		if(hasUpgrade('exotic', 15)){
			x = x.mul(tmp.ex.dsEff.ex);
		}
		if(hasElement(372))x = x.mul(tmp.elements.effect[372]);
        if (hasAscension(0,11)) x = x.mul(ascensionEff(0,11,E(1)));
		if(hasElement(389))x = x.mul(tmp.elements.effect[389]);
		if(player.superCluster.gte(4))x = x.mul(SUPERNOVA_CLUSTER.effects.eff1());
		if(hasElement(426)){
			x = x.mul(tmp.ex.abEff.ds);
		}
        if (hasPrestige(4,8)) x = x.mul(prestigeEff(4,8,E(1)));
		return x;
    },
    dsGain(){
        let x = E(1);
		if(hasUpgrade('exotic', 15)){
			x = x.mul(tmp.ex.drEff.ds);
		}
		if(hasElement(414)){
			x = x.mul(tmp.ex.abEff.ds);
		}
		if(hasElement(370))x = x.mul(tmp.elements.effect[370]);
		if(hasElement(388))x = x.mul(tmp.elements.effect[388]);
		if(hasElement(401))x = x.mul(tmp.elements.effect[401]);
		if(hasElement(405))x = x.mul(tmp.elements.effect[405]);
		if(player.superCluster.gte(3))x = x.mul(SUPERNOVA_CLUSTER.effects.eff1());
        if (hasAscension(0,20)) x = x.mul(ascensionEff(0,20,E(1)));
		return x;
    },
    abGain(){
		if(!hasElement(414))return E(0);
        let x = E(1);
		x = x.mul(EXOTIC.dsEff().ab);
		if(hasElement(442))x = x.mul(tmp.elements.effect[442]);
		if(hasElement(445))x = x.mul(tmp.elements.effect[445]);
		return x;
    },
    drEff(){
		let x = {ds:player.exotic.dr.pow(2)};
		if(hasElement(406))x.ex = player.exotic.dr.pow(0.1);
		if(hasElement(428))x.ex = player.exotic.dr.pow(0.25);
		return x;
    },
    dsEff(){
		let x = {ex:player.exotic.ds.add(1).log10().add(1)};
		if(hasElement(376))x.sn = player.exotic.ds.div(1e20).add(1).log10().div(10).add(1).pow(-1);
		if(hasElement(394))x.en = expMult(player.exotic.ds.add(2),2).pow(1e4);
		if(hasElement(400))x.bp = player.exotic.ds.add(1e50).log10().div(50);
		if(hasElement(412)){
			x.ex = x.ex.pow(2)
			x.en = x.en.pow(2)
		}
		if(hasElement(414))x.ab = player.exotic.ds.div(1e60).add(1).pow(2);
		return x;
    },
    abEff(){
		let x = {ds:player.exotic.ab.add(1).log10().add(1).pow(2),exb:player.exotic.ab.add(1).log10().div(100).add(1).sqrt()};
		if(hasElement(420))x.csp = player.exotic.ab.add(10).log10().pow(2);
		if(hasElement(436))x.em = player.exotic.ab.add(1);
		return x;
    },
}

function updateExoticTemp() {
	
	tmp.ex.drEff = EXOTIC.drEff()
	tmp.ex.dsEff = EXOTIC.dsEff()
	tmp.ex.abEff = EXOTIC.abEff()
	
    tmp.ex.gain = EXOTIC.gain()
    tmp.ex.gainTimes = EXOTIC.gainTimes()

	for(let i=0;i<=3;i++){
		tmp.ex.rcb_cost[i] = E(2+i).pow(player.exotic.rcb[i].scaleEvery("ex_rcb").add(1))
		tmp.ex.rcb_bulk[i] = player.exotic.points.max(1).log(2+i).scaleEvery("ex_rcb",true).floor()

		tmp.ex.rcb_can[i] = player.exotic.points.gte(tmp.ex.rcb_cost[i])
		tmp.ex.rcb_eff[i] = EXOTIC.rcb.eff(i)
		
		if(hasChargedElement(43)&&(i<=hasElement(402)?3:2))player.exotic.rcb[i] = player.exotic.rcb[i].max(tmp.ex.rcb_bulk[i]);
	}
	
	player.exotic.bp = player.exotic.bp.max(EXOTIC_BOOST.gain());
	tmp.ex.exb_can = player.exotic.bp.gt(EXOTIC_BOOST.used_bp());
	
	for(let i=0;i<EXOTIC_BOOST_LENGTH;i++){
		tmp.ex.exb_eff[i] = EXOTIC_BOOST.effect(i)
	}
	
}

function calcExotic(dt) {
	if(hasUpgrade('exotic', 15)){
		player.exotic.dr = player.exotic.dr.max(1);
		player.exotic.ds = player.exotic.ds.add(EXOTIC.dsGain().mul(dt));
	}
	if(hasChargedElement(14)){
		player.exotic.dr = player.exotic.dr.add(EXOTIC.drGain().mul(dt));
	}
	if(hasChargedElement(16)){
		player.exotic.dr = player.exotic.dr.add(EXOTIC.drGain().mul(dt).mul(tmp.elements.effect[16]||1));
	}
	if(hasChargedElement(24)){
		player.exotic.points = player.exotic.points.add(EXOTIC.gain().mul(dt));
	}
	if(hasElement(414)){
		player.exotic.ab = player.exotic.ab.add(EXOTIC.abGain().mul(dt));
	}
}

function updateExoticHTML(){
	if (tmp.stab[8] == 0) {
		tmp.el.exotic_times.setTxt(format(player.exotic.times,0))
		for (let x = 0; x < EXOTIC.mils.length; x++) {
			tmp.el['ex_mil'+x].changeStyle('background-color',player.exotic.times.gte(EXOTIC.mils[x][0])?'#2f22':'#4442')
			tmp.el['ex_mil_goal'+x].setTxt(format(EXOTIC.mils[x][0],0))
		}
	}
	if (tmp.stab[8] == 1) {
		tmp.el.rcb0_times.setTxt(format(player.qu.times,0)+player.qu.times.formatGain(tmp.qu.gainTimes))
		tmp.el.rcb1_times.setTxt(format(player.inf.times,0)+player.inf.times.formatGain(tmp.inf.gainTimes))
		tmp.el.rcb2_times.setTxt(format(player.et.times,0)+player.et.times.formatGain(tmp.et.gainTimes))
		for(let i=0;i<=3;i++){
			tmp.el["rcb"+i+"_lvl"].setTxt(format(player.exotic.rcb[i],0))
			tmp.el["rcb"+i+"_btn"].setClasses({btn: true, locked: !tmp.ex.rcb_can[i]})
			tmp.el["rcb"+i+"_cost"].setTxt(format(tmp.ex.rcb_cost[i],0))
			tmp.el["rcb"+i+"_pow"].setTxt(format(tmp.ex.rcb_eff[i].pow))
			tmp.el["rcb"+i+"_eff"].setTxt(format(tmp.ex.rcb_eff[i].eff))
		}
		tmp.el["rcb3_div"].changeStyle('display',hasElement(402)?'':'none');
	}
	if (tmp.stab[8] == 2) {
		tmp.el.ex_bp.setTxt(EXOTIC_BOOST.used_bp().format(0)+" / "+player.exotic.bp.format(0));
		tmp.el.ex_bp2.setTxt(Decimal.pow(1e3,player.exotic.bp.add(1).sub(EXOTIC_BOOST.fgain())).format(0));
		for(let i=0;i<EXOTIC_BOOST_LENGTH;i++){
			tmp.el["exb"+i+"_lvl"].setTxt(format(player.exotic.boosts[i],0))
			tmp.el["exb"+i+"_btn"].setClasses({btn: true, locked: !tmp.ex.exb_can})
			tmp.el["exb"+i+"_refund"].setClasses({btn: true, locked: player.exotic.boosts[i].lte(0)})
			tmp.el["exb"+i+"_eff"].setTxt(format(tmp.ex.exb_eff[i]))
		}
		tmp.el["exb2_div"].changeStyle('display',hasUpgrade('exotic',11)?'':'none');
		tmp.el["exb3_div"].changeStyle('display',hasUpgrade('exotic',18)?'':'none');
		tmp.el["exb4_div"].changeStyle('display',hasUpgrade('exotic',20)?'':'none');
		tmp.el["exb5_div"].changeStyle('display',hasUpgrade('exotic',24)?'':'none');
		tmp.el["exb6_div"].changeStyle('display',hasUpgrade('exotic',25)?'':'none');
		tmp.el["exb6_div2"].changeStyle('display',hasUpgrade('exotic',25)?'':'none');
	}
	if (tmp.stab[8] == 3) {
		tmp.el.darkRay.setTxt(player.exotic.dr.format(0));
		tmp.el.darkShadow.setTxt(player.exotic.ds.format(0));
		tmp.el.ab_div.changeStyle('display',hasElement(414)?'':'none');
		tmp.el.abyssalBlot.setTxt(player.exotic.ab.format(0));
		tmp.el.drEff.setHTML(`
				Boosts dark shadow gain by <b>x${tmp.ex.drEff.ds.format(3)}</b><br>`+
				(hasElement(406)?`Boosts exotic matter gain by <b>x${tmp.ex.drEff.ex.format(3)}</b><br>`:"")
			);
		tmp.el.dsEff.setHTML(`
				Boosts exotic matter gain by <b>x${tmp.ex.dsEff.ex.format(3)}</b><br>
				Boosts dark ray gain by <b>x${tmp.ex.dsEff.ex.format(3)}</b><br>`+
				(hasElement(376)?`Meta-Supernova is <b>${E(100).sub(tmp.ex.dsEff.sn.mul(100)).format(3)}% weaker</b><br>`:"")+
				(hasElement(382)?`Boosts Galactic Quarks gain by <b>x${tmp.ex.dsEff.ex.format(3)}</b><br>`:"")+
				(hasElement(394)?`Boosts Entropy gain by <b>x${tmp.ex.dsEff.en.format(3)}</b><br>`:"")+
				(hasElement(400)?`Boosts Blueprint Particles gain by <b>^${tmp.ex.dsEff.bp.format(3)}</b><br>`:"")+
				(hasElement(414)?`Boosts Abyssal Blot gain by <b>x${tmp.ex.dsEff.ab.format(3)}</b><br>`:"")
			);
		tmp.el.abEff.setHTML(`
				Boosts dark shadow gain by <b>x${tmp.ex.abEff.ds.format(3)}</b><br>
				Exotic boosts are <b>x${tmp.ex.abEff.exb.format(3)}</b> stronger<br>`+
				(hasElement(420)?`Boosts Cosmic String power by <b>x${tmp.ex.abEff.csp.format(3)}</b><br>`:"")+
				(hasElement(426)?`Boosts dark ray gain by <b>x${tmp.ex.abEff.ds.format(3)}</b><br>`:"")+
				(hasElement(436)?`Boosts eternal mass gain by <b>x${tmp.ex.abEff.em.format(3)}</b><br>`:"")
			);
	}
}

function setupExoticHTML() {
    let new_table = new Element("ex_milestones_table")
    html = ""
    for (let x in EXOTIC.mils) {
        html += `
        <div id="ex_mil${x}" style="width: 100%; margin: 5px 0px; padding: 8px 0px; background-color: #4444; font-size: 14px;">
            <h2><span id="ex_mil_goal${x}">X</span> Exotic Resets</h2><br><br>
            ${EXOTIC.mils[x][1]}
        </div>
        `
    }
    new_table.setHTML(html)
}