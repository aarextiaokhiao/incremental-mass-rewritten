const RADIATION = {
    names: ["Radio","Microwave","Infrared","Visible","Ultraviolet","X-ray","Gamma"],
    unls: ["0","1e6","1e13","1e20","5e26","5e29","1e35"],
    hz_gain() {
		if (CHALS.inChal(14)) return E(0)

        let x = E(1)
        x = x.mul(tmp.radiation.ds_eff[0])
        if (hasTree('rad1')) x = x.mul(treeEff("rad1",1))
        if (hasElement(76)) x = x.mul(tmp.elements && tmp.elements.effect[76])
        x = x.mul(tmp.supernova.timeMult)
        return x
    },
    hz_effect() {
        let x = player.supernova.radiation.hz.add(1).root(3)
        return x
    },
	ds_gains: ["1", "1", "1", "1", "0.005", "0.00002", "1e-7"],
    ds_gain(i) {
		if (CHALS.inChal(14)) return E(0)
        if (i>0&&player.supernova.radiation.hz.lt(RADIATION.unls[i])) return E(0)

        let x = E(RADIATION.ds_gains[i])
        if (hasTree('rad2')) x = x.mul(treeEff("rad2",1))
        if (hasTree('feat1')) x = x.mul(3)
        if (i == 3 && hasElement(70)) x = x.mul(10)
        if (i<RAD_LEN-1) {
            if (hasTree('rad1') && player.supernova.radiation.hz.gte(RADIATION.unls[i+1])) x = x.mul(treeEff("rad1",1))
            x = x.mul(tmp.radiation.ds_eff[i+1])
        }
        x = x.mul(tmp.radiation.bs.eff[3*i])
        x = x.mul(tmp.supernova.timeMult)
        return x
    },
    ds_eff(i) {
        let x = player.supernova.radiation.ds[i].add(1).root(3)
        return x
    },
    getBoostData(i) {
        let b = player.supernova.radiation.bs[i]
        let [f1,f2,f3,f4] = [2+i/2,RADIATION.getBoostScalingExp(i),(i*0.5+1)**2*10,RADIATION.getBoostScalingMul(i)]
        let cost = E(f1).pow(b.pow(f2).mul(f4)).mul(f3)

        let d = player.supernova.radiation.ds[Math.floor(i/2)]
        let bulk = d.lt(f3) ? E(0) : d.div(f3).max(1).log(f1).max(0).div(f4).root(f2).add(1).floor()

        return [cost,bulk]
    },
    getBoostScalingMul(i) {
		let f4 = E(1)
		if (tmp.fermions) f4 = f4.mul(tmp.fermions.effs[0][5]||1)
		f4 = f4.div(tmp.chal?tmp.chal.eff[12]:1)
		if (hasElement(78) && i % 2 == 1) f4 = f4.mul(0.85)
		return f4
    },
    getBoostScalingExp(i) {
		let f2 = 1.3+i*0.05
		if (tmp.radiation.bs.eff[17] && i % 2 == 1) f2 -= tmp.radiation.bs.eff[17][1]
		if (AXION.unl()) f2 -= tmp.ax.eff[3].toNumber()
		return Math.max(f2,1.25)
    },
    getLevelEffect(i) {
        let x = this.boosts[i].eff(FERMIONS.onActive(05)?E(0):tmp.radiation.bs.lvl[i].add(tmp.radiation.bs.bonus_lvl[i]))
        return x
    },
    getbonusLevel(i) {
		if (CHALS.inChal(14)) return E(0)

        let x = E(0)
        if (i < 8) x = x.add(RADIATION.applyBonus(tmp.radiation.bs.eff[8]&&tmp.radiation.bs.eff[8],8,i))
        if (i < 12 && hasElement(69)) x = x.add(1)
        if (i < 17) x = x.add(RADIATION.applyBonus(tmp.radiation.bs.eff[17]&&tmp.radiation.bs.eff[17][0],17,i))
		if (tmp.eb.ag3) x = x.add(RADIATION.applyBonus(tmp.eb.ag3.eff,20,i))

        return x
    },
    applyBonus(x,a,b) {
		if (!x) x = E(0)
		var m = RADIATION.bonusMul(a,b)
		var e = RADIATION.bonusExp(a,b)
		if (e <= 1) return x.mul(m)
		return x.add(1).pow(e).sub(1).mul(m)
    },
    bonusMul(a,b) {
		if (!hasTree("rad3")) return 1
		a = Math.floor(a / 3)
		b = Math.floor(b / 3)
        return AXION.unl() ? tmp.ax.eff[7].pow(a - b) : E(1)
    },
    bonusExp(a,b) {
		if (!hasTree("rad3")) return 1
		a = Math.floor(a / 3) * 2
		b = Math.floor(b / 3) * 2
        return RADIATION.getBoostScalingExp(a) / RADIATION.getBoostScalingExp(b)
    },
    buyBoost(i, auto) {
        let [cost, bulk, j] = [tmp.radiation.bs.cost[i], tmp.radiation.bs.bulk[i], Math.floor(i/2)]
        if (player.supernova.radiation.ds[j].gte(cost) && bulk.gt(player.supernova.radiation.bs[i])) {
            player.supernova.radiation.bs[i] = player.supernova.radiation.bs[i].max(bulk)
            let [f1,f2,f3,f4] = [2+i/2,RADIATION.getBoostScalingExp(i),(i*0.5+1)**2*10,RADIATION.getBoostScalingMul(i)]
            if (!auto) player.supernova.radiation.ds[j] = player.supernova.radiation.ds[j].sub(E(f1).pow(bulk.sub(1).pow(f2).mul(f4)).mul(f3)).max(0)
        }
    },
	max(auto) {
		for (let x = 0; x < RAD_LEN; x++) {
			RADIATION.buyBoost(x*2)
			RADIATION.buyBoost(x*2+1)
		}
	},
	selfBoost(x, b) {
		let r
		if (x == 0) r = player.supernova.radiation.hz
		else r = player.supernova.radiation.ds[x-1]
        r = r.add(1).log10().add(1)

        if (GLUBALL.got("p3_1")) r = r.pow(GLUBALL.eff("p3_1"))
		return r.pow(b).softcap(1e30,0.5,0)
	},
    boosts: [
        {
            title: `Radio Boost`,
            eff(b) {
                return RADIATION.selfBoost(0,b)
            },
            desc(x) { return `Radiowave is boosted by ${format(x)}x (based on Frequency)`+getSoftcapHTML(x,1e30) },
        },{
            title: `Tickspeed Boost`,
			eff(b) {
				let x = b.add(1).root(2)
				if (scalingToned("tickspeed")) x = x.log10().add(1).root(3)
				return x.min(10)
			},
            desc(x) { return `Non-bonus tickspeed is ${format(x)}x stronger` },
        },{
            title: `Mass-Softcap Boost`,
            eff(b) {
                let x = b.add(1).root(4)
                return x
            },
            desc(x) { return `Mass softcap^3 scales ^${format(x)} later` },
        },{
            title: `Microwave Boost`,
            eff(b) {
                return RADIATION.selfBoost(1,b)
            },
            desc(x) { return `Microwave is boosted by ${format(x)}x (based on Radio)`+getSoftcapHTML(x,1e30) },
        },{
            title: `BH-Exponent Boost`,
            eff(b) {
                let x = b.root(2).div(100)
                return x.min(0.35)
            },
            desc(x) { return `Increase black hole formula exponent by ^${format(x)}` },
        },{
            title: `BH-Condenser Boost`,
            eff(b) {
                let x = b.add(1).pow(2)
                return x.softcap(100,0.5,0)
            },
            desc(x) { return `Non-bonus BH Condenser is ${format(x)}x stronger`+getSoftcapHTML(x,100) },
        },{
            title: `Infrared Boost`,
            eff(b) {
                return RADIATION.selfBoost(2,b)
            },
            desc(x) { return `Infrared is boosted by ${format(x)}x (based on Microwave)`+getSoftcapHTML(x,1e30) },
        },{
            title: `Photo-Gluon Boost`,
            eff(b) {
                let x = b.add(1).root(3)
                return x
            },
            desc(x) { return `1st Photon & Gluon upgrades are ${format(x)}x stronger` },
        },{
            title: `Meta-Boost I`,
            eff(b) {
                let x = b.root(2.5).div(1.75).mul(hasTree("rad4")?1.5:1)
                if (hasTree("rad5")) x = x.mul(treeEff("rad5",0)).add(1).pow(1.5).mul(x)
                return x
            },
            desc(x) { return `Add ${format(x)} levels to all above boosts` },
        },{
            title: `Visible Boost`,
            eff(b) {
                return RADIATION.selfBoost(3,b)
            },
            desc(x) { return `Visible is boosted by ${format(x)}x (based on Infrared)`+getSoftcapHTML(x,1e30) },
        },{
            title: `Cosmic-Ray Boost`,
            eff(b) {
                let x = b.add(1).root(3)
                return x
            },
            desc(x) { return `Cosmic Ray power is boosted by ${format(x)}x` },
        },{
            title: `Neturon-Star Boost`,
            eff(b) {
                let x = player.supernova.radiation.hz.add(1).log10().add(1).pow(b)
                return x
            },
            desc(x) { return `Neutron Star is boosted by ${format(x)}x (based on Frequency)` },
        },{
            title: `Ultraviolet Boost`,
            eff(b) {
                return RADIATION.selfBoost(4,b)
            },
            desc(x) { return `Ultraviolet is boosted by ${format(x)}x (based on Visible)`+getSoftcapHTML(x,1e30) },
        },{
            title: `Tickspeed-Cap Boost`,
			eff(b) {
				let x = E(1e3).pow(b.pow(0.9))
				return x
			},
            desc(x) { return `Tickspeed power's softcap starts ${format(x)}x later` },
        },{
            title: `Meta-Tickspeed Boost`,
            eff(b) {
                let x = E(1.1).pow(b).softcap(15,3,3)
                return x
            },
            desc(x) { return `Meta-Tickspeed starts ${format(x)}x later`+getSoftcapHTML(x,15) },
        },{
            title: `X-Ray Boost`,
            eff(b) {
                return RADIATION.selfBoost(5,b)
            },
            desc(x) { return `X-Ray is boosted by ${format(x)}x (based on Ultraviolet)`+getSoftcapHTML(x,1e30) },
        },{
            title: `U-Lepton Boost`,
            eff(b) {
                let x = b.add(1).log(2)
				if (hasElement(79)) x = b.pow(.75).mul(2)
                return x.div(50).add(1)
            },
            desc(x) { return `U-Lepton boosts are ${format(x)}x stronger.` },
        },{
            title: `Meta Boost II / Synergy Boost`,
            eff(b) {
				let r = b.mul(player.supernova.radiation.ds[5].add(1).log10().pow(5/6)).pow(2/5)
                return [r.div(10).mul(hasTree("rad4")?1.5:1), r.div(100).min(0.05).toNumber()]
            },
            desc(x) { return `Add ${format(x[0])} levels to all above boosts, reduce Velocity cost scalings by ^${format(x[1])}` },
        },
        {
            title: `Gamma Boost`,
            eff(b) {
                return RADIATION.selfBoost(6,b)
            },
            desc(x) { return `Gamma is boosted by ${format(x)}x (based on X-Ray)`+getSoftcapHTML(x,1e30) },
        },
        {
            title: `Mass Exponent Boost`,
            eff(b) {
                let x = b.add(1).pow(1.15).sub(1).div(10).min(2.55)
                return x
            },
            desc(x) { return `Increase Mass exponent cap by ^${format(x)}.` },
        },
        {
            title: `Supernova Boost`,
            eff(b) {
                let b_sub = b.add(1).cbrt().softcap(3,10,1).min(11/3)
                return { sub: b_sub, eff: E(5).sub(b_sub).log(5) }
            },
            desc(x) { return `Ultra Supernova scales -^${format(x.sub)} slower.` + getSoftcapHTML(x.sub,3) },
        },

        /*
        {
            title: `Placeholder Boost`,
            eff(b) {
                let x = E(1)
                return x
            },
            desc(x) { return `Placeholder` },
        },
        */
    ],
}

const RAD_LEN = 7

function updateRadiationTemp() {
	let tr = tmp.radiation
	tr.unl = hasTree("unl1")
	for (let x = 0; x < RAD_LEN; x++) {
		tr.bs.sum[x] = player.supernova.radiation.bs[2*x].add(player.supernova.radiation.bs[2*x+1])
		for (let y = 0; y < 3; y++) {
			tr.bs.lvl[3*x+y] = tr.bs.sum[x].add(2-y).div(3).floor()
			tr.bs.bonus_lvl[3*x+y] = RADIATION.getbonusLevel(3*x+y)
			tr.bs.eff[3*x+y] = RADIATION.getLevelEffect(3*x+y)
		}
		for (let y = 0; y < 2; y++) [tr.bs.cost[2*x+y],tr.bs.bulk[2*x+y]] = RADIATION.getBoostData(2*x+y)
	}
	tr.hz_gain = RADIATION.hz_gain()
	tr.hz_effect = RADIATION.hz_effect()
	for (let x = 0; x < RAD_LEN; x++) {
		tr.ds_gain[x] = RADIATION.ds_gain(x)
		tr.ds_eff[x] = RADIATION.ds_eff(x)
	}
}

function setupRadiationHTML() {
    let new_table = new Element("radiation_table")
	let table = ``
    for (let x = 0; x < RAD_LEN; x++) {
        let name = RADIATION.names[x]
        let id = `rad_${x}`
        let [b1, b2] = [`rad_boost_${2*x}`,`rad_boost_${2*x+1}`]
        table += `
        <div id="${id}_div" class="table_center radiation">
            <div class="sub_rad" style="width: 450px">
                Your distance of ${name}'s wave is <span id="${id}_distance">0</span> meter.<br>Which multiples ${x==0?"Frequency":"distance of "+RADIATION.names[x-1]} gain by <span id="${id}_disEff">1</span>x
            </div><div class="table_center sub_rad" style="align-items: center">
                <button id="${b1}_btn" class="btn rad" onclick="RADIATION.buyBoost(${2*x})">
                    Aplitude: <span id="${b1}_lvl1">0</span><br>
                    Cost: <span id="${b1}_cost">0</span> meters
                </button><button id="${b2}_btn" class="btn rad" onclick="RADIATION.buyBoost(${2*x+1})">
                    Velocity: <span id="${b2}_lvl1">0</span><br>
                    Cost: <span id="${b2}_cost">0</span> meters
                </button>
            </div><div class="sub_rad" style="width: 100%">
                ${RADIATION.boosts[3*x].title} [<span id="rad_level_${3*x}">0</span>]: <span id="rad_level_${3*x}_desc">0</span><br>
                ${RADIATION.boosts[3*x+1].title} [<span id="rad_level_${3*x+1}">0</span>]: <span id="rad_level_${3*x+1}_desc">0</span><br>
                ${RADIATION.boosts[3*x+2].title} [<span id="rad_level_${3*x+2}">0</span>]: <span id="rad_level_${3*x+2}_desc">0</span>
            </div>
        </div>
        `
    }
	new_table.setHTML(table)
}

function updateRadiationHTML() {
    elm.frequency.setTxt(format(player.supernova.radiation.hz,1)+" "+formatGain(player.supernova.radiation.hz,tmp.radiation.hz_gain))
    elm.frequency_eff.setTxt(format(tmp.radiation.hz_effect))

    let rad_id = 1
    for (let x = 1; x < RAD_LEN; x++) {
        if (player.supernova.radiation.hz.lt(RADIATION.unls[x]||1/0)) break
        rad_id++
    }
    elm.next_radiation.setTxt()

    elm.radiation_unl.setDisplay(rad_id < RAD_LEN)
    elm.next_radiation.setTxt(format(RADIATION.unls[rad_id]||1/0))
    elm.unl_radiation.setTxt(RADIATION.names[rad_id])

    for (let x = 0; x < RAD_LEN; x++) {
        let unl = x==0||player.supernova.radiation.hz.gte(RADIATION.unls[x])
        let id = `rad_${x}`

        elm[id+"_div"].setDisplay(unl)
        if (unl) {
            elm[id+"_distance"].setTxt(format(player.supernova.radiation.ds[x],1)+" "+formatGain(player.supernova.radiation.ds[x],tmp.radiation.ds_gain[x]))
            elm[id+"_disEff"].setTxt(format(tmp.radiation.ds_eff[x]))

            for (let y = 0; y < 2; y++) {
                let b = 2*x+y
                let id2 = `rad_boost_${b}`

                elm[id2+"_lvl1"].setTxt(format(player.supernova.radiation.bs[b],0))
                elm[id2+"_cost"].setTxt(format(tmp.radiation.bs.cost[b],1))
                elm[id2+"_btn"].setClasses({btn: true, rad: true, locked: player.supernova.radiation.ds[x].lt(tmp.radiation.bs.cost[b])})
            }
            for (let y = 0; y < 3; y++) {
                let lvl = 3*x+y
                let id2 = `rad_level_${lvl}`
                elm[id2].setTxt(format(tmp.radiation.bs.lvl[lvl],0)+(tmp.radiation.bs.bonus_lvl[lvl].gt(0)?" + "+format(tmp.radiation.bs.bonus_lvl[lvl]):""))
                elm[id2+"_desc"].setHTML(RADIATION.boosts[lvl].desc(tmp.radiation.bs.eff[lvl]))
            }
        }
    }
}