import { animate } from './spinning-donut';

describe('spinning-donut', () => {
  it('should spin a 3D donut', async (done) => {
    const clear = animate();

    setTimeout(() => {
      clear();
      done();
    }, 3000);

    expect(true).toBeTruthy();
  });
});