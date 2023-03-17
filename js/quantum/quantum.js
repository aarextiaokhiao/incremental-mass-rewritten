const QUANTUM = {
    gain() {
		if (CHALS.inChal(13) || CHALS.inChal(19)) return E(0)
        let x = player.mass.max(1).log10().div(1e13)
        if (x.lt(1)) return E(0)
        x = x.max(0).pow(hasTree("qu11")?3:1.5)

        x = x.mul(tmp.qu.qc_s_eff)
        if (tmp.qu.mil_reached[4]) x = x.mul(2)
        if (hasTree("qf1")) x = x.mul(treeEff("qf1"))
        if (hasTree("qf2")) x = x.mul(treeEff("qf2"))
        if (hasTree("qf3")) x = x.mul(treeEff("qf3"))
        if (hasPrestige(0,2)) x = x.mul(4)
        if (hasPrestige(0,55)) x = x.mul(player.prestiges[0].max(1))
        if (hasPrestige(0,89)) x = x.mul(prestigeEff(0,89,[E(1),E(1)])[0]);
        if (hasUpgrade('inf',1)) x = x.mul(upgEffect(5,1))
        return x.floor()
    },
    gainTimes() {
		if (CHALS.inChal(13) || CHALS.inChal(19)) return E(0)
        let x = E(1)
        if (hasTree("qu7")) x = x.mul(treeEff("qu7"))
        if (hasTree("qu9")) x = x.mul(treeEff("qu9"))
        if (hasTree("qu_qol11")) x = x.mul(10)
        if (hasUpgrade('inf',1)) x = x.mul(player.inf.times.add(200))
        if (hasElement(216)) x = x.mul(tmp.elements.effect[216])
			
        x = x.mul(SUPERNOVA_GALAXY.effects.qut2())
        return x
    },
    enter(auto=false,force=false,rip=false,bd=false) {
		if(CHALS.inChal(14) || CHALS.inChal(19))rip = true, player.qu.rip.active = true;
		if(player.gc.active && player.gc.rip)rip = true, player.qu.rip.active = true;
        if (tmp.qu.gain.gte(1) || force) {
            if (player.confirms.qu&&!auto&&!force) if (confirm("Are you sure to go Quantum? Going Quantum will reset all previous except QoL mechanicals")?!confirm("ARE YOU SURE ABOUT IT???"):true) return
            if (QCs.active() && !rip && !bd && !player.qu.rip.active) {
                player.qu.qc.shard = tmp.qu.qc_s+tmp.qu.qc_s_bouns
                player.qu.qc.active = false
            }
            if (player.qu.times.gte(10) || force) {
                if (!force) {
                    player.qu.points = player.qu.points.add(tmp.qu.gain)
                    player.qu.times = player.qu.times.add(tmp.qu.gainTimes)
                }
                ENTROPY.reset(0)
                ENTROPY.reset(1)
                updateQuantumTemp()
                this.doReset(force)
                if (rip) {
                    if (hasUpgrade('br',4)) for (let x = 0; x < 2; x++) for (let y = 0; y < 6; y++) player.supernova.fermions.tiers[x][y] = E(2)
                }
            } else {
                document.body.style.animation = "implode 2s 1"
                setTimeout(_=>{
                    if (player.qu.times.lte(0)) {
                        addPopup(POPUP_GROUPS.qus1);
                        addPopup(POPUP_GROUPS.qus2);
                    }
                    
                    player.qu.points = player.qu.points.add(tmp.qu.gain)
                    player.qu.times = player.qu.times.add(tmp.qu.gainTimes)

                    updateQuantumTemp()
                    
                    this.doReset(force)
                },1000)
                setTimeout(_=>{
                    document.body.style.animation = ""
                },2000)
            }
            player.qu.auto.time = 0
        }
    },
    doReset(force=false) {
        player.supernova.times = E(0)
        player.supernova.stars = E(0)

        let keep = ['qol1','qol2','qol3','qol4','qol5','qol6','fn2','fn5','fn6','fn7','fn8','fn9','fn10','fn11']
        for (let x = 0; x < tmp.supernova.tree_had.length; x++) if (TREE_UPGS.ids[tmp.supernova.tree_had[x]].qf) keep.push(tmp.supernova.tree_had[x])
        if (tmp.qu.mil_reached[2]) keep.push('chal1','chal2','chal3','chal4','chal4a','chal5','chal6','chal7','c','qol7','chal4b','chal7a','chal8')
        if (tmp.qu.mil_reached[3]) {
            if (!force) keep.push('unl1')
            keep.push('qol8','qol9')
        }
        if (hasUpgrade('br',6) && !keep.includes('unl1')) keep.push('unl1')

        let save_keep = []
        for (let x in keep) if (hasTree(keep[x])) save_keep.push(keep[x])
        if(player.superGal.lt(5))player.supernova.tree = save_keep

        player.supernova.bosons = {
            pos_w: E(0),
            neg_w: E(0),
            z_boson: E(0),
            photon: E(0),
            gluon: E(0),
            graviton: E(0),
            hb: E(0),
        }
        for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)

        player.supernova.fermions.points = [E(0),E(0)]
        player.supernova.fermions.choosed = ""

        for (let x = 0; x < 2; x++) if (!hasTree("qu_qol"+(2+4*x)) || force) player.supernova.fermions.tiers[x] = [E(0),E(0),E(0),E(0),E(0),E(0)]

        player.supernova.radiation.hz = hasUpgrade('br',6)?E(1e50):E(0)
        for (let x = 0; x < 7; x++) {
            player.supernova.radiation.ds[x] = E(0)
            for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
        }

        for (let x = 1; x <= 12; x++) if (!hasTree("qu_qol7") || x <= 8 || force) player.chal.comps[x] = E(0)

        SUPERNOVA.doReset()

        tmp.pass = false
    },
    bpGain() {
		if (CHALS.inChal(13) || CHALS.inChal(19)) return E(0)
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.preQUGlobalSpeed.root(2).softcap(1e50,0.95,2))
        if (hasTree('qu5')) x = x.mul(tmp.supernova.tree_eff.qu5)
        x = x.mul(tmp.qu.cosmic_str_eff.eff)
        if (hasPrestige(0,88)) x = x.mul(prestigeEff(0,88,[E(1),E(1)])[0]);
        return x
    },
    bpEff() {
        let x = hasElement(101) ? player.qu.bp.add(1).log10().add(1).tetrate(hasUpgrade("br",15) ? 1.35 : 1.25) : player.qu.bp.add(1).log10().add(1).pow(1.5)
		if(hasPrestige(0,100))x = x.pow(1.02)
        return x
    },
    cosmic_str: {
        buy() {
            if (tmp.qu.cosmic_str_can) {
                player.qu.points = player.qu.points.sub(tmp.qu.cosmic_str_cost).max(0)
                player.qu.cosmic_str = player.qu.cosmic_str.add(1)
            }
        },
        buyMax() {
            if (tmp.qu.cosmic_str_can) {
                player.qu.cosmic_str = tmp.qu.cosmic_str_bulk
                player.qu.points = player.qu.points.sub(tmp.qu.cosmic_str_cost).max(0)
            }
        },
        eff() {
            let pow = E(2)
            if (hasTree('qu6')) pow = pow.mul(treeEff('qu6'))
            let x = pow.pow(player.qu.cosmic_str)
            return {pow: pow, eff: x}
        },
    },
    mils: [
        [E(1), `You start with QoL (qol1-6), Bosons & Fermions unlocked.`],
        [E(2), `Pre-Quantum Supernova tree will be without the requirement. Pre-Quantum global speed is increased by 10x.`],
        [E(3), `You start with the pre-Quantum tree of Challenges, tree [c, qol7] unlocked.`],
        [E(5), `You start with QoL (qol8-9 & unl1), Radiation unlocked.`],
        [E(6), `Double Quantum Foam gain.`],
        [E(8), `Pre-Quantum global speed can affect Blueprint Particle & Chroma at a reduced rate.`],
        [E(10), `Supernova stars are boosted by Quantum times (capped at 1e10). Unlock Auto-Quantum.`],
    ],
    auto: {
        mode: ["Amount","Time"],
        switch() { player.qu.auto.enabled = !player.qu.auto.enabled; player.qu.auto.time = 0 },
        switchMode() { player.qu.auto.mode = (player.qu.auto.mode+1)%this.mode.length; player.qu.auto.time = 0 },
        temp() {
            let n, i = player.qu.auto.input
            if (player.qu.auto.mode==0) {
                n = E(i)
                if (isNaN(n.mag) || n.lt(0)) n = E(1)
                n = n.floor()
            } else if (player.qu.auto.mode==1) {
                n = Number(i)
                if (isNaN(n) || n < 0 || !isFinite(n)) n = 1
            }
            return n
        }
    },
}

function quUnl() { return player.qu.times.gte(1) }

function getQUSave() {
    let s = {
        reached: false,
        auto: {
            enabled: false,
            time: 0,
            mode: 0,
            input: "1",
        },
        points: E(0),
        times: E(0),
        bp: E(0),
        cosmic_str: E(0),

        chr_get: [],
        chroma: [E(0),E(0),E(0)],

        prim: {
            theorems: E(0),
            particles: [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)],
        },
        
        qc: {
            shard: 0,
            presets: [],
            mods: [0,0,0,0,0,0,0,0],
            active: false,
        },

        en: {
            unl: false,
            amt: E(0),
            eth: [false,E(0),E(0),0],
            hr: [false,E(0),E(0),0],
            rewards: [],
        },

        rip: {
            active: false,
            first: false,
            amt: E(0),
        },
    }
    for (let x = 0; x < ENTROPY.rewards.length; x++) s.en.rewards.push(E(0))
    return s
}

function calcQuantum(dt, dt_offline) {
    if (player.mass.gte(mlt(1e4)) && !player.qu.reached && player.chal.comps[12].gte(1)) {
        player.qu.reached = true
        addPopup(POPUP_GROUPS.qu)
    }

    if (quUnl()) {
        player.qu.bp = player.qu.bp.add(tmp.qu.bpGain.mul(dt))
        for (let x = 0; x < CHROMA_LEN; x++) player.qu.chroma[x] = player.qu.chroma[x].add(tmp.qu.chroma_gain[x].mul(dt))

        if (PRIM.unl()) {
            player.qu.prim.theorems = player.qu.prim.theorems.max(tmp.prim.theorems)
        }

        if (player.qu.auto.enabled) {
            player.qu.auto.time += dt_offline

            let can = false
            if (player.qu.auto.mode == 0) can = tmp.qu.gain.gte(tmp.qu.auto_input)
            else if (player.qu.auto.mode == 1) can = player.qu.auto.time >= tmp.qu.auto_input
            if (can) QUANTUM.enter(true)
        }

        if (hasUpgrade('br',8)) {
            player.qu.points = player.qu.points.add(tmp.qu.gain.mul(dt/(hasTree('qu_qol11')?1:10)))
            if (player.qu.rip.active || hasTree('qu_qol12')) player.qu.rip.amt = player.qu.rip.amt.add(tmp.rip.gain.mul(dt/10))
        }

        if (hasTree('qu_qol11')) {
            player.qu.times = player.qu.times.add(tmp.qu.gainTimes.mul(dt))
        }
    }

    if (player.mass.gte(mlt(7.5e6)) && !player.qu.en.unl) {
        player.qu.en.unl = true
        addPopup(POPUP_GROUPS.en)
    }

    if (hasUpgrade('br',9)) {
        player.md.break.energy = player.md.break.energy.add(tmp.bd.energyGain.mul(dt))
        player.md.break.mass = player.md.break.mass.add(tmp.bd.massGain.mul(dt))
    }

    if (hasTree("qu_qol1")) for (let x = 0; x < tmp.supernova.auto_tree.length; x++) TREE_UPGS.buy(tmp.supernova.auto_tree[x], true)

    calcEntropy(dt, dt_offline)
}

function updateQuantumTemp() {
    updateBigRipTemp()
    updateEntropyTemp()
    updateQCTemp()
    updatePrimordiumTemp()
    updateChromaTemp()

    tmp.qu.gain = QUANTUM.gain()
    tmp.qu.gainTimes = QUANTUM.gainTimes()

    tmp.qu.theories = player.qu.times.sub(player.qu.chr_get.length).max(0).min(3).toNumber()
    tmp.qu.pick_chr = tmp.qu.theories > 0

    tmp.qu.cosmic_str_cost = E(2).pow(player.qu.cosmic_str.scaleEvery("cosmic_str").add(1)).floor()
    tmp.qu.cosmic_str_bulk = player.qu.points.max(1).log(2).scaleEvery("cosmic_str",true).add(scalingActive('cosmic_str',player.qu.cosmic_str.max(tmp.qu.cosmic_str_bulk),'super')?1:0).floor()

	if (hasElement(187))tmp.qu.cosmic_str_bulk = player.qu.points.max(1).log(2).scaleEvery("cosmic_str",true).add(1).floor()

    tmp.qu.cosmic_str_can = player.qu.points.gte(tmp.qu.cosmic_str_cost)
    tmp.qu.cosmic_str_eff = QUANTUM.cosmic_str.eff()

    tmp.qu.bpGain = QUANTUM.bpGain()
    tmp.qu.bpEff = QUANTUM.bpEff()

    for (let x = 0; x < QUANTUM.mils.length; x++) tmp.qu.mil_reached[x] = player.qu.times.gte(QUANTUM.mils[x][0])

    tmp.qu.auto_input = QUANTUM.auto.temp()
}

function updateQuantumHTML() {
    let gain2 = hasUpgrade('br',8)

    let unl = quUnl() || player.chal.comps[12].gte(1)
    tmp.el.qu_div.setDisplay(unl)
    if (unl) tmp.el.quAmt.setHTML(format(player.qu.points,0)+"<br>"+(gain2?player.qu.points.formatGain(tmp.qu.gain.div(hasTree('qu_qol11')?1:10)):"(+"+format(tmp.qu.gain,0)+")"))

    unl = quUnl() || player.superGal.gte(1)
    tmp.el.gs1_div.setDisplay(unl)
    if (unl) tmp.el.preQGSpeed.setHTML(formatMult(tmp.preQUGlobalSpeed))

    unl = hasTree("unl4")
    tmp.el.br_div.setDisplay(unl)
    if (unl) tmp.el.brAmt.setHTML(player.qu.rip.amt.format(0)+"<br>"+((player.qu.rip.active || (hasTree('qu_qol12') && gain2))?gain2?player.qu.rip.amt.formatGain(tmp.rip.gain.div(10)):`(+${tmp.rip.gain.format(0)})`:"(inactive)"))
	if (tmp.rip.gain.gte(Number.MAX_VALUE)){
		tmp.el.brAmt.setHTML(player.qu.rip.amt.format(0)+"<br>"+((player.qu.rip.active || (hasTree('qu_qol12') && gain2))?gain2?player.qu.rip.amt.formatGain(tmp.rip.gain.div(10))+	`<span class="soft">(softcapped)</span>`:`(+${tmp.rip.gain.format(0)}) <span class="soft">(softcapped)</span>`:"(inactive)"))
	}
	
    if (tmp.tab == 0 && tmp.stab[0] == 3) {
        tmp.el.bpAmt.setTxt(format(player.qu.bp,1)+" "+formatGain(player.qu.bp,tmp.qu.bpGain))
        tmp.el.bpEff.setTxt(format(tmp.qu.bpEff))

        tmp.el.cosmic_str_lvl.setTxt(format(player.qu.cosmic_str,0))//+(tmp.qu.cosmic_str_bonus.gte(1)?" + "+format(tmp.qu.cosmic_str_bonus,0):"")
        tmp.el.cosmic_str_btn.setClasses({btn: true, locked: !tmp.qu.cosmic_str_can})
        tmp.el.cosmic_str_scale.setTxt(getScalingName('cosmic_str'))
        tmp.el.cosmic_str_cost.setTxt(format(tmp.qu.cosmic_str_cost,0))
        tmp.el.cosmic_str_pow.setTxt(format(tmp.qu.cosmic_str_eff.pow))
        tmp.el.cosmic_str_eff.setHTML(format(tmp.qu.cosmic_str_eff.eff))
        tmp.el.cosmic_str_auto.setDisplay(hasElement(131))
	    tmp.el.cosmic_str_auto.setTxt(player.qu.auto_cs?"ON":"OFF")
    }

    if (tmp.tab == 6) {
        if (tmp.stab[6] == 0) updateChromaHTML()
        if (tmp.stab[6] == 1) updatePrimordiumHTML()
        if (tmp.stab[6] == 2) updateEntropyHTML()
        if (tmp.stab[6] == 3) updateBDHTML()
        if (tmp.stab[6] == 4) {
            tmp.el.qu_times.setTxt(format(player.qu.times,0))

			if(hasTree('qu_qol11')){
				tmp.el.qu_times.setTxt(format(player.qu.times,0)+player.qu.times.formatGain(tmp.qu.gainTimes))
			}
			
            for (let x = 0; x < QUANTUM.mils.length; x++) {
                tmp.el['qu_mil'+x].changeStyle('background-color',tmp.qu.mil_reached[x]?'#2f22':'#4442')
                tmp.el['qu_mil_goal'+x].setTxt(format(QUANTUM.mils[x][0],0))
            }
        }
        if (tmp.stab[6] == 5) {
            tmp.el.auto_qu.setTxt(player.qu.auto.enabled?"ON":"OFF")
            tmp.el.auto_qu_mode.setTxt(QUANTUM.auto.mode[player.qu.auto.mode])
            tmp.el.auto_qu_res.setTxt(player.qu.auto.mode==0?format(tmp.qu.auto_input,0):formatTime(tmp.qu.auto_input,1)+"s")
        }
    }
}

function setupQuantumHTML() {
    let new_table = new Element("chroma_table")
    let html = ""
    for (let x = 0; x < CHROMA_LEN; x++) {
        let n = CHROMA.names[x]
        let id = "chroma_"+x

        html += `
        <div style="width: 33%">
            <div style="height: 60px">
                <button id="${id}_btn" class="btn" onclick="CHROMA.getChroma(${x})">Require Quantum Theory to start generating ${n[1]}</button>
            </div>
            <br>
            <img src="images/chroma${x}.png">
            <div style="width: 100%; color: #${n[2]}; background: linear-gradient(90deg, #${n[2]}0 0%, #${n[2]}2 10%, #${n[2]}2 90%, #${n[2]}0 100%); padding: 8px 0px; margin: 8px 0;">
                <h2>${n[1]}</h2><br><br>
                You have <span id="${id}_amt">0</span> ${n[0]} Chroma, which<br>
                <span id="${id}_eff"></span>
            </div>
        </div>
        `
    }
    new_table.setHTML(html)

    new_table = new Element("qu_milestones_table")
    html = ""
    for (let x in QUANTUM.mils) {
        html += `
        <div id="qu_mil${x}" style="width: 100%; margin: 5px 0px; padding: 8px 0px; background-color: #4444; font-size: 14px;">
            <h2>Quantized <span id="qu_mil_goal${x}">X</span> times</h2><br><br>
            ${QUANTUM.mils[x][1]}
        </div>
        `
    }
    new_table.setHTML(html)

    new_table = new Element("primordium_table")
    html = ""
    for (let x in PRIM.particle.names) {
        html += `
        <div class="primordium table_center">
            <div style="width: 350px; height: 60px;">
                <h2>${PRIM.particle.names[x]} Particles</h2><br>
                 - [<span id="prim_part${x}">0</span>]
            </div><div style="width: 700px;" id="prim_part_eff${x}"></div>
        </div>
        `
    }
    new_table.setHTML(html)

    setupQCHTML()
    setupEntropyHTML()
}