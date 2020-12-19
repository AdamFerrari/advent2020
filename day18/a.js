const fs = require('fs');
const readline = require('readline');

const op_nop = 0;
const op_add = 1;
const op_mul = 2;

function accumulate(op, curr, nxt) {
    if(op==op_nop) {
        return nxt;
    }
    if(op==op_add) {
        return curr + nxt;
    }
    if(op==op_mul) {
        return curr * nxt;
    }
    console.log("error!");
}

function eval(ops, idx) {
    let ret = 0;
    let nxt = 0;
    let currOp = op_nop;
    while(idx[0]<ops.length) {
        if(ops[idx[0]]=="\)") {
            idx[0] = idx[0]+1;
            return ret;
        }
        else if(ops[idx[0]]=="\(") {
            idx[0] = idx[0]+1;
            nxt = eval(ops,idx);
            ret = accumulate(currOp,ret,nxt);
        }
        else if(ops[idx[0]]=="+") {
            idx[0] = idx[0]+1;
            currOp = op_add;
        }
        else if(ops[idx[0]]=="*") {
            idx[0] = idx[0]+1;
            currOp = op_mul;
        }
        else {
            nxt = parseInt(ops[idx[0]]);
            idx[0] = idx[0]+1;
            ret = accumulate(currOp,ret,nxt);
        }
    }
    return ret;
}


function parseAndEval(line) {
    line = line.replace(/\(/g,"( ");
    line = line.replace(/\)/g," )");
    let ops = line.split(" ");
    let idx = [];
    idx.push(0);
    return eval(ops, idx);
}

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

let input = [];
readin(input,"in.txt").then( () => {
    let result = 0;
    for(let i=0; i<input.length; i++) {
        let val = parseAndEval(input[i]);
        console.log(input[i] + "  = " + val);
        result = result + val;
    }
    console.log("result: " + result);
})
