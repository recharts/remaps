"use strict"

import React, {Component, PropTypes} from 'react';
import Polygon from './core/Polygon';

export default class PolygonSet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
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
      // onMouseMove,
      onMouseOut,
      shootFinish,
      shootData
    } = this.props;

    let tempDataArr = [];
    let polygons, polygonData, maxData, minData, color, temp;
    let hasDefaultColor = true;

    if(geoData.type === 'FeatureCollection') {
      polygonData = [];

      // 遍历 features
      geoData.features.forEach(function(d) {
        polygonData.push(d);
      })
    }else if(geoData.type === 'Feature') {
      polygonData = geoData;
    }

    if(polygonData) {
      // 如果不是数组，将其转换成数组
      if(!Array.isArray(polygonData))
        polygonData = [polygonData];

      if (data.length > 0) {
        maxData = polygonData.map((d, i) => {
          data.forEach(function(item) {
            if (item[nameKey] === d.properties.name) {
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

        if (data.length > 0) {
          data.map(item => {
            if (item[nameKey] === d.properties.name) {
              hasDefaultColor = false;
              temp = Math.floor((colorArr.length - 1) * (item[valueKey] - minData) / (maxData - minData));
              color = colorArr[temp];
            }
          })
        }

        if (!color) {
          color = defaultColor;
        }

        if (hasDefaultColor) {
          color = defaultColor;
        }

        hasDefaultColor = true;

        oldColor = color;

        if (shootFinish) {
          color = oldColor;
        } else {
          for (let i = 0; i < shootData.length; i ++) {
            if (d.properties.name === shootData[i].from || d.properties.name === shootData[i].to) {
              color = shootColor;
            }
          }
        }

        return (
          <Polygon
            key= {'remaps_polygon' + i}
            color= {color}
            hoverColor= {hoverColor}
            projection= {projection}
            geoData= {d}
            geoPath= {geoPath}
            onClick= {onClick}
            onMouseOver= {onMouseOver}
            // onMouseMove= {onMouseMove}
            onMouseOut= {onMouseOut}
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
