function addNotify(text, duration=3) {
    tmp.notify.push({text: text, duration: duration});
    if (tmp.notify.length == 1) updateNotify()
}

function removeNotify() {
    if (tmp.saving > 0 && tmp.notify[0]?tmp.notify[0].text="Game Saving":false) tmp.saving--
    if (tmp.notify.length <= 1) tmp.notify = []
    let x = []
    for (let i = 1; i < tmp.notify.length; i++) x.push(tmp.notify[i])
    tmp.notify = x
    tmp.el.notify.setVisible(false)
    updateNotify()
}

function updateNotify() {
    if (tmp.notify.length > 0) {
        tmp.el.notify.setHTML(tmp.notify[0].text)
        tmp.el.notify.setVisible(true)
        tmp.el.notify.setClasses({hide: false})
        setTimeout(_=>{
            tmp.el.notify.setClasses({hide: true})
            setTimeout(removeNotify, 750)
        }, tmp.notify[0].duration*1000)
    }
}

const POPUP_GROUPS = {
    help: {
        html: `
        <h1>Mass</h1><br>
        g (gram): 1 g<br>
        kg (kilogram): 1,000 g<br>
        tonne (tonne): 1,000 kg = 1,000,000 g<br>
        MME (mass of Mount Everest): 1.619e14 tonne = 1.619e20 g<br>
        M⊕ (mass of Earth): 36,886,967 MME = 5.972e27 g<br>
        M☉ (mass of Sun): 333,054 M⊕ = 1.989e33 g<br>
        MMWG (mass of Milky Way Galaxy): 1.5e12 M☉ = 2.9835e45 g<br>
        uni (mass of Universe): 50,276,520,864 MMWG = 1.5e56 g<br>
        mlt (mass of Multiverse): 1e1e9 uni<br>
        `,
    },
    fonts: {
        html: `
            <button class="btn" style="font-family: 'Andy Bold';" onclick="changeFont('Andy Bold')">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="changeFont('Arial, Helvetica, sans-ser')">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="changeFont('Bahnschrift')">Bahnschrift</button>
            <button class="btn" style="font-family: Courier;" onclick="changeFont('Courier')">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="changeFont('Cousine')">Cousine</button>
            <button class="btn" style="font-family: 'Flexi IBM VGA False';" onclick="changeFont('Flexi IBM VGA False')">Flexi IBM VGA False</button>
            <button class="btn" style="font-family: Inconsolata;" onclick="changeFont('Inconsolata')">Inconsolata</button>
            <button class="btn" style="font-family: 'Lucida Handwriting';" onclick="changeFont('Lucida Handwriting')">Lucida Handwriting</button>
            <button class="btn" style="font-family: Monospace-Typewritter;" onclick="changeFont('Monospace-Typewritter')">Monospace Typewritter</button>
            <button class="btn" style="font-family: 'Nova Mono';" onclick="changeFont('Nova Mono')">Nova Mono</button>
            <button class="btn" style="font-family: 'Nunito';" onclick="changeFont('Nunito')">Nunito</button>
            <button class="btn" style="font-family: 'Retron2000';" onclick="changeFont('Retron2000')">Retron 2000</button>
            <button class="btn" style="font-family: 'Roboto Mono';" onclick="changeFont('Roboto Mono')">Roboto Mono</button>
            <button class="btn" style="font-family: Verdana, Geneva, Tahoma, sans-serif;" onclick="changeFont('Verdana, Geneva, Tahoma, sans-serif')">Verdana</button>
        `,
    },
    notations: {
        html: `
            <button class="btn" onclick="player.options.notation = 'mixed_sc'">Mixed Scientific</button>
            <button class="btn" onclick="player.options.notation = 'sc'">Scientific</button>
            <button class="btn" onclick="player.options.notation = 'log'">Logarithm</button>
            <button class="btn" onclick="player.options.notation = 'eng'">Engineering</button><br><br>
            <button class="btn" onclick="player.options.notation = 'st'">Standard</button>
            <button class="btn" onclick="player.options.notation = 'elemental'">Elemental</button>
            <button class="btn" onclick="player.options.notation = 'layer'">Prestige Layer</button>
            <button class="btn" onclick="player.options.notation = 'omega'">Omega</button>
            <button class="btn" onclick="player.options.notation = 'omega_short'">Omega Short</button>
            <button class="btn" onclick="player.options.notation = 'inf'">Infinity</button>
            <button class="btn" onclick="player.options.notation = 'max'">Maximus</button>
        `,
    },
    supernova10: {
        html: `
            Congratulations!<br><br>You have becomed 10 Supernovae!<br>
            And you can manualy supernova!<br><br>
            <b>Bosons are unlocked in Supernova tab!</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
    fermions: {
        html: `
            Congratulations!<br><br>You have beated Challenge 10!<br><br>
            <b>Fermions are unlocked in Supernova tab!</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
	chroma: {
        html: `
            Congratulations!<br><br><b class='rainbow'>You have unravelled the prism, and unleashed the colors!</b><br><br>
            <b style='color:#3f00bf'>Chroma has been unlocked in Exotic tab!</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
	},
	prim: {
        html: `
            Congratulations!<br><br><b class='yellow'>You have went below spacetime and found Primordiums!</b><br><br>
            <b style='color:#3f00bf'>Primordiums have been unlocked in Exotic tab!</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
	},

	ap_chroma: {
		html: `
			<b class='rainbow' style='font-size: 20px'>Welcome to Chroma update!</b><br>
			This update adds a new mechanic called Chroma, bringing out colors with a new buildable spectrum!<br>
			Final pack of Neutron upgrades and 2 rows of Axion Boosts have been added in this update!<br>
			<span class='rainbow'>Colors</span> <span class='red'>aw</span><span class='green'>ai</span><span class='sky'>t.</span><span class='magenta'>..</span><br><br>
			Good luck!<br>
			You need to get 15 C13 completions to unlock Chroma.<br>
			End-game: ???<br><br>
			
			<b class='rainbow' style='font-size: 7px'>Oh, this is the first of Spectraglow series.</b>
		`,
		width: 600,
		height: 300,
		otherStyle: {
			'font-size': "14px",
		},
	},
}

function addPopup(data) {
    tmp.popup.push({
        html: data.html||"",
        button: data.button||"Okay",
        callFunctions: data.callFunction?function() {removePopup();data.callFunctions()}:removePopup,

        width: data.width||600,
        height: data.height||400,
        otherStyle: data.otherStyle||{},
    })
    updatePopup()
}

function updatePopup() {
    tmp.el.popup.setDisplay(tmp.popup.length > 0)
    if (tmp.popup.length > 0) {
        tmp.el.popup_html.setHTML(tmp.popup[0].html)
        tmp.el.popup_html.changeStyle("height", tmp.popup[0].height-35)
        tmp.el.popup_button.setHTML(tmp.popup[0].button)
        tmp.el.popup.changeStyle("width", tmp.popup[0].width)
        tmp.el.popup.changeStyle("height", tmp.popup[0].height)
        for (let x in tmp.popup[0].otherStyle) tmp.el.popup_html.changeStyle(x, tmp.popup[0].otherStyle[x])
    }
}

function removePopup() {
    if (tmp.popup.length <= 1) tmp.popup = []
    let x = []
    for (let i = 1; i < tmp.popup.length; i++) x.push(tmp.popup[i])
    tmp.popup = x
    updatePopup()
}

function removeDuplicates(x) {
	let r = []
	for (var i = 0; i < x.length; i++) {
		let it = x[i]
		if (!r.includes(it)) r.push(it)
	}
	return r
}

//ALTRASCENDUM
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

function checkAPVers() {
	if (player.ap_ver == 0) addPopup(POPUP_GROUPS.ap_chroma)
	else {
		if (player.ap_ver < 1) addPopup(POPUP_GROUPS.ap_chroma)
	}
	if (player.ap_var < 1.001) {
		player.ext.ax.res[2] = E(0)
		for (var i = 8; i < 12; i++) player.ext.ax.upg[i] = E(0)
	}
	player.ap_ver = 1.001
}

let beta = true
let betaLink = "2-chroma"
let saveId = "testSave"
if (beta) saveId = "testBeta"

// SHORTCUTS
function updateShortcuts() {
	let edit = SHORTCUT_EDIT.mode
	let quick = player.md.active || CHALS.lastActive() || player.supernova.fermions.choosed
	let data = []
	if (edit == 0) data = player.shrt.order
	else {
		data = [[0],[1],[2]]
		if (AXION.unl && tmp.ax.lvl[23].gt(0)) data.push([3])
	}

	for (var i = 0; i < 7; i++) {
		let unl = i < data.length
		if (edit == 0) unl = unl && (i < 4 || (AXION.unl() && tmp.ax.lvl[23].gt(0)))
		tmp.el["shrt_"+i].setVisible(unl)
		if (unl) {
			let id = data[i]
			let mode = id[0] + 1
			let ix = id[1]
			document.getElementById("shrt_"+i).setAttribute("src", "images/" + (!edit && mode == 3 ? "ferm-" + ["qua","lep"][Math.floor(ix / 10)] : ix > 0 && mode == 2 ? "chal_" + ["dm","atom","sn","ext"][Math.ceil(ix/4)-1] : ["empty", "md", "chal", "ferm", "exit"][mode]) + ".png")
			document.getElementById("shrt_"+i+"_tooltip").setAttribute("tooltip", ix >= 0 && mode == 3 ? FERMIONS.sub_names[Math.floor(ix / 10)][ix % 10] : ix > 0 && mode == 2 ? CHALS[id[1]].title : ["Add Shortcut", "Mass Dilation", "Challenge (Proceed to Challenges tab)", "Fermion (Proceed to Fermions tab)", "Exit"][mode])
		} else document.getElementById("shrt_"+i+"_tooltip").removeAttribute("tooltip")
	}
	document.getElementById("shrt_m").setAttribute("src", "images/" + (edit ? (quick ? "quick" : "cancel") : ["click", "edit", "remove"][SHORTCUT_EDIT.cur]) + ".png")
	document.getElementById("shrt_m_tooltip").setAttribute("tooltip", (edit ? (quick ? "Quick Add" : "Cancel (discard your changes)") : ["Mode: Normal (click to switch)", "Mode: Edit", "Mode: Remove"][SHORTCUT_EDIT.cur]))
}

function doShortcut(a, b) {
	if (a == 0) MASS_DILATION.onactive()
	if (a == 1) {
		if (b == -1) CHALS.exit()
		else {
			player.chal.choosed = b
			CHALS.enter()
		}
	}
	if (a == 2) FERMIONS.choose(Math.floor(b / 10), b % 10)
	if (a == 3) {
		if (player.md.active) MASS_DILATIOn.onactive()
		else if (player.supernova.fermions.choosed) FERMIONS.backNormal()
		else if (CHALS.lastActive()) CHALS.exit()
	}
}

function editShortcut(x) {
	SHORTCUT_EDIT.mode = 1
	SHORTCUT_EDIT.pos = x
}

function switchShortcut() {
	if (SHORTCUT_EDIT.mode) {
		if (player.md.active) player.shrt.order[SHORTCUT_EDIT.pos] = [0, -1]
		else if (player.supernova.fermions.choosed) player.shrt.order[SHORTCUT_EDIT.pos] = [2, parseInt(player.supernova.fermions.choosed)]
		else if (CHALS.lastActive()) player.shrt.order[SHORTCUT_EDIT.pos] = [1, CHALS.lastActive()]
		SHORTCUT_EDIT.mode = 0
		return
	}
	SHORTCUT_EDIT.cur = (SHORTCUT_EDIT.cur + 1) % 3
	updateShortcuts()
}

function clickShortcut(x) {
	if (SHORTCUT_EDIT.mode) {
		if (x == 0 || x == 3) {
			player.shrt.order[SHORTCUT_EDIT.pos] = [x, -1]
			SHORTCUT_EDIT.mode = 0
		}
		if (x == 1) {
			tmp.tab = 3
		}
		if (x == 2) {
			tmp.sn_tab = tmp.tab
			tmp.tab = 5
			tmp.stab[5] = 2
		}
		return
	}
	let d = player.shrt.order[x]
	let m = SHORTCUT_EDIT.cur
	if (d[0] < 0 || m == 1) editShortcut(x)
	else if (m == 2) {
		if (!confirm("Are you sure do you want to delete this shortcut?")) return
		player.shrt.order[x] = [-1, -1]
		updateShortcuts()
	} else doShortcut(d[0], d[1])
}

let SHORTCUT_EDIT = {
	mode: 0,
	pos: 0,
	cur: 0
}

/* TO DO: WHEN EDITING A SHORTCUT, YOU MEET A POPUP FOR CHOOSING A TYPE FIRST.
WHEN CHOOSED, YOU WILL BRING INTO A RESPECTIVE SCREEN.
CLICKING A KIND WILL COMPLETE THE PROCESS. */

//TECHNICAL
future = false
future_ax = false

//FUTURE
function zeta() {
	return future
}