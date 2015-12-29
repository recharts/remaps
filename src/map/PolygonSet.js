"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  default as Polygon,
} from './core/Polygon';

export default class PolygonCollection extends Component {

  render() {
    const {
      data,
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
      polygonClass,
      shootFinish,
      shootData
    } = this.props;

    let tempDataArr = [];
    let polygons, polygonData, maxData, minData, color, temp;

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

      maxData = polygonData.map((d, i) => {
        if (data[d.properties.name]) {
          tempDataArr.push(data[d.properties.name].value);
        }

        return tempDataArr;
      })

      maxData = Math.max.apply(null, tempDataArr);
      minData = Math.min.apply(null, tempDataArr);

      polygons = polygonData.map((d, i) => {
        let oldColor;

        if (data[d.properties.name]) {
          temp = Math.floor((colorArr.length - 1) * (data[d.properties.name].value - minData) / (maxData - minData));
          color = colorArr[temp];
        } else {
          color = defaultColor;
        }

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
            id= {'remaps__polygon' + i}
            key= {'remaps__polygon' + i}
            color= {color}
            hoverColor= {hoverColor}
            projection= {projection}
            geoData= {d}
            geoPath= {geoPath}
            onClick= {onClick}
            onMouseOver= {onMouseOver}
            onMouseMove= {onMouseMove}
            onMouseOut= {onMouseOut}
            polygonClass= {polygonClass}
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
