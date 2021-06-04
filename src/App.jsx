import React, { useState, useEffect } from 'react';
import './App.css';
import population from './population';

function App() {
  const [heading, setHeading] = useState('heading');
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [cells, setCells] = useState([]);

  useEffect(async () => {
    const response = await fetch('https://secure.hersen.name/fohm');
    const data = await response.json();
    const { heading, columns, rows, cells } = data;
    setHeading(heading);
    setColumns(columns);
    setRows(rows);
    setCells(cells);
  }, []);

  const week = cells.slice(cells.length - 7);
  const prev = cells.slice(cells.length - 14, cells.length - 7);

  return (
    <div>
      <div className="table">
        <span className="column-heading">{heading}</span>
        {columns.map((column) => (
          <span className="row-heading">{column.replace(/_/g, ' ')}</span>
        ))}
        {rows.slice(rows.length - 14).map((row, j) => (
          <>
            <span className="column-heading">
              {rows[rows.length - j - 1].substr(5)}
            </span>
            {columns.map((column, i) => (
              <span className="cell">{cells[rows.length - j - 1]?.[i]}</span>
            ))}
          </>
        ))}

        <span className="column-heading">∑ vecka</span>
        {columns.map((column, i) => (
          <span className="cell">
            {week.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0)}
          </span>
        ))}

        <span className="column-heading">∑ föreg v</span>
        {columns.map((column, i) => (
          <span className="cell">
            {prev.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0)}
          </span>
        ))}

        <span className="column-heading">vecka/dag</span>
        {columns.map((column, i) => (
          <span className="cell">
            {Math.round(
              week.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0) /
                7e-6 /
                population[column],
            )}
          </span>
        ))}

        <span className="column-heading">föreg/dag</span>
        {columns.map((column, i) => (
          <span className="cell">
            {Math.round(
              prev.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0) /
                7e-6 /
                population[column],
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
