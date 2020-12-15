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
        let nums = line.split(",");
        for(let i=0; i<nums.length; i++) {
            input.push(parseInt(nums[i]));
        }
    });
    return p;
}

function updateLastSeen(lastSeen, val, pos) {
    let v;
    if(lastSeen.hasOwnProperty(val)) {
        v = lastSeen[val];
        v[1] = lastSeen[val][0];
        v[0] = pos;
    }
    else {
        v = [pos, -1];
        lastSeen[val] = v;
    }
}

function nextNum(lastSeen, val) {
    let v = lastSeen[val];
    if(v[1]==-1) {
        return 0;
    } 
    return v[0] - v[1];
}

function run(input) {
    let lastSeen = {};
    let progress = 0;
    for(let i = 0; i<input.length; i++) {
        updateLastSeen(lastSeen,input[i],i);
    }
    let lastNum = input[input.length - 1];
    for(let iter = input.length; iter < 30000000; iter++) {
        let nxt = nextNum(lastSeen, lastNum);
        updateLastSeen(lastSeen, nxt, iter);
        lastNum = nxt;


        progress = progress + 1;
        if(progress > 1000000) {
            console.log("..." + iter);
            progress = 0;
        }
    }
    console.log("" + lastNum);
}

let input = [];
readin(input,"in.txt").then( () => {
    run(input);
});
