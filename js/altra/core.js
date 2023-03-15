//ON LOAD
let beta = true
let betaLink = "2-chroma"
let betaVer = "3/14/23"
let betaVerNum = 230314.00
let betaSave = "testBeta"

let globalSaveId = beta ? betaSave : "testSave"
let metaSaveId = btoa(globalSaveId + "_meta")
saveId = ""
function switchSave(id) {
	saveId = id || getSaveId()
	load(localStorage.getItem(saveId))
}

function fixAPPlayer() {
	if (player.mg) player.mg = deepUndefinedAndDecimal(player.mg, MAGIC.setup())
	if (player.ext) player.ext = deepUndefinedAndDecimal(player.ext, EXT.setup())
}

function loadAPPlayer() {
	deleteAPWaste()
	fixAPPlayer()

	//versions
	if (player.ap_ver) checkAPVers()
	player.ap_ver = currentAPVer
	player.ap_build = betaVerNum
}

function deleteAPWaste() {
	delete player.chal.active
	if (player.ext) {
		delete player.ext.ch
		delete player.ext.pr
	}
	if (player.ext?.ax) {
		delete player.ext.ax.upgs
	}

	delete player.offline.active
	delete player.options.tetr
	delete player.options.pure
	delete player.options.noChroma
	delete player.confirms.ec
	delete player.aarex
}

function skipToRadiation() {
	if (!confirm("Are you want to skip into Radiation?")) return

	player.autoMassUpg = [null, true, true, true]
	player.auto_mainUpg.rp = true
	player.auto_mainUpg.bh = true
	player.auto_mainUpg.atom = true
	player.auto_ranks.rank = true
	player.auto_ranks.tier = true
	player.auto_ranks.tetr = true
	player.rp.unl = true
	player.autoTickspeed = true
	player.bh.unl = true
	player.bh.condenser = D(10)
	player.bh.autoCondenser = true
	player.atom.unl = true
	player.atom.auto_gr = true
	for (var i = 1; i <= 54; i++) player.atom.elements.push(i)
	player.supernova.unl = true
	player.supernova.post_10 = true
	player.supernova.stars = D(1e50)
	player.supernova.times = D(40)
	player.supernova.fermions.tiers = [[D(15), D(23), D(11), D(3), D(0), D(0)], [D(42), D(24), D(16), D(5), D(0), D(0)]]
	player.chal.comps[9] = D(50)
	player.chal.comps[10] = D(10)

	let list = ["c"]
	list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5")
	list = list.concat("qol1","qol2","qol3","qol4","qol5","qol6","qol7","qol8")
	list = list.concat("s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")
	list = list.concat("bs1","bs2","bs3","bs4","fn1","fn2","fn3","fn4","fn5","fn6")
	list = list.concat("unl1")
	player.supernova.tree = list

	SUPERNOVA.doReset()
}

//VERSIONING
let currentAPVer = "0.5.1"

function getAPVer(ver) {
	if (!ver) return "0.0.0"
	if (typeof(ver) == "number") return "0.5.1"
	return ver.split(".")
}

function gtAPVer(a, b) {
	a = getAPVer(a)
	b = getAPVer(b)

	for (var i in a) {
		if (a[i] > b[i]) return true
		if (a[i] < b[i]) return false
	}
	return false
}

function gteAPVer(a, b) {
	a = getAPVer(a)
	b = getAPVer(b)

	for (var i in a) {
		if (a[i] > b[i]) return true
		if (a[i] < b[i]) return false
	}
	return true
}

//SAVE UPDATING
function checkAPVers() {
	if (gteAPVer("0.5.1", player.ap_ver)) {
		if (player.ap_build < 220901.1 && EXT.unl()) {
			alert("Due to a big rebalance, you have to go back to the beginning of Exotic!")
			player.ext = EXT.setup()
			player.ext.amt = D(1)
			player.ext.unl = true

			player.supernova.tree = ["c"]
			CHALS.clear(3)
			
			resetTemp()
			EXT.reset(true)
		}
		if (player.ap_build < 220912) {
			player.options.offline = !player.offline.active
			player.options.notation_tetr = player.options.tetr
			player.options.notation_mass = player.options.pure
			player.options.chroma = !player.options.noChroma
		}
		if (player.ap_build < 221004) {
			player.confirms.chal = player.confirms.ec
			player.options.aarTheme = player.aarex
		}
	}
	if (gtAPVer(currentAPVer, player.ap_ver)) addPopup(POPUP_GROUPS.ap_update)
}

//HTML
function setupAltraHTML() {
	//Exotic
	setupExtMilestonesHTML()
	setupAxionHTML()

	//Others
	setupMilestonesHTML()
	setupShortcuts()
	setupCompressionHTML()
}

function updateAarex(toggle) {
	document.querySelectorAll("link").forEach( function(e) {
		if (e.href.includes("aarex.css")) e.remove();
	});

	if (toggle) player.options.aarTheme = !player.options.aarTheme

	if (player.options.aarTheme) {
		var head = document.head;
		var link = document.createElement('link');
		
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = "aarex.css";

		head.appendChild(link);
	}

	document.getElementById("aarex_active").textContent = player.options.aarTheme ? "ON" : "OFF"
}

function updateResourceLayout(toggle) {
	if (toggle) {
		if (player.options.resLayout.num >= 4) {
			player.options.resLayout.col = !player.options.resLayout.col
			player.options.resLayout.num = 2
		} else player.options.resLayout.num++
		reloadAppendChild()
	}
	document.getElementById("res_layout").textContent = player.options.resLayout.num + (player.options.resLayout.col ? " columns" : " rows")
}

//OTHERS
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

function getProd(x, id) {
	return addProdWorth(x, id, 1).sub(x)
}

//formatGain without Compression
//getProdDisp with Compression
function getProdDisp(x, id, isMass, isMain) {
	return formatGain(x, getProd(x, id), isMass, isMain)
}

//do not use this without Compression
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

//TEMP
function updateAltraTemp() {
	//Exotic
	EXT.updateTmp()

	//Others
	updateMilestoneTemp()
}

//TECHNICAL / FUTURE
paused = false
future = false