import type { SignalOptions } from './signal';
import signal, { ABORT, DONE, HEARTBEAT, TIMEOUT, VALUE } from './signal';

export interface ExecutionOptions<Abort, Heartbeat, Timeout> extends SignalOptions<Abort, Heartbeat, Timeout> {
  nonstop?: boolean;
}

export type Next<Value, Abort, Heartbeat> = () => Promise<IteratorResult<Value | Abort | Heartbeat, void>>;

/**
* executes a queue
* @param queue array of values
*/
export const execution = async function* <Input, Output, Abort, Heartbeat, Timeout>(
  queue: Input[],
  processor: (input: Input) => AsyncGenerator<Output, void, undefined>,
  { nonstop, ...signalOptions }: ExecutionOptions<Abort, Heartbeat, Timeout>
): AsyncGenerator<Output | Abort | Heartbeat | Timeout> {
  const [signals, test] = signal(signalOptions);
  const iteration = (): Next<Output, Abort, Heartbeat> => {
    if (queue.length === 0) {
      return signals.next;
    }
    const next = queue.shift();
    const iterable = processor(next);
    const iterator = iterable[Symbol.asyncIterator]();
    return () => Promise.race([signals.next(), iterator.next()]);
  }
  while (queue.length > 0 || nonstop) {
    const next = iteration();
    while (true) {
      const result = await next();
      const [type, value] = test<Output>(result);
      switch (type) {
        case ABORT:
          yield value;
          return;
        case DONE:
          return;
        case HEARTBEAT:
          yield value;
        case TIMEOUT:
          yield value;
          return;
        case VALUE:
          yield value;
          break;
      }
    }
  }
};

/**
 * 
 */
export default class Pipeline<Input, Output, Abort, Heartbeat, Timeout> {
  constructor(
    public readonly queue: Input[],
    public readonly processor: (arg: Input) => AsyncGenerator<Output, void, undefined>,
    public readonly options: ExecutionOptions<Abort, Heartbeat, Timeout>
  ) {
  }

  public readonly [Symbol.asyncIterator] = (): AsyncIterator<Output | Abort | Heartbeat | Timeout> => execution<Input, Output, Abort, Heartbeat, Timeout>(
    this.queue,
    this.processor.bind(this),
    this.options
  );

  public readonly enqueue = (value: Input): void => {
    this.queue.push(value);
  };
}
