import React, { useEffect } from 'react';
import './App.css';
import population from './population';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

const dataState = atom({ key: 'dataState', default: {} });
const headingState = selector({
  key: 'headingState',
  get: ({ get }) => get(dataState).heading || 'heading',
});
const columnState = selector({
  key: 'columnState',
  get: ({ get }) => get(dataState).columns || [],
});
const cellState = selector({
  key: 'cellState',
  get: ({ get }) => get(dataState).cells || [],
});

function App() {
  const [, setData] = useRecoilState(dataState);

  useEffect(async () => {
    const response = await fetch('https://secure.hersen.name/fohm');
    const data = await response.json();
    setData(data);
  }, []);

  const week = useRecoilValue(cellState).slice(
    useRecoilValue(cellState).length - 7,
  );
  const prev = useRecoilValue(cellState).slice(
    useRecoilValue(cellState).length - 14,
    useRecoilValue(cellState).length - 7,
  );

  return (
    <div className="table">
      <span className="column-heading">{useRecoilValue(headingState)}</span>
      {useRecoilValue(columnState).map((column) => (
        <span className="row-heading">{column.replace(/_/g, ' ')}</span>
      ))}

      <span className="column-heading">denna vecka</span>
      {useRecoilValue(columnState).map((column, i) => (
        <span className="cell">
          {Math.round(
            week.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0) /
              7e-6 /
              population[column],
          )}
        </span>
      ))}

      <span className="column-heading">föreg vecka</span>
      {useRecoilValue(columnState).map((column, i) => (
        <span className="cell">
          {Math.round(
            prev.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0) /
              7e-6 /
              population[column],
          )}
        </span>
      ))}

      <span className="column-heading">förändring</span>
      {useRecoilValue(columnState)
        .map(
          (column, i) =>
            (100 * week.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0)) /
            prev.map((cells) => cells?.[i]).reduce((a, b) => a + b, 0),
        )
        .map((percent) => Math.round(percent - 100))
        .map((rounded) => (
          <span className="cell">{rounded}</span>
        ))}
    </div>
  );
}

export default App;
