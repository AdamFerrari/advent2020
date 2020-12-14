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
        input.push(parseInt(line));
    });
    return p;
}

function findchain(arr) {
    let ret = [0, 0];
    arr.sort(function(a, b){return a-b});
    if(arr[0]==1) ret[0]=1;
    if(arr[0]==3) ret[1]=1;
    for(let i=0; i<(arr.length-1); i++) {
        let diff = (arr[i+1] - arr[i]);
        if(diff==1) ret[0] = ret[0]+1;
        if(diff==3) ret[1] = ret[1]+1;
    }
    ret[1] = ret[1]+1;
    return ret;
}

let input = [];
readin(input,"in.txt").then( () => {
    let ret = findchain(input);
    console.log("[one,three] = " + ret);
    console.log("Result = " + ret[0]*ret[1]);
})
