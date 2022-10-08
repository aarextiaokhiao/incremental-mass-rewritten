const MASS_DILATION = {
    unlocked() { return hasElement(21) },
    onactive() {
		if (CHALS_NEW.in(14)) return
        if (player.md.active) player.md.particles = player.md.particles.add(tmp.md.rp_gain)
        player.md.active = !player.md.active
        ATOM.doReset()
        updateMDTemp()
    },
	isActive() {
		return player.md.active || CHALS_NEW.in(11) || CHALS_NEW.in(12) || CHALS_NEW.in(15) || FERMIONS.onActive("02")
	},
	getPenalty() {
		if (CHALS_NEW.in(12) || CHALS_NEW.in(15)) return 3/7
		var exp = 1
		if (tmp.fermions) exp /= tmp.fermions.effs[0][4]
		return Math.pow(FERMIONS.onActive("02") ? 0.64 : 0.8, exp)
	},
	applyDil(x) {
		return expMult(x, tmp.md.penalty).min(x)
	},
    RPexpgain() {
        let x = D(2).add(tmp.md.upgs[5].eff).mul(CHALS_NEW.in(10) ? 1 : CHALS_NEW.eff(10))
        if (!player.md.active && hasTree("d1")) x = x.mul(1.25)
        if (FERMIONS.onActive("01")) x = x.div(10)
        return x
    },
    RPmultgain() {
        let x = D(1).mul(tmp.md.upgs[2].eff)
        if (hasElement(24)) x = x.mul(tmp.elements.effect[24])
        if (hasElement(31)) x = x.mul(tmp.elements.effect[31])
        if (hasElement(34)) x = x.mul(tmp.elements.effect[34])
        if (hasElement(45)) x = x.mul(tmp.elements.effect[45])
        x = x.mul(tmp.fermions.effs[0][1]||1)
        x = x.mul(tmp.extMult)
        return x
    },
	RPbasegain(m=player.mass) {
		return m.div(uni(1)).max(1).log10().div(40).sub(14)
	},
	RPmassgain(m=player.mass) {
		if (CHALS_NEW.in(11) || CHALS_NEW.in(15)) return D(0)
		return this.RPbasegain(m).pow(tmp.md.rp_exp_gain)
	},
	RPgain(m=player.mass) {
		let x = this.RPmassgain(m).min(this.undercapacity()).mul(tmp.md.rp_mult_gain)
		return x.sub(player.md.particles).max(0).floor()
	},
	undercapacity() {
		return player.mass.pow(1e-3).max("ee15")
	},
    massGain() {
        let pow = D(2)
        let x = player.md.particles.pow(pow)
        x = x.mul(tmp.md.upgs[0].eff)
        if (hasElement(22)) x = x.mul(tmp.elements.effect[22])
        if (hasElement(35)) x = x.mul(tmp.elements.effect[35])
        if (hasElement(40)) x = x.mul(tmp.elements.effect[40])
        if (hasElement(32)) x = x.pow(1.05)
        x = x.mul(tmp.extMult)
        return x
    },
    mass_req() {
        let x = D(10).pow(player.md.particles.add(1).div(tmp.md.rp_mult_gain).root(tmp.md.rp_exp_gain).add(14).mul(40)).mul(1.50005e56)
        return x
    },
    effect() {
        let x = player.md.mass.max(1).log10().add(1).root(3).mul(tmp.md.upgs[1].eff)
        return x
    },
    upgs: {
        buy(x) {
            if (tmp.md.upgs[x].can) {
                if (!hasElement(43)) player.md.mass = player.md.mass.sub(this.ids[x].cost(tmp.md.upgs[x].bulk.sub(1))).max(0)
                player.md.upgs[x] = player.md.upgs[x].max(tmp.md.upgs[x].bulk)
            }
        },
        ids: [
            {
                desc: `Double dilated mass gain.`,
                cost(x) { return D(10).pow(x).mul(10) },
                bulk() { return player.md.mass.gte(10)?player.md.mass.div(10).max(1).log10().add(1).floor():D(0) },
                effect(x) {
                    let b = 2
                    if (hasElement(25)) b++
                    if (hasExtMilestone("boost", 5)) return D(b).pow(x)
                    return D(b).pow(x.mul(tmp.md.upgs[11].eff||1)).softcap('e1.2e4',0.96,2)
                },
                effDesc(x) { return format(x,0)+"x"+(hasExtMilestone("boost", 5)?"":getSoftcapHTML(x,'e1.2e4')) },
            },{
                desc: `Multiply dilated mass effect.`,
                cost(x) { return D(10).pow(x).mul(100) },
                bulk() { return player.md.mass.gte(100)?player.md.mass.div(100).max(1).log10().add(1).floor():D(0) },
				effect(x) {
					if (!hasExtMilestone("boost", 5)) x = x.mul(tmp.md.upgs[11].eff||1)
					if (player.md.upgs[7].gte(1)) return x.root(1.5).mul(0.25).add(1)
					return x.root(2).mul(0.15).add(1)
				},
                effDesc(x) { return formatMultiply(x)+" stronger" },
            },{
                desc: `Double Relativistic Particles.`,
                cost(x) { return D(10).pow(x.pow(D(1.25).pow(tmp.md.upgs[4].eff||1))).mul(1000) },
                bulk() { return player.md.mass.gte(1000)?player.md.mass.div(1000).max(1).log10().root(D(1.25).pow(tmp.md.upgs[4].eff||1)).add(1).floor():D(0) },
				effect(x) {
                    if (hasExtMilestone("boost", 5)) return D(2).pow(x)
					return D(2).pow(x.mul(tmp.md.upgs[11].eff||1)).softcap(1e25,0.75,0)
				},
                effDesc(x) { return format(x,0)+"x"+(hasExtMilestone("boost", 5)?"":getSoftcapHTML(x,1e25)) },
            },{
                desc: `Dilated mass strengthen Stronger.`,
                maxLvl: 1,
                cost(x) { return D(1.619e20).mul(25) },
                bulk() { return player.md.mass.gte(D(1.619e20).mul(25))?D(1):D(0) },
                effect(x) { return player.md.mass.max(1).log(100).root(3).div(8).add(1) },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: `Upgrade 3 scales 10% weaker.`,
                maxLvl: 5,
                cost(x) { return D(1e5).pow(x).mul(D(1.619e20).mul(1e4)) },
                bulk() { return player.md.mass.gte(D(1.619e20).mul(1e4))?player.md.mass.div(D(1.619e20).mul(1e4)).max(1).log(1e5).add(1).floor():D(0) },
                effect(x) { return D(1).sub(x.mul(0.1)) },
                effDesc(x) { return format(D(1).sub(x).mul(100))+"% weaker" },
            },{
                desc: `Increase the RP formula exponent.`,
                cost(x) { return D(1e3).pow(x.pow(1.5)).mul(1.5e73) },
                bulk() { return player.md.mass.gte(1.5e73)?player.md.mass.div(1.5e73).max(1).log(1e3).max(0).root(1.5).add(1).floor():D(0) },
                effect(i) {
                    let s = D(0.25).add(tmp.md.upgs[10].eff||1)
                    let x = i.mul(s)
                    if (hasElement(53)) x = x.mul(1.75)
                    if (hasRank("pent", 75)) return x.softcap(1e3,6/7,0).softcap(1e3,x.log10(),1)
                    return x.softcap(1e3,0.6,0)
                },
                effDesc(x) { return "+^"+format(x)+getSoftcapHTML(x,1e3) },
            },{
                desc: `Dilated mass boosts Quarks.`,
                maxLvl: 1,
                cost(x) { return D(1.5e191) },
                bulk() { return player.md.mass.gte(1.5e191)?D(1):D(0) },
                effect(x) { return D(5).pow(player.md.mass.max(1).log10().root(2)) },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: `Strengthen Upgrade 2.`,
                maxLvl: 1,
                cost(x) { return D(1.5e246) },
                bulk() { return player.md.mass.gte(1.5e246)?D(1):D(0) },
            },{
                unl() { return STARS.unlocked() || player.supernova.times.gte(1) },
                desc: `Tickspeed affect all-star resources at a reduced rate.`,
                maxLvl: 1,
                cost(x) { return D(1.5e296) },
                bulk() { return player.md.mass.gte(1.5e296)?D(1):D(0) },
                effect(x) { return player.tickspeed.add(1).pow(2/3) },
                effDesc(x) { return format(x)+"x" },
            },{
                unl() { return STARS.unlocked() || player.supernova.times.gte(1) },
                desc: `Double Quarks.`,
                cost(x) { return D(5).pow(x).mul('1.50001e536') },
                bulk() { return player.md.mass.gte('1.50001e536')?player.md.mass.div('1.50001e536').max(1).log(5).add(1).floor():D(0) },
				effect(x) {
					let r = D(2).pow(x)
					if (!hasExtMilestone("boost", 5)) r = r.softcap(1e25,2/3,0)
					return r
				},
                effDesc(x) { return format(x)+"x"+(hasExtMilestone("boost", 5)?"":getSoftcapHTML(x,1e25)) },
            },{
                unl() { return player.supernova.times.gte(1) },
                desc: `Add 0.015 Mass Dilation upgrade 6's base.`,
                cost(x) { return D(1e50).pow(x.pow(1.5)).mul('1.50001e1556') },
                bulk() { return player.md.mass.gte('1.50001e1556')?player.md.mass.div('1.50001e1556').max(1).log(1e50).max(0).root(1.5).add(1).floor():D(0) },
                effect(x) {
                    return x.mul(0.015).add(1).softcap(1.2,0.75,0).sub(1)
                },
                effDesc(x) { return "+"+format(x)+getSoftcapHTML(x,0.2) },
            },{
                unl() { return player.supernova.post_10 && !hasExtMilestone("boost", 5) },
                desc: `Strengthen first 3 upgrades.`,
                cost(x) { return D(1e100).pow(x.pow(2)).mul('1.5e8056') },
                bulk() { return player.md.mass.gte('1.5e8056')?player.md.mass.div('1.5e8056').max(1).log(1e100).max(0).root(2).add(1).floor():D(0) },
                effect(x) {
                    return x.sqrt().softcap(3.5,0.5,0).div(100).add(1).softcap(4,0.25,0)
                },
                effDesc(x) { return "+"+format(x.sub(1).mul(100))+"% stronger"+getSoftcapHTML(x,1.035,4) },
            },
        ],
    },
}

function setupMDHTML() {
    let md_upg_table = new Element("md_upg_table")
	let table = ""
	for (let i = 0; i < MASS_DILATION.upgs.ids.length; i++) {
        let upg = MASS_DILATION.upgs.ids[i]
        table += `
        <button onclick="MASS_DILATION.upgs.buy(${i})" class="btn full md" id="md_upg${i}_div" style="font-size: 11px;">
        <div style="min-height: 80px">
            <b id="md_upg${i}_lvl"></b><br>
            ${upg.desc}<br>
            ${upg.effDesc?`Currently: <span id="md_upg${i}_eff"></span>`:""}
        </div>
        <span id="md_upg${i}_cost"></span>
        </button>
        `
	}
	md_upg_table.setHTML(table)
}

function updateMDTemp() {
    if (!tmp.md) tmp.md = {}
	tmp.md.active = MASS_DILATION.isActive()
	tmp.md.penalty = MASS_DILATION.getPenalty()
    if (!tmp.md.upgs) {
        tmp.md.upgs = []
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) tmp.md.upgs[x] = {}
    }
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) {
        let upg = MASS_DILATION.upgs.ids[x]
        let max = upg.maxLvl || EINF
        tmp.md.upgs[x].cost = upg.cost(player.md.upgs[x])
        tmp.md.upgs[x].bulk = upg.bulk().min(max)
        tmp.md.upgs[x].can = player.md.mass.gte(tmp.md.upgs[x].cost) && player.md.upgs[x].lt(max)
        if (upg.effect) tmp.md.upgs[x].eff = upg.effect(player.md.upgs[x])
    }
    tmp.md.rp_exp_gain = MASS_DILATION.RPexpgain()
    tmp.md.rp_mult_gain = MASS_DILATION.RPmultgain()
    tmp.md.rp_gain = MASS_DILATION.RPgain()
    tmp.md.passive_rp_gain = hasTree("qol3")?MASS_DILATION.RPgain(MASS_DILATION.applyDil(player.mass)):D(0)
    tmp.md.mass_gain = MASS_DILATION.massGain()
    tmp.md.mass_req = MASS_DILATION.mass_req()
    tmp.md.mass_eff = MASS_DILATION.effect()
}

function updateMDHTML() {
	let exp = hasExtMilestone("boost", 7) ? false : D(1)
    elm.md_particles.setTxt(format(player.md.particles,0)+(hasTree("qol3")?" "+formatGain(player.md.particles,tmp.md.passive_rp_gain):""))
    elm.md_eff.setTxt(exp.gt(1)?"^"+format(exp,3):tmp.md.mass_eff.gte(10)?format(tmp.md.mass_eff)+"x":format(tmp.md.mass_eff.sub(1).mul(100))+"%")
    elm.md_mass.setTxt(formatMass(player.md.mass)+" "+formatGain(player.md.mass,tmp.md.mass_gain,true))
    elm.md_undercapacity.setHTML(MASS_DILATION.RPmassgain().gt(MASS_DILATION.undercapacity())?"Base RP is undercapacitied at "+format(MASS_DILATION.undercapacity())+" to prevent temporal anomalies!<br>":"")
    elm.md_btn.setTxt(player.md.active
        ?(tmp.md.rp_gain.gte(1)?`Cancel for ${format(tmp.md.rp_gain,0)} Relativistic particles`:`Reach ${formatMass(tmp.md.mass_req)} to gain Relativistic particles, or cancel dilation`)
        :"Dilate Mass"
    )
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) {
        let upg = MASS_DILATION.upgs.ids[x]
        let unl = upg.unl?upg.unl():true
        elm["md_upg"+x+"_div"].setVisible(unl)
        if (unl) {
            elm["md_upg"+x+"_div"].setClasses({btn: true, full: true, md: true, locked: !tmp.md.upgs[x].can, bought: upg.maxLvl !== undefined && player.md.upgs[x].eq(upg.maxLvl)})
            elm["md_upg"+x+"_lvl"].setTxt(D(upg.maxLvl).eq(1)?"":"[Level "+format(player.md.upgs[x],0)+(upg.maxLvl!==undefined?" / "+format(upg.maxLvl,0):"")+"]")
            if (upg.effDesc) elm["md_upg"+x+"_eff"].setHTML(upg.effDesc(tmp.md.upgs[x].eff))
            elm["md_upg"+x+"_cost"].setTxt(player.md.upgs[x].lt(upg.maxLvl||EINF)?"Cost: "+formatMass(tmp.md.upgs[x].cost):"")
        }
    }
}