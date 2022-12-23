const CHALS_NEW = {
	//In
	in(x) {
		return tmp.chal.inForce.includes(x)
	},
	inDirect(x) {
		return tmp.chal.in.includes(x)
	},
	inAny() {
		return tmp.chal.in.length || player.md.active || player.supernova.fermions.choosed
	},

	//Entering
	canBulk() {
		return false
	},
	enter(layer, x) {
		if (CHALS_NEW.in(x)) return
		if (tmp.chal.lastLayer == layer && !toConfirm('chal')) return

		if (!player.chal.progress[layer]) player.chal.progress[layer] = [x]
		else if (!CHALS_NEW.canBulk()) {
			for (const c of player.chal.progress[layer]) gainChalComp(c)
			player.chal.progress[layer] = [x]
		} else player.chal.progress[layer].push(x)
		player.chal.lastComps[x] = player.chal.comps[x]
		player.chal.bulkComps[x] = player.chal.comps[x]

		CHALS_NEW.layers[layer].doReset()
	},
	exit(layer) {
		if (tmp.chal.lastLayer == layer && player.confirms.chal && !confirm("Exit this challenge? You won't gain additional completions until you return!")) return
		for (const c of player.chal.progress[layer]) gainChalComp(c)
		delete player.chal.progress[layer]
	},
	clear(layer) {
		for (let c = layer * 4 + 1; c <= layer * 4 + 4; c++) player.chal.comps[c] = D(0)

		if (player.chal.active >= layer * 4 + 1 && player.chal.active <= layer * 4 + 4) player.chal.active = 0
		delete player.chal.progress[layer]
	},

	//Choosing
	choose(x) {
		const layer = Math.ceil(x / 4) - 1
		if (tmp.chal.choosed == x) CHALS_NEW.enter(layer, x)
		else tmp.chal.choosed = x
	},

	//Scalings
	goal(i, comp) {
		comp = D(comp || player.chal.comps[i])

		if (i < 9) {
			let start3 = CHALS_NEW.getPower3Start(i)
			if (comp.gte(start3)) comp = D(1).div(start3).add(1).pow(comp.sub(start3).mul(CHALS_NEW.getPower3(i))).mul(start3)
		}
		if (i < 12) {
			let start2 = CHALS_NEW.getPower2Start(i)
			if (comp.gte(start2)) comp = comp.div(start2).pow(D(4.5).pow(CHALS_NEW.getPower2(i))).mul(start2)

			let start1 = CHALS_NEW.getPower1Start(i)
			if (comp.gte(start1)) comp = comp.div(start1).pow(D(3).pow(CHALS_NEW.getPower1(i))).mul(start1)
		}

		let scale = CHALS_NEW.chals[i].scale
		let pow = D(scale.pow)
		if (hasElement(10) && (i == 3 || i == 4)) pow = pow.mul(0.95)

		if (scale.sexp) return D(scale.start).pow(D(scale.inc).pow(comp.pow(pow)))
		else return D(scale.start).mul(D(scale.inc).pow(comp.pow(pow)))
	},
	bulk(i, res) {
		res = D(res || CHALS_NEW.layers[Math.ceil(i / 4) - 1].res())

		let scale = CHALS_NEW.chals[i].scale
		let pow = D(scale.pow)
		if (hasElement(10) && (i == 3 || i == 4)) pow = pow.mul(0.95)

		let comp = D(0)
		if (scale.sexp) comp = D(res).log(scale.start).log(scale.inc).root(pow)
		else comp = D(res).div(scale.start).log(scale.inc).root(pow)
		if (D(res).lt(scale.start)) return D(0)

		if (i < 12) {
			let start1 = CHALS_NEW.getPower1Start(i)
			if (D(comp).gte(start1)) comp = comp.div(start1).root(D(3).pow(CHALS_NEW.getPower1(i))).mul(start1)

			let start2 = CHALS_NEW.getPower2Start(i)
			if (D(comp).gte(start2)) comp = comp.div(start2).root(D(4.5).pow(CHALS_NEW.getPower2(i))).mul(start2)
		}
		if (i < 9) {
			let start3 = CHALS_NEW.getPower3Start(i)
			if (D(comp).gte(start3)) comp = comp.div(start3).log(D(1).div(start3).add(1)).div(CHALS_NEW.getPower3(i)).add(start3)
		}

		return comp.floor().add(1).min(CHALS_NEW.max(i))
	},

    getScalingName(i, comp) {
		comp = D(comp || player.chal.comps[i])

        if (i >= 12) return ""
        if (i < 9 && comp.gte(CHALS_NEW.getPower3Start(i))) return "Impossible "
        if (comp.gte(CHALS_NEW.getPower2Start(i))) return "Insane "
        if (comp.gte(CHALS_NEW.getPower1Start(i))) return "Hardened "
        return ""
    },
	getPower1(i) {
		let x = D(1)
		if (hasElement(2)) x = x.mul(0.75)
		if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
		if (hasTree("feat7")) x = x.mul(0.96)
		return x
	},
	getPower1Start(i) {
		return i > 8 ? 10 : 75
	},
	getPower2(i) {
		let x = D(1)
		//if (AXION.unl()) x = x.mul(tmp.ax.eff[14])
		return x
	},
	getPower2Start(i) {
		return i > 8 ? 50 : i == 8 ? 200 : 300
	},
	getPower3(i) {
		return getRadiationEff(7)
	},
	getPower3Start(i) {
		return i > 8 ? EINF : 1000
	},

	//Others
	max(x) {
		let r = x > 8 ? CHALS_NEW.chals[x].max : CHALS_NEW.chals[x].max()
		if (x == 3) r = r.min(2e3)
		return r
	},
	eff(x, def = D(1)) {
		return tmp.chal.eff[x] || CHALS_NEW.chals[x].effect(player.chal.comps[x])
	},

	//4 per layer
	layers: [
		{
			title: "Black Hole",
			unl: () => player.bh.unl,
			doReset: () => FORMS.bh.doReset(),

			resName: "mass",
			res: () => player.mass,

			autoGain: () => true,
			mustExit: () => true,
			mustReset: () => true,
		},
		{
			title: "Atom",
			unl: () => player.atom.unl,
			doReset: () => ATOM.doReset(true),

			resName: "mass of black hole",
			res: () => player.bh.mass,

			autoGain: () => true,
			mustExit: () => true,
			mustReset: () => true,
		},
		{
			title: "Supernovae",
			unl: () => hasTree("chal4"),
			doReset: () => SUPERNOVA.doReset(true),

			resName: "mass",
			res: () => player.mass,

			autoGain: () => true,
			mustExit: () => true,
			mustReset: () => true,
		},
		{
			title: "Exotic",
			unl: () => hasExtMilestone("unl", 2),
			doReset: () => EXT.reset(true),

			resName: "mass",
			res: () => player.mass,

			autoGain: () => true,
			mustExit: () => true,
			mustReset: () => true,
		},
	],
	chals: [
		null,

		{
			unl: () => true,
			force: () => CHALS_NEW.in(10),

			title: "Instant Scale",
			desc: "Super Rank and Mass Upgrades start at 25. Additionally, Super Tickspeed starts at 50.",

			max: () => D(100).add(CHALS_NEW.eff(7)).floor(),
			scale: {
				inc: D(5),
				pow: D(1.3),
				start: D(1.5e58),
			},

			reward: `Super Rank scales later, and weaken Super Tickspeed.`,
			effect(x) {
				let rank = x.softcap(20,4,1).floor()
				let tick = D(0.96).pow(x.root(2))
				return {rank: rank, tick: tick}
			},
			effDesc(x) { return "+"+format(x.rank,0)+" to Super Rank, "+format(D(1).sub(x.tick).mul(100))+"% weaker to Super Tickspeed" },
		},
		{
			unl: () => player.atom.unl || player.chal.comps[1].gt(0),
			force: () => CHALS_NEW.in(10),

			title: "Anti-Tickspeed",
			desc: "You can't buy Tickspeed.",

			max: () => D(100).add(CHALS_NEW.eff(7)).floor(),
			scale: {
				inc: D(10),
				pow: D(1.3),
				start: D(1.989e40),
			},

			reward: `Add Tickspeed Power.`,
			effect(x) {
				let sp = D(0.5)
				if (hasElement(8)) sp = sp.pow(0.25)
				if (hasElement(39)) sp = D(1)
				let ret = x.mul(0.075).add(1).softcap(1.3,sp,0).sub(1)
				return ret
			},
			effDesc(x) { return "+"+format(x.mul(100))+"%"+getSoftcapHTML(x,0.3) },
		},
		{
			unl: () => player.atom.unl || player.chal.comps[2].gt(0),
			force: () => CHALS_NEW.in(10),

			title: "Melted Mass",
			desc: "Mass softcap scales /1e150 earlier, and is stronger.",

			max: () => D(100).add(CHALS_NEW.eff(7)).floor(),
			scale: {
				inc: D(25),
				pow: D(1.25),
				start: D(2.9835e49),
			},

			reward: `Raise Mass. [can't apply in this challenge]`,
			effect(x) {
				if (hasElement(64)) x = x.mul(1.5)
				return x.root(1.5).mul(0.01).add(1)
			},
			effDesc(x) { return "^"+format(x) },
		},
		{
			unl: () => player.atom.unl || player.chal.comps[3].gt(0),
			force: () => CHALS_NEW.in(10),

			title: "Weakened Rage",
			desc: "Reduce Rage Power. Additionally, mass softcap scales /1e100 earlier.",

			max: () => D(100).add(CHALS_NEW.eff(7)).floor(),
			scale: {
				inc: D(30),
				pow: D(1.25),
				start: D(1.736881338559743e133),
			},

			reward: `Raise Rage Power.`,
			effect(x) {
				if (hasElement(64)) x = x.mul(1.5)
				return x.root(1.5).mul(0.01).add(1)
			},
			effDesc(x) { return "^"+format(x) },
		},

		{
			unl: () => player.atom.unl,
			force: () => CHALS_NEW.in(10),

			title: "No Rank",
			desc: "You can't rank up.",

			max() {
				let r = D(50)
				if (hasElement(13)) r = r.add(tmp.elements.effect[13])
				return r.floor()
			},
			scale: {
				inc: D(50),
				pow: D(1.25),
				start: D(1.5e136),
			},

			reward: `Weaken Rank.`,
			effect(x) {
				let ret = D(0.97).pow(x.root(2).softcap(5,0.5,0)).max(.5)
				return ret
			},
			effDesc(x) { return format(D(1).sub(x).mul(100))+"% weaker"+getSoftcapHTML(x.log(0.97),5) },
		},
		{
			unl: () => player.supernova.unl || player.chal.comps[5].gt(0),
			force: () => CHALS_NEW.in(10),

			title: "No Tickspeed & Condenser",
			desc: "You cannot buy Tickspeed & BH Condenser.",

			max() {
				let r = D(50)
				if (hasElement(13)) r = r.add(tmp.elements.effect[13])
				return r.floor()
			},
			scale: {
				inc: D(64),
				pow: D(1.25),
				start: D(1.989e38),
			},

			reward: `Add Tickspeed & BH Condenser Power.`,
			effect(x) {
				let ret = x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
				return ret
			},
			effDesc(x) { return "+"+format(x)+"x"+getSoftcapHTML(x,0.5) },
		},
		{
			unl: () => player.supernova.unl || player.chal.comps[6].gt(0),
			force: () => CHALS_NEW.in(10),

			title: "No Rage Power",
			desc: "You can't gain Rage Power, but gain Dark Matter by mass. Additionally, strengthen mass softcap.",

			max() {
				let r = D(50)
				if (hasElement(20)) r = r.add(50)
				if (hasElement(41)) r = r.add(50)
				if (hasElement(60)) r = r.add(100)
				if (hasElement(65)) r = r.add(200)
				if (hasTree("chal1")) r = r.add(100)
				return r.floor()
			},
			scale: {
				inc: D(64),
				pow: D(1.25),
				start: D(1.5e76),
			},

			reward: `Add maximum completions to C1-4.<br><span class="yellow">At 16th completion, unlock Element Upgrades!</span>`,
			effect(x) {
				let ret = x.mul(2)
				if (hasElement(5)) ret = ret.mul(2)
				return ret.floor()
			},
			effDesc(x) { return "+"+format(x,0) },
		},
		{
			unl: () => player.supernova.unl || player.chal.comps[7].gt(0),
			force: () => CHALS_NEW.in(10),

			title: "White Hole",
			desc: "Reduce Dark Matter and Black Hole mass.",

			max() {
				let r = D(50)
				if (hasElement(33)) r = r.add(50)
				if (hasElement(56)) r = r.add(200)
				if (hasElement(65)) r = r.add(200)
				if (hasTree("chal1")) r = r.add(100)
				return r.floor()
			},
			scale: {
				inc: D(80),
				pow: D(1.3),
				start: D(1.989e38),
			},

			reward: `Raise Dark Matter and Black Hole mass.<br><span class="yellow">At first completion, unlock 3 rows of Elements!</span>`,
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

		{
			unl: () => hasTree("chal4"),
			force: () => FERMIONS.onActive("12"),

			title: "No Particles",
			desc: "You can't assign quarks. Additionally, dilate mass by ^0.9!",

			max: D(100),
			scale: {
				inc: D('e500'),
				pow: D(2),
				start: D('e9.9e4').mul(1.5e56),
			},

			reward: `Improve Magnesium-12 better.`,
			effect(x) {
				let ret = x.root(hasTree("chal4a")?3.5:4).mul(0.1).add(1)
				return {exp: ret.min(1.3), mul: ret.sub(1.3).max(0).mul(3).add(1).pow(1.5) }
			},
			effDesc(x) { return "^"+format(x.exp)+(x.mul.gt(1)?", "+formatMultiply(x.mul):"") },
		},
		{
			unl: () => hasTree("chal5"),

			title: "The Reality I",
			desc: "Challenges 1 - 8, but you are trapped in Mass Dilation!",

			max: D(100),
			scale: {
				inc: D('e2000'),
				pow: D(2),
				start: D('e3e4').mul(1.5e56),
			},

			reward: `Raise the RP formula. [can't apply in this challenge]<br><span class="yellow">At first completion, unlock Fermions!</span>`,
			effect(x) {
				let ret = x.root(1.75).div(100).add(1)
				ret = ret.pow(getRadiationEff(11))
				return ret
			},
			effDesc(x) { return "^"+format(x,3) },
		},
		{
			unl: () => hasTree("chal6"),

			title: "Absolutism",
			desc: "You can't gain relativistic particles. Additionally, you are trapped in Mass Dilation!",

			max: D(100),
			scale: {
				inc: D(1.15),
				pow: D(1),
				start: uni("e1e6"),
				sexp: true
			},

			reward: `Strengthen Star Boosters.<br><span class="yellow">On first completion, unlock Pent!</span>`,
			effect(x) {
				return x.div(20).add(1)
			},
			effDesc(x) { return format(x)+"x stronger" },
		},
		{
			unl: () => hasTree("chal7"),

			title: "Wormhole Devourer",
			desc: "You are stuck in Mass Dilation, with ^0.428 penalty. Black Hole stays normal.",

			max: D(100),
			scale: {
				inc: D(1.15),
				pow: D(1),
				start: uni("e47250"),
				sexp: true
			},

			reward: `Radiation Boosters scale slower.<br><span class="yellow">On first completion, unlock a new prestige layer!</span>`,
			effect(x) {
				//c12 boost - closer to linear inflation
				return D(1/0.985).pow(x)
			},
			effDesc(x) { return formatMultiply(x)+" slower" },
		},

		{
			unl: () => hasExtMilestone("unl", 2),

			title: "Decay of Atom",
			desc: "You can't gain Atoms and Quarks. Additionally, start with Bosons unlocked.",

			max: D(100),
			scale: {
				inc: D(1),
				pow: D(1),
				start: EINF,
				sexp: true
			},

			reward: `???`,
			effect(x) {
				return D(1)
			},
			effDesc(x) { return formatMultiply(x)+"x" },
		},
		{
			unl: () => player.chal.comps[13].gt(0),

			title: "Monochromatic Mass",
			desc: "You can't gain non-Mass Buildings and Radiation. Additionally, you can't dilate mass and Stars are reduced.",

			max: D(100),
			scale: {
				inc: D(1),
				pow: D(1),
				start: EINF,
				sexp: true
			},

			reward: `???`,
			effect(x) {
				return D(1)
			},
			effDesc(x) { return formatMultiply(x)+"x" },
		},
		{
			unl: () => player.chal.comps[14].gt(0),

			title: "The Reality II",
			desc: `Challenges 11 - 12, but Temporal Supernovae do nothing.`,

			max: D(50),
			scale: {
				inc: D(1),
				pow: D(1),
				start: EINF,
				sexp: true
			},

			reward: `???`,
			effect(x) {
				return D(1)
			},
			effDesc(x) { return formatMultiply(x)+"x" },
		},
		{
			unl: () => player.chal.comps[15].gt(0),

			title: "Subspatial Normalcy",
			desc: "Liquate pre-Supernovae!",

			max: D(80),
			scale: {
				inc: D(1),
				pow: D(1),
				start: EINF,
				sexp: true
			},

			reward: `???`,
			effect(x) {
				return D(1)
			},
			effDesc(x) { return formatMultiply(x)+"x" },
		},
	]
}
const CHAL_NUM = CHALS_NEW.layers.length * 4

function chalTick() {
	if (player.mass.gte(1.5e136)) player.chal.unl = true
	if (!player.chal.unl) return

	for (const i of tmp.chal.in) {
		let layer = Math.ceil(i / 4) - 1
		if (CHALS_NEW.bulk(i).gt(player.chal.bulkComps[i])) player.chal.bulkComps[i] = CHALS_NEW.bulk(i)
		if (hasTree("qol6")) player.chal.comps[i] = player.chal.bulkComps[i]
	}
}

function gainChalComp(x) {
	player.chal.comps[x] = player.chal.comps[x].max(player.chal.bulkComps[x] || CHALS_NEW.bulk(i))
}

function updateChalTempNew() {
	//In
	let lastLayer = 0
	for (let [l, d] of Object.entries(CHALS_NEW.layers)) {
		if (d.unl()) lastLayer = i
	}
	tmp.chal.lastLayer = lastLayer

	let inChal = []
	let inLastLayer = Infinity
	for (let [l, d] of Object.entries(player.chal.progress)) {
		for (let c of d) inChal.push(c)
		inLastLayer = Math.min(l, inLastLayer)
	}
	tmp.chal.in = [...inChal]
	tmp.chal.inLastLayer = inLastLayer

	for (let c = CHAL_NUM; c > 0; c--) {
		let force = CHALS_NEW.chals[c].force
		if (force && force() && !inChal.includes(c)) inChal.push(c)
	}
	tmp.chal.inForce = inChal

	//Eff
	tmp.chal.eff = {}
	for (let c = CHAL_NUM; c > 0; c--) {
		tmp.chal.eff[c] = CHALS_NEW.chals[c].effect(player.chal.comps[c])
	}
}

//HTML
function setupChalHTMLNew() {
	let html = ""
	for (let layer = CHALS_NEW.layers.length - 1; layer >= 0; layer--) {
		html += `<div class='table_center' id="chals_${layer}">`
		for (let c = layer * 4 + 1; c <= layer * 4 + 4; c++) {
			html += `<div id="chal_${c}" style="width: 120px; margin: 5px;"><img id="chal_${c}_btn" onclick="CHALS_NEW.choose(${c})" class="img_chal" src="images/chals/chal_${c}.png"><br><span id="chal_${c}_comp">0 / 0</span></div>`
		}
		html += `
			<button id="chals_${layer}_start" class="btn" onclick="CHALS_NEW.enter(${layer}, tmp.chal.choosed[${layer}])">Start</button>
			<button id="chals_${layer}_exit" class="btn" onclick="CHALS_NEW.exit(${layer})">Exit</button>
		</div><div id="chals_${layer}_chosen" style='display: none'>
			<b class="yellow" id="chals_${layer}_title"></b><br>
			<span class="red" id="chals_${layer}_desc"></span><br>
			Goal: <span id="chals_${layer}_goal"></span><br><br>

			<b class='green'>
				Reward: <span id="chals_${layer}_reward"></span><br>
				Currently: <span id="chals_${layer}_eff"></span>
			</b>
		</div>`
	}
	new Element("chal_table").setHTML(html)
}

function updateChalHTMLNew() {
	for (const [id, layer] of Object.entries(CHALS_NEW.layers)) {
		const unl = layer.unl()
		elm[`chals_${id}`].setDisplay(unl)
		if (!unl) {
			elm[`chals_${id}_chosen`].setDisplay(false)
			continue
		}

		const chooseNum = tmp.chal.choosed
		let choosed = false
		for (let c = id * 4 + 1; c <= id * 4 + 4; c++) {
			let inChal = CHALS_NEW.in(c)
			let comp = D(player.chal.comps[c]).gte(CHALS_NEW.max(c))
			elm[`chal_${c}`].setDisplay(CHALS_NEW.chals[c].unl())
			elm[`chal_${c}_comp`].setHTML(
				comp ? "<b class='green'>Completed</b>" :
				tmp.chal.in.includes(c) ? "+" + format(player.chal.bulkComps[c].sub(player.chal.lastComps[c]), 0) :
				format(player.chal.comps[c] || 0, 0) + " / " + format(CHALS_NEW.max(c), 0))
			elm[`chal_${c}_btn`].setClasses({img_chal: true, ch_choosed: chooseNum == c, ch_in: inChal && tmp.chal.in.includes(c), ch_force: inChal && !tmp.chal.in.includes(c), ch_comp: comp && !inChal })

			if (chooseNum == c) choosed = true
		}

		elm[`chals_${id}_start`].setDisplay(choosed && !CHALS_NEW.in(choosed))
		elm[`chals_${id}_exit`].setDisplay(player.chal.progress[id])

		elm[`chals_${id}_chosen`].setDisplay(choosed)
		if (choosed) {
			elm[`chals_${id}_title`].setTxt(`[${chooseNum}] ${CHALS_NEW.getScalingName(chooseNum) + CHALS_NEW.chals[chooseNum].title}`)
			elm[`chals_${id}_desc`].setTxt(CHALS_NEW.chals[chooseNum].desc)
			elm[`chals_${id}_goal`].setTxt(`${formatMass(CHALS_NEW.goal(chooseNum))} ${layer.resName}`)
			elm[`chals_${id}_reward`].setHTML(CHALS_NEW.chals[chooseNum].reward)
			elm[`chals_${id}_eff`].setHTML(CHALS_NEW.chals[chooseNum].effDesc(tmp.chal.eff[chooseNum]))
		}
	}

    elm.chal_sweep.setDisplay(!CHALS_NEW.inAny() && hasTree("qol10"))
}

function updateChalHeaderNew() {
	let layer = tmp.chal.inLastLayer
	let chal = player.chal.progress[layer] || []
	let md = player.md.active
	let f = player.supernova.fermions.choosed

	elm.chal_upper.setDisplay(CHALS_NEW.inAny() && !player.reset_msg)

	if (md) {
		elm.chal_upper.setHTML(`You are in Mass Dilation!<br>Go over ${formatMass(MASS_DILATION.mass_req())} to gain Relativistic Particles!`)
	} else if (f) {
		let f1_y = f[0]
		let f1_x = f[1]
		let fm = FERMIONS.types[f1_y][f1_x]
		let ft = player.supernova.fermions.tiers[f1_y][f1_x]
		let ff = fm.isMass?formatMass:format

		let f2 = player.supernova.fermions.choosed2
		let f2_y = f2[0]
		let f2_x = f2[1]

		elm.chal_upper.setHTML(
			"You are in "+FERMIONS.sub_names[f1_y][f1_x]+" "+FERMIONS.names[f1_y]+
			(f2?" and "+FERMIONS.sub_names[f2_y][f2_x]+" "+FERMIONS.names[f2_y]:"")+
			"!"+
			(f2||ft.gte(FERMIONS.maxTier(f1_y,f1_x)) ? "" :
				"<br>Go over "+ff(fm.res())+" / "+ff(fm.nextTierAt(ft))+" "+fm.inc+" to complete."
			)
		)
	} else if (chal.length > 1) {
		elm.chal_upper.setHTML(
			`You are in Challenges [${chal.join(", ")}]!`
		)
	} else if (chal.length == 1) {
		chal = chal[0]

		let layer_data = CHALS_NEW.layers[layer]
		elm.chal_upper.setHTML(
			`You are in [${CHALS_NEW.chals[chal].title}] Challenge!<br>` + (
				player.chal.comps[chal].gte(CHALS_NEW.max(chal)) ? `` :
				player.chal.bulkComps[chal].gt(player.chal.lastComps[chal]) ? `+${format(player.chal.bulkComps[chal].sub(player.chal.lastComps[chal]),0)} (Next: ${format(layer_data.res())} / ${format(CHALS_NEW.goal(chal, player.chal.bulkComps[chal]))} ${layer_data.resName})` :
				`Get ${format(layer_data.res())} / ${format(CHALS_NEW.goal(chal))} ${layer_data.resName} to complete.`
			)
		)
	} else {
		elm.chal_upper.setTxt("[ ERROR ]")
	}
}