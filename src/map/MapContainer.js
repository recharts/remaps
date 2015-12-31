"use strict"

import React, {Component, PropTypes} from 'react';
import Container from './core/Container';
import {Projection as projectionFunc} from './core/Projection';
import {GeoPath} from './core/GeoPath';
import {TileFunc} from './core/TileFunc';
import ZoomControl from './core/ZoomControl';
import CommonProps from './CommonProps';
import ChinaGeoOpt from '../data/china';
import Shoot from './Shoot';

export default class MapContainer extends Component {
  static childContextTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    geoPath: React.PropTypes.func,
    projection: React.PropTypes.func,
    mapName: React.PropTypes.string,
    shootData: React.PropTypes.array,
    finish: React.PropTypes.bool
  }

  static defaultProps = CommonProps;

  constructor(props) {
    super(props);

    this.state = {
      // 移动
      zoomTranslate: null,
      // 比例尺-缩放
      scale: this.props.width * ChinaGeoOpt.provinceIndex[this.props.mapName].scale / 600,
      // 缩放频率
      times: 1,
      finish: false
    };
  }

  getChildContext() {
    return {
      width: this.width,
      height: this.height,
      finish: this.finish,
      shootData: this.shootData,
      geoPath: this.geoPath,
      projection: this.projection,
      mapName: this.mapName
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapName !== this.props.mapName) {
      this.setState({
        scale: this.props.width * ChinaGeoOpt.provinceIndex[nextProps.mapName].scale / 600
      });
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

  render() {
    const {
      scale,
      zoomTranslate,
      finish
    } = this.state;

    const {
      width,
      zoom,
      mapName,
      projection,
      simplify,
      simplifyArea,
      clip,
      bounds,
      data,
      shootData,
      popupContent
    } = this.props;

    let height = width * 3 / 4;

    const center = ChinaGeoOpt.provinceIndex[mapName].center;

    let onZoom = this.onZoom.bind(this);
    let zoomIn = this.zoomIn.bind(this);
    let zoomOut = this.zoomOut.bind(this);
    let handleFinish = this.handleFinish.bind(this);

    // 初始地图位置
    let translate = [width / 2, height / 2] || this.props.translate;

    let proj = projectionFunc({
      projection: projection,
      scale: scale / 2 / Math.PI,
      translate: zoomTranslate || translate,
      center: ChinaGeoOpt.provinceIndex[mapName].center,
      simplify: simplify,
      simplifyArea: simplifyArea,
      clip: clip,
      bounds: bounds
    });

    let geo = GeoPath(proj);
    this.projection = proj;
    this.geoPath = geo;
    this.mapName = mapName;

    if (shootData) {
      this.shootData = shootData;
    } else {
      this.shootData = [];
    }

    this.finish = finish;
    this.width = width;
    this.height = height;

    let styleContainer = {
      position: 'relative',
      border: '1px solid #000',
      backgroundColor: '#fff',
      width: width
    }

    return (
      <div id="mapContainer" style= {styleContainer}>
        <Container
          {...this.props}
          width= {width}
          height= {height}
          projection = {proj}
          onZoom= {zoom ? onZoom : null}
          center= {center}
        >
        </Container>

        {zoom ?
          <ZoomControl
            zoomInClick= {zoomIn}
            zoomOutClick= {zoomOut}
          /> : null
        }

        {shootData ?
          <Shoot
            width= {width}
            height= {height}
            mapName= {mapName}
            shootData= {shootData}
            projection= {proj}
            shootFinish= {handleFinish}
            ChinaGeoOpt= {ChinaGeoOpt}
          /> :
          null
        }
      </div>
    )
  }
}
