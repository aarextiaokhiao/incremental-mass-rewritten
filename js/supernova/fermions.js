const FERMIONS = {
    onActive(id) { return player.supernova.fermions.choosed == id || player.supernova.fermions.choosed2 == id },
	outside() { return !player.supernova.fermions.choosed && !player.supernova.fermions.choosed2 },
    gain(i) {
        if (!player.supernova.fermions.unl) return D(0)
        let x = D(1)
        if (tmp.radiation.unl) x = x.mul(tmp.radiation.hz_effect)
        for (let j = 0; j < FERMIONS.types[i].length; j++) x = x.mul(D(1.25).pow(player.supernova.fermions.tiers[i][j]))
        if (hasTree("fn1") && tmp.supernova) x = x.mul(tmp.supernova.tree_eff.fn1)
        x = x.mul(tmp.extMult)
        return x
    },
    backNormal() {
        if (player.supernova.fermions.choosed != "") {
            player.supernova.fermions.choosed = ""
            player.supernova.fermions.choosed2 = ""
            SUPERNOVA.doReset()
			player.supernova.auto.t = Infinity
        }
    },
    choose(i,x,a) {
		if (!a) {
			if (SHORTCUT_EDIT.mode) {
				player.shrt.order[SHORTCUT_EDIT.pos] = [2,i*10+x]
				TABS.back()
				SHORTCUT_EDIT.mode = 0
				return
			}
			if (!toConfirm('sn')) return
		}

		let dual = hasTree("qol9") && player.supernova.fermions.dual
		if (!dual) player.supernova.fermions.choosed2 = ""

		tmp.pass = true

		let id = i+""+x
		if (dual && player.supernova.fermions.choosed && player.supernova.fermions.choosed[0] != i) {
			if (player.supernova.fermions.choosed2 != id) {
				player.supernova.fermions.choosed2 = id
				SUPERNOVA.doReset()
			}
		} else if (player.supernova.fermions.choosed != id) {
			player.supernova.fermions.choosed = id
			SUPERNOVA.doReset()
		}
    },
	getTierScaling(t, bulk=false) {
		let r = t.scaleEvery("fTier", bulk)
		if (bulk) r = r.add(1).floor()
		return r
	},
	getScalingExp(x) {
		if (scalingToned("fTier")) x *= 4
		return x
	},
	maxTier(i, x) {
		let f = FERMIONS.types[i][x]
		return typeof f.maxTier == "function" ? f.maxTier() : f.maxTier || EINF
	},
    getUnlLength(x) {
        let u = 2
        if (player.chal.comps[10].lt(1)) return 0
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
                    return D('e50').pow(t.pow(FERMIONS.getScalingExp(1.25))).mul("e800")
                },
                calcTier() {
                    let res = player.atom.atomic
                    if (res.lt('e800')) return D(0)
                    let x = res.div('e800').max(1).log('e50').max(0).root(FERMIONS.getScalingExp(1.25))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return D(0)
                    let x = i.max(1).log(1.1).mul(t.pow(0.75)).softcap(1e10,0.1,0)
                    return x
                },
                desc(x) {
                    return `Adds ${format(x,0)} free Cosmic Rays`+getSoftcapHTML(x,1e10)
                },
                inc: "Atomic Powers",
                res: () => player.atom.atomic,
                cons: "Dilate Atomic Powers by ^0.6",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e50').pow(t.pow(FERMIONS.getScalingExp(1.25))).mul("e400")
                },
                calcTier() {
                    let res = player.md.particles
                    if (res.lt('e400')) return D(0)
                    let x = res.div('e400').max(1).log('e50').max(0).root(FERMIONS.getScalingExp(1.25))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return D(1)
                    let x = D(1e5).pow(i.add(1).log10().mul(t)).softcap("ee3",0.9,2)
                    return x
                },
                desc(x) {
                    return `Gain ${format(x)}x more Relativistic Particles.`+getSoftcapHTML(x,'ee3')
                },
                inc: "Relativistic Particle",
                res: () => player.md.particles,
                cons: "Reduce Relativistic Particles by ^0.1.",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('ee3').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul(uni("e36000"))
                },
                calcTier() {
                    let res = player.mass
                    if (res.lt(uni("e36000"))) return D(0)
                    let x = res.div(uni("e36000")).max(1).log('ee3').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
				eff(i, t) {
					if (FERMIONS.onActive(05)) return D(1)
					let total = i.add(1).log10().pow(1.75).mul(t.pow(0.8))
					let x = total.div(100).add(1).softcap(5,0.75,0).softcap(100,4,3)
					if (future) x = x.max(expMult(total.div(100).add(1),0.6).cbrt())
					return x
				},
				desc(x) {
					return `Raise Z<sup>0</sup>'s first effect by ^${format(x)}.`+getSoftcapHTML(x,5,100)
				},
                inc: "Mass",
                res: () => player.mass,
                cons: "You're trapped in Mass Dilation, but 2x effective.",
                isMass: true,
            },{
                maxTier: 18,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e1000').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e3e4")
                },
                calcTier() {
                    let res = player.rp.points
                    if (res.lt('e3e4')) return D(0)
                    let x = res.div('e3e4').max(1).log('e1000').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return D(1)
                    let x = i.max(1).log10().add(1).mul(t).pow(0.9).div(100).add(1).softcap(1.5,0.5,0).min(3)
                    return x
                },
                desc(x) {
                    return `Strengthen 4th Photon & Gluon Upgrades by ^${format(x)}.`+getSoftcapHTML(x,1.5)
                },
                inc: "Rage Power",
                res: () => player.rp.points,
                cons: "You're trapped in Mass Dilation and Challenges 3-5",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D("e1.75e7").pow(D(1.05).pow(t.pow(FERMIONS.getScalingExp(1))))
                },
                calcTier() {
                    let res = player.atom.points
                    if (res.lt('e1.75e7')) return D(0)
                    let x = res.log("e1.75e7").log(1.05).root(FERMIONS.getScalingExp(1))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return D(1)
                    return t.div(100).times(i.max(1).log(1e20).softcap(30,1e3,3)).add(1)
                },
                desc(x) {
                    return `Reduce the penalty of Mass Dilation by ${format(D(100).sub(D(100).div(x)))}%.`
                },
                inc: "Atoms",
                res: () => player.atom.points,
                cons: "Disable all challenge rewards.",
            },
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e4.5e8').pow(t.div(10).pow(FERMIONS.getScalingExp(1.5)).add(1))
                },
                calcTier() {
                    let res = tmp.tickspeedEffect ? tmp.tickspeedEffect.eff : D(1)
                    if (res.lt('e4.5e8')) return D(0)
                    let x = res.log('e4.5e8').sub(1).root(FERMIONS.getScalingExp(1.5)).times(10)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(05)) return D(1)
                    let total = i.add(1).log10().times(t.pow(2))
                    let ret = total.add(1).log10().div(30).add(1)
                    return ret
                },
                desc(x) {
                    return `Radiation boosts scale ${formatMultiply(x)} slower.`
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
                    return D('e5').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e175")
                },
                calcTier() {
                    let res = player.atom.quarks
                    if (res.lt('e175')) return D(0)
                    let x = res.div('e175').max(1).log('e5').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return D(1)
                    let x = i.add(1).log10().mul(t).div(100).add(1).softcap(1.5,hasTree("fn5")?0.75:0.25,0)
                    return x
                },
                desc(x) {
                    return `Star softcap starts ^${format(x)} later.`+getSoftcapHTML(x,1.5)
                },
                inc: "Quark",
                res: () => player.atom.quarks,
                cons: "Dilate Atoms by ^0.625",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e4e4').pow(t.pow(FERMIONS.getScalingExp(1.25))).mul("e6e5")
                },
                calcTier() {
                    let res = player.bh.mass
                    if (res.lt('e6e5')) return D(0)
                    let x = res.div('e6e5').max(1).log('e4e4').max(0).root(FERMIONS.getScalingExp(1.25))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return D(1)
                    let x = t.pow(1.5).add(1).pow(i.add(1).log10().softcap(10,0.75,0)).softcap(1e6,0.75,0)
                    return x
                },
                desc(x) {
                    return `Gain ${format(x)}x more Higgs & Gravitons.`+getSoftcapHTML(x,1e6)
                },
                isMass: true,
                inc: "Mass of Black Hole",
                res: () => player.bh.mass,
                cons: "BH Formula exponent is always -1.",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e5e3').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e4.5e5")
                },
                calcTier() {
                    let res = player.bh.dm
                    if (res.lt('e4.5e5')) return D(0)
                    let x = res.div('e4.5e5').max(1).log('e5e3').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return D(1)
                    let x = t.pow(0.8).mul(0.025).add(1).pow(i.add(1).log10())
					if (scalingToned("tickspeed")) x = x.add(1).log10().add(1).log10().add(1).root(3)
                    return x.min(1e6)
                },
                desc(x) {
                    return `Weaken Tickspeed by ${format(x)}x.` + (scalingToned("tickspeed") ? "" : " (before Meta scaling)")
                },
                inc: "Dark Matter",
                res: () => player.bh.dm,
                cons: "You're trapped in Challenges 8-9",
            },{
                maxTier: 15,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e400').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e1600")
                },
                calcTier() {
                    let res = player.stars.points
                    if (res.lt('e1600')) return D(0)
                    let x = res.div('e1600').max(1).log('e400').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return D(1)
					let sc = D(0.25)
					//if (AXION.unl()) sc = sc.mul(tmp.ax.eff[11])
                    let x = i.max(1).log10().add(1).mul(t).div(200).add(1).softcap(1.5,0.5,0).softcap(20,sc,0)
                    return x
                },
                desc(x) {
					let sc = D(0.25)
					//if (AXION.unl()) sc = sc.mul(tmp.ax.eff[11])
                    return `Cheapen Tiers by ${format(x)}x.`+getSoftcapHTML(x,1.5,sc)
                },
                inc: "Collapsed Star",
                res: () => player.stars.points,
                cons: "Reduce Stars by ^0.5.",
            },{
                maxTier: 100,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D('e2e5').pow(t.pow(FERMIONS.getScalingExp(1.5))).mul("e1.5e6")
                },
                calcTier() {
                    let res = player.md.mass
                    if (res.lt('e1.5e6')) return D(0)
                    let x = res.div('e1.5e6').max(1).log('e2e5').max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return D(1)
					if (t.eq(0)) return D(1)
					let sc = D(0.25)
					//if (AXION.unl()) sc = tmp.ax.eff[11].mul(sc)
                    return t.add(1).times(i.div(1e30).add(1).log10()).div(400).add(1).softcap(2.5, sc, 0)
                },
                desc(x) {
                    return `Meta-Rank scales ${format(x)}x later.`+getSoftcapHTML(x,2.5)
                },
				isMass: true,
                inc: "Dilated mass",
                res: () => player.md.mass,
                cons: "Cap Rank at 20,000 and U-Leptons do nothing. Additionally, there's no Meta scalings.",
            },
            {
                maxTier: 20,
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return D(10).pow(t.pow(FERMIONS.getScalingExp(1.5))).mul(1e20)
                },
                calcTier() {
                    let res = tmp.tickspeedEffect ? tmp.tickspeedEffect.step : D(1)
                    if (res.lt(1e19)) return D(0)
                    let x = res.div(1e20).max(1).log(10).max(0).root(FERMIONS.getScalingExp(1.5))
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
					if (FERMIONS.onActive(14)) return D(0)
                    let x = i.add(1).log10().times(t.add(1).log10()).add(1).log10().div(20)
			        //if (AXION.unl()) x = x.mul(tmp.ax.eff[5])
                    return x.softcap(2,4,3)
                },
                desc(x) {
                    return `Increase Rage Power exponent cap by ^${format(x)}.`
                },
                inc: "Tickspeed power",
                res: () => tmp.tickspeedEffect.step,
                cons: "Disable Boson Upgrades and W Bosons.",
            },

            /*
            {
                nextTierAt(x) {
                    return EINF
                },
                calcTier() {
                    let res = D(0)
                    let x = D(0)
                    return x
                },
                eff(i, t) {
                    let x = D(1)
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

function gainFermionTiers(x) {
	let maxTier = tmp.fermions.maxTier[x[0]][x[1]]
	player.supernova.fermions.tiers[x[0]][x[1]] = player.supernova.fermions.tiers[x[0]][x[1]]
	.max(tmp.fermions.tiers[x[0]][x[1]]).min(maxTier)
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
    for (let i = 0; i < 2; i++) {
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
                elm[id+"_div"].setClasses({fermion_btn: true, [max ? "comp" : i == 0 && x < 5 && hasExtMilestoneQ10() ? "auto" : FERMIONS.names[i]]: true, choosed: active})
                elm[id+"_nextTier"].setHTML(max ? "" : "Next at: " + fm(f.nextTierAt(player.supernova.fermions.tiers[i][x])) + `<br>(Increased by ${f.inc})<br><br>`)
                elm[id+"_tier_scale"].setTxt(getScalingName('fTier', i, x))
                elm[id+"_tier"].setTxt(format(player.supernova.fermions.tiers[i][x],0)+(D(tmp.fermions.maxTier[i][x]).lt(EINF) && !max ? " / " + format(tmp.fermions.maxTier[i][x],0) : ""))
                elm[id+"_desc"].setHTML(f.desc(tmp.fermions.effs[i][x]))

                elm[id+"_cur"].setDisplay(active)
                if (active) {
                    elm[id+"_cur"].setTxt(max ? "" : `Currently: ${fm(f.res())}`)
                }
            }
        }
    }
}