import { useState } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square"

import { TURNS } from "./constants"
import { checkWinnerFrom, checkEndGame } from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"
import { saveGameToStorage, resetGameStorage } from "./logic/storage"
function App() {

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })
 

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  //null es que no hay ganadores, false es que hay un empate
  const [winner, setWinner] = useState(null)
  //revisamos todsas las combinacion ganadoras
  //para ver si gano 'x' u 'o'


  //reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage/* 
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn') */
  }
  
 

  const updateBoard = (index) => {
//si tiene algo no actualizar
    if (board[index] || winner) return
//actualizar tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
//cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
   
    //revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className="board">
      <h1> Tic Tac toe</h1>
      <button onClick={resetGame}>Replay</button>
      <section className="game">
        {
          board.map((squared, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {squared}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      
      <WinnerModal resetGame={resetGame} winner={winner} />

    </main>
  )

}

export default App