"use strict";

import React, {Component, PropTypes} from 'react';

export default class Legend extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    defaultColor: PropTypes.string,
    colorArr: PropTypes.array,
    legendPos: PropTypes.array
  };

  constructor(props) {
    super (props);
  }

  render () {
    const {
      width,
      height,
      colorArr,
      defaultColor,
      legendPos
    } = this.props;

    let legendWidth, legendX, legendY;

    if (legendPos) {
      legendX = legendPos[0];
      legendY = legendPos[1];
    } else {
      legendX = 50;
      legendY = 50;
    }

    let legends = colorArr.map((d, i) => {
      legendWidth = i * 20;

      return (
        <rect key={'legend' + i} width="20" height="15" fill={d}
              transform={"translate(" + (legendX + i * 20) + "," + (height - legendY) + ")"} />
      )
    })

    return (
      <g clsssName="legends">
        <text fill={defaultColor} transform={"translate(" + (legendX - 25) + "," + (height - legendY + 12) + ")"}>低</text>
        {legends}
        <text fill={defaultColor} transform={"translate(" + (legendX + 25 + legendWidth) + "," + (height - legendY + 12) + ")"}>高</text>
      </g>
    )
  }
}
