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

function findrun(arr, target) {
    let sum = 0;
    let i = 0;
    let j = 0;
    console.log("Target is " + target);
    for(i=0; i<arr.length; i++) {
        sum = 0;
        for(j=i; j<arr.length; j++) {
            sum = sum+arr[j];
            if(sum>=target) break;
        }
        if(sum==target) break;
    }
    console.log("Range runs from " + i + " to " + j);
    let mn = arr[i];
    let mx = arr[i];
    console.log("Values: ");
    sum = 0;
    for(let k=i; k<=j; k++) {
        console.log(" " + arr[k])
        sum = sum + arr[k];
        if(arr[k] < mn) mn = arr[k];
        if(arr[k] > mx) mx = arr[k];
    }
    console.log("Sum: " + sum);
    return mn + mx;
}

let input = [];
readin(input,"in.txt").then( () => {
    let target = scan(input);
    let ret = findrun(input, target);
    console.log("Answer: " + ret);
})
