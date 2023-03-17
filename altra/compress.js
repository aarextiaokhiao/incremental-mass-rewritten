//formatGain without Compression
//getProdDisp with Compression
//Do not use this without Compression

//Compression
const COMPRESS_ROWS = ["base", "exp", "dil", "log"]
const COMPRESS_DATA = {
	mass: {
		name: "Mass",
		color: "gray",

		base: () => FORMS.massGain(),
		exp: () => D(1),
		dil: () => D(1),
		log: () => false,
	},
	bh: {
		name: "BH Mass",
		color: "yellow",

		base: () => FORMS.bh.massGain(),
		exp: () => D(1),
		dil: () => D(1),
		log: () => false,
	},
	/*star: {
		name: "Star Generators",
		color: "orange",

		base: () => D(1),
		exp: () => D(1),
		dil: () => D(1),
		log: () => false,
	},
	rad: {
		name: "Radiation",
		color: "magenta",

		base: () => D(1),
		exp: () => D(1),
		dil: () => D(1),
		log: () => false,
	}*/
}

function setupCompressionHTML() {
	for (const [di, d] of Object.entries(COMPRESS_DATA)) {
		for (const [ri, r] of Object.entries(document.getElementById("compress_table").rows)) {
			const dom = r.insertCell()

			if (ri>0) dom.id = `compress_${di}_${COMPRESS_ROWS[ri-1]}`
			else dom.innerHTML = `<u style='font-size: 20px'>${d.name}</u>`
			dom.className = d.color
		}
	}
}

function updateCompressionHTML() {
	for (const [di, d] of Object.entries(tmp.compress)) {
		elm[`compress_${di}_base`].setHTML(format(d.base.root(d.exp))+"x")
		elm[`compress_${di}_exp`].setHTML("^"+format(d.exp.root(d.dil)))
		elm[`compress_${di}_dil`].setHTML("^"+format(d.dil))
		elm[`compress_${di}_log`].setHTML(d.log ? "Yes" : "")
	}
}

function getProd(x, id) {
	return addProdWorth(x, id, 1).sub(x)
}

function getProdDisp(x, id, isMass, isMain) {
	return formatGain(x, getProd(x, id), isMass, isMain)
}

function addProdWorth(x, id, dt) {
	const data = tmp.compress[id]
	return decompressProdWorth(compressProdWorth(x, data).add(dt), data).max(x)
}

function compressProdWorth(x, data) {
	x = D(x)

	if (data.log) x = x.add(1).log10()
	if (Decimal.neq(data.base, 1)) x = x.div(data.base)
	if (x.gt(1)) {
		x = x.log10()
		if (Decimal.neq(data.exp, 1)) x = x.div(data.exp)
		if (x.gt(1) && Decimal.neq(data.dil, 1)) x = x.root(data.dil)
		x = x.pow10()
	}

	return x
}

function decompressProdWorth(x, data) {
	x = D(x)

	if (x.gt(1)) {
		x = x.log10()
		if (x.gt(1) && Decimal.neq(data.dil, 1)) x = x.pow(data.dil)
		if (Decimal.neq(data.exp, 1)) x = x.mul(data.exp)
		x = x.pow10()
	}
	if (Decimal.neq(data.base, 1)) x = x.mul(data.base)
	if (data.log) x = x.pow10().sub(1)

	return x
}

function calcProd(key) {
	let value = COMPRESS_DATA[key]
	tmp.compress[key] = {}

	if (value.log()) {
		tmp.compress[key] = {
			log: true,
			base: value.exp().add(value.base().max(1).log10()).div(2),
			exp: value.dil().div(5),
			dil: D(1)
		}
	} else {
		tmp.compress[key] = {
			base: value.base(),
			exp: value.exp(),
			dil: value.dil()
		}
	}

	return tmp.compress[key]
}