import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

class Box extends React.Component{
    selectBox = ()=>{
        this.props.selectBox(this.props.row, this.props.col)
    }

    render(){
        return (
            <div
                className={this.props.boxClass}
                id = {this.props.id}
                onClick = {this.selectBox}
            />
        );
    }

}

class Buttons extends React.Component{

    

    render(){
        return (
            <div className="center">
                <ButtonToolbar>
                    <button className='btn btn-info' bsStyle="info" onClick={this.props.playButton}>
                        FUck
                    </button>
                    <button className='btn btn-info' bsStyle="info" onClick={this.props.playButton}>
                        FUck
                    </button>
                    <button className='btn btn-info' bsStyle="info" onClick={this.props.playButton}>
                        FUck
                    </button>
                    <button className='btn btn-info' bsStyle="info" onClick={this.props.playButton}>
                        FUck
                    </button>
                    <button className='btn btn-default' bsStyle="info" onClick={this.props.playButton}>
                        FUck
                    </button>
                    <button className='btn btn-default' bsStyle="info" onClick={this.props.playButton}>
                        FUck
                    </button>
                    <DropdownButton
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

class Grid extends React.Component{
    render(){
        const width = (this.props.cols * 16)+1;
        var rowsArr = [];
        var boxClass = "";

        for (var i = 0; i < this.props.rows ; i++){
            for (var j = 0; j < this.props.cols; j++){
                let boxCord = i+'_'+j;

                boxClass = this.props.fullGrid[i][j] ? 'box on' : 'box off';
                rowsArr.push(
                    <Box
                        boxClass = {boxClass}
                        key = {boxCord}
                        boxId = {boxCord}
                        row = {i}
                        col = {j}
                        selectBox = {this.props.selectBox}
                    />
                );
            }
        }

        return (
            <div className='grid' style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Main extends React.Component{

    constructor(){
        super();
        this.speed = 100;
        this.slow = 50;
        this.rows = 30;
        this.cols = 50;
        this.state = {
            generations:0,
            fullGrid: Array(this.rows).fill().map(()=> Array(this.cols).fill(false))
        }
    }

    selectBox = (row,col)=>{
        let gridCopy = arrayClone(this.state.fullGrid);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            fullGrid: gridCopy,
        })
    }

    playButton = ()=>{
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed);
    }

    pauseButton = ()=>{
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.slow);
    }

    slow = ()=>{
        this.speed = 50
    }

    clear = ()=>{
        this.setState({
            generations:0,
            fullGrid: Array(this.rows).fill().map(()=> Array(this.cols).fill(false))
        })
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
                if (j > 0)
                    if (g1[i][j - 1]) count++;
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
            generations: this.state.generations + 1
        });

    }

    seedBoard = ()=>{
        let gridCopy = arrayClone(this.state.fullGrid);
        for (let i = 0; i< this.rows; i++){
            for (let j = 0;j<this.cols; j++){
                let rand = Math.ceil(Math.random()*6);
                if (rand%2 === 1){
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            fullGrid: gridCopy,
        });
    }

    componentDidMount(){
        this.seedBoard();
        //this.playButton();
    }

    render(){
        return(
            <div>
                <h1>Game of Life</h1>
                <Buttons
                    playButton = {this.playButton()}
                    pauseButton = {this.pauseButton()}
                    slow = {this.slow()}
                    fast = {this.fast()}
                    clear = {this.clear()}
                    seed = {this.seedBoard()}
                    gridSize = {this.gridSize()}
                 />
                <Grid
                fullGrid = {this.state.fullGrid}
                rows = {this.rows}
                cols = {this.cols}
                selectBox = {this.selectBox}
                />
                <h2>Generations : {this.state.generations}</h2>

            </div>
        );

    }
}

function arrayClone(arr){
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));

