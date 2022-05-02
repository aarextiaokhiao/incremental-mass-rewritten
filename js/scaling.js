//Functions
Decimal.prototype.scale = function (s, b, p, mode, rev=false) {
    s = E(s)
    p = E(p)
    var x = this.clone()
    if (x.gte(s)) x = SCALE_FUNCS[mode].func(x, s, b, p, rev)
    return x
}

Decimal.prototype.scaleName = function (type, id, rev=false) {
    var x = this.clone()
    if (SCALE_START[type][id] && SCALE_POWER[type][id]) {
        let s = getScalingStart(type,id)
        let p = getScalingPower(type,id)

        x = x.scale(s,SCALE_POWER[type][id],p,SCALE_MODE[type],rev)
    }
    return x
}

Decimal.prototype.scaleEvery = function (id, rev=false) {
	if (scalingToned(id)) return this.clone()

    var x = this.clone()
	var fp = SCALE_FP[id] ? SCALE_FP[id]() : [1,1,1,1]
    for (let i = 0; i < 4; i++) {
        let s = rev?i:3-i
        let sc = SCALE_TYPE[s]

        x = rev?x.mul(fp[s]).scaleName(sc,id,1):x.scaleName(sc,id).div(fp[s])
    }
    return x
}

//Technical
const SCALE_INIT_POWERS = {
	massUpg: {
		normal: 1,
		toned: 1.5
	},
	tickspeed: {
		normal: 1,
		toned: 1.5
	},
	bh_condenser: {
		normal: 1,
		toned: 1.5
	},
	gamma_ray: {
		normal: 1,
		toned: 1.5
	},
	rank: {
		normal: 1.15,
		toned: 3
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
		func(x, s, b, p, rev) { // Power
			p = E(b).pow(p)
			if (p.eq(1)) return x
			return rev ? x.div(s).root(p).mul(s) : x.div(s).pow(p).mul(s)
		},
		desc(x, p) {
			return "^" + format(E(x).pow(p))
		}
	},
	1: {
		func(x, s, b, p, rev) { // Exponent
			return rev ? x.div(s).max(1).log(b).div(p).add(s) : E(b).pow(x.sub(s).mul(p)).mul(s)
		},
		desc(x, p) {
			return "^" + format(x,3) + (p.gte(1) ? "" : p.lt(0.01) ? ", /" + format(E(1).div(p)) : ", " + format(p.mul(100)) + "%")
		}
	}
}

const SCALE_START = {
    super: {
        rank: E(50),
		tier: E(10),
		tetr: E(7),
        massUpg: E(100),
		tickspeed: E(100),
		bh_condenser: E(100),
		gamma_ray: E(100),
		supernova: E(15),
		fTier: E(10),
    },
	hyper: {
		rank: E(120),
		tier: E(200),
		massUpg: E(500),
		tickspeed: E(250),
		bh_condenser: E(300),
		gamma_ray: E(300),
		supernova: E(35),
		fTier: E(50),
	},
	ultra: {
		rank: E(600),
		tickspeed: E(700),
		bh_condenser: E(750),
		gamma_ray: E(800),
		supernova: E(60),
	},
	meta: {
		rank: E(1e4),
		tickspeed: E(5e4),
	},
}

const SCALE_POWER= {
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
	},
	ultra: {
		rank: 4,
		tickspeed: 7,
		bh_condenser: 4,
		gamma_ray: 6,
		supernova: 5,
	},
	meta: {
		rank: 1.0025,
		tickspeed: 1.001,
	},
}

const SCALE_FP = {
	tickspeed() { return [1,1,1,tmp.tickspeedFP] },
}

const SCALE_FLOORS = {
	supernova() { return !hasTree("sn5") },
}

const SCALE_TONE = {
	massUpg() { return player.ext.ch.tones[0] },
	tickspeed() { return player.ext.ch.tones[0] },
	rank() { return player.ext.ch.tones[3] },
	bh_condenser() { return player.ext.ch.tones[1] },
	gamma_ray() { return player.ext.ch.tones[2] },
}

const SCALE_RES = {
    rank(x=0) { return player.ranks.rank },
	tier(x=0) { return player.ranks.tier },
	tetr(x=0) { return player.ranks.tetr },
	pent(x=0) { return player.ranks.pent },
	hex(x=0) { return player.ranks.hex },
	tickspeed(x=0) { return player.tickspeed },
    massUpg(x=1) { return E(player.massUpg[x]||0) },
	bh_condenser(x=0) { return player.bh.condenser },
	gamma_ray(x=0) { return player.atom.gamma_ray },
	supernova(x=0) { return player.supernova.times },
	fTier(x=0, y=0) { return player.supernova.fermions.tiers[x][y] },
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
}

function updateScalingHTML() {
	let s = SCALE_TYPE[player.scaling_ch]
	tmp.el.scaling_name.setTxt(FULL_SCALE_NAME[player.scaling_ch])

	if (player.scaling_ch === 0) {
		tmp.el.scaling_left_arrow.addClass("locked")
	} else {
		tmp.el.scaling_left_arrow.removeClass("locked")
	}

	let maxActiveScaling = Math.max(...SCALE_TYPE.map((type, i) => tmp.scaling[type].length > 0 ? i : -1))
	if (player.scaling_ch === maxActiveScaling) {
		tmp.el.scaling_right_arrow.addClass("locked")
	} else {
		tmp.el.scaling_right_arrow.removeClass("locked")
	}

	if (!tmp.scaling) return
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		let type = SCALE_TYPE[x]
		let mode = SCALE_MODE[type]
		tmp.el["scaling_div_"+x].setDisplay(player.scaling_ch == x)
		if (player.scaling_ch == x) {
			let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
			for (let y = 0; y < key.length; y++) {
				let id = key[y]
				let have = tmp.scaling[SCALE_TYPE[x]].includes(key[y])
				tmp.el['scaling_'+x+'_'+id+'_div'].setDisplay(have)
				if (have) {
					tmp.el['scaling_'+x+'_'+id+'_power'].setTxt(SCALE_FUNCS[mode].desc(SCALE_POWER[type][id], getScalingPower(type, id)))
					tmp.el['scaling_'+x+'_'+id+'_start'].setTxt(format(getScalingStart(type, id),0))
				}
			}
		}
	}
}

function updateScalingTemp() {
	if (!tmp.scaling) tmp.scaling = {}
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		tmp.scaling[SCALE_TYPE[x]] = []
		let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
		for (let y = 0; y < key.length; y++) {
			if (scalingActive(key[y], SCALE_RES[key[y]](), SCALE_TYPE[x])) tmp.scaling[SCALE_TYPE[x]].push(key[y])
		}
	}
}

function scalingToned(name) {
	return SCALE_TONE[name] && SCALE_TONE[name]()
}

function scalingInitPower(name) {
	return SCALE_INIT_POWERS[name][scalingToned(name) ? "toned" : "normal"]
}

function scalingActive(name, amt, type) {
	if (SCALE_START[type][name] === undefined) return false
	if (scalingToned(name)) return false
	amt = E(amt);
	return amt.gte(getScalingStart(type, name));
}

function getScalingName(name, x=0, y=0) {
	let cap = Object.keys(SCALE_START).length;
	let current = "";
	let amt = SCALE_RES[name](x,y);
	for (let n = cap - 1; n >= 0; n--) {
		if (scalingActive(name, amt, Object.keys(SCALE_START)[n]))
			return capitalFirst(Object.keys(SCALE_START)[n]) + (Object.keys(SCALE_START)[n]=="meta"?"-":" ");
	}
	return current;
}

function getScalingStart(type, name) {
	let start = E(SCALE_START[type][name])
	if (type=="super") {
		if (name=="rank") {
			if (CHALS.inChal(1) || CHALS.inChal(10)) return E(25)
			start = start.add(tmp.chal?tmp.chal.eff[1].rank:0)
		}
		if (name=="tier") {
			if (player.mainUpg.atom.includes(5)) start = start.add(10)
		}
		if (name=="tetr") {
			if (player.ranks.tier.gte(100)) start = start.add(5)
			if (player.ranks.pent.gte(2)) start = start.add(player.supernova.times.pow(1.5).div(200))
		}
		if (name=="massUpg") {
			if (CHALS.inChal(1) || CHALS.inChal(10)) return E(25)
			if (player.mainUpg.bh.includes(3)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[2][3].effect:0:0)
		}
		if (name=='tickspeed') {
			if (CHALS.inChal(1) || CHALS.inChal(10)) return E(50)
		}
		if (name=='supernova') {
			if (tmp.elements && hasElement(71)) start = start.add(tmp.elements.effect[71])
			if (hasTree("feat6")) start = start.add(1)
			if (hasTree("feat8")) start = start.add(2)
		}
	}
	if (type=="hyper") {
		if (name=="tickspeed") {
			if (player.mainUpg.rp.includes(14)) start = start.add(50)
			if (player.ranks.tetr.gte(5)) start = start.add(RANKS.effect.tetr[5]())
		}
		if (name=="rank") {
			if (player.mainUpg.atom.includes(10)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[3][10].effect:0:0)
		}
		if (name=='supernova') {
			if (tmp.elements && hasElement(71)) start = start.add(tmp.elements.effect[71])
			if (hasTree("feat6")) start = start.add(1)
			if (hasTree("feat8")) start = start.add(2)
		}
	}
	if (type=="ultra") {
		if (name=="rank") {
			if (hasElement(62)) start = start.add(tmp.elements.effect[62])
		}
		if (name=="tickspeed") {
			if (player.ranks.tetr.gte(5)) start = start.add(RANKS.effect.tetr[5]())
		}
		if (name=='supernova') {
			if (tmp.elements && hasElement(71)) start = start.add(tmp.elements.effect[71])
			if (hasTree("feat8")) start = start.add(2)
		}
	}
	if (type=="meta") {
		if (FERMIONS.onActive(14)) return E(1/0)
		if (name=="rank") {
			if (tmp.fermions) start = start.mul(tmp.fermions.effs[1][4])
		}
		if (name=="tickspeed") {
			if (hasElement(68)) start = start.mul(2)
			if (hasElement(72)) start = start.mul(tmp.elements.effect[72])
			if (player.ranks.tetr.gte(18)) start = start.mul(RANKS.effect.tetr[18]())
			if (tmp.radiation) start = start.mul(tmp.radiation.bs.eff[14])
		}
		if (name=='supernova') {
			if (tmp.elements && hasElement(71)) start = start.add(tmp.elements.effect[71])
		}
	}
	if (SCALE_FLOORS[name] && !SCALE_FLOORS[name]()) return start
	return start.floor()
}

function getScalingPower(type, name) {
	let power = E(1)
	if (type=="super") {
		if (name=="rank") {
			if (player.mainUpg.rp.includes(10)) power = power.mul(0.8)
			if (player.ranks.tetr.gte(4)) power = power.mul(RANKS.effect.tetr[4]())
		}
		if (name=="tier") {
			if (player.ranks.tetr.gte(4)) power = power.mul(0.8)
			if (hasElement(37)) power = power.mul(tmp.elements.effect[37])
		}
		if (name=="tetr") {
			if (player.ranks.pent.gte(4)) power = power.mul(RANKS.effect.pent[4]())
		}
		if (name=="massUpg") {
			if (player.mainUpg.rp.includes(8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			power = power.mul(tmp.chal?tmp.chal.eff[1].tick:1)
			if (hasTree("feat3")) power = power.mul(0.85)
			if (chalOutside() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
		if (name=='bh_condenser') {
			if (hasElement(15)) power = power.mul(0.8)
		}
		if (name=='gamma_ray') {
			if (hasElement(15)) power = power.mul(0.8)
		}
		if (name=="fTier") {
			if (hasTree("fn3")) power = power.mul(0.925)
		}
	}
	if (type=="hyper") {
		if (name=="rank") {
			if (player.ranks.tetr.gte(1)) power = power.mul(0.85)
			if (hasElement(27)) power = power.mul(0.75)
		}
		if (name=="tier") {
			if (player.ranks.tetr.gte(4)) power = power.mul(0.8)
			if (hasElement(37)) power = power.mul(tmp.elements.effect[37])
		}
		if (name=="massUpg") {
			if (player.mainUpg.rp.includes(8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			if (player.mainUpg.bh.includes(12)) power = power.mul(0.85)
			if (hasElement(27)) power = power.mul(0.75)
			if (hasTree("feat3")) power = power.mul(0.85)
			if (chalOutside() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
		if (name=='bh_condenser') {
			if (hasElement(55)) power = power.mul(0.75)
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
			if (chalOutside() && AXION.unl()) power = power.div(tmp.ax.eff[2])
		}
		if (name=='bh_condenser') {
			if (hasElement(55)) power = power.mul(0.75)
		}
		if (name=='gamma_ray') {
			if (hasElement(55)) power = power.mul(0.75)
		}
		if (name=='supernova') {
			if (tmp.radiation) power = power.mul(tmp.radiation.bs.eff[20])
		}
	}
	if (type=="meta") {
		if (name=="rank") {
			if (player.ranks.pent.gte(4)) power = power.mul(RANKS.effect.pent[4]())
			if (AXION.unl()) power = power.mul(tmp.ax.eff[6])
		}
		if (name=='tickspeed') {
			if (player.ranks.pent.gte(5)) power = power.mul(RANKS.effect.pent[5]())
			if (chalOutside() && AXION.unl()) power = power.div(tmp.ax.eff[2])
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
	return " <span class='soft"+(lvl>1?lvl:"")+"'>(softcapped"+(lvl>1?"^"+lvl:"")+")</span>"
}