  // Take a signal parameter in the function that needs cancellation
const abort = async <T>(signal: AbortSignal, value: T): Promise<T> => {
  const resolver = (resolve: (result: T) => void) => {
    const onAbort = (ev: Event) => {
      // and be sure to clean it up when the action you are performing
      // is finished to avoid a leak
      // ... sometime later ...
      signal.removeEventListener('abort', onAbort);

      resolve(value);
    };

    // or if the API does not already support it -
    // manually adapt your code to support signals:
    signal.addEventListener('abort', onAbort, { once: true });
  };
  

  return new Promise(resolver);
}

export default abort;