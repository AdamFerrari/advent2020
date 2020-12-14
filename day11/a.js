const fs = require('fs');
const readline = require('readline');

const board_floor = ".";
const board_empty = "L";
const board_full = "#";
const board_changed = "changed";

class Board {
    constructor (nrows, ncols) {
        if(nrows<1) {
            this.rows = [];
        }
        else {
            this.rows = new Array(nrows);
            for(let i=0; i<nrows; i++) {
                this.rows[i] = new Array(ncols);
                for(let j=0; j<ncols; j++) {
                    this.rows[i][j] = board_floor;
                }
            }
        }
    }

    numRows() {
        return this.rows.length;
    }

    numCols() {
        if(this.rows.length<1) return 0;
        return this.rows[0].length;
    }

    addLine(line) {
        let newrow = new Array(line.length);
        for(let i=0; i<line.length; i++) {
            if(line.charAt(i)==".") {
                newrow[i] = board_floor;
            }
            else if(line.charAt(i)=="L") {
                newrow[i] = board_empty;
            }
            else if(line.charAt(i)=="#") {
                newrow[i] = board_full;
            }
        }
        this.rows.push(newrow);
    }

    print() {
        for(let i=0; i<this.numRows(); i++) {
            let line = "";
            for(let j=0; j<this.numCols(); j++) {
                line = line + this.rows[i][j];
            }
            console.log(line);
        }
    }

    get(i, j) {
        return this.rows[i][j];
    }

    set(i, j, s) {
        this.rows[i][j] = s;
    }

    isOcc(i, j) {
        if( (i<0) || (i>=this.numRows()) || (j<0) || (j>=this.numCols()) ) return 0;
        if (this.get(i,j) == board_full) return 1;
        return 0;
    }

    countOcc(i, j) {
        let ret =  (
            this.isOcc(i-1,j-1) + this.isOcc(i-1,j) + this.isOcc(i-1,j+1) +
            this.isOcc(i,j-1) +                       this.isOcc(i,j+1) +
            this.isOcc(i+1,j-1) + this.isOcc(i+1,j) + this.isOcc(i+1,j+1)
        );
        return ret;
    }

    nextState(i, j, chng) {
        let s = this.get(i,j);
        if(s==board_floor) return board_floor;
        let cnt = this.countOcc(i, j);
        if(s==board_empty) {
            if(cnt==0) {
                chng[board_changed] = true;
                return board_full;
            }
            return board_empty;
        }
        if(s==board_full) {
            if(cnt>3) {
                chng[board_changed] = true;
                return board_empty;
            }
            return board_full;
        }
        return s;
    }

    countAllOcc() {
        let ret = 0;
        for(let i=0; i<this.numRows(); i++) {
            for(let j=0; j<this.numCols(); j++) {
                if(this.get(i,j)==board_full) ret++;
            }
        }
        return ret;
    }
}

function play_game(board) {
    let nextBoard = new Board(board.numRows(), board.numCols());
    let currBoard = board;
    while(true) {
        let ch = { };
        ch[board_changed] = false;
        for(let i=0; i<currBoard.numRows(); i++) {
            for(let j=0; j<currBoard.numCols(); j++) {
                let ns = currBoard.nextState(i,j,ch);
                nextBoard.set(i,j,currBoard.nextState(i,j,ch));
            }
        }
        if(!ch[board_changed]) break;
        let tmpBoard = currBoard;
        currBoard = nextBoard;
        nextBoard = tmpBoard;
    }
    return currBoard.countAllOcc();
}

function readin(board, path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path)
    });
    let resolve;
    const p = new Promise( _resolve => resolve = _resolve );
    rl.on( 'close', () => resolve() );
    rl.on('line', function(line) {
        board.addLine(line);
    });
    return p;
}

let board = new Board(0,0);
readin(board,"in.txt").then( () => {
    let result = play_game(board);
    console.log("Result = " + result);
})
