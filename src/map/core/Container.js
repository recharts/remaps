"use strict";

import React, {Component, PropTypes} from 'react';
import Svg from './Svg';
import Title from './Title';
import {isTooltipUpdate} from './TooltipUpdate';

export default class Container extends Component {
  static propTypes = {
    width: PropTypes.number,
    title: PropTypes.string,
  };

  constructor(props) {
    super (props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isTooltipUpdate(nextProps, nextState, this);
  }

  render() {
    const {
      width,
      title
    } = this.props;

    let titleName;

    const divStyle = {
      width: width,
      position: 'relative'
    };

    if(title)
      titleName = <Title {...this.props}/>;

    return (
      <div style={divStyle}>
        {titleName}
        <Svg {...this.props}/>
      </div>
    )
  }
}
