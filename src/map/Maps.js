"use strict"

import React, {Component, PropTypes} from 'react';
import {OrderedMap, Map} from 'immutable';
import PolygonSet from './PolygonSet';
import TextSet from './TextSet';
import Popup from './core/Popup';
import SouthSea from './core/SouthSea';
import Legend from './core/Legend';
import {formatName} from './utils/FormatHelper';
import ChinaGeoOpt from '../data/china';
import ChinaData from '../data/geojson/ChinaData';
import ProvinceData from '../data/geojson/ProvinceData';

export default class Maps extends Component {
  static propTypes = {
  };

  static contextTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired,
    mapName: React.PropTypes.string.isRequired,
    data: React.PropTypes.array,
    shootData: React.PropTypes.array,
    finish: React.PropTypes.bool,
    mapId: React.PropTypes.string,
  };

  static defaultProps = {
    nameKey: 'name',
    valueKey: 'value',
    hasName: false,
    hasLegend: false
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
      popupContent
    } = this.props;

    const {
      width,
      height,
      finish,
      shootData,
      mapName,
      geoPath,
      projection,
      mapId
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

        let currentData;

        data.forEach(item => {
          let tempName = formatName(item[nameKey]);

          if (tempName === popupData.properties.name) {
            currentData = item;
          }
        })

        let content = popupContent(currentData);

        if (content) {
          return  (
            <Popup
              key= {'Popup' + i}
              mapWidth= {width}
              mapHeight= {height}
              x= {point[0]}
              y= {point[1]}
              contentPopup= {content}
              mapId= {mapId}
            />
          )
        }
      })
    }

    return (
      <g className='Maps'>
        <PolygonSet
          className= 'PolygonSet'
          mapId= {mapId}
          data= {data ? data : []}
          nameKey= {nameKey}
          valueKey= {valueKey}
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
          {...this.state}
        />

        {hasLegend ?
          <Legend width= {width}
                  height= {height}
                  defaultColor= {defaultColor}
                  colorArr= {colorArr}
                  legendPos= {legendPos} /> :
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
              {...this.state}
            /> :
            null
        }

        {popup}
      </g>
    )
  }
}
