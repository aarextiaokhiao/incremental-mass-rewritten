function gameStarted() {
	return player.ranks.rank.gt(0) || player.ranks.tier.gt(0) || (inNGM() ? player.mg.unl : player.rp.unl)
}

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
    elm.notify.setVisible(false)
    updateNotify()
}

function updateNotify() {
    if (tmp.notify.length > 0) {
        elm.notify.setHTML(tmp.notify[0].text)
        elm.notify.setVisible(true)
        elm.notify.setClasses({hide: false})
        setTimeout(_=>{
            elm.notify.setClasses({hide: true})
            setTimeout(removeNotify, 750)
        }, tmp.notify[0].duration*1000)
    }
}

const POPUP_GROUPS = {
    help: {
        html: () => `
        <h1>Mass</h1><br>
        g (gram): 1 g<br>
        kg (kilogram): 1,000 g<br>
        tonne (tonne): 1,000 kg = 1,000,000 g<br>
        MTI (mass of RMS Titanic): 52,000 tonne = 5.2e10 g<br>
        MME (mass of Mount Everest): 3,113,461,538 MTI = 1.619e20 g<br>
        M⊕ (mass of Earth): 36,886,967 MME = 5.972e27 g<br>
        M☉ (mass of Sun): 333,054 M⊕ = 1.989e33 g<br>
        MMWG (mass of Milky Way Galaxy): 1.5e12 M☉ = 2.9835e45 g<br>
        uni (mass of Universe): 50,276,520,864 MMWG = 1.5e56 g<br><br>

        mlt (mass of Multiverse): 1e1e9 uni<br>
        meg (mass of Megaverse): 1e15 mlt = 1e1e24 uni<br>
        gig (mass of Gigaverse): 1e15 meg = 1e1e39 uni<br>
        tvr (mass of Teraverse): 1e15 gig = 1e1e54 uni<br>
        pev (mass of Petaverse): 1e15 tvr = 1e1e69 uni<br>
        exv (mass of Exaverse): 1e15 pev = 1e1e84 uni<br>
        zev (mass of Zettaverse): 1e15 exv = 1e1e99 uni<br>
        ytv (mass of Yottaverse): 1e15 zev = 1e1e114 uni<br>
        xvr (mass of Xennaverse): 1e15 ytv = 1e1e129 uni<br>
        wkv (mass of Wekaverse): 1e15 xvr = 1e1e144 uni<br><br>
        arv-11 (mass of 11th Archverse): 1e15 wkv = 1e1e159 uni<br><br>

        omni (mass of Omniverse): 1e1,000 mlt = 1e1e1,009 uni<br>
        `,
    },
    fonts: {
        html: `
            <button class="btn" style="font-family: 'Andy Bold';" onclick="changeFont('Andy Bold')">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="changeFont('Arial, Helvetica, sans-ser')">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="changeFont('Bahnschrift')">Bahnschrift</button>
            <button class="btn" style="font-family: Courier;" onclick="changeFont('Courier')">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="changeFont('Cousine')">Cousine</button>
            <button class="btn" style="font-family: 'Fredoka One';" onclick="changeFont('Fredoka One')">Fredoka One</button>
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
            <button class="btn" onclick="player.options.notation = 'mix'">Mixed Scientific</button>
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
            Congratulations!<br><br><b class='ch_color'>You have unravelled the prism, and unleashed the colors!</b><br><br>
            <b style='color:#3f00bf'>Glueballs have been unlocked in Exotic tab!</b>
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

	layer_1: {
        html: `
            <b class='red'>Layer 1: Rage!</b><br><br>
			After tiers, you decided to go farther...<br>
			Doing the first of major resets as your advantages rage on!
        `,
        width: 400,
        height: 150,
        button: "Okay"
	},
	layer_2: {
        html: `
            <b class='yellow'>Layer 2: Black Hole!</b><br><br>
			Eruptly, a black hole appears.<br>
			The mass starts to suck up for power.<br>
			Take this as your advantage.
        `,
        width: 400,
        height: 150,
        button: "Okay"
	},
	layer_3: {
        html: `
            <b>Layer 3: Atoms!</b><br><br>
			You dive deeper and saw the subatomic scale.<br>
			Colorful quarks and new challenges have been unlocked!
        `,
        width: 400,
        height: 150,
        button: "Okay"
	},
	layer_5: {
        html: `
            <b class='scarlet'>Layer 5: Exotic!</b><br><br>
			While you were rising Exotic, mysterious particles emit out.<br>
			The goal of this layer is to capture them!<br>
			First, you've captured Axions!
        `,
        width: 400,
        height: 180,
        button: "Cool"
	},
    pres_1: {
        html: `
            <img src="images/story/pres_1.png"><br><br>
            Spacetime has been imploded into unknown substances...
            The everyday life has been obliberated, but what cost?
        `,
        button: "Uh oh",
        otherStyle: {
            'font-size': "14px",
        },
    },
    pres_2: {
        html: `
            <img src="images/story/pres_2.png"><br><br>
            It is unknown whether it is good, chaos, prime, or not.
            You have come far enough, but unfortunately...
			You are descended into a dimensionless entity.
        `,
        button: "Sigh",
        otherStyle: {
            'font-size': "14px",
        },
    },
    pres_3: {
        html: `
            <img src="images/story/pres_3.png"><br><br>
            The dimensions bent beyond recogition, devoiding space.
            As you gain the sense of Primordials, you are proficient enough.
            Invisibly seeing the clouds, they give you a gift.
        `,
        button: "Accept the gift",
        otherStyle: {
            'font-size': "14px",
        },
    },
    pres_4: {
        html: `
            <img src="images/story/pres_4.png"><br><br>
            You have been ascended. The unknownness has come!
            Let's reformulate the spatial and temporal axises!
			<br><br>
            Mass has been rebuilt by Primordial Gods.
            <b style='font-size: 24px'>Good luck!</b>
        `,
        button: "Build em' all!",
        otherStyle: {
            'font-size': "14px",
        },
    },

	ap_chroma: {
		html() { return `
			<b class='purple' style='font-size: 20px'>v1 - Prismatic Recall!</b><br>
			<i>Recalling the Altar, <span class='ch_color'>colors</span> <span class='red'>aw</span><span class='green'>ai</span><span class='sky'>t</span><span class='magenta'>...</span></i>
            <br>
			Introducing 2 new features:
            <br><br>
			<span class='ch_color'>Glueballs</span>, bringing out colors with buildable spectrums!<br>
			You need to get 13 C13 completions to unlock Glueballs.
            <br><br>
			And <span class='pr_color'>Primordiums</span>: the unseen, hyperspatial elements!<br>
			<span class='pr_color'>Formulate the spacetime!</span>
            <br><br>
			Final Neutron upgrades and Axion Boosts have been also added.<br>
			Have fun! End-game: `+formatMass(E("1e1e30"))+` - `+formatMass(E("1e1e48"))+`<br><br>
			
			<b class='purple' style='font-size: 7px'>Oh, this is a part of Spectraglow series.</b>
		` },
		width: 600,
		height: 300,
		otherStyle: {
			'font-size': "14px",
		},
	},
}

function addPopup(data) {
    tmp.popup.push({
        html: (data.html&&(typeof(data.html)=="function"?data.html():data.html))||"",
        button: data.button||"Okay",
        callFunctions: data.callFunction?function() {removePopup();data.callFunctions()}:removePopup,

        width: data.width||600,
        height: data.height||400,
        otherStyle: data.otherStyle||{},
    })
    updatePopup()
}

function updatePopup() {
    elm.popup.setDisplay(tmp.popup.length > 0)
    if (tmp.popup.length > 0) {
        elm.popup_html.setHTML(tmp.popup[0].html)
        elm.popup_html.changeStyle("height", tmp.popup[0].height-35)
        elm.popup_button.setHTML(tmp.popup[0].button)
        elm.popup.changeStyle("width", tmp.popup[0].width)
        elm.popup.changeStyle("height", tmp.popup[0].height)
        for (let x in tmp.popup[0].otherStyle) elm.popup_html.changeStyle(x, tmp.popup[0].otherStyle[x])
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

const BUILDINGS = ["massUpg", "tickspeed", "bh_condenser", "gamma_ray"]