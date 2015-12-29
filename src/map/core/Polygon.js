"use strict";

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import d3 from 'd3';

import {
  isTooltipUpdate
} from './TooltipUpdate';

import {
  OrderedMap,
  Map
} from 'immutable';

import {
  default as Popup,
} from './Popup';


export default class Polygon extends Component {
  constructor(props) {
    super (props);

    this.state = {
      fill: this.props.color
    }
  }

  static defaultProps = {
    polygonClass: 'remaps-core__polygon'
  }

  static propTypes = {
    geoData: PropTypes.object.isRequired,
    geoPath: PropTypes.func.isRequired,
    polygonClass: PropTypes.string
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

  handleMouseOver = (d, e) => {
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
      onMouseOver,
      onClick
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
      polygonClass,
      geoPath,
      projection,
      onMouseOut,
      onMouseOver,
      onClick
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
