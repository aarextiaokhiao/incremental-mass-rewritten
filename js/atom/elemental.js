const ELEMENTS = {
    map: `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxxx_xxxxxxxxxxxxxxxvxxx_xxxxxxxxxxxxxxxvxxx1xxxxxxxxxxxxxxxvxxx2xxxxxxxxxxxxxxxv_v___3xxxxxxxxxxxxxx_v___4xxxxxxxxxxxxxx_`,
    la: [null,'*','**','*','**'],
    names: [
        null,
        'H','He','Li','Be','B','C','N','O','F','Ne',
        'Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
        'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn',
        'Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr',
        'Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn',
        'Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd',
        'Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb',
        'Lu','Hf','Ta','W','Re','Os','Ir','Pt','At','Hg',
        'Ti','Pb','Bi','Po','Au','Rn','Fr','Ra','Ac','Th',
        'Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm',
        'Md','No','Lr','Rf','Db','Sg','Bh','Hs','Mt','Ds',
        'Rg','Cn','Nh','Fl','Mc','Lv','Ts','Og'
    ],
    fullNames: [
        null,
        'Hydrogen','Helium','Lithium','Beryllium','Boron','Carbon','Nitrogen','Oxygen','Fluorine','Neon',
        'Sodium','Magnesium','Aluminium','Silicon','Phosphorus','Sulfur','Chlorine','Argon','Potassium','Calcium',
        'Scandium','Titanium','Vanadium','Chromium','Manganese','Iron','Cobalt','Nickel','Copper','Zinc',
        'Gallium','Germanium','Arsenic','Selenium','Bromine','Krypton','Rubidium','Strontium','Yttrium','Zirconium',
        'Niobium','Molybdenum','Technetium','Ruthenium','Rhodium','Palladium','Silver','Cadmium','Indium','Tin',
        'Antimony','Tellurium','Iodine','Xenon','Caesium','Barium','Lanthanum','Cerium','Praseodymium','Neodymium',
        'Promethium','Samarium','Europium','Gadolinium','Terbium','Dysprosium','Holmium','Erbium','Thulium','Ytterbium',
        'Lutetium','Hafnium','Tantalum','Tungsten','Rhenium','Osmium','Iridium','Platinum','Gold','Mercury',
        'Thallium','Lead','Bismuth','Polonium','Astatine','Radon','Francium','Radium','Actinium','Thorium',
        'Protactinium','Uranium','Neptunium','Plutonium','Americium','Curium','Berkelium','Californium','Einsteinium','Fermium',
        'Mendelevium','Nobelium','Lawrencium','Ruthefordium','Dubnium','Seaborgium','Bohrium','Hassium','Meitnerium','Darmstadium',
        'Roeritgenium','Copernicium','Nihonium','Flerovium','Moscovium','Livermorium','Tennessine','Oganesson'
    ],
    canBuy(x) { return player.atom.quarks.gte(this.upgs[x].cost) && !hasElement(x) },
    buyUpg(x) {
        if (this.canBuy(x)) {
            player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
            player.atom.elements.push(x)
        }
    },
    buyAll() {
        for (let x = 1; x <= tmp.elements.unl_length; x++) if (x<=tmp.elements.upg_length) ELEMENTS.buyUpg(x)
    },
    upgs: [
        null,
        {
            desc: `Improve quarks more.`,
            cost: D(5e8),
        },
        {
            desc: `Hardened Challenges scale 25% weaker.`,
            cost: D(2.5e12),
        },
        {
            desc: `Electron Power boosts Atomic Powers.`,
            cost: D(1e15),
            effect() {
                let x = player.atom?player.atom.powers[2].add(1).root(2):D(1)
                return x.softcap('e1e4',0.9,2).softcap('e1e8',0.9,2).softcap('e1e12',200/243,2)
            },
            effDesc(x) { return format(x)+"x"+getSoftcapHTML(x,'e1e4','e1e8','e1e12') },
        },
        {
            desc: `Proton Power multiplies Stronger Power.`,
            cost: D(2.5e16),
            effect() {
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):D(1)
                return x
            },
            effDesc(x) { return format(x)+"x stronger" },
        },
        {
            desc: `C7 reward is twice as effective.`,
            cost: D(1e18),
        },
        {
            desc: `Gain 1% more Quarks per challenge completion.`,
            cost: D(5e18),
            effect() {
                let x = D(0)
                for (let i = 1; i <= CHAL_NUM; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                return x.div(100).add(1).max(1)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Elements boost Quarks.`,
            cost: D(1e20),
            effect() {
                let x = D(player.atom.elements.length+1)
                if (hasElement(11)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `C2's softcap scales 75% weaker.`,
            cost: D(1e21),
        },
        {
            desc: `Tetr scales 15% weaker.`,
            cost: D(6.5e21),
        },
        {
            desc: `Weaken scalings for Challenges 3 & 4.`,
            cost: D(1e24),
        },
        {
            desc: `Square Nitrogen-7.`,
            cost: D(1e27),
        },
        {
            desc: `Particles give more Particle Powers.`,
            cost: D(1e29),
            effect() {
                return ATOM.particles.mg12()
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `C7 completions add C5 & 6 completions.`,
            cost: D(2.5e30),
            effect() {
                let x = player.chal.comps[7].mul(2)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        {
            desc: `Passively generate Quarks.`,
            cost: D(1e33),
        },
        {
            desc: `Super BH Condenser & Cosmic Ray scales 20% weaker.`,
            cost: D(1e34),
        },
        {
            desc: `Elements produce more Quarks. (at a steady rate)`,
            cost: D(5e38),
            effect() {
                let x = player.atom.elements.length*0.02
                return Number(x)
            },
            effDesc(x) { return "+"+format(x*100)+"%" },
        },
        {
            desc: `Raise Atoms by ^1.1.`,
            cost: D(1e40),
        },
		{
			desc: `You can automatically buy Cosmic Rays. Cosmic Ray raise Tickspeed.`,
			cost: D(1e44),
			effect() {
				let x = player.atom.gamma_ray.pow(0.35).mul(0.01).add(1)
				if (EXT.unl()) x = x.add(player.ext.ar39)
				return x.softcap(1.3,0.1,0).softcap(100,0.3,0)
			},
			effDesc(x) {
				return "^"+format(x)+getSoftcapHTML(x,1.3,100)
			},
		},
        {
            desc: `Neutron Power's 2nd effect is better.`,
            cost: D(1e50),
        },
        {
            desc: `Adds 50 more C7 maximum completions.`,
            cost: D(1e53),
        },
        {
            desc: `Unlock Mass Dilation.`,
            cost: D(1e56),
        },
        {
            desc: `Dilated mass gain is affected by tickspeed at a reduced rate.`,
            cost: D(1e61),
            effect() {
                let x = D(1.25).pow(player.tickspeed.pow(0.55))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `The Atomic Power effect is better.`,
            cost: D(1e65),
        },
        {
            desc: `Passively gain Atoms. Atomic Power boosts Relativistic Particles.`,
            cost: D(1e75),
            effect() {
                let x = player.atom.atomic.max(1).log10().add(1).pow(0.4)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Adds 1 base of Mass Dilation upgrade 1 effect.`,
            cost: D(1e80),
        },
        {
            desc: `Hardened Challenge scales weaker per Element.`,
            cost: D(1e85),
            effect() {
                let x = D(0.99).pow(D(player.atom.elements.length).softcap(30,2/3,0)).max(0.5)
                return x
            },
            effDesc(x) { return format(D(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `Hyper/Ultra Rank & Tickspeed scales 25% weaker.`,
            cost: D(1e90),
        },
        {
            desc: `Raise Mass gain by ^1.5 if dilated.`,
            cost: D(1e97),
        },
        {
            desc: `Protons are better.`,
            cost: D(1e100),
        },
        {
            desc: `Electrons are better. Passively produce Particles you would assign with Quarks.`,
            cost: D(1e107),
        },
        {
            desc: `Dilated mass boosts Relativistic Particles.`,
            cost: D(1e130),
            effect() {
                let x = player.md.mass.add(1).pow(0.0125)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Raise base RP formula by ^1.05.`,
            cost: D(1e140),
        },
        {
            desc: `Add 50 more C8 maximum completions.`,
            cost: D(1e155),
        },
        {
            desc: `Rage Power boosts Relativistic Particles.`,
            cost: D(1e175),
            effect() {
                let x = player.rp.points.max(1).log10().add(1).pow(0.75)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Black Hole mass boosts dilated mass.`,
            cost: D(1e210),
            effect() {
                let x = player.bh.mass.max(1).log10().add(1).pow(0.8)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Unlock Stars.`,
            cost: D(1e225),
        },
        {
            desc: `Tetr weakens Tier scalings.`,
            cost: D(1e245),
            effect() {
                let x = D(0.9).pow(player.ranks.tetr.softcap(6,0.5,0))
                return x
            },
            effDesc(x) { return format(D(1).sub(x).mul(100))+"% weaker"+getSoftcapHTML(player.ranks.tetr,6) },
        },
        {
            desc: `Cosmic Ray's extra Tickspeed adds to Rage Power Upgrade 7.`,
            cost: D(1e260),
            effect() {
                let x = tmp.atom?tmp.atom.atomicEff:D(0)
                return x.div(6).floor()
            },
            effDesc(x) { return "+"+format(x,0) },
        },
        {
            desc: `Remove softcap from C2 & C6 effects.`,
            cost: D(1e285),
        },
        {
            desc: `Stars boost dilated mass.`,
            cost: D(1e303),
            effect() {
                let x = player.stars.points.add(1).pow(0.5)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Add 50 more C7 maximum completions.`,
            cost: D('e315'),
        },
        {
            desc: `Stars boost quarks.`,
            cost: D('e325'),
            effect() {
                let x = player.stars.points.add(1).pow(1/3)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `You can now automatically buy mass dilation upgrades if you purchased any first. They no longer spend dilated mass.`,
            cost: D('e360'),
        },
        {
            desc: `Break the scaling of Tetr. [Reduce the exponent]`,
            cost: D('e380'),
        },
        {
            desc: `Stars boost Relativistic Particles.`,
            cost: D('e420'),
            effect() {
                let x = player.stars.points.add(1).pow(0.15).min(1e20)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Star effect boosts Black Hole mass.`,
            cost: D('e510'),
            effect() {
                let x = tmp.stars?tmp.stars.effect.eff.add(1).pow(0.02):D(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Raise Quarks by ^1.05.`,
            cost: D('e610'),
        },
        {
            desc: `Collapsed star's effect is 10% stronger.`,
            cost: D('e800'),
        },
        {
            desc: `Collapsed stars boost last type of stars.`,
            cost: D('e1000'),
            effect() {
                let x = player.stars.points.add(1).log10().add(1).pow(1.1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Star generator is now ^1.05 stronger.`,
            cost: D('e1750'),
        },
        {
            desc: `Mass gain softcap^2 is 10% weaker.`,
            cost: D('e2400'),
        },
        {
            desc: `Black Hole mass boosts Atomic Powers.`,
            cost: D('e2800'),
            effect() {
                let x = expMult(player.bh.mass.add(1),0.6)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass Dilation upgrade 6 is 75% stronger.`,
            cost: D('e4600'),
        },
        {
            desc: `<b class="final_elem">[Final Atomic Element]</b> Collapsed stars boost all-star resources at a reduced rate.`,
            cost: D('e5200'),
            effect() {
                let x = player.mass.max(1).log10().root(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Hyper/Ultra BH Condenser & Cosmic Ray scale 25% weaker.`,
            cost: D('e1.6e4'),
        },
        {
            desc: `Add 200 more C8 maximum completions.`,
            cost: D('e2.2e4'),
        },
        {
            desc: `Tickspeed Power multiplies Star Booster base.`,
            cost: D('e3.6e4'),
            effect() {
                let x = tmp.tickspeedEffect?tmp.tickspeedEffect.step.max(1).log10().div(10).max(1):D(1)
                if (hasElement(66)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Ultra Rank & Tickspeed scales weaker based on Tier.`,
            cost: D('e5.7e4'),
            effect() {
                let x = D(0.975).pow(player.ranks.tier.pow(0.5))
                return x
            },
            effDesc(x) { return format(D(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `The power from the mass of the BH formula is increased to 0.45.`,
            cost: D('e6.6e4'),
        },
        {
            desc: `Add 100 more C7 maximum completions.`,
            cost: D('e7.7e4'),
        },
        {
            desc: `Multiply Particle Powers gain by ^0.5 of its Particle's amount after softcap.`,
            cost: D('e1.5e5'),
        },
        {
            desc: `Ultra Rank scale 3 later for every Supernova.`,
            cost: D('e2.5e5'),
            effect() {
                let x = player.supernova.times.mul(3)
                return x
            },
            effDesc(x) { return format(x,0)+" later" },
        },
        {
            desc: `Non-bonus Tickspeed is 25x effective.`,
            cost: D('e3e5'),
        },
        {
            desc: `Strengthen C3, 4, and 8 rewards by 50%.`,
            cost: D('e5e5'),
        },
        {
            desc: `Add 200 more C7 & 8 maximum completions.`,
            cost: D('e8e5'),
        },
        {
            desc: `Square Lanthanum-57.`,
            cost: D('e1.1e6'),
        },
        {
            desc: `Stars boost Quarks. [Stacked with Mo-42]`,
            cost: D('e1.7e6'),
            effect() {
                let x = player.stars.points.add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },

        {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        },

        {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        },

        {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `Placeholder.`,
            cost: EINF
        }, {
            desc: `<b class="final_elem">[Final Supernovae Element]</b> Placeholder.`,
            cost: EINF
        }
    ],
    /*
    {
        desc: `Placeholder.`,
        cost: EINF,
        effect() {
            let x = D(1)
            return x
        },
        effDesc(x) { return format(x)+"x" },
    },
    */
	getUnlLength() {
		let u = 4
		if (EXT.unl()) {
			u = 86
		} else if (player.supernova.unl) {
			u = 54
			if (player.supernova.post_10) u = 57
			if (player.supernova.fermions.unl) u = 67
			if (tmp.radiation.unl) u = 86
		} else {
			if (player.chal.comps[8].gte(1)) u += 14
			if (hasElement(18)) u += 3
			if (MASS_DILATION.unlocked()) u += 15
			if (STARS.unlocked()) u += 18
		}
		return u
	},
}

function hasElement(x) {
	return player.atom.elements.includes(x)
}

function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = "<div class='table_center'>"
    let num = 0
	for (let i = 0; i < ELEMENTS.map.length; i++) {
		let m = ELEMENTS.map[i]
        if (m=='v') table += '</div><div class="table_center">'
        else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
        else if (m=='x') {
            num++
            table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
            :`<button class="elements" id="elementID_${num}" onclick="ELEMENTS.buyUpg(${num})" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0"><div style="font-size: 12px;">${num}</div>${ELEMENTS.names[num]}</button>`
            if (num==57 || num==89) num += 14
            else if (num==71) num += 18
            else if (num==118) num = 57
        }
	}
    table += "</div>"
	elements_table.setHTML(table)
}

function updateElementsHTML() {
    elm.elem_quark.setHTML(format(player.atom.quarks, 0))

    let ch = tmp.elements.choosed
    elm.elem_ch_div.setVisible(ch>0)
    if (ch) {
        elm.elem_desc.setHTML("["+ELEMENTS.fullNames[ch]+"] "+ELEMENTS.upgs[ch].desc)
        elm.elem_cost.setTxt(format(ELEMENTS.upgs[ch].cost,0))
        elm.elem_eff.setHTML(ELEMENTS.upgs[ch].effDesc?"Currently: "+ELEMENTS.upgs[ch].effDesc(tmp.elements.effect[ch]):"")
    }
    elm.element_la_1.setVisible(tmp.elements.unl_length>57)
    elm.element_la_3.setVisible(tmp.elements.unl_length>57)
    elm.element_la_2.setVisible(tmp.elements.unl_length>88)
    elm.element_la_4.setVisible(tmp.elements.unl_length>88)
    for (let x = 1; x <= tmp.elements.upg_length; x++) {
        let upg = elm['elementID_'+x]
        if (upg) {
            upg.setVisible(x <= tmp.elements.unl_length)
            if (x <= tmp.elements.unl_length) {
                let has = hasElement(x)
                upg.setClasses({elements: true, locked: !ELEMENTS.canBuy(x), bought: has, star: has && x > 36 && x < 54, sn: has && x > 54 && x < 86, final: has && (x == 54 || x == 86)})
            }
        }
    }
}

function updateElementsTemp() {
    if (!tmp.elements) tmp.elements = {
        upg_length: ELEMENTS.upgs.length-1,
        choosed: 0,
    }
    if (!tmp.elements.effect) tmp.elements.effect = {}
    for (let x = tmp.elements.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tmp.elements.effect[x] = ELEMENTS.upgs[x].effect()
    }
    tmp.elements.unl_length = ELEMENTS.getUnlLength()
}