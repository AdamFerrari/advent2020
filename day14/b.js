const fs = require('fs');
const readline = require('readline');

function parseLine(line) {
    let ret = { };
    let s = line.split(" = ");
    if(s[0]=="mask") {
        ret["op"] = "mask";
        ret["arg"] = s[1];
        let xs = 0;
        for(let i = 0; i<s[1].length; i++) {
            if(s[1].charAt(i)=="X") xs++;
        }
    }
    else {
        ret["op"] = "set";
        let addr = s[0];
        addr = addr.replace("mem\[","");
        addr = addr.replace("\]","");
        ret["addr"] = BigInt(parseInt(addr));
        ret["arg"] = BigInt(parseInt(s[1]));
    }
    return ret;
}

function expandRecurse(mask, addr, prefix, pos) {
    let ret = [];
    if(pos<0) {
        ret.push(prefix);
        return ret;
    }
    let loc =(35 - pos);
    let bit = mask.charAt(loc);
    let bitm = (BigInt(1) << BigInt(pos));
    let add = [];
        
    if(bit=="X") {
        add = expandRecurse(mask, addr, prefix, pos-1);
        ret = ret.concat(add);
        add =  expandRecurse(mask, addr, prefix+bitm, pos-1);
        ret = ret.concat(add);
    }
    else if(bit=="1") {
        add = expandRecurse(mask, addr, prefix+bitm, pos-1);
        ret = ret.concat(add);
    }
    else if(bit=="0") {
        if(addr & bitm) {
            add = expandRecurse(mask, addr, prefix+bitm, pos-1);
        }
        else {
            add = expandRecurse(mask, addr, prefix, pos-1);
        }
        ret = ret.concat(add);
    }
    return ret;
}

function expandAddrs(mask, addr) {
    return expandRecurse(mask, addr, BigInt(0), 35);
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

function run(input) {
    let mask = "000000000000000000000000000000000000";
    let mem = { }
    for(let i=0; i<input.length; i++) {
        if(input[i]["op"] == "mask") {
            mask = input[i]["arg"];
        }
        if(input[i]["op"] == "set") {
            let addr = input[i]["addr"];
            let val = input[i]["arg"];
            let addrs = expandAddrs(mask, addr);
            for(let j=0; j<addrs.length; j++) {
                mem[addrs[j]] = val;
            }
        }
    } 
    let keys = Object.keys(mem);
    let sum = BigInt(0);
    for(let i=0; i<keys.length; i++) {
        sum = sum + mem[keys[i]];
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
    console.log("result: " + result.toString());
});
