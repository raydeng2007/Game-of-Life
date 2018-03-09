import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Grid extends React.Component{
    render(){
        const width = this.props.cols * 14;
        var rowsArr = [];
        var boxClass = "";

        for (var i = 0; i < this.props.rows ; i++){
            for (var j = 0; j < this.props.cols; j++){
                let boxCord = i+'-'+j;

                boxClass = this.props.fullGrid[i][j] ? 'on' : 'off';

            }
        }

        return (
            <div className='grid' style={{width: width}}>

            </div>
        );
    }
}

class Main extends React.Component{

    constructor(){
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 30;
        this.state = {
            generations:0,
            fullGrid: Array(this.rows).fill().map(()=> Array(this.cols).fill(false))
        }
    }

    render(){
        return(
            <div>
                <h1>Game of Life</h1>
                <Grid
                fullGrid = {this.state.fullGrid}
                rows = {this.state.rows}
                cols = {this.state.cols}
                />
                <h2>Generations : {this.state.generations}</h2>

            </div>
        );

    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

