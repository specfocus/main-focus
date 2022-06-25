const timer = <T>(
  ms: number,
  value: T | undefined = undefined
) => new Promise<T>(resolve => setTimeout(() => resolve(value), ms));

export default timer;
