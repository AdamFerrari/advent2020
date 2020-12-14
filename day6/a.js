const fs = require('fs');
const readline = require('readline');

const alpha = "abcdefghijklmnopqrstuvwxyz";

function clearvals(curr) {
    for(let i=0; i<26; i++) curr[alpha.charAt(i)] = false;
}

function countvals(curr) {
    let ret = 0;
    for(let i=0; i<26; i++) if(curr[alpha.charAt(i)]) ret++;
    return ret;
}

function addvals(curr, val) {
    for(let i=0; i<val.length; i++) {
        curr[val.charAt(i)] = true;
    }
}

function procline(line, curr) {
    let ret = 0;
    if(line.length < 1) {
        ret = countvals(curr);
        clearvals(curr);
    }
    else {
        addvals(curr, line);
    }
    return ret;
}

function readin(results, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    let ret = 0;
    let curr = { };
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        ret = ret + procline(line, curr);
        results[0] = ret;
    });
    return p;
}

let results = [ ];
readin(results,"in.txt").then( () => {
    console.log("Results: " + results)
})

