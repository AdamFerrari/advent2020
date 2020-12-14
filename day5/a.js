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
    let maxval = -1;
    let current = { };
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        let code  = decodeseat(line);
        if(code>maxval) maxval = code;
        results[0] = maxval;
    });
    return p;
}

let results = [ ];
readin(results,"in.txt").then( () => { console.log("Answer: " + results) } )

