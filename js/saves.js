function E(x){return new Decimal(x)};

const EINF = Decimal.dInf

function uni(x) { return E(1.5e56).mul(x) }
function mlt(x) { return uni(E(10).pow(E(1e9).mul(x))) }
function meg(x) { return mlt(E(10).pow(E(1e9).mul(x))) }

Decimal.prototype.modular=Decimal.prototype.mod=function (other){
    other=E(other);
    if (other.eq(0)) return E(0);
    if (this.sign*other.sign==-1) return this.abs().mod(other.abs()).neg();
    if (this.sign==-1) return this.abs().mod(other.abs());
    return this.sub(this.div(other).floor().mul(other));
};

function calc(dt, dt_offline) {
	//PRE-DARK MATTER
	player.mass = player.mass.add(tmp.massGain.mul(dt))
	player.supernova.maxMass = player.supernova.maxMass.max(player.mass)
	if (CHROMA.unl() && tmp.md.active && player.mass.gt(player.stats.maxMass)) player.ext.chal.f11 = true
	player.stats.maxMass = player.stats.maxMass.max(player.mass)

	if (hasUpgrade('rp',3)) for (let x = 1; x <= UPGS.mass.cols; x++) if (player.autoMassUpg[x] && (hasRank("rank", x) || hasUpgrade('atom',1))) UPGS.mass.buyMax(x)
	if (FORMS.tickspeed.autoUnl() && player.autoTickspeed) FORMS.tickspeed.buyMax()
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		if (RANKS.autoUnl[rn]() && player.auto_ranks[rn]) RANKS.bulk(rn)
	}
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let upg = UPGS.main[x]
		if (upg.auto_unl ? upg.auto_unl() : false) if (player.auto_mainUpg[id]) for (let y = 1; y <= upg.lens; y++) if (upg[y].unl ? upg[y].unl() : true) upg.buy(y)
	}
	if (hasUpgrade('bh',6) || hasUpgrade('atom',6)) player.rp.points = player.rp.points.add(tmp.rp.gain.mul(dt))

	//DARK MATTER
	if (hasUpgrade('atom',6)) player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain.mul(dt))
	if (player.bh.unl && tmp.pass) {
		if (FORMS.bh.condenser.autoUnl() && player.bh.autoCondenser) FORMS.bh.condenser.buyMax()
		player.bh.mass = player.bh.mass.add(tmp.bh.mass_gain.mul(dt))
		if (player.bh.eb2 && player.bh.eb2.gt(0)) {
			var pow = tmp.eb.bh2 ? tmp.eb.bh2.eff : E(0.001)
			var log = tmp.eb.bh3 ? tmp.eb.bh3.eff : E(.1)
			var ss = tmp.bh.rad_ss
			var logProd = tmp.bh.mass_gain.max(10).softcap(ss,0.5,2).log10()

			var newMass = player.bh.mass.log10().div(logProd).root(log)
			newMass = newMass.add(pow.mul(dt))
			newMass = E(10).pow(newMass.pow(log).mul(logProd))
			if (newMass.gt(player.bh.mass)) player.bh.mass = newMass
		}
	}

	if (player.mass.gte(1.5e136)) player.chal.unl = true
	if (hasTree("qol6")) CHALS.exit(true)
	if (hasTree("qol_ext8")) {
		let max = 8
		for (var c = 1; c <= max; c++) player.chal.comps[c] = CHALS.getChalData(c,E(0),true).bulk.min(tmp.chal.max[c]).max(player.chal.comps[c])
	}

	calcAtoms(dt, dt_offline)
	calcSupernova(dt, dt_offline)
	EXT.calc(dt)

	player.offline.time = Math.max(player.offline.time-tmp.offlineMult*dt_offline,0)
	player.supernova.time += dt
	player.ext.time += dt
	player.time += dt
	tmp.tree_time = (tmp.tree_time+dt_offline) % 3

	tmp.pass = true
}

function getPlayerData() {
    let s = {
        mass: E(0),
        ranks: {
            rank: E(0),
            tier: E(0),
            tetr: E(0),
            pent: E(0),
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
        mainUpg: {
            
        },
        ranks_reward: 0,
        scaling_ch: 0,
        rp: {
            points: E(0),
            unl: false,
        },
        bh: {
            unl: false,
            dm: E(0),
            mass: E(0),
            condenser: E(0),
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
            points: E(0),
            atomic: E(0),
            auto_gr: false,
            gamma_ray: E(0),
            quarks: E(0),
            particles: [E(0), E(0), E(0)],
            powers: [E(0), E(0), E(0)],
            ratio: 0,
            dRatio: [1,1,1],
            elements: [],
        },
        md: {
            active: false,
            particles: E(0),
            mass: E(0),
            upgs: [],
        },
        stars: {
            unls: 0,
            boost: E(0),
            points: E(0),
            generators: [E(0),E(0),E(0),E(0),E(0)],
        },
        supernova: {
			maxMass: E(0),
			time: 0,
            times: E(0),
            post_10: false,
            stars: E(0),
            tree: [],
            chal: {
                noTick: true,
                noBHC: true,
            },
            bosons: {
                pos_w: E(0),
                neg_w: E(0),
                z_boson: E(0),
                photon: E(0),
                gluon: E(0),
                graviton: E(0),
                hb: E(0),
            },
            b_upgs: {
                photon: [],
                gluon: [],
            },
            fermions: {
                unl: false,
                points: [E(0),E(0)],
                tiers: [[E(0),E(0),E(0),E(0),E(0),E(0)],[E(0),E(0),E(0),E(0),E(0),E(0)]],
                choosed: "",
                choosed2: "",
                dual: true,
            },
            radiation: {
                hz: E(0),
                ds: [],
                bs: [],
            },
			auto: {
				on: -2,
				t: 0,
				toggle: true,
			}
        },
        ext: EXT.setup(),
		shrt: {
			//[a, b]:
			//a = 0: empty
			//a = 1: mass dilation
			//a = 2: challenge
			//a = 3: fermion
			order: [[0, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
		},
        reset_msg: "",
        main_upg_msg: [0,0],
        tickspeed: E(0),
        options: {
            font: 'Verdana',
            notation: 'mixed_sc',
            tree_animation: 0,
			noChroma: true
        },
        confirms: {},
		stats: {
			maxMass: E(0),
		},
        offline: {
            active: true,
            current: Date.now(),
            time: 0,
        },
		ap_ver: 1.002,
        time: 0,
    }
    for (let x = 1; x <= UPGS.main.cols; x++) {
        s.auto_mainUpg[UPGS.main.ids[x]] = false
        s.mainUpg[UPGS.main.ids[x]] = []
    }
    for (let x = 1; x <= CHALS.cols; x++) s.chal.comps[x] = E(0)
    for (let x = 0; x < CONFIRMS.length; x++) s.confirms[CONFIRMS[x]] = true
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) s.md.upgs[x] = E(0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) s.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)
    for (let x = 0; x < 7; x++) {
        s.supernova.radiation.ds.push(E(0))
        s.supernova.radiation.bs.push(E(0),E(0))
    }
    return s
}

function wipe(reload=false) {
    if (reload) {
        wipe()
        loadGame(false, btoa(JSON.stringify(player)))
        save()
    } else player = getPlayerData()
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
	if (player.bh.eb2) player.bh.eb2 = E(player.bh.eb2)
	if (player.bh.eb3) player.bh.eb3 = E(player.bh.eb3)
	if (player.atom.eb2) player.atom.eb2 = E(player.atom.eb2)
	if (player.atom.eb3) player.atom.eb3 = E(player.atom.eb3)
	if (player.supernova.times.gte(1)) player.supernova.unl = true
	if (player.supernova.auto.on !== -2 && !player.supernova.auto.list) player.supernova.auto.on = -2
	player.supernova.tree = removeDuplicates(player.supernova.tree)
    for (i = 0; i < 2; i++) for (let x = 0; x < FERMIONS.types[i].length; x++) {
        let f = FERMIONS.types[i][x]
        player.supernova.fermions.tiers[i][x] = player.supernova.fermions.tiers[i][x].min(typeof f.maxTier == "function" ? f.maxTier() : f.maxTier||1/0)
    }
	if (player.ext.ch.sp) player.ext.ch = CHROMA.setup()
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
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
        }
    }
    return obj
}

function convertStringToDecimal() {
    for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x] !== undefined) player.massUpg[x] = E(player.massUpg[x])
    for (let x = 1; x <= CHALS.cols; x++) player.chal.comps[x] = E(player.chal.comps[x])
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(player.md.upgs[x]||0)
    for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(player.supernova.b_upgs[BOSONS.upgs.ids[x]][y]||0)
}

function cannotSave() { return tmp.supernova.reached && player.supernova.times.lt(1) }

function encode(x) {
	return btoa(JSON.stringify(x, function(k, v) { return v === Infinity ? "Infinity" : v; }))
}

function decode(x) {
	return JSON.parse(atob(x))
}

function save(auto){
    let str = encode(player)
    if (cannotSave() || findNaN(str, true)) return
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
	}
	updateAarex()
	changeFont()
}

function exporty() {
    let str = encode(player)
    if (findNaN(str, true)) {
        addNotify("Error Exporting, because it got NaNed")
        return
    }

    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "IM Altrascendum - "+new Date().toGMTString()+".txt"
    a.click()
}

function export_copy() {
    let str = encode(player)
    if (findNaN(str, true)) {
        addNotify("Error Exporting, because it got NaNed")
        return
    }

    let copyText = document.getElementById('copy')
    copyText.value = btoa(JSON.stringify(player))
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
    addNotify("Copied to Clipboard")
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
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

let lastLoad = 0
function loadGame(start=true, save) {
	wipe()
	load(save || localStorage.getItem(saveId))
	checkAPVers()
	lastLoad = new Date().getTime()

	resetTemp()
	for (let x = 0; x < 3; x++) updateTemp()

	if (start) {
		setupHTML()

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
			document.getElementById("ver").textContent = "[6/13/22b BETA BUILD]"
			document.getElementById("ver").className = "red"
			document.getElementById("beta").style.display = "none"
		}
		setInterval(loop, 50)
		setInterval(updateScreensHTML, 50)
		treeCanvas()
		setInterval(drawTreeHTML, 10)
		setInterval(checkNaN,1000)
	}

	elm.popup.setDisplay(0)
}

function checkNaN() {
	if (findNaN(player)) {
		if (new Date().getTime() - lastLoad < 60000) wipe(true)
		else {
			loadGame(false)
			addNotify("Game Data got NaNed")
		}
	}
}

function findNaN(obj, str=false, data=getPlayerData()) {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
    for (let x = 0; x < Object.keys(obj).length; x++) {
        let k = Object.keys(obj)[x]
        if (typeof obj[k] == "number") if (isNaN(obj[k])) return true
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return true
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return true
        }
        if (typeof obj[k] == "object") return findNaN(obj[k], str, data[k])
    }
    return false
}