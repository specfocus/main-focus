import type { IntervalOptions } from './interval';
import interval from './interval';

export const ABORT = 'abort';
export const DONE = 'done';
export const HEARTBEAT = 'heartbeat';
export const TIMEOUT = 'timeout';
export const SKIP = 'skip';
export const VALUE = 'value';

const ONE_SECOND = 1000;
const INTERVAL = ONE_SECOND;

export const SIGNAL_TYPES = [
  ABORT,
  DONE,
  HEARTBEAT,
  TIMEOUT,
  SKIP,
  VALUE
] as const;

export type SingalType = typeof SIGNAL_TYPES[number];

export interface SignalOptions<Abort = any, Heartbeat = any, Timeout = any>
    extends Omit<IntervalOptions<Abort, Heartbeat>, 'timer'> {
  heartbeat: [number, Heartbeat]
  timeout?: [number, Timeout];
}

const signal = <Abort, Heartbeat, Timeout>(
  { abort, heartbeat, timeout }: SignalOptions<Abort, Heartbeat, Timeout>
): [
  AsyncIterator<Abort | Heartbeat, void, undefined>,
  <Value>(value: IteratorResult<Abort | Heartbeat | Value, void>) => [SingalType, Abort | Heartbeat | Timeout | Value | undefined]
] => {
  const [abortSignal, abortValue] = abort;
  const [heartbeatSeconds, heartbeatValue] = heartbeat;
  const iterable = interval<Abort, Heartbeat>({
    abort: [abortSignal, abortValue],
    timer: [INTERVAL, heartbeatValue],
  });
  let sinceMilliseconds = Date.now();
  let heartbeatCount = 0;
  return [
    iterable[Symbol.asyncIterator](),
    <Value>(result: IteratorResult<Abort | Heartbeat | Value>) => {
      if (result.done) {
        return [DONE, heartbeatValue];
      }

      if (result.value === abortValue) {
        return [ABORT, abortValue];
      }

      if (result.value !== heartbeatValue) {
        sinceMilliseconds = Date.now();
        return [VALUE, result.value];
      }

      const ellapsedSeconds = (Date.now() - sinceMilliseconds) / ONE_SECOND;
      
      if (Array.isArray(timeout)) {
        const [timeoutSeconds, timeoutValue] = timeout;
        if (ellapsedSeconds >= timeoutSeconds) {
          return [TIMEOUT, timeoutValue];
        }
      }

      if (Array.isArray(heartbeat)) {
        if (ellapsedSeconds - heartbeatCount * ONE_SECOND >= heartbeatSeconds) {
          heartbeatCount++;
          return [HEARTBEAT, heartbeatValue];
        }
      }

      return [SKIP, heartbeatValue];
    }
  ];
};

export default signal;
