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
            } else if (omegaOrder.lt(3)) {
            return `ω(${this.format(omegaAmount)})^${lastLetter}`;
            } else if (omegaOrder.lt(6)) {
            return `ω(${this.format(omegaAmount)})`;
            }
            let val = Decimal.pow(8000, omegaOrder.toNumber() % 1);
			      if(omegaOrder.gte(1e20))val = E(1)
            const orderStr = omegaOrder.lt(100)
            ? Math.floor(omegaOrder.toNumber()).toFixed(0)
            : this.format(Decimal.floor(omegaOrder));
            return `ω[${orderStr}](${this.format(val)})`;
        },
    },
    omega_short: {
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
            } else if (omegaAmount.gt(0) && omegaAmount.lte(2)) {
            const omegas = [];
            for (let i = 0; i < omegaAmount.toNumber(); i++) {
                omegas.push("ω");
            }
            return `${omegas.join("^")}^${lastLetter}`;
            } else if (omegaAmount.gt(2) && omegaAmount.lt(10)) {
            return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
            }
            let val = Decimal.pow(8000, omegaOrder.toNumber() % 1);
			      if(omegaOrder.gte(1e20))val = E(1)
            const orderStr = omegaOrder.lt(100)
            ? Math.floor(omegaOrder).toFixed(0)
            : this.format(Decimal.floor(omegaOrder));
            return `ω[${orderStr}](${this.format(val)})`;
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
  
        if (elem > 1e9) return `E[#]${format(elem)}`
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
        const abbGroupU = x.log(118).toNumber()
        const abbGroup = Math.floor(abbGroupU) + 1
        const abbLength = this.abbreviationLength(abbGroup)
        const abbProgress = abbGroupU - abbGroup + 1
        const abbIndex = Math.floor(abbProgress * abbLength)
        const abb = this.getAbbreviation(abbGroup, abbProgress)
        const value = E(118).pow(abbGroup + abbIndex / abbLength - 1)
        return [abb, value];
      },
      formatElementalPart(abbreviation, n) {
        if (n.eq(1)) {
          return abbreviation;
        }
        return `${n} ${abbreviation}`;
      },
      format(value,acc) {  
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
          return (e.log10().gte(9)?'':m.toFixed(E(4).sub(e.sub(e.div(3).floor().mul(3)))))+'e'+this.format(e.div(3).floor().mul(3),0)
        }
      },
    },
    mixed_sc: {
      format(ex, acc, max) {
        ex = E(ex)
        let e = ex.log10().floor()
        if (e.lt(63) && e.gte(max)) return format(ex,acc,max,"st")
        else {
          let m = ex.div(E(10).pow(e))
          return e.gte(1e3) ? (e.gte(1e9)?"":m.toFixed(4))+"e"+this.format(e,0,max) : format(ex,acc,max,"sc")
        }
      }
    },
    layer: {
		layers: ["infinity","eternity","reality","equality","affinity","celerity","identity","vitality","immunity","atrocity"],
		format(ex, acc, max) {
			ex = E(ex)
			let layer = ex.max(1).log10().max(1).log(INFINITY_NUM.log10()).floor()
			if (layer.lte(0)) return format(ex,acc,max,"sc")
			ex = E(10).pow(ex.max(1).log10().div(INFINITY_NUM.log10().pow(layer)).sub(layer.gte(1) ? 1 : 0))
			let meta = layer.div(10)
			if (meta.gte(100)) return "meta-"+format(meta)
			let layer_id = (layer.toNumber()-1)%10
			return format(ex,Math.max(4,acc),max,"sc") + " " + (meta.gte(1)?"meta"+(meta.gte(2)?"^"+format(meta.floor(),0,max,"sc"):"")+"-":"") + (isNaN(layer_id)?"nanity":this.layers[layer_id])
		},
    },
    st: {
		format(ex, acc, color) {
			let e = ex.max(1).log10().floor()
			let e3 = ex.log(1e3).floor()
			let ill = e3.sub(1).round()
			if (ill.lt(1e3)) {
				let e3_mul = e3.mul(3)
				let m = ex.div(E(10).pow(e3_mul)).toFixed(Math.max(Math.max(e3.gte(1)?2:0,acc)-e.sub(e3_mul).toNumber(), 0))
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
			ill = E(10).pow(ill_2.sub(ill_2.floor()).mul(3)).toNumber()
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
			ST_NAMES[1][1][Math.floor(x / 10) % 10] +
			ST_NAMES[1][2][Math.floor(x / 100)]
		},
		tier2(x, color) {
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
		},
		tier3(x, color, mode) {
			return ST_NAMES[3][0][x]
		}
    },
    inf: {
      format(ex, acc, max) {
        let meta = 0
        let inf = E(Number.MAX_VALUE)
        let symbols = ["", "∞", "Ω", "Ψ", "ʊ"]
        let symbols2 = ["", "", "m", "mm", "mmm"]
        while (ex.gte(inf)) {
          ex = ex.log(inf)
          meta++
        }
  
        if (meta == 0) return format(ex, acc, max, "sc")
        if (ex.gte(3)) return symbols2[meta] + symbols[meta] + "ω^"+format(ex.sub(1), 3, max, "mixed_sc")
        if (ex.gte(2)) return symbols2[meta] + "ω" + symbols[meta] + "-"+format(inf.pow(ex.sub(2)), 3, max, "sc")
        return symbols2[meta] + symbols[meta] + "-"+format(inf.pow(ex.sub(1)), 3, max, "sc")
      }
    },
}

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