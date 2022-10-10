const SUPERNOVA = {
    reset(force=false) {
        if (!force && !tmp.supernova.reached) return
        if (force && toConfirm('supernova')) return

		if (hasTree("qol8") && player.supernova.auto.toggle && player.supernova.auto.on == -2 && !force) startSupernovaSweep()

		elm.supernova_scene.setDisplay(false)
		if (!force) {
			if (EXT.unl()) {
				if (player.supernova.times.gt(20) && tmp.supernova.bulk.sub(player.supernova.times).lt(5)) player.ext.chal.f8 = false
				if (player.supernova.times.gt(100) && tmp.supernova.bulk.div(player.supernova.times).gte(1.1) && player.supernova.fermions.choosed && player.supernova.fermions.choosed2) player.ext.chal.f10 = true
			}
			if (hasExtMilestone("qol", 4)) player.ranks.pent = player.ranks.pent.max(tmp.ranks.pent.bulk)
			player.supernova.times = player.supernova.post_10 ? player.supernova.times.max(tmp.supernova.bulk) : player.supernova.times.add(1)
		}
		this.doReset()
    },
    doReset() {
        player.supernova.unl = true
        player.supernova.maxMass = D(0)
        player.supernova.auto.t = 0

        player.atom.points = D(0)
        player.atom.quarks = D(0)
        player.atom.particles = [D(0),D(0),D(0)]
        player.atom.powers = [D(0),D(0),D(0)]
        player.atom.atomic = D(0)
        player.atom.gamma_ray = D(0)
		resetExtraBuildings("ag")
        
        let list_keep = [2,5]
        if (hasTree("qol2")) list_keep.push(6)
        let keep = []
        for (let x = 0; x < player.mainUpg.atom.length; x++) if (list_keep.includes(player.mainUpg.atom[x])) keep.push(player.mainUpg.atom[x])
        player.mainUpg.atom = keep

        list_keep = [21,36]
        if (hasTree("qol1")) list_keep.push(14,18)
        if (hasTree("qol2")) list_keep.push(24)
        if (hasTree("qol3")) list_keep.push(43)
        if (hasExtMilestone("qol", 1)) list_keep.push(11)
        keep = []
        for (let x = 0; x < player.atom.elements.length; x++) if (list_keep.includes(player.atom.elements[x])) keep.push(player.atom.elements[x])
        player.atom.elements = keep

        player.md.active = false
        player.md.particles = D(0)
        player.md.mass = D(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = D(0)

        player.stars.unls = 0
        player.stars.generators = [D(0),D(0),D(0),D(0),D(0)]
        player.stars.points = D(0)
        player.stars.boost = D(0)

        if (!hasTree("chal3")) CHALS_NEW.clear(1)

        ATOM.doReset()

        player.supernova.chal.noTick = true
        player.supernova.chal.noBHC = true

        tmp.pass = false
    },
    starGain() {
        let x = D(hasTree("c")?0.1:0)
        if (hasTree("sn1")) x = x.mul(treeEff("sn1"))
        if (hasTree("sn2")) x = x.mul(treeEff("sn2"))
        if (hasTree("sn3")) x = x.mul(treeEff("sn3"))
        if (hasTree("bs3")) x = x.mul(treeEff("bs3"))
        if (hasElement(74)) x = x.mul(tmp.elements && tmp.elements.effect[74])
        x = x.mul(tmp.radiation.bs.eff[11])
        x = x.mul(tmp.extMult)
        return x
    },
    req(x=player.supernova.times) {
        ml_fp = D(scalingToned("supernova")?1:tmp.bosons.upgs.gluon[3].effect)
        ml_fp2 = D(1)
        exp = scalingInitPower("supernova")
        maxlimit = D(1e20).pow(x.scaleEvery("supernova").div(ml_fp).pow(exp)).mul(1e90).root(ml_fp2)
        bulk = player.stars.points.pow(ml_fp2).div(1e90).max(1).log(1e20).max(0).root(exp).mul(ml_fp).scaleEvery("supernova",1).add(1).floor()
        if (player.stars.points.lt(maxlimit)) bulk = D(0)
        return {maxlimit: maxlimit, bulk: bulk}
    },
}

function calcSupernova(dt, dt_offline) {
    if (player.tickspeed.gte(1)) player.supernova.chal.noTick = false
    if (player.bh.condenser.gte(1)) player.supernova.chal.noBHC = false

    if (tmp.supernova.reached && !player.supernova.unl) player.offline.time = 0
    if (tmp.supernova.reached && (!tmp.offlineActive || player.supernova.times.gte(1)) && !player.supernova.post_10) {
        if (player.supernova.times.lte(0)) tmp.supernova.time += dt
        else {
            notify("You become Supernova!")
            SUPERNOVA.reset()
        }
    }

	if (player.supernova.unl) player.supernova.stars = player.supernova.stars.add(tmp.supernova.star_gain.mul(hasExtMilestone("qol", 1) ? dt : dt_offline))
	if (hasExtMilestone("qol", 2)) for (const [index, can] of Object.entries(tmp.supernova.tree_afford)) if (can) TREE_UPGS.buy(index)

    if (!player.supernova.post_10 && player.supernova.times.gte(10)) {
        player.supernova.post_10 = true
        addPopup(POPUP_GROUPS.supernova10)
    }
    if (BOSONS.unl()) {
		for (let x in BOSONS.names) {
			let id = BOSONS.names[x]
			player.supernova.bosons[id] = player.supernova.bosons[id].add(tmp.bosons.gain[id].mul(dt))
		}
		if (hasTree("qol7")) {
			for (let x = 0; x < BOSONS.upgs.ids.length; x++) {
				let id = BOSONS.upgs.ids[x]
				for (let y = 0; y < BOSONS.upgs[id].length; y++) BOSONS.upgs.buy(id,y)
			}
		}
    }

    if (player.chal.comps[10].gte(1) && !player.supernova.fermions.unl) {
        player.supernova.fermions.unl = true
        if (EXT.rawAmt().lt(1e10) && !GLUBALL.unl()) addPopup(POPUP_GROUPS.fermions)
    }
    if (player.supernova.fermions.unl) {
        if (tmp.fermions.ch[0] >= 0) gainFermionTiers(tmp.fermions.ch)
        if (tmp.fermions.ch2[0] >= 0) gainFermionTiers(tmp.fermions.ch2)
        if (hasExtMilestoneQ10()) for (let x = 0; x < 5; x++) gainFermionTiers([0, x])
		
        for (let x = 0; x < 2; x++) player.supernova.fermions.points[x] = player.supernova.fermions.points[x].add(tmp.fermions.gains[x].mul(dt))
    }

    if (tmp.radiation.unl) {
        player.supernova.radiation.hz = player.supernova.radiation.hz.add(tmp.radiation.hz_gain.mul(dt))
        for (let x = 0; x < RAD_LEN; x++) {
            player.supernova.radiation.ds[x] = player.supernova.radiation.ds[x].add(tmp.radiation.ds_gain[x].mul(dt))
	        if (player.supernova.radiation.ds[x].gte(1e5) && hasExtMilestone("qol", 2)) {
                RADIATION.buyBoost(x*2,1)
                RADIATION.buyBoost(x*2+1,1)
            }
        }
    }

	//Sweep
	if (player.supernova.auto.on > -2) {
		var list = player.supernova.auto.list
		player.supernova.auto.t += dt
		if (player.supernova.auto.t >= 1.5) {
			player.supernova.auto.t = 0

			delete player.chal.progress[0]
			delete player.chal.progress[1]
			delete player.chal.progress[2]
			if (player.supernova.fermions.choosed) FERMIONS.backNormal()

			player.supernova.auto.on++
			if (player.supernova.auto.on == list.length) player.supernova.auto.on = -2
			else {
				var id = list[player.supernova.auto.on]
				if (id > 0) CHALS_NEW.enter(Math.ceil(id / 4) - 1, id)
				else FERMIONS.choose(Math.floor(-id/10), (-id-1)%10, true)
			}
		}
	} else delete player.supernova.auto.list

	//Exotic
	/*if (hasExtMilestone("qol", 5) && tmp.supernova.bulk.gt(player.supernova.times)) {
		if (player.supernova.auto.on > -2) player.supernova.times = tmp.supernova.bulk
		else if (tmp.supernova.bulk.div(player.supernova.times).gte(1.3)) SUPERNOVA.reset(false, false, false, false, true)
	}*/
}

function updateSupernovaTemp() {
    let req_data = SUPERNOVA.req()
    tmp.supernova.maxlimit = req_data.maxlimit
    tmp.supernova.bulk = req_data.bulk

    tmp.supernova.reached = tmp.stars?player.stars.points.gte(tmp.supernova.maxlimit):false;

    for (let i = 0; i < TREE_TAB.length; i++) {
        tmp.supernova.tree_afford2[i] = []
        for (let j = 0; j < tmp.supernova.tree_had2[i].length; j++) {
            let id = tmp.supernova.tree_had2[i][j]
            let t = TREE_UPGS.ids[id]

            let branch = t.branch||""
            let unl = (t.unl?t.unl():true)
            let req = !unl?false:t.req?t.req():true
            let can = player.supernova.stars.gte(t.cost) && !hasTree(id) && req
            if (branch != "") for (let x = 0; x < branch.length; x++) if (!hasTree(branch[x])) {
                unl = false
                can = false
                break
            }
            tmp.supernova.tree_unlocked[id] = unl || hasTree(id)
            tmp.supernova.tree_afford[id] = can
            if (can) tmp.supernova.tree_afford2[i].push(id)
            if (t.effect) {
                tmp.supernova.tree_eff[id] = t.effect()
            }
        }
    }
    tmp.supernova.star_gain = SUPERNOVA.starGain()

    tmp.supernova.mult = D(tmp.extMult)
    if (hasExtMilestone("boost", 1)) tmp.supernova.mult = tmp.supernova.mult.mul(5)
}

function updateSupernovaHTML() {
	let scene = tmp.supernova.reached && !player.supernova.unl
	let reached = player.supernova.unl
    if (scene) {
        tmp.tab = 5
        document.body.style.backgroundColor = `hsl(0, 0%, ${100-Math.min(tmp.supernova.time,1)*100}%)`
        elm.supernova_scene.setDisplay(tmp.supernova.time>1)
        elm.sns1.setOpacity(Math.max(Math.min(tmp.supernova.time-1,1),0))
        elm.sns2.setOpacity(Math.max(Math.min(tmp.supernova.time-2,1),0))
        elm.sns3.setOpacity(Math.max(Math.min(tmp.supernova.time-3,1),0))
        elm.sns4.setOpacity(Math.max(Math.min(tmp.supernova.time-4,1),0))
        elm.sns5.setVisible(tmp.supernova.time>4)
        elm.sns5.setOpacity(Math.max(Math.min(tmp.supernova.time-5,1),0))
    }

    elm.app_supernova.setDisplay(reached && tmp.tab == 3)
    if (tmp.tab == 3) {
        elm.supernova_sweep.setTxt("Auto-Sweep: " + (player.supernova.auto.toggle ? "ON" : "OFF"))
        elm.supernova_sweep.setDisplay(hasTree("qol8"))
        elm.supernova_title.setTxt("Supernova" + (player.supernova.times.eq(1) ? "" : "e"))
        elm.supernova_scale.setTxt(getScalingName('supernova', true))
        elm.supernova_rank.setTxt(format(player.supernova.times,0))
        elm.supernova_next.setTxt("Next Supernova at " + format(tmp.supernova.maxlimit,2) + " stars")
        elm.supernova_restart.setDisplay(player.supernova.times.gte(2))
        if (tmp.stab[3] == 0) {
            elm.neutronStar.setTxt(format(player.supernova.stars,2)+" "+formatGain(player.supernova.stars,tmp.supernova.star_gain))
            updateTreeHTML()
        }
        if (tmp.stab[3] == 1) updateBosonsHTML()
        if (tmp.stab[3] == 2) updateFermionsHTML()
        if (tmp.stab[3] == 3) updateRadiationHTML()
		if (player.supernova.auto.on > -2 && player.supernova.auto.t < Infinity) {
			elm.supernova_next.setTxt("You are currently sweeping through challenges and fermions! Next in " + (1.5 - player.supernova.auto.t).toFixed(2) + " seconds, ending in " + (1.5 * player.supernova.auto.list.length - 1.5 * player.supernova.auto.on - player.supernova.auto.t).toFixed(2) + " seconds")
		}
    }
}

//CHALLENGE AUTOMATION
function getSupernovaAutoTemp(mode = "all") {
	let ret = []

	let c_thres = 50
	if (hasTree("chal6")) c_thres = 15
	if (hasExtMilestone("qol", 1)) c_thres = 10
	if (hasTree("feat4")) c_thres = 7
	if (hasExtMilestone("qol", 2)) c_thres = 5
	if (hasExtMilestone("qol", 3)) c_thres = 3
	if (hasExtMilestone("qol", 4)) c_thres = 2
	if (hasExtMilestone("qol", 5)) c_thres = 1
	if (hasExtMilestone("qol", 6)) c_thres = 0
	if (mode == "all" || mode == "chal") {
		for (var x = leastManualChal() + 1; x <= 12; x++) {
			let tier = player.chal.comps[x]
			if (CHALS_NEW.chals[x].unl() && tier.gte(c_thres) && tier.lt(CHALS_NEW.max(x))) ret.push(x)
		}
	}

	let f_thres = 15
	if (hasExtMilestone("qol", 1)) f_thres = 10
	if (hasTree("feat4")) f_thres = 7
	if (hasExtMilestone("qol", 2)) f_thres = 5
	if (hasExtMilestone("qol", 3)) f_thres = 3
	if (hasExtMilestone("qol", 4)) f_thres = 2
	if (hasExtMilestone("qol", 5)) f_thres = 1
	if (hasExtMilestone("qol", 6)) f_thres = 0
	if (mode == "all" || mode == "ferm") {
		for (var y = 0; y < 2; y++) {
			for (var x = 0; x < FERMIONS.getUnlLength(); x++) {
				if (x < 5 && y == 0 && hasExtMilestoneQ10()) continue
				let tier = player.supernova.fermions.tiers[y][x]
				if (tier.gte(f_thres) && tier.lt(FERMIONS.maxTier(y, x))) ret.push(-(y*10+x+1))
			}
		}
	}
	return ret
}

function leastManualChal() {
	return 0 //hasExtMilestoneQ10() ? 11 : 0
}

function updateSupernovaSweep() {
	player.supernova.auto.toggle = !player.supernova.auto.toggle
	if (!player.supernova.auto.toggle) player.supernova.auto.on = -2
}

function startSupernovaSweep(mode) {
	player.supernova.auto.on = -1
	player.supernova.auto.list = getSupernovaAutoTemp(mode)
	if (mode) player.supernova.auto.t = Infinity
}