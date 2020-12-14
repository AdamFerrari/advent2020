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

function run(map) {
    let trees = 0;
    let width = map[0].length;
    let j = 0;
    for(let i=0; i<map.length; i++) {
        if(map[i].charAt(j) == "#") {
            trees++;
        }
        j = (j + 3) % width;
    }
    console.log("Result: " + trees);
}
   
let map = [ ];
readmap(map,"map.txt").then( () => { run(map) } )

