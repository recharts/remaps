"use strict"

import React, {Component, PropTypes} from 'react';
import Text from './core/Text';

export default class TextSet extends Component {

  render() {
    const {
      geoData,
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
            key= {'remaps_text' + i}
            geoData= {d}
            projection= {projection}
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
