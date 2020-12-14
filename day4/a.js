const fs = require('fs');
const readline = require('readline');

const required = [ "byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid" ];
const optional = [ "cid" ];

function clearvals(current) {
    for(let i=0; i<required.length; i++) current[required[i]] = "";
    for(let i=0; i<optional.length; i++) current[optional[i]] = "";
}


function addvals(current, vals) {
    for(let i=0; i<vals.length; i++) {
        let keyval = vals[i].split(":");
        current[keyval[0]] = keyval[1];
    }
}

function checkvals(current) {
    for(let i=0; i<required.length; i++) {
        if(current[required[i]].length < 1) {
            return 0;
        }
    }
    return 1;
}

function checkline(current, line) {
    let vals = line.split(" ");
    if(vals[0].length > 0){
        addvals(current, vals)
        return 0;
    }
    let ret = checkvals(current);
    clearvals(current);
    return ret;
}

function readin(results, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    let count = 0;
    let current = { };
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        count = count + checkline(current, line);
        results[0] = count;
    });
    return p;
}

let results = [ ];
readin(results,"in.txt").then( () => { console.log("Results: " + results) } )

