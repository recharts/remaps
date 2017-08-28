"use strict";

import { GeoTile } from './GeoTile.js';

export function TileFunc (props) {
  const {
    scale,
    translate,
    size,
    zoomDelta
  } = props;

  let tileFunc;

  tileFunc = GeoTile()

  if(scale) tileFunc.scale(scale);
  if(translate) tileFunc.translate(translate);
  if(size) tileFunc.size(size);
  if(zoomDelta) tileFunc.zoomDelta(zoomDelta);

  return tileFunc();
}
