function setupHTML() {
	let tabs = new Element("tabs")
	let stabs = new Element("stabs")
	let table = ""
	let table2 = ""
	for (let x = 0; x < TABS[1].length; x++) {
		table += `<div>
			<button onclick="TABS.choose(${x})" class="btn_tab" id="tab${x}">${TABS[1][x].icon ? `<iconify-icon icon="${TABS[1][x].icon}" width="72" style="color: ${TABS[1][x].color||"white"}"></iconify-icon>` : ""}<div>${TABS[1][x].id}</div></button>
		</div>`
		if (TABS[2][x]) {
			let a = `<div id="stabs${x}" class="table_center stab_btn">`
			for (let y = 0; y < TABS[2][x].length; y++) {
				a += `<div style="width: 160px">
					<button onclick="TABS.choose(${y}, true)" class="btn_tab" id="stab${x}_${y}">${TABS[2][x][y].id}</button>
				</div>`
			}
			a += `</div>`
			table2 += a
		}
	}
	tabs.setHTML(table)
	stabs.setHTML(table2)

	let ranks_table = new Element("ranks_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div style="width: 250px" id="ranks_div_${x}">
			<button id="ranks_auto_${x}" class="btn" style="width: 80px;" onclick="RANKS.autoSwitch('${rn}')">OFF</button><br><br>
			<span id="ranks_scale_${x}""></span>${RANKS.fullNames[x]} <h4 id="ranks_amt_${x}"></h4><br>
			<button onclick="RANKS.reset('${rn}')" class="btn reset" id="ranks_${x}">
				<b id="ranks_reset_${x}" style='font-size: 16px'></b><br>
				(Requires <b id="ranks_req_${x}">X</b>)
				<b id="ranks_desc_${x}"></b>
			</button>
		</div>`
	}
	ranks_table.setHTML(table)

	let pres_table = new Element("pres_table")
	table = ""
	for (let x = 0; x < PRES_LEN; x++) {
		table += `<div style="width: 250px" id="pres_div_${x}">
			<button id="pres_auto_${x}" class="btn" style="width: 80px;" onclick="PRESTIGES.autoSwitch(${x})">OFF</button><br><br>
			<span id="pres_scale_${x}""></span>${PRESTIGES.fullNames[x]} <h4 id="pres_amt_${x}">X</h4>
			<button onclick="PRESTIGES.reset(${x})" class="btn reset" id="pres_${x}">
				<b id="pres_reset_${x}" style='font-size: 16px'></b><br>
				(Requires <b id="pres_req_${x}">X</b>)
				<b id="pres_desc_${x}"></b>
			</button>
		</div>`
	}
	pres_table.setHTML(table)

	setupAscensionsHTML()

	BUILDINGS.setup()

	let ranks_rewards_table = new Element("ranks_rewards_table")
	table = ""
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		table += `<div id="ranks_reward_div_${x}">`
		let keys = Object.keys(RANKS.desc[rn])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="ranks_reward_${rn}_${y}"><b>${RANKS.fullNames[x]} ${keys[y]}:</b> ${RANKS.desc[rn][keys[y]]}${RANKS.effect[rn][keys[y]]?` Currently: <span id='ranks_eff_${rn}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	ranks_rewards_table.setHTML(table)

	let pres_rewards_table = new Element("pres_rewards_table")
	table = ""
	for (let x = 0; x < PRES_LEN; x++) {
		table += `<div id="pres_reward_div_${x}">`
		let keys = Object.keys(PRESTIGES.rewards[x])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="pres_reward_${x}_${y}"><b>${PRESTIGES.fullNames[x]} ${keys[y]}:</b> ${PRESTIGES.rewards[x][keys[y]]}${PRESTIGES.rewardEff[x][keys[y]]?` Currently: <span id='pres_eff_${x}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	pres_rewards_table.setHTML(table)

	let br_rewards_table = new Element("br_rewards_table")
	table = ""
	for (let x in BEYOND_RANKS.rewards) {
		x = Number(x)
		let ee = BEYOND_RANKS.rewardEff[x]
		for (let y in BEYOND_RANKS.rewards[x]) {
			table += `<span id="br_reward_${x}_${y}"><b>${getRankTierName(x+5)} ${format(y,0)}:</b> ${BEYOND_RANKS.rewards[x][y]}${ee&&BEYOND_RANKS.rewardEff[x][y]?` Currently: <span id='br_eff_${x}_${y}'></span>`:""}</span><br>`
		}
		table += '<br>'
	}
	br_rewards_table.setHTML(table)

	let main_upgs_table = new Element("main_upgs_table")
	table = ""
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		table += `<div id="main_upg_${x}_div" style="width: 230px; margin: 0px 10px;"><b>${UPGS.main[x].title}</b><br><br><div style="font-size: 13px; min-height: 50px" id="main_upg_${x}_res"></div><br><div class="table_center" style="justify-content: start;">`
		for (let y = 1; y <= UPGS.main[x].lens; y++) {
			let key = UPGS.main[x][y]
			table += `<img onclick="UPGS.main[${x}].buy(${y})" onmouseover="UPGS.main.over(${x},${y})" onmouseleave="UPGS.main.reset()"
			 style="margin: 3px;" class="img_btn" id="main_upg_${x}_${y}" src="${key.noImage?`images/test.png`:`images/upgrades/main_upg_${id+y}.png`}">`
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

	setupStatsHTML()
	setupResourcesHTML()
	setupChalHTML()
	setupAtomHTML()
	setupElementsHTML()
	setupMDHTML()
	setupStarsHTML()
	setupTreeHTML()
	setupBosonsHTML()
	setupFermionsHTML()
	setupRadiationHTML()
	setupQuantumHTML()
	setupDarkHTML()
	setupInfHTML()

	let confirm_table = new Element("confirm_table")
	table = ""
	for (let x = 0; x < CONFIRMS.length; x++) {
		table += `<div style="width: 100px" id="confirm_div_${x}"><img src="images/${x == 1 ? "dm" : CONFIRMS[x]}.png"><br><button onclick="player.confirms.${CONFIRMS[x]} = !player.confirms.${CONFIRMS[x]}" class="btn" id="confirm_btn_${x}">OFF</button></div>`
	}
	confirm_table.setHTML(table)

    tmp.el = {}
	let all = document.getElementsByTagName("*")
	for (let i=0;i<all.length;i++) {
		let x = all[i]
		tmp.el[x.id] = new Element(x)
	}
}

function updateTabsHTML() {
	let s = !player.options.nav_hide[0]
	tmp.el.stabs_div.setDisplay(TABS[2][tmp.tab])
	
	for (let x = 0; x < TABS[1].length; x++) {
		let tab = TABS[1][x]
		if (s) {
			tmp.el["tab"+x].setDisplay(tab.unl ? tab.unl() : true)
			tmp.el["tab"+x].setClasses({btn_tab: true, [tab.style ? tab.style : "normal"]: true, choosed: x == tmp.tab})
		}

		if (tmp.el["tab_frame"+x]) tmp.el["tab_frame"+x].setDisplay(x == tmp.tab)
		if (TABS[2][x]) {
			tmp.el["stabs"+x].setDisplay(x == tmp.tab)
			if (x == tmp.tab) for (let y = 0; y < TABS[2][x].length; y++)  {
				let stab = TABS[2][x][y]
				tmp.el["stab"+x+"_"+y].el.parentElement.style.display = (!stab.unl || stab.unl()) ? "" : "none"
				tmp.el["stab"+x+"_"+y].setClasses({btn_tab: true, [stab.style ? stab.style : "normal"]: true, choosed: y == tmp.stab[x]})
				if (tmp.el["stab_frame"+x+"_"+y]) tmp.el["stab_frame"+x+"_"+y].setDisplay(y == tmp.stab[x])
			}
		}
	}
}

function updateUpperHTML() {
	let chal_unl = player.chal.active > 0
	tmp.el.mass_div.setDisplay(!chal_unl)
	if (!chal_unl) {
		tmp.el.mass_amt.setHTML(`<h4>${formatMass(player.mass)}</h4><br>
		${formatGain(player.mass, tmp.massGain, true)}`)
	}

	tmp.el.chal_upper.setDisplay(chal_unl)
	if (chal_unl) {
		let data = CHALS.getChalData(player.chal.active, tmp.chal.bulk[player.chal.active].max(player.chal.comps[player.chal.active]))
		tmp.el.chal_upper.setHTML(`You are now in [${CHALS[player.chal.active].title}] Challenge! Go over ${tmp.chal.format(tmp.chal.goal[player.chal.active])+CHALS.getResName(player.chal.active)} to complete.
		<br>+${tmp.chal.gain} Completions (+1 at ${tmp.chal.format(data.goal)+CHALS.getResName(player.chal.active)})`)
	}
}

function updateMassUpgradesHTML() {
	for (let x = 1; x <= 4; x++) BUILDINGS.update('mass_'+x)
}

function updateTickspeedHTML() {
	BUILDINGS.update('tickspeed')
	BUILDINGS.update('accelerator')
}

function updateRanksRewardHTML() {
	for (let x = 0; x < RANKS.names.length; x++) {
		let rn = RANKS.names[x]
		tmp.el["ranks_reward_div_"+x].setDisplay(player.ranks_reward == x)
        tmp.el[`stats_${rn}_btn`].setDisplay(player.ranks[rn].gt(0))
		if (player.ranks_reward == x) {
			let keys = Object.keys(RANKS.desc[rn])
			for (let y = 0; y < keys.length; y++) {
				let unl = player.ranks[rn].gte(keys[y])
				tmp.el["ranks_reward_"+rn+"_"+y].setDisplay(unl)
				if (unl) if (tmp.el["ranks_eff_"+rn+"_"+y]) tmp.el["ranks_eff_"+rn+"_"+y].setTxt(RANKS.effDesc[rn][keys[y]](RANKS.effect[rn][keys[y]]()))
			}
		}
	}

	tmp.el.stats_beyond_btn.setDisplay(tmp.brUnl)
	tmp.el.br_rewards_table.setDisplay(player.ranks_reward == "beyond")
	if (player.ranks_reward == "beyond") updateBeyondRanksRewardHTML()
}

function updatePrestigesRewardHTML() {
	let c16 = tmp.c16active
	for (let x = 0; x < PRES_LEN; x++) {
		tmp.el["pres_reward_div_"+x].setDisplay(player.pres_reward == x)
        tmp.el[`stats_${PRESTIGES.names[x]}_btn`].setDisplay(player.prestiges[x].gt(0))
		if (player.pres_reward == x) {
			let keys = Object.keys(PRESTIGES.rewards[x])
			for (let y = 0; y < keys.length; y++) {
				let unl = player.prestiges[x].gte(keys[y])
				tmp.el["pres_reward_"+x+"_"+y].setDisplay(unl)
				if (unl) {
					tmp.el["pres_reward_"+x+"_"+y].setClasses({corrupted_text2: c16 && CORRUPTED_PRES[x] && CORRUPTED_PRES[x].includes(parseInt(keys[y]))})
					if (tmp.el["pres_eff_"+x+"_"+y]) {
						let eff = PRESTIGES.rewardEff[x][keys[y]]
						tmp.el["pres_eff_"+x+"_"+y].setHTML(eff[1](tmp.prestiges.eff[x][keys[y]]))
					}
				}
			}
		}
	}
}

function updateBeyondRanksRewardHTML() {
	let t = tmp.beyond_ranks.max_tier, lt = tmp.beyond_ranks.latestRank, c16 = tmp.c16active, c16_cr = {
		1: [7],
	}
	for (let x in BEYOND_RANKS.rewards) {
		x = parseInt(x)

		for (let y in BEYOND_RANKS.rewards[x]) {
			y = parseInt(y)

			let unl = t > x || t == x && lt.gte(y)
			tmp.el["br_reward_"+x+"_"+y].setDisplay(unl)
			if (unl) {
				tmp.el["br_reward_"+x+"_"+y].setClasses({corrupted_text2: c16&&c16_cr[x]&&c16_cr[x].includes(y)})
				if (tmp.el["br_eff_"+x+"_"+y]) {
					let eff = BEYOND_RANKS.rewardEff[x][y]
					tmp.el["br_eff_"+x+"_"+y].setHTML(eff[1](tmp.beyond_ranks.eff[x][y]))
				}
			}
		}
	}
}

function updateMainUpgradesHTML() {
	if (player.main_upg_msg[0] != 0) {
		let upg1 = UPGS.main[player.main_upg_msg[0]]
		let upg2 = UPGS.main[player.main_upg_msg[0]][player.main_upg_msg[1]]
		let msg = "<span class='sky'>"+(typeof upg2.desc == "function" ? upg2.desc() : upg2.desc)+"</span><br><span>Cost: "+format(upg2.cost,0)+" "+upg1.res+"</span>"
		if (upg2.effDesc !== undefined) msg += "<br><span class='green'>Currently: "+tmp.upgs.main[player.main_upg_msg[0]][player.main_upg_msg[1]].effDesc+"</span>"
		tmp.el.main_upg_msg.setHTML(msg)
	} else tmp.el.main_upg_msg.setTxt("")
	for (let x = 1; x <= UPGS.main.cols; x++) {
		let id = UPGS.main.ids[x]
		let upg = UPGS.main[x]
		let unl = upg.unl()
		tmp.el["main_upg_"+x+"_div"].setDisplay(unl)
		tmp.el["main_upg_"+x+"_res"].setTxt(`You have ${upg.getRes().format(0)} ${upg.res}`)
		if (unl) {
			for (let y = 1; y <= upg.lens; y++) {
				let unl2 = upg[y].unl ? upg[y].unl() : true
				tmp.el["main_upg_"+x+"_"+y].changeStyle("visibility", unl2?"visible":"hidden")
				if (unl2) tmp.el["main_upg_"+x+"_"+y].setClasses({img_btn: true, locked: !upg.can(y), bought: player.mainUpg[id].includes(y)})
			}
			tmp.el["main_upg_"+x+"_auto"].setDisplay(upg.auto_unl ? upg.auto_unl() : false)
			tmp.el["main_upg_"+x+"_auto"].setTxt(player.auto_mainUpg[id]?"ON":"OFF")
		}
	}
}

function updateBlackHoleHTML() {
	tmp.el.bhMass2.setHTML(formatMass(player.bh.mass)+" "+formatGain(player.bh.mass, tmp.bh.mass_gain.mul(tmp.preQUGlobalSpeed), true))
	tmp.el.bhMassPower.setTxt(format(tmp.bh.massPowerGain))
	tmp.el.bhFSoft1.setDisplay(tmp.bh.f.gte(tmp.bh.fSoftStart))
	tmp.el.bhFSoftStart1.setTxt(format(tmp.bh.fSoftStart))
	tmp.el.bhMassPower2.setTxt(format(tmp.bh.massPowerGain))
	tmp.el.massSoft2.setDisplay(tmp.bh.mass_gain.gte(tmp.bh.massSoftGain))
	tmp.el.massSoftStart2.setTxt(formatMass(tmp.bh.massSoftGain))

	tmp.el.bhEffect.setTxt(hasElement(201)?"^"+format(tmp.bh.effect):format(tmp.bh.effect)+"x")
	tmp.el.bhCondenserEffect.setHTML(format(BUILDINGS.eff('bhc')))

	BUILDINGS.update('bhc')
	BUILDINGS.update('fvm')

	tmp.el.bhOverflow.setDisplay(player.bh.mass.gte(tmp.overflow_start.bh[0]))
    tmp.el.bhOverflow.setHTML(`Because of black hole mass overflow at <b>${formatMass(tmp.overflow_start.bh[0])}</b>, your mass of black hole gain is ${overflowFormat(tmp.overflow.bh||1)}!`)

	tmp.el.bhOverflow2.setDisplay(player.bh.mass.gte(tmp.overflow_start.bh[1]))
    tmp.el.bhOverflow2.setHTML(`Because of black hole mass overflow^2 at <b>${formatMass(tmp.overflow_start.bh[1])}</b>, your black hole mass overflow is even stronger!`)
	
	tmp.el.bhcEffectOverflow.setDisplay(BUILDINGS.eff('bhc').gte(tmp.overflow_start.BHCEffect[0]))
    tmp.el.bhcEffectOverflow.setHTML(`Because of BH Condenser siltation at <b>${format(tmp.overflow_start.BHCEffect[0])}</b>, the exponent of BH Condenser's effect is ${overflowFormat(tmp.overflow.BHCEffect||1)}!`)
	
	// Unstable 
	let unl = hasCharger(1)
	tmp.el.unstable_bhUnl.setDisplay(unl)
	if (unl) {
		tmp.el.bhUnstable.setHTML(formatMass(player.bh.unstable)+" "+formatGain(player.bh.unstable,UNSTABLE_BH.calcProduction(),true))
		tmp.el.bhUnstableEffect.setHTML("^"+format(tmp.unstable_bh.effect))
	}
}

function updateOptionsHTML() {
	if (tmp.stab[9] == 0) {
		for (let x = 0; x < CONFIRMS.length; x++) {
			let unl = 
			CONFIRMS[x] == "sn"
			?(player.supernova.times.gte(1) || quUnl())
			:CONFIRMS[x] == "qu"
			?quUnl()
			:CONFIRMS[x] == "br"
			?player.qu.rip.first
			:CONFIRMS[x] == "inf"
			?tmp.inf_unl
			:player[CONFIRMS[x]].unl
	
			tmp.el["confirm_div_"+x].setDisplay(unl)
			tmp.el["confirm_btn_"+x].setTxt(player.confirms[CONFIRMS[x]] ? "ON":"OFF")
		}
		tmp.el.offline_active.setTxt(player.offline.active?"ON":"OFF")
		tmp.el.tree_anim_btn.setDisplay(player.supernova.times.gte(1) || quUnl())
		tmp.el.tree_anim.setTxt(TREE_ANIM[player.options.tree_animation])
		tmp.el.mass_dis.setTxt(["Default",'Always show g','Important units only'][player.options.massDis])
	} else if (tmp.stab[9] == 1) {
		updateResourcesHiderHTML()
	}
}

function updateHTML() {
	document.documentElement.style.setProperty('--font', player.options.font)
	document.documentElement.style.setProperty('--cx', tmp.cx)
	document.documentElement.style.setProperty('--cy', tmp.cy)

	tmp.mobile = window.innerWidth < 1200

	let displayMainTab = true
	
	tmp.el.loading.setDisplay(!tmp.start)
    tmp.el.app.setDisplay(tmp.inf_time != 2 && tmp.inf_time != 3 && tmp.start && (player.supernova.times.lte(0) && !player.supernova.post_10 ? !tmp.supernova.reached : true) && displayMainTab)
	updateSupernovaEndingHTML()
	updateTabsHTML()
	if (!player.options.nav_hide[1]) updateResourcesHTML()
	if (hover_tooltip) updateTooltipResHTML()
	updateUpperHTML()
	if (tmp.start && (!tmp.supernova.reached || player.supernova.post_10) && displayMainTab) {
		updateQuantumHTML()
		updateDarkHTML()
		updateInfHTML()
		if (tmp.tab == 0) {
			updateRanksHTML()
			if (tmp.stab[0] == 0) {
				updateMassUpgradesHTML()
				updateTickspeedHTML()

				let lvl = 0
				for (var i = 1; i <= 8; i++) if (tmp.massGain.gte(tmp["massSoftGain"+i])) lvl = i
				tmp.el.massSoft.setDisplay(lvl)
				if (lvl) {
					tmp.el.massSoft.setClasses({["soft"+lvl+"_desc"]: true})
					tmp.el.massSoftStart.setTxt(formatMass(tmp["massSoftGain"+lvl]))
					tmp.el.massSoftLvl.setClasses({["soft"+lvl]: true})
					tmp.el.massSoftLvl.setHTML("(softcapped"+(lvl>1?"<sup>"+lvl+"</sup>":"")+")")
				}

				tmp.el.massOverflow.setDisplay(player.mass.gte(tmp.overflow_start.mass[0]))
				tmp.el.massOverflow.setHTML(`Because of mass overflow at <b>${formatMass(tmp.overflow_start.mass[0])}</b>, your mass gain is ${overflowFormat(tmp.overflow.mass||1)}!`)

				tmp.el.massOverflow2.setDisplay(player.mass.gte(tmp.overflow_start.mass[1]))
				tmp.el.massOverflow2.setHTML(`Because of mass overflow^2 at <b>${formatMass(tmp.overflow_start.mass[1])}</b>, your mass overflow is even stronger!`)

				tmp.el.strongerOverflow.setDisplay(BUILDINGS.eff('mass_3').gte(tmp.overflow_start.stronger[0]))
				tmp.el.strongerOverflow.setHTML(`Because of stronger overflow at <b>${format(tmp.overflow_start.stronger[0])}</b>, your stronger effect is ${overflowFormat(tmp.overflow.stronger||1)}!`)
			
				tmp.el.strongerOverflow2.setDisplay(BUILDINGS.eff('mass_3').gte(tmp.overflow_start.stronger[1]))
				tmp.el.strongerOverflow2.setHTML(`Because of stronger overflow^2 at <b>${format(tmp.overflow_start.stronger[1])}</b>, your stronger overflow is even stronger!`)
			} else if (tmp.stab[0] == 1) {
				updateBlackHoleHTML()
			} else if (tmp.stab[0] == 2) {
				updateAtomicHTML()
			}
		} else if (tmp.tab == 1) {
			tmp.el.total_time.setTxt(formatTime(player.time))
			if (tmp.stab[1] == 0) updateRanksRewardHTML()
			else if (tmp.stab[1] == 1) updatePrestigesRewardHTML()
			else if (tmp.stab[1] == 2) updateAscensionsRewardHTML()
			else if (tmp.stab[1] == 3) updateScalingHTML()
		} else if (tmp.tab == 2) {
			if (tmp.stab[2] == 0) updateMainUpgradesHTML()
			if (tmp.stab[2] == 1) updateElementsHTML()
		} else if (tmp.tab == 3) {
			updateChalHTML()
		} else if (tmp.tab == 4) {
			if (tmp.stab[4] == 0) updateAtomHTML()
			if (tmp.stab[4] == 1) updateMDHTML()
			if (tmp.stab[4] == 2) updateStarsHTML()
		} else if (tmp.tab == 9) {
			updateOptionsHTML()
		}
	}
}