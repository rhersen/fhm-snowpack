import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [heading, setHeading] = useState('heading');
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [cells, setCells] = useState([]);

  useEffect(async () => {
    const response = await fetch('http://fohm.hersen.name');
    const data = await response.json();
    const { heading, columns, rows, cells } = data;
    setHeading(heading);
    setColumns(columns);
    setRows(rows);
    setCells(cells);
  }, []);

  return (
    <div>
      <div className="table">
        <span className="column-heading">{heading}</span>
        {columns.map((column) => (
          <span className="row-heading">{column.replace(/_/g, ' ')}</span>
        ))}
        {rows.slice(rows.length - 7).map((row, j) => (
          <>
            <span className="column-heading">{rows[rows.length - j - 1]}</span>
            {columns.map((column, i) => (
              <span className="cell">{cells[rows.length - j - 1][i]}</span>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
