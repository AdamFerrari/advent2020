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
        if(line.length>0) input.push(line)
    });
    return p;
}

function parseIn(input) {
    let ret = {};
    let rules = [];
    let tickets = [];
    let ticket;
    let mode = 0;

    for(i=0;i<input.length;i++) {
        line = input[i];
        if(line=="your ticket:") {
            mode = 1;
        }
        else if(line=="nearby tickets:") {
            mode = 2;
        }
        else if(mode==0) {
            let rule = {};
            let s = line.split(": ");
            rule["key"] = s[0];
            let t = s[1].split(" or ");
            rule["range1"] = t[0].split("-").map(a => parseInt(a));
            rule["range2"] = t[1].split("-").map(a => parseInt(a));
            rules.push(rule);
        }
        else if(mode==1) {
            let s = line.split(",");
            if(s.length>1) {
                ticket = s.map(a => parseInt(a));
            }
        }
        else if(mode==2) {
            let s = line.split(",").map(a => parseInt(a));
            tickets.push(s);
        }
    }

    ret["rules"] = rules;
    ret["ticket"] = ticket;
    ret["tickets"] = tickets;
    return ret;
}

function checkRule(rule, val) {
    if( (val>=rule["range1"][0] &&
            val<=rule["range1"][1])
        ||
        (val>=rule["range2"][0] &&
            val<=rule["range2"][1]) ) {
        return true;
    }
    return false
}

function checkTicket(ticket, rules) {
    let ret = 0;
    for(let i = 0; i<ticket.length; i++) {
        let val = ticket[i];
        let valid = false;
        for(let j=0; (j<rules.length)&&!valid; j++) {
            if(checkRule(rules[j],val))
                valid = true;
        }
        if(!valid) ret = ret + val;
    }
    return ret;
}

function run(input) {
    let tx = parseIn(input);
    let ret = 0;
    for(let i=0; i<tx["tickets"].length; i++) {
        ret = ret +
            checkTicket(tx["tickets"][i], tx["rules"]);
    }
    return ret;
}

let input = []
readin(input,"in.txt").then( () => {
    let result = run(input);
    console.log("Result = " + result);
});
