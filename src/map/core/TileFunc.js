"use strict";

import {tile} from './d3.geo.tile.js';

export function TileFunc (props) {
  const {
    scale,
    translate,
    size,
    zoomDelta
  } = props;

  let tileFunc;

  tileFunc = tile()

  if(scale) tileFunc.scale(scale);
  if(translate) tileFunc.translate(translate);
  if(size) tileFunc.size(size);
  if(zoomDelta) tileFunc.zoomDelta(zoomDelta);

  return tileFunc();
}
