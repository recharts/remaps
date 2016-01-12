"use strict";

import React, {Component, PropTypes} from 'react';
import Popup from './Popup';
import {isTooltipUpdate} from './TooltipUpdate';

export default class Polygon extends Component {
  static propTypes = {
    color: PropTypes.string,
    onMouseOut: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseOver: PropTypes.func,
    geoData: PropTypes.object,
    geoPath: PropTypes.func,
  };

  constructor(props) {
    super (props);

    this.state = {
      fill: this.props.color
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isTooltipUpdate(nextProps, nextState, this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.color !== this.props.color) {
      this.setState({
        fill: nextProps.color
      });
    }
  }

  getOffset (el) {
    const box = el.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    }
  }

  handleMouseOver(d, e) {
    const {
      id,
      mapId,
      hoverColor,
      hasDefaultColor,
      onMouseOut,
      onMouseOver,
      onClick
    } = this.props;

    const mapContainer = document.getElementById(mapId);

    let xy = [e.clientX, e.pageY - this.getOffset(mapContainer).top];

    if (!hasDefaultColor) {
      this.setState({
        fill: hoverColor
      });
    }

    return onMouseOver(this, d, id, xy);
  }

  handleMouseMove(d, e) {
    const {
      id,
      mapId,
      onMouseMove
    } = this.props;

    const mapContainer = document.getElementById(mapId);

    let xy = [e.clientX, e.pageY - this.getOffset(mapContainer).top];

    return onMouseMove(this, d, id, xy);
  }

  handleMouseOut(d) {
    const {
      id,
      color,
      onMouseOut,
    } = this.props;

    this.setState({
      fill: color
    });

    return onMouseOut(this, d, id);
  }

  render () {
    const {
      id,
      color,
      geoData,
      geoPath,
      onMouseOut,
      onMouseOver,
    } = this.props;

    const {fill} = this.state;

    return <path d= {geoPath(geoData)}
                 fill= {fill}
                 stroke= {'#fff'}
                 strokeWidth= {'1'}
                 onMouseOver={this.handleMouseOver.bind(this, geoData)}
                 onMouseMove={this.handleMouseMove.bind(this, geoData)}
                 onMouseOut= {this.handleMouseOut.bind(this, geoData)} />
  }
}
