"use strict";

import React, {Component, PropTypes} from 'react';
import {OrderedMap, Map} from 'immutable';
import Popup from './Popup';
import {isTooltipUpdate} from './TooltipUpdate';

export default class Polygon extends Component {
  static propTypes = {
    color: PropTypes.string,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    geoData: PropTypes.object,
    geoPath: PropTypes.func,
    // onClick
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

  handleMouseOver(d, e) {
    const {
      id,
      hoverColor,
      onMouseOut,
      onMouseOver,
      onClick
    } = this.props;

    let xy = [e.clientX, e.clientY];

    this.setState({
      fill: hoverColor
    });

    return onMouseOver(this, d, id, xy);
  }

  handleMouseMove = (d, e) => {
    const {
      id,
      onMouseMove
    } = this.props;

    let xy = [e.clientX, e.clientY];

    return onMouseMove(this, d, id, xy);
  }

  handleMouseOut = (d) => {
    const {
      id,
      color,
      onMouseOut,
      // onClick
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
      // onClick
    } = this.props;

    const {fill} = this.state;

    return <path d= {geoPath(geoData)}
                 fill= {fill}
                 stroke= {'#fff'}
                 strokeWidth= {'1'}
                 onMouseOver={this.handleMouseOver.bind(this, geoData)}
                 // onMouseMove={this.handleMouseMove.bind(this, geoData)}
                 onMouseOut= {this.handleMouseOut.bind(this, geoData)} />
  }
}
