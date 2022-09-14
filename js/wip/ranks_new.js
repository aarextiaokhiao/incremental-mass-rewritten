const RANKS_NEW = {
	can(tier) {
		return this.res(tier).gte(this.req(tier))
	},
	rank(tier, auto) {
		if (!this.can(tier)) return

		const layer = RANK_LOCS[tier][0]
		const data = RANK_DATA[layer][tier]

		if (!player[layer]) player[layer] = {}
		player[layer][tier] =
			auto || data.bulkUnl() ? this.bulk(tier) :
			this.amt(tier).add(1).round()

		if (data.mustReset()) data.toReset()
	},

	req(tier) {
		const layer = RANK_LOCS[tier][0]
		const data = RANK_DATA[layer][tier]
		return data.baseReq(this.amt(tier).scaleEvery(tier), data.fP(), data.pow())
	},
	bulk(tier) {
		const layer = RANK_LOCS[tier][0]
		const data = RANK_DATA[layer][tier]
		return data.baseBulk(this.res(tier), data.fP(), data.pow()).scaleEvery(tier, true).floor().add(1).floor()
	},

	res(tier) {
		const layer = RANK_LOCS[tier][0]
		return RANK_BASE.includes(tier) ? RANK_DATA[layer][tier].baseRes() : this.amt(RANK_LIST[layer][RANK_LOCS[tier][1] - 1])
	},
	amt(tier) {
		const layer = RANK_LOCS[tier][0]
		return D(player?.[layer]?.[tier] ?? 0)
	},

	has(tier, amt) {
		return this.amt(tier).gte(amt)
	}
}

const RANK_DATA = {
	//Layers
	ranks: {
		//Tiers
		rank: {
			unl: () => false,
			bulkUnl: () => false,
			autoUnl: () => false,

			baseRes: () => player.mass,
			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			name: "Rank",
			resetDesc: "mass and upgrades",
			mustReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: () => D(1),
					effDesc: (x) => format(x),
				}
			}
		},
		tier: {
			unl: () => false,
			autoUnl: () => false,

			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			name: "Tier",
			resetDesc: "Rank",
			mustReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: () => D(1),
					effDesc: (x) => format(x),
				}
			}
		},
		tetr: {
			unl: () => false,
			autoUnl: () => false,

			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			name: "Tetr",
			resetDesc: "Tier",
			mustReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: () => D(1),
					effDesc: (x) => format(x),
				}
			}
		},
		pent: {
			unl: () => false,
			autoUnl: () => false,

			baseReq: (amt, fP, pow) => D(10).pow(D(amt).div(fP).pow(pow)).mul(10),
			baseBulk: (amt, fP, pow) => D(res).div(10).log10().root(pow).mul(fP),
			fP: () => D(1),
			pow: () => 1,

			name: "Pent",
			resetDesc: "pre-Atoms",
			mustReset: () => true,

			rewards: {
				1: {
					desc: "",
					eff: () => D(1),
					effDesc: (x) => format(x),
				}
			}
		},
	}
}

const RANK_LIST = {}
const RANK_BASE = []
const RANK_LOCS = {}
for (const [layer, layer_data] of Object.entries(RANK_DATA)) {
	let LAYER_KEYS = Object.keys(layer_data)
	RANK_LIST[layer] = LAYER_KEYS

	for (const tier_index in LAYER_KEYS) {
		let tier = LAYER_KEYS[tier_index]
		RANK_LOCS[tier] = [layer, Number(tier_index)]
		if (tier_index == 0) RANK_BASE.push(tier)
	}
}

//FUNCTIONS
function rankUp(tier, auto = false) {
	RANKS_NEW.rankUp(tier, auto)
}

function rankReq(tier) {
	RANKS_NEW.req(tier)
}

function rankAmt(tier) {
	RANKS_NEW.amt(tier)
}

function hasRankNew(tier, amt) {
	RANKS_NEW.has(tier, amt)
}

/*function resetRanks(layer, upToTier) {
	for (var tier of RANK_LIST[layer]) {
		delete player[layer]?.[tier]
		if (tier == upToTier) return
	}
	delete player[layer]
}*/

function rankAutoTick() {
	for (const [tier, layer] of Object.entries(RANK_LOCS)) {
		const tier_data = RANK_DATA[layer[0]][tier]
		if (!tier_data.autoUnl()) continue
		if (!player.auto_ranks[tier]) continue

		rankUp(tier, true)
	}
}

//TEMP
function updateRankTempNew() {
	const data = {}
	tmp.ranks_new = data

	for (const [layer, layer_data] of Object.entries(RANK_DATA)) {
		for (const tier of Object.keys(layer_data)) {
			tmp.ranks_new[tier] = {
				req: RANKS_NEW.req(layer, tier),
				bulk: RANKS_NEW.bulk(layer, tier),
			}
		}
	}
}

//DATA
function rankData(tier) {
	return RANK_DATA[RANK_LOCS[tier][0]][tier]
}

//REWARDS
function rankRewardData(tier, amt) {
	return rankData(tier).rewards[amt]
}

function rankRewardDesc(tier, amt) {
	return rankRewardData(tier, amt).desc
}

function rankRewardEff(tier, amt) {
	return rankRewardData(tier, amt).eff()
}

function rankRewardEffDisp(tier, amt) {
	const data = rankRewardData(tier, amt)
	return data.desc(data.eff())
}