import test from 'node:test';
import assert from 'node:assert/strict';
import { MATERIAL_SWATCHES } from '../data/content';
import {
  computeAboutRevealState,
  computeChapterStageMetrics,
  computeHeroGatewayMetrics,
  computeMaterialSampleState,
  computeStarCompanionState,
  getMappedMaterialSwatches,
} from './journeyLogic';

test('getMappedMaterialSwatches returns strictly the 24 mapped items without inventing unresolved records', () => {
  const mapped = getMappedMaterialSwatches(MATERIAL_SWATCHES);
  assert.equal(MATERIAL_SWATCHES.length, 27);
  assert.equal(mapped.length, 24);
  assert.ok(mapped.every((item) => item.mappingStatus === 'mapped' && Boolean(item.image)));
});

test('computeHeroGatewayMetrics smoothly fades wordmark and collages on forward scroll and reverses upward', () => {
  const start = computeHeroGatewayMetrics(0, false);
  const end = computeHeroGatewayMetrics(0.95, false);
  assert.equal(start.wordmarkOpacity, 1);
  assert.ok(end.wordmarkOpacity < 0.15);
  assert.ok(end.wordmarkScale > start.wordmarkScale);

  const reduced = computeHeroGatewayMetrics(0.8, true);
  assert.equal(reduced.wordmarkOpacity, 1);
  assert.equal(reduced.wordmarkScale, 1);
});

test('computeChapterStageMetrics recedes scene opacity as photographs take foreground and reverses cleanly', () => {
  const entry = computeChapterStageMetrics(0.08, false);
  const foreground = computeChapterStageMetrics(0.72, false);
  const settled = computeChapterStageMetrics(0.95, false);

  assert.equal(entry.chapterPhase, 'entering');
  assert.ok(entry.sceneOpacity > foreground.sceneOpacity);
  assert.ok(foreground.sceneOpacity < 0.35);
  assert.ok(settled.sceneOpacity >= 0.14);

  const reversedEntry = computeChapterStageMetrics(0.08, false);
  assert.deepEqual(reversedEntry, entry);
});

test('computeMaterialSampleState dismantles samples staggered across progress and restores on reverse scroll', () => {
  const startStates = Array.from({ length: 24 }, (_, idx) =>
    computeMaterialSampleState(idx, 24, 0, false)
  );
  assert.ok(startStates.every((s) => s.opacity === 1 && s.isInteractive));

  const midStates = Array.from({ length: 24 }, (_, idx) =>
    computeMaterialSampleState(idx, 24, 0.5, false)
  );
  const visibleCount = midStates.filter((s) => s.opacity > 0.85).length;
  const fadedCount = midStates.filter((s) => s.opacity < 0.15).length;
  assert.ok(visibleCount > 0 && visibleCount < 24);
  assert.ok(fadedCount > 0 && fadedCount < 24);

  const endStates = Array.from({ length: 24 }, (_, idx) =>
    computeMaterialSampleState(idx, 24, 0.96, false)
  );
  assert.ok(endStates.every((s) => s.opacity === 0 && !s.isInteractive));

  const reducedMid = computeMaterialSampleState(0, 24, 0.75, true);
  assert.equal(reducedMid.opacity, 1);
});

test('computeAboutRevealState stays subtle until late Material progress unless immediateReveal or reducedMotion', () => {
  const early = computeAboutRevealState(0.25, false, false);
  assert.equal(early.headingOpacity, 0);
  assert.equal(early.illustrationOpacity, 0);
  assert.equal(early.textOpacity, 0);
  assert.equal(early.isRevealed, false);

  const overlapping = computeAboutRevealState(0.75, false, false);
  assert.ok(overlapping.headingOpacity > 0.5);
  assert.ok(overlapping.illustrationOpacity > 0);

  const late = computeAboutRevealState(0.95, false, false);
  assert.equal(late.headingOpacity, 1);
  assert.equal(late.illustrationOpacity, 1);
  assert.equal(late.textOpacity, 1);
  assert.equal(late.isRevealed, true);

  const immediate = computeAboutRevealState(0, false, true);
  assert.equal(immediate.headingOpacity, 1);
  assert.equal(immediate.illustrationOpacity, 1);
  assert.equal(immediate.textOpacity, 1);
});

test('computeStarCompanionState keeps star in quiet gutter during scroll and centers inside white footer', () => {
  const mid = computeStarCompanionState(0.45, false, false);
  assert.ok(mid.xPercent >= 93);
  assert.equal(mid.settledInFooter, false);

  const docked = computeStarCompanionState(1, true, false);
  assert.equal(docked.xPercent, 50);
  assert.equal(docked.settledInFooter, true);
});
