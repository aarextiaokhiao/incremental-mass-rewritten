const QCs = {
    active() { return player.qu.qc.active || player.qu.rip.active },
    getMod(x) { return player.qu.rip.active ? BIG_RIP_QC[x] : player.qu.qc.mods[x] },
    incMod(x,i) { if (!this.active()) player.qu.qc.mods[x] = Math.min(Math.max(player.qu.qc.mods[x]+i,0),hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10) },
    enter() {
		if(!hasTree('unl3')){
			player.qu.qc.active = false
            QUANTUM.doReset(player.qu.qc.active)
			return;
		}
        if (!player.qu.qc.active) {
            let is_zero = true
            for (let x = 0; x < QCs_len; x++) if (this.getMod(x)>0) {
                is_zero = false
                break
            }
            if (is_zero) return
        }
        if (player.qu.qc.active ? true : confirm("Are you sure to enter the Quantum Challenge? Entering it will force reset!")) {
            player.qu.qc.active = !player.qu.qc.active
            QUANTUM.doReset(player.qu.qc.active)
        }
    },
    names: ["Black Dwarf","Time Anomaly","Hypertiered","Melted Interactions","Intense Catalyst","Ex-Challenge","Spatial Dilation","Extreme Scaling"],
    ctn: [
        {
            eff(i) {
				if(i>=34)return [0,0]
				if(i>=11)return [1-0.03*i,2/(i**3/100+2)]
                return [1-0.03*i,2/(i+2)]
            },
            effDesc(x) { return `^${format(x[0])} to exponent from All-Stars resources.<br>^${format(x[1])} to strength of star generators.` },
        },{
            eff(i) {
				if(hasPrestige(0,134))i *= 0.97
				//if(i>=30)return E(2).pow(10**i)
				if(i>=35)return E(2).pow(i**10/5e10)
				if(i>=11)return E(2).pow(i**5/1000)
                let x = E(2).pow(i**2)
                return x
            },
            effDesc(x) { return `/${format(x,0)} to pre-Quantum global speed.` },
        },{
            eff(i) {
                if (hasElement(129) && player.qu.rip.active) i *= 0.5
                if (player.ranks.hex.gte(129) && player.qu.rip.active) i *= 0.5
				//if(i>=30)return 10**i
				if(i>=11)return i**3.5*0.0015+1
                let x = i**1.5*0.15+1
                return x
            },
            effDesc(x) { return `x${format(x)} to requirements of any Fermions.` },
        },{
            eff(i) {
				//if(i>=30)return 0
				if(i>=21)return 0.9**(i**6.25/800000)
				if(i>=11)return 0.9**(i**3.25/100)
                let x = 0.9**(i**1.25)
                return x
            },
            effDesc(x) { return `^${format(x)} to multiplier from Bosonic & Radiation resources.` },
        },{
            eff(i) {
				if(hasPrestige(0,99))i *= 0.92
				if(hasPrestige(1,28))i *= 0.92
				if(hasElement(143))i *= 0.95
				if(hasPrestige(1,39))i *= 0.95
				if(hasElement(154))i *= 0.95
				if(hasElement(172))i *= 0.94
				//if(i>=30)return 0
				if(i>=21&&hasElement(185))return 0.8**(i**5.25/40000)
				if(i>=21)return 0.8**(i**6.25/800000)
				if(i>=11)return 0.8**(i**3.25/100)
                let x = 0.8**(i**1.25)
                return x
            },
            effDesc(x) { return `^${format(x)} to multiplier from pre-Supernova resources, except All-Stars resources.` },
        },{
            eff(i) {
				//if(i>=30)return 1e200
				if(i>=11)return Math.min(1.2**(i**4/1000),1e300)
                let x = 1.2**i
                return x
            },
            effDesc(x) { return `x${format(x)} to requirements of any pre-Quantum Challenges.` },
        },{
            eff(i) {
				//if(i>=30)return 1e200
				if(i>=11)return i**4.5/2000+1
                let x = i**1.5/2+1
                return x
            },
            effDesc(x) { return `^${format(x)} to Mass Dilation’s penalty.` },
        },{
            eff(i) {
                if (hasElement(98) && player.qu.rip.active) i *= 0.8
                if (player.ranks.hex.gte(135) && player.qu.rip.active) i *= 0.6
				//if(i>=30)return [0,10**i]
				if(i>=17)return [0.15*((2/3)**(i-17)),i**4/10000+1]
				if(i>=11)return [1-0.05*i,i**4/10000+1]
                let x = [1-0.05*i,i/10+1]
                return x
            },
            effDesc(x) { return `^${format(x[0])} to starting of pre-Quantum scaling.<br>${format(x[1]*100)}% to strength of pre-Quantum scaling.` },
        },
    ],
	maxAll(){
		if (QCs.active()) return
		for (let i = 0; i < QCs_len; i++)player.qu.qc.mods[i] = hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10
	},
	resetAll(){
		if (QCs.active()) return
		for (let i = 0; i < QCs_len; i++)player.qu.qc.mods[i] = 0
	},
	import(){
		if (QCs.active()) return
		let preset = prompt('Import your preset.').split('/');
		if(preset.length!=8){
			alert('Your preset is invalid.');
			return
		}
		let copied_mods = []
		for (let x = 0; x < QCs_len; x++){
			copied_mods.push(parseInt(preset[x]))
			if (copied_mods[x] != copied_mods[x]){
				alert('Your preset is invalid.');
				return
			}
			if (copied_mods[x] < 0){
				alert('Your preset is invalid.');
				return
			}
			if (copied_mods[x] > 100){
				alert('Your preset is invalid.');
				return
			}
		}
		for (let i = 0; i < QCs_len; i++)player.qu.qc.mods[i] = copied_mods[i]
		for (let i = 0; i < QCs_len; i++)if(player.qu.qc.mods[i] > (hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10))player.qu.qc.mods[i] = (hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10);
	},
	export(){
		let str = player.qu.qc.mods[0]
		for (let i = 1; i < QCs_len; i++)str+="/"+player.qu.qc.mods[i];
		let copyText = document.getElementById('copy')
		copyText.value = str
		copyText.style.visibility = "visible"
		copyText.select();
		document.execCommand("copy");
		copyText.style.visibility = "hidden"
		addNotify("Preset Exported to Clipboard")
		updateQCModPresets()
	}
}

const QCs_len = 8

function addQCPresetAs() {
    if (player.qu.qc.presets.length >= 5) {
        addNotify("You cannot add QC Preset because of maxmium length of presets")
        return
    }

    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets.push({
        p_name: "New Preset",
        mods: copied_mods,
    })
    updateQCModPresets()
}

function importPreset() {
    if (player.qu.qc.presets.length >= 5) {
        addNotify("You cannot add QC Preset because of maxmium length of presets")
        return
    }

	let preset = prompt('Import your preset.').split('/');
	if(preset.length!=8){
		alert('Your preset is invalid.');
		return
	}
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++){
		copied_mods.push(parseInt(preset[x]))
		if (copied_mods[x] != copied_mods[x]){
			alert('Your preset is invalid.');
			return
		}
		if (copied_mods[x] < 0){
			alert('Your preset is invalid.');
			return
		}
		if (copied_mods[x] > 100){
			alert('Your preset is invalid.');
			return
		}
	}
    player.qu.qc.presets.push({
        p_name: "New Preset",
        mods: copied_mods,
    })
    updateQCModPresets()
}

function importQCPreset(x) {
	let preset = prompt('Import your preset.').split('/');
	if(preset.length!=8){
		alert('Your preset is invalid.');
		return
	}
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++){
		copied_mods.push(parseInt(preset[x]))
		if (copied_mods[x] != copied_mods[x]){
			alert('Your preset is invalid.');
			return
		}
		if (copied_mods[x] < 0){
			alert('Your preset is invalid.');
			return
		}
		if (copied_mods[x] > 100){
			alert('Your preset is invalid.');
			return
		}
	}
    player.qu.qc.presets[x].mods = copied_mods
    updateQCModPresets()
}

function saveQCPreset(x) {
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets[x].mods = copied_mods
    addNotify("Preset Saved")
    updateQCModPresets()
}

function loadQCPreset(x) {
    if (QCs.active()) return
    for (let i = 0; i < QCs_len; i++)player.qu.qc.mods[i] = player.qu.qc.presets[x].mods[i]
	for (let i = 0; i < QCs_len; i++)if(player.qu.qc.mods[i] > (hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10))player.qu.qc.mods[i] = (hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10);
    addNotify("Preset Loaded to Modifiers")
    updateQCModPresets()
}

function exportQCPreset(x) {
	let str = player.qu.qc.presets[x].mods[0]
	for (let i = 1; i < QCs_len; i++)str+="/"+player.qu.qc.presets[x].mods[i];
	let copyText = document.getElementById('copy')
    copyText.value = str
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
    addNotify("Preset Exported to Clipboard")
    updateQCModPresets()
}

function renameQCPreset(x) {
    let renamed = prompt("Input the preset name")
    player.qu.qc.presets[x].p_name = renamed
    addNotify("Preset Renamed")
    updateQCModPresets()
}

function deleteQCPreset(x) {
    if (confirm("Are you sure to delete the preset?")) {
        let represets = []
        for (let y = 0; y < player.qu.qc.presets.length; y++) if (x != y) represets.push(player.qu.qc.presets[y])
        player.qu.qc.presets = represets
        addNotify("Preset Deleted")
    }
    updateQCModPresets()
}

function setupQCHTML() {
    let new_table = new Element("QC_table")
	let table = ""
	for (let x = 0; x < QCs_len; x++) {
        table += `
        <div style="margin: 5px;">
        <div style="margin: 5px" tooltip="${QCs.names[x]}"><img onclick="tmp.qc_ch = ${x}" style="cursor: pointer" src="images/qcm${x}.png"></div>
        <div><span id="qcm_mod${x}">0</span>/<span id="qcm_max${x}">10</span></div>
        <div id="qcm_btns${x}"><button onclick="QCs.incMod(${x},-999); tmp.qc_ch = ${x}">0</button><button onclick="QCs.incMod(${x},-1); tmp.qc_ch = ${x}">-</button><button onclick="QCs.incMod(${x},1); tmp.qc_ch = ${x}">+</button><button onclick="QCs.incMod(${x},999); tmp.qc_ch = ${x}">M</button></div>
        </div>
        `
    }
	new_table.setHTML(table)
}

function updateQCModPresets() {
    let table = ""
    for (let x = 0; x < player.qu.qc.presets.length; x++) {
        let p = player.qu.qc.presets[x]
        table += `
        <div class="table_center" style="align-items: center;">
        <div style="margin: 5px; width: 150px; text-align: left">${p.p_name}</div>
        <div style="margin: 5px; width: 500px" class="table_center">
        `
        for (let y = 0; y < QCs_len; y++) {
            table += `
            <div style="margin: 3px; align-items: center;" class="table_center">
            <div style="margin-right: 3px; width: 20px; text-align: right;">${p.mods[y]}</div><div tooltip="${QCs.names[y]}"><img style="width: 25px; height: 25px" src="images/qcm${y}.png"></div>
            </div>
            `
        }
        table += `</div>
        <div style="margin: 3px">
        <button class="btn" onclick="saveQCPreset(${x})">Save</button>
        <button class="btn" onclick="loadQCPreset(${x})">Load</button>
        <button class="btn" onclick="importQCPreset(${x})">Import</button>
        <button class="btn" onclick="exportQCPreset(${x})">Export</button>
        <button class="btn" onclick="renameQCPreset(${x})">Rename</button>
        <button class="btn" onclick="deleteQCPreset(${x})">Delete</button>
        </div>
        </div>`
    }
    tmp.el.QC_Presets_table.setHTML(table)
}

function updateQCTemp() {
    tmp.qu.qc_s_b = E(2)
    if (hasTree("qf4")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(.5)
    if (hasPrestige(0,2)) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(.5)
    if (hasTree("qc3")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(treeEff('qc3',0))
    if (hasTree("qc6")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(treeEff('qc6',0))
    tmp.qu.qc_s_eff = tmp.qu.qc_s_b.pow(player.qu.qc.shard)

    let s = 0
    let bs = 0
    for (let x = 0; x < QCs_len; x++) {
        let m = QCs.getMod(x)
        s += m
        tmp.qu.qc_eff[x] = QCs.ctn[x].eff(m)
        if (hasTree('qc2') && m >= 10) bs++
    }
    tmp.qu.qc_s = s
    tmp.qu.qc_s_bouns = bs
}

function updateQCHTML() {
    tmp.el.qc_shard.setTxt(player.qu.qc.shard+(tmp.qu.qc_s+tmp.qu.qc_s_bouns!=player.qu.qc.shard?(` (${tmp.qu.qc_s+tmp.qu.qc_s_bouns>=player.qu.qc.shard?"+":""}${tmp.qu.qc_s+tmp.qu.qc_s_bouns-player.qu.qc.shard})`):""))
    tmp.el.qc_shard_b.setTxt(tmp.qu.qc_s_b.format(1))
    tmp.el.qc_shard_eff.setTxt(tmp.qu.qc_s_eff.format(1))

    for (let x = 0; x < 2; x++) {
        tmp.el["qc_tab"+x].setDisplay(tmp.qc_tab == x)
    }
    if (tmp.qc_tab == 0) {
        tmp.el.qc_btn.setDisplay(!player.qu.rip.active)
        tmp.el.qc_btn.setTxt((QCs.active()?"Exit":"Enter") + " the Quantum Challenge")
        for (let x = 0; x < QCs_len; x++) {
            tmp.el["qcm_mod"+x].setTxt(QCs.getMod(x))
            tmp.el["qcm_max"+x].setTxt(hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10)
            tmp.el["qcm_btns"+x].setDisplay(!QCs.active())
        }
        tmp.el.qc_desc_div.setDisplay(tmp.qc_ch >= 0)
        if (tmp.qc_ch >= 0) {
            let x = tmp.qc_ch
            tmp.el.qc_ch_title.setTxt(`[${x+1}] ${QCs.names[x]} [${QCs.getMod(x)}/${hasTree('qc4')?Math.min(Math.max(Math.floor(player.qu.qc.shard/8),10),50):10}]`)
            tmp.el.qc_ch_desc.setHTML(QCs.ctn[x].effDesc(tmp.qu.qc_eff[x]))
        }
    }
}