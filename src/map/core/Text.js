"use strict";

import React, {Component, PropTypes} from 'react';

export default class Text extends Component {
  static propTypes = {
    geoData: PropTypes.object,
    projection: PropTypes.func,
  };

  constructor(props) {
    super (props);
  }

  render () {
    const {
      id,
      geoData,
      projection
    } = this.props;

    return <text x= {projection(geoData.properties.cp)[0]}
                 y= {projection(geoData.properties.cp)[1]}
                 fontSize='12'
                 fill='#333' >
             {geoData.properties.name}
           </text>
  }
}
