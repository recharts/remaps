"use strict"

import React, {Component, PropTypes} from 'react';
import Polygon from './core/Polygon';
import {formatName} from './utils/FormatHelper';

export default class PolygonSet extends Component {
  constructor(props) {
    super(props);
  }

  // formatName(name, regionType) {
  //   var result,

  //     // 根据地区缩写返回hash中key对应的值
  //     search = function (regionType, name) {
  //       var shortName = name.substr(0, 2);

  //       if (regionType === 'province') {
  //         // 内蒙古，黑龙江
  //         if (shortName === '内蒙' || shortName === '黑龙') {
  //           shortName = name.substr(0, 3);
  //         }
  //       }

  //       if (regionType === 'city') {
  //         //prevent duplicate，张家口市,张家界市，阿拉善盟, 阿拉尔市
  //         if (shortName === '阿拉' || shortName === '张家') {
  //           shortName = name.substr(0, 3);
  //         }
  //       }

  //       // if (typeof result === 'undefined') {
  //       //   return undefined;
  //       // }

  //       return shortName;
  //     };


  //   // 如果regionType省略，先找省，再找市
  //   if (typeof regionType === 'undefined') {
  //     if (name === '吉林市' || name === '海南藏族自治州') {
  //       // 这两个市和省重名，所以要加特殊处理
  //       //吉林省， 吉林市； 海南省，海南藏族自治州
  //       result = search('city', name);
  //     } else {
  //       result = search('province', name) || search('city', name);
  //     }
  //   } else {
  //     if (regionType === 'province') {
  //       //province
  //       result = search('province', name);
  //     } else if (regionType === 'city') {
  //       //city
  //       result = search('city', name);
  //     }
  //   }

  //   return result;
  // }

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
          data.forEach(item => {
            let tempName = formatName(item[nameKey]);

            if (tempName === d.properties.name) {
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
            let name = formatName(item[nameKey]);

            if (name === d.properties.name) {
              hasDefaultColor = false;
              temp = Math.floor((colorArr.length - 1) * (item[valueKey] - minData) / (maxData - minData));
              color = colorArr[temp];

              if (maxData === minData)
                color = colorArr[0];
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
