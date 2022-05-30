let PRIM = {
	unl: () => player.ext.pr.unl,

	setup() {
		return {
			unl: false,
			bp: E(0),
			pt: E(0),
			prim: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			field: [],
		}
	},
	calc(dt) {
		player.ext.pr.bp = player.ext.pr.bp.add(tmp.pr.bp.mul(dt))
		player.ext.pr.pt = player.ext.pr.bp.add(1).log(1.1)
		for (var i = 0; i < 8; i++) player.ext.pr.prim[i] = future ? player.ext.pr.pt.div(10) : E(0)
	},

	prim: [
		// COMMON PRIMORDIUMS
		{
			name: "Alpha",
			sym: "A",
			eff: [
				{
					unl: () => true,
					eff: (x) => E(1.5).pow(x),
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
					eff: (x) => x.div(10),
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
	//CONVERSIONS SOON

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

	for (var i = 0; i < 8; i++) {
		tmp.el["pr_"+i].setTxt(format(player.ext.pr.prim[i],0))
		tmp.el["pr_eff"+i].setTxt(PRIM.prim[i].eff[0].desc(tmp.pr.eff["p"+i+"_0"]))
	}
}