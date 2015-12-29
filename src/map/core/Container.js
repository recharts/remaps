"use strict";

import {
  default as React,
  Component,
} from 'react';

import d3 from 'd3';

import {
  default as Svg
} from './Svg';

import {
  default as Title
} from './Title';

import {
  isTooltipUpdate
} from './TooltipUpdate';

export default class Container extends Component {
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
