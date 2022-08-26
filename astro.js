let fs = require("fs");


let data = fs.readdirSync("./data").map(d=>{
    return (fs.readFileSync("./data/"+d)+"");
})

let dd = data.map(str=>{
    let vs = str.split("\n$$SOE\n")[1].split("\n").slice(0,4);
    let date = vs[0];
    let [x,y,z,vx,vy,vz,lt,rg,rr] = 
    vs.slice(1).join(" ")
    .split(/[a-zA-Z]+(\s+)?\=/g)
    .filter(v=>v && v.trim() != "").map(v=>v.trim())
    .map(v=>parseFloat(v.trim())*1000);
    //console.log([x,y,z,vx,vy,vz,lt,rg,rr])
    //console.log(vs.slice(1).join(" "));
    return {
        date,
        v:[x,y,z],
        dv:[vx,vy,vz],
        ang:[lt/1000,rg,rr],
        name:str.split("\n")[1].split(/\s{3,}/g)[1]
    }
});

//console.log(dd);

//module.exports = dd;

fs.writeFileSync("data.js",`
astro = {};
astro.bodies = ${JSON.stringify(dd)};
`,"utf-8");