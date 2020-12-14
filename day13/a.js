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

function run(input) {
    let ts = parseInt(input[0]);
    console.log("depart time="+ts);
    let b = input[1].split(",");
    let mintime = -1;
    let minid = -1;
    for(let i=0; i<b.length; i++) {
        if(b[i] != "x") {
            let id = parseInt(b[i]);
            let wtime = (Math.ceil(ts/id) * id) - ts;
            if( (mintime<0) || (wtime<mintime)) {
                mintime = wtime;
                minid = id;
            }
        }
    }
    console.log("best id="+minid+"    wait time="+mintime);
    console.log("result="+minid*mintime);
}


let input = [];
readin(input,"in.txt").then( () => {
    run(input);
})
