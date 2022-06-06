let PRIM = {
	unl: () => player.ext.pr.unl,

	setup() {
		return {
			unl: false,
			bp: E(0),
			pt: E(0),
			prim: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			f: {},
		}
	},
	calc(dt) {
		player.ext.pr.bp = player.ext.pr.bp.add(tmp.pr.bp.mul(dt))

		let pt = player.ext.pr.bp.add(1).log(1.1)
		player.ext.pr.pt = pt.mul(tmp.pr.pt_ratio)
		for (var i = 0; i < 8; i++) {
			let pr = pt.mul(tmp.pr.ratio[i])
			let pr_exp = 1.5
			if (future) pr_exp = 2
			player.ext.pr.prim[i] = pr.mul(pr_exp>1?pr.div(100).add(1).pow(pr_exp-1):1)
		}
	},

	getName(x) {
		if (x == -1) return "PC"
		return PRIM.prim[x].sym
	},
	disp(per, prim, res) {
		if (prim == -1) return Math.round(100 - 100 / per) + "% " + PRIM.getName(prim)
		if (prim >= -1 && !res) return Math.round(per * 100) + "% " + PRIM.getName(prim)
		if (prim >= -1 && res) return Math.round(-per * 100) + "% " + PRIM.getName(prim)
	},
	can(y) {
		return player.ext.pr.pt.gte(50) && player.ext.pr.f[y] == undefined
	},
	toggle(y, x) {
		if (player.ext.pr.f[y] === x) {
			delete player.ext.pr.f[y]
			EXT.reset(true)
		} else if (PRIM.can(y)) player.ext.pr.f[y] = x
	},
	conv: [
		{
			unl: () => true,
			res: [-1, 0, 1, 2],
			ratios: [
				[1, 0.01, 0, 0],
				[1.5, 0.02, 0, 0.01],
				[2, 0.03, 0, 0.02],
				[3, 0.04, 0.01, 0.03],
			]
		}, {
			unl: () => false,
			res: [-1, 0],
			ratios: [
				[1, 0],
				[1, 0],
				[1, 0],
				[1, 0],
			]
		}, {
			unl: () => false,
			res: [-1, 0],
			ratios: [
				[1, 0],
				[1, 0],
				[1, 0],
				[1, 0],
			]
		}, {
			unl: () => false,
			res: [3, 7],
			ratios: [
				[0, 0],
				[0, 0],
				[0, 0],
				[0, 0],
			]
		}
	],
	prim: [
		// COMMON PRIMORDIUMS
		{
			name: "Alpha",
			sym: "A",
			eff: [
				{
					unl: () => true,
					eff: (x) => E(1.5).pow(x).min(1e6),
					desc: (x) => "Reduce Luminosity start by ^"+format(x)+"."
				}
			]
		},
		{
			name: "Omega",
			sym: "Ω",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.add(1).log10().add(1).sqrt().min(3),
					desc: (x) => "Raise Z Axions by ^"+format(x)+"."
				}
			]
		},
		{
			name: "Sigma",
			sym: "Σ",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.div(10),
					desc: (x) => "Add Hawking Radiation by "+format(x)+"x."
				}
			]
		},
		{
			name: "Delta",
			sym: "Δ",
			eff: [
				{
					unl: () => true,
					eff: (x) => E(1.3).pow(x),
					desc: (x) => "Weaken Buildings by "+format(x)+"x."
				}
			]
		},
		
		// RARE PRIMORDIUMS
		{
			name: "Beta",
			sym: "B",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.div(20),
					desc: (x) => "Add Axion Strength by "+format(x.mul(100))+"%."
				}
			]
		},
		{
			name: "Theta",
			sym: "Θ",
			eff: [
				{
					unl: () => true,
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
					unl: () => true,
					eff: (x) => x.div(10),
					desc: (x) => "Add "+format(x)+" C14 completions."
				}
			]
		},
		{
			name: "Zeta",
			sym: "Z",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.add(1).log10().add(1).sqrt().min(3),
					desc: (x) => "Mass softcaps start later by ^"+format(x)+"."
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

	data.pt_ratio = 1
	data.ratio = [0, 0, 0, 0, 0, 0, 0, 0]
	for (var y = 0; y < PRIM.conv.length; y++) {
		var conv = PRIM.conv[y]
		if (save.f[y] !== undefined) {
			var ratio = conv.ratios[save.f[y]]
			for (var i = 0; i < ratio.length; i++) {
				var res = conv.res[i]
				if (res == -1) data.pt_ratio /= ratio[i]
				else data.ratio[res] += ratio[i]
			}
		}
	}
	if (future) for (var v = 0; v < 8; v++) data.ratio[v] = 0.2

	let b = {}
	for (var i = 0; i < 8; i++) {
		let p = PRIM.prim[i].eff
		for (var j = 0; j < p.length; j++) if (p[j].unl()) b["p"+i+"_"+j] = p[j].eff(save.prim[i])
	}
	data.eff = b
}

function updatePrimHTML() {
	tmp.el.pr_bp.setTxt(format(player.ext.pr.bp,0))
	tmp.el.pr_bp_gain.setTxt(formatGain(player.ext.pr.bp,tmp.pr.bp))
	tmp.el.pr_pt.setTxt(format(player.ext.pr.pt,0))

	for (var y = 0; y < PRIM.conv.length; y++) {
		tmp.el["pr_cr"+y].setDisplay(PRIM.conv[y].unl())
		for (var x = 0; x < 4; x++) {
			tmp.el["pr_c"+(y*10+x)].setClasses({btn: true, btn_pr: true, locked: !PRIM.can(y, x) & player.ext.pr.f[y] !== x, choosed: player.ext.pr.f[y] === x})
		}
	}
	for (var i = 0; i < 8; i++) {
		tmp.el["pr_"+i].setTxt(format(player.ext.pr.prim[i],0))
		tmp.el["pr_eff"+i].setTxt(PRIM.prim[i].eff[0].desc(tmp.pr.eff["p"+i+"_0"]))
	}
}