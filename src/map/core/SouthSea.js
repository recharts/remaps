"use strict";

import React, {Component, PropTypes} from 'react';

export default class SouthSea extends Component {
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
      <g className="southsea" transform={"translate(" + (width - 90) + ", " + (height - 110) + ") scale(0.4, 0.4)"}>
        <line strokeWidth={'3px'} stroke={defaultColor} y2="7" x2="145" y1="7" x1="20" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="24" x2="6" y1="7" x1="20" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="195" x2="145" y1="7" x1="145" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="195" x2="6" y1="24" x1="6" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="195" x2="145" y1="195" x1="6" />

        <path fill={defaultColor} stroke={defaultColor} d="M6 31.5 l9 7.5 l15 9 l15 4 l18 0 l17 -14 l21 -31 L20 7 L6 24 Z" />
        <path fill={defaultColor} stroke={defaultColor} d="M113 7 l10 25 l11 -25 z" />
        <path fill={defaultColor} stroke={defaultColor} d="M46.5 66.5 l14.5 -6.5 l-1 13 l-7 7 l-15 4 l8.5 -17.5 z" />

        <line strokeWidth={'3px'} stroke={defaultColor} y2="46.5" x2="132.5" y1="31.5" x1="141.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="76.5" x2="115.5" y1="61.5" x1="121.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="111.5" x2="110.5" y1="92.5" x1="110.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="147.5" x2="101.5" y1="127.5" x1="108.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="177.5" x2="78.5" y1="163.5" x1="91.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="188.5" x2="39.5" y1="184.5" x1="54.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="158.5" x2="11.5" y1="172.5" x1="17.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="132.5" x2="39.5" y1="142.5" x1="24.5" />
        <line strokeWidth={'3px'} stroke={defaultColor} y2="98.5" x2="37.5" y1="113.5" x1="40.5" />

        <text x="15" y="130" fill={defaultColor}>南海诸岛</text>
       </g>
    )
  }
}
