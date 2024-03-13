import React, { useEffect, useState } from 'react';

import Classes from './styles.module.css';

interface SquareProps {
    value: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
    return (
        <button onClick={onClick} className={Classes.square}>{value}</button>
    )
}



const Tictacttoe: React.FC = () => {

    const [squares, setSquares] = useState<string[]>(Array(9).fill(''));
    const [isXTurn, setIsXTurn] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("");

    const handleSquareClick = (getCurrentNumber: number) => {
        // console.log(getCurrentNumber);
        let cpySquare = [...squares];

        if(getWinner(cpySquare) || cpySquare[getCurrentNumber])return;
        cpySquare[getCurrentNumber] = isXTurn ? 'X' : 'O';
        setIsXTurn(!isXTurn);
        setSquares(cpySquare);
    }

    const getWinner = (squares: string[]) : string => {
        const winningPatterns = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        for (let i=0; i < winningPatterns.length; i++){
            const [x,y,z] = winningPatterns[i];
            if(squares[x] && (squares[x] === squares[y]) && (squares[y] === squares[z])) return squares[x];
        }
        return '';
    }

    const handleRestart = () => {
        setSquares(Array(9).fill(''));
        setIsXTurn(true);
    }

    useEffect(()=>{
        if(!getWinner(squares) && squares.every(item => item !== '')){
            setStatus('This is Draw! please restart the game')
        }else if(getWinner(squares)){
            setStatus(`Winner is ${getWinner(squares)} please restart the game!`)
        }else{
            setStatus(`Next player is ${isXTurn ? 'X' : 'O'}`);
        }
    },[squares, isXTurn]);

    return (
        <div className={Classes.tictacttoeContainer}>
            <div className={Classes.tictacttoeButtonContainer}>
                <div className={Classes.tictacttoeButtons}>
                    <Square value={squares[0]} onClick={() => handleSquareClick(0)}></Square>
                    <Square value={squares[1]} onClick={() => handleSquareClick(1)}></Square>
                    <Square value={squares[2]} onClick={() => handleSquareClick(2)}></Square>
                </div>
                <div className={Classes.tictacttoeButtons}>
                    <Square value={squares[3]} onClick={() => handleSquareClick(3)}></Square>
                    <Square value={squares[4]} onClick={() => handleSquareClick(4)}></Square>
                    <Square value={squares[5]} onClick={() => handleSquareClick(5)}></Square>
                </div>
                <div className={Classes.tictacttoeButtons}>
                    <Square value={squares[6]} onClick={() => handleSquareClick(6)}></Square>
                    <Square value={squares[7]} onClick={() => handleSquareClick(7)}></Square>
                    <Square value={squares[8]} onClick={() => handleSquareClick(8)}></Square>
                </div>
            </div>
            <div>
                <p className='fs-2 p-1 mt-0'>{status}</p>
                <button className='btn btn-secondary mb-0' onClick={handleRestart}>Restart</button>
            </div>
        </div>
    )
}

export default Tictacttoe

//////////////////////
// 0 | 1 | 2
// 3 | 4 | 5
// 6 | 7 | 8