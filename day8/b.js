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

function clearlines(lines) {
    for(let i = 0; i<lines.length; i++) {
        let lo = lines[i];
        lo[xcnt] = 0;
    }
}

function runcode(lines) {
    let acc = 0;
    let pc = 0;
    for(pc = 0; pc<lines.length; pc++) {
        let lo = lines[pc];
        if(lo[xcnt] > 0) {
            return [];
        }
        lo[xcnt] = lo[xcnt] + 1;
        if(lo[op] == op_acc) {
            acc = acc + lo[arg];
        } else if(lo[op] == op_jmp) {
            pc = pc + (lo[arg] - 1);
        }
        else if(lo[op] = op_nop) {
        }
    }
    let ret = [];
    ret.push(acc);
    return ret;
}

function mutations(lines) {
    let ret = [];
    for(let i=0; i<lines.length; i++) {
        clearlines(lines);
        let lo = lines[i];
        if(lo[op] == op_jmp) {
            lo[op] = op_nop;
            ret = runcode(lines);
            if(ret.length>0) {
                ret.push(i);
                return ret;
            }
            lo[op] = op_jmp;
        }
        if(lo[op] == op_nop) {
            lo[op] = op_jmp;
            ret = runcode(lines);
            if(ret.length>0) {
                ret.push(i);
                return ret;
            }
            lo[op] = op_nop;
        }
    }
    return ret;
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
    let ret = mutations(lines);
    console.log("Results: " + ret);
})
