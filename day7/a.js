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
        let quant = parseInt(ro[1]);
        let rkey = ro[2] + ro[3];
        rules[key].push(rkey);
    }
}

function contains_sg(key, rules) {
    let r = rules[key];
    for(let i=0; i<r.length; i++) {
        if(r[i] == sg) return true;
        if(contains_sg(r[i],rules)) return true;
    }
    return false;
}

function count_sg(rules) {
    let keys = Object.keys(rules);
    let ret = 0;
    for(let i=0; i<keys.length; i++) {
        if(contains_sg(keys[i],rules)) ret++;
    }
    return ret;
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
