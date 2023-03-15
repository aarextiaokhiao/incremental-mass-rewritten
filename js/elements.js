function setupHTML() {
	let sn_stabs = new Element("sn_stabs")
	let ext_stabs = new Element("ext_stabs")
	let tabs = new Element("tabs")
	let stabs = new Element("stabs")
	let table = ""
	let table2 = ""
	let table3 = ""
	let table4 = ""
	for (let x = 0; x < TABS[1].length; x++) {
		table += `<div style="width: 130px" id="tab${x}_div">
			<button onclick="TABS.choose(${x})" class="btn_tab" id="tab${x}">${TABS[1][x].id}</button>
		</div>`
		if (TABS[2][x]) {
			let a = `<div id="stabs${x}" class="table_center">`
			for (let y = 0; y < TABS[2][x].length; y++) {
				a += `<div style="width: 130px" id="stab${x}_${y}_div">
					<button onclick="TABS.choose(${y}, true)" class="btn_tab" id="stab${x}_${y}">${TABS[2][x][y].id}</button>
				</div>`
			}
			a += `</div>`
			if (x == 4) table4 += a
			else if (x == 3) table3 += a
			else table2 += a
		}
	}
	tabs.setHTML(table)
	stabs.setHTML(table2)
	sn_stabs.setHTML(table3)
	ext_stabs.setHTML(table4)

	let mass_upgs_table = new Element("mass_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.mass.cols; x++) {
		let upg = UPGS.mass[x]
		table += `<div class="building" id="massUpg_div_${x}">
			<div style="width: 400px">
				<div class="resources">
					<img src="images/mass_upg${x}.png">
					<span style="margin-left: 5px; text-align: left;"><span id="massUpg_scale_${x}"></span>${upg.title} [<span id="massUpg_lvl_${x}">X</span>]</span>
				</div>
			</div><button id="massUpg_btn_${x}" class="btn" style="width: 200px;" onclick="UPGS.mass.buy(${x}, true)">Cost: <span id="massUpg_cost_${x}">X</span></button>
			<button class="btn" style="width: 100px;" onclick="UPGS.mass.buyMax(${x})">Max</button>
			<button id="massUpg_auto_${x}" class="btn" style="width: 60px; padding: 0" onclick="UPGS.mass.autoSwitch(${x})">OFF</button>
			<div style="margin-left: 5px; text-align: left; width: 400px">
				${upg.title} Power: <span id="massUpg_step_${x}">X</span><br>
				${upg.title} Effect: <span id="massUpg_eff_${x}">X</span>
			</div>
		</div>`
	}
	mass_upgs_table.setHTML(table)

	let main_upgs_table = new Element("main_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		table += `<div id="main_upg_${x}_div" style="width: 230px; margin: 0px 10px;">
			<button id="main_upg_${x}_auto" class="btn" style="width: 80px;" onclick="player.auto_mainUpg.${id} = !player.auto_mainUpg.${id}">OFF</button>
				<br><br>
				<b>${UPGS.main[x].title}</b><br>
				<div style="font-size: 12px" id="main_upg_${x}_res"></div><br>
				<div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= UPGS.main[x].lens; y++) {
			let key = UPGS.main[x][y]
			table += `<img onclick="UPGS.main[${x}].buy(${y})" onmouseover="UPGS.main.over(${x},${y})" onmouseleave="UPGS.main.reset()"
			 style="margin: 3px;" class="img_btn" id="main_upg_${x}_${y}" src="images/upgrades/main_upg_${id+y}.png">`
		}
		table += `</div></div>`
	}
	main_upgs_table.setHTML(table)

	table = ""
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		table += `<div id="scaling_div_${x}">`
		let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
		for (let y = 0; y < key.length; y++) {
			table += `<div id="scaling_${x}_${key[y]}_div" style="margin-bottom: 10px;"><b>${getScalingPrefix(x) + NAME_FROM_RES[key[y]]}</b>: Starts at <span id="scaling_${x}_${key[y]}_start"></span>, <span id="scaling_${x}_${key[y]}_eff"></span></div>`
		}
		table += `</div>`
	}
	new Element("scaling_table").setHTML(table)

	table = ""
	for (let key of Object.keys(SCALE_EXP)) {
		table += `<div id="scaling_eff_${key}_div" style="margin-bottom: 10px;"><b>${NAME_FROM_RES[key]}</b>: Exponential, ^<span id="scaling_eff_${key}"></span> (base: ^<span id="scaling_eff_${key}_base"></span>)</div>`
	}
	new Element("scaling_eff").setHTML(table)

	setupTooltips()
	setupRanksHTML()
	setupChalHTML()
	setupAtomHTML()
	setupElementsHTML()
	setupMDHTML()
	setupStarsHTML()
	setupTreeHTML()
	setupBosonsHTML()
	setupFermionsHTML()
	setupRadiationHTML()
	setupConfirmHTML()
	setupAltraHTML()

	elm = {}
	let all = document.getElementsByTagName("*")
	for (let i=0;i<all.length;i++) {
		let x = all[i]
		elm[x.id] = new Element(x)
	}
}

function updateTabsHTML() {
	elm.tabs.setDisplay(gameStarted())
	elm.tab_header.setDisplay(gameStarted())
	for (let x = 0; x < TABS[1].length; x++) {
		let tab = TABS[1][x]
		elm["tab"+x+"_div"].setDisplay(TABS.unl(x))
		elm["tab"+x].setClasses({btn_tab: true, [tab.style ? tab.style : "normal"]: true, choosed: x == tmp.tab})

		if (elm["tab_frame"+x]) elm["tab_frame"+x].setDisplay(x == tmp.tab)
		if (TABS[2][x]) {
			let unls = 0
			if (x == tmp.tab) for (let y = 0; y < TABS[2][x].length; y++)  {
				let stab = TABS[2][x][y]
				let unl = TABS.unl(x, y)
				elm["stab"+x+"_"+y+"_div"].setDisplay(unl)
				elm["stab"+x+"_"+y].setClasses({btn_tab: true, [stab.style ? stab.style : "normal"]: true, choosed: y == tmp.stab[x]})
				if (elm["stab_frame"+x+"_"+y]) elm["stab_frame"+x+"_"+y].setDisplay(y == tmp.stab[x])
				if (unl) unls++
			}
			elm["stabs"+x].setDisplay(x == tmp.tab && unls > 1)
			if (x == 4) elm["ext_bar"].setDisplay(unls > 1)
		}
	}
}

function updateUpperHTML() {
	upperResources = 0

	let preExt = false //!EXT.unl()
	updateUpperRes("mass_div", true, () => {
		elm.mass.setHTML(formatMass(player.mass, true)+"<br>"+getProdDisp(player.mass, "mass", true, true))
	})
	updateUpperRes("mg_div", gameStarted() && inNGM(), () => {
		elm.mgAmt.setHTML(format(MAGIC.amt(),0)+"<br>"+formatGainOrGet(MAGIC.amt(), MAGIC.gain(), false))
	})
	updateUpperRes("rp_div", (player.rp.unl || (inNGM() ? MAGIC.unl() : player.stats.maxMass.gte(1e9))) && !CHALS.in(7), () => {
		elm.rpAmt.setHTML(format(player.rp.points,0)+"<br>"+formatGainOrGet(player.rp.points, tmp.rp.gain, hasUpgrade('bh',6)||hasUpgrade('atom',6)))
	})
	updateUpperRes("dm_div", player.rp.unl, () => {
		elm.dmAmt.setHTML(format(player.bh.dm,0)+"<br>"+formatGainOrGet(player.bh.dm, tmp.bh.dm_gain, hasUpgrade('atom',6)))
	})
	updateUpperRes("bh_div", player.bh.unl && !player.supernova.unl, () => {
		elm.bhMass.setHTML(formatMass(player.bh.mass)+"<br>"+getProdDisp(player.bh.mass, "bh", true))
	})
	updateUpperRes("atom_div", player.chal.unl, () => {
		elm.atomAmt.setHTML(format(player.atom.points,0)+"<br>"+formatGainOrGet(player.atom.points, tmp.atom.gain,hasElement(24)))
	})
	updateUpperRes("quark_div", player.atom.unl && !player.supernova.post_10, () => {
		elm.quarkAmt.setHTML(format(player.atom.quarks,0)+"<br>"+formatGainOrGet(player.atom.quarks,tmp.atom?tmp.atom.quarkGain.mul(hasElement(14)?tmp.atom.quarkGainSec:1):0,hasElement(14)))
	})
	updateUpperRes("md_div", MASS_DILATION.unlocked() && !player.supernova.post_10, () => {
		elm.mdAmt.setHTML(format(player.md.particles,0)+"<br>"+(player.md.active?formatGet(player.md.particles,tmp.md.rp_gain):(hasTree("qol3")?formatGain(player.md.particles,tmp.md.passive_rp_gain):"(inactive)")))
	})
	updateUpperRes("star_div", STARS.unlocked() && !player.supernova.unl, () => {
		elm.starAmt.setHTML(format(player.stars.points,2)+" / <br>"+format(tmp.supernova.maxlimit,2)+" "+formatGain(player.stars.points,tmp.stars.gain))
	})
	updateUpperRes("sn_div", player.supernova.unl, () => {
		elm.snAmt.setHTML(format(player.supernova.times,0)+"<br>"+formatGet(player.supernova.times, tmp.supernova.bulk.sub(player.supernova.times), true))
	})
	updateUpperRes("ns_div", player.supernova.unl && player.chal.comps[12].eq(0), () => {
		elm.nsAmt.setHTML(format(player.supernova.stars)+"<br>"+formatGain(player.supernova.stars,tmp.supernova.star_gain))
	})
	updateUpperRes("ext_div", EXT.unl() || player.chal.comps[12].gt(0), () => {
		elm.extAmt.setHTML(EXT.unl() ? format(EXT.rawAmt(),1) + (player.chal.comps[12].gt(0) ? "<br>" + formatGainOrGet(EXT.rawAmt(), player.ext.gain) : "") : "Click to rise Exotic!")
	})

	//NON-RESETS
	updateShortcuts()
	updateChalHeaderNew()
	updateProgressHeader()
}

let upperResources
function updateUpperRes(id, unl, call) {
	elm[id].setDisplay(unl)
	if (unl) {
		upperResources++
		if (player.options.resLayout.col) elm["res_col"+((upperResources-1)%player.options.resLayout.num+1)].appendHTML(id)
		else elm["res_col"+Math.ceil(upperResources/player.options.resLayout.num)].appendHTML(id)
		call()
	}
}

function updateMassUpgradesHTML() {
	for (let x = 1; x <= UPGS.mass.cols; x++) {
		let upg = UPGS.mass[x]
		elm["massUpg_div_"+x].setDisplay(upg.unl())
		if (upg.unl()) {
			let desc = UPGS.mass[x].effDesc(tmp.upgs.mass[x].eff)
			elm["massUpg_scale_"+x].setTxt(getScalingName("massUpg", x))
			elm["massUpg_lvl_"+x].setTxt(format(player.massUpg[x]||0,0)+(tmp.upgs.mass[x].bonus.gt(0)?" + "+format(tmp.upgs.mass[x].bonus,0):""))
			elm["massUpg_btn_"+x].setClasses({btn: true, locked: player.mass.lt(tmp.upgs.mass[x].cost)})
			elm["massUpg_cost_"+x].setTxt(formatMass(tmp.upgs.mass[x].cost))
			elm["massUpg_step_"+x].setTxt(desc.step)
			elm["massUpg_eff_"+x].setHTML(desc.eff)
			elm["massUpg_auto_"+x].setDisplay(hasUpgrade('rp',3))
			elm["massUpg_auto_"+x].setTxt(player.autoMassUpg[x]?"ON":"OFF")
		}
	}
}

function updateTickspeedHTML() {
	let unl = player.rp.unl
	elm.tickspeed_div.setDisplay(unl)
	if (unl) {
		elm.tickspeed_scale.setTxt(getScalingName('tickspeed'))
		elm.tickspeed_lvl.setTxt(format(player.tickspeed,0)+(tmp.atom.atomicEff.gte(1)?" + "+format(tmp.atom.atomicEff,0):""))
		elm.tickspeed_btn.setClasses({btn: true, locked: !FORMS.tickspeed.can()})
		elm.tickspeed_cost.setTxt(format(tmp.tickspeedCost,0))
		elm.tickspeed_step.setHTML((tmp.tickspeedEffect.step.gte(10)?format(tmp.tickspeedEffect.step)+"x":format(tmp.tickspeedEffect.step.sub(1).mul(100))+"%")+getSoftcapHTML(tmp.tickspeedEffect.step,tmp.tickspeedEffect.ss))
		elm.tickspeed_eff.setTxt(format(tmp.tickspeedEffect.eff))

		elm.tickspeed_auto.setDisplay(FORMS.tickspeed.autoUnl())
		elm.tickspeed_auto.setTxt(player.autoTickspeed?"ON":"OFF")
	}
}

function updateRanksRewardHTML() {
	elm["ranks_reward_name"].setTxt(RANKS.fullNames[player.ranks_reward])

	if (player.ranks_reward === 0) {
		elm.ranks_left_arrow.addClass("locked")
	} else {
		elm.ranks_left_arrow.removeClass("locked")
	}

	const maxUnlockedRank = Math.max(...RANKS.names.map((v, i) => i==0 ? i : (RANKS.unl[v]() && i)))
	if (player.ranks_reward === maxUnlockedRank) {
		elm.ranks_right_arrow.addClass("locked")
	} else {
		elm.ranks_right_arrow.removeClass("locked")
	}

	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		elm["ranks_reward_div_"+x].setDisplay(player.ranks_reward == x)
		if (player.ranks_reward == x) {
			let keys = Object.keys(RANKS.desc[rn])
			for (let y = 0; y < keys.length; y++) {
				if (keys[y].includes("_")) break
				let unl = player.ranks[rn].gte(keys[y])
				elm["ranks_reward_"+rn+"_"+y].setDisplay(unl)
				if (unl) {
					elm["ranks_title_"+rn+"_"+y].setTxt(RANKS.fullNames[x] + " " + format(keys[y],0))
					elm["ranks_desc_"+rn+"_"+y].setTxt(RANKS.getDesc(rn,keys[y]))
					if (elm["ranks_eff_"+rn+"_"+y]) elm["ranks_eff_"+rn+"_"+y].setTxt(RANKS.effDesc[rn][keys[y]](RANKS.effect[rn][keys[y]]()))
				}
			}
		}
	}
}

function updateMainUpgradesHTML() {
	let msg = player.main_upg_msg
	if (msg[0] != 0) {
		let upg1 = UPGS.main[msg[0]]
		let upg2 = upg1[msg[1]]
		let html = "<span class='sky'>"+upg2.desc+"</span><br><span>Cost: "+format(upg2.cost,0)+" "+upg1.res+"</span>"
		if (upg2.effDesc !== undefined) html += "<br><span class='green'>Currently: "+upg2.effDesc()+"</span>"
		elm.main_upg_msg.setHTML(html)
	} else elm.main_upg_msg.setTxt("")
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let upg = UPGS.main[x]
		let unl = upg.unl()
		elm["main_upg_"+x+"_div"].setDisplay(unl)
		elm["main_upg_"+x+"_res"].setTxt(`You have ${format(upg.getRes(),0)} ${upg.res}`)
		if (unl) {
			for (let y = 1; y <= upg.lens; y++) {
				let unl2 = upg[y].unl ? upg[y].unl() : true
				elm["main_upg_"+x+"_"+y].changeStyle("visibility", unl2?"visible":"hidden")
				if (unl2) elm["main_upg_"+x+"_"+y].setClasses({img_btn: true, locked: !upg.can(y), bought: player.mainUpg[id].includes(y)})
			}
			elm["main_upg_"+x+"_auto"].changeStyle("visibility", upg.auto_unl && upg.auto_unl() ? "visible" : "hidden")
			elm["main_upg_"+x+"_auto"].setTxt(player.auto_mainUpg[id]?"ON":"OFF")
		}
	}
}

function updateBlackHoleHTML() {
	elm.bhMass2.setHTML(formatMass(player.bh.mass))
	elm.bhMassGain.setHTML(getProdDisp(player.bh.mass, "bh", true))
	elm.bhMassPower.setTxt(format(tmp.bh.massPowerGain))
	elm.bhEffect.setTxt(format(tmp.bh.effect))

	elm.bhCondenser_lvl.setTxt(format(player.bh.condenser,0)+(tmp.bh.condenser_bonus.gte(1)?" + "+format(tmp.bh.condenser_bonus,0):""))
	elm.bhCondenser_btn.setClasses({btn: true, locked: !FORMS.bh.condenser.can()})
	elm.bhCondenser_scale.setTxt(getScalingName('bh_condenser'))
	elm.bhCondenser_cost.setTxt(format(tmp.bh.condenser_cost,0))
	elm.bhCondenser_pow.setTxt(format(tmp.bh.condenser_eff.pow))
	elm.bhCondenserEffect.setHTML(format(tmp.bh.condenser_eff.eff))
	elm.bhCondenser_auto.setDisplay(FORMS.bh.condenser.autoUnl())
	elm.bhCondenser_auto.setTxt(player.bh.autoCondenser?"ON":"OFF")

	elm.bhSoft.setDisplay(tmp.bh.massGain.base.gte(tmp.bh.massSoftGain))
	elm.bhSoftStart.setTxt(formatMass(tmp.bh.massSoftGain))

	updateExtraBuildingHTML("bh", 2)
	updateExtraBuildingHTML("bh", 3)
}

function updateOptionsHTML() {
	elm.offline_active.setTxt(player.options.offline?"ON":"OFF")
	elm.minus_active.setTxt(metaSave.ngm?"ON":"OFF")
	elm.help.setDisplay(player.options.notation_mass !== 1)
	elm.progress_active.setTxt(player.options.progress?"ON":"OFF")
	elm.tree_ani_btn.setDisplay(player.supernova.unl)
	elm.tree_ani.setTxt(TREE_ANIM[player.options.tree_animation])
}

function updateHTML() {
	if (tmp.offlineActive) {
		elm.offlineGain.setDisplay(tmp.offlineActive)
		elm.offlineSpeed.setTxt("(Offline: " + format(tmp.offlineMult) + "x, " + formatTime(player.offline.time) + " left)")
		elm.offlineGainDiv.setHTML(
			player.stats.maxMass.eq(player.offline.mass) || player.offline.mass.eq(0) ? "" :
			(player.stats.maxMass.gte(mlt(1)) ? "^" + format(player.stats.maxMass.log10().div(player.offline.mass.log10()).max(1)) + " mass gained!"
			: format(player.stats.maxMass.div(player.offline.mass)) + "x mass gained!") + " " + getProdDisp(player.mass, "mass", true, true)
		)
	}
	elm.loading.setDisplay(tmp.offlineActive)
	elm.offlineGainDiv.setDisplay(tmp.offlineActive)

	let inScene = SUPERNOVA.canPlayAnimation()
    elm.app.setDisplay(!tmp.offlineActive && tmp.tab != 3 && !inScene)
	document.body.style.backgroundColor = tmp.tab == 3 ? "#000" : inNGM() ? "#101" : "#111"
	document.body.className = inNGM() ? "ngm" : ""

	elm.title.setTxt((inScene ? "Supernova!" : formatMass(player.mass)) + " | " + getSaveTitle())
	if (tmp.offlineActive) return

	updateSupernovaHTML()
	updateExoticHTML()
	updateTabsHTML()
	if ((!tmp.supernova.reached || player.supernova.post_10 || EXT.unl(true)) && tmp.tab != 3) {
		elm.beginning.setDisplay(!gameStarted())
		elm.beginning2.setDisplay(!gameStarted() && !inNGM() && player.mass.gt(15))
		updateTabsHTML()
		updateUpperHTML()
		if (tmp.tab == 0) {
			if (tmp.stab[0] == 0) {
				updateRanksHTML()
				updateMassUpgradesHTML()
				updateTickspeedHTML()

				let lvl = 0
				for (var i = 1; i <= 3; i++) if (tmp.massGain.base.gte(tmp["massSoftGain"+i])) lvl = i
				elm.massSoft.setDisplay(lvl)
				if (lvl) {
					elm.massSoft.setClasses({["soft"+lvl+"_desc"]: true})
					elm.massSoftStart.setTxt(formatMass(tmp["massSoftGain"+lvl]))
					elm.massSoftLvl.setClasses({["soft"+lvl]: true})
					elm.massSoftLvl.setHTML("(softcapped"+(lvl>1?"<sup>"+lvl+"</sup>":"")+")")
				}
			}
			if (tmp.stab[0] == 1) {
				updateBlackHoleHTML()
			}
		}
		if (tmp.tab == 2) {
			if (tmp.stab[2] == 0) updateAtomHTML()
			if (tmp.stab[2] == 1) updateAtomicHTML()
			if (tmp.stab[2] == 2) updateMDHTML()
			if (tmp.stab[2] == 3) updateStarsHTML()
		}

		if (tmp.tab == 5) {
			if (tmp.stab[5] == 0) updateMainUpgradesHTML()
			if (tmp.stab[5] == 1) updateElementsHTML()
		}
		if (tmp.tab == 6) {
			if (tmp.stab[6] == 0) updateChalHTMLNew()
		}
		if (tmp.tab == 7) {
			if (tmp.stab[7] == 0) updateRanksRewardHTML()
			if (tmp.stab[7] == 1) updateScalingHTML()
			if (tmp.stab[7] == 2) updateCompressionHTML()
		}
		if (tmp.tab == 8) {
			updateConfirmHTML()
			updateOptionsHTML()
		}
	}
}