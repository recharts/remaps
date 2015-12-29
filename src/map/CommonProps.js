"use strict";

export default {
  width: 960,
  height: 600,
  projection: 'mercator',
  // projection: 'albers',
  simplify: true,
  simplifyArea: 0,
  scale: 1 << 12,
  // scale: 960,
  scaleExtent: [1 << 10, 1 << 14],
  // center: [114.2578, 22.3242],
  // center: [105.2578, 35.3242],
}
