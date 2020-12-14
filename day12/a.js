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
        let op = line.charAt(0);
        let val = parseInt(line.substring(1));
        let o = { };
        o["op"] = op;
        o["val"] = val;
        input.push(o);
    });
    return p;
}

function run(input) {
    let dir = 90;
    let x = 0;
    let y = 0;

    for(let i=0; i<input.length; i++) {
        let o = input[i];
        let op = o["op"];
        let val = o["val"];

        if(op=="N") {
            y = y+val;
        } else if(op=="S") {
            y = y-val;
        }
        else if(op=="E") {
            x = x+val;
        }

        else if(op=="W") {
            x = x-val;
        }
        else if(op == "R") {
            dir = ((dir + val)%360);
        }
        else if(op == "L") {
            dir = ((dir + 360 - val) % 360);
        }
        else if(op == "F") {
            if(dir==0) {
                y = y+val;
            } else if(dir==180) {
                y = y-val;
            }
            else if(dir==90) {
                x = x+val;
            }
            else if(dir==270) {
                x = x-val;
            }
        }
    }
    let manhattan = Math.abs(x) + Math.abs(y);
    console.log("x=" + x + " y="+y+" dir="+dir+" manhattan="+manhattan);
}

let input = [];
readin(input,"in.txt").then( () => {
    run(input);
})
