"use strict";

import React, {Component, PropTypes} from 'react';

export default class Text extends Component {
  static propTypes = {
    geoData: PropTypes.object,
    textClass: PropTypes.string,
    projection: PropTypes.func,
  };

  static defaultProps = {
    textClass: 'remaps-core__text'
  };

  constructor(props) {
    super (props);
  }

  render () {
    const {
      id,
      geoData,
      textClass,
      projection
    } = this.props;

    return <text x= {projection(geoData.properties.cp)[0]}
                 y= {projection(geoData.properties.cp)[1]} >
             {geoData.properties.name}
           </text>
  }
}
