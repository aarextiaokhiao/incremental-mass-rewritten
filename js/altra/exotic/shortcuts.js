//REWRITING SOON
const SHORTCUT_TYPES = [
	{
		//Dilation
		img: () => "",
	},
	{
		//Challenges
		onMake() {
		},
		onEdit(id) {
		}
	},
	{
		//Fermions
		onMake() {
		},
		onEdit(id) {
		}
	},
	{
		//Sweep
	},
	//Exit is now always at last shortcut.
]

const SHORTCUT_MODES = {
	click: {
		name: "Shortcut",
		onClick(pos) {
		}
	},
	edit: {
		name: "Change",
		onClick(pos) {
		}
	},
	del: {
		name: "Delete",
		onClick(pos) {
		}
	}
}

const SHORTCUT_MODE_BTN = {
	mode: "click",
	toEdit: 0,
	inEdit: false,

	click() {
		if (SHORTCUT_MODE_BTN.inEdit) SHORTCUT_MODE_BTN.inEdit = false
	},
	cancel() {
	}
}

//DOM
function setupShortcuts() {
	let html = ""
	for (var i = 0; i < 7; i++) html += `<span id="shrt_${i}_tooltip" t-size="small"><img class="res_img" id="shrt_${i}" onclick="clickShortcut(${i})" style="cursor: pointer;"></span>`
	new Element("shrt_list").setHTML(html)
}

function updateShortcuts() {
	const unl = false //hasExtMilestone("qol", 9)
	elm.shrt_div.setDisplay(unl)
	if (!unl) return

	//coming soon
}