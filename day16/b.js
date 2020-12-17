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

function filterTickets(tx) {
    let ret = [];
    for(let i=0; i<tx["tickets"].length; i++) {
        if(checkTicket(tx["tickets"][i], tx["rules"])<1) {
            ret.push(tx["tickets"][i]);
        }
    }
    return ret;
}

function makeRuleArray(rules) {
    ret = [];
    for(let i=0; i<rules.length; i++) {
        ret.push(i);
    }
    return ret;
}

function intersect(x, y) {
    let i = 0;
    let j = 0;
    let ret = [];
    while( (i<x.length) && (j<y.length)) {
        if(x[i] == y[j]) {
            ret.push(x[i]);
            i++;
            j++;
        }
        else if(x[i]<y[j]) {
            i++;
        }
        else if(x[i]>y[j]) {
            j++;
        }
    }
    return ret;
}

function subtract(x, y) {
    let i = 0;
    let j = 0;
    let ret = [];
    while( (i<x.length) && (j<y.length)) {
        if(x[i] == y[j]) {
            i++;
            j++;
        }
        else if(x[i]<y[j]) {
            ret.push(x[i]);
            i++;
        }
        else if(x[i]>y[j]) {
            j++;
        }
    }
    while(i<x.length) {
        ret.push(x[i]);
        i++;
    }
    return ret;
}

function matchRules(rules, val) {
    let ret = [];
    for(let i=0; i<rules.length; i++) {
        if(checkRule(rules[i], val)) {
            ret.push(i);
        }
    }
    return ret;
}

function run(input) {
    let tx = parseIn(input);
    let tickets = filterTickets(tx);
    let rules = tx["rules"];

    let ruleSets = [];
    let myTicket = tx["ticket"];
    for(let i=0; i<myTicket.length; i++) {
        ruleSets.push(makeRuleArray(rules));
    }

    for(let i=0; i<tickets.length; i++) {
        let ticket = tickets[i];
        for(let j=0; j<ticket.length; j++) {
            let val = ticket[j];
            let matched = matchRules(rules, val);
            let currMatched = ruleSets[j];
            let newMatched = intersect(matched, currMatched);
            ruleSets[j] = newMatched;
        }
    }

    let fullyDetermined = false;
    while(!fullyDetermined) {
        fullyDetermined = true;
        let determined = [];
        for(let i=0; i<myTicket.length; i++) {
            if(ruleSets[i].length==1) {
                determined.push(ruleSets[i][0]);
            }
            else {
                fullyDetermined = false;
            }
        }
        if(!fullyDetermined) {
            determined.sort(function(a, b){return a-b});
            for(let i=0; i<myTicket.length; i++) {
                if(ruleSets[i].length>1) {
                    let newMatched = subtract(ruleSets[i],determined);
                    ruleSets[i] = newMatched;
                }
            }
        }
    }

    let ret = 1;
    for(let i=0; i<myTicket.length; i++) {
        let fieldNum = ruleSets[i][0];
        let fieldName = rules[fieldNum]["key"];
        console.log("Field "+i+" val="+myTicket[i]+" ("+ruleSets[i].length+" matched), first=" +
            fieldNum + " " + fieldName);
        if(fieldName.startsWith("departure")) {
            ret = ret * myTicket[i];
        }
    }
    return ret;
}

let input = []
readin(input,"in.txt").then( () => {
    let result = run(input);
    console.log("Result = " + result);
});
