const debounce = (func) => {
  let timeoutId;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, 1000);
  };
};

const kissLandon = () => {
  console.log("kissed");
};
