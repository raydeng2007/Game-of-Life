import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Grid extends React.Component{
    render(){
        return (
            <div>
            GRID
            </div>
        );
    }
}

class Main extends React.Component{

    constructor(){
        super();
        this.state = {
            generations:0
        }
    }

    render(){
        return(
            <div>
                <h1>Game of Life</h1>
                <Grid/>
                <h2>Generations : {this.state.generations}</h2>

            </div>
        );

    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

