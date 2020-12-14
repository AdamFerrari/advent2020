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
    let x = 0;
    let y = 0;
    let wx = 10;
    let wy = 1;
    let owx = wx;
    let owy = wy;

    for(let i=0; i<input.length; i++) {
        let o = input[i];
        let op = o["op"];
        let val = o["val"];
        if(op=="N") {
            wy = wy+val;
        } else if(op=="S") {
            wy = wy-val;
        }
        else if(op=="E") {
            wx = wx+val;
        }

        else if(op=="W") {
            wx = wx-val;
        }
        else if(op == "R") {
            owx = wx;
            owy = wy;
            if(val==90) {
                wx = owy;
                wy = 0 - owx;
            }
            else if(val==180) {
                wx = 0 - owx;
                wy = 0 - owy;
            }
            else if(val==270) {
                wx = 0 - owy;
                wy = owx;
            }
        }
        else if(op == "L") {
            owx = wx;
            owy = wy;
            if(val==90) {
                wx = 0 - owy;
                wy = owx;
            }
            else if(val==180) {
                wx = 0 - owx;
                wy = 0 - owy;
            }
            else if(val==270) {
                wx = owy;
                wy = 0 - owx;
            }
        }
        else if(op == "F") {
            x = x + (val * wx);
            y = y + (val * wy);
        }
    }
    let manhattan = Math.abs(x) + Math.abs(y);
    console.log("x=" + x + " y="+y+" wx="+wx+" wy="+wy+" manhattan="+manhattan);
}

let input = [];
readin(input,"in.txt").then( () => {
    run(input);
})
