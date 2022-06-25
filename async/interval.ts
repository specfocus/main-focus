import promiseAbort from './abort';
import promiseTimer from './timer';

export interface IntervalOptions<Abort, Timer> {
  abort: [AbortSignal, Abort];
  timer: [number, Timer];
}

const interval = async function* <Abort, Idle>({
  abort,
  timer
}: IntervalOptions<Abort, Idle>): AsyncGenerator<Abort | Idle, void, undefined> {
  const [abortSignal, abortValue] = abort;
  const abortPromise = promiseAbort(abortSignal, abortValue);
  const next = () => Promise.race([abortPromise, promiseTimer(...timer)]);
  for (let value = await next(); value !== abortValue; value = await next()) {
    yield value;
  }
  yield abortValue;
};

export default interval;
