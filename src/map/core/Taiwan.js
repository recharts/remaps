"use strict";

import React, {Component, PropTypes} from 'react';

export default class Taiwan extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    defaultColor: PropTypes.string
  };

  constructor(props) {
    super (props);
  }

  render () {
    const {
      width,
      height,
      defaultColor,
    } = this.props;

    return (
      <g className="taiwan" transform={"translate(" + (width * 0.9 - 200) + ", " + (width / 2 - 10) + ") scale(1, 1)"} fill={defaultColor}>
        <line strokeWidth={'1px'} stroke={defaultColor} y2="31.5" x2="139" y1="31.5" x1="142" />
        <line strokeWidth={'1px'} stroke={defaultColor} y2="29" x2="155" y1="29" x1="158" />
      </g>
    )
  }
}
