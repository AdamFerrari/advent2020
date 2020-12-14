const fs = require('fs');
const readline = require('readline');

const op = "op";
const op_acc = "acc";
const op_jmp = "jmp";
const op_nop = "nop";
const arg = "arg";
const xcnt = "xcnt";

function procline(line, lines) {
    let s = line.split(" ");
    let lo = {}
    lo[op] = s[0];
    lo[arg] = parseInt(s[1]);
    lo[xcnt] = 0;
    lines.push(lo);
}

function runcode(lines) {
    let acc = 0;
    let pc = 0;
    for(pc = 0; pc<lines.length; pc++) {
        let lo = lines[pc];
        if(lo[xcnt] > 0) return acc;
        lo[xcnt] = lo[xcnt] + 1;
        if(lo[op] == op_acc) {
            acc = acc + lo[arg];
        } else if(lo[op] == op_jmp) {
            pc = pc + (lo[arg] - 1);
        }
        else if(lo[op] = op_nop) {
        }
    }
    comsole.log("COMPLETED");
    return acc;
}

function readin(lines,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        procline(line, lines);
    });
    return p;
}

let lines = [];
readin(lines,"in.txt").then( () => {
    let ret = runcode(lines);
    console.log("Results: " + ret);
})
