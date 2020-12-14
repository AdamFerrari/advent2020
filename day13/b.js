const fs = require('fs');
const readline = require('readline');

function readin(input,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        input.push(line);
    });
    return p;
}

function checkFactor(num, fact) {
    return ( (Math.floor(num/fact)*fact) == num );
}

function runSlow(input) {
    let b = input[1].split(",");
    let factors = [];
    let offsets = [];
    let counter = 0;
    for(let i=0; i<b.length; i++) {
        if(b[i] != "x") {
            factors.push(parseInt(b[i]));
            offsets.push(i);
        }
    }
    let ts = 0;
    let works = false;
    while(!works) {
        works = true;
        for(let i=1; (i<factors.length) && works; i++) {
            if(!checkFactor(ts + offsets[i], factors[i])) works = false;
        }
        if(!works) {
            ts = ts + factors[0];
        }
        counter = counter + 1;
        if(counter > 100000000) {
            counter = 0;
            console.log("ts = " + ts);
        }
    }
    console.log("found timestamp: " + ts);
}

function run(input) {
    let b = input[1].split(",");
    let factors = [];
    let offsets = [];
    for(let i=0; i<b.length; i++) {
        if(b[i] != "x") {
            factors.push(parseInt(b[i]));
            offsets.push(i);
        }
    }
    let ts = factors[0];
    let stride = factors[0];
    let maxmatch = 0;
    let works = false;
    while(!works) {
        works = true;
        for(let i=1; (i<factors.length) && works; i++) {
            if(!checkFactor(ts + offsets[i], factors[i])) {
                works = false;
            }
            else {
                if(i>maxmatch) {
                    maxmatch = i;
                    stride = stride * factors[i];
                }
            }
        }
        if(!works) {
            ts = ts + stride;
        }
    }
    console.log("found timestamp: " + ts);
}

let input = [];
readin(input,"in.txt").then( () => {
    run(input);
})
