import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Square from './square';

class Board extends React.Component {

	renderSquare(i) {
		return <Square value={this.props.squares[i]}
					   onClick={() => this.props.onClick(i)}/>;
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			xIsNext: true,
			value: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleClick(i) {
		const history = this.state.history;
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			xIsNext: !this.state.xIsNext,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[history.length - 1];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
			'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		// This bind works as a arrow function to not loose this as a component, actually to remain a this.state
		// So this.handleClick.bind(this) equals (i) => this.handleClick(i), also can be done in constructor like this.handleSubmit
		// NOTE: for handling input values uncontrolled components can be used
		return (
			<div className="game">
				<div className="game-board">
					<Board  squares={current.squares}
						onClick={this.handleClick.bind(this)}  />
				</div>
				<div className="game-info">
					<div>{ status }</div>
					<ol>{moves}</ol>
				</div>
				<h3>{this.state.value}</h3>
				<form onSubmit={this.handleSubmit}>
					<label>
						Name:
						<input type="text" value={this.state.value} onChange={this.handleChange} />
						<textarea value={this.state.value} onChange={this.handleChange} />
					</label>

					<label>
						Upload file:
						<input
							type="file"
							ref={input => {
							  this.fileInput = input;
							}}
									/>
								</label>

					<select value={this.state.value} onChange={this.handleChange}>
						<option value="grapefruit">Grapefruit</option>
						<option value="lime">Lime</option>
						<option value="coconut">Coconut</option>
						<option value="mango">Mango</option>
					</select>
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		// TODO: implement file upload at some point and look into ref's of react
		alert(
			`Selected file - ${this.fileInput.files[0].name}`
		);

	}


	jumpTo(move) {
		let history = this.state.history.splice(0);
		
		history[history.length-1] = history[move];

		this.setState({
			history: history
		});
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
