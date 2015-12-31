"use strict";

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import d3 from 'd3';
import CommonProps from '../CommonProps';

export default class Svg extends Component {
  static propTypes = {
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    svgClassName: PropTypes.string
  };

  static defaultProps = Object.assign(CommonProps, {
    svgClassName: 'remaps-core__container_svg',
    scaleExtent: [1 << 12, 1 << 28]
  });

  constructor(props) {
    super (props);
  }

  componentDidMount() {
    const {
      width,
      height,
      scaleExtent,
      projection,
      onZoom,
      onZoomStart,
      onZoomEnd,
      center
    } = this.props;


    // implement zoom if xscale and y scale is set!
    if(projection && onZoom) {
      let center = projection(center);

      let zoom = d3.behavior.zoom()
        .scale(projection.scale() * 2 * Math.PI)
        .translate([width - center[0], height - center[1]])

      if(scaleExtent)
        zoom.scaleExtent(scaleExtent);

      if(onZoom)
        zoom.on("zoom", () => { onZoom.call(this, zoom.scale(), zoom.translate()) });

      if(onZoomStart)
        zoom.on("zoomstart", () => { onZoomStart.call(this, zoom.scale(), zoom.translate()) });

      if(onZoomEnd)
        zoom.on("zoomend", () => { onZoomEnd.call(this, zoom.scale(), zoom.translate()) });

      d3.select(ReactDOM.findDOMNode(this.refs.svgContainer))
        .call(zoom);
    }
  }

  render() {
    const {
      height,
      width,
      svgClassName,
      id,
      children
    } = this.props;

    return (
      <svg
        height = {height}
        width = {width}
        className = {svgClassName}
        ref = "svgContainer"
      >
        <g>
          {children}
        </g>
      </svg>
    )
  }
}
