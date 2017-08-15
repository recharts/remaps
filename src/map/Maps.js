"use strict"

import React, { Component, PropTypes } from 'react';
import PolygonSet from './PolygonSet';
import TextSet from './TextSet';
import SouthSea from './core/SouthSea';
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
      hasName,
      popupContent,

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

    return (
      <g className='Maps'>
        <PolygonSet
          className='PolygonSet'
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
          <Legend width={width}
            height={height}
            defaultColor={defaultColor}
            colorArr={colorArr}
            legendPos={legendPos} /> :
          null
        }

        {mapName === '中国' ?
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
