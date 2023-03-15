const MILESTONE = {}

function hasMilestone(id, i) {
	let type = MILESTONE[id]
	return type.unl() && type.res().gte(type.data[i].req)
}

function milestoneEff(id, i, def = 1) {
	return tmp.ms[id + "_" + i] ?? def
}

function updateMilestoneTemp() {
	let newTmp = {}
	tmp.ms = newTmp

	for (let [id, data] of Object.entries(MILESTONE)) {
		if (!data.unl()) continue
		for (let [i, ms] of Object.entries(data.data)) {
			if (ms.eff) newTmp[id+"_"+i] = ms.eff()
		}
	}
}

function setupMilestoneHTML(id) {
	let dom = ""
	for (let [i, ms] of Object.entries(MILESTONE[id].data)) {
		dom += `<div id='milestone_${id}_${i}'>
			<u class="milestoneReq" id='milestone_req_${id}_${i}'></u><br>
			${ms.desc}
			${ms.eff ? "<br><span class='milestoneEff'>Currently: <b id='milestone_eff_${id}_${i}'></b></span>" : ""}
			<b class="milestoneId">${id}${Number(i)+1}</b>
		</div>`
		if (ms % 2) dom += "<br>"
	}

	new Element("milestones_"+id).setHTML(dom)
	new Element("milestones_"+id).setClasses({ table_center: true })
}

function setupMilestonesHTML() {
	for (let id of Object.keys(MILESTONE)) setupMilestoneHTML(id)
}

function updateMilestoneHTML(id) {
	let gotBefore = true
	let list = MILESTONE[id]
	for (let [i, ms] of Object.entries(list.data)) {
		let has = hasMilestone(id, i)
		elm[`milestone_${id}_${i}`].setDisplay(gotBefore)
		elm[`milestone_${id}_${i}`].setClasses({ milestone: true, bought: has })
		elm[`milestone_req_${id}_${i}`].setHTML(list.resDisp(ms.req))
		if (!has) gotBefore = false
	}
}