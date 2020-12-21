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
        this.matchstrs = new Set();
        if(op==rule_a) {
            this.matchstrs.add("a");
        }
        if(op==rule_b) {
            this.matchstrs.add("b");
        }
        this.isLoop = (id==0);
    }

    setSubrules(sr) {
        this.subrules = sr;
        for(let i=0; i<sr.length; i++) {
            for(let j=0; j<sr[i].length; j++) {
                if(this.id == sr[i][j]) this.isLoop = true;
            }
        }
    }

    print() {
        console.log("Rule id="+this.id+" subrules="+this.subrules+
            " loop="+this.isLoop+" matches="+this.matchstrs.size);
        if(false) {
            let szs = new Set();
            for(let m of this.matchstrs.keys()) {
                szs.add(m.length);
            }
            let ms = "    ";
            for(let m of szs) {
                ms = ms + " " + m;
            }
            console.log("    sizes: " + ms);
        }
        if(true) {
            let ms = "    ";
            for(let m of this.matchstrs.keys()) {
                ms = ms + " " + m;
            }
            console.log(ms);
        }
    }
}

function setStr(set) {
    let ret = "";
    let first = true;
    for(let s of set) {
        if(!first) {
            ret = ret + ", " + s;
        }
        else {
            ret = s;
        }
        first = false;
    }
    return ret;
}

function matchChar(msg, pos, c) {
        if((pos<msg.length) && (msg.charAt(pos)==c)) {
            return pos+1;
        }
        return -1;
}

function strMatchesMsg(msg, pos, str) {
    return msg.substr(pos).startsWith(str);
}

function matchRuleMstr(msg, rule, rules, pos) {
    if(rule.op==rule_a) {
        return matchChar(msg, pos, "a");
    }
    if(rule.op==rule_b) {
        return matchChar(msg, pos, "b");
    }

    let bestMatchLen = -1;
    for(let s of rule.matchstrs.keys()) {
        if(strMatchesMsg(msg,pos,s)) {
            if( (bestMatchLen==-1) || (s.length<bestMatchLen)) {
                bestMatchLen = s.length;
            }
        }
    }
    if(bestMatchLen>-1) {
        return pos+bestMatchLen;
    }
    return -1;
}

function matchRuleHyb(msg, rule, rules, pos) {
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
            subPos = matchRuleMstr(msg, sr, rules, subPos);
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

function matchRuleRc(msg, rule, rules, pos) {
    if(rule.op==rule_a) {
        return matchChar(msg, pos, "a");
    }
    if(rule.op==rule_b) {
        return matchChar(msg, pos, "b");
    }

    // compound rule
    let bestMatchPos = -1;
    let bestSubRule = -1;
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
                bestSubRule = i;
            }
        }
    }
    return bestMatchPos;
}

function matchLooperSuffix(msg, rule, rules) {
    let srprefix = rules[rule.subrules[0][0]];
    let prefixes = srprefix.matchstrs;
    for(let p of prefixes) {
        if(msg == p) {
            return msg.length;
        }
    }
    for(let p of prefixes) {
        if(msg.startsWith(p)) {
            let submsg = msg.substr(p.length);
            let mpos = matchLooperSuffix(submsg,rule, rules);
            if(mpos>-1) return msg.length;
        }
    }
    return -1;
}

function matchLooperInfix(msg, rule, rules) {
    let srprefix = rules[rule.subrules[0][0]];
    let prefixes = srprefix.matchstrs;
    let srsuffix = rules[rule.subrules[0][1]];
    let suffixes = srsuffix.matchstrs;

    let goodPrefixes = new Set();
    //console.log("Matching rule " + rule.id + "    msg: " + msg);
    for(let p of prefixes) {
        if(msg.startsWith(p)) goodPrefixes.add(p);
    }
    let goodSuffixes = new Set();
    for(let s of suffixes) {
        if(msg.length>=s.length) {
            let sstr = msg.substr(msg.length-s.length,s.length);
            if(sstr == s) goodSuffixes.add(s);
        }
    }
    //console.log("    prefixes: " + setStr(goodPrefixes));
    //console.log("    suffixes: " + setStr(goodSuffixes));

    for(let p of goodPrefixes) {
        for(let s of goodSuffixes) {
            if(msg == (p + s)) return msg.length;
        }
    }

    for(let p of goodPrefixes) {
        for(let s of goodSuffixes) {
            if((p.length + s.length) < msg.length) {
                let submsg = msg.substr(p.length, (msg.length-s.length-p.length));
                let mpos = matchLooperInfix(submsg, rule, rules);
                if(mpos>-1) return msg.length;
            }
        }
    }
    return -1;
}

function matchRuleZero(msg, rules) {
    let ruleZero = rules[0];
    let sr1 = rules[ruleZero.subrules[0][0]];
    let sr2 = rules[ruleZero.subrules[0][1]];
    for(let split = 1; split < (msg.length - 1); split++) {
        let first = msg.substr(0,split);
        let second = msg.substr(split, msg.length - split);
        let matchPos1 = matchLooperSuffix(first, sr1, rules);
        if(matchPos1==first.length) {
            let matchPos2 = matchLooperInfix(second, sr2, rules);
            if(matchPos2==second.length) {
                return msg.length;
            }
        }
    }
    return -1;
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

function combineMatchStrs(subrule, rules, pos) {
    let rule = rules[subrule[pos]];
    let mstrs = rule.matchstrs;
    if(pos==(subrule.length-1)) { 
        return mstrs;
    }
    let rstrs = combineMatchStrs(subrule, rules, pos+1);
    let ret = new Set();
    for(let s of mstrs.keys()) {
        for(let t of rstrs.keys()) {
            ret.add(s + t);
        }
    }
    return ret;
}

function makeMatchStrs(rule, rules) {
    if(rule.matchstrs.size > 0) return;
    for(let i=0; i<rule.subrules.length; i++) {
        let subrule = rule.subrules[i];
        for(let j=0; j<subrule.length; j++) {
            let sr = rules[subrule[j]];
            makeMatchStrs(sr, rules);
        }
    }
    for(let i=0; i<rule.subrules.length; i++) {
        let subrule = rule.subrules[i];
        let res = combineMatchStrs(subrule, rules, 0);
        for(let s of res.keys()) {
            rule.matchstrs.add(s);
        }
    }
}

function run(rules, msgs) {
    let ret = 0;
    for(let i=0; i<msgs.length; i++) {
        let matchPos = matchRuleZero(msgs[i],rules);
        if(matchPos>=0) {
            ret++;
            console.log("valid: " + msgs[i]);
        }
        else {
            console.log("invalid: " + msgs[i]);
        }
    }

    return ret;
}

function initRules(rules) {
    for(let i=0; i<rules.length; i++) {
        if(!rules[i].isLoop) {
            makeMatchStrs(rules[i], rules);
        }
    }

    for(let i=0; i<rules.length; i++) {
        rule = rules[i];
        rule.print();
    }
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
        }
        else {
            msgs.push(line);
        }
    });
    return p;
}

let rules = new Array(8);
let msgs = [];
readin(rules,msgs,"in.txt").then( () => {
    let result = 0;
    initRules(rules);
    result = run(rules, msgs);
    console.log("result: " + result);
})
