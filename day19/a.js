const fs = require('fs');
const readline = require('readline');

const rule_a = 0;
const rule_b = 1;
const rule_comp = 2;

class Rule {
    constructor (id, op) {
        this.id = id;
        this.op=op;
        this.subrules = null;
    }

    setSubrules(sr) {
        this.subrules = sr;
    }

    print() {
        console.log("Rule id="+this.id+" subrules="+this.subrules);
    }
    
}

function findChar(msg, pos, c) {
        while((pos<msg.length) && (msg.charAt(pos)!=c)) {
            pos++;
        }
        if(pos<msg.length) return pos+1;
        return -1;
}


function matchChar(msg, pos, c) {
        if((pos<msg.length) && (msg.charAt(pos)==c)) {
            return pos+1;
        }
        return -1;
}

function matchRuleRc(msg, rule, rules, pos) {
    if(rule.op==rule_a) {
        return matchChar(msg, pos, "a");
    }
    if(rule.op==rule_b) {
        return matchChar(msg, pos, "b");
    }

    // compound rule
    let bestMatchPos = -1;
    for(let i=0; i<rule.subrules.length; i++) {
        let subrule = rule.subrules[i];
        let subPos = pos;
        for(let j=0; (j<subrule.length) && (subPos>=0); j++) {
            let sr = rules[subrule[j]];
            subPos = matchRuleRc(msg, sr, rules, subPos);
        }

        if(subPos>=0) {
            // This subrule matches
            if( (bestMatchPos<0) || (subPos<bestMatchPos)) {
                bestMatchPos = subPos;
            }
        }
    }
    return bestMatchPos;
}

function matchRule(msg, rule, rules) {
    let matchPos = matchRuleRc(msg, rule, rules, 0);
    if(matchPos != msg.length) return -1;
    return matchPos;
}

function parseRule(line) {
    let ret;
    let s = line.split(": ");
    let id = parseInt(s[0]);
    if(s[1] == "\"a\"") {
        ret = new Rule(id, rule_a);
    }
    else if (s[1] == "\"b\"") {
        ret = new Rule(id, rule_b);
    }
    else {
        ret = new Rule(id, rule_comp);
        let subrules = [];
        let t = s[1].split(" | ");
        for (let i=0; i<t.length; i++) {
            let sr = t[i].split(" ").map(a => parseInt(a));
            subrules.push(sr);
        }
        ret.setSubrules(subrules);
    }
    return ret;
}

function readin(rules,msgs,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        if(line.length<2) {
        }
        else if(line.includes(":")) {
            let rule = parseRule(line);
            rules[rule.id] = rule;
            //rules.push(parseRule(line));
        }
        else {
            msgs.push(line);
        }
    });
    return p;
}

function run(rules, msgs) {
    let ret = 0;
    for(let i=0; i<msgs.length; i++) {
        let matchPos = matchRule(msgs[i], rules[0], rules);
        if(matchPos>=0) {
            ret++;
        }
    }
    return ret;
}

let rules = new Array(138);
let msgs = [];
readin(rules,msgs,"in.txt").then( () => {
    let result = run(rules, msgs);
     console.log("result: " + result);
})
