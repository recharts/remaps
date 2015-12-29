"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  default as Text,
} from './core/Text';

export default class TextSet extends Component {

  render() {
    const {
      geoData,
      textClass,
      projection
    } = this.props;

    var texts;
    var textData;

    if(geoData.type === 'FeatureCollection') {
      textData = [];

      // 遍历 features
      geoData.features.forEach(function(d) {
        textData.push(d);
      })
    }else if(geoData.type === 'Feature') {
      textData = geoData;
    }

    if(textData) {
      // 如果不是数组，将其转换成数组
      if(!Array.isArray(textData))
        textData = [textData];

      texts = textData.map((d, i) => {
        return (
          <Text
            id= {'remaps__text' + i}
            key= {'remaps__text' + i}
            geoData= {d}
            projection= {projection}
            textClass= {textClass}
          />
        )
      })
    }

    return (
      <g>
        {texts}
      </g>
    )
  }
}
