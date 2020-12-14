const fs = require('fs');
const readline = require('readline');

function decodeseat(val) {
    let lo = 0;
    let hi = 127;
    let row = 0;
    for(let i=0; i<6; i++) {
        if(val.charAt(i) == "F") {
            hi = Math.floor((lo + hi)/2);
        }
        else if(val.charAt(i) == "B") {
            lo = Math.ceil((lo + hi)/2);
        }
        else {
            console.log("ERROR");
            exit(1);
        }
    }
    if(val.charAt(6)=="F") {
        row = lo;
    } else {
        row = hi;
    }
    lo = 0;
    hi = 7;
    let col = 0;
    for(let i=7; i<9; i++) {
        if(val.charAt(i) == "L") {
            hi = Math.floor((lo + hi)/2);
        }
        else if(val.charAt(i) == "R") {
            lo = Math.ceil((lo + hi)/2);
        }
        else {
            console.log("ERROR");
            exit(1);
        }
    }
    if(val.charAt(9)=="L") {
        col = lo;
    } else {
        col = hi;
    }
    let ret = (row*8) + col;
    return ret;
}

function readin(results, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        let code  = decodeseat(line);
        results.push(code);
    });
    return p;
}

function findseat(results) {
    let ret = -1;
    results.sort(function(a, b){return a-b});
    for(let i=0; i<(results.length-1); i++) {
        let diff = results[i+1] - results[i];
        if(diff!=1) {
            ret = results[i] + 1;
        }
    }
    return ret;
}

let results = [ ];
readin(results,"in.txt").then( () => {
    let seat = findseat(results);
    console.log("Answer: " + seat) }
)

