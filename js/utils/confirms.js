//CONFIRMS
const CONFIRMS = {
	mg: {
		unl: () => MAGIC.unl(),
		mod: () => inNGM(),
		disabled: () => player.rp.unl,

		msg: "Reset your progress for Magic?",
		img: "ngm/magic"
	},
	rp: {
		unl: () => player.rp.unl,
		disabled: () => player.bh.unl,

		msg: "Reset your progress for Rage Power?",
		img: "rp"
	},
	bh: {
		unl: () => player.bh.unl,
		disabled: () => player.atom.unl,

		msg: "Reset your progress for Dark Matter?",
		img: "dm"
	},
	atom: {
		unl: () => player.atom.unl,
		disabled: () => player.supernova.unl,

		msg: "Reset your progress for Atoms?",
		img: "atom"
	},
	sn: {
		unl: () => player.supernova.unl,

		msg: "Restart a Supernovae run?",
		tip: "Only works if you are restarting a Supernovae run.",
		img: "sn"
	},
	ext: {
		unl: () => EXT.unl(),

		msg: "Do you wish to rise Exotic?",
		tip: "Only works if you are restarting a Exotic run.",
		img: "ext"
	},
	chal: {
		unl: () => player.chal.unl,

		msg: "Enter this challenge? You'll reset your progress!",
		tip: "Only works if you are entering a Challenge in a latest layer.",
		img: "chal"
	}
}

function toConfirm(x) {
	if (!player.confirms[x]) return true
	if (CONFIRMS[x].disabled && CONFIRMS[x].disabled()) return true
	return confirm(CONFIRMS[x].msg)
}

function setupConfirmHTML() {
	let confirm_table = new Element("confirm_table")
	table = ""
	for (let [id, conf] of Object.entries(CONFIRMS)) {
		table += `<div ${conf.tip ? `tooltip="${conf.tip}"` : ''} style="width: 100px" id="confirm_${id}"><img src="images/${conf.img}.png" style='width: 40px; height: 40px'><br><button onclick="player.confirms.${id} = !player.confirms.${id}" class="btn" id="confirm_btn_${id}">OFF</button></div>`
	}
	confirm_table.setHTML(table)
}

function updateConfirmHTML() {
	for (let [id, conf] of Object.entries(CONFIRMS)) {
		elm["confirm_"+id].setDisplay((!conf.mod || conf.mod()) && (!conf.disabled || !conf.disabled()) && conf.unl())
		elm["confirm_btn_"+id].setTxt(player.confirms[id] ? "ON" : "OFF")
	}
}