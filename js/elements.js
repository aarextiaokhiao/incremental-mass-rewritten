function setupHTML() {
	let sn_stabs = new Element("sn_stabs")
	let ext_stabs = new Element("ext_stabs")
	let tabs = new Element("tabs")
	let stabs = new Element("stabs")
	let table = ""
	let table2 = ""
	let table3 = ""
	let table4 = ""
	for (let i = 0; i < TABS.order.length; i++) {
		let x = TABS.order[i]
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
			if (x == 6) table4 += a
			else if (x == 5) table3 += a
			else table2 += a
		}
	}
	tabs.setHTML(table)
	stabs.setHTML(table2)
	sn_stabs.setHTML(table3)
	ext_stabs.setHTML(table4)

	let ranks_table = new Element("ranks_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div style="width: 300px" id="ranks_div_${x}">
			<button id="ranks_auto_${x}" class="btn" style="width: 80px;" onclick="RANKS.autoSwitch('${rn}')">OFF</button>
			<span id="ranks_scale_${x}""></span>${RANKS.fullNames[x]} <span id="ranks_amt_${x}">X</span><br><br>
			<button onclick="RANKS.reset('${rn}')" class="btn reset" id="ranks_${x}">
				<span id="ranks_reset_${x}">Reset your ${RANKS.resetDescs[x]}, but </span>${RANKS.fullNames[x]} up.<span id="ranks_desc_${x}"></span><br>
				Req: <span id="ranks_req_${x}">X</span>
			</button>
		</div>`
	}
	ranks_table.setHTML(table)

	let mass_upgs_table = new Element("mass_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.mass.cols; x++) {
		let upg = UPGS.mass[x]
		table += `<div style="width: 100%; margin-bottom: 5px;" class="table_center" id="massUpg_div_${x}">
			<div style="width: 400px">
				<div class="resources">
					<img src="images/mass_upg${x}.png">
					<span style="margin-left: 5px; text-align: left;"><span id="massUpg_scale_${x}"></span>${upg.title} [<span id="massUpg_lvl_${x}">X</span>]</span>
				</div>
			</div><button id="massUpg_btn_${x}" class="btn" style="width: 200px;" onclick="UPGS.mass.buy(${x}, true)">Cost: <span id="massUpg_cost_${x}">X</span></button>
			<button class="btn" style="width: 120px;" onclick="UPGS.mass.buyMax(${x})">Buy Max</button>
			<button id="massUpg_auto_${x}" class="btn" style="width: 80px;" onclick="UPGS.mass.autoSwitch(${x})">OFF</button>
			<div style="margin-left: 5px; text-align: left; width: 400px">
				${upg.title} Power: <span id="massUpg_step_${x}">X</span><br>
				${upg.title} Effect: <span id="massUpg_eff_${x}">X</span>
			</div>
		</div>`
	}
	mass_upgs_table.setHTML(table)

	let ranks_rewards_table = new Element("ranks_rewards_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div id="ranks_reward_div_${x}">`
		let keys = Object.keys(RANKS.desc[rn])
		for (let y = 0; y < keys.length; y++) {
			if (keys[y].includes("_")) break
			table += `<span id="ranks_reward_${rn}_${y}"><b id="ranks_title_${rn}_${y}"></b>: <span id="ranks_desc_${rn}_${y}"></span>${RANKS.effect[rn][keys[y]]?` Currently: <span id='ranks_eff_${rn}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	ranks_rewards_table.setHTML(table)

	let main_upgs_table = new Element("main_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		table += `<div id="main_upg_${x}_div" style="width: 230px; margin: 0px 10px;"><b>${UPGS.main[x].title}</b><br><br><div style="font-size: 13px; min-height: 50px" id="main_upg_${x}_res"></div><br><div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= UPGS.main[x].lens; y++) {
			let key = UPGS.main[x][y]
			table += `<img onclick="UPGS.main[${x}].buy(${y})" onmouseover="UPGS.main.over(${x},${y})" onmouseleave="UPGS.main.reset()"
			 style="margin: 3px;" class="img_btn" id="main_upg_${x}_${y}" src="images/main_upg_${id+y}.png">`
		}
		table += `</div><br><button id="main_upg_${x}_auto" class="btn" style="width: 80px;" onclick="player.auto_mainUpg.${id} = !player.auto_mainUpg.${id}">OFF</button></div>`
	}
	main_upgs_table.setHTML(table)

	let scaling_table = new Element("scaling_table")
	table = ""
	for (let x = 0; x < SCALE_TYPE.length; x++) {
		table += `<div id="scaling_div_${x}">`
		let key = Object.keys(SCALE_START[SCALE_TYPE[x]])
		for (let y = 0; y < key.length; y++) {
			table += `<div id="scaling_${x}_${key[y]}_div" style="margin-bottom: 10px;"><b>${NAME_FROM_RES[key[y]]}</b> (<span id="scaling_${x}_${key[y]}_power"></span>): Starts at <span id="scaling_${x}_${key[y]}_start"></span></div>`
		}
		table += `</div>`
	}
	scaling_table.setHTML(table)

	setupChalHTML()
	setupAtomHTML()
	setupElementsHTML()
	setupMDHTML()
	setupStarsHTML()
	setupTreeHTML()
	setupBosonsHTML()
	setupFermionsHTML()
	setupRadiationHTML()
	setupAltraHTML()

	let confirm_table = new Element("confirm_table")
	table = ""
	for (let x = 0; x < CONFIRMS.length; x++) {
		table += `<div style="width: 100px" id="confirm_div_${x}"><img src="images/${CONFIRMS_PNG[CONFIRMS[x]]}.png" style='width: 40px; height: 40px'><br><button onclick="player.confirms.${CONFIRMS[x]} = !player.confirms.${CONFIRMS[x]}" class="btn" id="confirm_btn_${x}">OFF</button></div>`
	}
	confirm_table.setHTML(table)

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
		if (x != 5 && tmp.tab == 5) continue
		let tab = TABS[1][x]
		elm["tab"+x+"_div"].setDisplay(tab.unl ? tab.unl() : true)
		elm["tab"+x].setClasses({btn_tab: true, [tab.style ? tab.style : "normal"]: true, choosed: x == tmp.tab})

		if (elm["tab_frame"+x]) elm["tab_frame"+x].setDisplay(x == tmp.tab)
		if (TABS[2][x]) {
			let unls = 0
			if (x == tmp.tab) for (let y = 0; y < TABS[2][x].length; y++)  {
				let stab = TABS[2][x][y]
				let unl = stab.unl ? stab.unl() : true
				elm["stab"+x+"_"+y+"_div"].setDisplay(unl)
				elm["stab"+x+"_"+y].setClasses({btn_tab: true, [stab.style ? stab.style : "normal"]: true, choosed: y == tmp.stab[x]})
				if (elm["stab_frame"+x+"_"+y]) elm["stab_frame"+x+"_"+y].setDisplay(y == tmp.stab[x])
				if (unl) unls++
			}
			elm["stabs"+x].setDisplay(x == tmp.tab && unls > 1)
			if (x ==6) elm["ext_bar"].setDisplay(x == tmp.tab && unls > 1)
		}
	}
}

function updateUpperHTML() {
	elm.mass.setHTML(formatMass(player.mass, true)+"<br>"+getProdDisp(player.mass, "mass", true, true))

	//RESET
	elm.reset_desc.setHTML(player.reset_msg)

	let preExt = !EXT.unl()

	let unl = gameStarted() && inNGM() && preExt
	elm.mg_div.setDisplay(unl)
	if (unl) elm.mgAmt.setHTML(format(MAGIC.amt(),0)+"<br>"+formatGainOrGet(MAGIC.amt(), MAGIC.gain(), false))

	unl = (inNGM() ? MAGIC.unl() : (player.stats.maxMass.gte(1e9) || player.rp.unl)) && preExt
	elm.rp_div.setDisplay(unl)
	if (unl) elm.rpAmt.setHTML(format(player.rp.points,0)+"<br>"+formatGainOrGet(player.rp.points, tmp.rp.gain, hasUpgrade('bh',6)||hasUpgrade('atom',6)))

	unl = FORMS.bh.see() && preExt
	elm.dm_div.setDisplay(unl)
	if (unl) elm.dmAmt.setHTML(format(player.bh.dm,0)+"<br>"+formatGainOrGet(player.bh.dm, tmp.bh.dm_gain, hasUpgrade('atom',6)))
	unl = player.bh.unl && preExt
	elm.bh_div.setDisplay(unl)
	elm.atom_div.setDisplay(unl)
	if (unl) {
		elm.bhMass.setHTML(formatMass(player.bh.mass)+"<br>"+getProdDisp(player.bh.mass, "bh", true))
		elm.atomAmt.setHTML(format(player.atom.points,0)+"<br>"+formatGainOrGet(player.atom.points, tmp.atom.gain,hasElement(24)))
	}

	unl = player.atom.unl && preExt
	elm.quark_div.setDisplay(unl)
	if (unl) elm.quarkAmt.setHTML(format(player.atom.quarks,0)+"<br>"+formatGainOrGet(player.atom.quarks,tmp.atom?tmp.atom.quarkGain.mul(hasElement(14)?tmp.atom.quarkGainSec:1):0,hasElement(14)))

	let scut = hasExtMilestone("qol", 8)
	elm.scut_div.setDisplay(scut)
	elm.md_div.setDisplay(!scut && MASS_DILATION.unlocked())
	if (scut) updateShortcuts()
	else {
		unl = MASS_DILATION.unlocked()
		if (unl) elm.md_massAmt.setHTML(format(player.md.particles,0)+"<br>"+(player.md.active?formatGet(player.md.particles,tmp.md.rp_gain):(hasTree("qol3")?formatGain(player.md.particles,tmp.md.passive_rp_gain):"(inactive)")))
	}

	unl = player.supernova.post_10
	elm.sn_div.setDisplay(unl)
	if (unl) elm.supernovaAmt.setHTML(format(player.supernova.times,0)+"<br>"+formatGet(player.supernova.times, tmp.supernova.bulk.sub(player.supernova.times), true))

	unl = EXT.unl(true)
	elm.ext_div.setDisplay(unl)
	elm.res_col2.setDisplay(!unl)
	if (unl) elm.extAmt.setHTML(EXT.unl() ? format(EXT.rawAmt(),1) + (player.chal.comps[12].gt(0) ? "<br>" + formatGainOrGet(EXT.rawAmt(), player.ext.gain) : "") : "Click to rise Exotic!")

	//CHALLENGES
	let chal = CHALS.lastActive()
	let md = player.md.active
	let f = player.supernova.fermions.choosed
	elm.chal_upper.setVisible(chal || md || f)
	if (md) {
		elm.chal_upper.setHTML(`You are in Mass Dilation!<br>Go over ${formatMass(MASS_DILATION.mass_req())} to gain Relativistic Particles!`)
	} else if (f) {
		let f1_y = f[0]
		let f1_x = f[1]
		let fm = FERMIONS.types[f1_y][f1_x]
		let ft = player.supernova.fermions.tiers[f1_y][f1_x]
		let ff = fm.isMass?formatMass:format

		let f2 = player.supernova.fermions.choosed2
		let f2_y = f2[0]
		let f2_x = f2[1]

		elm.chal_upper.setHTML(
			"You are in "+FERMIONS.sub_names[f1_y][f1_x]+" "+FERMIONS.names[f1_y]+
			(f2?" and "+FERMIONS.sub_names[f2_y][f2_x]+" "+FERMIONS.names[f2_y]:"")+
			"!"+
			(f2||ft.gte(FERMIONS.maxTier(f1_y,f1_x)) ? "" :
				"<br>Go over "+ff(fm.res())+" / "+ff(fm.nextTierAt(ft))+" "+fm.inc+" to complete."
			)
		)
	} else if (chal) {
		let data = CHALS.getChalData(chal, tmp.chal.bulk[chal].max(player.chal.comps[chal]))
		elm.chal_upper.setHTML(
			`You are in [${CHALS[chal].title}] Challenge!<br>` + (
				player.chal.comps[chal].gte(tmp.chal.max[chal]) ? `` :
				tmp.chal.gain.gt(0) ? `+${format(tmp.chal.gain,0)} (Next: ${tmp.chal.format(data.goal)+CHALS.getResName(chal)})` :
				`Get ${tmp.chal.format(tmp.chal.goal[chal])+CHALS.getResName(chal)} to complete.`
			)
		)
	}
}

function updateRanksHTML() {
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		let unl = RANKS.unl[rn]?RANKS.unl[rn]():true
		if (x == 0) unl = unl&&!RANKS.unl.pent()
		elm["ranks_div_"+x].setDisplay(unl)
		if (unl) {
			let keys = Object.keys(RANKS.desc[rn])
			let desc = ""
			if (gameStarted()) {
				for (let i = 0; i < keys.length; i++) {
					if (keys[i].includes("_")) break
					if (player.ranks[rn].lt(keys[i])) {
						desc = ` At ${RANKS.fullNames[x]} ${format(keys[i],0)}, ${RANKS.getDesc(rn,keys[i])}`
						break
					}
				}
			}

			elm["ranks_scale_"+x].setTxt(getScalingName(rn))
			elm["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
			elm["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
			elm["ranks_desc_"+x].setTxt(desc)
			elm["ranks_req_"+x].setTxt(x==0?formatMass(tmp.ranks[rn].req):RANKS.fullNames[x-1]+" "+format(tmp.ranks[rn].req,0))
			elm["ranks_reset_"+x].setDisplay(RANKS.mustReset(rn) && gameStarted())
			elm["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
			elm["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"ON":"OFF")
		}
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
		elm["main_upg_"+x+"_div"].changeStyle("visibility", unl?"visible":"hidden")
		elm["main_upg_"+x+"_res"].setTxt(`You have ${format(upg.getRes(),0)} ${upg.res}`)
		if (unl) {
			for (let y = 1; y <= upg.lens; y++) {
				let unl2 = upg[y].unl ? upg[y].unl() : true
				elm["main_upg_"+x+"_"+y].changeStyle("visibility", unl2?"visible":"hidden")
				if (unl2) elm["main_upg_"+x+"_"+y].setClasses({img_btn: true, locked: !upg.can(y), bought: player.mainUpg[id].includes(y)})
			}
			elm["main_upg_"+x+"_auto"].setDisplay(upg.auto_unl ? upg.auto_unl() : false)
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

function updateStatsHTML() {
	elm.total_time.setTxt(formatTime(player.time))
	elm.best_mass.setTxt(formatMass(player.stats.maxMass))
	elm.features.setTxt(
		GLUBALL.unl() ? 13 :
		AXION.unl() ? 12 :
		hasTree("unl1") ? 11 :
		player.chal.comps[10].gte(1) ? 10 :
		player.supernova.post_10 ? 9 :
		player.supernova.unl ? 8 :
		STARS.unlocked() ? 7 :
		MASS_DILATION.unlocked() ? 6 :
		player.chal.comps[7].gte(16) ? 5 :
		player.atom.unl ? 4 :
		player.chal.unl ? 3 :
		player.bh.unl ? 2 :
		player.rp.unl ? 1 : 0
	)
	elm.layers.setTxt(
		EXT.unl() ? 5 :
		player.supernova.unl ? 4 :
		player.atom.unl ? 3 :
		player.bh.unl ? 2 :
		player.rp.unl ? 1 : 0
	)
}

function updateOptionsHTML() {
	for (let x = 0; x < CONFIRMS.length; x++) {
		elm["confirm_div_"+x].setDisplay(CONFIRMS_MOD[CONFIRMS[x]]() && CONFIRMS_UNL[CONFIRMS[x]]())
		elm["confirm_btn_"+x].setTxt(player.confirms[CONFIRMS[x]] ? "ON":"OFF")
	}
	elm.offline_active.setTxt(player.offline.active?"ON":"OFF")
	elm.minus_active.setTxt(metaSave.ngm?"ON":"OFF")
	elm.help.setDisplay(player.options.pure!=1)
	elm.tree_ani_btn.setDisplay(player.supernova.unl)
	elm.tree_ani.setTxt(TREE_ANIM[player.options.tree_animation])
	elm.chroma_bg_btn.setDisplay(GLUBALL.unl() && !PORTAL.unl())
	elm.chroma_bg_btn.setTxt("Chroma BG: "+(player.options.noChroma?"OFF":"ON"))
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

	document.body.style.backgroundColor = tmp.tab == 5 ? "#000" : inNGM() ? "#101" : "#111"
	document.body.className = inNGM() ? "ngm" : ""
	elm.loading.setDisplay(tmp.offlineActive)
	elm.offlineGainDiv.setDisplay(tmp.offlineActive)
    elm.app.setDisplay(!tmp.offlineActive && tmp.tab != 5 && (!tmp.supernova.reached || player.supernova.unl))
	elm.title.setTxt((tmp.supernova.reached && !player.supernova.unl ? "Supernova!" : formatMass(player.mass)) + " | " + getSaveTitle())
	if (tmp.offlineActive) return

	updateSupernovaEndingHTML()
	updateExoticHTML()
	updateTabsHTML()
	if ((!tmp.supernova.reached || player.supernova.post_10 || EXT.unl(true)) && tmp.tab != 5) {
		elm.beginning.setDisplay(!gameStarted())
		elm.beginning2.setDisplay(!gameStarted() && !inNGM() && player.mass.gt(15))
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
			if (tmp.stab[0] == 2) {
				updateAtomicHTML()
			}
			if (tmp.stab[0] == 3) {
				updateStarsHTML()
			}
		}
		if (tmp.tab == 1) {
			if (tmp.stab[1] == 0) updateStatsHTML()
			if (tmp.stab[1] == 1) updateRanksRewardHTML()
			if (tmp.stab[1] == 2) updateScalingHTML()
			if (tmp.stab[1] == 3) updateCompressionHTML()
		}
		if (tmp.tab == 2) {
			updateMainUpgradesHTML()
		}
		if (tmp.tab == 3) {
			if (tmp.stab[3] == 0) updateChalHTML()
		}
		if (tmp.tab == 4) {
			if (tmp.stab[4] == 0) updateAtomHTML()
			if (tmp.stab[4] == 1) updateElementsHTML()
			if (tmp.stab[4] == 2) updateMDHTML()
		}
		if (tmp.tab == 7) {
			updateOptionsHTML()
		}
	}
}