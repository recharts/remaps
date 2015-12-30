// 地图组件

import MapContainer from './map/MapContainer';

import {
  default as PolygonSet
} from './map/PolygonSet';

import {
  default as Maps
} from './map/Maps';

import {
  default as Svg,
} from './map/core/Svg';

import {
  default as Title,
} from './map/core/Title';

import {
  default as Container,
} from './map/core/Container';

// core

import {
  default as Polygon,
} from './map/core/Polygon';

import {
  default as Popup
} from './map/core/Popup';

import {
  default as ZoomControl
} from './map/core/ZoomControl';

// Function

import {
  geoPath
} from './map/core/GeoPath';

import {
  projection
} from './map/core/Projection';

import {
  scale
} from './map/core/Scale';

import {
  isTooltipUpdate
} from './map/core/TooltipUpdate';

import {
  tileFunc
} from './map/core/TileFunc';

export default {

  MapContainer, PolygonSet, Maps,

  Svg, Title, Container, Polygon, Popup, ZoomControl, geoPath, projection,

  tileFunc, scale, isTooltipUpdate
};
