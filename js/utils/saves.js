var player
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
            active: 0,
            choosed: 0,
            comps: {},
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
        supernova: {
			maxMass: D(0),
			time: 0,
            times: D(0),
            post_10: false,
            stars: D(0),
            tree: [],
            chal: {
                noTick: true,
                noBHC: true,
            },
            bosons: {
                pos_w: D(0),
                neg_w: D(0),
                z_boson: D(0),
                photon: D(0),
                gluon: D(0),
                graviton: D(0),
                hb: D(0),
            },
            b_upgs: {
                photon: [],
                gluon: [],
            },
            fermions: {
                unl: false,
                points: [D(0),D(0)],
                tiers: [[D(0),D(0),D(0),D(0),D(0),D(0)],[D(0),D(0),D(0),D(0),D(0),D(0)]],
                choosed: "",
                choosed2: "",
                dual: true,
            },
            radiation: {
                hz: D(0),
                ds: [],
                bs: [],
            },
			auto: {
				on: -2,
				t: 0,
				toggle: true,
			}
        },
		shrt: {
			order: [[0, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
		},
        reset_msg: "",
        main_upg_msg: [0,0],
        tickspeed: D(0),
        options: {
			offline: true,

            notation: 'mix',
            notation_tetr: 'letter',
            notation_mass: 0,

            font: 'Verdana',
			progress: true,
            tree_animation: 0,
			chroma: false,
        },
        confirms: {},
		stats: {
			maxMass: D(0),
		},
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
    for (let x = 1; x <= CHALS.cols; x++) s.chal.comps[x] = D(0)
    for (let x = 0; x < CONFIRMS.length; x++) if (CONFIRMS_MOD[CONFIRMS[x]]()) s.confirms[CONFIRMS[x]] = true
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) s.md.upgs[x] = D(0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) s.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = D(0)
    for (let x = 0; x < 7; x++) {
        s.supernova.radiation.ds.push(D(0))
        s.supernova.radiation.bs.push(D(0),D(0))
    }

    return s
}

function wipe(reload=false) {
    if (reload) {
        wipe()
        loadGame(false, btoa(JSON.stringify(player)))
        save()
    } else player = getPlayerData()
	popup = []
}

function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)

    convertStringToDecimal()
    player.offline.mass = player.stats.maxMass.max(player.mass)
    player.reset_msg = ""
    player.main_upg_msg = [0,0]
    player.chal.choosed = 0
	if (typeof(player.options.notation_mass) == "boolean") player.options.notation_mass = player.options.notation_mass ? 1 : 0
	if (player.bh.eb2) player.bh.eb2 = D(player.bh.eb2)
	if (player.bh.eb3) player.bh.eb3 = D(player.bh.eb3)
	if (player.atom.eb2) player.atom.eb2 = D(player.atom.eb2)
	if (player.atom.eb3) player.atom.eb3 = D(player.atom.eb3)
	if (player.supernova.times.gte(1)) player.supernova.unl = true
	if (player.supernova.auto.on !== -2 && !player.supernova.auto.list) player.supernova.auto.on = -2
	player.supernova.tree = removeDuplicates(player.supernova.tree)
    for (i = 0; i < 2; i++) for (let x = 0; x < FERMIONS.types[i].length; x++) {
        let f = FERMIONS.types[i][x]
        player.supernova.fermions.tiers[i][x] = player.supernova.fermions.tiers[i][x].min(typeof f.maxTier == "function" ? f.maxTier() : f.maxTier || EINF)
    }
    let off_time = (Date.now() - player.offline.current)/1000
    if (off_time >= 60 && player.offline.active) player.offline.time += off_time
}

function deepNaN(obj, data) {
    for (let x = 0; x < Object.keys(obj).length; x++) {
        let k = Object.keys(obj)[x]
        if (typeof obj[k] == 'string') {
            if ((obj[k] == "NaNeNaN" || obj[k] == null) && Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
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

function convertStringToDecimal() {
    for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x] !== undefined) player.massUpg[x] = D(player.massUpg[x])
    for (let x = 1; x <= CHALS.cols; x++) player.chal.comps[x] = D(player.chal.comps[x])
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = D(player.md.upgs[x]||0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = D(player.supernova.b_upgs[BOSONS.upgs.ids[x]][y]||0)
}

function cannotSave() { return tmp.supernova.reached && player.supernova.times.lt(1) && !findNaN(player) }

function encode(x) {
	return btoa(JSON.stringify(x, function(k, v) { return v === Infinity ? "Infinity" : v; }))
}

function decode(x) {
	return JSON.parse(atob(x))
}

function save(auto){
    if (cannotSave()) return
    if (localStorage.getItem(saveId) == '') wipe()
    localStorage.setItem(saveId,encode(player))
    if (tmp.saving < 1 && !auto) {addNotify("Game Saved", 3); tmp.saving++}
}
setInterval(function() { save(true) }, 30000)

function load(x){
	try {
		if (typeof x == "string" & x != '') loadPlayer(decode(x))
		else wipe()
	} catch (error) {
		alert("Your save have been wiped due to not being valid!")
		console.error(error)
	}

	loadAPPlayer()
	updateAarex()
	changeFont()
}

function download_save() {
    if (findNaN(player)) {
        addNotify("Error Exporting, because it got NaNed")
        return
    }

    let str = encode(player)
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = getSaveTitle() + " - " + new Date().toGMTString()+".txt"
    a.click()
}

function export_save() {
    if (findNaN(player)) {
        addNotify("Error Exporting, because it got NaNed")
        return
    }

    let str = encode(player)
    let copyText = document.getElementById('copy')
    copyText.value = btoa(JSON.stringify(player))
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
    addNotify("Copied to Clipboard")
}

function import_save(input) {
    let loadgame = input || prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame == 'monke') {
        addNotify('monke<br><img style="width: 100%; height: 100%" src="https://i.kym-cdn.com/photos/images/original/001/132/314/cbc.jpg">')
        return
    }
    if (loadgame == 'matt parker') {
        addNotify('2+2=5<br><img src="https://cdn2.penguin.com.au/authors/400/106175au.jpg">')
        return
    }
    if (loadgame == 'SUPERNOVA.get()') {
        addNotify('<img src="https://steamuserimages-a.akamaihd.net/ugc/83721257582613769/22687C6536A50ADB3489A721A264E0EF506A89B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false">',6)
        return
    }
    if (loadgame == 'aarex') {
        addNotify('Oh. Check out my other stuff, if you are interested on me. https://aarextiaokhiao.github.io/',6)
        return
    }
    if (loadgame == 'altrascendum') {
        addNotify('Altrascendum: The Destiny of Alternative Path. Hope you enjoy!',6)
        return
    }
    if (loadgame != null) {
        try {
			let safe = decode(loadgame)
			if (safe) {
				setTimeout(_=>{
					if (findNaN(loadgame, true)) {
						addNotify("Error Importing, because it got NaNed")
						return
					}
					load(loadgame)
					save()
					loadGame(false, loadgame)
				}, 200)
			}
        } catch (error) {
			addNotify("Error Importing")
		}
    }
}

const import_input = document.getElementById('import_file');
function import_file(event) {
	import_save(event.target.result);
}
/*import_input.addEventListener('change', (event) => {
	const reader = new FileReader()
	reader.onload = handleFileLoad;
	reader.readAsText(event.target.files[0])
});*/

let lastLoad = 0
function loadGame(start=true, save) {
	if (start) {
		console.warn("// IM: Altrascendum - Created by Aarex //")
		getMetaSave()
	}
	saveId = getSaveId()

	wipe()
	load(save || localStorage.getItem(saveId))
	lastLoad = new Date().getTime()

	resetTemp()
	for (let x = 0; x < 3; x++) updateTemp()

	if (start) {
		setupHTML()
		updatePopup()

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
		setInterval(loop, 50)
		setInterval(updateScreensHTML, 50)
		treeCanvas()
		updateShortcuts()
		setInterval(drawTreeHTML, 10)
		setInterval(checkNaN, 1000)
		setInterval(updateShortcuts, 1000)
	}
}

function checkNaN() {
	if (findNaN(player) || findNaN(tmp.massGain)) {
		if (new Date().getTime() - lastLoad < 60000) wipe(true)
		else {
			loadGame(false)
			addNotify("Game Data got NaNed")
		}
	}
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

function reportNaN(obj, k, t) {
	console.error("// [ERROR: NAN!] (" + t + ", " + k + ") //")
	return true
}