"use strict";

import d3 from 'd3';

export function GeoPath(proj, props) {
  props = props || {}

  const {
    pointRadius
  } = props;

  const geoPath = d3.geo.path();

  geoPath.projection(proj);

  if(pointRadius)
    geoPath.pointRadius(pointRadius)

  return geoPath;
}
