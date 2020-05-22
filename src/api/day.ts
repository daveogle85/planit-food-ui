const getDaysByRange = () =>
  new Promise((acc, rej) => {
    setTimeout(() => acc([]), 5000);
  });

export default getDaysByRange;
