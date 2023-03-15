const RADIATION = {
    names: ["Radio","Microwave","Infrared","Visible","Ultraviolet","X-ray","Gamma"],
    unls: ["0","1e6","1e10","1e20","5e26","5e29","1e35"],
    hz_gain() {
		if (CHALS.in(14)) return D(0)

        let x = D(1)
        if (hasTree("rad1")) x = x.mul(treeEff("rad1"))
        if (hasTree("rad3")) x = x.mul(treeEff("rad3"))
        x = x.mul(tmp.radiation.ds_eff[0])
        x = x.mul(tmp.extMult)
        return x
    },
    hz_effect() {
        let x = player.supernova.radiation.hz.add(1).root(3)
        return x
    },
    ds_gain(i) {
		if (CHALS.in(14)) return D(0)
        if (i>0&&player.supernova.radiation.hz.lt(RADIATION.unls[i])) return D(0)

        let x = D(1)
        if (i>1) x = x.div(10)
        if (hasTree('feat1')) x = x.mul(3)
		if (hasElement(71)) x = x.mul(3)
        if (hasTree("rad4")) x = x.mul(treeEff("rad4"))
        if (hasTree("rad5")) x = x.mul(treeEff("rad5"))
        if (i<RAD_LEN-1) x = x.mul(tmp.radiation.ds_eff[i+1])
        x = x.mul(getRadiationEff(i*3))
        x = x.mul(tmp.extMult)
        return x
    },
    ds_eff(i) {
        let x = player.supernova.radiation.ds[i].add(1).root(3)
        return x
    },
    getBoostData(i) {
        let b = player.supernova.radiation.bs[i]
        let [f1,f2,f3,f4] = [2+i/2,RADIATION.getBoostScalingExp(i),(i*0.5+1)**2*10,RADIATION.getBoostScalingMul(i)]
        let cost = D(f1).pow(b.pow(f2).mul(f4)).mul(f3)

        let d = player.supernova.radiation.ds[Math.floor(i/2)]
        let bulk = d.lt(f3) ? D(0) : d.div(f3).max(1).log(f1).max(0).div(f4).root(f2).add(1).floor()

        return [cost,bulk]
    },
    getBoostScalingMul(i) {
		let f4 = D(1)
		if (tmp.fermions) f4 = f4.div(tmp.fermions.effs[0][5]||1)
		f4 = f4.div(CHALS.eff(12))
		return f4
    },
    getBoostScalingExp(i) {
		if (hasTree("rad2") && i % 2 == 0) i -= 0.05
		let f2 = 1.3+i*0.05
		if (future) f2 = 1.25
		return Math.max(f2,1.25)
    },
    getLevelEffect(i) {
        let x = this.boosts[i].eff(FERMIONS.onActive(05)?D(0):tmp.radiation.bs.lvl[i].add(tmp.radiation.bs.bonus_lvl[i]))
        return x
    },
    getBonusLevel(i) {
		if (CHALS.in(14)) return D(0)

        let x = D(0)
        if (i < 8) x = x.add(getRadiationEff(8, 0))
        if (i < 17) x = x.add(getRadiationEff(17, 0))
        return x
    },
    applyBonus(x=D(0)) {
		if (!x) x = D(0)
		return x
    },
    buyBoost(i, auto) {
        let [cost, bulk, j] = [tmp.radiation.bs.cost[i], tmp.radiation.bs.bulk[i], Math.floor(i/2)]
        if (player.supernova.radiation.ds[j].gte(cost) && bulk.gt(player.supernova.radiation.bs[i])) {
            player.supernova.radiation.bs[i] = player.supernova.radiation.bs[i].max(bulk)
            let [f1,f2,f3,f4] = [2+i/2,RADIATION.getBoostScalingExp(i),(i*0.5+1)**2*10,RADIATION.getBoostScalingMul(i)]
            if (!auto) player.supernova.radiation.ds[j] = player.supernova.radiation.ds[j].sub(D(f1).pow(bulk.sub(1).pow(f2).mul(f4)).mul(f3)).max(0)
        }
    },
	max() {
		for (let x = 0; x < RAD_LEN; x++) {
			RADIATION.buyBoost(x*2)
			RADIATION.buyBoost(x*2+1)
		}
	},
	selfBoost(x, exp) {
		let res
		if (x == 0) res = player.supernova.radiation.hz
		else res = player.supernova.radiation.ds[x-1]

        let b = res.add(1).log10().div(3).add(1)
        if (hasElement(73)) b = b.mul(1.05)
        if (hasTree("rad6")) b = expMult(res, 0.15).pow(.1).mul(b)

		return b.pow(exp)
	},
    boosts: [
        {
            title: `Radio Boost`,
            eff(b) {
                return RADIATION.selfBoost(0,b)
            },
            desc(x) { return `Gain more ${format(x)}x Radio. (based on Frequency)` },
        },{
            title: `Neutron Boost`,
			eff(b) {
				return b.div(10).add(1).pow(.1).min(5)
			},
            desc(x) { return `Raise Neutron Stars by ^${format(x, 3)}.` },
        },{
            title: `Softcap Boost`,
			eff(b) {
				return b.div(30).add(1).pow(.5)
			},
            desc(x) { return `Mass softcaps scale ^${format(x, 3)} later.` },
        },{
            title: `Microwave Boost`,
            eff(b) {
                return RADIATION.selfBoost(1,b)
            },
            desc(x) { return `Gain more ${format(x)}x Microwave. (based on Radio)` },
        },{
            title: `Black Hole Boost`,
			eff(b) {
				return b.add(1).log10().div(10).min(.5)
			},
            desc(x) { return `Raise Black Hole formula by +^${format(x, 3)}.` },
        },{
            title: `Tickspeed Boost`,
			eff(b) {
				return D(2).pow(b)
			},
            desc(x) { return `Tickspeed Power's softcap scales ${format(x)}x later.` },
        },{
            title: `Infrared Boost`,
            eff(b) {
                return RADIATION.selfBoost(2,b)
            },
            desc(x) { return `Gain more ${format(x)}x Infrared. (based on Microwave)` },
        },{
            title: `Impossible Boost`,
			eff(b) {
				return D(b).add(1).log10().add(1).sqrt()
			},
            desc(x) { return `Impossible Challenges scale ${formatMultiply(x)} slower.` },
        },{
            title: `Meta-Boost I`,
            eff(b) {
                let x = b.div(2).mul(b.add(1).log10())
                return x
            },
            desc(x) { return `Add ${format(x)} levels to all above boosts` },
        },{
            title: `Visible Boost`,
            eff(b) {
                return RADIATION.selfBoost(3,b)
            },
            desc(x) { return `Gain more ${format(x)}x Visible. (based on Infrared)` },
        },{
            title: `Relativistic Boost`,
			eff(b) {
				return D(1)
			},
            desc(x) { return `Raise Relativistic Particles by ^${format(x, 3)}.` },
        },{
            title: `Reality Exponent`,
			eff(b) {
				return D(1)
			},
            desc(x) { return `Raise Challenge 10 reward by ^${format(x, 3)}.` },
        },{
            title: `Ultraviolet Boost`,
            eff(b) {
                return RADIATION.selfBoost(4,b)
            },
            desc(x) { return `Gain more ${format(x)}x Ultraviolet. (based on Visible)` },
        },{
            title: `U-Quark Boost`,
			eff(b) {
				return D(1)
			},
            desc(x) { return `Strengthen U-Quark Tiers by ${format(x)}x.` },
        },{
            title: `U-Lepton Boost`,
			eff(b) {
				return D(1)
			},
            desc(x) { return `Strengthen U-Lepton Tiers by ${format(x)}x.` },
        },{
            title: `X-Ray Boost`,
            eff(b) {
                return RADIATION.selfBoost(5,b)
            },
            desc(x) { return `Gain more ${format(x)}x X-Rays. (based on Ultraviolet)` },
        },{
            title: `Supernovae Boost`,
			eff(b) {
				return D(9).sub(b.add(1).log10()).max(4).log(9)
			},
            desc(x) { return `Supernovae scalings scale ${format(D(1).sub(x).mul(100))}% slower.` },
        },{
            title: `Meta Boost II`,
            eff(b) {
                let x = b.div(2).mul(b.add(1).log10())
                return x
            },
            desc(x) { return `Add ${format(x)} levels to all above boosts` },
        },
        {
            title: `Gamma Boost`,
            eff(b) {
                return RADIATION.selfBoost(6,b)
            },
            desc(x) { return `Gain more ${format(x)}x Gamma. (based on X-Rays)` },
        },
        {
            title: `Tetr Boost`,
			eff(b) {
				return D(1)
			},
            desc(x) { return `Weaken Super Tetr scaling by ${format(x)}x.` },
        },
        {
            title: `Meta-Tickspeed Boost`,
			eff(b) {
				return D(1)
			},
            desc(x) { return `Meta-Tickspeed starts ${format(x)}x later.` },
        },

        /*
        {
            title: `Placeholder Boost`,
            eff(b) {
                let x = D(1)
                return x
            },
            desc(x) { return `Placeholder` },
        },
        */
    ],
}

const RAD_LEN = 7

function getRadiationEff(x, def = 1) {
	if (!tmp.radiation) return def
	return tmp.radiation.bs.eff[x] ?? def
}

function updateRadiationTemp() {
	let tr = tmp.radiation
	tr.unl = hasTree("unl1")
	for (let x = 0; x < RAD_LEN; x++) {
		tr.bs.sum[x] = player.supernova.radiation.bs[2*x].add(player.supernova.radiation.bs[2*x+1])
		for (let y = 0; y < 3; y++) {
			tr.bs.lvl[3*x+y] = tr.bs.sum[x].add(2-y).div(3).floor()
			tr.bs.bonus_lvl[3*x+y] = RADIATION.getBonusLevel(3*x+y)
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
                ${name} wave is <span id="${id}_distance">0</span> m long.
				<span id="${id}_disGain">0</span><br>
				(<span id="${id}_disEff">1</span>x ${x==0?"Frequency":RADIATION.names[x-1]})
            </div><div class="table_center sub_rad" style="align-items: center">
                <button id="${b1}_btn" class="btn rad" onclick="RADIATION.buyBoost(${2*x})">
                    Amplitude: <span id="${b1}_lvl1">0</span><br>
                    Cost: <span id="${b1}_cost">0</span> m
                </button><button id="${b2}_btn" class="btn rad" onclick="RADIATION.buyBoost(${2*x+1})">
                    Velocity: <span id="${b2}_lvl1">0</span><br>
                    Cost: <span id="${b2}_cost">0</span> m
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
        if (player.supernova.radiation.hz.lt(RADIATION.unls[x]||EINF)) break
        rad_id++
    }
    elm.next_radiation.setTxt()

    elm.radiation_unl.setDisplay(rad_id < RAD_LEN)
    elm.next_radiation.setTxt(format(RADIATION.unls[rad_id]||EINF))
    elm.unl_radiation.setTxt(RADIATION.names[rad_id])

    for (let x = 0; x < RAD_LEN; x++) {
        let unl = x==0||player.supernova.radiation.hz.gte(RADIATION.unls[x])
        let id = `rad_${x}`

        elm[id+"_div"].setDisplay(unl)
        if (unl) {
            elm[id+"_distance"].setTxt(format(player.supernova.radiation.ds[x],1))
            elm[id+"_disGain"].setTxt(formatGain(player.supernova.radiation.ds[x],tmp.radiation.ds_gain[x]))
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