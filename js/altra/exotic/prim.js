let PRIM = {
	unl: () => player.ext.pr.unl,

	setup() {
		return {
			unl: false,
			strand: [],
			len: 0,

			bp: E(0),
			pt: E(0),
			prim: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
		}
	},
	calc(dt) {
		player.ext.pr.bp = player.ext.pr.bp.add(tmp.pr.bp.mul(dt))

		let pt = player.ext.pr.bp.add(1).log(1.1)
		player.ext.pr.pt = pt.mul(tmp.pr.mul)

		let pr_exp = 1
		if (tmp.chal) pr_exp *= tmp.chal.eff[16]
		for (var i = 0; i < 8; i++) {
			let pr = pt.mul(tmp.pr.ratio[i]).div(100)
			player.ext.pr.prim[i] = pr.mul(pr_exp>1?pr.div(10).add(1).pow(pr_exp-1):1)
		}
	},

	can(x) {
		let s = player.ext.pr.strand
		let l = s.length
		if (player.ext.pr.pt.lt(this.req())) return
		if (l == this.max_strands) return
		if (l < x - 1) return

		for (var i = 1; i < 4; i++) if (l - i >= 0 && s[l - i] == x) return
		return true
	},
	req(x) {
		return E(1.3).pow(player.ext.pr.strand.length).mul(115)
	},
	choose(x) {
		if (!PRIM.can(x)) return
		player.ext.pr.strand.push(x)
	},
	respec() {
		if (player.ext.pr.strand.length == 0) return
		if (!confirm("Respec? This will force a Exotic reset!")) return
		player.ext.pr.strand = []
		EXT.reset(true)
	},

	strands: [
		null,
		[0,2,0,2,2,7],
		[1,1,2,3,2,5],
		[2,0,1,3,3,4],
		[1,3,0,2,0,6],
		[3,0,2,0,0,6],
	],
	max_strands: 20,

	prim: [
		// COMMON PRIMORDIUMS
		{
			name: "Alpha",
			sym: "A",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.div(50),
					desc: (x) => "Add Luminosity by "+format(x.mul(100))+"%."
				}
			]
		},
		{
			name: "Omega",
			sym: "Ω",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.div(100),
					desc: (x) => "Produce Cosmic Argons that add Argon-18 base. [+"+format(x)+"x <sup>39</sup>Ar/s]"
				}
			]
		},
		{
			name: "Sigma",
			sym: "Σ",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.add(1),
					desc: (x) => "Gain "+formatMultiply(x)+" bonus Cosmic Rays."
				}
			]
		},
		{
			name: "Delta",
			sym: "Δ",
			eff: [
				{
					unl: () => player.chal.comps[14].gte(10),
					req: () => "10 C14 completions",
					eff: (x) => x.div(1e3).add(1),
					desc: (x) => "Increase Polarizer's base by "+formatMultiply(x)+"."
				}
			]
		},
		
		// RARE PRIMORDIUMS
		{
			name: "Beta",
			sym: "B",
			eff: [
				{
					unl: () => player.chal.comps[14].gte(10),
					req: () => "10 C14 completions",
					eff: (x) => E(1.75).sub(x.div(100)).max(1).toNumber(),
					desc: (x) => "Tetr scales at ^"+format(x,3)+" rate."
				}
			]
		},
		{
			name: "Theta",
			sym: "Θ",
			eff: [
				{
					unl: () => player.chal.comps[14].gte(15),
					req: () => "15 C14 completions",
					eff: (x) => x,
					desc: (x) => "Add "+format(x)+" C12 completions."
				}
			]
		},
		{
			name: "Epsilon",
			sym: "E",
			eff: [
				{
					unl: () => player.chal.comps[14].gte(25),
					req: () => "25 C14 completions",
					eff: (x) => x.add(1).log10().div(3).add(1),
					desc: (x) => "Teritary Glueball Upgrades multiply " + formatMultiply(x) + " slower."
				},{
					unl: () => player.chal.comps[13].gte(40),
					req: () => "40 C13 completions",
					eff: (x) => x.div(3).add(1).log10().div(3).add(1),
					desc: (x) => "Extending Glueball Upgrades cheapen " + formatMultiply(x) + " faster."
				}
			]
		},
		{
			name: "Phi",
			sym: "Φ",
			eff: [
				{
					unl: () => player.chal.comps[14].gte(15),
					req: () => "15 C14 completions",
					eff: (x) => x.div(5).add(1).sqrt(),
					desc: (x) => "Gain " + formatMultiply(x) + " more Free Gluons."
				}
			]
		}
	]
}

function hasPrim(x) {
	return player.ext.pr.unl && tmp.pr.eff[x]
}

function updatePrimTemp() {
	let data = {}
	let save = player.ext.pr
	tmp.pr = data
	if (!save.unl) return

	data.bp = expMult(player.mass.max(1).log10(),0.2).div(50).pow(20)
	data.mul = 1
	data.ratio = [0, 0, 0, 0, 0, 0, 0, 0]

	for (var s = 0; s < save.strand.length; s++) {
		for (var x = 0; x < Math.min(save.strand.length - s, 6); x++) {
			data.ratio[PRIM.strands[save.strand[s]][x]] += 5
		}
	}

	let b = {}
	for (var i = 0; i < 8; i++) {
		let p = PRIM.prim[i].eff
		for (var j = 0; j < p.length; j++) if (p[j].unl()) b["p"+i+"_"+j] = p[j].eff(save.prim[i])
	}
	data.eff = b
}

//HTML
function setupPrimHTML() {
	var html = ""
	for (var x = 0; x < 8; x++) {
		var row = ""
		var effs = PRIM.prim[x].eff
		for (var y = 0; y < effs.length; y++) row += `<li id="pr_eff${x}_${y}"></li>`
		html += `
		<div class="prim` + (x >= 4 ? " rare" : "") + `">
			<b class="prim_sym">${PRIM.prim[x].sym}</b>
			<b style='font-size: 18px'><span id="pr_${x}"></span> ${PRIM.prim[x].name} Particles</b>
			<span style='color: #fb0' id="pr_per${x}">0%</span>
			<list>` + row + `</list>
		</div>
		`
	}
	new Element("pr_table").setHTML(html)

	var html = ""
	for (var y = 0; y < PRIM.max_strands; y++) {
		var row = `<tr id="pr_str${y}">`
		for (var x = 0; x < 6; x++) {
			row += `<td><div class="prim_gain" id="pr_str${y}_${x}">???</div></td>`
		}
		row += `</tr>`
		html += row
	}
	new Element("pr_conv").setHTML(html)
}

function updatePrimHTML() {
	elm.pr_bp.setTxt(format(player.ext.pr.bp,0))
	elm.pr_bp_gain.setTxt(formatGain(player.ext.pr.bp,tmp.pr.bp))
	elm.pr_pt.setTxt(format(player.ext.pr.pt,0))

	elm.pr_req.setTxt("Next choice: " + format(PRIM.req(),0) + " Primordial Clouds")
	for (var x = 1; x <= 5; x++) {
		var str = ""
		for (var i = 0; i < 6; i++) {
			if (i > 0) str += ", "
			str += PRIM.prim[PRIM.strands[x][i]].sym
		}
		elm["pr_ch"+x].setClasses({btn: true, prim_btn: true, locked: !PRIM.can(x)})
		elm["pr_ch"+x].setTooltip("Group: " + str)
	}

	elm.pr_rs.setClasses({btn: true, locked: player.ext.pr.strand.length == 0})
	for (var x = 0; x < PRIM.max_strands; x++) {
		let unl = player.ext.pr.strand.length > x 
		elm["pr_str"+x].setDisplay(unl)
		if (unl) {
			let str = player.ext.pr.strand[x]
			for (var i = 0; i < 6; i++) {
				let reveal = player.ext.pr.strand.length > i + x
				elm["pr_str"+x+"_"+i].setHTML(reveal ? "P<sub>"+PRIM.prim[PRIM.strands[str][i]].sym+"</sub>" : "???")
				elm["pr_str"+x+"_"+i].setClasses({prim_gain: true, locked: !reveal})
			}
		}
	}

	for (var x = 0; x < 8; x++) {
		var effs = PRIM.prim[x].eff
		elm["pr_"+x].setTxt(format(player.ext.pr.prim[x],0))
		elm["pr_per"+x].setTxt(format(tmp.pr.ratio[x],0)+"%")
		for (var y = 0; y < effs.length; y++) {
			elm["pr_eff"+x+"_"+y].setHTML(effs[y].unl() ? effs[y].desc(tmp.pr.eff["p"+x+"_"+y]) : "(Req: " + (effs[y].req() || "???") + ")")
			elm["pr_eff"+x+"_"+y].setOpacity(effs[y].unl() ? 1 : 0.5)
		}
	}
}