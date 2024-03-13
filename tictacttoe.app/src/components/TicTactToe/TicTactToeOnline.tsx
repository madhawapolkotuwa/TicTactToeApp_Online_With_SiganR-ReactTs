import React, { useContext, useEffect, useState } from 'react';

import Classes from './styles.module.css';
import { GlobleContext } from '../../context/Context';

interface SquareProps {
    value: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
    return (
        <button onClick={onClick} className={Classes.square}>{value}</button>
    )
}

const TicTactToeOnline: React.FC = () => {

    const [squares, setSquares] = useState<string[]>(Array(9).fill(''));
    const [isMyTurn, setIsMyturn] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [isReset, setIsReset] = useState<boolean>(false);

    const { userState:{username}, signalRState:{signalRService, privateRoomInitiated, privateRoomMsg} } = useContext(GlobleContext);

    useEffect(()=>{
        if(privateRoomInitiated.requested === username){
            setIsMyturn(true);
        }
    },[privateRoomInitiated]);

    useEffect(()=>{
        if(privateRoomMsg.from !== username && privateRoomMsg.position && privateRoomMsg.position !== 11){
            handlePatnerClick(privateRoomMsg.position - 1);
        }
        if(privateRoomMsg.position === 11){
            handleRestartRequest();
        }
    },[privateRoomMsg]);

    const handlePatnerClick = (getSquareNumber: number) => {
        let cpySquare = [...squares];
        if(getWinner(cpySquare) || cpySquare[getSquareNumber]) return;
        cpySquare[getSquareNumber] = privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested;
        setIsMyturn(true);
        setSquares(cpySquare);
    }

    const handleSquareClick = (getCurrentNumber: number) => {
        // console.log(getCurrentNumber);
        let cpySquare = [...squares];

        if (getWinner(cpySquare) || cpySquare[getCurrentNumber] || !isMyTurn) return;

        signalRService?.sendPrivateRooMessage({
            from: username,
            to: privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested,
            position: getCurrentNumber + 1
        });

        cpySquare[getCurrentNumber] = username;
        setIsMyturn(false);
        setSquares(cpySquare);
    }

    const getWinner = (squares: string[]): string => {
        const winningPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let i = 0; i < winningPatterns.length; i++) {
            const [x, y, z] = winningPatterns[i];
            if (squares[x] && (squares[x] === squares[y]) && (squares[y] === squares[z])) return squares[x];
        }
        return '';
    }

    const handleRestart = () => {
        signalRService?.sendPrivateRooMessage({
            from: username,
            to: privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested,
            position: 11
        });
    }

    const handleRestartRequest = () => {
        setIsReset(false);
        setSquares(Array(9).fill(''));
        if(privateRoomInitiated.requested === username){
            setIsMyturn(true);
        }else{
            setIsMyturn(false);
        }
    }

    useEffect(() => {
        if (!getWinner(squares) && squares.every(item => item !== '')) {
            setStatus('This is Draw! please restart the game');
            setIsReset(true);
        } else if (getWinner(squares)) {
            setStatus(`Winner is ${getWinner(squares)} please restart the game!`);
            setIsReset(true);
        } else {
            setStatus(`Next player is ${isMyTurn ? username : privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested}`);
        }
    }, [isMyTurn]);

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
                {
                    isReset ? <button className='btn btn-secondary mb-0' onClick={handleRestart}>Restart</button> : null
                }
            </div>
        </div>
    )
}

export default TicTactToeOnline