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
            return `ω[${orderStr}]`+(omegaOrder.lt(8000)?`(${this.format(val)})`:``);
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
            return `ω[${orderStr}]`+(omegaOrder.lt(8000)?`(${this.format(val)})`:``);
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
			const value = D(118).pow(abbreviationListIndex + abbreviationIndex / abbreviationLength - 1)
			return [abbreviation, value];
		},
		formatElementalPart(abbreviation, n) {
			if (n.lte(1)) {
			  return abbreviation;
			}
			return `${n} ${abbreviation}`;
		},
		format(value,acc) {
			if (value.gt(D(118).pow(D(118).pow(D(118).pow(4))))) return "e"+this.format(value.log10(),acc)

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
			const formattedMantissa = D(118).pow(log).toFixed(parts.length === 1 ? 3 : acc);
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
		format(ex, acc, color, log) {
			ex = D(ex)
			let e = ex.log10()
			if (e.lt(3)) return ex.toFixed(log ? acc : Math.max(Math.min(acc - e.toNumber(), acc), 0))
			else if (e.lt(6)) return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
			return 'e' + this.format(e, Math.max(acc, 2), color, true)
		}
	},
	inf: {
		format(ex, acc) {
			let meta = 0
			let inf = D(Number.MAX_VALUE)
			let symbols = ["", "∞", "Ω", "Ψ", "ʊ"]
			let symbols2 = ["", "", "m", "mm", "mmm"]
			while (ex.gte(inf)) {
				ex = ex.log(inf)
				meta++
			}

			if (meta == 0) return formatDef(ex, acc)
			if (ex.gte(3)) return symbols2[meta] + symbols[meta] + "ω^"+formatDef(ex.sub(1), acc)
			if (ex.gte(2)) return symbols2[meta] + "ω" + symbols[meta] + "-"+formatDef(inf.pow(ex.sub(2)), acc)
			return symbols2[meta] + symbols[meta] + "-"+formatDef(inf.pow(ex.sub(1)), acc)
		}
	},
	max: {
		format(ex, acc, log) {
			ex = D(ex)
			let e = ex.log10()
			if (e.lt(6)) return formatDef(ex, acc)
			return 'MX-' + formatDef(e, Math.max(acc, 2))
		}
	},
    eng: {
      format(ex, acc) {
        ex = D(ex)
        let e = ex.log10().floor()
        if (e.lt(9)) {
          if (e.lt(3)) {
              return ex.toFixed(acc)
          }
          return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        } else {
          if (ex.gte("eeee10")) {
            let slog = ex.slog()
            return (slog.gte(1e9)?'':D(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + this.format(slog.floor(), 0)
          }
          let m = ex.div(D(1000).pow(e.div(3).floor()))
          return (e.log10().gte(4)?'':m.toFixed(D(2).max(acc).sub(e.sub(e.div(3).floor().mul(3))).toNumber()))+'e'+this.format(e.div(3).floor().mul(3),0)
        }
      },
    },
    layer: {
      layers: ["infinity","eternity","reality","equality","affinity","celerity","identity","vitality","immunity","atrocity"],
      format(ex, acc) {
        ex = D(ex)
        let layer = ex.max(1).log10().max(1).log(INFINITY_NUM.log10()).floor()
        if (layer.lte(0)) return formatDef(ex,acc)
        ex = D(10).pow(ex.max(1).log10().div(INFINITY_NUM.log10().pow(layer)).sub(layer.gte(1)?1:0))
        let meta = layer.div(10).floor()
        let layer_id = layer.toNumber()%10-1
        return formatDef(ex,Math.max(3,acc)) + " " + (meta.gte(1)?"meta"+(meta.gte(2)?"^"+format(meta,0,"sc"):"")+"-":"") + (isNaN(layer_id)?"nanity":this.layers[layer_id])
      },
    },

    mix: {
      format(ex, acc, color) {
        ex = D(ex)
        return format(ex,acc,ex.lt(1e36)?"st":"sc",color)
      }
    },
	sc: {
		format(ex, acc, color) {
			let e = ex.max(1).log10().floor()
			if (e.lt(Math.max(acc, 3))) return ex.toFixed(Math.max(acc-e.toNumber(), 0))
			else {
				let m = ex.div(D(10).pow(e))
				if (e.gte(1e4)) return colorize('e', color, "magenta") + format(e, Math.max(acc, 3))
				return m.toFixed(Math.max(acc, 2)) + 'e' + e.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
			}
		},
	},
	st: {
		format(ex, acc, color) {
			let e = ex.max(1).log10().floor()
			let e3 = ex.log(1e3).floor()
			let ill = e3.sub(1).round()
			if (ill.lt(1e3)) {
				let e3_mul = e3.mul(3)
				let m = ex.div(D(10).pow(e3_mul)).toFixed(Math.max(Math.max(e3.gte(1)?2:0,acc)-e.sub(e3_mul).toNumber(), 0))
				if (e3.lt(1)) return m
				if (ill.lt(3)) return m + " " + ["K", "M", "B"][ill]
				if (ill.lt(1e3)) return m + " " + this.tier1(ill, color)
			}

			let tier = 2
			let ill_2 = ill.log10().div(3)
			while (ill_2.gte(1e3)) {
				ill_2 = ill_2.log10().div(3)
				tier++
				if (tier > 3) return formatDef(ex, acc, color)
			}
			ill = D(10).pow(ill_2.sub(ill_2.floor()).mul(3)).toNumber()
			ill_2 = ill_2.floor().toNumber()

			let final = ""
			for (var i = 0; i < (ill_2 < 100 ? 2 : 1); i++) {
				let d = Math.floor(ill * Math.pow(10, i*3)) % 1e3
				if (d && final) final += ST_CONNECTIONS[tier]
				if (d > 1 || (ill_2 == 1 && i == 1)) final += this["tier"+(tier-1)](d, color, "mul")
				if (d) final += this["tier"+tier](ill_2, color)
				ill_2--
				if (ill_2 < 0) break
			}
			return final
		},

		tier1(x, color, mode) {
			if (x == 1 && mode == "mul") return ""

			return ST_NAMES[1][0][x % 10] +
			colorize(ST_NAMES[1][1][Math.floor(x / 10) % 10], color, "yellow") +
			colorize(ST_NAMES[1][2][Math.floor(x / 100)], color, "orange")
		},
		tier2(x, color) {
			let o = x % 10
			let t = Math.floor(x / 10) % 10
			let h = Math.floor(x / 100) % 10

			let r = ''
			if (x < 10) return colorize(ST_NAMES[2][0][x], color, "red")
			r += ST_NAMES[2][1][o]
			r += ST_NAMES[2][2][t]
			if (x % 100 == 10) r += "Ve"
			if (x == 20) r += "o"
			if (h > 0 && t == 1 && o > 0) r += "c"
			r += ST_NAMES[2][3][h]

			return colorize(r, color, "red")
		},
		tier3(x, color, mode) {
			return colorize(ST_NAMES[3][0][x], color, "magenta")
		}
	},
	cst: {
		format(ex, acc, color) {
			let st = FORMATS.st
			ex = D(ex)
			if (ex.lt("1e3003")) return st.format(ex, acc, color)

			let tier = 2
			let ill = ex.log10().div(3).sub(1)
			let ill_2 = ill.log10().div(3)
			while (ill_2.gte(1e3)) {
				ill = ill_2
				ill_2 = ill_2.log10().div(3)
				tier++
			}
			ill_2 = ill_2.floor().toNumber()
			ill = ill.div(D(10).pow(ill_2*3)).toNumber()

			let m = Math.floor(ill)
			let d = Math.floor((ill * 1e3) % 1e3)
			return (
					ill_2 > 2 ? "[" + format(ill) + "]" :
					m > 1 ? st["tier"+(tier-1)](m, color, "mul") :
					""
				) + st["tier"+tier](ill_2, color) +
				(ill_2 <= 2 && m < 100 && d ?
					ST_CONNECTIONS[tier] +
					(ill_2 == 2 || m >= 10 ? "[" + d + "]" : st["tier"+(tier-1)](d, color))
				: "")
		}
	}
}
const NO_POSITIONAL = ["omega", "omega_short"]

const ST_NAMES = [
	null, [
		["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
		["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
		["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
	],[
		["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"],
		["","Me","Du","Tre","Te","Pe","Hx","Hp","Ot","En"],
		["","","Is","Trc","Tec","Pec","Hxc","Hpc","Otc","Enc"],
		["","Hec","DHc","TrH","TeH","PeH","HxH","HpH","OtH","EnH"]
	],[
		["","Kl","Mg","Gi","Tr","Pt","Ex","Zt","Yt","Xe"]
	]
]
const ST_CONNECTIONS = ["", "", "-", "a-"]

const INFINITY_NUM = D(2).pow(1024);
const SUBSCRIPT_NUMBERS = "₀₁₂₃₄₅₆₇₈₉";
const SUPERSCRIPT_NUMBERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

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
function formatDef(ex, acc, color) {
	return format(ex, acc, "mix", color)
}

function format(ex, acc=2, type=player.options.notation, color) {
	ex = D(ex)

	//Special Formatting
	if (Number.isNaN(ex.mag) || Number.isNaN(ex.sign)) return 'NaN'
	if (ex.mag == 0) return ex.toFixed(acc)
	if (ex.sign == -1) return "-" + format(ex.neg(), acc, type, color)
	if (ex.mag == Infinity) return '∞'

	if ((ex.mag >= 1e10 && ex.layer == 3) || ex.layer >= 4) return formatTetr(ex, player.options.notation_tetr)
	if (!FORMATS[type]) type = "mix"
	return FORMATS[type].format(ex, acc, color)
}

function formatTetr(ex, tetr) {
	ex = D(ex)

	let layer = ex.layer
	let mag = ex.mag
	if (mag >= 1e3) {
		mag = Math.log10(mag)
		layer++
	}

	if (tetr=="hyper-e") return "E"+(layer>=1e4?'1':formatDef(mag, 3)) + "#" + format(layer, 0)
	if (tetr=="letter") return (layer>=1e4?'':formatDef(mag, 3)) + "F" + format(layer, 0)
}

function formatColored(x, p, mass) {
	return mass ? formatMass(x, true) : format(x, p, player.options.notation, true)
}

function colorize(x, color, id = 'red') {
	if (color) x = "<span class='" + id + "'>" + x + "</span>"
	return x
}

function formatGain(amt, gain, isMass=false, main=false) {
	let [al, gl] = [amt.max(1).log10(), gain.max(1).log10()]
	let f = isMass?formatMass:format

	if (!main && amt.max(gain).gte("ee4")) return ""
	if (main && player.options.notation_mass != 1 && amt.max(gain).gte(mlt(1))) {
		amt = amt.max(1).log10().div(1e9)
		gain = gain.max(1).log10().div(1e9).sub(amt).mul(20)
		f = (x) => formatArv(x, true)
	}

	if (amt.gte("e100") && gain.gt(0) && gain.log(amt).gte(1.1)) return "(^"+format(gain.log(amt), 3)+"/s)"
	else if (amt.gte(100) && gain.div(amt).gte(0.1)) return "("+formatMultiply(gain.div(amt).add(1))+"/s)"
	else if (gain.gt(0)) return "(+"+f(gain)+"/s)"
	return ""
}

function formatGet(a, g, always) {
	g = g.max(0)
	if (g.div(a).lt(0.005)) return ""
	return "(" + (
		a.gte("e100") && g.log(a).gte(1.1) ? "^" + format(g.log(a), 3) :
		a.gte(100) && g.div(a).gte(10) ? formatMultiply(g.div(a).add(1)) :
		"+" + format(g,0)
	) + ")"
}

function formatGainOrGet(a, g, p) {
	return (p ? formatGain : formatGet)(a, g)
}

function formatMultiply(a) {
	if (a.gte(2)) return "x"+format(a)
	return "+"+format(a.sub(1).mul(100))+"%"
}

//MASS
function formatMass(ex, color) {
	let f = color ? formatColored : format
	ex = D(ex)
	if (player.options.notation_mass == 1) return f(ex)

	if (ex.gte(EINF)) return f(ex)
	if (ex.gte(mlt(1))) return formatArv(ex.div(1.5e56).log10().div(1e9), color)
	if (player.options.notation_mass != 3) {
		if (ex.gte(uni(1))) return f(ex.div(uni(1))) + ' uni'
		if (ex.gte(2.9835e45)) return f(ex.div(2.9835e45)) + ' MMWG'
		if (ex.gte(1.989e33)) return f(ex.div(1.989e33)) + ' M☉'
		if (ex.gte(5.972e27)) return f(ex.div(5.972e27)) + ' M⊕'
		if (ex.gte(1.619e20)) return f(ex.div(1.619e20)) + ' MME'
		if (ex.gte(5.2e10)) return f(ex.div(5.2e10)) + ' MTI'
		if (ex.gte(1e6)) return f(ex.div(1e6)) + ' tonne'
		if (ex.gte(1e3)) return f(ex.div(1e3)) + ' kg'
	}
	return f(ex) + ' g'
}

const ARV = ['mlt','mgv','giv','tev','pev','exv','zev','yov',"xvr","wkv"]
function formatArv(mlt, color) {
	let arv = D(0)
	let arv_mant = D(mlt)
	if (player.options.notation_mass == 2) {
		while (D(mlt).gte("ee9")) {
			mlt = D(mlt).log("ee9")
			arv = arv.add(1).round()
		}
	} else {
		arv = arv_mant.log10().div(15)
		if (arv.gte(100)) return formatHighArv(arv)

		arv = arv.floor()
		arv_mant = arv_mant.div(D(10).pow(arv.mul(15)))
	}

	let f = color ? formatColored : format
	let postArv = arv.gte(ARV.length)
	if (player.options.notation_mass == 3) return f(mlt) + " " + colorize("mlt", color, "red")
	return f(arv_mant) + " " + colorize(postArv ? "arv^" + format(arv.add(2), 0) : ARV[arv.toNumber()], color, postArv ? "magenta" : "red")
}

function formatHighArv(arv) {
	arv = D(arv)
	if (arv.gte("ee6")) return formatOmv(arv.log10().div(1e9), 3)
	if (arv.gte(1e45)) return format(arv.div(1e45),3) + " hyv"
	if (arv.gte(1e30)) return format(arv.div(1e30),3) + " xev"
	if (arv.gte(1e15)) return format(arv.div(1e15),3) + " mtv"
	return format(arv,3) + " arvs"
}

function formatOmv(omv, color) {
	omv = D(omv)
	if (omv.gte(1e30)) return format(omv.div(1e30), 3) + " ldv"
	if (omv.gte(1e15)) return format(omv.div(1e15), 3) + " sec"
	if (omv.gte(1e12)) return format(omv.div(1e12), 3) + " tdm"
	if (omv.gte(1e9)) return format(omv.div(1e9), 3) + " byn"
	if (omv.gte(1e6)) return format(omv.div(1e6), 3) + " bar"
	if (omv.gte(1)) return format(omv, 3) + " omv"
	return format(omv.mul(1e3), 3) + " ulv"
}

//TIME
function formatTime(ex,type="s") {
    ex = D(ex)
    if (ex.gte(86400*365)) return format(ex.div(86400*365).floor(),0)+"y, "+formatTime(ex.mod(86400*365))
    if (ex.gte(86400*7)) return format(ex.div(86400*7).floor(),0)+"w, "+formatTime(ex.mod(86400*7),'w')
    if (ex.gte(86400)||type=="w") return format(ex.div(86400).floor(),0)+"d, "+formatTime(ex.mod(86400),'d')
    if (ex.gte(3600)||type=="d") return format(ex.div(3600).floor(),0)+":"+formatTime(ex.mod(3600),'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"||NO_POSITIONAL.includes(player.options.notation)?"":"0")+format(ex.div(60).floor(),0)+":"+formatTime(ex.mod(60),'m')
    return (ex.gte(10)||type!="m"||NO_POSITIONAL.includes(player.options.notation)?"":"0")+format(ex,2)
}

//OTHERS
function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}