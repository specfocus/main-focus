import type { ReadableOptions } from 'stream';
import { Readable } from 'stream';
import AsyncIterator from './iterator';

const create = <T>(source: AsyncIterable<T>, factor: number = 1): Readable => {
  const iterator = AsyncIterator(source);
  let hasNext = true;
  let error;
  const pull = (controller: Readable, size: number) => {
    iterator.next(
    ).then(
      ({ done, value }) => {
        if (value) {
          controller.push(value);
        }
        hasNext = !done;
        const remaining = size - factor;
        if (hasNext && remaining > 0) {
          pull(controller, remaining);
        }
      }
    ).catch(
      err => {
        error = err;
        hasNext = false; 
      }
    );
  };
  const options: ReadableOptions = {
    encoding: 'utf8', // BufferEncoding
    read: function (this: Readable, size: number): void {
      if (hasNext) {
        pull(this, size);
      }
    }
  };
  return new Readable(options);
};

export default create;
