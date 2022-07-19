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
		for (var i = 0; i < 8; i++) {
			let pr = pt.mul(tmp.pr.ratio[i])
			player.ext.pr.prim[i] = pr.mul(pr_exp>1?pr.div(100).add(1).pow(pr_exp-1):1)
		}
	},

	prim: [
		// COMMON PRIMORDIUMS
		{
			name: "Alpha",
			sym: "A",
			eff: [
				{
					unl: () => true,
					eff: (x) => E(1.2).pow(x).min(1e6),
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
					eff: (x) => E(1).add(x.div(100)),
					desc: (x) => "Ar-18 softcap starts "+format(x)+"x later."
				}
			]
		},
		{
			name: "Sigma",
			sym: "Σ",
			eff: [
				{
					unl: () => true,
					eff: (x) => E(1),
					desc: (x) => "Placeholder."
				}
			]
		},
		{
			name: "Delta",
			sym: "Δ",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.div(100).add(1),
					desc: (x) => "Multiply Hawking Radiation by "+formatMultiply(x)+"."
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
					eff: (x) => x.div(1e3).add(1),
					desc: (x) => "Increase Polarizer's base by "+formatMultiply(x)+"."
				}
			]
		},
		{
			name: "Theta",
			sym: "Θ",
			eff: [
				{
					unl: () => true,
					eff: (x) => E(1.75).sub(x.div(100)).max(1).toNumber(),
					desc: (x) => "Tetr scales at ^"+format(x,3)+" rate."
				}
			]
		},
		{
			name: "Epsilon",
			sym: "E",
			eff: [
				{
					unl: () => true,
					eff: (x) => x.div(100).add(1),
					desc: (x) => "Weaken Axion penalties by "+formatMultiply(x)+"."
				}
			]
		},
		{
			name: "Phi",
			sym: "Φ",
			eff: [
				{
					unl: () => true,
					eff: (x) => x,
					desc: (x) => "Add "+format(x)+" C12 completions."
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
		html += `
		<div class="primordium table_center">
			<div style="width: 240px; height: 54px;">
				<h2>${PRIM.prim[x].name} Particles [${PRIM.prim[x].sym}]</h2><br>[<span id="pr_${x}"></span>]
			</div><div style="width: 240px; height: 54px; background: transparent; box-shadow: 0 0 6px #ffdf00; color: white" id="pr_eff${x}"></div>
		</div>
		`
	}
	new Element("pr_table").setHTML(html)
}

function updatePrimHTML() {
	elm.pr_bp.setTxt(format(player.ext.pr.bp,0))
	elm.pr_bp_gain.setTxt(formatGain(player.ext.pr.bp,tmp.pr.bp))
	elm.pr_pt.setTxt(format(player.ext.pr.pt,0))
	for (var i = 0; i < 8; i++) {
		elm["pr_"+i].setTxt(format(player.ext.pr.prim[i],0))
		elm["pr_eff"+i].setTxt(PRIM.prim[i].eff[0].desc(tmp.pr.eff["p"+i+"_0"]))
	}
}