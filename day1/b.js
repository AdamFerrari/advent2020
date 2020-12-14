const fs = require('fs');
const readline = require('readline');

function binsearch(arr, x, start, end) {
    if (start > end) return -1; 
    let mid=Math.floor((start + end)/2); 
    if (arr[mid]===x) return mid; 
    if(arr[mid] > x)  
        return binsearch(arr, x, start, mid-1); 
    else
        return binsearch(arr, x, mid+1, end); 
} 

function readarr(arr, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
       arr.push(parseInt(line));
    });
    return p;
}

function run(arr) {
    arr.sort(function(a, b){return a-b})
    for(let i=0; i<(arr.length - 2); i++) {
        val1 = arr[i];
        for(let j=i+1; j<(arr.length - 1); j++) {
            val2 = arr[j];
            if( (val1 + val2) >= 2020) break

            val3 = 2020 - (val1 + val2);
            loc = binsearch(arr, val3, j+1, arr.length);
            if(loc>=0) {
                console.log("Results: " + val1 + " " + val2 + " "+ arr[loc] + " " + arr[i]*arr[j]*arr[loc]);
                i=arr.length + 1;
                j=arr.length + 1;
                break;
            }
        }
    }
}
   
let arr = [ ];
readarr(arr,"in.txt").then( () => { run(arr) } )

