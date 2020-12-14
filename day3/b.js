const fs = require('fs');
const readline = require('readline');

function readmap(map, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
       map.push(line);
    });
    return p;
}

function counttrees(map, stepd, stepr) {
    let trees = 0;
    let width = map[0].length;
    let j = 0;
    for(let i=0; i<map.length; i+=stepd) {
        if(map[i].charAt(j) == "#") {
            trees++;
        }
        j = (j + stepr) % width;
    }
    return trees;
}

function run(map) {
    let result = 1;
    result = result * counttrees(map,1,1);
    result = result * counttrees(map,1,3);
    result = result * counttrees(map,1,5);
    result = result * counttrees(map,1,7);
    result = result * counttrees(map,2,1);
    console.log("Result: " + result);
}
   
let map = [ ];
readmap(map,"map.txt").then( () => { run(map) } )

