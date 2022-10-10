const STARS = {
    unlocked() { return hasElement(36) },
    gain() {
        let x = player.stars.generators[0]
        if (player.md.upgs[8].gte(1)) x = x.mul(tmp.md.upgs[8].eff)
        x = x.mul(tmp.supernova.mult)

        if (CHALS_NEW.in(14)) x = x.pow(.01)
        return x.softcap(tmp.stars.softGain,tmp.stars.softPower,0)
    },
    softGain() {
        let s = D("e1000").pow(tmp.fermions.effs[1][0]||1)
        return s
    },
    softPower() {
        let p = D(0.75)
        return p
    },
    rankStr() {
        let p = D(1)
        if (hasElement(48)) p = p.mul(1.1)
        return p
    },
    effect() {
		let p = STARS.rankStr()
		let [s,r,t1,t2,pt] = [player.stars.points.mul(p),player.ranks.rank.mul(p),player.ranks.tier.mul(p),player.ranks.tetr.mul(p).softcap(5,hasTree("s2")?1.5:5,1).softcap(9,0.3,0),player.ranks.pent.mul(p)]
		let b = s.max(1).log10().add(1).max(s.root(1e9))
		let e = r.mul(t1.pow(2)).add(1).pow(t2.add(1).pow(5/9).mul(0.25).min(1)).mul(RANKS.effect.pent[1](pt)).softcap(1e12,1e3,3)
		return { eff: b.pow(e), exp: e }
	},
    generators: {
        req: [D(1e225),D(1e280),D('e320'),D('e430'),D('e870')],
        unl(auto=false) {
            let boost_unl = STARS.generators.booster_unl()
            if (player.atom.quarks.gte(boost_unl ? tmp.stars.gb_req : tmp.stars.gen_req)) {
                if (boost_unl) player.stars.boost = auto ? player.stars.boost.max(tmp.stars.gb_bulk) : player.stars.boost.add(1)
                else player.stars.unls++
            }
        },
        booster_unl() {
            return hasTree("s4") && player.stars.unls == 5
        },
        gain(i) {
            let pow = D(1.5)
            if (FERMIONS.onActive("13")) pow = D(0.5)
            else {
                if (hasElement(50)) pow = pow.mul(1.05)
                if (hasTree("s3")) pow = pow.mul(treeEff("s3"))
            }

            let x = D(player.stars.unls > i ? 1 : 0).add(player.stars.generators[i+1]||0).pow(pow)
            if (hasElement(49) && i==4) x = x.mul(tmp.elements.effect[49])
            if (hasTree("s1") && i==4) x = x.mul(treeEff("s1"))
            if (player.md.upgs[8].gte(1)) x = x.mul(tmp.md.upgs[8].eff)
            if (hasElement(54)) x = x.mul(tmp.elements.effect[54])
            if (!scalingToned("supernova")) x = x.mul(tmp.bosons.upgs.photon[3].effect)
            x = x.mul(tmp.supernova.mult)

            return x.mul(tmp.stars.gb_eff)
        },
    },
    colors: ["#0085FF","#BFE0FF","#FFD500","#FF5200","#990000"],
}

function calcStars(dt) {
    player.stars.points = player.stars.points.add(tmp.stars.gain.mul(dt))
    if (!player.supernova.post_10) player.stars.points = player.stars.points.min(tmp.supernova.maxlimit)
    for (let x = 0; x < 5; x++) player.stars.generators[x] = player.stars.generators[x].add(tmp.stars.gen_gains[x].mul(dt))

    if (hasTree("qol4")) STARS.generators.unl(true)
}

function updateStarsTemp() {
	if (!tmp.stars) tmp.stars = {
		gen_gains: [],
	}

	let ts = tmp.stars
	let exp = Math.max(TONES.power(1),1.25)
	ts.gen_req = player.stars.unls<5?STARS.generators.req[player.stars.unls]:EINF
	ts.gb_req = D("e100").pow(player.stars.boost.pow(exp)).mul('e8000')
	ts.gb_bulk = player.atom.quarks.div("e8000").log10().div(100).root(exp).floor().add(1)
	if (player.atom.quarks.lt("e8000")) ts.gb_bulk = D(0)

	ts.gb_base = D(2)
	ts.gb_str = D(1)
	if (hasElement(57)) ts.gb_base = ts.gb_base.mul(tmp.elements.effect[57])
    if (bosonsMastered()) ts.gb_base = ts.gb_base.mul(tmp.bosons.upgs.photon[1].effect)
	ts.gb_str = ts.gb_str.mul(CHALS_NEW.eff(11))

	ts.gb_bonus = tmp.eb.ag2?tmp.eb.ag2.eff:D(0)
	ts.gb_eff = ts.gb_base.pow(player.stars.boost.add(ts.gb_bonus).mul(ts.gb_str))

	for (let x = 0; x < 5; x++) ts.gen_gains[x] = STARS.generators.gain(x)
	ts.softPower = STARS.softPower()
	ts.softGain = STARS.softGain()
	ts.gain = STARS.gain()
	ts.effect = STARS.effect()
}

function setupStarsHTML() {
    let stars_table = new Element("stars_table")
	let table = ""
	for (let i = 0; i < 5; i++) {
        if (i > 0) table += `<div id="star_gen_arrow_${i}" style="width: 30px; font-size: 30px"><br>←</div>`
        table += `
            <div id="star_gen_div_${i}" style="width: 250px;">
                <img src="images/star_${5-i}.png"><br><br>
                <div id="star_gen_${i}">X</div>
            </div>
        `
	}
	stars_table.setHTML(table)
}

function updateScreensHTML() {
	//STARS
	let shown = (!tmp.supernova.reached || player.supernova.post_10) && tmp.tab != 5 && !GLUBALL.unl()
	elm.star.setDisplay(shown)
	if (shown) {
		let g = tmp.supernova.bulk.sub(player.supernova.times).max(0)
		let percent = 0
		if (g.gte(1) && player.supernova.post_10) {
			let d = SUPERNOVA.req(tmp.supernova.bulk).maxlimit
			let e = SUPERNOVA.req(tmp.supernova.bulk.sub(1)).maxlimit
			percent = player.stars.points.div(e).max(1).log10().div(d.div(tmp.supernova.maxlimit).max(1).log10()).max(0).min(1).toNumber()
		}
		else percent = player.stars.points.max(1).log10().div(tmp.supernova.maxlimit.max(1).log10()).max(0).min(1).toNumber()
		let size = Math.min(window.innerWidth, window.innerHeight)*percent*0.9
		let color = `rgb(${percent/0.4*191}, ${percent/0.4*91+133}, 255)`
		if (percent>0.4) color = `rgb(${(percent-0.4)/0.2*64+191}, ${224-(percent-0.4)/0.2*11}, ${255-(percent-0.4)/0.2*255})`
		if (percent>0.6) color = `rgb(255, ${213-(percent-0.6)/0.1*131}, 0)`
		if (percent>0.7) color = `rgb(${255-(percent-0.7)/0.1*102}, ${82-(percent-0.7)/0.1*82}, 0)`
		if (percent>0.8) color = `rgb(153, 0, 0)`
		elm.star.changeStyle('background-color',color)
		elm.star.changeStyle('width',size+"px")
		elm.star.changeStyle('height',size+"px")
	}

	//GLUEBALLS
	updateChromaScreen()
}

function updateStarsHTML() {
    elm.starSoft.setDisplay(tmp.stars.gain.gte(tmp.stars.softGain))
	elm.starSoftStart.setTxt(format(tmp.stars.softGain))
    elm.stars_Amt.setTxt(format(player.stars.points,2)+" / "+format(tmp.supernova.maxlimit,2)+" "+formatGain(player.stars.points,tmp.stars.gain))
    elm.stars_eff.setTxt(format(tmp.stars.effect.eff))
    elm.stars_exp.setHTML("(^"+format(tmp.stars.effect.exp)+", based on all types of Rank)" + getSoftcapHTML(tmp.stars.effect.exp, 1e12))

	let boost_unl = STARS.generators.booster_unl()
    elm.star_btn.setDisplay(player.stars.unls < 5 || boost_unl)
	elm.star_btn.setHTML(
		!boost_unl ? `Unlock a new type of Stars. (${format(tmp.stars.gen_req)} Quarks)` :
		`Boost Stars. (${format(tmp.stars.gb_req)} Quarks)<br>`+
		`Level: ${format(player.stars.boost,0)}` + (tmp.stars.gb_bonus.gt(0)?" + "+format(tmp.stars.gb_bonus,0):"") + (tmp.stars.gb_str.gt(1) ? ", " + formatMultiply(tmp.stars.gb_str) : "") +
		`<br>Effect: ${format(tmp.stars.gb_eff)}x (${format(tmp.stars.gb_base, 3)}x power)`
	)

    elm.star_btn.setClasses({btn: true, locked: !player.atom.quarks.gte(!hasTree("s4")||player.stars.unls < 5?tmp.stars.gen_req:tmp.stars.gb_req)})

    for (let x = 0; x < 5; x++) {
        let unl = player.stars.unls > x
        elm["star_gen_div_"+x].setDisplay(unl)
        if (elm["star_gen_arrow_"+x]) elm["star_gen_arrow_"+x].setDisplay(unl)
        if (unl) elm["star_gen_"+x].setHTML(format(player.stars.generators[x],2)+"<br>"+formatGain(player.stars.generators[x],tmp.stars.gen_gains[x]))
    }
}