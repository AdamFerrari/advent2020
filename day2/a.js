const fs = require('fs');
const readline = require('readline');

function checkline(line) {
    let chk = line.split(" ");
    let minmax = chk[0].split("-").map( a => parseInt(a) );
    let ch = chk[1].charAt(0);
    let pwd = chk[2];
    let cnt = 0;
    for(let i=0; i<pwd.length; i++) {
        if(ch == pwd.charAt(i)) {
            cnt++;
        }
    }
    if( (cnt>=minmax[0]) && (cnt<=minmax[1])) {
        return true;
    }
    return false;
}

function readin(results, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    let cnt = 0;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
       if(checkline(line)) {
           cnt++;
           results[0] = cnt;
       }
    });
    return p;
}

let results = [ ];
readin(results,"in.txt").then( () => {
    console.log("Results: " + results);
} );

