//Functions
Decimal.prototype.scale = function (s, b, p, mode, rev=false) {
    s = D(s)
    p = D(p)
    var x = this.clone()
    if (x.gte(s)) x = SCALE_FUNCS[mode].func(x, s, b, p, rev)
    return x
}

Decimal.prototype.scaleName = function (type, id, rev=false) {
	if (isScalingToned(id)) return this.clone()

    var x = this.clone()
    if (isScalingActive(id, x, type)) {
        let s = tmp.scaling_start[type][id]
        let p = tmp.scaling_power[type][id]

        x = x.scale(s,SCALE_POWER[type][id],p,SCALE_MODE[type],rev)
    }
    return x
}

Decimal.prototype.scaleEvery = function (id, rev=false) {
    var x = this.clone()
	var fp = SCALE_FP[id] ? SCALE_FP[id]() : [1,1,1,1]
    for (let i = 0; i < (FERMIONS.onActive(14) ? 3 : 4); i++) {
        let s = rev?i:3-i
        let sc = SCALE_TYPE[s]

        x = rev?x.mul(fp[s]).scaleName(sc,id,1):x.scaleName(sc,id).div(fp[s])
    }
    return x
}

//Technical
const SCALE_INIT_POWERS = {
	rank: {
		normal: 1.15,
		toned: 3
	},
	tier: {
		normal: 2
	},
	tetr: {
		normal: 2
	},
	pent: {
		normal: 1.25
	},
	massUpg: {
		normal: 1
	},
	tickspeed: {
		normal: 1
	},
	bh_condenser: {
		normal: 1
	},
	gamma_ray: {
		normal: 1
	},
	supernova: {
		normal: 1.25,
		toned: 5
	},
	fTier: {
		normal: 1,
		toned: 2
	}
}

const SCALE_TYPE = ['super', 'hyper', 'ultra', 'meta'] // super, hyper, ultra, meta
const FULL_SCALE_NAME = ['Super', 'Hyper', 'Ultra', 'Meta']

const SCALE_MODE = {
	super: 0,
	ultra: 0,
	hyper: 0,
	meta: 1,
}

const SCALE_FUNCS = {
	0: {
		// Power
		eff(b, p) {
			return D(b).pow(p).toNumber()
		},
		func(x, s, b, p, rev) { // Power
			p = this.eff(b, p)
			if (p == 1) return x
			return rev ? x.div(s).root(p).mul(s) : x.div(s).pow(p).mul(s)
		},
		desc(x, p) {
			return "^" + format(D(x).pow(p))
		}
	},
	1: {
		// Exponent
		func(x, s, b, p, rev) {
			return rev ? x.div(s).max(1).log(b).div(p).add(s) : D(b).pow(x.sub(s).mul(p)).mul(s)
		},
		desc(x, p) {
			let b = D(x).pow(p)
			return formatMultiply(b) + " / level"
		}
	}
}

const SCALE_START = {
    super: {
        rank: D(50),
		tier: D(10),
		tetr: D(7),
        massUpg: D(100),
		tickspeed: D(100),
		bh_condenser: D(100),
		gamma_ray: D(100),
		supernova: D(15),
		fTier: D(10),

		chal0: D(1/0),
		chal1: D(1/0),
		chal2: D(1/0),
    },
	hyper: {
		rank: D(120),
		tier: D(200),
		massUpg: D(500),
		tickspeed: D(250),
		bh_condenser: D(300),
		gamma_ray: D(300),
		supernova: D(35),
		fTier: D(50),

		chal0: D(1/0),
		chal1: D(1/0),
		chal2: D(1/0),
	},
	ultra: {
		rank: D(600),
		tickspeed: D(700),
		bh_condenser: D(750),
		gamma_ray: D(800),
	},
	meta: {
		rank: D(1e5),
		tickspeed: D(5e4),

		chal0: D(1/0),
		chal1: D(1/0),
	},
}

const SCALE_POWER = {
    super: {
		rank: 1.5,
		tier: 1.5,
		tetr: 2,
		massUpg: 2.5,
		tickspeed: 2,
		bh_condenser: 2,
		gamma_ray: 2,
		supernova: 3,
		fTier: 2.5,

		chal0: 1,
		chal1: 1,
		chal2: 1,
    },
	hyper: {
		rank: 2.5,
		tier: 2.5,
		massUpg: 5,
		tickspeed: 4,
		bh_condenser: 2,
		gamma_ray: 4,
		supernova: 3,
		fTier: 4,

		chal0: 1,
		chal1: 1,
		chal2: 1,
	},
	ultra: {
		rank: 4,
		tickspeed: 7,
		bh_condenser: 4,
		gamma_ray: 6,
	},
	meta: {
		rank: 1+1e-5,
		tickspeed: 1.001,

		chal0: 2,
		chal1: 2,
	},
}

const SCALE_FP = {
	tickspeed() { return [1,1,1,tmp.tickspeedFP] },
	massUpg() { return [1,1,1,tmp.upgs.fp] },
	bh_condenser() { return [1,1,1,tmp.upgs.fp] },
}

const SCALE_RES = {
    rank(x=0) { return player.ranks.rank },
	tier(x=0) { return player.ranks.tier },
	tetr(x=0) { return player.ranks.tetr },
	pent(x=0) { return player.ranks.pent },
	tickspeed(x=0) { return player.tickspeed },
    massUpg(x=1) { return D(player.massUpg[x]||0) },
	bh_condenser(x=0) { return player.bh.condenser },
	gamma_ray(x=0) { return player.atom.gamma_ray },
	supernova(x=0) { return player.supernova.times },
	fTier(x=0, y=0) { return player.supernova.fermions.tiers[x][y] },

	chal0(x=1) { return player.chal.comps[x] },
	chal1(x=5) { return player.chal.comps[x] },
	chal2(x=9) { return player.chal.comps[x] },
}

const NAME_FROM_RES = {
	rank: "Rank",
	tier: "Tier",
	tetr: "Tetr",
	pent: "Pent",
	massUpg: "Mass Upgrades",
	tickspeed: "Tickspeed",
	bh_condenser: "Black Hole Condenser",
	gamma_ray: "Cosmic Ray",
	supernova: "Supernova",
	fTier: "Fermion Tier",

	chal0: "Challenges",
	chal1: "Atomic Challenges",
	chal2: "Supernovae Challenges",
}

function updateScalingHTML() {
	let s = SCALE_TYPE[player.scaling_ch]

	if (player.scaling_ch === -1) {
		elm.scaling_name.setTxt("Effects")
		elm.scaling_left_arrow.addClass("locked")
	} else {
		elm.scaling_name.setTxt(FULL_SCALE_NAME[player.scaling_ch])
		elm.scaling_left_arrow.removeClass("locked")
	}

	let maxActiveScaling = Math.max(...SCALE_TYPE.map((type, i) => tmp.scaling[type].length > 0 ? i : -1))
	if (player.scaling_ch === maxActiveScaling) {
		elm.scaling_right_arrow.addClass("locked")
	} else {
		elm.scaling_right_arrow.removeClass("locked")
	}

	if (!tmp.scaling) return
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		let type = SCALE_TYPE[x]
		let mode = SCALE_MODE[type]
		elm["scaling_div_"+x].setDisplay(player.scaling_ch == x)
		if (player.scaling_ch == x) {
			let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
			for (let y = 0; y < key.length; y++) {
				let id = key[y]
				let have = tmp.scaling[SCALE_TYPE[x]].includes(key[y])
				elm['scaling_'+x+'_'+id+'_div'].setDisplay(have)
				if (have) {
					elm['scaling_'+x+'_'+id+'_start'].setTxt(format(getScalingStart(type, id), 0))
					elm['scaling_'+x+'_'+id+'_eff'].setTxt(SCALE_FUNCS[mode].desc(SCALE_POWER[type][id], tmp.scaling_power[type][id]))
				}
			}
		}
	}

	elm["scaling_eff"].setDisplay(player.scaling_ch == -1)
	if (player.scaling_ch == -1) {
		for (let key of Object.keys(SCALE_INIT_POWERS)) {
			let shown = SCALE_RES[key]().gt(0)
			elm[`scaling_eff_${key}_div`].setDisplay(shown)
			if (shown) {
				elm[`scaling_eff_${key}`].setHTML(format(getScalingFullPower(key)))
				elm[`scaling_eff_${key}_base`].setHTML(format(getScalingBasePower(key)))
			}
		}
	}
}

function updateScalingTemp() {
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		let st = SCALE_TYPE[x]
		tmp.scaling[st] = []

		let ss = {}
		let sp = {}
		tmp.scaling_start[st] = ss
		tmp.scaling_power[st] = sp

		for (let [sc, start] of Object.entries(SCALE_START[SCALE_TYPE[x]])) {
			ss[sc] = getScalingStart(st, sc)
			sp[sc] = getScalingPower(st, sc)
			if (isScalingActive(sc, SCALE_RES[sc](), st)) tmp.scaling[st].push(sc)
		}
	}
}

function getScalingBasePower(name) {
	if (BUILDINGS.includes(name) && isScalingToned(name)) return TONES.power(1)
	if (name == "tetr" && hasElement(44)) return 1.75
	return SCALE_INIT_POWERS[name][isScalingToned(name) ? "toned" : "normal"]
}

function getScalingFullPower(name) {
	let r = getScalingBasePower(name)
	let cap = SCALE_TYPE.length
	for (let n = 0; n < cap; n++) {
		let type = SCALE_TYPE[n]
		if (tmp.scaling[type].includes(name)) {
			if (SCALE_MODE[type] == 0) r *= SCALE_FUNCS[0].eff(SCALE_POWER[type][name], tmp.scaling_power[type][name])
			if (SCALE_MODE[type] == 1) r = D(SCALE_POWER[type][name]).pow(tmp.scaling_power[type][name].mul(SCALE_RES[name]().sub(tmp.scaling_start[type][name]))).mul(r)
		}
	}
	return r
}

function getScalingName(name, x=0, y=0) {
	let cap = SCALE_TYPE.length
	for (let n = cap - 1; n >= 0; n--) {
		if (tmp.scaling[SCALE_TYPE[n]].includes(name)) return getScalingPrefix(n)
	}
	return ""
}

function getScalingPrefix(id) {
	let name = FULL_SCALE_NAME[id]
	return name + (name == "Meta" ? "-" : " ")
}

function getScalingStart(type, name) {
	let start = D(SCALE_START[type][name])
	if (type=="super") {
		if (name=="rank") {
			if (CHALS.in(1)) return D(25)
			start = start.add(CHALS.eff(1).rank)
		}
		if (name=="tier") {
			if (hasUpgrade('atom',5)) start = start.add(10)
		}
		if (name=="tetr") {
			if (hasRank("tier", 100)) start = start.add(5)
		}
		if (name=="massUpg") {
			if (CHALS.in(1)) return D(25)
			if (hasUpgrade('bh',3)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[2][3].effect:0:0)
		}
		if (name=='tickspeed') {
			if (CHALS.in(1)) return D(50)
		}
		if (name=='supernova') {
			if (hasTree("feat6")) start = start.add(1)
			if (hasTree("feat8")) start = start.add(2)
		}
	}
	if (type=="hyper") {
		if (name=="tickspeed") {
			if (hasUpgrade('rp',14)) start = start.add(50)
			if (hasRank("tetr", 5)) start = start.add(RANKS.effect.tetr[5]())
		}
		if (name=="rank") {
			if (hasUpgrade('atom',10)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[3][10].effect:0:0)
		}
		if (name=='supernova') {
			if (hasTree("feat6")) start = start.add(1)
			if (hasTree("feat8")) start = start.add(2)
		}
	}
	if (type=="ultra") {
		if (name=="rank") {
			if (hasElement(62)) start = start.add(tmp.elements.effect[62])
		}
		if (name=="tickspeed") {
			if (hasRank("tetr", 5)) start = start.add(RANKS.effect.tetr[5]())
		}
	}
	if (type=="meta") {
		if (name=="tickspeed") {
			if (hasRank("tetr", 18)) start = start.mul(RANKS.effect.tetr[18]())
			start = start.mul(getRadiationEff(20))
			start = start.min(2e8)
		}
	}
	return start.floor()
}

function isScalingActive(name, amt, type) {
	if (!tmp.scaling_start[type]?.[name]) return false
	if (isScalingToned(name)) return false
	amt = D(amt);
	return amt.gte(tmp.scaling_start[type][name]) && tmp.scaling_power[type][name].gt(0);
}

function getScalingPower(type, name) {
	let power = D(1)
	if (type=="super") {
		if (name=="rank") {
			if (hasUpgrade('rp',10)) power = power.mul(0.8)
			if (hasRank("tetr", 4)) power = power.mul(RANKS.effect.tetr[4]())
		}
		if (name=="tier") {
			if (hasRank("tetr", 4)) power = power.mul(0.8)
			if (hasElement(37)) power = power.mul(tmp.elements.effect[37])
		}
		if (name=="tetr") {
			power = power.div(getRadiationEff(19))
		}
		if (name=="massUpg") {
			if (hasUpgrade('rp',8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			power = power.mul(CHALS.eff(1).tick)
			if (hasTree("feat3")) power = power.mul(0.85)
			//if (CHALS.inAny() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
		if (name=='bh_condenser') {
			if (hasElement(15)) power = power.mul(0.8)
		}
		if (name=='gamma_ray') {
			if (hasElement(15)) power = power.mul(0.8)
		}
		if (name=='supernova') {
			power = power.mul(getRadiationEff(16))
		}
		if (name=="fTier") {
			if (hasTree("fn3")) power = power.mul(0.925)
		}
	}
	if (type=="hyper") {
		if (name=="rank") {
			if (hasRank("tetr", 1)) power = power.mul(0.85)
			if (hasElement(27)) power = power.mul(0.75)
		}
		if (name=="tier") {
			if (hasRank("tetr", 4)) power = power.mul(0.8)
			if (hasElement(37)) power = power.mul(tmp.elements.effect[37])
		}
		if (name=="massUpg") {
			if (hasUpgrade('rp',8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			if (hasUpgrade('bh',12)) power = power.mul(0.85)
			if (hasElement(27)) power = power.mul(0.75)
			if (hasTree("feat3")) power = power.mul(0.85)
			//if (CHALS.inAny() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
		if (name=='bh_condenser') {
			if (hasElement(55)) power = power.mul(0.75)
		}
		if (name=='supernova') {
			power = power.mul(getRadiationEff(16))
		}
		if (name=='gamma_ray') {
			if (hasElement(55)) power = power.mul(0.75)
		}
	}
	if (type=="ultra") {
		if (name=="rank") {
			if (hasElement(27)) power = power.mul(0.75)
			if (hasElement(58)) power = power.mul(tmp.elements.effect[58])
		}
		if (name=='tickspeed') {
			if (hasElement(27)) power = power.mul(0.75)
			if (hasElement(58)) power = power.mul(tmp.elements.effect[58])
			//if (CHALS.inAny() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
		if (name=='bh_condenser') {
			if (hasElement(55)) power = power.mul(0.75)
		}
		if (name=='gamma_ray') {
			if (hasElement(55)) power = power.mul(0.75)
		}
	}
	if (type=="meta") {
		if (name=='tickspeed') {
			//if (CHALS.inAny() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
	}
	return power
}

//SOFTCAPS
Decimal.prototype.softcap = function (start, power, mode) {
    var x = this.clone()
    if (x.gte(start)) {
        if ([0, "pow"].includes(mode)) x = x.div(start).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
        if ([2, "exp"].includes(mode)) x = expMult(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = x.div(start).log(power).add(1).times(start)
    }
    return x
}

function getSoftcapHTML(x, sc1, sc2, sc3) {
	if (x.lte(sc1)) return ""
	let lvl = 1
	if (sc2 && x.gt(sc2)) lvl = 2
	if (sc3 && x.gt(sc3)) lvl = 3
	return " <span class='soft"+lvl+"'>(softcapped"+(lvl>1?"<sup>"+lvl+"</sup>":"")+")</span>"
}