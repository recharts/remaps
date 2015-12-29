"use strict";

import {
  default as React,
  Component,
  PropTypes
} from 'react';

export default class Text extends Component {
  constructor(props) {
    super (props);
  }

  static defaultProps = {
    textClass: 'remaps-core__text'
  }

  static propTypes = {
    geoData: PropTypes.object.isRequired,
    textClass: PropTypes.string
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
