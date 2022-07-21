//VERSIONING
let beta = true
let betaLink = "2-chroma"
let betaVer = "7/20/22"
let betaSave = "testBeta"

let saveId = beta ? betaSave : "testSave"

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

//FUTURE
future = false

let PRES = {
	unl() {
		return future
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