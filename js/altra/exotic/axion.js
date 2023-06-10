//AXIONS
let AXION = {
	unl: () => EXT.unl(),
	setup() {
		return {
			res: {
				x: D(0),
				y: D(0),
				z: D(0),
				cata: D(0),
			},
			darkEng: D(0),
			steps: 0,
		}
	},

	//FEATURE
	darkEngNext(amt) {
		return D(amt).mul(100).root(1.5).pow10().pow10()
	},
	darkEngBulk(res) {
		if (D(res).lt("ee100")) return D(1)
		return D(res).log10().log10().mul(1.5).div(100).add(1).toNumber()
	},

	instability() {
	},

	addAxion(type) {
	},
	subAxion(type) {
	},

	cataProd() {
	},

	//CALC
	calc(dt) {
	}
}

function updateAxionTemp() {
	let data = {}
	let save = player.ext?.ax
	tmp.ax = data

	if (!EXT.unl()) return
}

//HTML
function setupAxionHTML() {

}

function updateAxionHTML() {

}