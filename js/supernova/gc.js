const GC = {
    active() { return player.gc.active },
	enter() {
		if (player.gc.active){
			player.gc.shard = player.gc.shard.max(tmp.gc.shards);
		}
        if (player.gc.active ? true : confirm("Are you sure to enter the Galactic Challenge? Entering it will force reset!")) {
            player.gc.active = !player.gc.active
            SUPERNOVA_GALAXY.reset(true)
			TABS.choose(3)
        }
    },
	goal(x=player.gc.depth){
		let r=[1e6,1e6,4e5][x];
		if(x>=3)r=x*1e5;
		if(hasElement(333))r=x*9e4;
		if(player.gc.trapu && hasElement(300)){
			r=r/1.6;
		}else if(player.gc.trapu){
			r=r/1.5;
		}else if(hasElement(300)){
			r=r/1.3;
		}
		return r;
	}
}

function GCeffect(x){
	x = E(x).slog().sub(tmp.gc.nerf).max(-1);
	x = Decimal.tetrate(10, x);
	return x;
}

function GSeffect(){
	let x = player.gc.shard.add(1).log10().add(1);
	return x;
}

function incGCdiff(){
	if(player.gc.active)return;
	if(player.gc.depth<tmp.gc.maxdiff)player.gc.depth++;
	player.gc.depth=Math.floor(player.gc.depth);
}

function decGCdiff(){
	if(player.gc.active)return;
	if(player.gc.depth>1)player.gc.depth--;
	player.gc.depth=Math.floor(player.gc.depth);
}

function incGCtrap(){
	if(player.gc.active)return;
	if(player.gc.trap<tmp.gc.maxtrap)player.gc.trap++;
	player.gc.trap=Math.floor(player.gc.trap);
}

function decGCtrap(){
	if(player.gc.active)return;
	if(player.gc.trap>0)player.gc.trap--;
	player.gc.trap=Math.floor(player.gc.trap);
}

function updateGCTemp() {
	tmp.gc.maxdiff=10
	player.gc.depth=Math.floor(player.gc.depth);
	if(player.gc.depth>tmp.gc.maxdiff)player.gc.depth=tmp.gc.maxdiff;
	if(player.gc.depth<1)player.gc.depth=1;
	
	tmp.gc.maxtrap=hasElement(290)?10:0
	player.gc.trap=Math.floor(player.gc.trap);
	if(player.gc.trap>tmp.gc.maxtrap)player.gc.trap=tmp.gc.maxtrap;
	if(player.gc.trap<0)player.gc.trap=0;
	
	tmp.gc.nerf = player.gc.depth/8;
	tmp.gc.shards = E(0);
	if(player.supernova.times.gte(GC.goal())){
		tmp.gc.shards = player.supernova.times.log10().sub(E(GC.goal()).log10()).mul(10**(player.gc.depth*0.9+1.1)).add(1).pow(player.gc.depth);
		if(tmp.gc.shards.gte(100))tmp.gc.shards = tmp.gc.shards.log10().mul(50);
		tmp.gc.shards = tmp.gc.shards.mul(1+player.gc.trap/20);
		tmp.gc.shards = tmp.gc.shards.mul(player.gc.rip?2:1);
		tmp.gc.shards = tmp.gc.shards.floor();
	}
	tmp.gc.GSeffect=GSeffect()
}

function updateGCHTML() {
    tmp.el.gc_shard.setTxt(format(player.gc.shard,0));
    tmp.el.gc_shardeff.setTxt(format(tmp.gc.GSeffect));
    tmp.el.gc_diff_max.setTxt(tmp.gc.maxdiff);
    tmp.el.gc_diff.setTxt(player.gc.depth);
    tmp.el.gc_trap_max.setTxt(tmp.gc.maxtrap);
    tmp.el.gc_trap.setTxt(player.gc.trap);
	tmp.el.gc_trap2.setDisplay(hasElement(290));
    tmp.el.gc_nerf1.setTxt(tmp.gc.nerf);
    tmp.el.gc_nerf2.setTxt(tmp.gc.nerf);
	tmp.el.gc_trapu2.setDisplay(hasElement(297));
    tmp.el.gc_trapu.setTxt(player.gc.trapu?"ON":"OFF");
	tmp.el.gc_rip2.setDisplay(hasElement(332));
    tmp.el.gc_rip.setTxt(player.gc.rip?"ON":"OFF");
    tmp.el.gc_trapeff.setTxt(player.gc.trap==0?"":player.gc.trap==1?"You are trapped in C1":"You are trapped in C1-C"+player.gc.trap);
    tmp.el.gc_btn.setTxt(player.gc.active?"Exit the Galactic Challenge":"Enter the Galactic Challenge");
	if(player.supernova.times.gte(GC.goal()) && player.gc.active){
		tmp.el.gc_btn.setTxt("Complete the challenge ("+format(tmp.gc.shards,0)+"/"+format(player.gc.shard,0)+" Galactic Shards)");
	}
	if(player.supernova.times.gte(GC.goal()) && player.gc.active && tmp.gc.shards.gt(player.gc.shard)){
		tmp.el.gc_btn.setTxt("Complete the challenge to get "+format(tmp.gc.shards.sub(player.gc.shard),0)+" Galactic Shards");
	}
    tmp.el.gc_goal.setTxt(format(GC.goal(),0));
}