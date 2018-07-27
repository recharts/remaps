"use strict"

import React, { Component, PropTypes } from 'react';
import PolygonSet from './PolygonSet';
import TextSet from './TextSet';
import SouthSea from './core/SouthSea';
import Taiwan from './core/Taiwan';
import Legend from './core/Legend';

export default class Maps extends Component {
  static propTypes = {
  };

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
      colorArr,
      shootColor,
      type,
      hasLegend,
      legendPos,
      legendOrder,
      hasName,
      popupContent,
      zoom,

      width,
      height,
      finish,
      shootData,
      mapName,
      geoPath,
      geoData,
      projection,

      onMouseOver,
      onMouseMove,
      onMouseOut,
      onClick,
      // 是否严格按照颜色排序
      sortableColor
    } = this.props;

    if (!geoData) {
      return null;
    }

    return (
      <g className='Maps'>
        <PolygonSet
          className='PolygonSet'
          mapName={mapName}
          data={data ? data : []}
          nameKey={nameKey}
          valueKey={valueKey}
          shootData={shootData}
          shootFinish={finish}
          defaultColor={defaultColor}
          hoverColor={hoverColor}
          shootColor={shootColor}
          colorArr={colorArr}
          projection={projection}
          geoData={geoData}
          geoPath={geoPath}
          onMouseOver={onMouseOver}
          onMouseMove={onMouseMove}
          onMouseOut={onMouseOut}
          onClick={onClick}
          sortableColor={sortableColor}
          {...this.state}
        />

        {hasLegend ?
          <Legend
            width={width}
            height={height}
            defaultColor={defaultColor}
            colorArr={colorArr}
            legendPos={legendPos}
            legendOrder={legendOrder}
          /> :
          null
        }

        {
          // 台湾诸岛，钓鱼岛和赤尾屿，且在无法缩放时才展示，如果地图有缩放功能时，可以通过放大查看
          mapName === '中国' && !zoom ?
            <Taiwan width={width} height={height} defaultColor={defaultColor} /> :
            null
        }

        {
          // 南海诸岛
          mapName === '中国' ?
            <SouthSea width={width} height={height} defaultColor={defaultColor} /> :
            null
        }

        {
          hasName ?
            <TextSet
              className='TextSet'
              projection={projection}
              geoData={geoData}
              {...this.state}
            /> :
            null
        }
      </g>
    )
  }
}
