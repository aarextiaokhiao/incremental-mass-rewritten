//ON LOAD
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

//BETA
let beta = true
let betaLink = "2-chroma"
let betaVer = "4/28/23"
let betaVerNum = 230428.00
let betaSave = "testBeta"

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