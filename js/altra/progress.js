const LAYER_AMT = 5
const LAYER_PROGRESS = {
	1: {
		req: () => formatMass(1e15) + " mass",
		unl: "Rage"
	}, 
	2: {
		req: () => format(1e20, 0) + " Rage Power",
		unl: "Black Hole"
	}, 
	3: {
		req: () => formatMass(uni(1e100)) + " black hole mass",
		unl: "Atom"
	}, 
	4: {
		req: () => format(1e210, 0) + " collapsed Stars",
		unl: "Supernova"
	}, 
	5: {
		req: () => "a Challenge 12 completion",
		unl: "Exotic"
	}
}

function getLayerProgress() {
	return EXT.unl() ? 5 :
		player.supernova.unl ? 4 :
		player.atom.unl ? 3 :
		player.bh.unl ? 2 :
		player.rp.unl ? 1 : 0
}

const FEATURE_AMT = 13
const FEATURE_PROGRESS = {
	1: {
		req: () => "a Rage Power",
		unl: "Tickspeed"
	},
	2: {
		req: () => "a Dark Matter",
		unl: "Black Hole"
	},
	3: {
		req: () => formatMass(1.5e136) + " mass",
		unl: "Challenges"
	},
	4: {
		req: () => "an Atom",
		unl: "Atomic Generators and Quarks"
	},
	5: {
		//Feature 5 unlocks at Atoms.
	},
	6: {
		req: () => format(1e56) + " Quarks",
		unl: "Mass Dilation"
	},
	7: {
		req: () => format(1e225) + " Quarks",
		unl: "Stars"
	},
	8: {
		req: () => format(1e210) + " collapsed Stars",
		unl: "Neutron Tree"
	},
	9: {
		req: () => format(10, 0) + " Supernovae",
		unl: "Bosons"
	},
	10: {
		req: () => "a Challenge 10 completion",
		unl: "Fermions"
	},
	11: {
		req: () => format(5e52) + " Neutron Stars",
		unl: "Radiation"
	},
	12: {
		req: () => "a Challenge 12 completion",
		unl: "Axions"
	},
	13: {
		req: () => "??? Challenge 13 completions",
		unl: "Glueball"
	}
}

function getFeatureProgress() {
	let layers = getLayerProgress()
	switch(layers) {
		case 5:
			if (GLUBALL.unl()) return 13
			return 12

		case 4:
			if (hasTree("unl1")) return 11
			if (player.chal.comps[10].gte(1)) return 10
			if (player.supernova.post_10) return 9
			return 8

		case 3:
			if (STARS.unlocked()) return 7
			if (MASS_DILATION.unlocked()) return 6
			return 5

		case 2:
			if (player.chal.unl) return 3
			return 2

		case 1:
			return 1

		default:
			return 0
	} 
}

function updateProgressHeader() {
	let shown = player.options.progress && !CHALS.inChals()
	elm.progress_header.setDisplay(shown)
	elm.progress_header.setVisible(gameStarted())

	elm.progress_features.setTxt(getFeatureProgress() + " / " + FEATURE_AMT)
	elm.progress_layers.setTxt(getLayerProgress() + " / " + LAYER_AMT)

	elm.progress_features_next.setTxt(getFeatureProgress() == FEATURE_AMT ? "All features unlocked!" : "Get " + FEATURE_PROGRESS[getFeatureProgress() + 1].req() + " to unlock " + FEATURE_PROGRESS[getFeatureProgress() + 1].unl + ".")
	elm.progress_layers_next.setTxt(getLayerProgress() == LAYER_AMT ? "All layers unlocked!" : "Get " + LAYER_PROGRESS[getLayerProgress() + 1].req() + " to unlock " + LAYER_PROGRESS[getLayerProgress() + 1].unl + ".")
}