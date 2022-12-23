var tmp = {}
var elm = {}

function resetTemp() {
    tmp = {
        tab: 0,
        prev_tab: 0,
        stab: [],

        pass: true,
        saving: 0,
        notify: [],

		scaling: {},
		scaling_power: {},
		scaling_start: {},

        compress: {},
        upgs: {
            main: {},
            mass: {},
        },
		chal: {
			choosed: {},
			in: [],
			inForce: [],
			eff: {}
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
        tree_time: 0,
		tree_tab: 0,

        fermions: {
            ch: [0,0],
            gains: [D(0),D(0)],
            maxTier: [[],[]],
            tiers: [[],[]],
            effs:  [[],[]],
        },
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

        ext_ms_view: "qol",
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

function updateMassTemp() {
    tmp.massSoftPower1 = FORMS.massSoftPower()
    tmp.massSoftGain1 = FORMS.massSoftGain()
    tmp.massSoftPower2 = FORMS.massSoftPower2()
    tmp.massSoftGain2 = FORMS.massSoftGain2()
    tmp.massSoftPower3 = FORMS.massSoftPower3()
    tmp.massSoftGain3 = FORMS.massSoftGain3()
    tmp.massGain = calcProd("mass")
}

function updateTickspeedTemp() {
    tmp.tickspeedEffect = FORMS.tickspeed.effect()

	let scale = getScalingBasePower("tickspeed")
    tmp.tickspeedFP = tmp.upgs.fp.mul(tmp.fermions.effs[1][2])
    if (isScalingToned("tickspeed")) tmp.tickspeedFP = tmp.tickspeedFP.div(4/3)
    tmp.tickspeedCost = D(2).pow(player.tickspeed.scaleEvery("tickspeed").pow(scale)).floor()
    tmp.tickspeedBulk = player.rp.points.max(1).log(2).root(scale).scaleEvery("tickspeed", 1).add(1).floor()
    if (player.rp.points.lt(1)) tmp.tickspeedBulk = D(0)

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
    t.massGain = calcProd("bh")
    t.dm_can = t.dm_gain.gte(1)
    t.effect = FORMS.bh.effect()

	let scale = getScalingBasePower("bh_condenser")
    t.condenser_bonus = FORMS.bh.condenser.bonus()
    t.condenser_cost = D(1.75).pow(player.bh.condenser.scaleEvery("bh_condenser").pow(scale)).floor()
    t.condenser_bulk = player.bh.dm.max(1).log(1.75).root(scale).scaleEvery("bh_condenser", 1).add(1).floor()
    if (player.bh.dm.lt(1)) t.condenser_bulk = D(0)
    t.condenser_eff = FORMS.bh.condenser.effect()
}

function updateTemp() {
	//Offline
	tmp.offlineActive = player.offline.time > 1
	tmp.offlineMult = tmp.offlineActive?player.offline.time+1:1

	//Tab Forcing
	if (toned() == 5 && tmp.stab[7] == 2) tmp.stab[7] = 0

	updateAltraTemp()

	//Supernova
	updateRadiationTemp()
	updateFermionsTemp()
	updateBosonsTemp()
	updateSupernovaTemp()

	//Atoms
	updateElementsTemp()
	updateMDTemp()
	updateStarsTemp()
	updateUpgradesTemp()
	updateScalingTemp()
	updateChalTempNew()
	updateAtomTemp()

	//Pre-Atom
	updateRagePowerTemp()
	updateBlackHoleTemp()
	updateTickspeedTemp()

	//Pre-Rage
	MAGIC.updateTmp()
	updateRanksTemp()
	updateMassTemp()
}