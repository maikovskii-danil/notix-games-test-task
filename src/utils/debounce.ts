const STD_DELAY = 300;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const debounce = <FuncArgs extends any[]>(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  func: (...args: FuncArgs) => any,
  delay: number = STD_DELAY,
) => {
  let timeoutId: number | null = null;

  /* eslint-disable-next-line */
  return function (this: any, ...args: FuncArgs) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
