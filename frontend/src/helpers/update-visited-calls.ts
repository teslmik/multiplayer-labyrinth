export const updateVisitedCells = (
  i: number | undefined,
  j: number | undefined,
  setState: React.Dispatch<React.SetStateAction<boolean[][]>>,
) => {
  if (i !== undefined && j !== undefined) {
    setState((prevVisitedCells) => {
      const newVisitedCells = [...prevVisitedCells];
      newVisitedCells[i][j] = true;
      return newVisitedCells;
    });
  }
};
