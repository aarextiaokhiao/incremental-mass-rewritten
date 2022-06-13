const FERMIONS = {
    onActive(id) { return player.supernova.fermions.choosed == id || player.supernova.fermions.choosed2 == id },
	outside() { return !player.supernova.fermions.choosed && !player.supernova.fermions.choosed2 },
    gain(i) {
        if (!player.supernova.fermions.unl) return E(0)
        let x = E(1)
        if (tmp.radiation.unl) x = x.mul(tmp.radiation.hz_effect)
        for (let j = 0; j < FERMIONS.types[i].length; j++) x = x.mul(E(1.25).pow(player.supernova.fermions.tiers[i][j]))
        if (hasTree("fn1") && tmp.supernova) x = x.mul(tmp.supernova.tree_eff.fn1)
        x = x.mul(tmp.supernova.timeMult)
        return x
    },
    backNormal() {
        if (player.supernova.fermions.choosed != "") {
            player.supernova.fermions.choosed = ""
            player.supernova.fermions.choosed2 = ""
            SUPERNOVA.reset(false,false,false,true)
			player.supernova.auto.t = 1/0
        }
    },
    choose(i,x,a) {
		if (!a) {
			if (SHORTCUT_EDIT.mode) {
				player.shrt.order[SHORTCUT_EDIT.pos] = [2,i*10+x]
				tmp.tab = tmp.sn_tab
				SHORTCUT_EDIT.mode = 0
				return
			}
			if (player.confirms.sn && !confirm("Are you sure to switch any type of any Fermion?")) return
		}

		let dual = hasTree("qol9") && player.supernova.fermions.dual
		if (!dual) player.supernova.fermions.choosed2 = ""

		tmp.tickspeedEffect.eff = E(1)
		tmp.tickspeedEffect.step = E(1)

		let id = i+""+x
		if (dual && player.supernova.fermions.choosed && player.supernova.fermions.choosed[0] != i) {
			if (player.supernova.fermions.choosed2 != id) {
				player.supernova.fermions.choosed2 = id
				SUPERNOVA.reset(false,false,false,true)
			}
		} else if (player.supernova.fermions.choosed != id) {
			player.supernova.fermions.choosed = id
			SUPERNOVA.reset(false,false,false,true)
		}
    },
	getTierScaling(t, bulk=false) {
		let d = CHROMA.got("s1_1") && tmp.fermions.dual ? CHROMA.eff("s1_1") : E(0)
		if (!bulk) t = t.sub(d)

		let r = t.scaleEvery("fTier", bulk)
		if (bulk) r = r.add(d).add(1).floor()
		return r
	},
	getScalingExp(x) {
		if (scalingToned("fTier")) x *= 7/3
		return x
	},
	maxTier(i, x) {
		let f = FERMIONS.types[i][x]
		return typeof f.maxTier == "function" ? f.maxTier() : f.maxTier || 1/0
	},
    getUnlLength(x) {
        let u = 2
        if (hasTree("fn2")) u++
        if (hasTree("fn6")) u++
        if (hasTree("fn7")) u++
        if (hasTree("fn8")) u++
        return u
    },
    names: ['quark', 'lepton'],
    sub_names: [["Up","Down","Charm","Strange","Top","Bottom"],["Electron","Muon","Tau","Neutrino","Neut-Muon","Neut-Tau"]],
    types: [
        [
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e50').pow(t.pow(FERMIONS.getScalingExp(1.25))).mul("e800")
                },
                calcTier() {
                    let res = player.atom.atomic
                    if (res.lt('e800')) return E(0)
                    let x = res.div('e800').max(1).log('e50').max(0).root(FERMIONS.getScalingExp(1.25))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(0)
                    let x = i.max(1).log(1.1).mul(t.pow(0.75))
                    return x
                },
                desc(x) {
                    return `Adds ${format(x,0)} free Cosmic Rays`
                },
                inc: "Atomic Powers",
                res: () => player.atom.atomic,
                cons: "^0.6 to the exponent of Atomic Powers gain",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e50').pow(t.pow(FERMIONS.getScalingExp(1.25))).mul("e400")
                },
                calcTier() {
                    let res = player.md.particles
                    if (res.lt('e400')) return E(0)
                    let x = res.div('e400').max(1).log('e50').max(0).root(FERMIONS.getScalingExp(1.25))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
                    let x = E(1e5).pow(i.add(1).log10().mul(t)).softcap("ee3",0.9,2)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Relativistic Particles gain`+getSoftcapHTML(x,'ee3')
                },
                inc: "Relativistic Particle",
                res: () => player.md.particles,
                cons: "The exponent of the RP formula is divided by 10",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('ee3').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul(uni("e36000"))
                },
                calcTier() {
                    let res = player.mass
                    if (res.lt(uni("e36000"))) return E(0)
                    let x = res.div(uni("e36000")).max(1).log('ee3').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
				eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
					let x = i.add(1).log10().pow(1.75).mul(t.pow(0.8)).div(100).add(1).softcap(5,0.75,0).softcap(100,4,3)
					return x
				},
				desc(x) {
					return `Z<sup>0</sup> Boson's first effect is ${format(x.sub(1).mul(100))}% stronger`+getSoftcapHTML(x,5,100)
				},
                inc: "Mass",
                res: () => player.mass,
                cons: "You are trapped in Mass Dilation, but they are twice effective",
                isMass: true,
            },{
                maxTier: 18,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e1000').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e3e4")
                },
                calcTier() {
                    let res = player.rp.points
                    if (res.lt('e3e4')) return E(0)
                    let x = res.div('e3e4').max(1).log('e1000').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
                    let x = i.max(1).log10().add(1).mul(t).pow(0.9).div(100).add(1).softcap(1.5,0.5,0).min(3)
                    return x
                },
                desc(x) {
                    return `4th Photon & Gluon upgrades are ${format(x)}x stronger`+getSoftcapHTML(x,1.5)
                },
                inc: "Rage Power",
                res: () => player.rp.points,
                cons: "You are trapped in Mass Dilation and Challenges 3-5",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E("e1.75e7").pow(E(1.05).pow(t.pow(FERMIONS.getScalingExp(1))))
                },
                calcTier() {
                    let res = player.atom.points
                    if (res.lt('e1.75e7')) return E(0)
                    let x = res.log("e1.75e7").log(1.05).root(FERMIONS.getScalingExp(1))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
                    return t.div(100).times(i.max(1).log(1e20).softcap(30,1e3,3)).add(1)
                },
                desc(x) {
                    return `Reduce the penalty of Mass Dilation by ${format(E(100).sub(E(100).div(x)))}%.`
                },
                inc: "Atoms",
                res: () => player.atom.points,
                cons: "All challenges are disabled.",
            },
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e4.5e8').pow(t.div(10).pow(FERMIONS.getScalingExp(1.5)).add(1))
                },
                calcTier() {
                    let res = tmp.tickspeedEffect ? tmp.tickspeedEffect.eff : E(1)
                    if (res.lt('e4.5e8')) return E(0)
                    let x = res.log('e4.5e8').sub(1).root(FERMIONS.getScalingExp(1.5)).times(10)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return E(1)
                    return E(1).div(i.add(1).log10().times(t.pow(2)).add(1).log10().div(30).add(1))
                },
                desc(x) {
                    return `Radiation boosts scale ${format(E(1).sub(x).mul(100))}% slower.`
                },
                inc: "Tickspeed Effect",
                res: () => tmp.tickspeedEffect.eff,
                cons: "U-Quarks and Radiation Boosts do nothing.",
            },
        ],[
            {
                maxTier() {
                    let x = 15
                    if (hasTree("fn5")) x += 35
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e175")
                },
                calcTier() {
                    let res = player.atom.quarks
                    if (res.lt('e175')) return E(0)
                    let x = res.div('e175').max(1).log('e5').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(1)
                    let x = i.add(1).log10().mul(t).div(100).add(1).softcap(1.5,hasTree("fn5")?0.75:0.25,0)
                    return x
                },
                desc(x) {
                    return `Star gain softcap starts ^${format(x)} later`+getSoftcapHTML(x,1.5)
                },
                inc: "Quark",
                res: () => player.atom.quarks,
                cons: "^0.625 to the exponent of Atoms gain",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e4e4').pow(t.pow(FERMIONS.getScalingExp(1.25))).mul("e6e5")
                },
                calcTier() {
                    let res = player.bh.mass
                    if (res.lt('e6e5')) return E(0)
                    let x = res.div('e6e5').max(1).log('e4e4').max(0).root(FERMIONS.getScalingExp(1.25))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(1)
                    let x = t.pow(1.5).add(1).pow(i.add(1).log10().softcap(10,0.75,0)).softcap(1e6,0.75,0)
                    return x
                },
                desc(x) {
                    return `x${format(x)} to Higgs Bosons & Gravitons gain`+getSoftcapHTML(x,1e6)
                },
                isMass: true,
                inc: "Mass of Black Hole",
                res: () => player.bh.mass,
                cons: "The power from the mass of the BH formula is always -1",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5e3').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e4.5e5")
                },
                calcTier() {
                    let res = player.bh.dm
                    if (res.lt('e4.5e5')) return E(0)
                    let x = res.div('e4.5e5').max(1).log('e5e3').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(1)
                    let x = t.pow(0.8).mul(0.025).add(1).pow(i.add(1).log10())
					if (scalingToned("tickspeed")) x = x.add(1).log10().add(1).log10().add(1).root(3)
                    return x.min(1e6)
                },
                desc(x) {
                    return `Tickspeed is ${format(x)}x cheaper` + (scalingToned("tickspeed") ? "" : " (before Meta scaling)")
                },
                inc: "Dark Matter",
                res: () => player.bh.dm,
                cons: "You are trapped in Challenges 8-9",
            },{
                maxTier: 15,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e400').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e1600")
                },
                calcTier() {
                    let res = player.stars.points
                    if (res.lt('e1600')) return E(0)
                    let x = res.div('e1600').max(1).log('e400').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(1)
					let sc = E(0.25)
					if (AXION.unl()) sc = sc.mul(tmp.ax.eff[11])
                    let x = i.max(1).log10().add(1).mul(t).div(200).add(1).softcap(1.5,0.5,0).softcap(20,sc,0)
                    return x
                },
                desc(x) {
					let sc = E(0.25)
					if (AXION.unl()) sc = sc.mul(tmp.ax.eff[11])
                    return `Tier requirement is ${format(x)}x cheaper`+getSoftcapHTML(x,1.5,sc)
                },
                inc: "Collapsed Star",
                res: () => player.stars.points,
                cons: "Star generators are decreased to ^0.5",
            },{
                maxTier: 100,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e2e5').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e1.5e6")
                },
                calcTier() {
                    let res = player.md.mass
                    if (res.lt('e1.5e6')) return E(0)
                    let x = res.div('e1.5e6').max(1).log('e2e5').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(1)
					if (t.eq(0)) return E(1)
					let sc = E(0.25)
					if (AXION.unl()) sc = tmp.ax.eff[11].mul(sc)
                    return t.add(1).times(i.div(1e30).add(1).log10()).div(400).add(1).softcap(2.5, sc, 0)
                },
                desc(x) {
                    return `Meta-Rank scaling starts ${format(x)}x later.`+getSoftcapHTML(x,2.5)
                },
				isMass: true,
                inc: "Dilated mass",
                res: () => player.md.mass,
                cons: "There's no Meta Scalings, but U-Leptons do nothing and Rank is capped at 20,000.",
            },
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E(10).pow(t.pow(FERMIONS.getScalingExp(1.5))).mul(1e20)
                },
                calcTier() {
                    let res = tmp.tickspeedEffect ? tmp.tickspeedEffect.step : E(1)
                    if (res.lt(1e19)) return E(0)
                    let x = res.div(1e20).max(1).log(10).max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return E(0)
                    let x = i.add(1).log10().times(t.add(1).log10()).add(1).log10().div(20)
			        if (AXION.unl()) x = x.mul(tmp.ax.eff[5])
                    return x.softcap(2,4,3)
                },
                desc(x) {
                    return `Increase Rage Power exponent cap by ^${format(x)}.`
                },
                inc: "Tickspeed power",
                res: () => tmp.tickspeedEffect.step,
                cons: "Boson Upgrades and W Bosons are disabled.",
            },

            /*
            {
                nextTierAt(x) {
                    return EINF
                },
                calcTier() {
                    let res = E(0)
                    let x = E(0)
                    return x
                },
                eff(i, t) {
                    let x = E(1)
                    return x
                },
                desc(x) {
                    return `Placeholder`
                },
                inc: "Placeholder",
                cons: "Placeholder",
            },
            */
        ],
    ],
}

function setupFermionsHTML() {
    for (i = 0; i < 2; i++) {
        let new_table = new Element("fermions_"+FERMIONS.names[i]+"_table")
        let table = ""
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            table += `
            <button id="${id}_div" class="fermion_btn ${FERMIONS.names[i]}" onclick="FERMIONS.choose(${i},${x})">
                <b>[${FERMIONS.sub_names[i][x]}]</b><br>[<span id="${id}_tier_scale"></span>Tier <span id="${id}_tier">0</span>]<br>
                <span id="${id}_cur">Currently: X</span><br>
                <span id="${id}_nextTier">X</span>
                Effect: <span id="${id}_desc">X</span>
                <br>On active: ${FERMIONS.types[i][x].cons}
            </button>
            `
        }
	    new_table.setHTML(table)
    }
}

function updateFermionsTemp() {
	let tf = tmp.fermions
    tf.ch = player.supernova.fermions.choosed == "" ? [-1,-1] : [Number(player.supernova.fermions.choosed[0]),Number(player.supernova.fermions.choosed[1])]
    tf.ch2 = player.supernova.fermions.choosed2 == "" ? [-1,-1] : [Number(player.supernova.fermions.choosed2[0]),Number(player.supernova.fermions.choosed2[1])]
    tf.dual = player.supernova.fermions.choosed != "" && player.supernova.fermions.choosed2 != ""
    for (i = 0; i < 2; i++) {
        tf.gains[i] = FERMIONS.gain(i)
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]
            tf.maxTier[i][x] = FERMIONS.maxTier(i, x)
            tf.tiers[i][x] = f.calcTier()

			let t = player.supernova.fermions.tiers[i][x]
			if (tmp.radiation && i == 1) t = t.mul(tmp.radiation.bs.eff[16])
            tf.effs[i][x] = f.eff(player.supernova.fermions.points[i], t)
        }
    }
}

function updateFermionsHTML() {
	let shrt = SHORTCUT_EDIT.mode == 1
	elm.f_hint.setDisplay(!shrt)
	elm.f_shrt.setDisplay(shrt)
	elm.f_normal.setDisplay(player.supernova.fermions.choosed ? 1 : 0)
    elm.f_sweep.setDisplay(!player.supernova.fermions.choosed && !shrt && hasTree("qol10"))
	elm.f_dual.setDisplay(!player.supernova.fermions.choosed && !shrt && hasTree("qol9"))
	elm.f_dual.setTxt("Dual: " + (player.supernova.fermions.dual ? "ON" : "OFF"))
    for (i = 0; i < 2; i++) {
        elm["f"+FERMIONS.names[i]+"Amt"].setTxt(format(player.supernova.fermions.points[i],2)+" "+formatGain(player.supernova.fermions.points[i],tmp.fermions.gains[i]))
        let unls = FERMIONS.getUnlLength(i)
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let unl = x < unls
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            let fm = f.isMass?formatMass:format
            let max = player.supernova.fermions.tiers[i][x].gte(FERMIONS.maxTier(i,x))
            let active = FERMIONS.onActive(i+""+x)

            elm[id+"_div"].setDisplay(unl)

            if (unl) {
                elm[id+"_div"].setClasses({fermion_btn: true, [max ? "comp" : FERMIONS.names[i]]: true, choosed: active})
                elm[id+"_nextTier"].setHTML(max ? "" : "Next at: " + fm(f.nextTierAt(player.supernova.fermions.tiers[i][x])) + `<br>(Increased by ${f.inc})<br><br>`)
                elm[id+"_tier_scale"].setTxt(getScalingName('fTier', i, x))
                elm[id+"_tier"].setTxt(format(player.supernova.fermions.tiers[i][x],0)+(tmp.fermions.maxTier[i][x] < Infinity && !max ? " / " + format(tmp.fermions.maxTier[i][x],0) : ""))
                elm[id+"_desc"].setHTML(f.desc(tmp.fermions.effs[i][x]))

                elm[id+"_cur"].setDisplay(active)
                if (active) {
                    elm[id+"_cur"].setTxt(max ? "" : `Currently: ${fm(f.res())}`)
                }
            }
        }
    }
}