function getLayerProgress() {
	return (EXT.unl() ? 5 :
		player.supernova.unl ? 4 :
		player.atom.unl ? 3 :
		player.bh.unl ? 2 :
		player.rp.unl ? 1 : 0)
		+ (MAGIC.unl() ? 1 : 0)
}

const STAGE_PROGRESS = [
	{
		req: () => "Hold " + formatMass(10) + " mass",
		unl: () => player.ranks.rank.gte(1),
		disp: "Ranks"
	},
	{
		req: () => inNGM() ? "Hold " + formatMass(2e4) + " mass" : "Get Rank " + format(4, 0),
		unl: () => inNGM() ? MAGIC.unl() : player.ranks.tier.gte(1),
		disp: () => inNGM() ? "Magic" : "Tiers"
	},
	{
		req: () => "Hold " + formatMass(1e15) + " mass",
		unl: () => player.rp.unl,
		disp: "Rage",
		layer: true
	},
	{
		req: () => "Enrage " + format(1e20, 0) + " Rage Power",
		unl: () => player.bh.unl,
		disp: "Black Hole",
		layer: true
	},
	{
		req: () => "Hold " + formatMass(1.5e136) + " mass",
		unl: () => player.chal.unl,
		disp: "Challenges"
	},
	{
		req: () => "Hold" + formatMass(uni(1e100)) + " mass of black hole",
		unl: () => player.atom.unl,
		disp: "Atomic",
		layer: true
	},
	{
		req: () => "Get " + format(1e56) + " Quarks",
		unl: () => MASS_DILATION.unlocked(),
		disp: "Mass Dilation"
	},
	{
		req: () => "Get " + format(1e225) + " Quarks",
		unl: () => STARS.unlocked(),
		disp: "Stars"
	},
	{
		req: () => "Collapse " + format(1e210) + " stars",
		unl: () => player.supernova.unl,
		disp: "Supernova",
		layer: true
	},
	{
		req: () => "Get " + format(10, 0) + " Supernovae",
		unl: () => player.supernova.post_10,
		disp: "Bosons"
	},
	{
		req: () => "Complete Challenge 10",
		unl: () => player.chal.comps[10].gte(1),
		disp: "Fermions"
	},
	{
		req: () => "Spend " + format(5e52) + " Neutron Stars",
		unl: () => hasTree("unl1"),
		disp: "Radiation"
	},
	{
		req: () => "Complete Challenge 12 and rise up",
		unl: () => EXT.unl(),
		disp: "Exotic",
		layer: true
	}
]
const STAGE_AMT = STAGE_PROGRESS.length

function updateStageProgress() {
	tmp.stage = 0
	for (var [i, stage] of Object.entries(STAGE_PROGRESS).reverse()) {
		if (stage.unl()) {
			tmp.stage = parseInt(i)+1
			return
		}
	}
}

function updateProgressHeader() {
	let disp = player.options.progress && gameStarted() && !CHALS.inAny()
	elm.progress_header.setDisplay(disp)
	if (!disp) return

	elm.progress_stages.setTxt(tmp.stage + " / " + STAGE_AMT)
	elm.progress_layers.setTxt(getLayerProgress())

	let next = STAGE_PROGRESS[tmp.stage]
	elm.progress_stages_next.setHTML(
		(tmp.stage == STAGE_AMT ? "All features unlocked!" : next.req() + " to unlock " + (typeof next.disp == "function" ? next.disp() : next.disp) + ".") +
		(next?.layer ? " <b class='green'>Next stage will unlock Layer " + (getLayerProgress()+1) + "!</b>" : ""))
}