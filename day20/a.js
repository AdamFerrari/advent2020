const fs = require('fs');
const readline = require('readline');

const tile_sz = 10;

const tile_u = 0;
const tile_r = 1;
const tile_d = 2;
const tile_l = 3;

function revStr(str) {
    let ret = "";
    for(let i=1; i<=str.length; i++)
        ret = ret + str.charAt(str.length - i);
    return ret;
}


class Tile {
    constructor (id, arr) {
        this.id = id;
        this.arr = arr;
        this.rotate 
        this.edges = [];
        this.edges.push(this.arr[0]);
        this.edges.push(this.slice_x(tile_sz-1));
        this.edges.push(this.arr[tile_sz-1]);
        this.edges.push(this.slice_x(0));
        this.edges.push(revStr(this.arr[0]));
        this.edges.push(revStr(this.slice_x(tile_sz-1)));
        this.edges.push(revStr(this.arr[tile_sz-1]));
        this.edges.push(revStr(this.slice_x(0)));
    }

    slice_x(x) {
        let ret = ""
        for(let i=0; i<tile_sz; i++) {
            ret = ret + (this.arr[i].charAt(x));
        }
        return ret;
    }

    print() {
        console.log("");
        console.log("Tile " + this.id + ":");
        for(let i=0; i<tile_sz; i++) {
            console.log(this.arr[i]);
        }
    }

    match_dirs(tileMap) {
        let ret = 0;
        for(let i=0; i<4; i++) {
            if( (tileMap.get(this.edges[0+i]).size>1) ||
                (tileMap.get(this.edges[4+i]).size>1) )
                ret++
        }
        return ret;
    }

    print_match_counts(tileMap) {
        console.log("Matching directions: " + this.match_dirs(tileMap));
        console.log("   matches up      : " + this.edges[0] + "   "+ (tileMap.get(this.edges[0]).size - 1));
        console.log("   matches right   : " + this.edges[1] + "   "+ (tileMap.get(this.edges[1]).size - 1));
        console.log("   matches down    : " + this.edges[2] + "   "+ (tileMap.get(this.edges[2]).size - 1));
        console.log("   matches left    : " + this.edges[3] + "   "+ (tileMap.get(this.edges[3]).size - 1));
        console.log("   matches up f    : " + this.edges[4] + "   "+ (tileMap.get(this.edges[4]).size - 1));
        console.log("   matches right f : " + this.edges[5] + "   "+ (tileMap.get(this.edges[5]).size - 1));
        console.log("   matches down f  : " + this.edges[6] + "   "+ (tileMap.get(this.edges[6]).size - 1));
        console.log("   matches left f  : " + this.edges[7] + "   "+ (tileMap.get(this.edges[7]).size - 1));
    }
}

function makeTileMap(tiles) {
    let tileMap = new Map;
    for(let i=0; i<tiles.length; i++) {
        let tile = tiles[i];
        let edges = tile.edges;
        for(let j=0; j<edges.length; j++) {
            let edge = edges[j];
            if(tileMap.has(edge)) {
                let entry = tileMap.get(edge);
                entry.add(tile);
            }
            else {
                let entry = new Set();
                entry.add(tile);
                tileMap.set(edge, entry);
            }
        }
    }
    return tileMap;
}

function makeTiles(input, tiles) {
    let i=0;
    while(i<input.length) {
        let id = parseInt(input[i].replace("Tile ","").replace(":",""));
        let arr = [];
        for(let j=0; j<tile_sz; j++) {
            i++;
            arr.push(input[i]);
        }
        i = i+2;
        tiles.push(new Tile(id,arr));
    }
}

function printTiles(tiles, tileMap) {
    for(let i=0; i<tiles.length; i++) {
        tiles[i].print();
        tiles[i].print_match_counts(tileMap);
    }
}

function corner_mult(tiles, tileMap) {
    let ret = 1;
    for(let i=0; i<tiles.length; i++) {
        if(tiles[i].match_dirs(tileMap)==2) {
            console.log("Corner: id = "+tiles[i].id);
            ret = ret * tiles[i].id;
        }
    }
    return ret;
}

function readin(lines,path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        lines.push(line);
    });
    return p;
}

let input = [];
readin(input,"in.txt").then( () => {
    let tiles = [];
    makeTiles(input,tiles);
    let tileMap = makeTileMap(tiles);
    // printTiles(tiles,tileMap);
    let ret = corner_mult(tiles, tileMap);
    console.log("Result: " + ret);
})
