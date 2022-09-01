let GLUBALL = {
	unl: () => player.ext?.gb?.unl,

	setup() {
		return {
			unl: false,
		}
	},
	calc(dt) {
		
	},
}

function updateGlueballTemp() {
	let data = {}
	let save = player.ext?.gb
	tmp.gb = data

	if (!save?.unl) return
}

//HTML
function setupGlueballHTML() {

}

function updateGlueballHTML() {

}

//CHROMA BACKGROUND
function toggleChromaBG() {
	if (player.options.noChroma && !confirm("Warning! This will cause high performance for your PC / phone! Are you sure about that?!")) return
	player.options.noChroma = !player.options.noChroma
}

function updateChromaScreen() {
	let unl = GLUBALL.unl() && !PORTAL.unl() && !player.options.noChroma
	elm.chroma_bg.setDisplay(unl)
	if (!unl) return

	let progress = player.stats.maxMass.log10().log10().div(21).log(4).max(0).min(1)
	elm.chroma_bg1.setOpacity(progress)
	elm.chroma_bg2.setOpacity(progress)

	//WARNING: PERFORMANCE!
	let high = false
	elm.chroma_bg2.style.setProperty('background', high ? "linear-gradient(45deg, transparent, white, transparent, transparent)" : "linear-gradient(45deg, transparent, white)")
	elm.chroma_bg3.setDisplay(high)
	if (high) elm.chroma_bg3.setOpacity(progress)
}