var tmp = {}

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
    }
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
}

resetTemp()

function updateMassTemp() {
    tmp.massSoftPower = FORMS.massSoftPower()
    tmp.massSoftGain = FORMS.massSoftGain()
    tmp.massSoftPower2 = FORMS.massSoftPower2()
    tmp.massSoftGain2 = FORMS.massSoftGain2()
    tmp.massSoftPower3 = FORMS.massSoftPower3()
    tmp.massSoftGain3 = FORMS.massSoftGain3()
    tmp.massGain = FORMS.massGain()
}

function updateTickspeedTemp() {
    tmp.tickspeedEffect = FORMS.tickspeed.effect()

	let scale = scalingInitPower("tickspeed")
    tmp.tickspeedFP = tmp.fermions.effs[1][2]
    tmp.tickspeedCost = E(2).pow(player.tickspeed.scaleEvery("tickspeed").pow(scale)).floor()
    tmp.tickspeedBulk = player.rp.points.max(1).log(2).root(scale).scaleEvery("tickspeed", 1).add(1).floor()
    if (player.rp.points.lt(1)) tmp.tickspeedBulk = E(0)

}

function updateUpgradesTemp() {
    if (!tmp.upgs) tmp.upgs = {}
    UPGS.mass.temp()
    UPGS.main.temp()
}

function updateRagePowerTemp() {
    if (!tmp.rp) tmp.rp = {}
    tmp.rp.gain = FORMS.rp.gain()
    tmp.rp.can = tmp.rp.gain.gte(1)
}

function updateBlackHoleTemp() {
    if (!tmp.bh) tmp.bh = {}
    tmp.bh.dm_gain = FORMS.bh.DM_gain()
    tmp.bh.massSoftPower = FORMS.bh.massSoftPower()
    tmp.bh.massSoftGain = FORMS.bh.massSoftGain()
    tmp.bh.massPowerGain = FORMS.bh.massPowerGain()
    tmp.bh.mass_gain = FORMS.bh.massGain()
    tmp.bh.dm_can = tmp.bh.dm_gain.gte(1)
    tmp.bh.effect = FORMS.bh.effect()

	let scale = scalingInitPower("bh_condenser")
    tmp.bh.condenser_bonus = FORMS.bh.condenser.bonus()
    tmp.bh.condenser_cost = E(1.75).pow(player.bh.condenser.scaleEvery("bh_condenser").pow(scale)).floor()
    tmp.bh.condenser_bulk = player.bh.dm.max(1).log(1.75).root(scale).scaleEvery("bh_condenser", 1).add(1).floor()
    if (player.bh.dm.lt(1)) tmp.bh.condenser_bulk = E(0)
    tmp.bh.condenser_eff = FORMS.bh.condenser.effect()
}

function updateTemp() {
    tmp.offlineActive = player.offline.time > 1
    tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1
	updateExtraBuildingTemp()
    updateAxionTemp()
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