const fs = require('fs');
const readline = require('readline');

const required = [ "byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid" ];
const optional = [ "cid" ];

function valid_yr(key, val, min, max) {
    let ret = true;
    if(val.length != 4) {
        ret = false;
    }
    else {
        let ival = parseInt(val);
        if( (val < min) || (val > max) ) {
            ret = false;
        }
    }
    return ret;
}

function valid_hcl(val) {
    let ret = true;
    if((val.length!=7) || !val.match(/^\#[a-f0-9]+/)) {
        ret = false;
    }
    return ret;
}

function valid_ecl(val) {
    const vecl = [ "amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    let ret = false;
    for(let i=0; (i<vecl.length) && !ret; i++) {
        if(val == vecl[i]) ret = true;
    }
    return ret;
}

function valid_hgt(val) {
    let ret = true;
    if(val.match(/\d\d\dcm/)) {
        val.replace("cm","");
        let ival = parseInt(val);
        if( (ival<150) || (ival>193)) ret = false;
    } else if(val.match(/\d\din/)) {
        val.replace("in","");
        let ival = parseInt(val);
        if( (ival<59) || (ival>76)) ret = false;
    } else { ret = false; }
    return ret;
}

function valid_pid(val) {
    let ret = true;
    if((val.length!=9) || !val.match(/^[0-9]+/)) {
        ret = false;
    }
    return ret;
}

function clearvals(current) {
    for(let i=0; i<required.length; i++) current[required[i]] = "";
    for(let i=0; i<optional.length; i++) current[optional[i]] = "";
}

function addvals(current, vals) {
    for(let i=0; i<vals.length; i++) {
        let keyval = vals[i].split(":");
        current[keyval[0]] = keyval[1];
    }
}

function checkvals(current) {
    for(let i=0; i<required.length; i++) {
        if(current[required[i]].length < 1) {
            return 0;
        }
    }
    if(!valid_yr("byr",current["byr"],1920,2002)) return 0;
    if(!valid_yr("iyr",current["iyr"],2010,2020)) return 0;
    if(!valid_yr("eyr",current["eyr"],2020,2030)) return 0;
    if(!valid_hgt(current["hgt"])) return 0;
    if(!valid_hcl(current["hcl"])) return 0;
    if(!valid_ecl(current["ecl"])) return 0;
    if(!valid_pid(current["pid"])) return 0;
    return 1;
}

function checkline(current, line) {
    let vals = line.split(" ");
    if(vals[0].length > 0){
        addvals(current, vals)
        return 0;
    }
    let ret = checkvals(current);
    clearvals(current);
    return ret;
}

function readin(results, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    let count = 0;
    let current = { };
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        count = count + checkline(current, line);
        results[0] = count;
    });
    return p;
}

let results = [ ];
readin(results,"in.txt").then( () => { console.log("Results: " + results) } )

