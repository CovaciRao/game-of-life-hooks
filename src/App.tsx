import React, { useCallback, useRef, useState } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 50;
const numCols = 50;
const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
];

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });

  const[inProgress, setInProgress] = useState(false);

  const inProgressRef = useRef(inProgress);
  inProgressRef.current = inProgress;

  const runGame = useCallback(() => {
    if(!inProgressRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++) {
          for(let j = 0; j < numCols; j++) {
            let neighborns = 0;
            operations.forEach(([x,y]) => {
              const newI = i + x;
              const newJ = j + y;
              if(newI >= 0 && newI <numRows && newJ >=0 && newJ < numCols) {
                neighborns += g[newI][newJ];
              }
            })

            if(neighborns < 2 || neighborns > 3) {
              gridCopy[i][j] = 0;
            }
          }
        }
      })
    })

    setTimeout(runGame, 1000);
  }, []) 

  return (
    <>
    <button 
      onClick={() => {
        setInProgress(!inProgress);
      }}
     >
      {inProgress ? 'Stop' : 'Start'}
    </button>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}
    >
      {grid.map((rows,indexRow) =>
        rows.map((col, indexCol) => 
        <div 
          key={`${indexRow}-${indexCol}`}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[indexRow][indexCol] = gridCopy[indexRow][indexCol] ? 0 : 1;
            })
            setGrid(newGrid)
          }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: grid[indexRow][indexCol] ? "red" : undefined,
            border: "solid 1px black",
          }}
        > 

        </div> 
      ))}
    </div>
    </>
  )};

export default App;
