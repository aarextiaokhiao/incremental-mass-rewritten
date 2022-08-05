//VERSIONING
let beta = true
let betaLink = "2-chroma"
let betaVer = "8/4/22"
let betaSave = "testBeta"

let globalSaveId = beta ? betaSave : "testSave"
let metaSaveId = btoa(globalSaveId + "_meta")
saveId = ""

function checkAPVers() {
	if (player.ap_ver == 0) addPopup(POPUP_GROUPS.ap_chroma)
	else {
		if (player.ap_ver < 1) addPopup(POPUP_GROUPS.ap_chroma)
	}
	if (player.ap_ver < 1.001) {
		player.ext.ax.res[2] = E(0)
		for (var i = 8; i < 12; i++) player.ext.ax.upgs[i] = E(0)
	}
	if (player.ap_ver < 1.002) {
		if (player.ext.ch.tones) {
			if (player.ext.ch.tones[0]) player.ext.toned = 1
			if (player.ext.ch.tones[1]) player.ext.toned = 2
			if (player.ext.ch.tones[2]) {
				alert("Due to reworks of toning, you need to rise Exotic! ~ Aarex")
				EXT.reset(true)

				player.chal.comps[13] = E(20)
				player.chal.comps[14] = E(4)

				player.ext.amt = player.ext.amt.min(EXT.amt("e3e4"))
				for (var i = 0; i < 2; i++) player.ext.ax.res[i] = E(0)
				for (var i = 0; i < 12; i++) player.ext.ax.upgs[i] = E(3)
				player.ext.ch.bp = E(0)
				player.ext.toned = 3
			}
			delete player.ext.ch.tones
		}
	}
	player.ap_ver = 1.002
}

function skipToRadiation() {
	if (!confirm("Are you want to skip into Radiation?")) return

	for (var i = 1; i <= 10; i++) player.mainUpg.atom.push(i)
	player.autoMassUpg = [null, true, true, true]
	player.auto_mainUpg.rp = true
	player.auto_mainUpg.bh = true
	player.auto_mainUpg.atom = true
	player.autoTickspeed = true
	player.auto_ranks.rank = true
	player.auto_ranks.tier = true
	player.auto_ranks.tetr = true
	player.rp.unl = true
	player.bh.unl = true
	player.atom.unl = true
	player.supernova.unl = true
	player.supernova.post_10 = true
	player.supernova.times = E(25)
	player.chal.comps[9] = E(10)
	player.chal.comps[10] = E(10)

	let list = ["c"]
	list = list.concat("chal1","chal2","chal3","chal4","chal4a","chal5")
	list = list.concat("qol1","qol2","qol3","qol4","qol5","qol6")
	list = list.concat("s1","s2","s3","s4","sn1","sn2","sn3","sn4","sn5","m1","m2","m3","rp1","bh1","bh2","t1","gr1","gr2","d1")
	list = list.concat("bs1","bs2","bs3","bs4","fn1","fn2","fn3","fn4","fn5")
	list = list.concat("unl1")
	player.supernova.tree = list

	SUPERNOVA.doReset()
}

//HTML
function setupAltraHTML() {
	//Exotic
	setupAxionHTML()
	setupGlueballHTML()
	setupPrimHTML()
}

function updateAarex(toggle) {
	document.querySelectorAll("link").forEach( function(e) {
		if (e.href.includes("aarex.css")) e.remove();
	});

	if (toggle) player.aarex = !player.aarex

	if (player.aarex) {
		var head = document.head;
		var link = document.createElement('link');
		
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = "aarex.css";

		head.appendChild(link);
	}

	document.getElementById("aarex_active").textContent = player.aarex ? "ON" : "OFF"
}

//TECHNICAL / FUTURE
paused = false
future = false

let PRES = {
	unl() {
		return false
	},
	doReset() {
		player.ext.amt = E(0)
		player.ext.toned = 0
		for (var i = 0; i < 3; i++) player.ext.ax.res[i] = E(0)
		for (var i = 0; i < 12; i++) player.ext.ax.upgs[i] = E(0)
		player.ext.ch.bp = E(0)
		player.ext.ch.upg = []
		player.ext.pr.f = {}

		player.supernova.tree = ["c", "eb1", "eb2"]
		for (var i = 1; i <= 11; i++) player.supernova.tree.push("feat"+i)
		EXT.doReset(true)
	},
	story() {
		addPopup(POPUP_GROUPS.pres_1)
		addPopup(POPUP_GROUPS.pres_2)
		addPopup(POPUP_GROUPS.pres_3)
		addPopup(POPUP_GROUPS.pres_4)
	}
}