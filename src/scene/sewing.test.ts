import { SEWING_SECONDS, SEWING_STAGES, sewingCaption, sewingLook, sewingStage } from './sewing';

it('lasts 9 seconds', () => expect(SEWING_SECONDS).toBe(9));

it('starts cutting, ends with the tag, then is done', () => {
  expect(sewingStage(0)).toBe('pieces');
  expect(sewingStage(8.99)).toBe('tag');
  expect(sewingStage(9)).toBe('done');
  expect(sewingStage(100)).toBe('done');
});

it('only ever moves forward', () => {
  let last = SEWING_STAGES.indexOf(sewingStage(0));
  for (let t = 0; t <= 9.5; t += 0.1) {
    const i = SEWING_STAGES.indexOf(sewingStage(t));
    expect(i).toBeGreaterThanOrEqual(last);
    last = i;
  }
});

it('every stage before done has a caption', () => {
  for (const s of SEWING_STAGES.filter((x) => x !== 'done')) expect(sewingCaption(s).length).toBeGreaterThan(0);
});

it('the toy goes from flat pieces to stuffed, and gets its eyes near the end', () => {
  expect(sewingLook(0)).toMatchObject({ flatten: 1, hideEyes: true });
  expect(sewingLook(4).flatten).toBe(0);
  expect(sewingLook(4).puff).toBeLessThan(1);
  expect(sewingLook(9)).toEqual({ flatten: 0, puff: 1, hideEyes: false });
});
