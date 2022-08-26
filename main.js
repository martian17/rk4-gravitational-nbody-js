//data.js correction
astro.index = {};
for(let body of astro.bodies){
    astro.index[body.name] = body;
}
astro.index["Sun"].mass = 1.989e+30;
astro.index["Mercury"].mass = 0.33010e+24;
astro.index["Venus"].mass = 4.8673e+24;
astro.index["Earth Barycenter"].mass = 5.9722e+24+0.07346e+24;
astro.index["Mars Barycenter"].mass = 0.64169e+24+10.6e+15+2.4e+15;
astro.index["1 Ceres (A801 AA)"].mass = 9.1e+20;
astro.index["Jupiter Barycenter"].mass = 1898.13e+24;
astro.index["Saturn Barycenter"].mass = 568.32e+24;
astro.index["Uranus Barycenter"].mass = 86.811e+24;
astro.index["Neptune Barycenter"].mass = 102.409e+24;






//UI stuff
class Rcanvas extends ELEM{
    constructor(){
        super("div",0,0,"position:relative;width:100vw;height:100vh;");
        let that = this;
        let canvas = this.add("canvas").e;
        let ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.ctx = ctx;
        window.addEventListener("resize",()=>{
            that.resize();
        });
    }
    initialize(){
        this.resize();
    }
    resize(){
        let {canvas} = this;
        canvas.width = this.e.offsetWidth;
        canvas.height = this.e.offsetHeight;
    }
};

class Simulation extends Rcanvas{
    pixscale = 15e+11/500;
    sps = 60*60*24;
    constructor(){
        super();
    }
    steps = 1;
    timeframe = 100;
    //initializers
    setSecondsPerSeconds(sps){//seconds per second
        this.sps = sps;
        return this;
    }
    setPixScale(pixscale){//pixscale == meters per pixel
        this.pixscale = pixscale;
        return this;
    }
    setBodies(bodies){
        this.bodies = bodies.map(b=>new Body(b));
        return this;
    }
    started = false;
    start(){
        if(this.started)return this;
        let that = this;
        
        console.log(this.bodies);
        
        let start = 0;
        let anim = function(t){
            if(start === 0)start = t;
            let dt = t - start;
            start = t;
            let dt1 = dt/1000*that.sps;
            that.render();
            for(let i = 0; i < that.steps; i++){
                let dt2 = dt1/that.steps;
                solveRK4(that.bodies,dt2);
            }
            requestAnimationFrame(anim);
        }
        requestAnimationFrame(anim);
        return this;
    }
    render(){
        let {canvas,ctx} = this;
        //console.log(canvas.width,canvas.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(let body of this.bodies){
            let [x,y] = body.v.map(v=>v/this.pixscale);
            x += canvas.width/2;
            y += canvas.height/2;
            ctx.beginPath();
            ctx.arc(x,y,3,0,Math.PI*2);
            ctx.fill();
        }
    }
    follow(){
        
    }
}

class Baricenter{
    constructor(bodies){
        this.bodies = bodies;
    }
    get v(){
        let v = [0,0,0];
        for(b1 of this.bodies){
            v0 = b1.v;
            v[0] += v0[0];
            v[1] += v0[1];
            v[2] += v0[2];
        }
        return v1;
    }
};




let main = function(){
        
    let body = new ELEM(document.body);
    let simulation = body.add(new Simulation())
    //one day per second
    .setSecondsPerSeconds(100*60*60*24)
    .setPixScale(15e+11/500)
    .setBodies(astro.bodies);
    simulation.initialize();
    simulation.start();
};


main();