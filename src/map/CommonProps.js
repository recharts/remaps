"use strict";

export default {
  width: 960,
  height: 600,
  projection: 'mercator',
  // projection: 'albers',
  simplify: true,
  simplifyArea: 0,
  scale: 1 << 12,
  scaleExtent: [1 << 10, 1 << 14],
}
