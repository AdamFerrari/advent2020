const fs = require('fs');
const readline = require('readline');

const op_nop = 0;
const op_add = 1;
const op_mul = 2;

function eval(ops, idx) {
    let nxt = 0;
    let currOp = op_nop;
    let newOps = [];

    while(idx[0]<ops.length) {
        if(ops[idx[0]]=="\)") {
            idx[0] = idx[0]+1;
            break;
        }
        else if(ops[idx[0]]=="\(") {
            idx[0] = idx[0]+1;
            nxt = eval(ops,idx);
            newOps.push(nxt);
        }
        else {
            newOps.push(ops[idx[0]]);
            idx[0] = idx[0]+1;
        }
    }
    //console.log("new ops = " + newOps);
    let newNewOps = [];
    let i = 0;
    let currVal = parseInt(newOps[0]);
    while(i<newOps.length) {
        if(newOps[i+1]=="+") {
            currVal = currVal + parseInt(newOps[i+2]);
            i = i+2;
        }
        else if(i<(newOps.length-1)) {
            newNewOps.push(currVal);
            currVal = parseInt(newOps[i+2]);
            i = i+2;
        }
        else break;
    }
    newNewOps.push(currVal);
    //console.log("new new ops = " + newNewOps);
    currVal = newNewOps[0];
    for(i=1; i<newNewOps.length; i++) {
        currVal = currVal * newNewOps[i];
    }
    return currVal;
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
