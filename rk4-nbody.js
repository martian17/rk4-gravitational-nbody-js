//vector operations

const D = 3;
const G = 6.6743e-11;

//enum
const k1 = 0;
const k2 = 1;
const k3 = 2;
const k4 = 3;


//anything denoted with "new" allocates a new vector
//also anything with "new" is sideeffect free
let newvec = function(){
    let v = [];
    for(let i = 0; i < D; i++){
        v.push(0);
    }
    return v;
};

let newmat = function(n,m){
    let mat = [];
    for(let i = 0; i < n; i++){
        let r = [];
        for(let j = 0; j < m; j++){
            r.push(0);
        }
        mat.push(r);
    }
    return mat;
};

let vecAccumulate = function(v1,v2,k){
    for(let i = 0; i < D; i++){
        v1[i] += v2[i]*k;
    }
    return v1;
};

let vecAccumulateNew = function(v1,v2,k){//produces new vector
    let v = newvec();
    for(let i = 0; i < D; i++){
        v[i] = v1[i]+v2[i]*k;
    }
    return v;
}

let vecdiffNew = function(v1,v2){
    let v = newvec();
    for(let i = 0; i < D; i++){
        v[i] = v1[i]-v2[i];
    }
    return v;
};

let magn = function(v){
    let s = 0;
    for(let i = 0; i < D; i++){
        s += v[i]*v[i];
    }
    return Math.sqrt(s);
};








class Body{
    constructor(obj){
        for(let key in obj){
            this[key] = obj[key];
        }
        this.v_rk4 = newmat(4,D);
        this.dv_rk4 = newmat(4,D);
        this.ddv_rk4 = newmat(4,D);
    }
};


//second degree ODE n body RK4
//no memory locality, but I think this code is pretty


let solveRK4 = function(bodies,dt){
    //console.log(dt);
    //console.log(bodies);
    let dt2 = dt/2;
    calculateK1(bodies);
    calculateK2(bodies,dt2);
    calculateK3(bodies,dt2);
    calculateK4(bodies,dt);
    //lastly, reduce everything
    for(let b1 of bodies){
        //summing up v and dv
        for(let i = 0; i < D; i++){
            b1.v[i] += (b1.dv_rk4[k1][i]+2*b1.dv_rk4[k2][i]+2*b1.dv_rk4[k3][i]+b1.dv_rk4[k4][i])/6*dt;
            b1.dv[i] += (b1.ddv_rk4[k1][i]+2*b1.ddv_rk4[k2][i]+2*b1.ddv_rk4[k3][i]+b1.ddv_rk4[k4][i])/6*dt;
        }
    }
    //all done! everything is side effect so no return value
};



let calculateK1 = function(bodies){
    for(let b1 of bodies){
        b1.v_rk4[k1] = b1.v;
        b1.dv_rk4[k1] = b1.dv;
    }
    calculateDDV_RK4(bodies,k1);
};

let calculateK2 = function(bodies,dt2){
    for(let b1 of bodies){
        b1.v_rk4[k2] = vecAccumulateNew(b1.v,b1.dv_rk4[k1],dt2);
        b1.dv_rk4[k2] = vecAccumulateNew(b1.dv,b1.ddv_rk4[k1],dt2);
    }
    calculateDDV_RK4(bodies,k2);
};

let calculateK3 = function(bodies,dt2){
    for(let b1 of bodies){
        b1.v_rk4[k3] = vecAccumulateNew(b1.v,b1.dv_rk4[k2],dt2);
        b1.dv_rk4[k3] = vecAccumulateNew(b1.dv,b1.ddv_rk4[k2],dt2);
    }
    calculateDDV_RK4(bodies,k3);
};

let calculateK4 = function(bodies,dt){
    for(let b1 of bodies){
        b1.v_rk4[k4] = vecAccumulateNew(b1.v,b1.dv_rk4[k3],dt);
        b1.dv_rk4[k4] = vecAccumulateNew(b1.dv,b1.ddv_rk4[k3],dt);
    }
    calculateDDV_RK4(bodies,k4);
};

let calculateDDV_RK4 = function(bodies,n){//n is the stage of rk4 minus 1
    for(let b1 of bodies){
        let acc = newvec();
        for(let b2 of bodies){
            if(b1 === b2)continue;
            //calculate force
            let disp = vecdiffNew(b2.v_rk4[n],b1.v_rk4[n]);
            let r = magn(disp);
            //acc += disp*G*M/r^3
            vecAccumulate(acc,disp,G*b2.mass/(r*r*r));
        }
        //_rk4 vectors are immutable
        b1.ddv_rk4[n] = acc;
    }
}









