"use strict"

import React, {Component, PropTypes} from 'react';
import {OrderedMap, Map} from 'immutable';
import ChinaData from '../data/geojson/0';
import ProvinceData from '../data/geojson/1';
import Popup from './core/Popup';
import SouthSea from './core/SouthSea';
import Legend from './core/Legend';
import PolygonSet from './PolygonSet';
import TextSet from './TextSet';
import ChinaGeoOpt from '../data/china';

export default class Maps extends Component {
  static contextTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired,
    mapName: React.PropTypes.string.isRequired,
    shootData: React.PropTypes.array,
    finish: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      showPopup: OrderedMap()
    }
  }

  _onMouseOver(that, d, id, xy) {

    const {
      showPopup
    } = this.state;

    const {
      onMouseOver
    } = this.props;

    const {
      projection
    } = this.context;

    if(onMouseOver)
      onMouseOver(that, d, id);

    let position = projection.invert([xy[0], xy[1]]);

    let newPopup = showPopup.set(id, Map({
      xPopup: position[0],
      yPopup: position[1],
      data: d
    }));

    this.setState({
      showPopup: newPopup
    })
  }

  _onMouseMove(that, d, id, xy) {

    const {
      showPopup
    } = this.state;

    const {
      onMouseMove
    } = this.props;

    const {
      projection
    } = this.context;

    if(onMouseMove)
      onMouseMove(that, d, id);

    let position = projection.invert([xy[0], xy[1]]);

    let newPopup = showPopup.set(id, Map({
      xPopup: position[0],
      yPopup: position[1],
      data: d
    }));

    this.setState({
      showPopup: newPopup
    })
  }

  _onMouseOut(that, d, id) {

    const {
      showPopup
    } = this.state;

    const {
      onMouseOut
    } = this.props;

    if(onMouseOut)
      onMouseOut(that, d, id);

    let newPopup = showPopup.delete(id);

    this.setState({
      showPopup: newPopup
    })
  }

  render() {

    const {
      showPopup
    } = this.state;

    const {
      data,
      defaultColor,
      hoverColor,
      colorArr,
      shootColor,
      type,
      hasLegend,
      legendText,
      hasName,
      popupContent,
      polygonClass,
      textClass
    } = this.props;

    const {
      width,
      height,
      finish,
      shootData,
      mapName,
      geoPath,
      projection
    } = this.context;

    let onMouseOver = this._onMouseOver.bind(this);

    let onMouseMove = this._onMouseMove.bind(this);

    let onMouseOut = this._onMouseOut.bind(this);

    let popup;

    let geoData;

    if (mapName === '中国') {
      geoData = ChinaData;
    } else {
      geoData = ProvinceData[mapName];
    }

    if(showPopup.size && popupContent) {
      popup = showPopup.keySeq().toArray().map((d, i) => {
        let xPopup = showPopup.get(d).get('xPopup');
        let yPopup = showPopup.get(d).get('yPopup');
        let popupData = showPopup.get(d).get('data');

        let point = projection([xPopup, yPopup])
        let content = popupContent(popupData.properties.name);

        if (content) {
          return  (
            <Popup
              key= {'Popup' + i}
              mapWidth= {width}
              mapHeight= {height}
              x= {point[0]}
              y= {point[1]}
              contentPopup={content}
            />
          )
        }
      })
    }

    return (
      <g className='Maps'>
        <PolygonSet
          className= 'PolygonSet'
          data= {data}
          shootData= {shootData}
          shootFinish= {finish}
          defaultColor= {defaultColor}
          hoverColor= {hoverColor}
          shootColor= {shootColor}
          colorArr= {colorArr}
          projection= {projection}
          geoData= {geoData}
          geoPath= {geoPath}
          onMouseOver= {onMouseOver}
          onMouseMove= {onMouseMove}
          onMouseOut= {onMouseOut}
          polygonClass= {polygonClass}
          {...this.state}
        />

        {hasLegend ?
          <Legend width= {width}
                  height= {height}
                  defaultColor= {defaultColor}
                  colorArr= {colorArr}
                  legendText= {legendText} /> :
          null
        }

        {mapName === '中国' ?
          <SouthSea width= {width} height= {height} defaultColor= {defaultColor} /> :
          null
        }

        {
          hasName ?
            <TextSet
              className= 'TextSet'
              projection= {projection}
              geoData= {geoData}
              textClass= {textClass}
              {...this.state}
            /> :
            null
        }

        {popup}
      </g>
    )
  }
}
