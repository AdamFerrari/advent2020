const fs = require('fs');
const readline = require('readline');

function parseLine(line) {
    let ret = { };
    let s = line.split(" = ");
    if(s[0]=="mask") {
        ret["op"] = "mask";
        ret["arg"] = s[1];
    }
    else {
        ret["op"] = "set";
        let addr = s[0];
        addr = addr.replace("mem\[","");
        addr = addr.replace("\]","");
        ret["addr"] = parseInt(addr);
        ret["arg"] = BigInt(parseInt(s[1]));
    }
    return ret;
}

function readin(input,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        input.push(parseLine(line));
    });
    return p;
}

function makeMask(m) {
    let setBits = BigInt(0);
    let clearBits = BigInt(0);
    let shift = BigInt(35);
    for(let i=0; i<36; i++) {
        if(m.charAt(i)=="1") {
            setBits |= (BigInt(1) << shift);
        } else if(m.charAt(i)=="0") {
            clearBits |= (BigInt(1) << shift);
        }
        shift--;
    }
    let ret = {};
    ret["clearBits"] = BigInt(clearBits);
    ret["setBits"] = BigInt(setBits);
    return ret;
}

function setVal(mask, val) {
    let ret = val;
    ret |= mask["setBits"];
    ret &=  ~(mask["clearBits"]);
    return ret;
}

function makeMem(input) {
    let maxMem = 0;
    for(let i=0; i<input.length; i++) {
        if(input[i]["op"] == "set") {
            if(input[i]["addr"] > maxMem) {
                maxMem = input[i]["addr"];
            }
        }
    }
    let ret = new Array(maxMem);
    for(let i=0; i<maxMem; i++) {
        ret[i] = BigInt(0);
    }
    return ret;
}

function run(input) {
    let mask = {};
    mask["clearBits"] = BigInt(0);
    mask["setBits"] = BigInt(0);

    let mem = makeMem(input);

    for(let i=0; i<input.length; i++) {
        if(input[i]["op"] == "mask") {
            mask = makeMask(input[i]["arg"]);
        }
        if(input[i]["op"] == "set") {
            let addr = input[i]["addr"];
            let val = setVal(mask, input[i]["arg"]);
            mem[addr] = val;
        }
    }

    let sum = BigInt(0);
    for(let i=0; i<mem.length; i++) {
        sum = sum+mem[i];
    }
    return sum;
}

function print(input) {
    for(let i=0; i<input.length; i++) {
        console.log(JSON.stringify(input[i]));
    }
}

let input = [];
readin(input,"in.txt").then( () => {
    let result = run(input);
    console.log("result: " + result);
});
