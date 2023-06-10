function getPlayerData() {
	let s = {
		mass: D(0),
		ranks: {
			rank: D(0),
			tier: D(0),
			tetr: D(0),
			pent: D(0),
		},
		auto_ranks: {
			rank: false,
			tier: false,
		},
		auto_mainUpg: {
			
		},
		massUpg: {},
		autoMassUpg: [null,false,false,false],
		autoTickspeed: false,
		mainUpg: {},
		ranks_reward: 0,
		scaling_ch: 0,
		rp: {
			points: D(0),
			unl: false,
		},
		bh: {
			unl: false,
			dm: D(0),
			mass: D(0),
			condenser: D(0),
			autoCondenser: false,
		},
		chal: {
			unl: false,
			choosed: 0,
			comps: {},

			//IM:A CHALLENGES?!
			progress: {},
			lastComps: {},
			bulkComps: {},
		},
		atom: {
			unl: false,
			points: D(0),
			atomic: D(0),
			auto_gr: false,
			gamma_ray: D(0),
			quarks: D(0),
			particles: [D(0), D(0), D(0)],
			powers: [D(0), D(0), D(0)],
			ratio: 0,
			dRatio: [1,1,1],
			elements: [],
		},
		md: {
			active: false,
			particles: D(0),
			mass: D(0),
			upgs: [],
		},
		stars: {
			unls: 0,
			boost: D(0),
			points: D(0),
			generators: [D(0),D(0),D(0),D(0),D(0)],
		},
		supernova: getSupernovaSave(),
		shrt: {
			order: [[0, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
		},
		main_upg_msg: [0,0],
		tickspeed: D(0),
		options: {
			offline: true,

			notation: 'mix',
			notation_tetr: 'letter',
			notation_mass: 0,

			font: 'Verdana',
			resLayout: {
				num: 2,
				col: false
			},
			progress: true,

			tree_animation: 0,
			chroma: false,
		},
		confirms: {
			sn: true,
			ext: true
		},
		stats: {
			maxMass: D(0),
		},
		ach: {},
		offline: {
			current: Date.now(),
			time: 0,
		},
		time: 0,
	}
	for (let x = 1; x <= UPGS.main.cols; x++) {
		s.auto_mainUpg[UPGS.main.ids[x]] = false
		s.mainUpg[UPGS.main.ids[x]] = []
	}
	for (let x = 1; x <= CHAL_NUM; x++) s.chal.comps[x] = D(0)
	for (let x = 0; x < CONFIRMS.length; x++) if (CONFIRMS_MOD[CONFIRMS[x]]()) s.confirms[CONFIRMS[x]] = true
	for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) s.md.upgs[x] = D(0)

	return s
}

function newPlayer() {
	player = getPlayerData()
}

/* SAVING */
function cannotSave() { return false }
function save(manual) {
	if (cannotSave()) return
	if (findNaN(player)) return

	let str = btoa(JSON.stringify(player))
	tmp.prevSave = localStorage.getItem(saveId)
	localStorage.setItem(saveId, str)

	if (manual) notify("Game Saved")
}

let saveInterval
function resetSaveInterval() {
	clearInterval(saveInterval)
	saveInterval = setInterval(save, 30000)
}

/* LOADING */
lastLoad = 0
function load(str) {
	let data
	if (str && str !== null) data = JSON.parse(atob(str))
	if (data && safecheckSave(data)) loadPlayer(data)
	else newPlayer()

    onLoaded()

	lastLoad = new Date().getTime()
	resetSaveInterval()
	resetTemp()
	for (let x = 0; x < 50; x++) updateTemp()
}

function loadGame() {
	console.log("// IM: Altrascendum - Created by Aarex //")
	getMetaSave()
	switchSave()

	setupHTML()
	updateHTML()

	for (let x = 0; x < 3; x++) {
		let r = document.getElementById('ratio_d'+x)
		r.value = player.atom.dRatio[x]
		r.addEventListener('input', e=>{
			let n = Number(e.target.value)
			if (n < 1) {
				player.atom.dRatio[x] = 1
				r.value = 1
			} else {
				if (Math.floor(n) != n) r.value = Math.floor(n)
				player.atom.dRatio[x] = Math.floor(n)
			}
		})
	}
	if (beta) {
		document.getElementById("ver").textContent = "[" + betaVer + " BETA BUILD]"
		document.getElementById("ver").className = "red"
		document.getElementById("beta").style.display = "none"
	}

	treeCanvas()
	setInterval(loop, 50)
	setInterval(checkNaN, 1000)
	setInterval(obtainAchs, 1000)
}

function export_save() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	let copyText = document.getElementById('copy')
	copyText.value = str
	copyText.style.visibility = "visible"
	copyText.select();
	document.execCommand("copy");
	copyText.style.visibility = "hidden"
	notify("Exported to clipboard")
}

function download_save() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	let file = new Blob([str], {type: "text/plain"})
	window.URL = window.URL || window.webkitURL;
	let a = document.createElement("a")
	a.href = window.URL.createObjectURL(file)
	a.download = "IM Altrascendum - "+new Date().toGMTString()+".txt"
	a.click()
}

function import_save() {
	let loadgame = prompt("Paste your save. WARNING: THIS WILL OVERWRITE THIS SAVE!")
	if (loadgame == 'monke') {
		notify('monke<br><img style="width: 100%; height: 100%" src="https://i.kym-cdn.com/photos/images/original/001/132/314/cbc.jpg">')
		return
	}
	if (loadgame == 'matt parker') {
		notify('2+2=5<br><img src="https://cdn2.penguin.com.au/authors/400/106175au.jpg">')
		return
	}
	if (loadgame == 'SUPERNOVA.get()') {
		notify('<img src="https://steamuserimages-a.akamaihd.net/ugc/83721257582613769/22687C6536A50ADB3489A721A264E0EF506A89B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false">',6)
		return
	}
	if (loadgame == 'aarex') {
		notify('Oh. Check out my other stuff, if you are interested on me. https://aarextiaokhiao.github.io/',6)
		return
	}
	if (loadgame == 'altrascendum') {
		notify('Altrascendum: The Destiny of Alternative Path. Hope you enjoy!',6)
		return
	}
	if (loadgame != null) {
		let keep = player
		try {
			let data = JSON.parse(atob(loadgame))
			if (!safecheckSave(data)) return
			load(loadgame)
			save()
		} catch (error) {
			notify("Error importing")
			console.error(error, error.msg)
			player = keep
		}
	}
}

function wipe() {
	if (!confirm('Are you sure you want to RESET your progress to new game?')) return
	if (!confirm("This will reset everything, with no rewards! Are you really sure to wipe?")) return
	alert("If you did that accidentally, you can reload to retrieve your save. However, you have 30 seconds to think!")
	notify("If you did that accidentally, you can reload to retrieve your save. However, you have 30 seconds to think!", 30)
	load() //blank save
}

/* ON LOAD */
function loadPlayer(data) {
	player = deepUndefinedAndDecimal(data, getPlayerData())
	convertStringToDecimal()
	correctSaveErrors()
	loadAPPlayer()
}

function onLoaded() {
    player.main_upg_msg = [0,0]
    player.chal.choosed = 0

    player.offline.mass = player.stats.maxMass.max(player.mass)
    let off_time = (Date.now() - player.offline.current)/1000
    if (off_time >= 60 && player.options.offline) player.offline.time += off_time

	updateAarex()
	changeFont()
}

function convertStringToDecimal() {
	for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x] !== undefined) player.massUpg[x] = D(player.massUpg[x])
	for (let x = 1; x <= CHAL_NUM; x++) {
		player.chal.comps[x] = D(player.chal.comps[x])
		player.chal.lastComps[x] = D(player.chal.lastComps[x])
		player.chal.bulkComps[x] = D(player.chal.bulkComps[x])
	}
	for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = D(player.md.upgs[x]||0)
	for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = D(player.supernova.b_upgs[BOSONS.upgs.ids[x]][y]||0)

	if (player.bh.eb2) player.bh.eb2 = D(player.bh.eb2)
	if (player.bh.eb3) player.bh.eb3 = D(player.bh.eb3)
	if (player.atom.eb2) player.atom.eb2 = D(player.atom.eb2)
	if (player.atom.eb3) player.atom.eb3 = D(player.atom.eb3)
}

function correctSaveErrors() {
	if (typeof(player.options.notation_mass) == "boolean") player.options.notation_mass = player.options.notation_mass ? 1 : 0
	if (player.supernova.times.gte(1)) player.supernova.unl = true
	if (player.supernova.auto.on !== -2 && !player.supernova.auto.list) player.supernova.auto.on = -2
	player.supernova.tree = removeDuplicates(player.supernova.tree)
    for (i = 0; i < 2; i++) for (let x = 0; x < FERMIONS.types[i].length; x++) {
        let f = FERMIONS.types[i][x]
        player.supernova.fermions.tiers[i][x] = player.supernova.fermions.tiers[i][x].min(typeof f.maxTier == "function" ? f.maxTier() : f.maxTier || EINF)
    }
}

/* SAFECHECKING */
function safecheckSave(data) {
	if (data.qu?.reached) {
		notify("Your save fails to load, because you have Quantum unlocked!")
		return false
	}
	if (findNaN(data, true)) {
		notify("Your save fails to load, because it got NaNed!")
		return false
	}

	return true
}

function deepUndefinedAndDecimal(obj, data) {
	if (obj == null) return data
	for (let x = 0; x < Object.keys(data).length; x++) {
		let k = Object.keys(data)[x]
		if (obj[k] === null) continue
		if (obj[k] === undefined) obj[k] = data[k]
		else {
			if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = D(obj[k])
			else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
		}
	}
	return obj
}

/* SAVE CHECKING */
function checkNaN() {
	if (findNaN(player)) {
		notify("Game Data got NaNed")
		load(lastLoad + 60000 > Date.now() ? undefined : localStorage.getItem(saveId))
	}
}

function reportNaN(obj, k, t) {
	console.error("// [ERROR: NAN!] (" + t + ", " + k + ") //")
	return true
}

function isDecimalNaN(x) {
	x = D(x)
	return Number.isNaN(x.mag) || Number.isNaN(x.sign)
}

function findNaN(obj, str=false, data=getPlayerData()) {
	if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
	for (let x = 0; x < Object.keys(obj).length; x++) {
		let k = Object.keys(obj)[x]
		if (typeof obj[k] == "number") if (isNaN(obj[k]) || !isFinite(obj[k])) return reportNaN(obj, k, "number")
		if (str) {
			if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isDecimalNaN(obj[k])) return reportNaN(obj, k, "string")
		} else {
			if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isDecimalNaN(obj[k])) return reportNaN(obj, k, "decimal")
		}
		if (typeof obj[k] == "object") return findNaN(obj[k], str, data[k])
	}
	return false
}

/* OTHERS */
function getSaveTitle() {
	return inNGM() ? "IM:A Minus" : "IM: Altrascendum"
}

function switchSave(id) {
	saveId = id || getSaveId()
	load(localStorage.getItem(saveId))
}