const EXOTIC_BOOST_LENGTH = 7;

const EXOTIC_BOOST = {
    gain() {
		let x = player.exotic.points.add(1).log10().div(3);
		x = x.add(EXOTIC_BOOST.fgain())
        return x.floor()
    },
    fgain() {
		let x = SUPERNOVA_CLUSTER.effects.eff3()
        return x
    },
    used_bp() {
		let x = E(0);
		for(let i=0;i<EXOTIC_BOOST_LENGTH;i++){
			player.exotic.boosts[i] = player.exotic.boosts[i].floor().max(0);
			x = x.add(player.exotic.boosts[i]);
		}
        return x
    },
	effect(i) {
		let ret = (i == 6 && hasElement(390))?player.exotic.boosts[i].pow(0.6).div(3):(i == 6)?player.exotic.boosts[i].add(1).log10():player.exotic.boosts[i].add(EXOTIC_BOOST.effect(6)).sqrt().mul(0.01);
		if(hasElement(366))ret = ret.mul(1.2);
		if(hasElement(384))ret = ret.mul(1.1);
		if(hasElement(408))ret = ret.mul(1.1);
		if(hasElement(416) && i == 6)ret = ret.mul(1.5);
		if(hasElement(432))ret = ret.mul(1.1);
		if(hasElement(446) && i == 6)ret = ret.mul(1.2);
		ret = ret.mul(EXOTIC.abEff().exb);
		if(player.gc.active && player.gc.noeb)ret = new Decimal(0);
		if(i == 6)return ret;
		return E(1).add(ret);
	},
	buy(i) {
		tmp.ex.exb_can = player.exotic.bp.gt(EXOTIC_BOOST.used_bp());
		if(tmp.ex.exb_can)player.exotic.boosts[i]=player.exotic.boosts[i].add(1);
	},
	buyMax(i) {
		tmp.ex.exb_can = player.exotic.bp.gt(EXOTIC_BOOST.used_bp());
		if(tmp.ex.exb_can)player.exotic.boosts[i]=player.exotic.boosts[i].add(player.exotic.bp.sub(EXOTIC_BOOST.used_bp()));
	},
	respec() {
		if (!confirm("Are you sure you want to respec all Exotic Boosts?"))return;
		for(let i=0;i<EXOTIC_BOOST_LENGTH;i++){
			player.exotic.boosts[i]=E(0);
		}
		EXOTIC.doReset(true);
	},
	refund(i) {
		if(player.exotic.boosts[i].lte(0))return;
		player.exotic.boosts[i]=player.exotic.boosts[i].sub(1);
		EXOTIC.doReset(true);
	},
	refundMax(i) {
		if(player.exotic.boosts[i].lte(0))return;
		player.exotic.boosts[i]=E(0);
		EXOTIC.doReset(true);
	},
	export(){
		let str = player.exotic.boosts[0].toString()
		for (let i = 1; i < EXOTIC_BOOST_LENGTH; i++)str+="/"+player.exotic.boosts[i].toString();
		let copyText = document.getElementById('copy')
		copyText.value = str
		copyText.style.visibility = "visible"
		copyText.select();
		document.execCommand("copy");
		copyText.style.visibility = "hidden"
		addNotify("Exported to Clipboard")
	},
	import(){
		let preset = prompt('Import your Exotic Boost Setup.').split('/');
		if(preset.length!=EXOTIC_BOOST_LENGTH){
			alert('Your Exotic Boost Setup is invalid.');
			return
		}
		let copied_mods = []
		for (let x = 0; x < EXOTIC_BOOST_LENGTH; x++){
			copied_mods.push(E(preset[x]).floor())
			if (copied_mods[x].lt(0) || Number.isNaN(copied_mods[x].mag) || Number.isNaN(copied_mods[x].layer) || Number.isNaN(copied_mods[x].sign)){
				alert('Your Exotic Boost Setup is invalid.');
				return
			}
		}
		for (let x = 0; x < EXOTIC_BOOST_LENGTH; x++){
			if(player.exotic.boosts[x].gte(copied_mods[x]))continue;
			player.exotic.boosts[x]=player.exotic.boosts[x].sub(EXOTIC_BOOST.used_bp()).add(EXOTIC_BOOST.gain()).min(copied_mods[x]);
		}
	},
	importrespec(){
		let preset = prompt('Import your Exotic Boost Setup.').split('/');
		if(preset.length!=EXOTIC_BOOST_LENGTH){
			alert('Your Exotic Boost Setup is invalid.');
			return
		}
		let copied_mods = []
		for (let x = 0; x < EXOTIC_BOOST_LENGTH; x++){
			copied_mods.push(E(preset[x]).floor())
			if (copied_mods[x].lt(0) || Number.isNaN(copied_mods[x].mag) || Number.isNaN(copied_mods[x].layer) || Number.isNaN(copied_mods[x].sign)){
				alert('Your Exotic Boost Setup is invalid.');
				return
			}
		}
		for(let i=0;i<EXOTIC_BOOST_LENGTH;i++){
			player.exotic.boosts[i]=E(0);
		}
		EXOTIC.doReset(true);
		for (let x = 0; x < EXOTIC_BOOST_LENGTH; x++){
			if(player.exotic.boosts[x].gte(copied_mods[x]))continue;
			player.exotic.boosts[x]=player.exotic.boosts[x].sub(EXOTIC_BOOST.used_bp()).add(EXOTIC_BOOST.gain()).min(copied_mods[x]);
		}
		setTimeout(function(){console.log(player.mass.format());},5000);
	}
}