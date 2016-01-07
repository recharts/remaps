"use strict"

import React, {Component, PropTypes} from 'react';
import CommonProps from './CommonProps';
import Shoot from './Shoot';
import Container from './core/Container';
import {Projection as projectionFunc} from './core/Projection';
import {GeoPath} from './core/GeoPath';
import {TileFunc} from './core/TileFunc';
import ZoomControl from './core/ZoomControl';
import {formatName} from './utils/FormatHelper';
import ChinaGeoOpt from '../data/china';

export default class MapContainer extends Component {
  static childContextTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    geoPath: React.PropTypes.func,
    projection: React.PropTypes.func,
    mapName: React.PropTypes.string,
    shootData: React.PropTypes.array,
    finish: React.PropTypes.bool
  };

  static defaultProps = {
    width: 600,
    projection: 'mercator',
    mapName: '',
    simplify: true,
    simplifyArea: 0,
    hasShootLoop: false
  };

  constructor(props) {
    super(props);

    this.state = {
      mapName: formatName(props.mapName),
      // 移动
      zoomTranslate: null,
      // 比例尺-缩放
      scale: null,
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

  componentWillMount() {
    const {mapName} = this.state;

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
      let newMapName = formatName(nextProps.mapName);

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

  render() {
    const {
      mapName,
      scale,
      zoomTranslate,
      finish
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
      shootDuration
    } = this.props;

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
        <div id="mapContainer" className={className} style= {styleContainer}>
          <p className="Warning" style= {styleWarning}>目前暂只支持中国以及中国各省份的地图！</p>
        </div>
      )
    }

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
      center: center,
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

    return (
      <div id="mapContainer" className={className} style= {styleContainer}>
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
            hasShootLoop= {hasShootLoop}
            shootDuration= {shootDuration}
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
