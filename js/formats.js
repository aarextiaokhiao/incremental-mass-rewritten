const FORMATS = {
    omega: {
        config: {
            greek: "βζλψΣΘΨω",
            infinity: "Ω",
        },
        format(value) {
            const step = Decimal.floor(value.div(1000));
            const omegaAmount = Decimal.floor(step.div(this.config.greek.length));
            let lastLetter = this.config.greek[step.toNumber() % this.config.greek.length] + toSubscript(value.toNumber() % 1000);
            const beyondGreekArrayBounds = this.config.greek[step.toNumber() % this.config.greek.length] === undefined;
            if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
            lastLetter = "ω";
            }
            const omegaOrder = Decimal.log(value, 8000);
            if (omegaAmount.equals(0)) {
            return lastLetter;
            } else if (omegaAmount.gt(0) && omegaAmount.lte(3)) {
            const omegas = [];
            for (let i = 0; i < omegaAmount.toNumber(); i++) {
                omegas.push("ω");
            }
            return `${omegas.join("^")}^${lastLetter}`;
            } else if (omegaAmount.gt(3) && omegaAmount.lt(10)) {
            return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
            } else if (omegaOrder < 3) {
            return `ω(${this.format(omegaAmount)})^${lastLetter}`;
            } else if (omegaOrder < 6) {
            return `ω(${this.format(omegaAmount)})`;
            }
            const val = Decimal.pow(8000, omegaOrder % 1);
            const orderStr = omegaOrder.lt(100)
            ? omegaOrder.toFixed(0)
            : this.format(omegaOrder.floor());
            return `ω[${orderStr}]`+(omegaOrder.lt(100)?`(${this.format(val)})`:``);
        },
    },
    omega_short: {
        config: {
            greek: "βζλψΣΘΨω",
            infinity: "Ω",
        },
        format(value) {
            const step = value.div(1000).floor();
            const omegaAmount = step.div(this.config.greek.length).floor()
            let lastLetter = this.config.greek[step.toNumber() % this.config.greek.length] + toSubscript(value.toNumber() % 1000);
            const beyondGreekArrayBounds = this.config.greek[step.toNumber() % this.config.greek.length] === undefined;
            if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
            lastLetter = "ω";
            }
            const omegaOrder = value.log(8000);
            if (omegaAmount.equals(0)) {
            return lastLetter;
            } else if (omegaAmount.gt(0) && omegaAmount.lte(2)) {
            const omegas = [];
            for (let i = 0; i < omegaAmount.toNumber(); i++) {
                omegas.push("ω");
            }
            return `${omegas.join("^")}^${lastLetter}`;
            } else if (omegaAmount.gt(2) && omegaAmount.lt(10)) {
            return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
            }
            const val = Decimal.pow(8000, omegaOrder % 1);
            const orderStr = omegaOrder.lt(100)
            ? omegaOrder.toFixed(0)
            : this.format(omegaOrder.floor());
            return `ω[${orderStr}]`+(omegaOrder.lt(100)?`(${this.format(val)})`:``);
        }
    },
    elemental: {
		config: {
			element_lists: [["H"],
			["He", "Li", "Be", "B", "C", "N", "O", "F"],
			["Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl"],
			[
			  "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe",
			  "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br"
			],
			[
			  "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru",
			  "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I"
			],
			[
			  "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm",
			  "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm",
			  "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir",
			  "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At"
			],
			[
			  "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np",
			  "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md",
			  "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt",
			  "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts"
			],
			["Og"]],
		},
		getOffset(group) {
			if (group == 1) return 1
			let n = Math.floor(group / 2)
			let r = 2 * n * (n + 1) * (2 * n + 1) / 3 - 2
			if (group % 2 == 1) r += 2 * Math.pow(n + 1, 2)
			return r
		},
		getAbbreviation(group, progress) {
			const length = this.abbreviationLength(group)
			const elemRel = Math.floor(length * progress)

			const elem = elemRel + this.getOffset(group)

			return elem > 118 ? this.beyondOg(elem) : this.config.element_lists[group - 1][elemRel]
		},
		beyondOg(x) {
			let log = Math.floor(Math.log10(x))
			let list = ["n", "u", "b", "t", "q", "p", "h", "s", "o", "e"]
			let r = ""
			for (var i = log; i >= 0; i--) {
				let n = Math.floor(x / Math.pow(10, i)) % 10
				if (r == "") r = list[n].toUpperCase()
				else r += list[n]
			}
			return r
		},
		abbreviationLength(group) {
			return group == 1 ? 1 : Math.pow(Math.floor(group / 2) + 1, 2) * 2
		},
		getAbbreviationAndValue(x) {
			const abbreviationListUnfloored = x.log(118).toNumber()
			const abbreviationListIndex = Math.floor(abbreviationListUnfloored) + 1
			const abbreviationLength = this.abbreviationLength(abbreviationListIndex)
			const abbreviationProgress = abbreviationListUnfloored - abbreviationListIndex + 1
			const abbreviationIndex = Math.floor(abbreviationProgress * abbreviationLength)
			const abbreviation = this.getAbbreviation(abbreviationListIndex, abbreviationProgress)
			const value = E(118).pow(abbreviationListIndex + abbreviationIndex / abbreviationLength - 1)
			return [abbreviation, value];
		},
		formatElementalPart(abbreviation, n) {
			if (n.eq(1)) {
			  return abbreviation;
			}
			return `${n} ${abbreviation}`;
		},
		format(value,acc) {
			if (value.gt(E(118).pow(E(118).pow(E(118).pow(4))))) return "e"+this.format(value.log10(),acc)

			let log = value.log(118)
			let slog = log.log(118)
			let sslog = slog.log(118).toNumber()
			let max = Math.max(4 - sslog * 2, 1)
			const parts = [];
			while (log.gte(1) && parts.length < max) {
			  const [abbreviation, value] = this.getAbbreviationAndValue(log)
			  const n = log.div(value).floor()
			  log = log.sub(n.mul(value))
			  parts.unshift([abbreviation, n])
			}
			if (parts.length >= max) {
			  return parts.map((x) => this.formatElementalPart(x[0], x[1])).join(" + ");
			}
			const formattedMantissa = E(118).pow(log).toFixed(parts.length === 1 ? 3 : acc);
			if (parts.length === 0) {
			  return formattedMantissa;
			}
			if (parts.length === 1) {
			  return `${formattedMantissa} × ${this.formatElementalPart(parts[0][0], parts[0][1])}`;
			}
			return `${formattedMantissa} × (${parts.map((x) => this.formatElementalPart(x[0], x[1])).join(" + ")})`;
		},
    },
	log: {
		format(ex, acc, log) {
			ex = E(ex)
			let e = ex.log10()
			if (e.lt(3)) return ex.toFixed(log ? acc : Math.max(Math.min(acc - e.toNumber(), acc), 0))
			else if (e.lt(6)) return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
			return 'e' + this.format(e, Math.max(acc, 2), true)
		}
	},
	inf: {
		format(ex, acc, log) {
			let meta = 0
			let inf = E(Number.MAX_VALUE)
			let symbols = ["", "∞", "Ω", "Ψ", "ʊ"]
			let symbols2 = ["", "", "m", "mm", "mmm"]
			while (ex.gte(inf)) {
				ex = ex.log(inf)
				meta++
			}

			if (meta == 0) return format(ex, acc, "sci")
			if (ex.gte(3)) return symbols2[meta] + symbols[meta] + "ω^"+format(ex.sub(1), acc, "sci")
			if (ex.gte(2)) return symbols2[meta] + "ω" + symbols[meta] + "-"+format(inf.pow(ex.sub(2)), acc, "sci")
			return symbols2[meta] + symbols[meta] + "-"+format(inf.pow(ex.sub(1)), acc, "sci")
		}
	},
	max: {
		format(ex, acc, log) {
			ex = E(ex)
			let e = ex.log10()
			if (e.lt(3)) return ex.toFixed(log ? acc : Math.max(Math.min(acc - e.toNumber(), acc), 0))
			else if (e.lt(6)) return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
			return 'MX-' + format(e, Math.max(acc, 2), "st")
		}
	},
    eng: {
      format(ex, acc) {
        ex = E(ex)
        let e = ex.log10().floor()
        if (e.lt(9)) {
          if (e.lt(3)) {
              return ex.toFixed(acc)
          }
          return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        } else {
          if (ex.gte("eeee10")) {
            let slog = ex.slog()
            return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + this.format(slog.floor(), 0)
          }
          let m = ex.div(E(1000).pow(e.div(3).floor()))
          return (e.log10().gte(4)?'':m.toFixed(E(2).max(acc).sub(e.sub(e.div(3).floor().mul(3))).toNumber()))+'e'+this.format(e.div(3).floor().mul(3),0)
        }
      },
    },
    mixed_sc: {
      format(ex, acc) {
        ex = E(ex)
        let e = ex.log10().floor()
        if (e.lt(6)) return format(ex,acc,"sc")
        else if (e.lt(63)) return format(ex,acc,"st")
        else {
          let m = ex.div(E(10).pow(e))
          return (e.gte(1e4) ? 'e' + format(e, Math.max(acc, 3)) : m.toFixed(Math.max(acc, 2)) + 'e' + format(e, 0))
        }
      }
    },
    layer: {
      layers: ["infinity","eternity","reality","equality","affinity","celerity","identity","vitality","immunity","atrocity"],
      format(ex, acc) {
        ex = E(ex)
        let layer = ex.max(1).log10().max(1).log(INFINITY_NUM.log10()).floor()
        if (layer.lte(0)) return format(ex,acc,"sc")
        ex = E(10).pow(ex.max(1).log10().div(INFINITY_NUM.log10().pow(layer)).sub(layer.gte(1)?1:0))
        let meta = layer.div(10).floor()
        let layer_id = layer.toNumber()%10-1
        return format(ex,Math.max(4,acc),"sc") + " " + (meta.gte(1)?"meta"+(meta.gte(2)?"^"+format(meta,0,"sc"):"")+"-":"") + (isNaN(layer_id)?"nanity":this.layers[layer_id])
      },
    },
	standard: {
		tier1(x) {
			return ST_NAMES[1][0][x % 10] +
			ST_NAMES[1][1][Math.floor(x / 10) % 10] +
			ST_NAMES[1][2][Math.floor(x / 100)]
		},
		tier2(x) {
			let o = x % 10
			let t = Math.floor(x / 10) % 10
			let h = Math.floor(x / 100) % 10

			let r = ''
			if (x < 10) return ST_NAMES[2][0][x]
			r += ST_NAMES[2][1][o]
			r += ST_NAMES[2][2][t]
			if (x % 100 == 10) r += "Ve"
			if (x == 20) r += "o"
			if (h > 0 && t == 1 && o > 0) r += "c"
			r += ST_NAMES[2][3][h]

			return r
		}
	}
}

const ST_NAMES = [
	null, [
		["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
		["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
		["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
	],[
		["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"],
		["","Me","Du","Tre","Te","Pe","He","Hp","Ot","En"],
		["","","Is","Trc","Tec","Pec","Hec","Hpc","Otc","Enc"],
		["","Hec","DHc","TrH","TeH","PeH","HeH","HpH","OtH","EnH"]
	]
]


const INFINITY_NUM = E(2).pow(1024);
const SUBSCRIPT_NUMBERS = "₀₁₂₃₄₅₆₇₈₉";
const SUPERSCRIPT_NUMBERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function toSubscript(value) {
    return value.toFixed(0).split("")
      .map((x) => x === "-" ? "₋" : SUBSCRIPT_NUMBERS[parseInt(x, 10)])
      .join("");
}

function toSuperscript(value) {
    return value.toFixed(0).split("")
      .map((x) => x === "-" ? "₋" : SUPERSCRIPT_NUMBERS[parseInt(x, 10)])
      .join("");
}

//FUNCTIONS
function format(ex, acc=2, type=player.options.notation, color) {
	ex = E(ex)
	neg = ex.lt(0)?"-":""
	if (ex.mag == 1/0) return neg + '∞'
	if (Number.isNaN(ex.mag)) return neg + 'NaN'
	if (ex.lt(0)) ex = ex.mul(-1)
	if (ex.eq(0)) return ex.toFixed(acc)
	let e = ex.log10().floor()
	switch (type) {
		case "sc":
			if (e.lt(3)) {
				return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
			} else if (e.lt(6)) {
				return neg+ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
			} else {
				if (ex.gte("eeee10")) {
					let slog = ex.slog()
					return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(3)) + "F" + format(slog.floor(), 0)
				}
				let m = ex.div(E(10).pow(e))
				return neg + (e.gte(1e4) ? 'e' + format(e, Math.max(acc, 3)) : m.toFixed(Math.max(acc, 2)) + 'e' + format(e, 0))
			}
		case "st":
			let e3 = ex.log(1e3).floor()
			if (e3.lt(1)) {
				return neg+ex.toFixed(Math.max(Math.min(acc - e.toNumber(), acc), 0))
			} else {
				let e3_mul = e3.mul(3)
				let ee = e3.log10().floor()
				if (ee.gte(3000)) return "e"+format(e, acc, "st")

				let final = ""
				if (e3.lt(4)) final = ["", "K", "M", "B"][Math.round(e3.toNumber())]
				else {
					let ee3 = Math.floor(e3.log(1e3).toNumber())
					if (ee3 < 100) ee3 = Math.max(ee3 - 1, 0)
					e3 = e3.sub(1).div(E(10).pow(ee3*3))
					while (e3.gt(0)) {
						let div1000 = e3.div(1e3).floor()
						let mod1000 = e3.sub(div1000.mul(1e3)).floor().toNumber()
						if (mod1000 > 0) {
							if (mod1000 == 1 && !ee3) final = "U"
							if (ee3) final = colorize(FORMATS.standard.tier2(ee3), color) + (final ? "-" + final : "")
							if (mod1000 > 1) final = FORMATS.standard.tier1(mod1000) + final
						}
						e3 = div1000
						ee3++
					}
				}

				let m = ex.div(E(10).pow(e3_mul))
				return neg + (ee.gte(4) ? '' : (m.toFixed(E(2).max(acc).sub(e.sub(e3_mul)).toNumber())) + ' ') + final
			}
		default:
			return FORMATS[type] ? neg+FORMATS[type].format(ex, acc) : neg+format(ex, acc, "sc")
	}
}

function formatColored(x, p, mass) {
	return mass ? formatMass(x, true) : format(x, p, player.options.notation, true)
}

function colorize(x, color, id = 'red') {
	if (color) x = "<span class='" + id + "'>" + x + "</span>"
	return x
}

function formatMass(ex, color) {
	let f = color ? formatColored : format
    ex = E(ex)
    if (player.options.pure) return f(ex)

    if (ex.gte(EINF)) return f(ex)
    //if (ex.gte(meg(1))) return f(ex.div(1.5e56).log10().div(1e9).log10().div(1e9), 3) + ' ' + colorize('meg', color, "ch_color")
    if (ex.gte(mlt(1))) return f(ex.div(1.5e56).log10().div(1e9), 3) + ' ' + colorize('mlt', color)
    if (ex.gte(uni(1))) return f(ex.div(1.5e56)) + ' uni'
    if (ex.gte(2.9835e45)) return f(ex.div(2.9835e45)) + ' MMWG'
    if (ex.gte(1.989e33)) return f(ex.div(1.989e33)) + ' M☉'
    if (ex.gte(5.972e27)) return f(ex.div(5.972e27)) + ' M⊕'
    if (ex.gte(1.619e20)) return f(ex.div(1.619e20)) + ' MME'
    if (ex.gte(1e6)) return f(ex.div(1e6)) + ' tonne'
    if (ex.gte(1e3)) return f(ex.div(1e3)) + ' kg'
    return f(ex) + ' g'
}

function formatMultiply(a) {
	if (a.gte(2)) return "x"+format(a)
	return "+"+format(a.sub(1).mul(100))+"%"
}

function formatGain(amt, gain, isMass=false, main=false) {
	let [al, gl] = [amt.max(1).log10(), gain.max(1).log10()]
	let f = isMass?formatMass:format

	if (!main && amt.gte("ee4")) return ""
	if (main && !player.options.pure && amt.max(gain).gte(mlt(1))) {
		amt = amt.max(1).log10().div(1e9)
		gain = gain.max(1).log10().div(1e9).sub(amt).mul(20)
		f = (x) => format(x) + ' ' + colorize('mlt', true)
	}

	if (amt.gte("e100") && gain.log(amt).gte(1.1)) return "(^"+format(gain.log(amt), 3)+"/s)"
	else if (amt.gte(100) && gain.div(amt).gte(0.1)) return "("+formatMultiply(gain.div(amt).add(1))+"/s)"
	else if (gain.div(amt).gte(1e-4)) return "(+"+f(gain)+"/s)"
	return ""
}

function formatGet(a, g, always) {
	g = g.max(0)
	if (g.lte(always ? 0 : a.div(1e-4))) return ""
	return "(" + (
		a.gte("e100") && g.log(a).gte(1.1) ? "^" + format(g.log(a), 3) :
		a.gte(100) && g.div(a).gte(0.1) ? formatMultiply(g.div(a).add(1)) :
		"+" + format(g,0)
	) + ")"
}

function formatGainOrGet(a, g, p) {
	return (p ? formatGain : formatGet)(a, g)
}

function formatTime(ex,type="s") {
    ex = E(ex)
    if (ex.gte(86400*365)) return format(ex.div(86400*365).floor(),0)+"y, "+formatTime(ex.mod(86400*365))
    if (ex.gte(86400*7)) return format(ex.div(86400*7).floor(),0)+"w, "+formatTime(ex.mod(86400*7),'w')
    if (ex.gte(86400)||type=="w") return format(ex.div(86400).floor(),0)+"d, "+formatTime(ex.mod(86400),'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0)+":"+formatTime(ex.mod(3600),'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0)+":"+formatTime(ex.mod(60),'m')
    return (ex.gte(10)||type!="m"?"":"0")+format(ex,2)
}