let globalSaveId = beta ? betaSave : "testSave"
let metaSaveId = btoa(globalSaveId + "_meta")
let saveId = ""

//META
let metaSave = {
	ngm: 0
}

function getSaveId() {
	if (metaSave.ngm == 1) return btoa(globalSaveId + "_ngm")
	return globalSaveId
}

function getMetaSave() {
	let what = localStorage.getItem(metaSaveId)
	if (what != null) metaSave = JSON.parse(atob(what))
}

function setMetaSave() {
	localStorage.setItem(metaSaveId, btoa(JSON.stringify(metaSave)))
}