var tmp = {}
var elm = {}

function resetTemp() {
    tmp = {
        tree_time: 0,

        sn_tab: 0,
        tab: 0,
        stab: [],
        pass: true,
        notify: [],
        popup: [],
        saving: 0,

        upgs: {
            main: {},
            mass: {},
        },

        fermions: {
            ch: [0,0],
            gains: [E(0),E(0)],
            maxTier: [[],[]],
            tiers: [[],[]],
            effs:  [[],[]],
        },
    
        supernova: {
            time: 0,
            tree_choosed: "",
            tree_had: [],
            tree_had2: [],
            tree_eff: {},
            tree_unlocked: {},
            tree_afford: {},
            tree_afford2: [],
        },
		tree_tab: 0,
    
        radiation: {
            unl: false,
            ds_gain: [],
            ds_eff: [],
            bs: {
                sum: [],
                lvl: [],
                bonus_lvl: [],
                cost: [],
                bulk: [],
                eff: [],
            },
        },
        ch: {}
    }
    for (let x = UPGS.mass.cols; x >= 1; x--) tmp.upgs.mass[x] = {}
    for (let x = 1; x <= UPGS.main.cols; x++) tmp.upgs.main[x] = {}
    for (let j = 0; j < TREE_TAB.length; j++) {
        tmp.supernova.tree_had2[j] = []
        tmp.supernova.tree_afford2[j] = []
    }
    for (let x = 0; x < TABS[1].length; x++) tmp.stab.push(0)
    for (let i = 0; i < TREE_IDS.length; i++) {
        for (let j = 0; j < TREE_TAB.length; j++) {
            for (let k = 0; k < TREE_IDS[i][j].length; k++) {
                let id = TREE_IDS[i][j][k]
                if (id != "") {
                    tmp.supernova.tree_had2[j].push(id)
                    tmp.supernova.tree_had.push(id)
                }
            }
        }
    }
	SHORTCUT_EDIT = {
		mode: 0,
		pos: 0,
		cur: 0
	}
}

resetTemp()

function updateMassTemp() {
    tmp.massSoftPower1 = FORMS.massSoftPower()
    tmp.massSoftGain1 = FORMS.massSoftGain()
    tmp.massSoftPower2 = FORMS.massSoftPower2()
    tmp.massSoftGain2 = FORMS.massSoftGain2()
    tmp.massSoftPower3 = FORMS.massSoftPower3()
    tmp.massSoftGain3 = FORMS.massSoftGain3()
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedEffect = FORMS.tickspeed.effect()

	let scale = scalingInitPower("tickspeed")
    tmp.tickspeedFP = tmp.upgs.fp.mul(tmp.fermions.effs[1][2])
    if (scalingToned("tickspeed")) tmp.tickspeedFP = tmp.tickspeedFP.div(4/3)
    tmp.tickspeedCost = E(2).pow(player.tickspeed.scaleEvery("tickspeed").pow(scale)).floor()
    tmp.tickspeedBulk = player.rp.points.max(1).log(2).root(scale).scaleEvery("tickspeed", 1).add(1).floor()
    if (player.rp.points.lt(1)) tmp.tickspeedBulk = E(0)

}

function updateUpgradesTemp() {
	tmp.upgs.fp = E(1)
	if (CHROMA.got("s3_1")) tmp.upgs.fp = tmp.upgs.fp.mul(CHROMA.eff("s3_1"))
	if (CHROMA.got("t3_1")) tmp.upgs.fp = tmp.upgs.fp.mul(CHROMA.eff("t3_1"))
	if (hasPrim("p3_0")) tmp.upgs.fp = tmp.upgs.fp.mul(tmp.pr.eff["p3_0"])

	UPGS.main.temp()
	UPGS.mass.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.gain = FORMS.rp.gain()
    tmp.rp.can = tmp.rp.gain.gte(1)
}

function updateBlackHoleTemp() {
    let t = tmp.bh || {}
	tmp.bh = t

    t.dm_gain = FORMS.bh.DM_gain()
    t.massSoftPower = FORMS.bh.massSoftPower()
    t.massSoftGain = FORMS.bh.massSoftGain()
    t.massPowerGain = FORMS.bh.massPowerGain()
    t.mass_gain = FORMS.bh.massGain()
    t.dm_can = t.dm_gain.gte(1)
    t.effect = FORMS.bh.effect()

	let scale = scalingInitPower("bh_condenser")
    t.condenser_bonus = FORMS.bh.condenser.bonus()
    t.condenser_cost = E(1.75).pow(player.bh.condenser.scaleEvery("bh_condenser").pow(scale)).floor()
    t.condenser_bulk = player.bh.dm.max(1).log(1.75).root(scale).scaleEvery("bh_condenser", 1).add(1).floor()
    if (player.bh.dm.lt(1)) t.condenser_bulk = E(0)
    t.condenser_eff = FORMS.bh.condenser.effect()

	t.rad_ss = FORMS.bh.radSoftStart()
}

function updateTemp() {
    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1
	updatePrimTemp()
	updateChromaTemp()
    updateAxionTemp()
	updateExtraBuildingTemp()
    updateRadiationTemp()
    updateFermionsTemp()
    updateBosonsTemp()
    updateSupernovaTemp()
    updateElementsTemp()
    updateMDTemp()
    updateStarsTemp()
    updateUpgradesTemp()
    updateScalingTemp()
    updateChalTemp()
    updateAtomTemp()
    updateRagePowerTemp()
    updateBlackHoleTemp()
    updateTickspeedTemp()
    updateRanksTemp()
    updateMassTemp()
}