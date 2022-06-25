import type { ExecutionOptions } from './pipeline';
import signal, { ABORT, DONE, HEARTBEAT, TIMEOUT, VALUE } from './signal';

export interface Cursor<T = any> extends IteratorYieldResult<T | undefined> {
  src: AsyncIterable<T>;
  it: AsyncIterator<T, void, undefined>;
}

interface SignalResult<Abort, Heartbeat> extends IteratorYieldResult<Abort | Heartbeat> {
}

type AsyncResult<T, Abort, Heartbeat> = Cursor<T> | SignalResult<Abort, Heartbeat>;

export type State<T> = Map<AsyncIterable<T>, Promise<Cursor<T>>>;

// Worker function to queue up the next result
const queueNext = async <T>(c: Cursor<T>): Promise<Cursor<T>> => {
  delete c.value; // Release previous one as soon as possible
  delete c.done;
  return Object.assign(c, await c.it.next());
};

export interface MultiplexerOptions<Abort, Heartbeat, Timeout> extends ExecutionOptions<Abort, Heartbeat, Timeout> {
}

/**
 * Merges multiple async sources (iterators)
 * @param this async iterables or async generators
 * @param options
 */
export const multiplexer = async function* <T, Abort, Heartbeat, Timeout>(
  this: State<T>,
  { nonstop, ...signalOptions }: MultiplexerOptions<Abort, Heartbeat, Timeout>
): AsyncGenerator<T | Abort | Heartbeat | Timeout, void, undefined> {
  const [signals, test] = signal(signalOptions);
  // While we are not aborted or still have any sources,
  // race the current promise of the sources we have left
  while (this.size > 0 || nonstop) {
    let result: AsyncResult<T, Abort, Heartbeat> | IteratorReturnResult<void>;
    if (this.size === 0) {
      result = await signals.next();
    } else {
      const cursorPromise = Promise.race(this.values());
      result = await Promise.race([cursorPromise, signals.next()]);
    }
    const [type, value] = test<T>(result);
    let cursor;
    switch (type) {
      case ABORT:
        yield value;
        return;
      case DONE:
        // Completed the sequence?
        if (Object.hasOwn(result, 'src')) {
          cursor = result as Cursor<T>;
          // Yes, drop it from sources
          this.delete(cursor.src);
        }
        break;
      case HEARTBEAT:
        yield value;
      case TIMEOUT:
        yield value;
        return;
      case VALUE:
        yield value;
        // No, grab the value to yield and queue up the next
        // Then yield the value
        cursor = result as Cursor<T>;
        this.set(cursor.src, queueNext(cursor));
        break;
    }
  }
};

export const join = <T, Abort, Heartbeat, Timeout>(
  sources: AsyncIterable<T>[],
  options: MultiplexerOptions<Abort, Heartbeat, Timeout>) => {
  const state = new Map<AsyncIterable<T>, Promise<Cursor<T>>>(
    sources.map(
      (src: AsyncIterable<T>): [AsyncIterable<T>, Promise<Cursor<T>>] => ([
        src,
        queueNext<T>({
          src,
          it: src[Symbol.asyncIterator](),
          value: undefined
        })
      ])
    )
  );
  return multiplexer.bind(state)(options);
}

/**
 * Generic multiplexer
 */
export default class Multiplexer<T, Abort, Heartbeat, Timeout> implements AsyncIterable<T> {
  // Map the generators to source objects in a map, get and start their
  // first iteration
  private readonly state: State<T>;

  constructor(
    sources: AsyncIterable<T>[],
    private readonly options: MultiplexerOptions<Abort, Heartbeat, Timeout>
  ) {
    this.state = new Map<AsyncIterable<T>, Promise<Cursor<T>>>(
      sources.map(
        (src: AsyncIterable<T>): [AsyncIterable<T>, Promise<Cursor<T>>] => ([
          src,
          queueNext<T>({
            src,
            it: src[Symbol.asyncIterator](),
            value: undefined
          })
        ])
      )
    );
  }

  public readonly [Symbol.asyncIterator] = (): AsyncIterator<T> => multiplexer.bind(this.state)(this.options);

  public readonly append = (src: AsyncIterable<T>): void => {
    this.state.set(
      src,
      queueNext<T>({
        src,
        it: src[Symbol.asyncIterator](),
        value: undefined
      })
    );
  };

  public readonly remove = (src: AsyncIterable<T>): boolean => this.state.delete(src);
}
