const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent'],
    fullNames: ['Rank', 'Tier', 'Tetr', 'Pent'],
	resetDescs: ['mass and upgrades', 'Rank', 'Tier', 'pre-Atoms'],
	mustReset(type) {
		if (type == "rank" && hasUpgrade('rp',4)) return false
		if (type == "tier" && hasUpgrade('bh',4)) return false
		if (type == "tetr" && hasTree("qol5")) return false
		return true
	},
    reset(type, bulk) {
        if (type == "pent" && hasExtMilestone("qol", 4)) bulk = true
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            if (bulk) player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk)
            if (this.mustReset(type)) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return hasRank("rank", 3) || hasRank("tier", 1) || hasUpgrade('atom',3) },
        tetr() { return hasUpgrade('atom',3) },
        pent() { return player.chal.comps[11].gt(0) },
    },
	doReset: {
		rank() {
			player.mass = D(0)
			for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x]) player.massUpg[x] = D(0)
		},
		tier() {
			player.ranks.rank = D(0)
			this.rank()
		},
		tetr() {
			player.ranks.tier = D(0)
			this.tier()
		},
		pent() {
			player.ranks.tetr = D(0)
			ATOM.reset(true, true)
		},
		/*highest() {
			player.ranks[RANKS.names[RANKS.names.length-1]] = D(0)
			this[RANKS.names[RANKS.names.length-1]]()
		},*/
	},
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return hasUpgrade('rp',5) },
        tier() { return hasUpgrade('rp',6) },
        tetr() { return hasUpgrade('atom',5) },
        pent() { return false },
    },
    desc: {
        rank: {
            '1': "unlock Mass Upgrades.",
            '2': "unlock Mass Upgrade 2 and weaken Mass Upgrade 1 by 20%.",
            '3': "unlock Mass Upgrade 3, weaken Mass Upgrade 2 by 20%, and Mass Upgrade 1 boosts itself.",
            '3_m': "weaken Mass Upgrade 2 by 20% and Mass Upgrade 1 boosts itself.",
            '4': "weaken Mass Upgrade 3 by 20%.",
            '4_m': "unlock Mass Upgrade 3.",
            '5': "mass upgrade 2 boosts itself.",
            '6': "Rank boosts mass.",
            '13': "triple mass.",
            '14': "double Rage Power.",
            '17': "strengthen Rank 6.",
            '34': "mass upgrade 3 softcap scales 1.2x later.",
            '40': "Rank adds Tickspeed Power.",
            '45': "Rank boosts Rage Power.",
            '90': "strengthen Rank 40.",
            '180': "raise mass by ^1.025.",
            '220': "Rank 40 is overpowered.",
            '300': "Rank boosts Quarks.",
            '380': "Rank boosts mass.",
            '800': "make mass gain softcap 0.25% weaker based on rank.",
        },
        tier: {
            '1': "Rank scales 20% weaker.",
            '2': "raise mass by ^1.15.",
            '3': "weaken Mass Upgrades scaling by 20%.",
            '4': "adds +5% Tickspeed Power per Tier, softcaps at +40%.",
            '6': "Tiers boost Rage Power.",
            '8': "make tier 6's reward effect stronger by Dark Matter.",
            '12': "make tier 4's reward effect twice effective and remove softcap.",
            '30': "stronger effect's softcap is 10% weaker.",
            '55': "make rank 380's effect stronger based on tier.",
            '100': "Super Tetr scale 5 later.",
        },
        tetr: {
            '1': "reduce tier reqirements by 25%, make Hyper Rank scaling is 15% weaker.",
            '2': "mass upgrade 3 boosts itself.",
            '3': "raise tickspeed effect by 1.05.",
            '4': "Super Rank scale weaker based on Tier, Super Tier scale 20% weaker.",
            '5': "Hyper/Ultra Tickspeed scales later based on tetr.",
            '8': "Mass gain softcap^2 starts ^1.5 later.",
            '18': "Meta-Tickspeed scales later based on Tiers.",
        },
        pent: {
            '1': "Boost something...",
        }
    },
    getDesc(t, r) {
    	let d = this.desc[t]
    	return (inNGM() && d[r+"_m"]) || d[r]
    },
    effect: {
        rank: {
            '3'() {
                let ret = D(player.massUpg[1]||0).div(20)
                return ret
            },
            '5'() {
                let ret = D(player.massUpg[2]||0).div(inNGM() ? 100 : 40)
                return ret
            },
            '6'() {
                let r = player.ranks.rank
                if (inNGM()) r = r.sub(5).div(3)
                return r.add(1).pow(hasRank("rank", 17) ? r.root(3) : 2)
            },
            '40'() {
                let ret = player.ranks.rank.root(2).div(100)
                if (hasRank("rank", 90)) ret = player.ranks.rank.root(1.6).div(100)
                if (hasRank("rank", 220)) ret = player.ranks.rank.div(100)
                return ret
            },
            '45'() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
            '300'() {
                let ret = player.ranks.rank.add(1)
                return ret
            },
            '380'() {
                let exp = player.ranks.rank.sub(379)
					.pow(1.5)
					.pow(hasRank("tier", 55)?RANKS.effect.tier[55]():1)
					.softcap(1000,0.5,0)
                return D(10).pow(exp)
            },
            '800'() {
                let ret = D(1).sub(player.ranks.rank.sub(799).mul(0.0025).add(1).softcap(1.25,0.5,0).sub(1)).max(0.75)
                return ret
            },
        },
        tier: {
            '4'() {
                let ret = D(0)
                if (hasRank("tier", 12)) ret = player.ranks.tier.mul(0.1)
                else ret = player.ranks.tier.mul(0.05).add(1).softcap(1.4,0.75,0).sub(1)
                return ret
            },
            '6'() {
                let ret = D(2).pow(player.ranks.tier)
                if (hasRank("tier", 8)) ret = ret.pow(RANKS.effect.tier[8]())
                return ret
            },
            '8'() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
                return ret
            },
            '55'() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4).min(2)
                return ret
            },
        },
        tetr: {
            '2'() {
                let ret = D(player.massUpg[3]||0).div(400)
                return ret
            },
            '4'() {
                let ret = D(0.96).pow(player.ranks.tier.pow(1/3))
                return ret
            },
            '5'() {
                let ret = player.ranks.tetr.pow(4).softcap(1000,0.25,0)
                return ret
            },
            '18'() {
                let ret = player.ranks.tier.div(20000).add(1).pow(player.ranks.tier.sqrt()).softcap(2,4,3)
                return ret
            },
        },
		pent: {
			/*'2000'() {
				if (!tmp.tickspeedEffect) return D(1)
				return tmp.tickspeedEffect.step.log10().div(2e5).add(1).pow(27/20)
			},*/
		},
    },
    effDesc: {
        rank: {
            3(x) { return "+"+format(x) },
            5(x) { return "+"+format(x) },
            6(x) { return format(x)+"x" },
            40(x) {  return "+"+format(x.mul(100))+"%" },
            45(x) { return format(x)+"x" },
            300(x) { return format(x)+"x" },
            380(x) { return format(x)+"x" },
            800(x) { return format(D(1).sub(x).mul(100))+"% weaker" },
        },
        tier: {
            4(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"x" },
            8(x) { return "^"+format(x) },
            55(x) { return "^"+format(x) },
        },
        tetr: {
            2(x) { return "+"+format(x) },
            4(x) { return format(D(1).sub(x).mul(100))+"% weaker" },
            5(x) { return "+"+format(x,0)+" later" },
            18(x) { return format(x)+"x" },
        },
        pent: {
            /*2000(x) { return format(x)+"x" },*/
        },
    },
    fp: {
        rank() {
            let f = D(1)
            if (isScalingToned("rank")) f = f.mul(2)
            if (hasRank("tier", 1)) f = f.mul(1/0.8)
            f = f.mul(CHALS.eff(5).pow(-1))
            return f
        },
        tier() {
            let f = D(1)
            f = f.mul(tmp.fermions.effs[1][3])
            if (hasRank("tetr", 1)) f = f.mul(1/0.75)
            if (hasUpgrade('atom',10)) f = f.mul(2)
            return f
        },
        tetr() {
            let f = D(1)
			if (hasElement(9)) f = f.mul(1/0.85)
            return f
        },
        pent() {
            let f = D(5/6)
            //if (AXION.unl()) f = f.mul(tmp.ax.eff[15].div)
            return f
        },
    },
}

function hasRank(t, x) {
	return player.ranks[t].gte(x)
}

function updateRanksTemp() {
	let d = tmp.ranks || {}
	let s = player.ranks
	let u = RANKS
    tmp.ranks = d

    for (let x = 0; x < u.names.length; x++) if (!tmp.ranks[u.names[x]]) tmp.ranks[u.names[x]] = {}

    let fp = u.fp.rank()
    let pow = getScalingBasePower("rank")
    d.rank.req = D(10).pow(s.rank.scaleEvery("rank").div(fp).pow(pow)).mul(10)
    d.rank.bulk = player.mass.div(10).max(1).log10().root(pow).mul(fp).scaleEvery("rank", 1).add(1).floor()
    if (FERMIONS.onActive(14)) d.rank.bulk = D(2e4).min(d.rank.bulk)
    if (player.mass.lt(10)) d.rank.bulk = D(0)
    d.rank.can = player.mass.gte(d.rank.req) && !CHALS.in(5) && !CHALS.in(10) && !FERMIONS.onActive("03") && (!FERMIONS.onActive(14) || s.rank.lt(2e4))

	let start = inNGM() ? 2.5 : 2
    fp = u.fp.tier()
    pow = getScalingBasePower("tier")
    d.tier.req = s.tier.scaleEvery("tier").div(fp).add(start).pow(pow).floor()
    d.tier.bulk = s.rank.max(0).root(pow).sub(start).mul(fp).scaleEvery("tier", 1).add(1).floor();

    fp = u.fp.tetr()
    pow = getScalingBasePower("tetr")
    d.tetr.req = s.tetr.scaleEvery("tetr").div(fp).pow(pow).mul(3).add(10).floor()
    d.tetr.bulk = s.tier.sub(10).div(3).max(0).root(pow).mul(fp).scaleEvery("tetr", 1).add(1).floor();

	fp = u.fp.pent()
    pow = getScalingBasePower("pent")
	d.pent.req = s.pent.div(fp).pow(pow).add(15).floor()
	d.pent.bulk = s.tetr.sub(15).max(0).root(pow).mul(fp).add(1).floor();

    for (let x = 0; x < u.names.length; x++) {
        let rn = u.names[x]
        if (x > 0) {
            d[rn].can = s[u.names[x-1]].gte(d[rn].req)
        }
    }
}