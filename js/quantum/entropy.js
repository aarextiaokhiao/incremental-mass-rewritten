const ENTROPY = {
    ids: ['eth','hr'],
    switch(x) {
        let i = this.ids[x]
        player.qu.en[i][0] = !player.qu.en[i][0]
        if (!player.qu.en[i][0]) {
            player.qu.en[i][3] = 0
            player.qu.en[i][2] = player.qu.en[i][2].max(player.qu.en[i][1])
            player.qu.en[i][1] = E(0)
        }
    },
    reset(x) {
        let i = this.ids[x]
        player.qu.en[i][0] = false
        player.qu.en[i][1] = E(0)
        player.qu.en[i][3] = 0
    },
    gain() {
		if (CHALS.inChal(13) || CHALS.inChal(19)) return E(0)
        let x = tmp.en.eff.eth.mul(getEnRewardEff(6))
        if (hasElement(93)) x = x.mul(tmp.elements.effect[93]||1)
        if (player.md.break.upgs[6].gte(1)) x = x.mul(tmp.bd.upgs[6].eff?tmp.bd.upgs[6].eff[0]:1)
        if (hasTree("en2")) x = x.mul(tmp.supernova.tree_eff.en2||1)
		if (hasPrestige(1,11)) x = x.mul(prestigeEff(1,11,[E(1),E(1)])[0]);
        if (hasUpgrade('inf',2)) x = x.mul(upgEffect(5,2).pow(0.1).mul(2))
        if (hasElement(125)) x = x.mul(tmp.elements.effect[125]||1)
		if (hasPrestige(2,5)) x = x.mul(prestigeEff(2,5));
		if (player.ranks.hex.gte(125)) x = x.mul(player.ranks.hex.add(1));
        if (hasElement(139)) x = x.mul(tmp.elements.effect[139]||1)
		if (player.ranks.hept.gte(52)) x = x.mul(E(10).pow(player.ranks.hept));
		x = x.mul(SUPERNOVA_GALAXY.effects.entropyg())
		if(hasElement(394)) x = x.mul(EXOTIC.dsEff().en)
	
        return x
    },
    cap() {
        let x = tmp.en.eff.hr
        if (hasUpgrade('inf',2)) x = x.mul(upgEffect(5,2))
		x = x.mul(SUPERNOVA_GALAXY.effects.entropy())
        return x
    },
    evaPow(i) {
        let x = 1
        if (hasTree("en1")) x *= 2
        return x
    },
    evaGain(i) {
        let x = E(player.qu.en[this.ids[i]][3]+1).pow(this.evaPow(i)).mul(getEnRewardEff(2))
        return x
    },
    evaEff(i) {
        let x
        let y = player.qu.en[this.ids[i]][2].max(0)
        if (i==0) {
            x = y.pow(hasTree("en1")?1.5:1).div(2)
        } else if (i==1) {
            x = y.pow(hasTree("en1")?3:2).mul(10)
        }
        return x
    },
    rewards: [
        {
            title: "Entropic Multiplier",

            start: E(100),
            inc: E(10),

            eff(i) {
				if(hasUpgrade('bh',24))return E(10).pow(i);
                let x = player.ranks.hex.gte(114) ? i.add(1) : hasElement(114) ? i.add(1).root(1.5) : i.div(2).add(1).root(3)
                return x
            },
            desc(x) { return `Meta Tickspeed, BHC & Cosmic Ray start <b>${x.format()}x</b> later.` },
        },{
            title: "Entropic Accelerator",

            start: E(1000),
            inc: E(20),

            eff(i) {
				if(hasElement(398))return i.pow(0.5).add(1);
				if(hasElement(352))return i.pow(0.5).div(5).add(1)
                let x = i.pow(0.5).div(5).add(1).softcap(11,hasElement(269)?0.95:0.1,0).softcap(52,0.1,0)
                return x
            },
            desc(x) { return `Atomic Power’s effect is <b>${formatPercent(x.sub(1))}</b> exponentially stronger.` },
        },{
            title: "Entropic Evaporation",

            start: E(1000),
            inc: E(10),

            scale: {s: 10, p: 2},

            eff(i) {
                let b = 3
                if (hasElement(97)) b++
                if (player.ranks.hex.gte(97)) b+=0.1
                if (hasChargedElement(97)) b+=0.1
                let x = Decimal.pow(b,i)
                return x
            },
            desc(x) { return `Make evaporated resources gain <b>${x.format(1)}x</b> faster.` },
        },{
            title: "Entropic Converter",

            start: E(10000),
            inc: E(2),

            eff(i) {
                let x = i.div(QCs.active()?100:5).softcap(2,0.5,0)
                let y = tmp.tickspeedEffect?tmp.tickspeedEffect.step.pow(x):E(1)
                return [x,y]
            },
            desc(x) { return `Tickspeed Power gives <b>^${x[0].format(2)}</b> boost to BHC & Cosmic Ray Powers.<br>Currently: <b>${x[1].format()}x</b>` },
        },{
            title: "Entropic Booster",

            start: E(250000),
            inc: E(2),

            eff(i) {
				if(hasElement(398))return E(2).pow(i);
                let x = i.pow(2).div(20).add(1)
                return x
            },
            desc(x) { return `<b>x${x.format(2)}</b> extra Mass upgrades, Tickspeed, BHC and Cosmic Ray.` },
        },{
            title: "Entropic Scaling",

            start: E(1e7),
            inc: E(10),

            eff(i) {
				if(hasElement(398))return E(0)
                let x = i.root(2).div(10).add(1).pow(-1)
				if(x.lt(0.07)&&!hasElement(352))x = x.mul(0.0049).cbrt()
				if(x.lt(0.05)&&!hasElement(352))x = x.mul(0.0025).cbrt()
                return x
            },
            desc(x) { return `All pre-Supernova scaling is <b>${formatReduction(x)}</b> weaker before Meta scaling (not including Pent).` },
        },{
            title: "Entropic Condenser",

            start: E(1e6),
            inc: E(100),

            scale: {s: 5, p: 2.5},

            eff(i) {
                let x = player.qu.en.amt.add(1).log10().mul(2).add(1).pow(i.pow(hasChargedElement(91)?0.835:0.8))
                return x
            },
            desc(x) { return `Entropy boosts itself by <b>${x.format(2)}x</b>.` },
        },{
            title: "Entropic Radiation",

            start: E(1e10),
            inc: E(1.5),

            scale: {s: 20, p: 2.5},

            eff(i) {
                let x = player.qu.en.amt.add(1).log10().pow(0.75).mul(i).div(1500).add(1)
                return x
            },
            desc(x) { return `Radiation effects are also boosted by <b>^${x.format()}</b> (based on Entropy).` },
        },

        /*
        {
            title: "Entropic Placeholder",

            start: E(100),
            inc: E(10),

            eff(i) {
                let x = E(1)
                return x
            },
            desc(x) { return `Placeholder.` },
        },
        */
    ],
    nextReward(i) {
        let rc = this.rewards[i]
        let r = player.qu.en.rewards[i]

        if (rc.scale) {
            let p = rc.scale.p
            if ((i == 2 || i == 6) && hasElement(106)) p = p**0.85
			if (i == 2 && hasPrestige(0,91)) p = p ** 0.8
				if (i == 2 && hasPrestige(0,115)) p = p ** 0.95
				if (i == 2 && hasPrestige(0,131)) p = p ** 0.95
				if (i == 2 && hasPrestige(0,141)) p = p ** 0.95
				if (i == 6 && hasElement(138)) p = p ** 0.85
				if (i == 7 && hasElement(141)) p = p ** 0.8
				if (i == 6 && hasElement(144)) p = p ** 0.85
				if (i == 6 && hasElement(151)) p = p ** 0.85
				if (i == 2 && hasElement(165)) p = p ** 0.95
				if (i == 6 && hasElement(167)) p = p ** 0.85
				if (i == 6 && hasElement(177)) p = p ** 0.85
				if (i == 6 && hasElement(197)) p = p ** 0.85
				if (i == 2 && hasElement(198)) p = p ** 0.9
				if (i == 7 && hasElement(201)) p = p ** 0.75
				if (i == 7 && hasElement(208)) p = p ** 0.5
				if (i == 6 && hasElement(266)) p = p ** 0.1
				if (i == 7 && hasElement(266)) p = p ** 0.1
				if (i == 2 && hasElement(352)) p = p ** 0.25
				if (i == 2 && player.qu.times.gte("6.9e420") && player.exotic.times.gte(1)) p = p ** 0.5
				if (i == 7 && hasElement(398)) p = 1
				if (i == 6 && hasAscension(0, 22)) p = 1
				if (i == 2 && hasAscension(0, 42)) p = p ** 0.8
				if (i == 2 && hasChargedElement(96)) p = p ** 0.9
            r = r.scale(rc.scale.s, p, 0)
        }
        let x = rc.inc.pow(r).mul(rc.start)
        return x
    },
    getRewards(i) {
        let rc = this.rewards[i]
        let en = player.qu.en.amt

        let x = E(0)
        if (en.gte(rc.start)) {
            x = en.div(rc.start).max(1).log(rc.inc)
            if (rc.scale) {
                let p = rc.scale.p
                if ((i == 2 || i == 6) && hasElement(106)) p = p**0.85
				if (i == 2 && hasPrestige(0,91)) p = p ** 0.8
				if (i == 2 && hasPrestige(0,115)) p = p ** 0.95
				if (i == 2 && hasPrestige(0,131)) p = p ** 0.95
				if (i == 2 && hasPrestige(0,141)) p = p ** 0.95
				if (i == 6 && hasElement(138)) p = p ** 0.85
				if (i == 7 && hasElement(141)) p = p ** 0.8
				if (i == 6 && hasElement(144)) p = p ** 0.85
				if (i == 6 && hasElement(151)) p = p ** 0.85
				if (i == 2 && hasElement(165)) p = p ** 0.95
				if (i == 6 && hasElement(167)) p = p ** 0.85
				if (i == 6 && hasElement(177)) p = p ** 0.85
				if (i == 6 && hasElement(197)) p = p ** 0.85
				if (i == 2 && hasElement(198)) p = p ** 0.9
				if (i == 7 && hasElement(201)) p = p ** 0.75
				if (i == 7 && hasElement(208)) p = p ** 0.5
				if (i == 6 && hasElement(266)) p = p ** 0.1
				if (i == 7 && hasElement(266)) p = p ** 0.1
				if (i == 2 && hasElement(352)) p = p ** 0.25
				if (i == 2 && player.qu.times.gte("6.9e420") && player.exotic.times.gte(1)) p = p ** 0.5
				if (i == 7 && hasElement(398)) p = 1
				if (i == 6 && hasAscension(0, 22)) p = 1
				if (i == 2 && hasAscension(0, 42)) p = p ** 0.8
				if (i == 2 && hasChargedElement(96)) p = p ** 0.9
                x = x.scale(rc.scale.s, p, 0, true)
            }
            x = x.add(1).floor()
        }
        return x
    },
    getRewardEffect(i) {
        if (player.qu.rip.active && !tmp.en.reward_br.includes(i)) return E(0)
        let x = player.qu.en.rewards[i]

        if (hasElement(91) && player.qu.rip.active && (i==1||i==4)) x = x.mul(0.1)

        return x
    },
}

function getEnRewardEff(x,def=1) { return tmp.en.rewards_eff[x] ?? E(def) }

function calcEntropy(dt, dt_offline) {
	if(hasTree('qu_qol10')){
		let s1 = Decimal.pow(4,player.supernova.radiation.hz.add(1).log10().add(1).log10().add(1).log10().add(1)).mul(2.25);
		if(hasElement(268))s1 = Decimal.pow(10,overflow(player.supernova.radiation.hz.add(1).log10().add(1).log10().pow(0.75).mul(2),1e10,0.5));
		else if (hasTree("en1")) s1 = s1.add(s1.pow(2)).add(s1.pow(3).div(3)); else s1 = s1.add(s1.pow(2).div(2));
		s1 = s1.mul(getEnRewardEff(2));
		if(player.qu.en.eth[2].lt(s1))player.qu.en.eth[2] = s1;
		s1 = Decimal.pow(4,player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1)).mul(2.25);
		if(hasUpgrade('exotic',8))s1 = Decimal.pow(10,player.bh.mass.add(1).log10().add(1).log10().pow(0.5).mul(2));
		else if (hasTree("en1")) s1 = s1.add(s1.pow(2)).add(s1.pow(3).div(3)); else s1 = s1.add(s1.pow(2).div(2));
		s1 = s1.mul(getEnRewardEff(2));
		if(player.qu.en.hr[2].lt(s1))player.qu.en.hr[2] = s1;
	}
    if (player.qu.en.eth[0]) {
		if(hasElement(268)){
			player.qu.en.eth[1] = Decimal.pow(10,overflow(player.supernova.radiation.hz.add(1).log10().add(1).log10().pow(0.75).mul(2),1e10,0.5)).mul(getEnRewardEff(2));
			ENTROPY.switch(0)
		}else{
			player.qu.en.eth[3] += dt
			player.qu.en.eth[1] = player.qu.en.eth[1].add(tmp.en.gain.eth.mul(dt))
			let s = player.supernova.radiation.hz.div(player.supernova.radiation.hz.max(1).pow(dt).pow(player.qu.en.eth[3]**(2/3))).sub(1)
			if (s.lt(1)) ENTROPY.switch(0)
			else player.supernova.radiation.hz = s
		}
    }
    if (player.qu.en.hr[0]) {
		if(hasUpgrade('exotic',8)){
			player.qu.en.hr[1] = Decimal.pow(10,player.bh.mass.add(1).log10().add(1).log10().pow(0.5).mul(2)).mul(getEnRewardEff(2));
			ENTROPY.switch(1)
		}else{
			player.qu.en.hr[3] += dt
			player.qu.en.hr[1] = player.qu.en.hr[1].add(tmp.en.gain.hr.mul(dt))
			let s = player.bh.mass.div(player.bh.mass.max(1).pow(dt).pow(player.qu.en.hr[3]**(2/3))).sub(1)
			if (s.lt(1)) ENTROPY.switch(1)
			else player.bh.mass = s
		}
    }
    player.qu.en.amt = player.qu.en.amt.add(tmp.en.gain.amt.mul(dt)).min(tmp.en.cap)
    for (let x = 0; x < ENTROPY.rewards.length; x++) player.qu.en.rewards[x] = player.qu.en.rewards[x].max(tmp.en.rewards[x])
}

function updateEntropyTemp() {
    let rbr = []
    if (hasElement(91)) rbr.push(1,4)
    if (hasElement(96)) rbr.push(3)
    if (hasElement(109)) rbr.push(0)
    tmp.en.reward_br = rbr

    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        tmp.en.rewards[x] = ENTROPY.getRewards(x)
        tmp.en.rewards_eff[x] = rc.eff(ENTROPY.getRewardEffect(x))
    }
    for (let x = 0; x < 2; x++) {
        let id = ENTROPY.ids[x]
        tmp.en.gain[id] = ENTROPY.evaGain(x)
        tmp.en.eff[id] = ENTROPY.evaEff(x)
    }
    tmp.en.gain.amt = ENTROPY.gain()
    tmp.en.cap = ENTROPY.cap()
}

function updateEntropyHTML() {
    tmp.el.enEva1.setTxt(player.supernova.radiation.hz.format())
    tmp.el.enEva2.setTxt(formatMass(player.bh.mass))

    tmp.el.enAmt1.setTxt(player.qu.en.eth[2].format())
    tmp.el.enAmt2.setTxt(player.qu.en.amt.format(1) + " / " + tmp.en.cap.format(1))
    tmp.el.enAmt3.setTxt(player.qu.en.hr[2].format())

    tmp.el.enGain.setTxt(player.qu.en.amt.formatGain(tmp.en.gain.amt))

    tmp.el.enEff1.setTxt(tmp.en.eff.eth.format(1))
    tmp.el.enEff2.setTxt(tmp.en.eff.hr.format(1))

    tmp.el.evaBtn1.setHTML(
        player.qu.en.eth[0]
        ? `Stop Evaporating to get<br>${player.qu.en.eth[1].format()}<br>best Enthalpy`
        : `Evaporate your frequency to gain Enthalpy`
    )
    tmp.el.evaBtn2.setHTML(
        player.qu.en.hr[0]
        ? `Stop Evaporating to get<br>${player.qu.en.hr[1].format()}<br>best Hawking Radiation`
        : `Evaporate your mass of Black Hole to gain Hawking Radiation`
    )

    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rs = player.qu.en.rewards[x]
        let rc = ENTROPY.rewards[x]
        tmp.el["en_reward"+x].setTxt(rs.format(0))
        tmp.el["en_scale"+x].setTxt((x == 6 && hasAscension(0, 22))?"":(x == 7 && hasElement(398))?"":(rc.scale?rs.gte(rc.scale.s)?"2":"":""))
        tmp.el["en_reward_next"+x].setTxt(ENTROPY.nextReward(x).format())
        tmp.el["en_reward_eff"+x].setHTML(rc.desc(getEnRewardEff(x)))
    }
}

function setupEntropyHTML() {
    let table = new Element("en_table")
    let html = ""
    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        html += `
        <div class="en_reward_div">
            <div style="text-align: left; width: 312px;">
                <b class="en_sub_reward">${rc.title}<sup id="en_scale${x}"></sup>:</b> <span id="en_reward${x}">0</span><br>
                <b class="en_sub_reward">Next at: </b> <span id="en_reward_next${x}">0</span>
            </div>
            <div class="en_reward">
                <span id="en_reward_eff${x}"></span>
            </div>
        </div>
        `
    }
    table.setHTML(html)
}