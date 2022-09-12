const RANKS_NEW = {
	can(layer, tier) {
		return this.res(layer, tier).gte(this.req(layer, tier))
	},
	do(layer, tier, auto) {
		const data = RANKS_DATA[layer][tier]

		if (!this.can(layer, tier)) return

		if (!this.player(layer)) player[RANKS_DATA[layer].playerName] = {}
		this.player[data.playerName] =
			auto ? this.bulk(layer, tier) :
			this.amt(layer, tier).add(1).round()

		if (data.mustReset()) data.toReset()
	},

	req(layer, tier) {
		const data = RANKS_DATA[layer][tier]
		return data.baseReq(this.amt(layer, tier).scaleEvery(data.name.toLowerCase()), data.fP(), data.pow())
	},
	bulk(layer, tier) {
		const data = RANKS_DATA[layer][tier]
		return data.baseBulk(this.res(layer, tier), data.fP(), data.pow()).scaleEvery(data.name.toLowerCase(), true).floor().add(1)
	},

	player(layer) {
		return player[RANKS_DATA[layer].playerName]
	},
	res(layer, tier) {
		return tier == 0 ? RANKS_DATA[layer][tier].baseRes() : this.amt(layer, tier - 1)
	},
	amt(layer, tier) {
		return D(this.player(layer)?.[RANKS_DATA[layer][tier].playerName] ?? 0)
	}
}

const RANKS_DATA = {
	//Layers
	0: {
		//Tiers
		playerName: "ranks",

		0: {
			name: "Rank",
			playerName: "rank",

			unl: () => false,
			autoUnl: () => false,

			baseRes: () => player.mass,
			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			resetDesc: "mass and upgrades",
			mustReset: () => true,
			doReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: "",
					effDesc: "",
				}
			}
		},
		1: {
			name: "Tier",
			playerName: "tier",

			unl: () => false,
			autoUnl: () => false,

			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			resetDesc: "Rank",
			mustReset: () => true,
			doReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: "",
					effDesc: "",
				}
			}
		},
		2: {
			name: "Tetr",
			playerName: "tetr",

			unl: () => false,
			autoUnl: () => false,

			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			resetDesc: "Tier",
			mustReset: () => true,
			doReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: "",
					effDesc: "",
				}
			}
		},
		3: {
			name: "Pent",
			playerName: "pent",

			unl: () => false,
			autoUnl: () => false,

			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			resetDesc: "Tier",
			mustReset: () => true,
			doReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: "",
					effDesc: "",
				}
			}
		},
	}
}

//Functions
function rankUp(layer, tier) {
	RANKS.do(layer, tier)
}