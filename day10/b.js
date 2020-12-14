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

function countfrom(adap, src, target, memo) {
    let ret = 0;
    if(src==target) return 1;
    if(memo[src] < 0) {
        if(adap[src+1]) ret = ret+countfrom(adap,src+1,target,memo);
        if(adap[src+2]) ret = ret+countfrom(adap,src+2,target,memo);
        if(adap[src+3]) ret = ret+countfrom(adap,src+3,target,memo);
        memo[src] = ret;
    }
    else {
        ret = memo[src];
    }
    return ret;
}

function countpaths(input) {
    let ret = 0;
    input.sort(function(a, b){return a-b});
    let nadap = input[input.length-1] + 4;
    let adap = new Array(nadap);
    let memo = new Array(nadap);
    let target = nadap - 1;
    for(let i=0;i<nadap;i++) {
        adap[i] = false;
        memo[i] = -1;
    }
    for(let i=0;i<input.length;i++) adap[input[i]] = true;
    adap[target] = true;
    adap[0] = true;
    ret = countfrom(adap,0,target,memo);
    return ret;
}

let input = [];
readin(input,"in.txt").then( () => {
    let ret = countpaths(input);
    console.log("Result = " + ret);
})
