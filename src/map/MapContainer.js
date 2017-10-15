"use strict"

import React, { Component, PropTypes } from 'react';
import Maps from './Maps';
import CommonProps from './CommonProps';
import Shoot from './Shoot';
import Container from './core/Container';
import { Projection as projectionFunc } from './core/Projection';
import { GeoPath } from './core/GeoPath';
import ZoomControl from './core/ZoomControl';
import { formatName, formatProvinceName } from './utils/FormatHelper';
import Popup from './core/Popup';
import { OrderedMap, Map } from 'immutable';
import ChinaGeoOpt from '../data/china';
// import ChinaData from '../data/geojson/ChinaData';
// import ProvinceData from '../data/geojson/ProvinceData';
// import { ChinaData, ProvinceData } from 'china-map-geojson';
// import WorldData from 'world-map-geojson';

export default class MapContainer extends Component {

  static defaultProps = {
    width: 600,
    projection: 'mercator',
    mapName: '',
    simplify: true,
    simplifyArea: 0,
    hasShootLoop: false,
    nameKey: 'name',
    valueKey: 'value',
    hasName: false,
    hasLegend: false,
    shootColor: '#FCE687',
    hoverColor: '#86C899',
    // 是否严格按照颜色排序
    sortableColor: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      mapName: formatName(props.mapName, props.mapName),
      // 移动
      zoomTranslate: null,
      // 比例尺-缩放
      scale: null,
      // 缩放频率
      times: 1,
      finish: false,
      showPopup: OrderedMap()
    };
  }

  componentWillMount() {
    const { mapName } = this.state;

    if (ChinaGeoOpt.provinceIndex[mapName]) {
      this.setState({
        scale: this.props.width * ChinaGeoOpt.provinceIndex[mapName].scale / 600,
      });
    } else {
      this.setState({
        scale: null
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapName !== this.props.mapName) {
      let newMapName = formatName(nextProps.mapName, nextProps.mapName);

      if (ChinaGeoOpt.provinceIndex[newMapName]) {
        this.setState({
          mapName: newMapName,
          scale: this.props.width * ChinaGeoOpt.provinceIndex[newMapName].scale / 600,
        });
      } else {
        this.setState({
          mapName: '',
          scale: null
        });
      }
    }
  }

  onZoom(zoomScale, zoomTranslate) {
    let times = this.state.times;

    this.setState({
      scale: zoomScale * times,
      zoomTranslate: zoomTranslate
    })
  }

  zoomIn() {
    let times = this.state.times;

    this.setState({
      times: times * 2,
      scale: this.state.scale * 2,
    })
  }

  zoomOut() {
    let times = this.state.times;

    this.setState({
      times: times / 2,
      scale: this.state.scale / 2,
    })
  }

  handleFinish(finish) {
    this.setState({
      finish: finish
    })
  }

  getOffset(el) {
    const box = el.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    }
  }

  getCurrentData(data) {
    const { mapName } = this.state;
    const {
      extData,
      nameKey
    } = this.props;

    let currentData;

    extData.forEach(item => {
      let tempName = formatName(item[nameKey], mapName);

      if (tempName === formatName(data.properties.name, mapName)) {
        currentData = item;
      }
    });

    return currentData;
  }

  _onClick(that, data, id, e) {
    const {
      extData,
      nameKey,
      onClick
    } = this.props;

    if (onClick) {
      const currentData = this.getCurrentData(data);
      onClick(currentData, data.properties, e);
    }
  }

  _onMouseOver(that, d, id, e) {
    const {
      showPopup
    } = this.state;

    const {
      onMouseOver
    } = this.props;

    if (onMouseOver) {
      const currentData = this.getCurrentData(d);
      onMouseOver(currentData, d.properties, e);
    }

    const mapContainer = this.refs.mapContainer;

    let xy = [e.pageX - this.getOffset(mapContainer).left, e.pageY - this.getOffset(mapContainer).top];

    let position = this.projection.invert([xy[0], xy[1]]);

    let newPopup = showPopup.set(id, Map({
      xPopup: position[0],
      yPopup: position[1],
      data: d
    }));

    this.setState({
      showPopup: newPopup
    })
  }

  _onMouseMove(that, d, id, e) {
    const {
      showPopup
    } = this.state;

    const {
      onMouseMove
    } = this.props;

    if (onMouseMove) {
      const currentData = this.getCurrentData(d);
      onMouseMove(currentData, d.properties, e);
    }

    const mapContainer = this.refs.mapContainer;

    let xy = [e.pageX - this.getOffset(mapContainer).left, e.pageY - this.getOffset(mapContainer).top];

    let position = this.projection.invert([xy[0], xy[1]]);

    let newPopup = showPopup.set(id, Map({
      xPopup: position[0],
      yPopup: position[1],
      data: d
    }));

    this.setState({
      showPopup: newPopup
    })
  }

  _onMouseOut(that, d, id, e) {
    const {
      showPopup
    } = this.state;

    const {
      onMouseOut
    } = this.props;

    if (onMouseOut) {
      const currentData = this.getCurrentData(d);
      onMouseOut(currentData, d.properties, e);
    }

    let newPopup = showPopup.delete(id);

    this.setState({
      showPopup: newPopup
    })
  }

  render() {
    const {
      mapName,
      scale,
      zoomTranslate,
      finish,
      showPopup
    } = this.state;

    const {
      className,
      width,
      zoom,
      projection,
      simplify,
      simplifyArea,
      clip,
      bounds,
      data,
      shootData,
      hasShootLoop,
      shootDuration,
      extData,
      nameKey,
      valueKey,
      colorArr,
      defaultColor,
      shootColor,
      hoverColor,
      hasLegend,
      legendPos,
      hasName,
      popupContent,
      sortableColor
    } = this.props;

    const center = ChinaGeoOpt.provinceIndex[mapName].center;

    let popup, geoData;
    let height = width * 3 / 4;
    let styleContainer = {
      position: 'relative',
      width: width,
      height: height
    };
    let styleWarning = {
      position: 'absolute',
      top: height / 2 - 25,
      left: width / 2 - 150,
    }

    if (!scale) {
      return (
        <div ref="mapContainer" className={className} style={styleContainer}>
          <p className="Warning" style={styleWarning}>目前暂只支持中国以及中国各省份的地图！</p>
        </div>
      )
    }

    let onZoom = this.onZoom.bind(this);
    let zoomIn = this.zoomIn.bind(this);
    let zoomOut = this.zoomOut.bind(this);
    let handleFinish = this.handleFinish.bind(this);
    let onMouseOver = this._onMouseOver.bind(this);
    let onMouseMove = this._onMouseMove.bind(this);
    let onMouseOut = this._onMouseOut.bind(this);
    let onClick = this._onClick.bind(this);

    // 初始地图位置
    let translate = [width / 2, height / 2] || this.props.translate;

    let proj = projectionFunc({
      projection: projection,
      scale: scale / 2 / Math.PI,
      translate: zoomTranslate || translate,
      center: center,
      simplify: simplify,
      simplifyArea: simplifyArea,
      clip: clip,
      bounds: bounds
    });

    if (mapName === '世界') {
      geoData = this.props.geoData;
    } else if (mapName === '中国') {
      geoData = this.props.geoData;
    } else {
      const provinceName = formatProvinceName(mapName);
      geoData = provinceName ? this.props.geoData[provinceName] : null;
    }

    let geo = GeoPath(proj);

    this.projection = proj;

    if (showPopup.size && popupContent) {
      popup = showPopup.keySeq().toArray().map((d, i) => {
        let xPopup = showPopup.get(d).get('xPopup');
        let yPopup = showPopup.get(d).get('yPopup');
        let popupData = showPopup.get(d).get('data');

        let point = proj([xPopup, yPopup])

        let currentData;

        extData.forEach(item => {
          let tempName = formatName(item[nameKey], mapName);

          if (tempName === formatName(popupData.properties.name, mapName)) {
            currentData = item;
          }
        })

        let content = popupContent(currentData);

        if (content) {
          return (
            <Popup
              key={'Popup' + i}
              x={point[0]}
              y={point[1]}
              contentPopup={content}
            />
          )
        }
      })
    }

    return (
      <div ref="mapContainer" className={className} style={styleContainer}>
        <Container
          {...this.props}
          width={width}
          height={height}
          projection={proj}
          onZoom={zoom ? onZoom : null}
          center={center}
        >
          <Maps
            width={width}
            height={height}
            data={extData}
            nameKey={nameKey}
            valueKey={valueKey}
            colorArr={colorArr}
            defaultColor={defaultColor}
            shootColor={shootColor}
            hoverColor={hoverColor}
            hasLegend={hasLegend}
            legendPos={legendPos}
            hasName={hasName}
            popupContent={popupContent}
            finish={finish}
            shootData={shootData || []}
            mapName={mapName}
            geoPath={geo}
            geoData={geoData}
            projection={proj}
            onMouseOver={onMouseOver}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            onClick={onClick}
            sortableColor={sortableColor}
          />
        </Container>

        {zoom ?
          <ZoomControl
            zoomInClick={zoomIn}
            zoomOutClick={zoomOut}
          /> : null
        }

        {shootData ?
          <Shoot
            width={width}
            height={height}
            mapName={mapName}
            shootData={shootData}
            hasShootLoop={hasShootLoop}
            shootDuration={shootDuration}
            projection={proj}
            shootFinish={handleFinish}
            ChinaGeoOpt={ChinaGeoOpt}
          /> :
          null
        }
        {popup}
      </div>
    )
  }
}
