const DARK_RUN = {
    gain() {
		if(!player.exotic.dark_run.active)return E(0)
		let x = Decimal.pow(10,player.mass.add(1000).slog().sub(2).max(0).pow(hasAscension(1,15)?12:10).sub(3));
		if(player.exotic.dark_run.upgs[0].gte(1))x = x.mul(tmp.dark_run.upgs[0].eff);
		if(player.exotic.dark_run.upgs[1].gte(1))x = x.mul(tmp.dark_run.upgs[1].eff);
		if(player.exotic.dark_run.upgs[8].gte(1))x = x.mul(tmp.dark_run.upgs[8].eff);
		if(hasElement(451))x = x.mul(tmp.elements.effect[451]||1);
		if(player.superCluster.gte(7))x = x.mul(SUPERNOVA_CLUSTER.effects.eff1());
		if(hasElement(456))x = x.mul(tmp.ex.drEff.gm);
		if(hasElement(464))x = x.mul(tmp.elements.effect[464]||1);
		if (hasPrestige(4,12))x = x.mul(prestigeEff(4,12,E(1)))
		if (hasAscension(1,14))x = x.mul(ascensionEff(1,14,E(1)))
		x = x.mul(SUPERNOVA_GALAXY.effects.em());
		return x;
    },
    enter() {
        player.exotic.dark_run.active = !player.exotic.dark_run.active;
		EXOTIC.doReset()
    },
    upgs: {
        buy(x) {
            if (tmp.dark_run.upgs[x].can) {
				player.exotic.dark_run.points = player.exotic.dark_run.points.sub(this.ids[x].cost(tmp.dark_run.upgs[x].bulk.sub(1))).max(0)
				player.exotic.dark_run.upgs[x] = player.exotic.dark_run.upgs[x].max(tmp.dark_run.upgs[x].bulk)
            }
        },
        ids: [
            {
                desc: `Supernova Boost Glyphic Mass gain.`,
                cost(x) { return E(10) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(10))?E(1):E(0) },
                effect(x) {
					if(player.exotic.dark_run.upgs[3].gte(1))return player.supernova.times.add(1);
					return player.supernova.times.add(10).log10().pow(2);
                },
                effDesc(x) { return format(x)+"x"},
            },
            {
                desc: `Double Glyphic Mass gain.`,
                cost(x) { return E(10).pow(x.pow(1.25)).mul(100) },
                bulk() { return player.exotic.dark_run.points.gte(100)?player.exotic.dark_run.points.div(100).max(1).log10().pow(1/1.25).add(1).floor():E(0) },
                effect(x) {
                    let b = 2
                    return E(b).pow(x)
                },
                effDesc(x) { return format(x,0)+"x"},
            },
            {
                desc: `Glyphic Mass boost Dark Ray gain.`,
                cost(x) { return E(2000) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(2000))?E(1):E(0) },
                effect(x) {
					return player.exotic.dark_run.points.add(10).log10().pow(2);
                },
                effDesc(x) { return format(x)+"x"},
            },
            {
                desc: `Dark Run Upgrade 1 is better.`,
                cost(x) { return E(1e4) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(1e4))?E(1):E(0) },
            },
            {
                desc: `Gain 100% of Exotic Resets gained per second.`,
                cost(x) { return E(1e7) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(1e7))?E(1):E(0) },
            },
            {
                desc: `Dark Matter Upgrade 25 is better.`,
                cost(x) { return E(1e9) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(1e9))?E(1):E(0) },
            },
            {
                desc: `Galactic Challenge nerfing is weaker.`,
                cost(x) { return E(1e13).mul(Decimal.pow(100,x.pow(2))) },
                maxLvl: 5,
                bulk() { return player.exotic.dark_run.points.gte(1e13)?player.exotic.dark_run.points.div(1e13).max(1).log10().div(2).pow(1/2).add(1).floor():E(0) },
                effect(x) {
					return 1-x.toNumber()/100;
                },
                effDesc(x) { return formatReduction(x)+" weaker"},
            },
            {
                desc: `Galactic Shards gain is better.`,
                cost(x) { return E(1e15) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(1e15))?E(1):E(0) },
            },
            {
                desc: `Relativistic Mass Boost Glyphic Mass gain.`,
                cost(x) { return E(5e18) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(5e18))?E(1):E(0) },
                effect(x) {
					return Decimal.pow(10,player.md.break.mass.add(1e10).slog());
                },
                effDesc(x) { return format(x)+"x"},
            },
            {
                desc: `Glyphic Mass boost Abyssal Blot gain.`,
                cost(x) { return E(3.238e21) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(3.238e21))?E(1):E(0) },
                effect(x) {
					return player.exotic.dark_run.points.add(10).log10().pow(2);
                },
                effDesc(x) { return format(x)+"x"},
            },
            {
                desc: `Double Exotic Matter gain.`,
                cost(x) { return E(10).pow(x.pow(1.25)).mul(1.619e20) },
                bulk() { return player.exotic.dark_run.points.gte(1.619e20)?player.exotic.dark_run.points.div(1.619e20).max(1).log10().pow(1/1.25).add(1).floor():E(0) },
                effect(x) {
                    let b = 2
                    return E(b).pow(x)
                },
                effDesc(x) { return format(x,0)+"x"},
            },
            {
                desc: `Exotic Boosts are stronger.`,
                cost(x) { return E(10).pow(x.pow(2)).mul(1.619e24) },
                maxLvl: 5,
                bulk() { return player.exotic.dark_run.points.gte(1.619e24)?player.exotic.dark_run.points.div(1.619e24).max(1).log10().pow(1/2).add(1).floor():E(0) },
                effect(x) {
					return E(1).add(x.sqrt().div(20));
                },
                effDesc(x) { return format(x)+"x"},
            },
            {
                desc: `Exotic Prestige Level scales weaker based on Glyphic Mass.`,
                cost(x) { return E(5.972e27) },
                maxLvl: 1,
                bulk() { return player.exotic.dark_run.points.gte(E(5.972e27))?E(1):E(0) },
                effect(x) {
					return E(0.999).pow(player.exotic.dark_run.points.add(10).log10())
                },
                effDesc(x) { return formatReduction(x)+" weaker"},
            },
        ],
    },
}


function setupDRHTML() {
    let dr_upg_table = new Element("dr_upg_table")
	let table = ""
	for (let i = 0; i < DARK_RUN.upgs.ids.length; i++) {
        let upg = DARK_RUN.upgs.ids[i]
        table += `
        <button onclick="DARK_RUN.upgs.buy(${i})" class="btn full" id="dr_upg${i}_div" style="font-size: 11px;">
        <div style="min-height: 80px">
            ${((upg.maxLvl||1/0) > 1)?`[Level <span id="dr_upg${i}_lvl"></span>]<br>`:""}
            ${upg.desc}<br>
            ${upg.effDesc?`Currently: <span id="dr_upg${i}_eff"></span>`:""}
        </div>
        <span id="dr_upg${i}_cost"></span>
        </button>
        `
	}
	dr_upg_table.setHTML(table)
}

function updateDRTemp() {
    if (!tmp.dark_run) tmp.dark_run = {}
    if (!tmp.dark_run.upgs) {
        tmp.dark_run.upgs = []
        for (let x = 0; x < DARK_RUN.upgs.ids.length; x++) tmp.dark_run.upgs[x] = {}
    }
    for (let x = 0; x < DARK_RUN.upgs.ids.length; x++) {
        let upg = DARK_RUN.upgs.ids[x]
        tmp.dark_run.upgs[x].cost = upg.cost(player.exotic.dark_run.upgs[x])
        tmp.dark_run.upgs[x].bulk = upg.bulk().min(upg.maxLvl||EINF)
        tmp.dark_run.upgs[x].can = player.exotic.dark_run.points.gte(tmp.dark_run.upgs[x].cost) && player.exotic.dark_run.upgs[x].lt(upg.maxLvl||1/0)
        if (upg.effect) tmp.dark_run.upgs[x].eff = upg.effect(player.exotic.dark_run.upgs[x])
    }
}


function updateDRHTML() {
    for (let x = 0; x < DARK_RUN.upgs.ids.length; x++) {
        let upg = DARK_RUN.upgs.ids[x]
        let unl = upg.unl?upg.unl():true
        tmp.el["dr_upg"+x+"_div"].setVisible(unl)
        if (unl) {
            tmp.el["dr_upg"+x+"_div"].setClasses({btn: true, full: true, md: true, locked: !tmp.dark_run.upgs[x].can})
            if ((upg.maxLvl||1/0) > 1) tmp.el["dr_upg"+x+"_lvl"].setTxt(format(player.exotic.dark_run.upgs[x],0)+(upg.maxLvl!==undefined?" / "+format(upg.maxLvl,0):""))
            if (upg.effDesc) tmp.el["dr_upg"+x+"_eff"].setHTML(upg.effDesc(tmp.dark_run.upgs[x].eff))
            tmp.el["dr_upg"+x+"_cost"].setTxt(player.exotic.dark_run.upgs[x].lt(upg.maxLvl||1/0)?"Cost: "+formatMass(tmp.dark_run.upgs[x].cost):"")
        }
    }
}