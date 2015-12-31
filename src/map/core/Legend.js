"use strict";

import React, {Component, PropTypes} from 'react';

export default class Legend extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    legendText: PropTypes.string,
    defaultColor: PropTypes.string,
    colorArr: PropTypes.array,
  };

  constructor(props) {
    super (props);
  }

  render () {
    const {
      width,
      height,
      colorArr,
      legendText,
      defaultColor,
    } = this.props;

    let legendWidth;

    let legends = colorArr.map((d, i) => {
      legendWidth = i * 20;

      return (
        <rect key={'legend' + i} width="20" height="15" fill={d}
              transform={"translate(" + (50 + i * 20) + "," + (height - 50) + ")"} />
      )
    })

    return (
      <g id="legends">
        <text fill={defaultColor} transform={"translate(25," + (height - 38) + ")"}>低</text>
        {legends}
        <text fill={defaultColor} transform={"translate(" + (75 + legendWidth) + "," + (height - 38) + ")"}>高</text>
        {legendText ?
          <text fill={defaultColor} transform={"translate(25," + (height - 15) + ")"}>{legendText}</text> :
          null
        }
      </g>
    )
  }
}
