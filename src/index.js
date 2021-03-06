import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

class Box extends React.Component {

    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col);
    }

    render() {
        return (
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        );
    }
}

class Grid extends React.Component {
    render() {
        const width = (this.props.cols * 14);
        var rowsArr = [];

        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.cols; j++) {
                let boxId = i + "_" + j;

                boxClass = this.props.fullGrid[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        boxId={boxId}
                        row={i}
                        col={j}
                        selectBox={this.props.selectBox}
                    />
                );
            }
        }

        return (
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Buttons extends React.Component {

    handleSelect = (evt) => {
        this.props.gridSize(evt);
    }

    handleSelectSeed = (evt) => {
        this.props.seedStyle(evt);
    }

    render() {
        return (
            <div className="center">
                <ButtonToolbar>
                    <button className="btn btn-info" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className="btn btn-info" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className="btn btn-info" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className="btn btn-info" onClick={this.props.slow}>
                        Slow
                    </button>
                    <button className="btn btn-info" onClick={this.props.fast}>
                        Fast
                    </button>
                    <DropdownButton
                        bsStyle = 'info'
                        title="Seed Style"
                        id="seed-menu"
                        onSelect={this.handleSelectSeed}
                    >
                        <MenuItem eventKey="1">Random</MenuItem>
                        <MenuItem eventKey="2">Glider</MenuItem>
                        <MenuItem eventKey="3">Fan</MenuItem>
                        <MenuItem eventKey="4">Explode</MenuItem>
                    </DropdownButton>
                    <DropdownButton
                        bsStyle = 'info'
                        title="Grid Size"
                        id="size-menu"
                        onSelect={this.handleSelect}
                    >
                        <MenuItem eventKey="1">20x10</MenuItem>
                        <MenuItem eventKey="2">50x30</MenuItem>
                        <MenuItem eventKey="3">70x50</MenuItem>
                    </DropdownButton>
                </ButtonToolbar>

            </div>
        )
    }
}

class Main extends React.Component {
    constructor() {
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;

        this.state = {
            generation: 0,
            fullGrid: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
    }

    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.fullGrid);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            fullGrid: gridCopy
        });
    }



    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed);
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
    }

    slow = () => {
        this.speed = 1000;
        this.playButton();
    }

    fast = () => {
        this.speed = 100;
        this.playButton();
    }

    clear = () => {
        var g = Array(this.rows).fill().map(() => Array(this.cols).fill(false));

        this.setState({
            fullGrid: g,
            generation: 0
        });
    }

    gridSize = (size) => {
        switch (size) {
            case "1":
                this.cols = 20;
                this.rows = 10;
                break;
            case "2":
                this.cols = 50;
                this.rows = 30;
                break;
            default:
                this.cols = 70;
                this.rows = 50;
        }
        this.clear();

    }

    seedStyle = (event)=>{
        switch (event) {
            case "1":
                this.seed();
                break;
            case "2":
                this.glider();
                break;
            case "3":
                this.fan();
                break;
            case "4":
                this.explode();
                break;
        }


    }

    play = () => {
        let g1 = this.state.fullGrid;
        let g2 = arrayClone(this.state.fullGrid);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0;
                if (i > 0)
                    if (g1[i - 1][j]) count++;
                if (i > 0 && j > 0)
                    if (g1[i - 1][j - 1]) count++;
                if (i > 0 && j < this.cols - 1)
                    if (g1[i - 1][j + 1]) count++;
                if (j < this.cols - 1)
                    if (g1[i][j + 1]) count++;
                if (j > 0) if (g1[i][j - 1]) count++;
                if (i < this.rows - 1)
                    if (g1[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0)
                    if (g1[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && this.cols - 1)
                    if (g1[i + 1][j + 1]) count++;
                if (g1[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
                if (!g1[i][j] && count === 3) g2[i][j] = true;
            }
        }
        this.setState({
            fullGrid: g2,
            generation: this.state.generation + 1
        });

    }

    seed = () => {
        let gridCopy = arrayClone(this.state.fullGrid);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let rand = Math.ceil(Math.random() * 6)%2
                if ( rand === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            fullGrid: gridCopy
        });
    }

    glider = ()=>{

        let gridCopy = arrayClone(this.state.fullGrid);
        gridCopy[0][2] = true
        gridCopy[1][2] = true
        gridCopy[2][2] = true
        gridCopy[2][1] = true
        gridCopy[1][0] = true
        this.setState({

            fullGrid:gridCopy
        })
        this.playButton()
    }

    fan = ()=>{

        let gridCopy = arrayClone(this.state.fullGrid);
        gridCopy[14][22] = true
        gridCopy[14][23] = true
        gridCopy[14][24] = true
        gridCopy[13][23] = true

        this.setState({

            fullGrid:gridCopy
        })
        this.playButton()
    }

    explode = ()=>{

        let gridCopy = arrayClone(this.state.fullGrid);
        gridCopy[14][22] = true
        gridCopy[14][23] = true
        gridCopy[15][24] = true
        gridCopy[15][21] = true
        gridCopy[15][22] = true
        gridCopy[16][22] = true
        gridCopy[16][23] = true

        this.setState({

            fullGrid:gridCopy
        })
        this.playButton()
    }

    componentDidMount() {
        this.seed();
        this.playButton();
    }

    render() {
        return (
            <div>
                <h1>Conway's Game of Life</h1>
                <p className='center'>
                    Conway's Game of Life is a cellular automaton that was invented by British mathematician John Conway<br/>
                    in 1970, this '0 player game' imitates the idea of cell repopulating over a period of time. To learn <br/>
                    more, here's a <a href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'> link to the wiki page</a><br/>
                    Each blue cell represents a living cell and each gray cell represents a dead cell. Each cell on the board<br/>
                    follows a specific set of rules: <br/>
                    1) Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.<br/>
                    2) Any live cell with two or three live neighbours lives on to the next generation.<br/>
                    3) Any live cell with more than three live neighbours dies, as if by overpopulation.<br/>
                    4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.<br/>
                    You can also pre-populate the board with existing patterns in the <i>Seed Style</i> section of the menu.<br/>
                </p>

                <Buttons
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}
                    gridSize={this.gridSize}
                    seedStyle={this.seedStyle}
                />
                <Grid
                    fullGrid={this.state.fullGrid}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />
                <h2>Generations: {this.state.generation}</h2>
            </div>
        );
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));