function setupChalHTML() {
	let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 1; x <= CHALS.cols; x++) {
		table += `<div id="chal_div_${x}" style="width: 120px; margin: 5px;"><img id="chal_btn_${x}" onclick="CHALS.choose(${x})" class="img_chal" src="images/chal_${x}.png"><br><span id="chal_comp_${x}">X</span></div>`
	}
	chals_table.setHTML(table)
}

function updateChalHTML() {
    for (let x = 1; x <= CHALS.cols; x++) {
        let max = player.chal.comps[x].gte(tmp.chal.max[x])
        let chal = CHALS[x]
        let unl = chal.unl ? chal.unl() : true
        if (x <= 8 && hasTree("qol_ext8")) unl = false
        tmp.el["chal_div_"+x].setDisplay(unl)
        tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: CHALS.inChal(x), chal_comp: max})
        if (unl) {
            tmp.el["chal_comp_"+x].setTxt(max?"Completed":format(player.chal.comps[x],0)+" / "+format(tmp.chal.max[x],0))
        }
    }
	let sweep = !CHALS.lastActive() && hasTree("qol10")
	let shrt = SHORTCUT_EDIT.mode == 1
    tmp.el.chal_enter.setVisible(!CHALS.inChal(player.chal.choosed))
    tmp.el.chal_exit.setVisible(CHALS.lastActive())
    tmp.el.chal_exit.setDisplay(!sweep)
    tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !hasTree("qol6") ? "Finish Challenge for +"+tmp.chal.gain+" Completions" : CHALS.lastActive() > 12 ? "Exit Exotic Challenge" : "Exit Challenge")
    tmp.el.chal_desc_div.setDisplay(player.chal.choosed && !shrt)
    tmp.el.chal_sweep.setDisplay(player.chal.active == 0 && player.supernova.auto.on === -2 && !shrt)
    tmp.el.chal_hint.setDisplay(!shrt)
    tmp.el.chal_shrt.setDisplay(shrt)
    if (player.chal.choosed != 0 && !shrt) {
        let x = player.chal.choosed
        let chal = CHALS[x]
        let max = player.chal.comps[x].gte(tmp.chal.max[x])
        tmp.el.chal_ch_title.setTxt(`[${x}]${CHALS.getScaleName(x)} ${chal.title} [${format(player.chal.comps[x],0)+" / "+format(tmp.chal.max[x],0)} Completions]`)
        tmp.el.chal_ch_desc.setHTML(chal.desc)
        tmp.el.chal_ch_reset.setTxt(CHALS.getReset(x))
        tmp.el.chal_ch_goal.setTxt(max ? "" : "Goal: "+CHALS.getFormat(x)(tmp.chal.goal[x])+CHALS.getResName(x))
        tmp.el.chal_ch_reward.setHTML("Reward: "+chal.reward)
        tmp.el.chal_ch_eff.setHTML("Currently: "+chal.effDesc(tmp.chal.eff[x]))
    }
}

function updateChalTemp() {
    if (!tmp.chal) tmp.chal = {
        goal: {},
        max: {},
        eff: {},
        bulk: {},
        canFinish: false,
        gain: E(0),
    }
    for (let x = 1; x <= CHALS.cols; x++) {
        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
        tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive(04) ? E(0) : player.chal.comps[x])
    }

	let active = CHALS.lastActive()
    tmp.chal.format = active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = active != 0 ? tmp.chal.bulk[active].min(tmp.chal.max[active]).sub(player.chal.comps[active]).max(0).floor() : E(0)
    tmp.chal.canFinish = active != 0 ? tmp.chal.gain.gt(0) : false
	tmp.chal.outside = active == 0 && !player.md.active && player.supernova.fermions.choosed == ""
}

const CHALS = {
    choose(x) {
        if (SHORTCUT_EDIT.mode) {
            player.shrt.order[SHORTCUT_EDIT.pos] = [1,x]
            SHORTCUT_EDIT.mode = 0
            return
        }
        if (player.chal.choosed == x) {
            this.enter()
        }
        player.chal.choosed = x
    },
    choosed(x) {
        if (x > 12) player.ext.ec = x
		else player.chal.active = x
    },
    lastActive(x) {
		return player.chal.active || player.ext.ec || 0
    },
    getActive(x) {
		let r = player.chal.active
        if (x > 12) r = player.ext.ec
		return r || 0
    },
    inChal(x) { return this.getActive(x) == x },
    reset(x, chal_reset=true) {
        if (x <= 4) FORMS.bh.doReset()
        else if (x <= 8) ATOM.doReset(chal_reset)
        else if (x <= 12) SUPERNOVA.reset(true, true)
        else EXT.reset(true)
    },
	exit(auto=false, noExt) {
		let active = this.lastActive()
		if (active > 0) {
			if (tmp.chal.canFinish) player.chal.comps[active] = player.chal.comps[active].add(tmp.chal.gain)
			if (!auto) {
				if (active <= 12) {
					player.chal.active = 0
					this.reset(active)
					player.supernova.auto.t = 1/0
				}
				if (!noExt && active > 12) {
					if (player.confirms.ec && !confirm("You'll not lose progress on exiting. Proceed?")) return
					player.ext.ec = 0
				}
			}
		}
	},
    enter() {
		let x = player.chal.choosed
		let act = this.getActive(x)

		if (act == x) return
		if (x > 12) {
			if (player.confirms.ec && !confirm("Make sure to sweep before starting! Are you sure?")) return
			player.chal.active = 0
		}
		if (act > 0) this.exit(false, true)
		this.choosed(x)
		this.reset(player.chal.choosed, false)
    },
    getResource(x) {
        if (x < 5 || x > 8) return player.mass
        return player.bh.mass
    },
    getResName(x) {
        if (x < 5 || x > 8) return ''
        return ' of Black Hole'
    },
    getFormat(x) {
        return formatMass
    },
    getReset(x) {
        if (x < 5) return "Entering challenge will reset with Dark Matters!"
        if (x < 9) return "Entering challenge will reset with Atoms except previous challenges!"
        if (x < 13) return "Entering challenge will reset without being Supernova!"
        return "Entering challenge will rise Exotic, and will lose your progress! (Recommended to sweep)"
    },
    getMax(i) {
        let x = this[i].max
        if (i <= 4) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
        if (hasElement(13) && (i==5||i==6)) x = x.add(tmp.elements.effect[13])
        if (hasElement(75) && (i==5||i==6)) x = x.add(tmp.elements.effect[75])
        if (hasElement(20) && (i==7)) x = x.add(50)
        if (hasElement(41) && (i==7)) x = x.add(50)
        if (hasElement(60) && (i==7)) x = x.add(100)
        if (hasElement(33) && (i==8)) x = x.add(50)
        if (hasElement(56) && (i==8)) x = x.add(200)
        if (hasElement(65) && (i==7||i==8)) x = x.add(200)
        if (hasTree("chal1") && (i==7||i==8)) x = x.add(100)
        if (AXION.unl() && (i==7||i>=9&&i<=12)) x = x.add(tmp.ax.eff[13])
		if (AXION.unl() && i==8) x = x.add(tmp.ax.eff[17])
        return x.floor()
    },
    getScaleName(i) {
        if (i >= 12) return ""
        if (player.chal.comps[i].gte(CHALS.getPower3Start(i))) return " Impossible"
        if (player.chal.comps[i].gte(CHALS.getPower2Start(i))) return " Insane"
        if (player.chal.comps[i].gte(CHALS.getPower1Start(i))) return " Hardened"
        return ""
    },
    getPower(i) {
        let x = E(1)
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
        if (hasTree("feat7")) x = x.mul(0.96)
        return x
    },
    getPower1Start(i) {
        return i > 8 ? 10 : 75
    },
    getPower2(i) {
        let x = E(1)
        if (AXION.unl()) x = x.mul(tmp.ax.eff[14])
        return x
    },
    getPower2Start(i) {
        return i > 8 ? 50 : i == 8 ? 200 : 300
    },
    getPower3(i) {
        return E(1)
    },
    getPower3Start(i) {
        return i > 8 ? 1 / 0 : 1000
    },
    getChalData(x, r=E(-1), a) {
		let res = CHALS.inChal(x)||a?this.getResource(x):E(0)
		let chal = this[x]

		let lvl = r.lt(0)?player.chal.comps[x]:r
		let pow = chal.pow
		if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
		if (x >= 12) {
			//Instant Exponential Scale.
			let goal = chal.start.pow(chal.inc.pow(lvl.pow(pow)))
			let bulk = res.log(chal.start).log(chal.inc).root(pow).add(1).floor()
			if (res.lt(chal.start)) bulk = E(0)
			return {goal: goal, bulk: bulk}
		}

        let goal = chal.inc.pow(lvl.pow(pow)).mul(chal.start)
        let bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).add(1).floor()
        if (res.lt(chal.start)) bulk = E(0)

        let s1 = CHALS.getPower1Start(x)
        let s2 = CHALS.getPower2Start(x)
        let s3 = CHALS.getPower3Start(x)

        if (lvl.max(bulk).gte(s1)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            goal =
            chal.inc.pow(
                    lvl.pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s2)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2())
            goal =
            chal.inc.pow(
                    lvl.pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s3)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2())
            let start3 = E(s3);
            let exp3_base = E(1).div(s3).add(1).pow(this.getPower3())
            goal =
            chal.inc.pow(
                    exp3_base.pow(lvl.sub(start3)).mul(start3)
                    .pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .div(start3)
			    .max(1)
			    .log(exp3_base)
			    .add(start3)
                .add(1)
                .floor();
        }
        return {goal: goal, bulk: bulk}
    },
    1: {
        title: "Instant Scale",
        desc: "Super Ranks, Mass Upgrades starts at 25. In additional, Super Tickspeed start at 50.",
        reward: `Super Ranks starts later, Super Tickspeed scaling weaker by completions.`,
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1.5e58),
        effect(x) {
            let rank = x.softcap(20,4,1).floor()
            let tick = E(0.96).pow(x.root(2))
            return {rank: rank, tick: tick}
        },
        effDesc(x) { return "+"+format(x.rank,0)+" later to Super Ranks, Super Tickspeed scaling "+format(E(1).sub(x.tick).mul(100))+"% weaker" },
    },
    2: {
        unl() { return player.chal.comps[1].gte(1) || player.atom.unl },
        title: "Anti-Tickspeed",
        desc: "You cannot buy Tickspeed.",
        reward: `For every completions adds +7.5% to Tickspeed Power.`,
        max: E(100),
        inc: E(10),
        pow: E(1.3),
        start: E(1.989e40),
        effect(x) {
            let sp = E(0.5)
            if (hasElement(8)) sp = sp.pow(0.25)
            if (hasElement(39)) sp = E(1)
            let ret = x.mul(0.075).add(1).softcap(1.3,sp,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+getSoftcapHTML(x,0.3) },
    },
    3: {
        unl() { return player.chal.comps[2].gte(1) || player.atom.unl },
        title: "Melted Mass",
        desc: "Mass gain softcap is divided by 1e150, and is stronger.",
        reward: `Mass gain are raised by completions, but cannot append while in this challenge!`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(2.9835e49),
		effect(x) {
			if (hasElement(64)) x = x.mul(1.5)
			let ret = x.root(1.5).mul(0.01).add(1)
			let cap = E(2.4).add(tmp.radiation && tmp.radiation.bs.eff[19])
			if (hasTree("feat5")) {
				ret = ret.add(0.05)
				cap = cap.add(0.05)
			}
			return ret.min(cap)
		},
        effDesc(x) { return "^"+format(x) },
    },
    4: {
        unl() { return player.chal.comps[3].gte(1) || player.atom.unl },
        title: "Weakened Rage",
        desc: "Rage Points gain is rooted by 10. In addtional, mass gain softcap is divided by 1e100.",
        reward: `Rage Powers gain are raised by completions.`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1.736881338559743e133),
		effect(x) {
			if (hasElement(64)) x = x.mul(1.5)
			let ret = x.root(1.5).mul(0.01).add(1)
			let cap = E(2.4).add(tmp.fermions && tmp.fermions.effs[1][5])
			if (hasTree("feat5")) {
				ret = ret.add(0.05)
				cap = cap.add(0.05)
			}
			return ret.min(cap)
		},
        effDesc(x) { return "^"+format(x) },
    },
    5: {
        unl() { return player.atom.unl },
        title: "No Rank",
        desc: "You cannot rank up.",
        reward: `Rank requirement are weaker by completions.`,
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
            let ret = E(0.97).pow(x.root(2).softcap(5,0.5,0))
            return ret
        },
        effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker"+getSoftcapHTML(x.log(0.97),5) },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) || player.supernova.times.gte(1) },
        title: "No Tickspeed & Condenser",
        desc: "You cannot buy Tickspeed & BH Condenser.",
        reward: `For every completions adds +10% to Tickspeed & BH Condenser Power.`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+getSoftcapHTML(x,0.5) },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) || player.supernova.times.gte(1) },
        title: "No Rage Powers",
        desc: "You cannot gain Rage Powers, but Dark Matters are gained by mass instead of Rage Powers at a reduced rate.<br>In additional, mass gain softcap is stronger.",
        reward: `Completions adds 2 maximum completions of 1-4 Challenge.<br><span class="yellow">On 16th completion, unlock Elements</span>`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let ret = x.mul(2)
            if (hasElement(5)) ret = ret.mul(2)
            return ret.floor()
        },
        effDesc(x) { return "+"+format(x,0) },
    },
    8: {
        unl() { return player.chal.comps[7].gte(1) || player.supernova.times.gte(1) },
        title: "White Hole",
        desc: "Dark Matter & Mass from Black Hole gains are rooted by 8.",
        reward: `Dark Matter & Mass from Black Hole gains are raised by completions.<br><span class="yellow">On first completion, unlock 3 rows of Elements</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1.989e38),
		effect(x) {
			let dm = x
			if (hasElement(64)) dm = dm.mul(1.5)
			dm = dm.root(1.75).mul(0.02).add(1)

			let bh = x.min(600)
			if (hasElement(64)) bh = bh.mul(1.5)
			bh = bh.root(1.75).mul(0.02).add(1)

			return { dm: dm, bh: bh }
		},
        effDesc(x) { return "^"+format(x.dm,3) },
    },
    9: {
        unl() { return hasTree("chal4") },
        title: "No Particles",
        desc: "You cannot assign quarks. In addtional, mass gains exponent is raised to 0.9th power.",
        reward: `Improve Magnesium-12 better.`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(hasTree("chal4a")?3.5:4).mul(0.1).add(1)
            return {exp: ret.min(1.3), mul: ret.sub(1.3).max(0).mul(3).add(1).pow(1.5) }
        },
        effDesc(x) { return "^"+format(x.exp)+(x.mul.gt(1)?", "+formatMultiply(x.mul):"") },
    },
    10: {
        unl() { return hasTree("chal5") },
        title: "The Reality I",
        desc: "All challenges 1-8 are applied at once. In addtional, you are trapped in Mass Dilation!",
        reward: `The exponent of the RP formula is multiplied by completions. (this effect doesn't work while in this challenge)<br><span class="yellow">On first completion, unlock Fermions!</span>`,
        max: E(100),
        inc: E('e2000'),
        pow: E(2),
        start: E('e3e4').mul(1.5e56),
		effect(x) {
			let exp = E(1/1.75)
			let mul = E(0.01)
			if (player.chal.comps[14].gte(0)) {
				let c14 = CHALS[14].effect(player.chal.comps[14])
				exp = exp.mul(c14.exp)
				mul = mul.mul(c14.mul)
			}
			let ret = x.pow(exp).mul(mul).add(1).min(2)
			return ret
		},
        effDesc(x) { return format(x)+"x" },
    },
    11: {
        unl() { return hasTree("chal6") },
        title: "Absolutism",
        desc: "You cannot gain relativistic particles or dilated mass. However, you are stuck in Mass Dilation.",
        reward: `Star Booster is stonger by completions.`,
        max: E(100),
        inc: E("e1e6"),
        pow: E(1.45),
        start: uni("e8.5e7"),
        effect(x) {
            let ret = x.div(100).sqrt().add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x stronger" },
    },
	12: {
		unl() { return hasTree("chal7") },
		title: "Wormhole Devourer",
		desc: "You are stuck in Mass Dilation, with ^0.428 penalty. Black Hole stays normal.",
		reward: `Radiation Boosters scale slower.<br><span class="yellow">On first completion, unlock a new prestige layer!</span>`,
		max: E(100),
		inc: E(1.15),
		pow: E(1),
		start: uni("e47250"),
		effect(x) {
			if (hasPrim("p5_0")) x = x.add(tmp.pr.eff["p5_0"])
            return E(1/0.985).pow(x)
		},
		effDesc(x) { return formatMultiply(x)+" slower" },
	},
	13: {
		unl() { return hasTree("chal8") },
		title: "Decay of Atom",
		desc: "You can't gain Atoms and Quarks.",
		reward: `Weaken the Axion Upgrade penalties.<br><span class="ch_color">On 13th completion, unlock Chroma!</span>`,
		max: E(100),
		inc: E(11/9),
		pow: E(1.2),
		start: uni("e4.5e5"),
		effect(x) {
            return E(1).div(x.div(8).add(1))
		},
		effDesc(x) { return format(E(1).sub(x).mul(100))+"% slower" },
	},
	14: {
		unl() { return (AXION.unl() && tmp.ax.lvl[21].gt(0)) || zeta() },
		title: "Monochromatic Mass",
		desc: "You can't gain non-Mass Buildings and Radiation. Additionally, you can't dilate mass and Stars are reduced.",
		reward: `Raise Challenge 10.`,
		max: E(100),
		inc: E(1.5),
		pow: E(1.25),
		start: mlt(1e3),
		effect(x) {
			if (hasPrim("p6_0")) x = x.add(tmp.pr.eff["p6_0"])
			return {
				exp: E(1.75).sub(E(0.75).div(x.div(10).add(1))),
				mul: x.div(25).add(1)
			}
		},
        effDesc(x) { return "^"+format(x.exp)+", "+formatMultiply(x.mul) },
	},
	15: {
		unl() { return (AXION.unl() && tmp.ax.lvl[21].gt(0)) || zeta() },
		title: "Chernobyl Exclusion",
		desc: `Atomic Power gives Stronger and BH Mass multiplies Booster instead.`,
		reward: `Multiply Beauty Pigments.`,
		max: E(100),
		inc: E(2),
		pow: E(3),
		start: EINF, //mlt(1e3),
		effect(x) {
			let ret = E(1)
			return x.add(1).log10().add(1)
		},
		effDesc(x) { return format(x)+"x" },
	},
	16: {
		unl() { return zeta() },
		title: "Subspatial Normalcy [Big Rip]",
		desc: "Liquidate pre-Supernovae.",
		reward: `Unlock Zeta Layer. <b style='color: red'>On completion, you are always stuck in this challenge permanently!</b>`,
		max: E(1),
		inc: E(1),
		pow: E(1),
		start: EINF,
		effect(x) {
			let ret = E(1)
			return ret
		},
		effDesc(x) { return format(x)+"x" },
	},
    cols: 16,
}

/*
3: {
    unl() { return player.chal.comps[2].gte(1) },
    title: "Placeholder",
    desc: "Placeholder.",
    reward: `Placeholder.`,
    max: E(50),
    inc: E(10),
    pow: E(1.25),
    start: EINF,
    effect(x) {
        let ret = E(1)
        return ret
    },
    effDesc(x) { return format(x)+"x" },
},
*/

function chalOutside() {
	return tmp.chal ? tmp.chal.outside : player.chal.active == 0 && !player.md.active && player.supernova.fermions.choosed == ""
}