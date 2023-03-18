const SCALE_START = {
    super: {
        rank: E(50),
		tier: E(10),
		tetr: E(7),
		pent: E(15),
		hex: E(100),
		hept: E(15),
		oct: E(15),
        massUpg: E(100),
		tickspeed: E(100),
		bh_condenser: E(100),
		gamma_ray: E(100),
		supernova: E(15),
		fTier: E(10),
		gfTier: E(10),
		cosmic_str: E(15),
		prestige0: E(15),
		prestige1: E(7),
		prestige2: E(10),
		prestige3: E(30),
		prestige4: E(45),
		superGal: E(50),
		massUpg4: E(1000),
    },
	hyper: {
		rank: E(120),
		tier: E(200),
		tetr: E(60),
		pent: E(100),
		hex: E(500),
		hept: E(40),
		oct: E(100),
		massUpg: E(500),
		tickspeed: E(250),
		bh_condenser: E(300),
		gamma_ray: E(300),
		supernova: E(35),
		fTier: E(50),
		gfTier: E(50),
		cosmic_str: E(90),
		prestige0: E(160),
		prestige1: E(30),
		prestige2: E(30),
		massUpg4: E(1000000),
	},
	ultra: {
		rank: E(600),
		tier: E(1e5),
		tetr: E(150),
		pent: E(500),
		hex: E(1100),
		hept: E(1000),
		massUpg: E(1e11),
		tickspeed: E(700),
		bh_condenser: E(750),
		gamma_ray: E(800),
		supernova: E(60),
		fTier: E(100),
		prestige0: E(600),
		prestige1: E(60),
		prestige2: E(42),
	},
	meta: {
		rank: E(1e4),
		tier: E(1e65),
		tetr: E(1e70),
		pent: E(1e60),
		hex: E(1e9),
		hept: E(5e4),
		tickspeed: E(5e4),
		bh_condenser: E(1e7),
		gamma_ray: E(1e6),
		supernova: E(100),
		fTier: E(25000),
		prestige0: E(1000),
	},
	exotic: {
		prestige0: E(558000),
	},
}

const SCALE_POWER= {
    super: {
		rank: 1.5,
		tier: 1.5,
		tetr: 2,
		pent: 2,
		hex: 3,
		hept: 4,
		oct: 5,
		massUpg: 2.5,
		tickspeed: 2,
		bh_condenser: 2,
		gamma_ray: 2,
		supernova: 3,
		fTier: 2.5,
		gfTier: 2,
		cosmic_str: 2,
		prestige0: 1.5,
		prestige1: 1.5,
		prestige2: 1.3,
		prestige3: 1.5,
		prestige4: 2,
		superGal: 1.5,
		massUpg4: 3,
    },
	hyper: {
		rank: 2.5,
		tier: 2.5,
		tetr: 3,
		pent: 3,
		hex: 5,
		hept: 5,
		oct: 5,
		massUpg: 5,
		tickspeed: 4,
		bh_condenser: 2,
		gamma_ray: 4,
		supernova: 3,
		fTier: 4,
		gfTier: 3,
		cosmic_str: 4,
		prestige0: 2,
		prestige1: 2,
		prestige2: 3,
		massUpg4: 5,
	},
	ultra: {
		rank: 4,
		tier: 4,
		tetr: 6,
		pent: 6,
		hex: 10,
		hept: 10,
		massUpg: 10,
		tickspeed: 7,
		bh_condenser: 4,
		gamma_ray: 6,
		supernova: 5,
		fTier: 6,
		prestige0: 4,
		prestige1: 4,
		prestige2: 5,
	},
	meta: {
		rank: 1.0025,
		tier: 1.0025,
		tetr: 1.0025,
		pent: 1.0025,
		hex: 1.0001,
		hept: 1.0001,
		tickspeed: 1.001,
		bh_condenser: 1.001,
		gamma_ray: 1.001,
		supernova: 1.025,
		fTier: 1.0001,
		prestige0: 1.004,
	},
	exotic: {
		prestige0: 1e125,
	},
}

const SCALE_FP = {
	tickspeed() { return [1,1,1,tmp.tickspeedFP] },
}

const QCM8_SCALES = ['rank','tier','tetr','pent','massUpg','tickspeed','bh_condenser','gamma_ray','supernova','fTier']
const PreQ_SCALES = ['rank','tier','tetr','massUpg','tickspeed','bh_condenser','gamma_ray']
const SCALE_TYPE = ['super', 'hyper', 'ultra', 'meta', 'exotic'] // super, hyper, ultra, meta
const FULL_SCALE_NAME = ['Super', 'Hyper', 'Ultra', 'Meta', 'Exotic']

const SCALING_RES = {
    rank(x=0) { return player.ranks.rank },
	tier(x=0) { return player.ranks.tier },
	tetr(x=0) { return player.ranks.tetr },
	pent(x=0) { return player.ranks.pent },
	hex(x=0) { return player.ranks.hex },
	hept(x=0) { return player.ranks.hept },
	oct(x=0) { return player.ranks.oct },
	enne(x=0) { return player.ranks.enne },
	tickspeed(x=0) { return player.tickspeed },
    massUpg(x=1) { return E(player.massUpg[x]||0) },
    massUpg4(x=4) { return E(player.massUpg[x]||0) },
	bh_condenser(x=0) { return player.bh.condenser },
	gamma_ray(x=0) { return player.atom.gamma_ray },
	supernova(x=0) { return player.supernova.times },
	fTier(x=0, y=0) { return player.supernova.fermions.tiers[x][y] },
	gfTier(x=0, y=0) { return player.supernova.fermions.tiers[x][y] },
	cosmic_str(x=0) { return player.qu.cosmic_str },
	prestige0() { return player.prestiges[0] },
	prestige1() { return player.prestiges[1] },
	prestige2() { return player.prestiges[2] },
	prestige3() { return player.prestiges[3] },
	prestige4() { return player.prestiges[4] },
	superGal() { return player.superGal },
}

const NAME_FROM_RES = {
	rank: "Rank",
	tier: "Tier",
	tetr: "Tetr",
	pent: "Pent",
	hex: "Hex",
	hept: "Hept",
	oct: "Oct",
	enne: "Enne",
	massUpg: "Mass Upgrades",
	massUpg4: "Overpower",
	tickspeed: "Tickspeed",
	bh_condenser: "Black Hole Condenser",
	gamma_ray: "Cosmic Ray",
	supernova: "Supernova",
	fTier: "Fermion Tier",
	gfTier: "Galactic Fermion Tier",
	cosmic_str: "Cosmic String",
	prestige0: "Prestige Level",
	prestige1: "Honor",
	prestige2: "Glory",
	prestige3: "Renown",
	prestige4: "Valor",
	superGal: "Supernova Galaxy",
}

function updateScalingHTML() {
	let s = SCALE_TYPE[player.scaling_ch]
	tmp.el.scaling_name.setTxt(FULL_SCALE_NAME[player.scaling_ch])
	if (!tmp.scaling) return
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		tmp.el["scaling_div_"+x].setDisplay(player.scaling_ch == x)
		if (player.scaling_ch == x) {
			let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
			for (let y = 0; y < key.length; y++) {
				let have = tmp.scaling[SCALE_TYPE[x]].includes(key[y])
				tmp.el['scaling_'+x+'_'+key[y]+'_div'].setDisplay(have)
				if (have) {
					tmp.el['scaling_'+x+'_'+key[y]+'_power'].setTxt(format(getScalingPower(SCALE_TYPE[x], key[y]).mul(100))+"%")
					tmp.el['scaling_'+x+'_'+key[y]+'_start'].setTxt(format(getScalingStart(SCALE_TYPE[x], key[y]),0))
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
			if (key[y] == "massUpg") for (let i = 0; i < UPGS.mass.cols; i++) {
				if (scalingActive(key[y], SCALING_RES[key[y]](i), SCALE_TYPE[x])) {
					tmp.scaling[SCALE_TYPE[x]].push(key[y])
					break
				}
			}
			else if (key[y] == "fTier") for (let i = 0; i < 2; i++) for (let j = 0; j < 6; j++) {
				if (scalingActive(key[y], SCALING_RES[key[y]](i,j), SCALE_TYPE[x])) {
					tmp.scaling[SCALE_TYPE[x]].push(key[y])
					break
				}
			}
			else if (key[y] == "gfTier") for (let i = 2; i < 4; i++) for (let j = 0; j < 6; j++) {
				if (scalingActive(key[y], SCALING_RES[key[y]](i,j), SCALE_TYPE[x])) {
					tmp.scaling[SCALE_TYPE[x]].push(key[y])
					break
				}
			}
			else if (scalingActive(key[y], SCALING_RES[key[y]](), SCALE_TYPE[x])) tmp.scaling[SCALE_TYPE[x]].push(key[y])
		}
	}
	let sqc8 = []
	if (player.mainUpg.br.includes(2)) sqc8.push("massUpg","rank","tier","tetr","pent")
	if (player.md.break.active) sqc8.push("bh_condenser","gamma_ray")
	tmp.scaling_qc8 = sqc8
}

function scalingActive(name, amt, type) {
	if (SCALE_START[type][name] === undefined) return false
	amt = E(amt);
	return amt.gte(getScalingStart(type, name));
}

function getScalingName(name, x=0, y=0) {
	if (!NAME_FROM_RES[name]) return

	let cap = Object.keys(SCALE_START).length;
	let current = "";
	let amt = SCALING_RES[name](x,y);
	for (let n = cap - 1; n >= 0; n--) {
		if (scalingActive(name, amt, Object.keys(SCALE_START)[n]))
			return capitalFirst(Object.keys(SCALE_START)[n]) + (n==3?"-":" ");
	}
	return current;
}

function getScalingStart(type, name) {
	if (name=="rank") if (hasElement(202))return EINF;
	if (name=="tier") if (hasElement(239))return EINF;
	if (name=="tetr") if (hasElement(324))return EINF;
	if (name=="pent") if (hasElement(452))return EINF;
	if (name=="tier" && type!="meta") if (hasElement(178))return EINF;
	if (name=="prestige0" && type=="meta") if (hasPrestige(4,6))return EINF;
		
	let start = E(SCALE_START[type][name])
	if (type=="super") {
		if (name=="rank") {
			if (CHALS.inChal(1) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19)) return E(25)
			start = start.add(tmp.chal?tmp.chal.eff[1].rank:0)
		}
		if (name=="tier") {
			if (player.mainUpg.atom.includes(5)) start = start.add(10)
		}
		if (name=="tetr") {
			if (player.ranks.tier.gte(100)) start = start.add(5)
		}
		if (name=="massUpg") {
			if (CHALS.inChal(1) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19)) return E(25)
			if (player.mainUpg.bh.includes(3)) start = start.add(tmp.upgs?tmp.upgs.main?tmp.upgs.main[2][3].effect:0:0)
		}
		if (name=='tickspeed') {
			if (CHALS.inChal(1) || CHALS.inChal(10) || CHALS.inChal(14) || CHALS.inChal(19)) return E(50)
		}
		if (name=="prestige0") {
			if (player.md.break.upgs[9].gte(1)) start = start.add(10)
			if (hasPrestige(2,1)) start = start.add(5)
		}
		if (name=="prestige1") {
			if (hasPrestige(2,2)) start = start.add(1)
		}	
		if (name=="gfTier") {
			if (hasElement(303)) start = start.mul(1.5)
			if (hasElement(309)) start = start.mul(1.5)
			if (hasElement(342)) start = start.mul(1.5)
		}
		if (name=="superGal") {
			if (hasUpgrade('exotic',2)) start = start.add(5)
			if (hasPrestige(3,19)) start = start.add(5)
			if (player.qu.times.gte(Number.MAX_VALUE) && player.exotic.times.gte(1)) start = start.add(5)
			if (hasAscension(0,8)) start = start.add(5)
			start = start.add(SUPERNOVA_CLUSTER.effects.eff2())
			start = start.add(tmp.chal?tmp.chal.eff[21]:0)
		}
		if (name=="massUpg4") {
			if (hasPrestige(2,162)) start = start.mul(10/9)
			if (hasUpgrade('rp',21)) start = start.mul(1.08)
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
		if (name=="gfTier") {
			if (hasElement(407)) start = start.mul(1.5)
		}
	}
	if (type=="ultra") {
		if (name=="rank") {
			if (hasElement(62)) start = start.add(tmp.elements.effect[62])
		}
		if (name=="tickspeed") {
			if (player.ranks.tetr.gte(5)) start = start.add(RANKS.effect.tetr[5]())
		}
		if (name=="prestige2") {
			if (hasElement(293)) start = start.add(2)
			if (hasPrestige(2,98)) start = start.add(6)
		}
	}
	if (type=="meta") {
		if (name=="rank") {
			if (player.ranks.pent.gte(1)) start = start.mul(1.1)
			if (player.ranks.pent.gte(5)) start = start.mul(RANKS.effect.pent[5]())
			if (hasPrestige(1,5)) start = start.mul(prestigeEff(1,5))
			start = start.mul(tmp.radiation.bs.eff[14])
			start = start.mul(tmp.bd.upgs[4].eff)
			if (hasPrestige(0,53)) start = start.mul(1.5)
			if (player.ranks.hex.gte(62)) start = start.mul(RANKS.effect.hex[62]())
            if (hasElement(170) && !hasElement(230))start = start.mul(tmp.chal?tmp.chal.eff[5]:1)
			if (hasPrestige(1,57)) start = start.mul(prestigeEff(1,57))
			if (player.ranks.hept.gte(17)) start = start.mul(RANKS.effect.hept[17]())
			start = start.mul(SUPERNOVA_GALAXY.effects.meta())
		}
		if (name=="tier") {
			if (hasPrestige(1,58)) start = start.mul(prestigeEff(1,58))
            if (hasElement(188))start = start.mul(tmp.bd.upgs[4].eff)
            if (hasElement(202))start = start.mul(tmp.elements.effect[202])
			if (player.ranks.hept.gte(20)) start = start.mul(RANKS.effect.hept[20]())
            if (hasElement(230) && !hasElement(265))start = start.mul(tmp.chal?tmp.chal.eff[5]:1)
			start = start.mul(SUPERNOVA_GALAXY.effects.meta())
		}
		if (name=="tetr") {
            if (hasElement(232))start = start.mul(tmp.elements.effect[232])
            if (hasElement(239))start = start.mul(tmp.elements.effect[239])
            if (hasElement(242))start = start.mul(10)
            if (player.ranks.oct.gte(2))start = start.mul(RANKS.effect.oct[2]())
            if (hasElement(265) && !hasElement(348))start = start.mul(tmp.chal?tmp.chal.eff[5]:1)
		}
		if (name=="pent") {
            if (hasElement(272))start = start.mul(tmp.elements.effect[272])
			if (hasElement(275))start = start.mul(tmp.fermions.effs[3][3]||1)
            if (hasElement(324))start = start.mul(tmp.elements.effect[324])
            if (hasElement(348) && !hasElement(421))start = start.mul(CHALS[5].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[5].mul(tmp.qu.chroma_eff[2])))
			if (hasElement(421))start = start.mul(1e100)
            if (hasElement(424))start = start.mul(tmp.elements.effect[424])
				
            if (hasUpgrade('exotic',12))start = start.mul(tmp.bd.upgs[4].eff)
			
			if (hasPrestige(2,163)) start = start.mul(1e10)
			if (hasPrestige(2,175)) start = start.mul(1e20)
				
            if (player.qu.times.gte(1e275) && player.exotic.times.gte(1))start = start.mul(100)
            if (player.qu.times.gte(1e303) && player.exotic.times.gte(1))start = start.mul(1e25)
				
			if (hasChargedElement(62)) start = start.mul(tmp.elements.ceffect[62]||1)
				
            if (player.ranks.enne.gte(2))start = start.mul(RANKS.effect.enne[2]())
			if (player.mainUpg.exotic.includes(21)) start = start.mul(upgEffect(6,21))
				
			if(player.qu.times.gte('1e600'))start = start.mul(player.qu.times)
		}
		if (name=="hex") {
            if (hasElement(325))start = start.mul(1.5)
            if (hasElement(344))start = start.mul(1.5)
            if (hasElement(361))start = start.mul(1.5)
            if (hasPrestige(4,1))start = start.mul(1000)
            if (hasPrestige(4,2))start = start.mul(10)
            if (hasElement(421))start = start.mul(CHALS[5].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[5].mul(tmp.qu.chroma_eff[2])))
            if (hasPrestige(4,7))start = start.mul(1e10)
            if (hasElement(454))start = start.mul(tmp.bd.upgs[4].eff)
            if (hasElement(460))start = start.mul(tmp.elements.effect[460])
            if (hasElement(470))start = start.mul(tmp.elements.effect[470])
		}
		if (name=="hept") {
            if (player.ranks.enne.gte(15))start = start.mul(7.5)
		}
		if (name=="tickspeed") {
			if (hasElement(68)) start = start.mul(2)
			if (player.ranks.hex.gte(68)) start = start.mul(2)
			if (player.ranks.hex.gte(88)) start = start.mul(100)
			if (player.ranks.pent.gte(4)) start = start.mul(RANKS.effect.pent[4]())
			if (player.ranks.hex.gte(123)) start = start.mul(RANKS.effect.hex[123]())
			if (hasPrestige(2,7)) start = start.mul(10000)
			start = start.mul(tmp.fermions.effs[0][5])
			start = start.mul(getEnRewardEff(0))
			start = start.mul(SUPERNOVA_GALAXY.effects.meta())
			if (hasElement(348))start = start.mul(tmp.chal?tmp.chal.eff[1].rank.add(1):1)
			if (hasChargedElement(68)) start = start.pow(2)
			if (hasElement(418)) start = start.pow(10)
			if (hasChargedElement(88)) start = start.pow(2)
		}
		if (name=="bh_condenser" || name=="gamma_ray") {
			start = start.mul(getEnRewardEff(0))
			start = start.mul(SUPERNOVA_GALAXY.effects.meta())
			if (hasElement(284))start = start.mul(tmp.fermions.effs[1][5].add(10).log10())
			if (hasPrestige(3,35))start = start.mul(prestigeEff(3,35,E(1)))
		}
		if (name == "supernova") if (hasPrestige(1,2)) start = start.add(100)
			
		if (name=="fTier") {
			if (hasPrestige(2,14)) start = start.mul(100)
			if (hasPrestige(3,26)) start = start.mul(10)
		}
		if (name=="prestige0") {
			if (hasElement(285)) start = start.mul(3.5)
			if (hasPrestige(2,49)) start = start.mul(1.2)
			if (hasPrestige(2,84)) start = start.mul(2)
			if (hasElement(338)) start = start.mul(2)
			if (hasPrestige(2,156)) start = start.mul(1.2)
			if (hasAscension(0,1)) start = start.mul(1.2)
			if (hasElement(371)) start = start.mul(1.25)
			if (hasElement(403)) start = start.mul(1.05)
			if (hasPrestige(4,5)) start = start.mul(2)
		}
	}
	if (type=="exotic") {
		if (name=="prestige0") {
			if (hasElement(466)) start = start.add(42000)
		}
	}
	if (name=='supernova') {
		start = start.add(tmp.prim.eff[7])
	}
	if ((name=="bh_condenser" || name=="gamma_ray" || name=="tickspeed") && hasUpgrade('atom',14)) start = start.mul(10)
	if ((name=="bh_condenser" || name=="gamma_ray" || name=="tickspeed") && hasUpgrade('atom',14) && player.prestiges[0].gte(50)) start = start.mul(1.2)
	if (QCs.active() && QCM8_SCALES.includes(name)) if (!tmp.scaling_qc8.includes(name)) start = start.pow(tmp.qu.qc_eff[7][0])
	if (hasUpgrade('br',14) && name=="fTier" && type=="super") start = start.add(10)
	if (hasElement(88) && name == "tickspeed") start = start.mul(player.qu.rip.active?100:10)
		
	if (type=="meta") {
		if (name=="rank") {
			tmp.rankCollapse = start.div(start.softcap("1e30", hasElement(183)?1:hasElement(169)?0.82:hasElement(162)?0.6:0.5, 0).softcap("1e50", hasElement(184)?1:hasElement(176)?0.9:hasElement(171)?0.6:0.5, 0).softcap("1e60", hasElement(191)?1:hasElement(181)?0.78:0.5, 0));
			start = start.softcap("1e30", hasElement(183)?1:hasElement(169)?0.82:hasElement(162)?0.6:0.5, 0).softcap("1e50", hasElement(184)?1:hasElement(176)?0.9:hasElement(171)?0.6:0.5, 0).softcap("1e60", hasElement(191)?1:hasElement(181)?0.78:0.5, 0);
		}
	}
	
	if (name=="rank" && type!="meta") if (player.ranks.hex.gte(80))return EINF;
	if (name=="tickspeed" && type!="meta") if (player.ranks.hex.gte(80))return EINF;
	if (name=="bh_condenser" && type!="meta") if (player.ranks.hex.gte(82))return EINF;
	if ( name=="gamma_ray" && type!="meta") if (player.ranks.hex.gte(82))return EINF;
	if (name=="massUpg" && type!="meta" && type!="ultra") if (player.ranks.hex.gte(95))return EINF;
	if (name=="tier" && type!="meta" && type!="ultra") if (player.ranks.hex.gte(95))return EINF;
	if (name=="supernova" && type!="meta") if (player.ranks.hex.gte(98))return EINF;
	if (name=="tetr" && type=="super") if (player.ranks.hex.gte(238))return EINF;
	if (name=="tetr" && type=="hyper") if (player.ranks.hept.gte(11))return EINF;
	if (name=="tier" && type=="ultra") if (player.ranks.hept.gte(15))return EINF;
	if (name=="tetr" && type=="ultra") if (player.ranks.hept.gte(16))return EINF;
	if (name=="cosmic_str" && type=="super") if (hasElement(187))return EINF;
	if (name=="pent" && type=="super") if (hasPrestige(2,29))return EINF;
	if (name=="fTier" && type=="super") if (hasPrestige(2,31))return EINF;
	if (name=="prestige0" && type=="super") if (hasPrestige(2,43))return EINF;
	if (name=="prestige0" && type=="hyper") if (hasPrestige(3,1))return EINF;
	if (name=="fTier" && type=="hyper") if (hasPrestige(3,2))return EINF;
	if (name=="prestige1" && type=="super") if (hasPrestige(3,13))return EINF;
	if (name=="pent" && type=="hyper") if (player.ranks.oct.gte(4))return EINF;
	if (name=="pent" && type=="ultra") if (player.ranks.oct.gte(5))return EINF;
	if (name=="hex" && type=="super") if (player.ranks.oct.gte(20))return EINF;
	if (name=="fTier" && type=="ultra") if (hasPrestige(2,47))return EINF;
	if (name=="massUpg") if (hasPrestige(2,37))return EINF;
	if (name=="hex" && type=="hyper") if (hasPrestige(2,145))return EINF;
	if (name=="hept" && type=="super") if (hasPrestige(3,20))return EINF;
	if (name=="hex" && type=="ultra") if (hasPrestige(3,25))return EINF;
	if (name=="oct" && type=="super") if (hasPrestige(3,46))return EINF;
	if (name=="gamma_ray" && type=="meta") if (hasChargedElement(15))return EINF;
	if (name=="bh_condenser" && type=="meta") if (hasChargedElement(55))return EINF;
	if (name=="cosmic_str" && type=="hyper") if (hasPrestige(3,48))return EINF;
	if (name=="prestige0" && type=="ultra") if (hasAscension(1,11))return EINF;
	if (name=="hept" && type=="hyper") if (hasPrestige(4,9))return EINF;
	if (name=="prestige1" && type=="hyper") if (hasAscension(1,13))return EINF;
	return start.floor()
}

function getScalingPower(type, name) {
	let power = E(1)
	if (name == "supernova" && type != "meta") {
		power = power.mul(tmp.fermions.effs[1][4])
	}
	if (name == "fTier" && type != "meta") {
		if (hasTree("fn12")) power = power.mul(0.9)
	}
	if (name == "massUpg" && type != "ultra" && hasElement(84)) power = power.mul(tmp.elements.effect[84])
	if (type=="super") {
		if (name=="rank") {
			if (player.mainUpg.rp.includes(10)) power = power.mul(0.8)
			if (player.ranks.tetr.gte(4)) power = power.mul(RANKS.effect.tetr[4]())
			if (hasPrestige(0,77)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="tier") {
			if (player.ranks.tetr.gte(4)) power = power.mul(0.8)
			if (hasElement(37)) power = power.mul(tmp.elements.effect[37])
			if (hasPrestige(0,75)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="tetr") {
			if (hasElement(74)) power = power.mul(0.75)
			if (player.prestiges[1].gte(10)) power = power.mul(tmp.prestigeMassEffect)
			if (player.ranks.hex.gte(74)) power = power.mul(0.9)
		}
		if (name=="massUpg") {
			if (player.mainUpg.rp.includes(8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			power = power.mul(tmp.chal?tmp.chal.eff[1].tick:1)
		}
		if (name=='bh_condenser') {
			if (hasElement(15)) power = power.mul(0.8)
			if (player.ranks.hex.gte(15)) power = power.mul(0.8)
		}
		if (name=='gamma_ray') {
			if (hasElement(15)) power = power.mul(0.8)
			if (player.ranks.hex.gte(15)) power = power.mul(0.8)
		}
		if (name=="fTier") {
			if (hasTree("fn3")) power = power.mul(0.925)
			if (hasPrestige(0,500)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="cosmic_str") {
			if (hasPrestige(0,24)) power = power.mul(0.8)
			if (hasPrestige(0,79)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="pent") {
			if (hasPrestige(0,61)) power = power.mul(tmp.prestigeMassEffect)
			if (player.ranks.hept.gte(21)) power = power.mul(0.8)
			if (player.ranks.hept.gte(30)) power = power.mul(0.6)
			if (hasPrestige(1,120)) power = power.mul(0.4)
		}
		if (name=="supernova") {
			if (hasPrestige(0,61)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="prestige0") {
			if (hasPrestige(0,62)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="prestige1") {
			if (hasPrestige(0,77)) power = power.mul(tmp.prestigeMassEffect)
			if (hasPrestige(0,105)) power = power.mul(0.97)
		}
		if (name=="prestige2") {
			if (hasPrestige(2,12)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="prestige3") {
			if (hasAscension(1,4)) power = power.mul(0.8)
			if (hasPrestige(3,33)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="hex") {
			if (hasPrestige(1,34)) power = power.mul(tmp.prestigeMassEffect)
			if (hasElement(149)) power = power.mul(0.95)
			if (player.ranks.oct.gte(1)) power = power.mul(RANKS.effect.oct[1]())
		}
		if (name=="hept") {
			if (hasPrestige(1,64)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="oct") {
			if (hasPrestige(3,6)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="massUpg4") {
			if (player.ranks.oct.gte(46)) power = power.mul(0.96)
			if (hasElement(410)) power = power.mul(0.96)
			if (player.ranks.enne.gte(4)) power = power.mul(0.99)
			if (hasChargedElement(84)) power = power.mul(tmp.elements.ceffect[84]||1);
		}
	}
	if (type=="hyper") {
		if (name=="rank") {
			if (player.ranks.tetr.gte(1)) power = power.mul(0.85)
			if (hasElement(27)) power = power.mul(0.75)
			if (player.ranks.hex.gte(27)) power = power.mul(0.75)
			if (hasPrestige(0,77)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="tier") {
			if (player.ranks.tetr.gte(4)) power = power.mul(0.8)
			if (hasElement(37)) power = power.mul(tmp.elements.effect[37])
			if (hasPrestige(0,75)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="massUpg") {
			if (player.mainUpg.rp.includes(8)) power = power.mul(tmp.upgs.main?tmp.upgs.main[1][8].effect:1)
		}
		if (name=='tickspeed') {
			if (player.mainUpg.bh.includes(12)) power = power.mul(0.85)
			if (hasElement(27)) power = power.mul(0.75)
			if (player.ranks.hex.gte(27)) power = power.mul(0.75)
		}
		if (name=='bh_condenser') {
			if (hasElement(55)) power = power.mul(0.75)
			if (player.ranks.hex.gte(55)) power = power.mul(0.75)
		}
		if (name=='gamma_ray') {
			if (hasElement(55)) power = power.mul(0.75)
			if (player.ranks.hex.gte(55)) power = power.mul(0.75)
		}
		if (name=="tetr") {
			if (player.prestiges[1].gte(10)) power = power.mul(tmp.prestigeMassEffect)
			if (hasPrestige(1,37)) power = power.mul(0.98)
			if (player.ranks.hept.gte(8)) power = power.mul(0.9)
			if (player.ranks.hept.gte(9)) power = power.mul(0.7)
			if (player.ranks.hept.gte(10)) power = power.mul(0.5)
		}
		if (name=="pent") {
			if (hasPrestige(0,61)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="supernova") {
			if (hasPrestige(0,61)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="cosmic_str") {
			if (hasPrestige(0,79)) power = power.mul(tmp.prestigeMassEffect)
			if (hasPrestige(1,35)) power = power.mul(0.8)
		}
		if (name=="prestige0") {
			if (hasPrestige(1,21)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="prestige1") {
			if (hasPrestige(1,32)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="prestige2") {
			if (hasElement(259)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="fTier") {
			if (hasPrestige(0,1000)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="hex") {
			if (hasPrestige(1,56)) power = power.mul(0.955)
			if (hasPrestige(1,62)) power = power.mul(tmp.prestigeMassEffect)
			if (player.ranks.oct.gte(1)) power = power.mul(RANKS.effect.oct[1]())
		}
		if (name=="hept") {
			if (hasPrestige(1,146)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.1))
			if (hasPrestige(2,21)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.1))
			if (hasPrestige(2,22)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.3))
			if (hasPrestige(2,23)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.5))
			if (player.ranks.enne.gte(7)) power = power.mul(RANKS.effect.enne[7]())
		}
		if (name=="oct") {
			if (hasAscension(0,21)) power = power.mul(tmp.prestigeMassEffect)
		}
	}
	if (type=="ultra") {
		if (name=="rank") {
			if (hasElement(27)) power = power.mul(0.75)
			if (player.ranks.hex.gte(27)) power = power.mul(0.75)
			if (hasElement(58)) power = power.mul(tmp.elements.effect[58])
			if (hasPrestige(0,77)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=='tickspeed') {
			if (hasElement(27)) power = power.mul(0.75)
			if (player.ranks.hex.gte(27)) power = power.mul(0.75)
			if (hasElement(58)) power = power.mul(tmp.elements.effect[58])
		}
		if (name=="tier") {
			if (hasPrestige(0,75)) power = power.mul(tmp.prestigeMassEffect)
			if (hasUpgrade("atom",17)) power = power.mul(0.9)
			if (player.ranks.hept.gte(3)) power = power.mul(RANKS.effect.hept[3]())
		}
		if (name=="tetr") {
			if (player.prestiges[0].gte(45)) power = power.mul(0.58)
			if (player.prestiges[1].gte(10)) power = power.mul(tmp.prestigeMassEffect)
			if (player.ranks.hept.gte(14)) power = power.mul(RANKS.effect.hept[3]())
		}
		if (name=='bh_condenser') {
			if (hasElement(55)) power = power.mul(0.75)
			if (player.ranks.hex.gte(55)) power = power.mul(0.75)
		}
		if (name=='gamma_ray') {
			if (hasElement(55)) power = power.mul(0.75)
			if (player.ranks.hex.gte(55)) power = power.mul(0.75)
		}
		if (name=="pent") {
			if (hasPrestige(0,61)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="supernova") {
			if (hasPrestige(0,61)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="cosmic_str") {
			if (hasPrestige(0,79)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="massUpg") {
			if (player.ranks.hex.gte(300)) power = power.mul(0.98)
			if (player.ranks.hept.gte(22)) power = power.mul(0.99)
		}
		if (name=="prestige0") {
			if (hasPrestige(2,8)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="prestige1") {
			if (hasPrestige(1,61)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="fTier") {
			if (hasPrestige(2,13)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="hex") {
			if (hasPrestige(2,25)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(3,5)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(2,54)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.1))
			if (hasPrestige(2,55)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.3))
			if (hasPrestige(2,56)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.5))
			if (player.ranks.oct.gte(20)) power = power.mul(RANKS.effect.oct[1]())
		}
		if (name=="hept") {
			if (hasPrestige(2,59)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(3,18)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(2,140)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(2,173)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(3,31)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(3,49)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(4,3)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.2))
			if (hasPrestige(3,86)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.5))
			if (player.ranks.enne.gte(7)) power = power.mul(RANKS.effect.enne[7]())
		}
		if (name=="prestige2") {
			if (hasPrestige(3,4)) power = power.mul(tmp.prestigeMassEffect)
		}
	}
	if (type=="meta") {
		if (name=='supernova') {
			if (hasElement(78)) power = power.mul(0.8)
			if (player.ranks.hex.gte(78)) power = power.mul(0.95)
			if (hasPrestige(0,93)) power = power.mul(tmp.prestigeMassEffect)
			if (hasElement(284))power = power.mul(tmp.fermions.effs[3][4])
			if (hasElement(376))power = power.mul(tmp.ex.dsEff.sn||E(1))
			if (hasChargedElement(78)) power = power.mul(0.5)
		}
		if (name=="rank") {
			if (hasPrestige(0,77)) power = power.mul(tmp.prestigeMassEffect)
			if (hasPrestige(0,107)) power = power.mul(1e-4)
			if (hasPrestige(0,113)) power = power.mul(0.1)
			if (player.ranks.hex.gte(777)) power = power.mul(1e-10)
			if (player.ranks.hex.gte(888)) power = power.mul(1e-10)
			if (player.ranks.hex.gte(999)) power = power.mul(1e-10)
			if (player.ranks.hex.gte(1005)) power = power.mul(RANKS.effect.hex[1005]())
		}
		if (name=="prestige0") {
			if (hasPrestige(1,67)) power = power.mul(tmp.prestigeMassEffect)
		}
		if (name=="fTier") {
			if (hasElement(259)) power = power.mul(tmp.prestigeMassEffect)
			if (hasElement(415)) power = power.mul(0.01)
		}
		if (name=="hex") {
			if (player.ranks.oct.gte(17)) power = power.mul(0.004)
			if (hasPrestige(2,57)) power = power.mul(tmp.prestigeMassEffect)
			if (player.ranks.oct.gte(20)) power = power.mul(RANKS.effect.oct[1]())
			if (hasChargedElement(37)) power = power.mul(tmp.elements.ceffect[37]||1)
			if (hasChargedElement(58)) power = power.mul(tmp.elements.ceffect[58]||1)
			if (player.ranks.enne.gte(14)) power = power.mul(RANKS.effect.enne[14]())
		}
		if (name=="hept") {
			if (player.ranks.enne.gte(9)) power = power.mul(RANKS.effect.enne[9]())
			if (hasPrestige(4,13)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
			if (hasPrestige(4,16)) power = power.mul((tmp.prestigeMassEffect||E(1)).pow(0.05))
		}
		if (name=="tickspeed") {
			if (hasChargedElement(27)) power = power.mul(0.01)
		}
	}
	if (type=="exotic") {
		if (name=="prestige0") {
			if (hasPrestige(4,6)) power = power.mul(tmp.prestigeMassEffect)
			if (hasElement(440)) power = power.mul(0.95)
			if (hasElement(448)) power = power.mul(tmp.elements.effect[448]||1)
			if(player.exotic.dark_run.upgs[12].gte(1))power = power.mul(tmp.dark_run.upgs[12].eff);
			if (hasPrestige(4,11)) power = power.mul(prestigeEff(4,11,E(1)))
		}
	}
	if (name=="rank" && hasPrestige(0,58)) power = power.mul(0.5)
	if (name=="rank" && hasPrestige(1,15)) power = power.mul(0.1)
	if (hasUpgrade("atom",15) && name == "gamma_ray") power = power.mul(0.8)
	if (hasUpgrade("atom",15) && name == "gamma_ray" && player.prestiges[0].gte(50)) power = power.mul(0.76/0.8)
	if (hasElement(108) && ["rank","tier","tetr","pent"].includes(name)) power = power.mul(player.qu.rip.active?0.98:0.9)
	if (hasChargedElement(108) && ["hex","hept","oct"].includes(name)) power = power.mul(0.9)
	if (QCs.active() && QCM8_SCALES.includes(name)) if (!tmp.scaling_qc8.includes(name)) power = power.mul(tmp.qu.qc_eff[7][1])
	if (PreQ_SCALES.includes(name) && type != "meta")  power = power.mul(getEnRewardEff(5))
	return power
}