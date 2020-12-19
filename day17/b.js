const fs = require('fs');
const readline = require('readline');


class FourD {
    constructor (nw, nz, ny, nx) {
        this.nw = nw;
        this.nz = nz;
        this.ny = ny;
        this.nx = nx;
        this.arr = new Array(nw);
        for(let h=0; h<nw; h++) {
            this.arr[h] = new Array(nz);
            for(let i=0; i<nz; i++) {
                this.arr[h][i] = new Array(ny);
                for(let j=0; j<ny; j++) {
                    this.arr[h][i][j] = new Array(nx);
                    for(let k=0; k<nx; k++) {
                        this.arr[h][i][j][k] = 0;
                    }
                }
            }
        }
        this.changed = false;
    }

    init(input) {
        for(let j=0; j<this.ny; j++) {
            for(let k=0; k<this.nx; k++) {
                if(input[j].charAt(k)=="#") {
                    this.arr[0][0][j][k] = 1;
                }
            }
        }
    }

    print() {
        for(let h=0; h<this.nw; h++) {
            for(let i=0; i<this.nz; i++) {
                console.log("w="+h+"  z="+i);
                for(let j=0; j<this.ny; j++) {
                    let line = "";
                    for(let k=0; k<this.nx; k++) {
                        if(this.arr[i][j][k]) {
                            line = line + "#";
                        } else {
                            line = line + ".";
                        }
                    }
                    console.log(line);
                }
            }
        }
    }

    countActive() {
        let ret = 0;
        for(let h=0; h<this.nw; h++) {
            for(let i=0; i<this.nz; i++) {
                for(let j=0; j<this.ny; j++) {
                    for(let k=0; k<this.nx; k++) {
                        ret = ret + this.get(h,i,j,k);
                    }
                }
            }
        }
        return ret;
    }

    get(w, z, y, x) {
        if( (w<0) || (w>=this.nw) ||
            (z<0) || (z>=this.nz) ||
            (y<0) || (y>=this.ny) ||
            (x<0) || (x>=this.nx) )
            return 0;
        return this.arr[w][z][y][x];
    }

    countAdjacent(w, z, y, x) {
        let ret = 0;
        for(const h of [-1, 0, 1]) {
            for(const i of [-1, 0, 1]) {
                for(const j of [-1, 0, 1]) {
                    for(const k of [-1, 0, 1]) {
                        ret = ret + this.get(w+h,z+i,y+j,x+k);
                    }
                }
            }
        }
        if(this.get(w,z,y,x)) {
            ret = ret - 1;
        }
        return ret;
    }

    setActive(w, z, y, x) {
        this.arr[w][z][y][x] = 1;
    }
}

function cycle(dim) {
    let nxt = new FourD(dim.nw+2,dim.nz+2,dim.ny+2,dim.nx+2);
    for(let h=0; h<nxt.nw; h++) {
        for(let i=0; i<nxt.nz; i++) {
            for(let j=0; j<nxt.ny; j++) {
                for(let k=0; k<nxt.nx; k++) {
                    let hh = h-1;
                    let ii = i-1;
                    let jj = j-1;
                    let kk = k-1;
                    let act = dim.get(hh,ii,jj,kk);
                    let adj = dim.countAdjacent(hh,ii,jj,kk);
                    let chng = false;
                    if(act) {
                        if((adj!=2) && (adj!=3)) {
                            chng = true;
                            act = 0;
                        }
                    } else {
                        if(adj==3) {
                            chng = true;
                            act = 1;
                        }
                    }
                    if(act) {
                        nxt.setActive(h,i,j,k);
                    }
                    if(chng) {
                        nxt.changed = true;
                    }
                }
            }
        }
    }
    return nxt;
}

function run(dim) {
    let nxt = dim;
    for(let i=0; i<6; i++) {
        nxt = cycle(nxt);
    }
    return nxt;
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
    let dim = new FourD(1,1,input.length,input[0].length);
    dim.init(input);
    let nxt = run(dim);
    console.log("result: " + nxt.countActive());
})
