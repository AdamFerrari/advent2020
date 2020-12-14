const fs = require('fs');
const readline = require('readline');

const wind = 25;

function readin(input,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        input.push(parseInt(line));
    });
    return p;
}

function check(arr, val, start) {
    for(let i=0; i<(wind-1); i++) {
        for(let j=i; j<wind; j++) {
            if( (arr[start+i] + arr[start+j]) == val) return true;
        }
    }
    return false;
}


function scan(arr) {
    for(let i=wind; i<arr.length; i++) {
        if(!check(arr,arr[i],i-wind)) return arr[i];
    }
    return -1;
}

let input = [];
readin(input,"in.txt").then( () => {
    let ret = scan(input);
    console.log("Answer: " + ret);
})
