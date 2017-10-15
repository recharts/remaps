"use strict"

import React, { Component, PropTypes } from 'react';
import Polygon from './core/Polygon';
import { formatName } from './utils/FormatHelper';

export default class PolygonSet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mapName,
      data,
      nameKey,
      valueKey,
      defaultColor,
      hoverColor,
      shootColor,
      colorArr,
      geoData,
      geoPath,
      projection,
      onClick,
      onMouseOver,
      onMouseMove,
      onMouseOut,
      shootFinish,
      shootData,
      sortableColor
    } = this.props;

    let tempDataArr = [];
    let polygons, polygonData, maxData, minData, color, temp;
    let hasDefaultColor;

    if (geoData.type === 'FeatureCollection') {
      polygonData = [];

      // 遍历 features
      geoData.features.forEach(function (d) {
        polygonData.push(d);
      })
    } else if (geoData.type === 'Feature') {
      polygonData = geoData;
    }

    if (polygonData) {
      // 如果不是数组，将其转换成数组
      if (!Array.isArray(polygonData))
        polygonData = [polygonData];

      if (data.length > 0) {
        maxData = polygonData.map((d, i) => {
          data.forEach(item => {
            let tempName = formatName(item[nameKey], mapName);

            if (tempName === formatName(d.properties.name, mapName)) {
              tempDataArr.push(item[valueKey]);
            }
          })

          return tempDataArr;
        })

        maxData = Math.max.apply(null, tempDataArr);
        minData = Math.min.apply(null, tempDataArr);
      }

      polygons = polygonData.map((d, i) => {
        let oldColor;

        hasDefaultColor = true;

        if (data.length > 0) {
          data.map((item, dataIndex) => {
            let name = formatName(item[nameKey], mapName);

            if (name === formatName(d.properties.name, mapName)) {
              hasDefaultColor = false;
              temp = Math.floor((colorArr.length - 1) * (item[valueKey] - minData) / (maxData - minData));

              if (sortableColor) {
                color = colorArr[dataIndex] || defaultColor;
              } else {
                color = colorArr[temp];
              }

              if (maxData === minData)
                color = colorArr[0];

              if (item[valueKey] <= 0)
                color = defaultColor;
            }
          })
        }

        if (!color) {
          color = defaultColor;
        }

        if (hasDefaultColor) {
          color = defaultColor;
        }

        oldColor = color;

        if (shootFinish) {
          color = oldColor;
        } else {
          for (let i = 0; i < shootData.length; i++) {
            if (formatName(d.properties.name, mapName) === formatName(shootData[i].from, mapName) || formatName(d.properties.name, mapName) === formatName(shootData[i].to, mapName)) {
              color = shootColor;
            }
          }
        }

        return (
          <Polygon
            key={'remaps_polygon' + i}
            color={color}
            hasDefaultColor={hasDefaultColor}
            hoverColor={hoverColor}
            projection={projection}
            geoData={d}
            geoPath={geoPath}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
          />
        )
      })
    }

    return (
      <g>
        {polygons}
      </g>
    )
  }
}
