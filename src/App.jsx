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

const currentWeekState = selector({
  key: 'currentWeekState',
  get: ({ get }) => {
    const week = get(cellState).slice(-7);

    if (!week.length) return [];

    return get(columnState).map(
      (column, i) =>
        week.map((cells) => cells?.[i]).reduce(sum, 0) /
        7e-6 /
        population[column],
    );
  },
});

const previousWeekState = selector({
  key: 'previousWeekState',
  get: ({ get }) => {
    const prev = get(cellState).slice(-14, -7);

    if (!prev.length) return [];

    return get(columnState).map(
      (column, i) =>
        prev.map((cells) => cells?.[i]).reduce(sum, 0) /
        7e-6 /
        population[column],
    );
  },
});

const weeklyChangeState = selector({
  key: 'weeklyChangeState',
  get: ({ get }) => {
    const curr = get(currentWeekState);
    const prev = get(previousWeekState);
    return get(columnState).map((column, i) => (100 * curr[i]) / prev[i] - 100);
  },
});

function App() {
  const [, setData] = useRecoilState(dataState);

  useEffect(async () => {
    const response = await fetch('https://secure.hersen.name/fohm');
    setData(await response.json());
  }, []);

  return (
    <div className="table">
      <span className="column-heading">{useRecoilValue(headingState)}</span>
      {useRecoilValue(columnState).map((column) => (
        <span className="row-heading">{column.replace(/_/g, ' ')}</span>
      ))}

      <span className="column-heading">denna vecka</span>
      {useRecoilValue(currentWeekState).map(Math.round).map(cellSpan)}

      <span className="column-heading">föreg vecka</span>
      {useRecoilValue(previousWeekState).map(Math.round).map(cellSpan)}

      <span className="column-heading">förändring</span>
      {useRecoilValue(weeklyChangeState).map(Math.round).map(cellSpan)}
    </div>
  );
}

function sum(a, b) {
  return a + b;
}

function cellSpan(cellValue) {
  return <span className="cell">{cellValue}</span>;
}

export default App;
