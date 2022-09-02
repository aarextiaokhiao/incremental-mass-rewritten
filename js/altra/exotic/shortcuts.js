function updateShortcuts() {
	let edit = SHORTCUT_EDIT.mode
	let quick = player.md.active || CHALS.lastActive() || player.supernova.fermions.choosed
	let data = []
	if (edit == 0) data = player.shrt.order
	else {
		data = [[0],[1],[2]]
		//if (AXION.unl && tmp.ax.lvl[27].gt(0)) data.push([3])
	}

	for (var i = 0; i < 7; i++) {
		let unl = i < data.length
		if (edit == 0) unl = unl && i < 4
		elm["shrt_"+i].setVisible(unl)
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
		if (x == 1) TABS.choose(3)
		if (x == 2) {
			TABS.choose(5)
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