const SUPERNOVA = {
    reset(force=false, chal=false, post=false, fermion=false, auto=false) {
        if (!chal && !post && !fermion && !auto) if ((force && player.confirms.sn)?!confirm("Are you sure to reset without being Supernova?"):false) return
		if (tmp.supernova.reached && !force && !fermion && hasTree("qol8") && player.supernova.auto.toggle) startSupernovaSweep()
        if (tmp.supernova.reached || force || fermion) {
            tmp.el.supernova_scene.setDisplay(false)
            if (!force && !fermion) {
				if (player.supernova.times.sub(tmp.supernova.bulk).lt(5)) player.ext.chal.f8 = false
				//if (player.supernova.times.gte(500) && player.supernova.times.div(tmp.supernova.bulk).gte(1/0) && (FERMIONS.onActive(05) || FERMIONS.onActive(15))) player.ext.chal.f10 = true
                player.supernova.times = player.supernova.post_10 ? player.supernova.times.max(tmp.supernova.bulk) : player.supernova.times.add(1)
            }
            tmp.pass = true
            this.doReset()
        }
    },
    doReset() {
        tmp.supernova.time = 0
        player.supernova.unl = true
        player.supernova.maxMass = E(0)
        player.supernova.auto.t = 0

        player.atom.points = E(0)
        player.atom.quarks = E(0)
        player.atom.particles = [E(0),E(0),E(0)]
        player.atom.powers = [E(0),E(0),E(0)]
        player.atom.atomic = E(0)
        player.atom.gamma_ray = E(0)
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
        keep = []
        for (let x = 0; x < player.atom.elements.length; x++) if (list_keep.includes(player.atom.elements[x])) keep.push(player.atom.elements[x])
        player.atom.elements = keep

        player.md.active = hasTree("qol_ext11") && player.md.active
        player.md.particles = E(0)
        player.md.mass = E(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)

        player.stars.unls = 0
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)
        player.stars.boost = E(0)

        if (!hasTree("chal3")) for (let x = 5; x <= 8; x++) player.chal.comps[x] = E(0)

        ATOM.doReset()

        player.supernova.chal.noTick = true
        player.supernova.chal.noBHC = true

        tmp.pass = false
    },
    starGain() {
        let x = E(hasTree("c")?0.1:0)
        if (hasTree("sn1")) x = x.mul(treeEff("sn1"))
        if (hasTree("sn2")) x = x.mul(treeEff("sn2"))
        if (hasTree("sn3")) x = x.mul(treeEff("sn3"))
        if (hasTree("bs3")) x = x.mul(treeEff("bs3"))
        if (hasElement(74)) x = x.mul(tmp.elements && tmp.elements.effect[74])
        x = x.mul(tmp.radiation.bs.eff[11])
        x = x.mul(tmp.supernova.timeMult)
        return x
    },
    req(x=player.supernova.times) {
        ml_fp = E(1).mul(tmp.bosons.upgs.gluon[3].effect)
        maxlimit = E(1e20).pow(x.scaleEvery("supernova").div(ml_fp).pow(1.25)).mul(1e90)
        bulk = player.stars.points.div(1e90).max(1).log(1e20).max(0).root(1.25).mul(ml_fp).scaleEvery("supernova",1).add(1).floor()
        if (player.stars.points.div(1e90).lt(1)) bulk = E(0)
        return {maxlimit: maxlimit, bulk: bulk}
    },
}

function calcSupernova(dt, dt_offline) {
    if (player.tickspeed.gte(1)) player.supernova.chal.noTick = false
    if (player.bh.condenser.gte(1)) player.supernova.chal.noBHC = false

    if (tmp.supernova.reached && (!tmp.offlineActive || player.supernova.times.gte(1)) && !player.supernova.post_10) {
        if (player.supernova.times.lte(0)) tmp.supernova.time += dt
        else {
            addNotify("You become Supernova!")
            SUPERNOVA.reset()
        }
    }
    if (player.supernova.unl) player.supernova.stars = player.supernova.stars.add(tmp.supernova.star_gain.mul(dt_offline))

    if (!player.supernova.post_10 && player.supernova.times.gte(10)) {
        player.supernova.post_10 = true
        addPopup(POPUP_GROUPS.supernova10)
    }

    if (player.supernova.post_10) for (let x in BOSONS.names) {
        let id = BOSONS.names[x]
        player.supernova.bosons[id] = player.supernova.bosons[id].add(tmp.bosons.gain[id].mul(dt))
    }

    if (player.supernova.fermions.unl) {
        if (tmp.fermions.ch[0] >= 0) {
            let maxTier = tmp.fermions.maxTier[tmp.fermions.ch[0]][tmp.fermions.ch[1]]
            player.supernova.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]] = player.supernova.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]]
            .max(tmp.fermions.tiers[tmp.fermions.ch[0]][tmp.fermions.ch[1]]).min(maxTier)
        }
        if (tmp.fermions.ch2[0] >= 0) {
            let maxTier = tmp.fermions.maxTier[tmp.fermions.ch2[0]][tmp.fermions.ch2[1]]
            player.supernova.fermions.tiers[tmp.fermions.ch2[0]][tmp.fermions.ch2[1]] = player.supernova.fermions.tiers[tmp.fermions.ch2[0]][tmp.fermions.ch2[1]]
            .max(tmp.fermions.tiers[tmp.fermions.ch2[0]][tmp.fermions.ch2[1]]).min(maxTier)
        }
        for (let x = 0; x < 2; x++) player.supernova.fermions.points[x] = player.supernova.fermions.points[x].add(tmp.fermions.gains[x].mul(dt))
    }

    if (tmp.radiation.unl) {
        player.supernova.radiation.hz = player.supernova.radiation.hz.add(tmp.radiation.hz_gain.mul(dt))
        for (let x = 0; x < RAD_LEN; x++) {
            player.supernova.radiation.ds[x] = player.supernova.radiation.ds[x].add(tmp.radiation.ds_gain[x].mul(dt))
	        if (player.supernova.radiation.ds[x].gte(1e5) && hasTree("qol_ext3")) {
                RADIATION.buyBoost(x*2,1)
                RADIATION.buyBoost(x*2+1,1)
            }
        }
    }
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
            let req = t.req?t.req():true
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
    tmp.supernova.timeMult = (AXION.unl() && tmp.ax.eff[0]) || E(1)
}

function updateSupernovaEndingHTML() {
	let scene = tmp.supernova.reached && !player.supernova.unl
	let reached = player.supernova.unl || scene
    if (scene && !tmp.offlineActive) {
        tmp.tab = 5
        document.body.style.backgroundColor = `hsl(0, 0%, ${7-Math.min(tmp.supernova.time/4,1)*7}%)`
        tmp.el.supernova_scene.setDisplay(tmp.supernova.time>4)
        tmp.el.sns1.setOpacity(Math.max(Math.min(tmp.supernova.time-4,1),0))
        tmp.el.sns2.setOpacity(Math.max(Math.min(tmp.supernova.time-7,1),0))
        tmp.el.sns3.setOpacity(Math.max(Math.min(tmp.supernova.time-10,1),0))
        tmp.el.sns4.setOpacity(Math.max(Math.min(tmp.supernova.time-14,1),0))
        tmp.el.sns5.setVisible(tmp.supernova.time>17)
        tmp.el.sns5.setOpacity(Math.max(Math.min(tmp.supernova.time-17,1),0))
    }
    if (reached) document.body.style.backgroundColor = tmp.tab == 5 ? "#000" : "#111"

    tmp.el.app_supernova.setDisplay(reached && tmp.tab == 5)
    if (tmp.tab == 5) {
        tmp.el.supernova_sweep.setTxt("Auto-Sweep: " + (player.supernova.auto.toggle ? "ON" : "OFF"))
        tmp.el.supernova_sweep.setDisplay(hasTree("qol8"))
        tmp.el.supernova_title.setTxt("Supernova" + (player.supernova.times.eq(1) ? "" : "e"))
        tmp.el.supernova_scale.setTxt(getScalingName('supernova', true))
        tmp.el.supernova_rank.setTxt(format(player.supernova.times,0))
        tmp.el.supernova_next.setTxt("Next Supernova at " + format(tmp.supernova.maxlimit,2) + " stars")
        if (tmp.stab[5] == 0) {
            tmp.el.neutronStar.setTxt(format(player.supernova.stars,2)+" "+formatGain(player.supernova.stars,tmp.supernova.star_gain))
            updateTreeHTML()
        }
        if (tmp.stab[5] == 1) updateBosonsHTML()
        if (tmp.stab[5] == 2) updateFermionsHTML()
        if (tmp.stab[5] == 3) updateRadiationHTML()
		if (player.supernova.auto.on > -2 && player.supernova.auto.t < 1/0) {
			tmp.el.supernova_next.setTxt("You are currently sweeping through challenges and fermions! Next in " + (1.5 - player.supernova.auto.t).toFixed(2) + " seconds, ending in " + (1.5 * player.supernova.auto.list.length - 1.5 * player.supernova.auto.on - player.supernova.auto.t).toFixed(2) + " seconds")
		}
    }
}

//CHALLENGE AUTOMATION: Go through all unlocked challenges that have at least 15 completions / tiers.
function getSupernovaAutoTemp(mode = "all") {
	let ret = []
	let thres = 15
	if (hasTree("qol_ext2")) thres = 10
	if (hasTree("feat4")) thres = 7
	if (mode == "all" || mode == "chal") {
		for (var x = (hasTree("qol_ext9") ? 9 : hasTree("qol_ext8") ? 5 : 1); x <= 12; x++) {
			let tier = player.chal.comps[x]
			if (tier.gte(thres) && tier.lt(CHALS.getMax(x))) ret.push(x)
			else if (x == 12 && hasTree("qol_ext2")) ret.push(x)
		}
	}
	if (mode == "all" || mode == "ferm") {
		for (var y = 0; y < 2; y++) {
			for (var x = 0; x < 6; x++) {
				let tier = player.supernova.fermions.tiers[y][x]
				if (tier.gte(thres) && tier.lt(FERMIONS.maxTier(y, x))) ret.push(-(y*10+x+1))
			}
		}
	}
	return ret
}

function updateSupernovaSweep() {
	player.supernova.auto.toggle = !player.supernova.auto.toggle
	if (!player.supernova.auto.toggle) player.supernova.auto.on = -2
}

function startSupernovaSweep(mode) {
	player.supernova.auto.on = -1
	player.supernova.auto.list = getSupernovaAutoTemp(mode)
	if (mode) player.supernova.auto.t = 1/0
}