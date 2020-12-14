const fs = require('fs');
const readline = require('readline');

const sg = "shinygold";


function procline(line, rules) {
    let s = line.split("bags contain");
    let kv = s[0].split(" ");
    let key = kv[0] + kv[1];
    let co = s[1].split(",");
    rules[key] = [];
    for(let i=0; i<co.length; i++) {
        let rule = co[i];
        if(rule.match(/no other/)) break;
        let ro = rule.split(" ");
        let robj = { };
        robj["key"] = ro[2] + ro[3];
        robj["quant"] = parseInt(ro[1]);
        rules[key].push(robj);
    }
}

function count_bags(key, rules) {
    let r = rules[key];
    if(!r) return 0;
    let ret = 0;
    for(let i=0; i<r.length; i++) {
        let robj = r[i];
        let quant = robj["quant"];
        ret = ret + quant;
        ret = ret + (quant * count_bags(robj["key"],rules));
    }
    return ret;
}

function count_sg(rules) {
    return count_bags(sg,rules);
}

function readin(rules,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        procline(line, rules);
    });
    return p;
}

let rules = {};
readin(rules,"in.txt").then( () => {
    let ret = count_sg(rules);
    console.log("Results: " + ret);
})
