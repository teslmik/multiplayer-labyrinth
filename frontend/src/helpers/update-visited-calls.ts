export const updateVisitedCells = (
  i: number,
  j: number,
  setState: React.Dispatch<React.SetStateAction<boolean[][]>>,
) => {
  setState((prevVisitedCells) => {
    const newVisitedCells = [...prevVisitedCells];
    newVisitedCells[i][j] = true;
    return newVisitedCells;
  });
};
