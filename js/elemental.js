const ELEMENTS = {
    map: [`x_________________xvxx___________xxxxxxvxx___________xxxxxxvxxx_xxxxxxxxxxxxxxxvxxx_xxxxxxxxxxxxxxxvxxx1xxxxxxxxxxxxxxxvxxx2xxxxxxxxxxxxxxxv_v___3xxxxxxxxxxxxxx_v___4xxxxxxxxxxxxxx_`],
    la: [null,'*','**','*','**'],
    exp: [0,118,218,362,558,814,1138],
    names: [
        null,
        'H','He','Li','Be','B','C','N','O','F','Ne',
        'Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
        'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn',
        'Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr',
        'Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn',
        'Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd',
        'Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb',
        'Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg',
        'Ti','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th',
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
    canBuy(x) { 
		if(this.upgs[x].qk)return player.atom.quarks.gte(this.upgs[x].cost) && !hasElement(x)
		if(this.upgs[x].exotic)return player.exotic.points.gte(this.upgs[x].cost) && !hasElement(x)
		if(this.upgs[x].ds)return player.exotic.ds.gte(this.upgs[x].cost) && !hasElement(x)
		if(this.upgs[x].galQk)return player.galQk.gte(this.upgs[x].cost) && !hasElement(x)
		if(this.upgs[x].et)return player.et.points.gte(this.upgs[x].cost) && !hasElement(x)
		if(x>118) return player.inf.points.gte(this.upgs[x].cost) && !hasElement(x)
		return player.atom.quarks.gte(this.upgs[x].cost) && !hasElement(x) && (player.qu.rip.active ? true : x <= 86) && !tmp.elements.cannot.includes(x)
	},
    canCharge(x) {
		if(!this.upgs[x].ccost)return false;
		return player.atom.quarks.gte(this.upgs[x].ccost) && !hasChargedElement(x) && hasElement(380)
	},
    buyUpg(x,y) {
        if (this.canBuy(x)) {
			if(x>118){
				if(this.upgs[x].qk)player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
				else if(this.upgs[x].exotic)player.exotic.points = player.exotic.points.sub(this.upgs[x].cost)
				else if(this.upgs[x].ds)player.exotic.ds = player.exotic.ds.sub(this.upgs[x].cost)
				else if(this.upgs[x].galQk)player.galQk = player.galQk.sub(this.upgs[x].cost)
				else if(this.upgs[x].et)player.et.points = player.et.points.sub(this.upgs[x].cost)
				else player.inf.points = player.inf.points.sub(this.upgs[x].cost)
			}else{
				player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
			}
            player.atom.elements.push(x)
        }
        if (this.canCharge(x) && !y) {
            player.atom.chargedElements.push(x)
        }
    },
    upgs: [
        null,
        {
            desc: `Improves quark gain formula is better.`,
            cost: E(5e8),
            cdesc: `Quark gain exponent ^1.01`,
            ccost: E("ee2.7777e12"),
        },
        {
            desc: `Hardened Challenge scale 25% weaker.`,
            cost: E(2.5e12),
            cdesc: `Impossible Challenge scale 5% weaker`,
            ccost: E("ee2.8e12"),
        },
        {
            desc: `Electron Power boost Atomic Powers gain.`,
            cost: E(1e15),
            effect() {
                let x = player.atom?player.atom.powers[2].add(1).root(2):E(1)
				if(player.ranks.hex.gte(3))x=x.pow(1.5);
				if(hasChargedElement(3))return x;
                if (x.gte('e1e4')) x = expMult(x.div('e1e4'),0.9).mul('e1e4')
				if (x.gte('ee4000')) x = overflow(x,'ee4000',0.5);
				if (x.gte('ee2250000')) x = overflow(x,'ee2250000',0.5);
				if (x.gte('ee7500000')) x = overflow(x,'ee7500000',0.5);
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.gte('e1e4')&&!hasChargedElement(3)?" <span class='soft'>(softcapped)</span>":"") },
            cdesc: `Remove All Softcaps from its effect`,
            ccost: E("ee2.9e12"),
        },
        {
            desc: `Stronger's power is stronger based on Proton Powers.`,
            cost: E(2.5e16),
            effect() {
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
				if(player.ranks.hex.gte(4))x=x.pow(1.05);
				if(hasChargedElement(4))x=x.pow(1.05);
				return x
            },
            effDesc(x) { return format(x)+"x stronger" },
            cdesc: `Effect of this element ^1.05`,
            ccost: E("ee2.9e12"),
        },
        {
            desc: `The 7th challenge's effect is twice as effective.`,
            cost: E(1e18),
            cdesc: `The 7th challenge's effect is better`,
            ccost: E("ee3e12"),
        },
        {
            desc: `Gain 1% more quarks for each challenge completion.`,
            cost: E(5e18),
            effect() {
                let x = E(0)
                for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                if (hasElement(7)) x = x.mul(tmp.elements.effect[7])
                if (hasElement(87)) x = E(1.01).pow(x).root(3)
                else x = x.div(100).add(1).max(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
            cdesc: `This element's effect boost Exotic Matter at a reduced rate.`,
            ccost: E("ee3.1e12"),
            ceffect() {
                let x = E(0)
                for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                if (hasElement(7)) x = x.mul(tmp.elements.effect[7])
                return x.add(10).log10().pow(hasChargedElement(87)?2:1);
            },
            ceffDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Carbon's effect is now multiplied by the number of elements bought.`,
            cost: E(1e20),
            effect() {
                let x = E(player.atom.elements.length+1)
				if (player.ranks.hex.gte(7))x = x.pow(1.1);
                if (hasElement(11) && (!hasElement(87) || player.ranks.hex.gte(11))) x = x.pow(2);
                if (hasChargedElement(11)) x = x.pow(3);
				if (hasChargedElement(7))x = x.pow(tmp.elements.ceffect[7]||E(1));
                return x
            },
            effDesc(x) { return format(x)+"x" },
            cdesc: `Boost this element's effect based on the number of elements charged.`,
            ccost: E("ee3.2e12"),
            ceffect() {
                let x = E(player.atom.chargedElements.length+1)
                return x;
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `C2's reward's softcap is 75% weaker.`,
            cost: E(1e21),
            cdesc: `C13's reward's softcap starts later.`,
            ccost: E("ee3.2e12"),
        },
        {
            desc: `The Tetr requirement is 15% weaker.`,
            cost: E(6.5e21),
            cdesc: `The Tier requirement is broken.`,
            ccost: E("ee3.7e12"),
        },
        {
            desc: `3rd & 4th challenges' scaling is weakened.`,
            cost: E(1e24),
            cdesc: `C20 scaling is weakened.`,
            ccost: E("ee3.9e12"),
        },
        {
            desc: `Nitrogen's multiplier is squared.`,
            cost: E(1e27),
            cdesc: `Nitrogen's multiplier is cubed.`,
            ccost: E("ee4.65e12"),
        },
        {
            desc: `Power's gain from each particle formula is better.`,
            cost: E(1e29),
            cdesc: `This element is better.`,
            ccost: E("ee4.65e12"),
        },
        {
            desc: `For every c7 completion, add 2 c5 & 6 completion.`,
            cost: E(2.5e30),
            effect() {
                let x = player.chal.comps[7].mul(2)
                if (hasElement(79)) x = x.mul(tmp.qu.chroma_eff[2])
                return x
            },
            effDesc(x) { return "+"+format(x) },
            cdesc: `The 7th challenge's effect is better`,
            ccost: E("ee4.8e12"),
        },
        {
            desc: `Passively gain 5% of the quarks you would get from resetting each second.`,
            cost: E(1e33),
            cdesc: `Passively gain 100% of the Dark Ray you would get from resetting each second.`,
            ccost: E("ee5e12"),
        },
        {
            desc: `Super BH Condenser & Cosmic Ray scales 20% weaker.`,
            cost: E(1e34),
            cdesc: `Remove Meta-Cosmic Ray scaling.`,
            ccost: E("ee5.2e12"),
        },
        {
            desc: `Silicon now gets +2% for each element bought.`,
            cost: E(5e38),
            effect() {
                let x = player.atom.elements.length*0.02
				if(player.ranks.hex.gte(16))x = player.atom.elements.length
                return Number(x)
            },
            effDesc(x) { return "+"+format(x*100)+"%" },
            cdesc: `This element's effect boost Silicon's Charged Effect.`,
            ccost: E("ee5.2e12"),
        },
        {
            desc: `Raise Atom's gain by 1.1.`,
            cost: E(1e40),
            cdesc: `Raise Atom's gain exponent by 1.01.`,
            ccost: E("ee5.3e12"),
        },
        {
            desc: `You can now automatically buy Cosmic Rays. Cosmic Ray raise tickspeed effect at an extremely reduced rate.`,
            cost: E(1e44),
            effect() {
                let x = player.atom.gamma_ray.pow(0.35).mul(0.01).add(1)
				if(player.ranks.hex.gte(18))x = player.atom.gamma_ray
                return x
            },
            effDesc(x) { return "^"+format(x) },
            cdesc: `Argon's effect boost Normal Mass gain.`,
            ccost: E("ee5.4e12"),
        },
        {
            desc: `2nd Neutron's effect is better.`,
            cost: E(1e50),
            cdesc: `2nd Neutron's effect is squared.`,
            ccost: E("ee5.75e12"),
        },
        {
            desc: `Adds 50 more C7 maximum completions.`,
            cost: E(1e53),
            cdesc: `The 7th challenge's effect is better`,
            ccost: E("ee5.9e12"),
        },
        {
            desc: `Unlock Mass Dilation.`,
            cost: E(1e56),
            cdesc: `Dilated Overflow is weaker.`,
            ccost: E("ee6e12"),
        },
        {
            desc: `Dilated mass gain is affected by tickspeed at a reduced rate.`,
            cost: E(1e61),
            effect() {
                let x = E(1.25).pow(player.tickspeed.pow(0.55))
				if(player.ranks.hex.gte(22))x = E(10).pow(player.tickspeed)
				if(hasChargedElement(22))x = E(10).pow(player.tickspeed.pow(1.25))
                return x.min('eee15')
            },
            effDesc(x) { return format(x)+"x"+(x.gte('eee15')?" <span class='soft'>(hardcapped)</span>":"")  },
            cdesc: `This element is better.`,
            ccost: E("ee6.3e12"),
        },
        {
            desc: `The Atomic Power effect is better.`,
            cost: E(1e65),
            cdesc: `This element is better.`,
            ccost: E("ee6.9e12"),
        },
        {
            desc: `Passively gain 100% of the atoms you would get from resetting each second. Atomic Power boost Relativistic particles gain at a reduced rate.`,
            cost: E(1e75),
            effect() {
                let x = hasPrestige(0,40) ? player.atom.atomic.max(1).log10().add(1).log10().add(1).root(2) : player.atom.atomic.max(1).log10().add(1).pow(0.4)
				if(player.ranks.hex.gte(24))x = x.pow(1.1)
				return x
            },
            effDesc(x) { return hasPrestige(0,40) ? "^"+format(x) : format(x)+"x" },
            cdesc: `Passively gain 100% of the Exotic Matter you would get from resetting each second.`,
            ccost: E("ee7.5e12"),
        },
        {
            desc: `Adds 1 base of Mass Dilation upgrade 1 effect.`,
            cost: E(1e80),
            cdesc: `Adds 1 base of Mass Dilation upgrade 3 effect.`,
            ccost: E("ee7.7e12"),
        },
        {
            desc: `Hardened Challenge scaling weaker for each element bought.`,
            cost: E(1e85),
            effect() {
                let x = E(0.99).pow(E(player.atom.elements.length).softcap(30,2/3,0)).max(0.5)
				if(player.ranks.hex.gte(26))x = E(0.99).pow(E(player.atom.elements.length))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            cdesc: `Impossible Challenge scaling weaker for each element charged.`,
            ccost: E("ee7.7e12"),
            ceffect() {
                let x = E(0.999).pow(E(player.atom.chargedElements.length))
                return x
            },
            ceffDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `Hyper/Ultra Rank & Tickspeed scales 25% weaker.`,
            cost: E(1e90),
            cdesc: `Meta Tickspeed scales 99% weaker.`,
            ccost: E("ee8.8e12"),
        },
        {
            desc: `Mass gain is raised to the power of 1.5th if you dilated mass.`,
            cost: E(1e97),
            cdesc: `Dilated Mass boost Mass gain.`,
            ccost: E("ee8.9e12"),
            ceffect() {
                let x = player.md.mass.add(10).log10();
                return x
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `Proton powers effect is better.`,
            cost: E(1e100),
            cdesc: `Proton powers effect is squared.`,
            ccost: E("ee9.3e12"),
        },
        {
            desc: `Electron powers effect is better. Passively gain 10% of each particle you would assign quarks.`,
            cost: E(1e107),
            cdesc: `Electron powers effect is squared.`,
            ccost: E("ee9.7e12"),
        },
        {
            desc: `Dilated mass boost Relativistic particles gain.`,
            cost: E(1e130),
            effect() {
                let x = player.md.mass.add(1).log10().add(1).log10().add(1).pow(5);
                return x
            },
            effDesc(x) { if(player.ranks.hex.gte(31))return "^"+format(x)+", "+format(player.md.mass.add(1).pow(0.0125))+"x";return format(player.md.mass.add(1).pow(0.0125))+"x" },
            cdesc: `Dilated mass boost Relativistic mass gain.`,
            ccost: E("ee1.1e13"),
            ceffect() {
                let x = player.md.mass.add(1).log10().add(1).log10().add(1).log10().add(1);
                return x
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `Increase dilated mass gain exponent by 5%.`,
            cost: E(1e140),
            cdesc: `Multiply dilated mass gain exponent by 10.`,
            ccost: E("ee1.5e13"),
        },
        {
            desc: `Add 50 more C8 maximum completions.`,
            cost: E(1e155),
            cdesc: `The effect of Challenge 8 is better.`,
            ccost: E("ee1.5e13"),
        },
        {
            desc: `Rage power boost Relativistic particles gain.`,
            cost: E(1e175),
            effect() {
                let x = player.rp.points.max(1).log10().add(1).pow(0.75)
                if(player.ranks.hex.gte(34))x = player.rp.points.add(1).log10().add(1).log10().add(1).log10().add(1);
                return x
            },
            effDesc(x) { if(player.ranks.hex.gte(34))return "^"+format(x);return format(x)+"x" },
            cdesc: `This element's effect boost Relativistic mass gain.`,
            ccost: E("ee1.6e13"),
            ceffect() {
                let x = player.rp.points.add(1).log10().add(1).log10().add(1).log10().add(1);
                return x
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `Mass from Black Hole boost dilated mass gain.`,
            cost: E(1e210),
            effect() {
                let x = player.bh.mass.max(1).log10().add(1).pow(0.8)
				if(player.ranks.hex.gte(35))x = player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1).sqrt();
                return x
            },
            effDesc(x) { if(player.ranks.hex.gte(35))return "^"+format(x);return format(x)+"x" },
            cdesc: `This element's effect boost Relativistic mass gain.`,
            ccost: E("ee1.6e13"),
            ceffect() {
                let x = player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1).sqrt();
                return x
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `Unlock Stars.`,
            cost: E(1e225),
            cdesc: `Collapsed Star gain exponent ^1.1`,
            ccost: E("ee1.6e13"),
        },
        {
            desc: `Super Tier scale weaker based on Tetr.`,
            cost: E(1e245),
            effect() {
				if(player.ranks.hex.gte(37))return E(0);
                let x = E(0.9).pow(player.ranks.tetr.softcap(6,0.5,0))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            cdesc: `Meta-Hex scale weaker based on Tetr.`,
            ccost: E("ee2.6e13"),
            ceffect() {
                let x = E(0.9).pow(player.ranks.tetr.add(1).log10().add(1).log10().add(1).log10());
                return x
            },
            ceffDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `Cosmic Ray's free tickspeeds now adds to RU7.`,
            cost: E(1e260),
            effect() {
                let x = tmp.atom?tmp.atom.atomicEff:E(0)
                if (hasElement(82)) x = x.mul(3)
                if (player.ranks.hex.gte(38)) x = x.mul(2)
				if (hasChargedElement(82))return x.pow(2)
                return x.div(6).floor()
            },
            effDesc(x) { return "+"+format(x,0)+" to Rage Power Upgrade 7" },
            cdesc: `Cosmic Ray's free tickspeeds now adds to BH Condensers.`,
            ccost: E("ee2.7e13"),
        },
        {
            desc: `Remove softcap from C2 & C6 effects.`,
            cost: E(1e285),
            cdesc: `C13 effect softcap starts later.`,
            ccost: E("ee2.7e13"),
        },
        {
            desc: `Collapsed star boost dilated mass gain.`,
            cost: E(1e303),
            effect() {
                let x = player.stars.points.add(1).pow(0.5)
                if (player.ranks.hex.gte(40)) x = x.pow(2)
                return x.min('ee3e13')
            },
            effDesc(x) { return format(x)+"x"+(x.gte('ee3e13')?" <span class='soft'>(hardcapped)</span>":"") },
            cdesc: `Collapsed star boost Relativistic mass gain.`,
            ccost: E("ee3e13"),
            ceffect() {
                let x = player.stars.points.add(1).log10().add(1).log10().add(1).log10().add(1);
                return x
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `Add 50 more C7 maximum completions.`,
            cost: E('e315'),
            cdesc: `The 7th challenge's effect is better`,
            ccost: E("ee3.1e13"),
        },
        {
            desc: `Collapsed star boost quark gain.`,
            cost: E('e325'),
            effect() {
				if(hasChargedElement(42))return Decimal.pow(10,expMult(player.stars.points.add(1).log10().add(1).log10().add(2),0.96));
                let x = player.stars.points.add(1).pow(1/3)
                if (player.ranks.hex.gte(42)) x = x.pow(3)
                return x.min('eee10')
            },
            effDesc(x) { 
				if(hasChargedElement(42))return "^"+format(x);
				return format(x)+"x"+(x.gte('eee10')?" <span class='soft'>(hardcapped)</span>":"") 
			},
            cdesc: `This element is better`,
            ccost: E("ee3.2e13"),
        },
        {
            desc: `You can now automatically buy mass dilation upgrades if you purchased any first. They no longer spent dilated mass.`,
            cost: E('e360'),
            cdesc: `You can now automatically buy Reset Count Boosters. They no longer spent Exotic Matter.`,
            ccost: E("ee3.3e13"),
        },
        {
            desc: `The Tetr requirement is broken.`,
            cost: E('e380'),
            cdesc: `The Tier requirement is broken.`,
            ccost: E('ee3.4e13'),
        },
        {
            desc: `Collapsed star boost relativistic particles gain.`,
            cost: E('e420'),
            effect() {
                let x = player.stars.points.add(1).pow(0.15).min(1e20)
				if(player.ranks.hex.gte(45))x = player.stars.points.add(1).log10().add(1).log10().add(1).log10().add(1).sqrt();
                return x
            },
            effDesc(x) { if(player.ranks.hex.gte(45))return "^"+format(x);return format(x)+"x" },
            cdesc: `This element's effect boost Relativistic Energy gain.`,
            ccost: E('ee3.5e13'),
            ceffect() {
                let x = player.stars.points.add(1).log10().add(1).log10().add(1).log10().add(1).sqrt();
                return x
            },
            ceffDesc(x) { return "^"+format(x) },
        },
        {
            desc: `Collapsed star's effect boost mass gain from the black hole at a reduced rate.`,
            cost: E('e510'),
            effect() {
                let x = tmp.stars?tmp.stars.effect.add(1).pow(0.02):E(1)
				if(player.ranks.hex.gte(46))x = tmp.stars?tmp.stars.effectPower:E(1)
                return x
            },
            effDesc(x) { if(player.ranks.hex.gte(46))return "^"+format(x);return format(x)+"x" },
            cdesc: `Collapsed star's effect is better.`,
            ccost: E('ee3.6e13'),
        },
        {
            desc: `Quarks gain is raised to the 1.1th power.`,
            cost: E('e610'),
            cdesc: `Quarks gain exponent ^1.02`,
            ccost: E('ee3.6e13'),
        },
        {
            desc: `Collapsed stars effect is 10% stronger.`,
            cost: E('e800'),
            cdesc: `Collapsed star's effect is better.`,
            ccost: E('ee3.8e13'),
        },
        {
            desc: `Collapsed star boost last type of stars.`,
            cost: E('e1000'),
            effect() {
                let x = player.stars.points.add(1).log10().add(1).pow(1.1)
				if(player.ranks.hex.gte(49))x = player.stars.points
				x = overflow(x,"ee40000",0.75).min('eee10');
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.gte('eee10')?" <span class='soft'>(hardcapped)</span>":x.gte('ee40000')?" <span class='soft'>(softcapped)</span>":"") },
            cdesc: `Star generator gain exponent ^1.02`,
            ccost: E("ee4.7e13"),
        },
        {
            desc: `Star generator is now ^1.05 stronger.`,
            cost: E('e1750'),
            cdesc: `Star generator gain exponent ^1.02`,
            ccost: E("ee5.3e13"),
        },
        {
            desc: `Mass gain softcap^2 is 10% weaker.`,
            cost: E('e2400'),
            cdesc: `Mass gain exponent ^1.005`,
            ccost: E("ee5.4e13"),
        },
        {
            desc: `Mass of black hole boost atomic powers gain at a reduced rate.`,
            cost: E('e2800'),
            effect() {
				if(hasChargedElement(52))return Decimal.pow(10,player.bh.mass.add(1).log10().add(1).log10().add(2));
                let x = expMult(player.bh.mass.add(1),0.6).min('eee10')
				if(player.ranks.hex.gte(52))x = expMult(player.bh.mass.add(1),0.95).min('eee10')
                return x
            },
            effDesc(x) { 
				if(hasChargedElement(52))return "^"+format(x);
					return format(x)+"x"+(x.gte('eee10')?" <span class='soft'>(hardcapped)</span>":"") },
            cdesc: `This element is better`,
            ccost: E("ee5.5e13"),
        },
        {
            desc: `Mass Dilation upgrade 6 is 75% stronger.`,
            cost: E('e4600'),
            cdesc: `Remove the softcap of Break Dilation upgrade 1.`,
            ccost: E("ee5.7e13"),
        },
        {
            desc: `Mass boost all-star resources at a reduced rate.`,
            cost: E('e5200'),
            effect() {
				if(hasChargedElement(54))return E(10).tetrate(player.mass.add(10).slog().div(1.35));
                let x = player.mass.max(1).log10().root(2)
                return x
            },
            effDesc(x) { 
				if(hasChargedElement(54))return "^"+format(x);
			return format(x)+"x" },
            cdesc: `This element is better`,
            ccost: E("ee5.8e13"),
        },
        {
            desc: `Hyper/Ultra BH Condenser & Cosmic Ray scale 25% weaker.`,
            cost: E('e1.6e4'),
            cdesc: `Remove Meta-BH Condenser scaling.`,
            ccost: E("ee5.9e13"),
        },
        {
            desc: `Add 200 more C8 maximum completions.`,
            cost: E('e2.2e4'),
            cdesc: `The effect of C8 is better.`,
            ccost: E("ee9.9e13"),
        },
        {
            desc: `Tickspeed power boost base from Star Booster at a reduced rate.`,
            cost: E('e3.6e4'),
            effect() {
                let x = tmp.tickspeedEffect?tmp.tickspeedEffect.step.max(1).log10().div(10).max(1):E(1)
				if (hasChargedElement(57))x = tmp.tickspeedEffect?E(10).tetrate(tmp.tickspeedEffect.step.add(10).slog().div(hasChargedElement(66)?1.0036:1.00369)):E(1)
                if (hasElement(66)) x = x.pow(2)
                if (player.ranks.hex.gte(57)) x = x.pow(1.1)
                if (player.ranks.hex.gte(66)) x = x.pow(1.1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
            cdesc: `This element is better`,
            ccost: E("ee1e14"),
        },
        {
            desc: `Ultra Rank & Tickspeed scales weaker based on Tier.`,
            cost: E('e5.7e4'),
            effect() {
				if(player.ranks.hex.gte(58))return E(0);
                let x = E(0.975).pow(player.ranks.tier.pow(0.5))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            cdesc: `Meta-Hex scales weaker based on Tier.`,
            ccost: E("ee1.7e14"),
            ceffect() {
                let x = E(0.9).pow(player.ranks.tier.add(1).log10().add(1).log10().add(1).log10());
                return x
            },
            ceffDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `The power from the mass of the BH formula is increased to 0.45.`,
            cost: E('e6.6e4'),
            cdesc: `The power from the mass of the BH formula is increased to 1, and uncap Radiation Booster "BH-Exponent Boost".`,
            ccost: E("ee1.8e14"),
        },
        {
            desc: `Add 100 more C7 maximum completions.`,
            cost: E('e7.7e4'),
            cdesc: `C7 reward is better`,
            ccost: E("ee1.9e14"),
        },
        {
            desc: `Multiply Particle Powers gain by ^0.5 of its Particle's amount after softcap.`,
            cost: E('e1.5e5'),
            cdesc: `Remove Particle Powers gain softcaps.`,
            ccost: E("ee2e14"),
        },
        {
            desc: `Ultra Rank scale 3 later for every Supernova.`,
            cost: E('e2.5e5'),
            effect() {
                let x = player.supernova.times.mul(3)
                return x
            },
            effDesc(x) { return format(x,0)+" later" },
            cdesc: `Meta-Pent starts later based on Supernova.`,
            ccost: E("ee2.1e14"),
            ceffect() {
                let x = player.supernova.times.add(10).pow(2)
                return x
            },
            ceffDesc(x) { return "x"+format(x,0)+" later" },
        },
        {
            desc: `Non-bonus Tickspeed is 25x effective.`,
            cost: E('e3e5'),
            cdesc: `Accelerator Effect Softcap^2 is weaker.`,
            ccost: E("ee3.1e14"),
        },
        {
            desc: `Rewards from Challenges 3-4 & 8 are 50% effective.`,
            cost: E('e5e5'),
            cdesc: `C3-4 Rewards are better`,
            ccost: E("ee3.4e14"),
        },
        {
            desc: `Add 200 more C7 & c8 maximum completions.`,
            cost: E('e8e5'),
            cdesc: `C7-8 Rewards are better`,
            ccost: E("ee3.7e14"),
        },
        {
            desc: `Lanthanum's effect is twice stronger.`,
            cost: E('e1.1e6'),
            cdesc: `Lanthanum's effect is better`,
            ccost: E("ee4.4e14"),
        },
        {
            desc: `Collapsed star boost quarks gain.`,
            cost: E('e1.7e6'),
            effect() {
				if(hasChargedElement(67)) return E(10).tetrate(player.stars.points.add(100).slog().div(1.337));
                let x = player.stars.points.add(1)
                if (player.ranks.hex.gte(67)) return player.stars.points.add(1).log10().add(1).log10().add(1).log10().add(1).sqrt();
                return x.softcap('e3e15',0.85,2).min('eee10')
            },
            effDesc(x) { if(player.ranks.hex.gte(67) || hasChargedElement(67))return "^"+format(x);return format(x)+"x"+(x.gte('eee10')?" <span class='soft'>(hardcapped)</span>":"")  },
            cdesc: `This element is better`,
            ccost: E("ee4.5e14"),
        },
        {
            desc: `Meta-Tickspeed start 2x later.`,
            cost: E('e4.8e6'),
            cdesc: `Meta-Tickspeed start ^2 later.`,
            ccost: E('ee5e14'),
        },
        {
            desc: `Pent is now added in mass gain formula from collapsed stars.`,
            cost: E('e3.6e7'),
            cdesc: `Hept is now added in mass gain formula from collapsed stars.`,
            ccost: E('ee5.4e14'),
        },
        {
            desc: `Add 200 more C7 & c8 maximum completions.`,
            cost: E('e6.9e7'),
            cdesc: `C7-8 Rewards are better`,
            ccost: E('ee6.1e14'),
        },
        {
            desc: `From BH the formulas softcap starts later based on Supernovas.`,
            cost: E('e1.6e8'),
            effect() {
                let x = player.supernova.times.add(1).root(4)
                return x
            },
            effDesc(x) { return "^"+format(x)+" later" },
            cdesc: `Black Hole Upgrade 19 is better.`,
            ccost: E('ee6.2e14'),
        },
        {
            desc: `Tetrs are 15% cheaper.`,
            cost: E('e5.75e8'),
            cdesc: `The Tetr requirement is broken.`,
            ccost: E('ee9e14'),
        },
        {
            desc: `Add more C5-6 & C8 maximum completions based on Supernovas.`,
            cost: E('e1.3e9'),
            effect() {
                let x = player.supernova.times.mul(5)
                if (hasElement(79)) x = x.mul(tmp.qu.chroma_eff[2])
                return x
            },
            effDesc(x) { return "+"+format(x,0) },
            cdesc: `Effects of C5,C8 are better.`,
            ccost: E('ee9.5e14'),
        },
        {
            desc: `Super Tetr scales 25% weaker.`,
            cost: E('e2.6e9'),
            cdesc: `The Tetr requirement is broken.`,
            ccost: E('ee1.2e15'),
        },
        {
            desc: `Remove 2 softcaps from Atomic Power's effect.`,
            cost: E('e3.9e9'),
            cdesc: `Atomic Power's effect is better.`,
            ccost: E('ee1.3e15'),
        },
        {
            desc: `Collapsed Star's effect is 25% stronger.`,
            cost: E('e3.75e10'),
            cdesc: `Collapsed Star's effect is better.`,
            ccost: E('ee1.4e15'),
        },
        {
            desc: `Softcap^3 from mass gain is 17.5% weaker.`,
            cost: E('e4e11'),
            cdesc: `Stronger Overflow is weaker.`,
            ccost: E('ee1.9e15'),
        },
        {
            desc: `Meta-Supernova scales 20% weaker.`,
            cost: E('e3.4e12'),
            cdesc: `Meta-Supernova scales 50% weaker.`,
            ccost: E('ee3e15'),
        },
        {
            desc: `Neutronium-0 affects Aluminium-13 & Tantalum-73.`,
            cost: E('e4.8e12'),
            cdesc: `Neutronium-0 is better.`,
            ccost: E('ee6e15'),
        },
        {
            desc: `Stronger & Tickspeed are 25x stronger.`,
            cost: E('e1.4e13'),
            cdesc: `Stronger Overflow is weaker.`,
            ccost: E('ee7.7777e15'),
        },
        {
            desc: `Stronger is ^1.1 stronger.`,
            cost: E('e2.8e13'),
            cdesc: `Stronger is ^2 stronger.`,
            ccost: E('ee1e16'),
        },
        {
            desc: `Strontium-38 is thrice effective.`,
            cost: E('e4e13'),
            cdesc: `Strontium-38's effect is squared.`,
            ccost: E('ee1.1111e16'),
        },
        {
            desc: `Mass Dilation upgrade 2 effect is overpowered.`,
            cost: E('e3e14'),
            cdesc: `This element is better.`,
            ccost: E('ee1.7e16'),
        },
        {
            desc: `Pre-Ultra Mass Upgrades scale weaker based on Cosmic Ray's free tickspeeds.`,
            cost: E('e7e14'),
            effect() {
				if(player.ranks.hex.gte(84))return E(0);
                let x = tmp.atom?E(0.9).pow(tmp.atom.atomicEff.add(1).log10().pow(2/3)):E(1)
                return x
            },
            effDesc(x) { return formatReduction(x)+" weaker" },
            cdesc: `Super Overpower scales weaker based on Cosmic Ray's free tickspeeds.`,
            ccost: E('ee1.8e16'),
            ceffect() {
                let x = tmp.atom?E(0.999).pow(tmp.atom.atomicEff.add(1).log10().add(1).log10().add(1).log10()):E(1)
                return x
            },
            ceffDesc(x) { return formatReduction(x)+" weaker" },
        },
        {
            desc: `Stronger’s Power softcap starts 3x later, is 10% weaker.`,
            cost: E('e7.5e15'),
            cdesc: `Stronger Overflow is weaker.`,
            ccost: E('ee1.9e16'),
        },
        {
            desc: `Tickspeed’s Power softcap starts ^2 later, scales 50% weaker.`,
            cost: E('e2e16'),
            cdesc: `Accelerator effect softcap^2 starts 2x later.`,
            ccost: E('ee2.5e16'),
        },
        {
            desc: `Carbon-6’s effect is overpowered, but Sodium-11 don’t work.`,
            cost: E('e150'),
            cdesc: `Square Carbon-6’s charged effect.`,
            ccost: E('ee3.7e16'),
        },
        {
            desc: `All scaling from Tickspeed start 100x later (after nerf from 8th QC modifier).`,
            cost: E('e500'),
            cdesc: `Meta-Tickspeeds starts ^2 later.`,
            ccost: E('ee5e16'),
        },
        {
            desc: `Mass of Black Hole effect raises itself at a reduced logarithm rate.`,
            cost: E('e1100'),
            effect() {
                let x = player.bh.mass.add(1).log10().add(1).log10().mul(1.25).add(1).pow(player.qu.rip.active?2:0.4)
                return x
            },
            effDesc(x) { return "^"+x.format() },
            cdesc: `The 2nd Black Hole Overflow effect is weaker.`,
            ccost: E('ee7.7777e16'),
        },
        {
            desc: `Death Shard is boosted by Dilated Mass.`,
            cost: E('e1300'),
            effect() {
				if(hasChargedElement(90))return ELEMENTS.upgs[90].ceffect();
                let x = player.md.mass.add(1).log10().add(1).pow(0.5)
				if(player.ranks.hex.gte(90))x = x.pow(1.1);
                return x.min('ee15');
            },
            effDesc(x) { if(hasChargedElement(90))return "^"+format(x);return format(x)+"x"+(x.gte('ee15')?" <span class='soft'>(hardcapped)</span>":"") },
            cdesc: `This element is better.`,
            ccost: E('ee1.35e17'),
            ceffect() {
				if(hasChargedElement(90))return player.md.mass.add(1).log10().add(1).log10().add(1).log10().add(1).log10().add(1);
				return E(1);
            },
        },
        {
            desc: `Entropic Accelerator & Booster nerfing is 10% weaker.`,
            cost: E('e2700'),
            cdesc: `Boost Entropic Condenser.`,
            ccost: E('ee1.6e17'),
        },
        {
            desc: `Insane Challenges scale 25% weaker.`,
            cost: E('e4800'),
            cdesc: `Impossible Challenges scale 5% weaker`,
            ccost: E('ee1.6e17'),
        },
        {
            desc: `Entropy gain is increased by 66.7% for every OoM^2 of normal mass.`,
            cost: E('e29500'),
            effect() {
                let x = E(player.ranks.hex.gte(93)?2:(5/3)).pow(player.mass.add(1).log10().add(1).log10())
				x = overflow(x,"e1e4",hasChargedElement(93)?0.3:hasElement(296)?0.2:0.1);
                return x
            },
            effDesc(x) { return "x"+x.format()+(x.gte('e1e4')?" <span class='soft'>(softcapped)</span>":"")  },
            cdesc: `Softcap of this element is weaker.`,
            ccost: E('ee1.8e17'),
        },
        {
            desc: `Death Shard is increased by 10% for every supernova.`,
            cost: E("e32000"),
            effect() {
                let x = E(hasChargedElement(94)?1.2:1.1).pow(player.supernova.times)
                return x
            },
            effDesc(x) { return "x"+x.format() },
            cdesc: `The base of this element is 1.2, instead of 1.1.`,
            ccost: E('ee1.9e17'),
        },
        {
            desc: `Epsilon Particles are worked in Big Rip, but 90% weaker.`,
            cost: E("e34500"),
            cdesc: `Multiply Epsilon Particles effects by 10. Epsilon Particle's effect is better if you're not in QC.`,
            ccost: E('ee2e17'),
        },
        {
            desc: `Entropic Converter nerfing is 10% weaker.`,
            cost: E('e202000'),
            cdesc: `Entropic Evaporation^2 is 10% weaker.`,
            ccost: E('ee3e17'),
        },
        {
            desc: `Increase Entropic Evaporation’s base by 1.`,
            cost: E('e8.5e6'),
            cdesc: `Increase Entropic Evaporation’s base by 1.`,
            ccost: E('ee4.2e17'),
        },
        {
            desc: `8th QC modifier in Big Rip is 20% weaker.`,
            cost: E('e1.2e7'),
            cdesc: `This element is applied outside of Big Rips.`,
            ccost: E('ee7e17'),
        },
        {
            desc: `Remove softcap^3 from Photon Upgrade 3 effect, its softcap^2 is weaker.`,
            cost: E('e2.15e7'),
            cdesc: `Photon Upgrades are better.`,
            ccost: E('ee7.5e17'),
        },
        {
            desc: `Prestige Base’s exponent is increased based on Pent.`,
            cost: E('e2.5e7'),
            effect() {
				if(hasChargedElement(100)){
					return player.ranks.pent.add(1).log10().add(1).log10().add(1).log10().mul(10000);
				}
				if(player.ranks.pent.gte("ee10")){
					return player.ranks.pent.log10().log10().log10().mul(2605);
				}
				if(player.ranks.pent.gte("1e2000")){
					return player.ranks.pent.add(1).log10().add(1).log10().mul(260.5);
				}
                let x = player.ranks.pent.root(2).div(1e3).softcap(5.5,0.1,0);
				if(player.ranks.pent.gte(1e11))x = x.min(player.ranks.pent.log10().pow(8/9));
                return x
            },
            effDesc(x) { return "+^"+format(x) },
            cdesc: `This Element is better.`,
            ccost: E('ee8e17'),
        },
        {
            desc: `Blueprint Particles effect is overpowered.`,
            cost: E('e3.5e7'),
            cdesc: `This Element is better.`,
            ccost: E('ee1e18'),
        },
        {
            desc: `Tickspeed Power’s softcap starts ^100 later.`,
            cost: E('e111111111'),
            cdesc: `Accelerator Effect softcap starts 100x later.`,
            ccost: E('ee2.2222e18'),
        },
        {
            desc: `Pre-Quantum Global Speed is effective based on Honor.`,
            cost: E('e5e8'),
            effect() {
				if(hasChargedElement(103))return ELEMENTS.upgs[103].ceffect();
                let x = E(player.ranks.hex.gte(103)?2.1:2).pow(player.prestiges[1])
				if(hasPrestige(1,23))x = x.pow(prestigeEff(1,23))
                return x
            },
            effDesc(x) { if(hasChargedElement(103))return "^"+format(x);return format(x)+"x" },
            cdesc: `This element is better. Also, permanently add ee10 Blueprint Particles to their effect.`,
            ccost: E('ee4e18'),
            ceffect() {
				if(hasChargedElement(103))return player.prestiges[1].add(1).log10().add(1).log10().add(1).pow(0.1).pow(hasPrestige(1,23)?prestigeEff(1,23):1);
				return E(1);
            },
        },
        {
            desc: `Add 200 more C9-12 maximum completions.`,
            cost: E('e1.2e9'),
            cdesc: `C9-12 effect is better.`,
            ccost: E('ee1.5e19'),
        },
        {
            desc: `Each Particle Power’s 1st effect is exponentially overpowered.`,
            cost: E('e2.2e9'),
            cdesc: `This element is better.`,
            ccost: E('ee5e19'),
        },
        {
            desc: `Entropic Evaporation^2 and Condenser^2 scale 15% weaker.`,
            cost: E('e7.25e9'),
            cdesc: `Entropic Evaporation^2 scale 15% weaker.`,
            ccost: E('ee6.8888e19'),
        },
        {
            desc: `Beta Particles are twice effective.`,
            cost: E('e1.45e10'),
            cdesc: `Beta Particles are better.`,
            ccost: E('ee6.9e19'),
        },
        {
            desc: `All scalings from Ranks to Pent scale 10% weaker (only 2% during Big Rip).`,
            cost: E('e1.6e10'),
            cdesc: `All scalings from Hex to Oct scale 10% weaker.`,
            ccost: E('ee1e20'),
        },
        {
            desc: `Entropic Multiplier is effective, even in Big Rip.`,
            cost: E('e3e10'),
            cdesc: `Entropic Multiplier boost Entropy gain.`,
            ccost: E('ee1.3e20'),
            ceffect() {
				return E(1.2).pow(player.qu.en.rewards[0]);
            },
            ceffDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass gain softcap^4 is 50% weaker (only 20% in Big Rip).`,
            cost: E('e6e10'),
            cdesc: `Stronger Overflow is weaker`,
            ccost: E('ee1.6666e20'),
        },
        {
            desc: `Neutron Stars raise Atom gain.`,
            cost: E('e7.5e10'),
            effect() {
                let x = player.supernova.stars.add(1).log10().add(1).log10().add(1).root(3)
				if(hasChargedElement(111))x = x.pow(3);
                return x
            },
            effDesc(x) { return "^"+format(x) },
            cdesc: `This element is better.`,
            ccost: E('ee2e20'),
        },
        {
            desc: `[sn4] effect is increased by 2.`,
            cost: E('e3e12'),
            cdesc: `[sn4] effect is better.`,
            ccost: E('ee4e20'),
        },
        {
            desc: `[bs2] uses a better formula.`,
            cost: E('e4e12'),
            cdesc: `This element is better.`,
            ccost: E('ee4.4444e20'),
        },
        {
            desc: `Entropic Multiplier uses a better formula.`,
            cost: E('e1.2e13'),
            cdesc: `Entropic Multiplier boost Entropy gain.`,
            ccost: E('ee5e20'),
            ceffect() {
				return E(1.2).pow(player.qu.en.rewards[0]);
            },
            ceffDesc(x) { return format(x)+"x" },
        },
        {
            desc: `Mass Dilation upgrades are 5% stronger.`,
            cost: E("e7e13"),
            cdesc: `Mass Dilation upgrades are 5% stronger.`,
            ccost: E('ee1e21'),
        },
        {
            desc: `Prestige Base boosts Relativistic Energy gain.`,
            cost: E('e1e14'),
            effect() {
				if(hasChargedElement(116))return ELEMENTS.upgs[116].ceffect();
                let x = (tmp.prestiges.base||E(1)).add(1).root(3)
				if(player.ranks.hex.gte(116))x = x.pow(3)
                return x.min("e2e30")
            },
            effDesc(x) { if(hasChargedElement(116))return "^"+format(x);return format(x)+"x"+(x.gte('e2e30')?" <span class='soft'>(hardcapped)</span>":"") },
            cdesc: `This element is better.`,
            ccost: E('ee1.5e21'),
            ceffect() {
				if(hasChargedElement(116))return (tmp.prestiges.base||E(1)).add(10).log10().pow(0.5);
				return E(1);
            },
        },
        {
            desc: `Mass gain after all softcaps is raised by 10.`,
            cost: E("e5e16"),
            cdesc: `Mass gain exponent ^1.01`,
            ccost: E('ee2.75e21'),
        },
        {
            desc: `Unlock more Neutron Tree Upgrades. <span id="final_118" style="display:none;"></span>`,
            cost: E("e1.7e17"),
            cdesc: `Reach the current endgame.`,
            ccost: E("ee5.8e21"),
        },
		
		// extended element
		
		{
			desc: `Infinity Mass Boost Timeshards.`,
			cost: E("5e13"),
			effect() {
				let x = player.inf.points.add(10).log10();
				if(player.ranks.hex.gte(119))x = x.pow(2)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Each bought element after Oganesson multiplies your Infinity mass gain and Infnity times gain by 2.`,
			cost: E("5e13"),
			effect() {
				if(hasElement(256))return E(2).pow(player.atom.elements.length);
				let x = E(1)
				for(var i = 0;i < player.atom.elements.length;i++)if(player.atom.elements[i]>118)x = x.mul(2);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Infinity Mass Boost Eternity Mass gain.`,
			cost: E("1e15"),
			effect() {
				let x = player.inf.points.add(10).log10();
				if(hasElement(142))x = x.pow(2)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Multiply Shard Generators Power by 1.5`,
			cost: E("1e15"),
		},
		{
			desc: `Multiply Infinity times and Eternal Mass gain by Eternity times.`,
			cost: E("5e4"),
			et: true,
			effect() {
				let x = player.et.times.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Multiply Infinity Mass gain by Eternity times.`,
			cost: E("1e6"),
			et: true,
			effect() {
				let x = player.et.times.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Multiply Entropy gain by Infinity times.`,
			cost: E("1.6190000001e20"),
			effect() {
				let x = player.inf.times.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `All Fermion Tiers are Uncapped.`,
			cost: E("1.6190000001e23"),
		},
		{
			desc: `The 120th element boost Eternal mass at a reduced rate.`,
			cost: E("2e7"),
			et: true,
			effect() {
				let x = (tmp.elements.effect[120]||E(1)).pow(0.4);
				if(hasElement(131))x = x.pow(1.5);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Eternal mass boost Infinity mass gain.`,
			cost: E("2e8"),
			et: true,
			effect() {
				let x = player.et.points.add(1).log10().add(1);
				if(hasElement(140))x = player.et.points.add(1).pow(0.2);
				if(hasElement(147))x = x.pow(1.2);
				if(hasElement(157))x = x.pow(1.2);
				if(hasElement(221))x = x.pow(1.63);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `QC Modifier 'Hypertiered' is 50% weaker in Big Rips.`,
			cost: E("5.9720000001e27"),
		},
		{
			desc: `'90%' in Neutron Tree Upgrade [br3] is now 80%.`,
			cost: E("5.9720000001e27").mul(200),
		},
		{
			desc: `You can autobuy Cosmic Strings, and the 127th Element is better.`,
			cost: E("1e14"),
			et: true,
		},
		{
			desc: `If you bought [prim8], levels of Epsilon/Theta/Beta Particles is 1 per 2 Primordium Theorem, instead of 2.5.`,
			cost: E("1e15"),
			et: true,
		},
		{
			desc: `Uncap C12 completions.`,
			cost: E("1.9890000001e33"),
		},
		{
			desc: `Unlock Accelerators, tickspeed now provides exponential boost, but Argon-18 is disabled.`,
			cost: E("1.9890000001e33").mul(200),
		},
		{
			desc: `Accelerators boost itself.`,
			cost: E("1e18"),
			et: true,
			effect() {
				let x = player.accelerator.div(1000).add(1);
				return x
			},
			effDesc(x) { return format(x)+"x to power" },
		},
		{
			desc: `Accelerators boost Pre-Quantum Global Speed.`,
			cost: E("1e19"),
			et: true,
			effect() {
				let x = player.accelerator.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Accelerator Effect boost Tickspeed Power.`,
			cost: E("1.9890000001e37"),
		},
		{
			desc: `Entropic Condenser^2 is 15% weaker.`,
			cost: E("1.9890000001e37"),
		},
		{
			desc: `Multiply Entropy gain by Eternity times.`,
			cost: E("1.6190000001e20"),
			et: true,
			effect() {
				let x = player.et.times.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `The Formula of Element 128 is better.`,
			cost: E("1.6190000001e21"),
			et: true,
		},
		{
			desc: `Entropic Radiation^2 is 20% weaker.`,
			cost: E("2.98350000001e45"),
		},
		{
			desc: `Element 121 is squared.`,
			cost: E("2.98350000001e45"),
		},
		{
			desc: `QC Modifier 'Intense Catalyst' is 5% weaker.`,
			cost: E("1.6190000001e26"),
			et: true,
		},
		{
			desc: `Entropic Condenser^2 is 15% weaker.`,
			cost: E("1.6190000001e27"),
			et: true,
		},
		{
			desc: `Gain 10x more Prestige Mass.`,
			cost: E("2.98350000001e53"),
		},
		{
			desc: `Entropy Post-1.8e308 added to base Infinity Mass gain formula.`,
			cost: uni(1),
		},
		{
			desc: `Element 128's effect ^1.2.`,
			cost: E("5.9720000001e30"),
			et: true,
		},
		{
			desc: `Timeshard effect is slightly stronger.`,
			cost: E("5.9720000001e31"),
			et: true,
		},
		{
			desc: `Super Hex is 5% weaker.`,
			cost: uni(1e5),
		},
		{
			desc: `The Hept requirement is reduced.`,
			cost: uni(1e7),
		},
		{
			desc: `Entropic Condenser^2 is 15% weaker.`,
			cost: E("1.9890000001e34"),
			et: true,
		},
		{
			desc: `If you bought [prim8], levels of Epsilon/Theta/Beta Particles is 1 per 1.5 Primordium Theorem, instead of 2.`,
			cost: E("1.9890000001e34"),
			et: true,
		},
		{
			desc: `The first softcap of Prestige Mass effect is weaker.`,
			cost: E("1.9890000001e36"),
			et: true,
		},
		{
			desc: `QC Modifier 'Intense Catalyst' is 5% weaker.`,
			cost: E("1.9890000001e40"),
			et: true,
		},
		{
			desc: `Unlock the 13th Challenge.`,
			cost: uni(1e18),
		},
		{
			desc: `Effects of Protons Powers is better.`,
			cost: uni(1e21),
		},
		{
			desc: `Element 128's effect ^1.2.`,
			cost: E("1.9890000001e41").mul(3),
			et: true,
		},
		{
			desc: `Disable dilated mass gain softcap, and Dilated Overflow is weaker.`,
			cost: E("1.9890000001e41").mul(3),
			et: true,
		},
		{
			desc: `Unlock the 14th Challenge.`,
			cost: uni(1e27),
		},
		{
			desc: `Base Dilated Mass effect ^6.`,
			cost: uni(1e29),
		},
		{
			desc: `Eternal Mass boost Timeshards.`,
			cost: E("1.989e44"),
			et: true,
			effect() {
				let x = player.et.points.add(1).pow(0.2);
				if(hasElement(271))x = x.pow(20)
				if(hasElement(349))x = x.pow(3)
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `First Rank Collapse effect is weaker.`,
			cost: E("2.98350000001e45"),
			et: true,
		},
		{
			desc: `Prestige Base Post-1.8e308 added to base Infinity Mass gain formula.`,
			cost: uni(6e35),
		},
		{
			desc: `Unlock the 15th Challenge.`,
			cost: uni(5e39),
		},
		{
            desc: `Entropic Evaporation^2 is 5% weaker.`,
			cost: E("2.9835e49"),
			et: true,
		},
		{
            desc: `If you bought [prim8], levels of Epsilon/Theta/Beta Particles is 1 per 1 Primordium Theorem, instead of 1.5.`,
			cost: uni(1),
			et: true,
		},
		{
			desc: `Entropic Condenser^2 is 15% weaker.`,
			cost: uni(1e61),
		},
		{
			desc: `Unlock the 16th Challenge.`,
			cost: uni(1e100),
		},
		{
            desc: `First Rank Collapse effect is weaker.`,
			cost: uni(1e21),
			et: true,
		},
		{
            desc: `C5 effect is changed. C15 goal is heavily weaken.`,
			cost: uni(1e22),
			et: true,
		},
		{
            desc: `Second Rank Collapse effect is weaker.`,
			cost: uni(1e23),
			et: true,
		},
		{
            desc: `QC Modifier 'Intense Catalyst' is 6% weaker.`,
			cost: uni(1e26),
			et: true,
		},
		{
            desc: `Booster boost its effect.`,
			cost: uni(1e147),
			effect() {
				let x = (player.massUpg[2]||E(0)).add(10).log10().pow(0.6);
				if(hasElement(244))x = expMult((player.massUpg[2]||E(1)),0.4);
				if(hasElement(283))x = overflow(expMult((player.massUpg[2]||E(1)),0.875),"e3500000",0.5);
				if(hasElement(328))x = expMult((player.massUpg[2]||E(1)),0.875);
				if(hasElement(360))x = expMult((player.massUpg[2]||E(1)),0.886);
				if(hasElement(367))x = expMult((player.massUpg[1]||E(1)),0.9);
				if(hasElement(459))x = expMult((player.massUpg[1]||E(1)),0.95);
				return x
			},
			effDesc(x) { return "^"+format(x) },
		},
		{
            desc: `Muscler boost its effect.`,
			cost: uni(1e150),
			effect() {
				let x = (player.massUpg[1]||E(0)).add(10).log10().pow(0.6);
				if(hasElement(244))x = expMult((player.massUpg[1]||E(1)),0.4);
				if(hasElement(283))x = overflow(expMult((player.massUpg[1]||E(1)),0.875),"e3500000",0.5);
				if(hasElement(328))x = expMult((player.massUpg[1]||E(1)),0.875);
				if(hasElement(360))x = expMult((player.massUpg[1]||E(1)),0.886);
				if(hasElement(367))x = expMult((player.massUpg[1]||E(1)),0.9);
				if(hasElement(459))x = expMult((player.massUpg[1]||E(1)),0.95);
				return x
			},
			effDesc(x) { return "^"+format(x) },
		},
		{
            desc: `Add 100 C13 & C15 completions.`,
			cost: uni(1e27),
			et: true,
		},
		{
            desc: `Second Rank Collapse effect is weaker.`,
			cost: uni(1e27),
			et: true,
		},
		{
            desc: `Entropic Condenser^2 is 15% weaker.`,
			cost: E(1.5e217),
		},
		{
            desc: `Permanently remove Pre-Meta Tier scaling.`,
			cost: E(1.5e221),
		},
		{
			desc: `'80%' in Neutron Tree Upgrade [br3] is now 70%.`,
			cost: uni(1e32),
			et: true,
		},
		{
			desc: `If you're not in Big Rip, Green Chroma's effect ^1.5`,
			cost: uni(1e36),
			et: true,
		},
		{
			desc: `Third Rank Collapse effect is weaker.`,
			cost: uni(1e203),
		},
		{
			desc: `Add 100 C13 & C16 completions.`,
			cost: E(9e284),
		},
		{
			desc: `Remove the first Rank Collapse effect.`,
			cost: uni(1e45),
			et: true,
		},
		{
			desc: `Remove the second Rank Collapse effect.`,
			cost: uni(1e48),
			et: true,
		},
		{
			desc: `Post-20 QC Modifier 'Intense Catalyst' effect scaling is weaker.`,
			cost: E(1.5e294),
		},
		{
			desc: `Add 300 C13 & C15 completions.`,
			cost: E(6e299),
		},
		{
			desc: `Remove Super Cosmic Strings scaling.`,
			cost: uni(1e49),
			et: true,
		},
		{
			desc: `Break Dilation Upgrade 5 affects Meta-Tier scaling.`,
			cost: uni(5e51),
			et: true,
		},
		{
			desc(){return `Meta-Infinity Confirmed! Infinity mass is added to its base gain formula. Cost of this element is ${format(E(2).pow(1024))} grams of Infinity mass.`},
			cost: E(2).pow(1024),
		},
		{
			desc: `Add 200 C13 & C16 completions.`,
			cost: E("6e310"),
		},
		{
			desc: `Remove Rank Collapse.`,
			cost: uni(1e54),
			et: true,
		},
		{
			desc: `Unlock the 17th Challenge.`,
			cost: uni(1e61),
			et: true,
		},
		{
			desc: `Remove 3 softcaps from Radiation Booster 'Meta-Rank Boost'`,
			cost: uni(1e301),
		},
		{
			desc: `Add 200 C13 completions.`,
			cost: E("3e393"),
		},
		{
			desc: `Gain 100% of Eternal Mass gain per second. Gain 1 Eternity count per second.`,
			cost: uni(1e71),
			et: true,
		},
		{
			desc: `Dilated Overflow is weaker.`,
			cost: uni(1e75),
			et: true,
		},
		{
			desc: `Entropic Condenser^2 is 15% weaker.`,
			cost: E("1.5e461"),
		},
		{
			desc: `Entropic Evaporation^2 is 10% weaker.`,
			cost: E("1e500"),
		},
		{
			desc: `C5 effect is changed.`,
			cost: E("3e144"),
			et: true,
		},
		{
			desc: `Epsilon Particles's 2nd effect is better if you're not in Big Rips or Quantum Challenges.`,
			cost: E("3e152"),
			et: true,
		},
		{
			desc: `Entropic Radiation^2 is 25% weaker.`,
			cost: E("1.5e523"),
		},
		{
			desc: `Remove Meta-Rank scaling. Radiation Booster 'Meta-Rank Boost' affects Meta-Tier at a reduced rate.`,
			cost: E("1.5e527"),
			effect() {
				let x = tmp.radiation.bs.eff[14].add(1).log10();
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `'70%' in Neutron Tree Upgrade [br3] is now 60%.`,
			cost: E("1.5e634"),
		},
		{
			desc: `Add 1000 C13 completions.`,
			cost: E("1.5e674"),
		},
		{
			desc: `Unlock the 18th Challenge.`,
			cost: uni(2e123),
			et: true,
		},
		{
			desc: `Add 100 C14 & C16 completions.`,
			cost: E("7.5e193"),
			et: true,
		},
		{
			desc: `Remove a softcap from Radiation Booster 'Meta-Rank Boost'.`,
			cost: E("6e832"),
		},
		{
			desc: `Entropic Radiation^2 is 50% weaker.`,
			cost: E("6e852"),
		},
		{
			desc: `Unlock the 19th Challenge.`,
			cost: uni(1e158),
			et: true,
		},
		{
			desc: `Add 100 C14 & C17 completions.`,
			cost: E("9e224"),
			et: true,
		},
		{
			desc: `Raise Infinity Upgrade 3 by 1.2`,
			cost: E("1.5e955"),
		},
		{
			desc: `Multiply Honor 9 Effect by 2`,
			cost: E("1.5e1099"),
		},
		{
			desc: `Unlock the 20th Challenge.`,
			cost: uni(1e197),
			et: true,
		},
		{
			desc: `Add 200 C15 & C16 completions.`,
			cost: uni(2e198),
			et: true,
		},
		{
			desc: `Multiply Honor 9 Effect by 2`,
			cost: E("1.5e1145"),
		},
		{
			desc: `Eternity Times boost Quantum Times gain.`,
			cost: E("1.5e1157"),
			effect() {
				let x = player.et.times.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Eternal Mass boost Eternity Times gain.`,
			cost: uni(1e206),
			et: true,
			effect() {
				let x = player.et.points.add(1).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Unlock Supernova Galaxies.`,
			cost: uni(1e210),
			et: true,
		},
		
		// extended element II
		
		
		{
			desc: `[sn6] is better.`,
			cost: E(1e6),
			galQk: true,
		},
		{
			desc: `Autobuy Shard Generators.`,
			cost: E("1.5e516"),
			et: true,
		},
		{
			desc: `Raise Element 128's effect by 1.63`,
			cost: E("1.5e2976"),
		},
		{
			desc: `Uncap C13 completions.`,
			cost: E(1e7),
			galQk: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e533"),
			et: true,
		},
		{
			desc: `Remove a softcap from Radiation Booster 'Meta-Rank Boost'.`,
			cost: E("1.5e3306"),
		},
		{
			desc: `The effect softcap of Galactic Power is weaker.`,
			cost: E(2.5e7),
			galQk: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e560"),
			et: true,
		},
		{
			desc: `Add 300 C17 completions.`,
			cost: E("1.5e3656"),
		},
		{
			desc: `The effect softcap of Galactic Power is weaker.`,
			cost: E(1e8),
			galQk: true,
		},
		{
			desc: `Raise C20 effect by 3`,
			cost: E("1.5e606"),
			et: true,
		},
		{
			desc: `C5 effect is changed.`,
			cost: E("1.5e3806"),
		},
		{
			desc: `Galactic Quarks boost Quark gain.`,
			cost: E(5e8),
			galQk: true,
			effect() {
				let x = player.galQk.add(1);
				if(hasElement(264))x = expMult(x,2);
				if(hasElement(278))x = expMult(x,1.3);
				if(hasElement(364))x = expMult(x,2.5/1.3);
				return x
			},
			effDesc(x) { return "^"+format(x); },
		},
		{
			desc: `Meta-Tetr scaling starts later based on Tier.`,
			cost: E("1.5e611"),
			et: true,
			effect() {
				let x = player.ranks.tier.add(10).log10().sqrt();
				if(hasElement(276))x = expMult(player.ranks.tier,0.55);
				if(hasElement(311))x = expMult(player.ranks.tier,0.6);
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `C18 effect is stronger.`,
			cost: E("1.5e3816"),
		},
		{
			desc: `Effect of Galactic Atoms is better.`,
			cost: E(2.5e9),
			galQk: true,
		},
		{
			desc: `Add 300 C19 completions.`,
			cost: E("1.5e648"),
			et: true,
		},
		{
			desc: `Add 300 C18 completions.`,
			cost: E("1.5e4856"),
		},
		{
			desc: `Unlock Galactic Fermions in the Supernova tab.`,
			cost: E(6e9),
			galQk: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e671"),
			et: true,
		},
		{
			desc: `Remove Meta-Tier scaling. Radiation Booster 'Meta-Rank Boost' affects Meta-Tetr at a reduced rate.`,
			cost: E("1.5e5256"),
			effect() {
				let x = tmp.radiation.bs.eff[14].add(1).log10().add(1).log10();
				if(hasElement(276))x = tmp.radiation.bs.eff[14].add(1).log10().pow(0.2);
				if(hasElement(295))x = tmp.radiation.bs.eff[14].add(1).log10().pow(0.5);
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `The effect of Supernova Galaxy's Rage Power boost is better.`,
			cost: E(3e10),
			galQk: true,
		},
		{
			desc: `First Black Hole Overflow effect is weaker.`,
			cost: E("1.5e704"),
			et: true,
		},
		{
			desc: `Meta-Tetr starts 10x later.`,
			cost: E("1.5e5656"),
		},
		{
			desc: `The 120th element boost Eternities at a reduced rate.`,
			cost: E("1.5e706"),
			et: true,
			effect() {
				let x = (tmp.elements.effect[120]||E(1)).pow(0.1);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Elements 173-174 are better.`,
			cost: E("1.5e5796"),
		},
		{
			desc: `Unlock 2 new types of Galactic Fermions.`,
			cost: E(1e11),
			galQk: true,
		},
		{
			desc: `Multiply all bosons base gain by 100`,
			cost: E("1.5e721"),
			et: true,
		},
		{
			desc: `Add 400 C14 completions.`,
			cost: E("1.5e6226"),
		},
		{
			desc: `The effect softcap of Galactic Power is weaker.`,
			cost: E(1e12),
			galQk: true,
		},
		{
			desc: `Add 100 C18-C19 max completions.`,
			cost: E("1.5e756"),
			et: true,
		},
		{
			desc: `Blue Chroma's effect is better.`,
			cost: E("1.5e6956"),
		},
		{
			desc: `You can assign Galactic Quarks. (In Atom Tab)`,
			cost: E(1e13),
			galQk: true,
		},
		{
			desc: `Add 250 C17-C19 max completions.`,
			cost: E("9e779"),
			et: true,
		},
		{
			desc: `Accelerator effect softcap is weaker.`,
			cost: E("1.5e7256"),
		},
		{
			desc: `The effect of Supernova Galaxy's Entropy boost is better.`,
			cost: E(5e13),
			galQk: true,
		},
		{
			desc: `Gain more Prestige Mass based on your bought Elements.`,
			cost: E("1.5e786"),
			et: true,
			effect() {
				let x = E(1.02).pow(player.atom.elements.length);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `The 120th element now count all bought elements.`,
			cost: E("1.5e7606"),
		},
		{
			desc: `The effect softcap of Galactic Power is weaker.`,
			cost: E(1e24),
			galQk: true,
		},
		{
			desc: `Add 250 C17-C19 max completions.`,
			cost: E("1.5e821"),
			et: true,
		},
		{
			desc: `Prestige Mass effect affects Hyper Glory and Meta Fermion Tier scalings.`,
			cost: E("1.5e7806"),
		},
		{
			desc: `Galactic Quarks gain is better.`,
			cost: E(2e24),
			galQk: true,
		},
		{
			desc: `Unlock 2 new types of Galactic Fermions.`,
			cost: E(2e29),
			galQk: true,
		},
		{
			desc: `First Black Hole Overflow effect is weaker.`,
			cost: E("1.5e824"),
			et: true,
		},
		{
			desc: `'60%' in Neutron Tree Upgrade [br3] is now 50%.`,
			cost: E("1.5e8006"),
		},
		{
			desc: `Element 231 is better.`,
			cost: E(4e30),
			galQk: true,
		},
		{
			desc: `C5 effect is changed.`,
			cost: E("1.5e834"),
			et: true,
		},
		{
			desc: `Entropic Condenser^2 and Entropic Radiation^2 are 90% weaker.`,
			cost: E("1.5e8116"),
		},
		{
			desc: `Unlock Galactic Challenges.`,
			cost: E(1e31),
			galQk: true,
		},
		{
			desc: `Enthalpy gain is better.`,
			cost: E("1.5e839"),
			et: true,
		},
		{
			desc: `The softcap of Entropic Accelerator is weaker.`,
			cost: E("1.5e8326"),
		},
		{
			desc: `Effect of Galactic Bosons is better.`,
			cost: E(2e31),
			galQk: true,
		},
		{
			desc: `Element 161 is better.`,
			cost: E("1.5e842"),
			et: true,
		},
		{
			desc: `Meta-Pent starts later based on Tetr.`,
			cost: E("1.5e8526"),
			effect() {
				let x = player.ranks.tetr.add(10).log10().sqrt();
				if(hasElement(301))x = x.pow(2);
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `Reduce Galactic Fermion Requirements.`,
			cost: E(5e31),
			galQk: true,
		},
		{
			desc: `Green Chroma's softcap is weaker.`,
			cost: E("1.5e854"),
			et: true,
		},
		{
			desc: `Unlock 2 new types of Galactic Fermions.`,
			cost: E(5e32),
			galQk: true,
		},
		{
			desc: `Elements 232 and 239 are better.`,
			cost: E("1.5e856"),
			et: true,
		},
		{
			desc: `Add 100 C20 completions. C20 effect is better.`,
			cost: E("1.5e8856"),
		},
		{
			desc: `Element 231 is better.`,
			cost: E("1.5e33"),
			galQk: true,
		},
		{
			desc: `Dark Matter Upgrade 19 is better.`,
			cost: E("1.5e886"),
			et: true,
		},
		{
			desc: `Add 500 C17-C19 completions.`,
			cost: E("1.5e9356"),
		},
		{
			desc: `Galactic Shards Effect affects Galactic Dark Energy.`,
			cost: E("1e34"),
			galQk: true,
		},
		{
			desc: `Plutonium-94 is always active at 100% efficiency.`,
			cost: E("1.5e900"),
			et: true,
		},
		{
			desc: `Elements 173 and 174 are better.`,
			cost: E("1.5e9836"),
		},
		{
			desc: `Unlock 2 new types of Galactic Fermions.`,
			cost: E("1e35"),
			galQk: true,
		},
		{
			desc: `Meta-Prestige Level starts 3.5x later.`,
			cost: E("1.5e926"),
			et: true,
		},
		{
			desc: `Auto-Complete Challenge 13.`,
			cost: E("1.5e10056"),
		},
		{
			desc: `Galactic Shards Effect affects Galactic Atoms.`,
			cost: E("1e36"),
			galQk: true,
		},
		{
			desc: `Photon & Gluon Upgrade 3 are better.`,
			cost: E("1.5e1006"),
			et: true,
		},
		{
			desc: `Uncap C14-15 max completions.`,
			cost: E("1.5e10656"),
		},
		{
			desc: `Unlock a Galactic Challenge Option.`,
			cost: E("1e38"),
			galQk: true,
		},
		{
			desc: `Break the maximum Supernova Limit, and reduce Supernova Galaxy requirement.`,
			cost: E("5e39"),
			galQk: true,
		},
		{
			desc: `Remove a softcap of Stronger.`,
			cost: E("1.5e11936"),
		},
		{
			desc: `Ultra Glory starts 2 later.`,
			cost: E("1.5e1031"),
			et: true,
		},
		{
			desc: `Unlock 2 new types of Galactic Fermions.`,
			cost: E("1e41"),
			galQk: true,
		},
		{
			desc: `Element 239 is better.`,
			cost: E("1.5e12366"),
		},
		{
			desc: `Neptunium-93's softcap is weaker.`,
			cost: E("1.5e1056"),
			et: true,
		},
		{
			desc: `Unlock a Galactic Challenge Option.`,
			cost: E("5e42"),
			galQk: true,
		},
		{
			desc: `Green Chroma affects Pent at a reduced rate.`,
			cost: E("1.5e12546"),
			effect() {
				let x = (tmp.qu.chroma_eff[1]||E(0)).add(10).log10().sqrt();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Green Chroma's softcap is weaker.`,
			cost: E("1.5e1066"),
			et: true,
		},
		{
			desc: `Reduce Galactic Challenge Goals.`,
			cost: E("1e44"),
			galQk: true,
		},
		{
			desc: `Element 272 is better.`,
			cost: E("1.5e12746"),
		},
		{
			desc: `Auto-Complete Challenges 14-15, and uncap C16 completions.`,
			cost: E("1.5e1071"),
			et: true,
		},
		{
			desc: `Super Galactic Fermion Tier starts 1.5x later.`,
			cost: E("5e44"),
			galQk: true,
		},
		{
			desc: `Eternal Mass is added to base Infinity Mass gain formula.`,
			cost: E("1.5e13676"),
		},
		{
			desc: `Stronger Overflow is weaker.`,
			cost: E("1.5e1126"),
			et: true,
		},
		{
			desc: `Galactic Quarks boost Prestige Mass gain.`,
			cost: E("1e47"),
			galQk: true,
			effect() {
				let x = player.galQk.add(1);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Green Chroma's softcap is weaker.`,
			cost: E("1.5e15036"),
		},
		{
			desc: `Uncap C17 completions. Infinity Upgrade 3 is unsoftcapped.`,
			cost: E("1.5e1186"),
			et: true,
		},
		{
			desc: `Super Galactic Fermion Tier starts 1.5x later.`,
			cost: E("5e49"),
			galQk: true,
		},
		{
			desc: `Blue Chroma's softcap is weaker. Unsoftcap C3,C4,C8 effects.`,
			cost: E("1.5e15381"),
		},
		{
			desc: `Element 232 is better.`,
			cost: E("1.5e1196"),
			et: true,
		},
		{
			desc: `Passively gain 100% of each galactic particle you would assign galactic quarks.`,
			cost: E("3e50"),
			galQk: true,
		},
		{
			desc: `Big Rip Upgrade 20 is better.`,
			cost: E("1.5e15756"),
		},
		{
			desc: `Element 232 is better.`,
			cost: E("1.5e1256"),
			et: true,
		},
		{
			desc: `Stronger Overflow is weaker.`,
			cost: E("1.5e17056"),
		},
		{
			desc: `Uncap C18-19 completions.`,
			cost: E("1.5e1306"),
			et: true,
		},
		{
			desc: `Galactic Shards Effect affects base Galactic Bosons gain.`,
			cost: E("2e55"),
			galQk: true,
		},
		{
			desc: `Auto-Complete C16-18.`,
			cost: E("1.5e21056"),
		},
		{
			desc: `Remove Green Chroma's softcap.`,
			cost: E("1.5e1406"),
			et: true,
		},
		{
			desc: `[G-Tau]'s effect is raised by 1.75.`,
			cost: E("5e61"),
			galQk: true,
		},
		{
			desc: `Infinity Upgrade 2 is raised by 5.`,
			cost: E("1.5e24506"),
		},
		{
			desc: `Auto-Complete C19.`,
			cost: E("1.5e1506"),
			et: true,
		},
		{
			desc: `Reduce Supernova Galaxy Requirement.`,
			cost: E("1e64"),
			galQk: true,
		},
		{
			desc: `Remove Meta-Tetr scaling. Radiation Booster 'Meta-Rank Boost' affects Meta-Pent at a reduced rate.`,
			cost: E("1.5e25956"),
			effect() {
				let x = tmp.radiation.bs.eff[14].add(1).log10().add(1).log10().add(1).pow(0.5);
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `Meta-Hex starts 1.5x later.`,
			cost: E("1.5e1556"),
			et: true,
		},
		{
			desc: `The effect softcap of Galactic Power is weaker.`,
			cost: E(2e66),
			galQk: true,
		},
		{
			desc: `Remove First Black Hole Overflow effect.`,
			cost: E("1.5e28206"),
		},
		{
			desc: `Elements 173 and 174 are better.`,
			cost: E("1.5e1606"),
			et: true,
		},
		{
			desc: `Galactic Shards Effect affects Galactic U-Fermions gain.`,
			cost: E(5e67),
			galQk: true,
		},
		{
			desc: `Remove some softcaps of Star Boost's formula.`,
			cost: E("1.5e28906"),
		},
		{
			desc: `Remove Stronger Softcap.`,
			cost: E("1.5e1626"),
			et: true,
		},
		{
			desc: `Unlock a Galactic Challenge Option.`,
			cost: E(1e69),
			galQk: true,
		},
		{
			desc: `Reduce Galactic Challenge Goals.`,
			cost: E(1e69),
			galQk: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e29906"),
		},
		{
			desc: `Green Chroma effect is better.`,
			cost: E("1.5e1666"),
			et: true,
		},
		{
			desc: `Reduce Galactic Challenge Goals.`,
			cost: E(1e69),
			galQk: true,
		},
		{
			desc: `Remove some Cosmic Ray softcaps.`,
			cost: E("1.5e30156"),
		},
		{
			desc: `Meta-Prestige Level starts 2x later.`,
			cost: E("1.5e1669"),
			et: true,
		},
		{
			desc: `Galactic Shards boost Galactic Quarks.`,
			cost: E(1e72),
			galQk: true,
			effect() {
				let x = player.gc.shard.add(1).sqrt();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Remove [Neutrino]'s softcaps.`,
			cost: E("1.5e31056"),
		},
		{
			desc: `Infinity Upgrade 9 is better.`,
			cost: E("1.5e1756"),
			et: true,
		},
		{
			desc: `Super Galactic Fermion Tier starts 1.5x later.`,
			cost: E("1e75"),
			galQk: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e32756"),
		},
		{
			desc: `Meta-Hex starts 1.5x later.`,
			cost: E("1.5e1836"),
			et: true,
		},
		{
			desc: `Galactic Shards Effect affects base Galactic Radiation gain.`,
			cost: E("3e78"),
			galQk: true,
		},
		{
			desc: `Electron Power’s second effect is better.`,
			cost: E("1.5e36556"),
		},
		{
			desc: `Effects of Galactic Dark Energy and Galactic Bosons are better.`,
			cost: E("3e81"),
			galQk: true,
		},
		{
			desc: `C1, C5 and C7 effects are changed.`,
			cost: E("1.5e37556"),
		},
		{
			desc: `Element 161 is cubed.`,
			cost: E("1.5e2056"),
			et: true,
		},
		{
			desc: `Galactic Shards Effect affects base Galactic Radiation gain.`,
			cost: E("1e83"),
			galQk: true,
		},
		{
			desc: `C18 effect is better.`,
			cost: E("1.5e38206"),
		},
		{
			desc: `Entropic Evaporation^2 is 75% weaker. Remove some Entropic softcaps.`,
			cost: E("1.5e2056"),
			et: true,
		},
		{
			desc: `The effect softcap of Galactic Power is weaker.`,
			cost: E("2e84"),
			galQk: true,
		},
		{
			desc: `Particle Power’s first effects are squared.`,
			cost: E("1.5e57386"),
		},
		{
			desc: `Neutron Power’s second effect is better.`,
			cost: E("1.5e2156"),
			et: true,
		},
		{
			desc: `The Entropy Cap boost of Supernova Galaxies is better.`,
			cost: E("4e85"),
			galQk: true,
		},
		{
			desc: `Tickspeed Effect is better.`,
			cost: E("1.5e64256"),
		},
		{
			desc: `Atomic Power softcaps are weaker.`,
			cost: E("1.5e2216"),
			et: true,
		},
		{
			desc: `Unlock a new layer.`,
			cost: E("5e86"),
			galQk: true,
		},
		{
			desc: `Effects of elements 173 and 174 are better.`,
			cost: E("1.5e70056"),
		},
		{
			desc: `Meta-Hex starts 1.5x later.`,
			cost: E("1.5e2556"),
			et: true,
		},
		{
			desc: `Softcap of effect of Beta Particles in Galactic Challange starts later. Double Galactic Shards gain.`,
			cost: E("1e100"),
			galQk: true,
		},
		{
			desc: `Exotic Boost 'Atom Boost' boost Quarks.`,
			cost: E("eee12"),
			qk: true,
		},
		{
			desc: `Element 231 is better.`,
			cost: E("2e127"),
			galQk: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e3556"),
			et: true,
		},
		{
			desc: `Exotic Boosts are 20% stronger.`,
			cost: E("2e21"),
			exotic: true,
		},
		{
			desc: `Effects of elements 173 and 174 are better.`,
			cost: E("1.5e134056"),
		},
		{
			desc: `Proton Power's second effect ^2.`,
			cost: E("ee1.5e12"),
			qk: true,
		},
		{
			desc: `Effects of Galactic Particles are better.`,
			cost: E("5e128"),
			galQk: true,
		},
		{
			desc: `Pre-Quantum Global Speed boost Dark Shadow gain.`,
			cost: E("1e10"),
			ds: true,
			effect() {
				let x = tmp.preQUGlobalSpeed.add(1).log10().sqrt();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Meta-Prestige Level starts 1.25x later.`,
			cost: E("1.5e3756"),
			et: true,
		},
		{
			desc: `Exotic Matter boost Dark Ray gain.`,
			cost: E("2e23"),
			exotic: true,
			effect() {
				let x = player.exotic.points.add(10).log10().pow(2);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Effect of Galactic Atoms are better.`,
			cost: E("1.5e142056"),
		},
		{
			desc: `Galactic Quark gain from Quarks is better.`,
			cost: E("ee2e12"),
			qk: true,
		},
		{
			desc: `Effects of Galactic U-Fermions are better. G-Fermion Tiers are cheaper.`,
			cost: E("5e141"),
			galQk: true,
		},
		{
			desc: `Unlock a new effect of Dark Shadow.`,
			cost: E("1e20"),
			ds: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e3856"),
			et: true,
		},
		{
			desc: `Double Prestige Overpower Power.`,
			cost: E("2e24"),
			exotic: true,
		},
		{
			desc: `Remove Hardened and Insane scalings of C1-C19.`,
			cost: E("1.5e150056"),
		},
		{
			desc: `Unlock Element Charging.`,
			cost: E("ee2.7777e12"),
			qk: true,
		},
		{
			desc: `Charged Elements boost Galactic Quark gain.`,
			cost: E("5e148"),
			galQk: true,
			effect() {
				let x = E(1.5).pow(player.atom.chargedElements.length)
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Unlock a new effect of Dark Shadow.`,
			cost: E("1e24"),
			ds: true,
		},
		{
			desc: `Keep Eternal Mass and Eternities when Galactic or Exotic reset. The cost of this element is 6.9e4200 uni of Eternal Mass, Nice.<br>(If you found this element is hard to bought, please check your Exotic Boosts)`,
			cost: E("1.035e4257"),
			et: true,
		},
		{
			desc: `Exotic Boosts are 10% stronger.`,
			cost: E("2e28"),
			exotic: true,
		},
		{
			desc: `Particle Power's first effects are squared.`,
			cost: E("1.5e173056"),
		},
		{
			desc: `Galactic Quark gain from U-Quarks is better.`,
			cost: E("ee1e13"),
			qk: true,
		},
		{
			desc: `Unlock Supernova Clusters.`,
			cost: E("1e167"),
			galQk: true,
		},
		{
			desc: `Death Shards boost Dark Shadow gain.`,
			cost: E("1e35"),
			ds: true,
			effect() {
				let x = player.qu.rip.amt.add(1).log10().add(1).log10().add(1).pow(2);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Eternal Mass boost Dark Ray gain.`,
			cost: E("1.5e4656"),
			et: true,
			effect() {
				let x = player.et.points.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Exotic Meta-Boost is better.`,
			cost: E("1e34"),
			exotic: true,
		},
		{
			desc: `Accelerator Effect Softcap^2 is weaker.`,
			cost: E("1.5e221356"),
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("ee1.9e13"),
			qk: true,
		},
		{
			desc: `You can automatically complete C20.`,
			cost: E("3e173"),
			galQk: true,
		},
		{
			desc: `Unlock a new effect of Dark Shadow.`,
			cost: E("1e45"),
			ds: true,
		},
		{
			desc: `Eternal Mass boost Exotic Matter gain.`,
			cost: E("1.5e4906"),
			et: true,
			effect() {
				let x = player.et.points.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Reduce Supernova Galaxy Requirements.`,
			cost: E("3e39"),
			exotic: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e270056"),
		},
		{
			desc: `Remove Entropic Radiation^2 scaling. Some Entropy Effects are better.`,
			cost: E("ee5e13"),
			qk: true,
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("1e184"),
			galQk: true,
		},
		{
			desc: `Unlock a new effect of Dark Shadow.`,
			cost: E("1e50"),
			ds: true,
		},
		{
			desc: `Eternal Mass boost Dark Shadow gain.`,
			cost: E("1.5e5106"),
			et: true,
			effect() {
				let x = player.et.points.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Unlock Exotic Count Booster.`,
			cost: E("2e41"),
			exotic: true,
		},
		{
			desc(){
				if(!hasElement(403))return "403 Forbidden";
				return "Meta-Prestige Level starts 1.05x later.";
			},
			cost: E("1.5e300056"),
		},
		{
			desc(){
				if(!hasElement(404))return "404 Not Found";
				return "Bosonic Upgrades are better.";
			},
			cost: E("ee5.5555e13"),
			qk: true,
		},
		{
			desc: `Galactic Quarks boost Dark Shadow gain.`,
			cost: E("1e190"),
			galQk: true,
			effect() {
				let x = player.galQk.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Unlock a new effect of Dark Ray.`,
			cost: E("1e55"),
			ds: true,
		},
		{
			desc: `Hyper Galactic Fermion Tiers starts 1.5x later.`,
			cost: E("1.5e5406"),
			et: true,
		},
		{
			desc: `Exotic Boosts are 10% stronger.`,
			cost: E("2e47"),
			exotic: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e378056"),
		},
		{
			desc: `Super Overpower is 4% weaker.`,
			cost: E("ee2.3e14"),
			qk: true,
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("1e205"),
			galQk: true,
		},
		{
			desc: `Some effects of Dark Shadow are better.`,
			cost: E("1e58"),
			ds: true,
		},
		{
			desc: `Galactic Particles Effect is better. Neutron Power's first effect is squared.`,
			cost: E("1e213"),
			galQk: true,
		},
		{
			desc: `Unlock Abyssal Blots.`,
			cost: E("1e60"),
			ds: true,
		},
		{
			desc: `Meta Fermion Tier scaling is 99% weaker.`,
			cost: E("1.5e6106"),
			et: true,
		},
		{
			desc: `Exotic Meta-Boost is 1.5x stronger.`,
			cost: E("1e53"),
			exotic: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e457056"),
		},
		{
			desc: `Meta-Tickspeeds starts ^10 later.`,
			cost: E("ee1.6e15"),
			qk: true,
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("1e235"),
			galQk: true,
		},
		{
			desc: `Unlock a new effect of Abyssal Blot.`,
			cost: E("2e70"),
			ds: true,
		},
		{
			desc: `Change the effect of C1. Meta-Pent starts 1e100x later.`,
			cost: E("1.5e7331"),
			et: true,
		},
		{
			desc: `Reduce Supernova Galaxy Requirements.`,
			cost: E("1e59"),
			exotic: true,
		},
		{
			desc: `Unlock a new Galactic Challenge modifier. Gain 1 g mass per second and +1 Pre-Quantum Global Speed (doesn't affected by anything) when you're in Galactic Challenge.`,
			cost: E("1.5e684056"),
		},
		{
			desc: `Meta-Pent starts later based on Tier.`,
			cost: E("ee1.6666e16"),
			qk: true,
			effect() {
				let x = overflow(expMult(player.ranks.tier.pow(1e-19).add(100),3),"1e100000",10/3);
				if(hasElement(439))x = x.mul(E("e3e8").pow(player.ranks.tier.add(10).log10().add(10).log10()));
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("1e249"),
			galQk: true,
		},
		{
			desc: `Unlock a new effect of Abyssal Blot.`,
			cost: E("1e73"),
			ds: true,
		},
		{
			desc: `Beta Particle's Effect is multiplied by 10.`,
			cost: E("1.5e7706"),
			et: true,
		},
		{
			desc: `Dark Ray's 2nd effect ^2.5`,
			cost: E("1e65"),
			exotic: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e800056"),
		},
		{
			desc: `Remove Infinity Upgrade 5's softcap.`,
			cost: E("ee3.3333e16"),
			qk: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e7981"),
			et: true,
		},
		{
			desc: `Exotic Boosts are 10% stronger.`,
			cost: E("4e73"),
			exotic: true,
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e888944"),
		},
		{
			desc: `Accelerator Effect Softcap^2 is weaker.`,
			cost: E("ee1e17"),
			qk: true,
		},
		{
			desc: `Unlock a new Galactic Challenge modifier. +5 to Galactic Challenge Difficulty Cap. Square Galactic Shard effect.`,
			cost: E("3e271"),
			galQk: true,
		},
		{
			desc: `Unlock a new effect of Abyssal Blot.`,
			cost: E("1e82"),
			ds: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e9056"),
			et: true,
		},
		{
			desc: `Unlock the 21th Challenge.`,
			cost: E("3e75"),
			exotic: true,
		},
		{
			desc: `Element 424 is better.`,
			cost: E("1.5e1000056"),
		},
		{
			desc: `Exotic Prestige Level is 5% weaker.`,
			cost: E("ee2.1e17"),
			qk: true,
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("2e286"),
			galQk: true,
		},
		{
			desc: `Each bought element multiply Abyssal Blot gain by 1.1.`,
			cost: E("6e83"),
			ds: true,
			effect() {
				return E(1.1).pow(player.atom.elements.length);
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Accelerator effect softcap^2 is weaker.`,
			cost: E("1.5e10081"),
			et: true,
		},
		{
			desc: `Exotic Boost 'Star Boost' affects Star Generators.`,
			cost: E("1e78"),
			exotic: true,
		},
		{
			desc: `Eternal Mass boost Abyssal Blot gain.`,
			cost: E("1.5e10181"),
			et: true,
			effect() {
				let x = player.et.points.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x" },
		},
		{
			desc: `Exotic Meta-Boost is 1.2x stronger.`,
			cost: E("1e78"),
			exotic: true,
		},
		{
			desc: `Infinity Upgrade 24 is better.`,
			cost: E("1.5e1130056"),
		},
		{
			desc: `Exotic Prestige Level is weaker based on Exotic Matter (Increased Effect above 1e80 EM).`,
			cost: E("ee5e17"),
			qk: true,
			effect() {
				if(player.exotic.points.gte(1e80))return E(0.97).pow(player.exotic.points.add(10).log10().div(24.185));
				return E(0.97).pow(player.exotic.points.add(10).log10().pow(0.273));
			},
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("5e294"),
			galQk: true,
		},
		{
			desc: `Unlock Dark Run.`,
			cost: E("1e87"),
			ds: true,
		},
		{
			desc: `Eternal Mass boost Glyphic Mass gain.`,
			cost: E("1.5e10656"),
			et: true,
			effect() {
				let x = player.et.points.add(10).log10().sqrt();
				if(hasElement(463))x = x.pow(2);
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Permanently Remove Meta-Pent scaling.`,
			cost: E("1e87"),
			exotic: true,
		},
		{
			desc: `Reduce C21 goal.`,
			cost: E("1.5e1279056"),
		},
		{
			desc: `Break Dilation Upgrade 5 is applied to Meta-Hex scaling.`,
			cost: E("ee2.4444e18"),
			qk: true,
		},
		{
			desc: `Galactic Quarks is added to base Infinity Mass gain formula.`,
			cost: E(Number.MAX_VALUE),
			galQk: true,
		},
		{
			desc: `Dark Ray's 2nd effect is better. Unlock a new effect of Dark Ray.`,
			cost: E("1e99"),
			ds: true,
		},
		{
			desc: `Timeshards effect is better.`,
			cost: E("1.5e15056"),
			et: true,
		},
		{
			desc: `Exotic Meta-Boost is better.`,
			cost: E("2e98"),
			exotic: true,
		},
		{
			desc: `Elements 173-174 are better.`,
			cost: E("1.5e1900056"),
		},
		{
			desc: `[G-Neutrino] affects Meta-Hex at a reduced rate.`,
			cost: E("ee8e19"),
			qk: true,
			effect() {
				let x = player.supernova.fermions.tiers[3][3].add(1).pow(2);
				return x
			},
			effDesc(x) { return format(x)+"x later"; },
		},
		{
			desc: `Accelerator Power Softcap^2 is weaker.`,
			cost: E("ee8.1e19"),
			qk: true,
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("1e348"),
			galQk: true,
		},
		{
			desc: `Element 451 is better.`,
			cost: E("1.5e16856"),
			et: true,
		},
		{
			desc: `Exotic Matter boost Glyphic Mass gain.`,
			cost: E("1e108"),
			exotic: true,
			effect() {
				let x = player.exotic.points.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `C20 effect is better.`,
			cost: E("1.5e2100056"),
		},
		{
			desc: `Exotic Prestige Level starts +42,000 later.`,
			cost: E("ee3.3333e20"),
			qk: true,
		},
		{
			desc: `Divide Supernova Galaxies Requirement by 40. Unlock a new effect of Supernova Galaxies.`,
			cost: E("2e367"),
			galQk: true,
		},
		{
			desc: `Dark Shadow's 7th effect is better.`,
			cost: E("1e109"),
			ds: true,
		},
		{
			desc: `Galactic Dark Matter and Galactic Bosons effects are better.`,
			cost: E("1.5e20056"),
			et: true,
		},
		{
			desc: `Meta-Hex starts later based on Exotic Matter.`,
			cost: E("6e116"),
			exotic: true,
			effect() {
				let x = player.exotic.points.add(10).log10();
				return x
			},
			effDesc(x) { return format(x)+"x"; },
		},
		{
			desc: `Infinity Upgrade 24 effect is better.`,
			cost: E("1.5e2600056"),
		},
		{
			desc: `Tickspeed Power multiply Booster Power.`,
			cost: E("ee2e21"),
			qk: true,
		},
		{
			desc: `Galactic Particles Effect is better.`,
			cost: E("1e396"),
			galQk: true,
		},
	],
    /*
    {
        desc: `Placeholder.`,
        cost: EINF,
        effect() {
            let x = E(1)
            return x
        },
        effDesc(x) { return format(x)+"x" },
    },
    */
    getUnlLength() {
		if(hasElement(450))return 473;
		if(hasElement(438))return 450;
		if(hasElement(380))return 438;
		if(hasUpgrade("atom",25))return 380;
		
		if(player.exotic.times.gte(1))return 362;
		if(hasElement(291))return 359;
		if(hasElement(290))return 291;
		if(player.superGal.gte(10))return 290;
		if(player.superGal.gte(1))return 218;
        let u = 4
        if (quUnl()) u = 77+3
        else {
            if (player.supernova.times.gte(1)) u = 49+5
            else {
                if (player.chal.comps[8].gte(1)) u += 14
                if (hasElement(18)) u += 3
                if (MASS_DILATION.unlocked()) u += 15
                if (STARS.unlocked()) u += 18
            }
            if (player.supernova.post_10) u += 3
            if (player.supernova.fermions.unl) u += 10
            if (tmp.radiation.unl) u += 10
        }
        if (PRIM.unl()) u += 3
        if (hasTree('unl3')) u += 3
        if (player.qu.rip.first) u += 9
        if (hasUpgrade("br",9)) u += 23 // 23
		if (hasUpgrade("atom",16)) u += 16
		if (hasElement(134)) u += 21
        if (player.chal.comps[13].gte(4)) u += 13
        if (player.chal.comps[16].gte(3)) u += 24
        if (player.chal.comps[17].gte(3)) u += 13
        if (player.chal.comps[18].gte(3)) u += 4
        if (player.chal.comps[19].gte(8)) u += 9
        return u
    },
}

const MAX_ELEM_TIERS = 4

function getElementId(x) {
    let log = Math.floor(Math.log10(x))
    let list = ["n", "u", "b", "t", "q", "p", "h", "s", "o", "e"]
    let r = ""
    for (var i = log; i >= 0; i--) {
        let n = Math.floor(x / Math.pow(10, i)) % 10
        if (r == "") r = list[n].toUpperCase()
        else r += list[n]
    }
    return r
}

function getElementName(x) {
    let log = Math.floor(Math.log10(x))
    let listF = ["Nil", "Un", "Bi", "Tri", "Quad", "Pent", "Hex", "Sept", "Oct", "Enn"]
    let list = ["nil", "un", "bi", "tri", "quad", "pent", "hex", "sept", "oct", "enn"]
    let r = ""
    for (var i = log; i >= 0; i--) {
        let n = Math.floor(x / Math.pow(10, i)) % 10
        if (r == "") r = listF[n]
        else r += list[n]
        if (i == 0) r += n != 2 && n != 3 ? "ium" : "um"
    }
    return r
}

function WE(a,b) { return 2*(a**2-(a-b)**2) }

for (let x = 2; x <= MAX_ELEM_TIERS; x++) {
    let [ts,te] = [ELEMENTS.exp[x-1],ELEMENTS.exp[x]]

    let m = 'xx1xxxxxxxxxxxxxxxxvxx2xxxxxxxxxxxxxxxxv_v'

    for (let y = x; y >= 1; y--) {
        let k = 10 + 4 * y
        m += "1"+'x'.repeat(k)+"v"
        m += "2"+'x'.repeat(k)
        if (y > 1) m += "v_v"
    }

    for (let y = ts+1; y <= te; y++) {
        ELEMENTS.names.push(getElementId(y))
        ELEMENTS.fullNames.push(getElementName(y))
        if (!ELEMENTS.upgs[y]) ELEMENTS.upgs.push({
            desc: `Placeholder.`,
            cost: EINF,
        })
    }

    ELEMENTS.map.push(m)
}

function hasElement(x) { return player.atom.elements.includes(x) }
function hasChargedElement(x) { return player.atom.chargedElements.includes(x) }


function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = ""
    let num = 0
    for (let k = 1; k <= MAX_ELEM_TIERS; k++) {
        let n = 0, p = (k+3)**2*2, xs = ELEMENTS.exp[k-1], xe = ELEMENTS.exp[k]
        table += `<div id='elemTier${k}_div'><div class='table_center'>`
        for (let i = 0; i < ELEMENTS.map[k-1].length; i++) {
            let m = ELEMENTS.map[k-1][i]
            if (m=='v') table += '</div><div class="table_center">'
            else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined&&k==1?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
            else if (m=='x') {
                num++
                table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
                :`<button class="elements ${num == 118 ? 'final' : ''}" id="elementID_${num}" onclick="ELEMENTS.buyUpg(${num})" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0"><div style="font-size: 12px;">${num}</div>${ELEMENTS.names[num]}</button>`
                if (k == 1) {
                    if (num==57 || num==89) num += 14
                    else if (num==71) num += 18
                    else if (num==118) num = 57
                    else if (num==103) num = 118
                } else {
                    //console.log(num,p)
                    if (n == 0) {
                        if (num == xs + 2 || num == xs + p + 2) num += p - 18
                        else if (num == xe) {
                            num = xs + 2
                            n++
                        }
                    } else {
                        if (num == xs + WE(k+3,n) + 2) num = xs + p + WE(k+3,n-1) + 2
                        else if (num == xe - 16) num = xe
                        else if (num == xs + p + WE(k+3,n) + 2) {
                            num = xs + WE(k+3,n) + 2
                            n++
                        }
                    }
                }
            }
        }
        table += "</div></div>"
    }
	elements_table.setHTML(table)
}

function updateElementsHTML() {
    let tElem = tmp.elements

	if (tElem.unl_length<=118)player.atom.elemTier=Math.min(player.atom.elemTier,1)
	if (tElem.unl_length<=218)player.atom.elemTier=Math.min(player.atom.elemTier,2)
	if (tElem.unl_length<=362)player.atom.elemTier=Math.min(player.atom.elemTier,3)
    tmp.el.elemTierDiv.setDisplay(hasUpgrade("atom",16) || player.superGal.gte(1))
    tmp.el.elemTier.setHTML("Element Tier "+player.atom.elemTier)

    let ch = tElem.choosed
    tmp.el.elem_ch_div.setVisible(ch>0)
    if (ch) {
        tmp.el.elem_desc.setHTML(("<b>["+ELEMENTS.fullNames[ch]+"]</b> "+ELEMENTS.upgs[ch].desc+(hasChargedElement(ch)?"<b> [CHARGED]</b>":""))+((hasElement(380) && ELEMENTS.upgs[ch].ccost) ? "<span class=yellow><br>Charged Effect: "+ELEMENTS.upgs[ch].cdesc+"</span>" : ""))
		if(ELEMENTS.upgs[ch].desc instanceof Function)tmp.el.elem_desc.setHTML("<b>["+ELEMENTS.fullNames[ch]+"]</b> "+ELEMENTS.upgs[ch].desc())
        tmp.el.elem_cost.setTxt(format(ELEMENTS.upgs[ch].cost,0)+" Quarks"+(ch>86&&ch<=118?" in Big Rip":"")+(player.qu.rip.active&&tElem.cannot.includes(ch)?" [CANNOT AFFORD in Big Rip]":"") + ((hasElement(380) && ELEMENTS.upgs[ch].ccost) ? ", Charge Cost: "+format(ELEMENTS.upgs[ch].ccost,0)+" Quarks" : ""))
        if(ch > 118)tmp.el.elem_cost.setTxt((ELEMENTS.upgs[ch].galQk||ELEMENTS.upgs[ch].exotic||ELEMENTS.upgs[ch].qk||ELEMENTS.upgs[ch].ds?format:formatMass)(ELEMENTS.upgs[ch].cost,0)+(ELEMENTS.upgs[ch].qk?" Quarks":ELEMENTS.upgs[ch].ds?" Dark Shadow":ELEMENTS.upgs[ch].exotic?" Exotic Matter":ELEMENTS.upgs[ch].galQk?" Galactic Quarks":ELEMENTS.upgs[ch].et?" Eternal Mass":" Infinity Mass"))
		tmp.el.elem_eff.setHTML((ELEMENTS.upgs[ch].effDesc?"Currently: "+ELEMENTS.upgs[ch].effDesc(tElem.effect[ch]):"")+(hasElement(380) && ELEMENTS.upgs[ch].ceffDesc?"<span class=yellow><br>Current Charged Effect: "+ELEMENTS.upgs[ch].ceffDesc(tElem.ceffect[ch])+"</span>":""))
    }

    for (let x = 1; x <= MAX_ELEM_TIERS; x++) {
        let unl = player.atom.elemTier == x
        tmp.el["elemTier"+x+"_div"].setDisplay(unl)
        if (unl) {
            if (x == 1) {
                tmp.el.element_la_1.setVisible(tElem.unl_length>56)
                tmp.el.element_la_3.setVisible(tElem.unl_length>56)
                tmp.el.element_la_2.setVisible(tElem.unl_length>88)
                tmp.el.element_la_4.setVisible(tElem.unl_length>88)
            }

            for (let x = 1; x <= tElem.upg_length; x++) {
                let upg = tmp.el['elementID_'+x]
                if (upg) {
                    let unl2 = x <= tElem.unl_length
                    upg.setVisible(unl2)
                    if (unl2) {
                        upg.setClasses({elements: true, locked: !ELEMENTS.canBuy(x), bought: hasElement(x), br: (x > 86 && x <= 118), ext: (x > 118), et: ELEMENTS.upgs[x].et, gqk: ELEMENTS.upgs[x].galQk, ds: ELEMENTS.upgs[x].ds, ex: ELEMENTS.upgs[x].exotic, qk: ELEMENTS.upgs[x].qk, ch: hasChargedElement(x), cancharge: ELEMENTS.canCharge(x)})
                    }
                }
            }
        }
    }
}

function updateElementsTemp() {
	if (!player.atom.elemTier)player.atom.elemTier = 1
    let cannot = []
    if (player.qu.rip.active && !hasTree('br2')) cannot.push(58,74)
    tmp.elements.cannot = cannot

    if (!tmp.elements.upg_length) tmp.elements.upg_length = ELEMENTS.upgs.length-1
    for (let x = tmp.elements.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tmp.elements.effect[x] = ELEMENTS.upgs[x].effect()
    }
    for (let x = tmp.elements.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].ceffect) {
        tmp.elements.ceffect[x] = ELEMENTS.upgs[x].ceffect()
    }
    tmp.elements.unl_length = ELEMENTS.getUnlLength()
}