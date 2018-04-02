"use strict"

import React from 'react';
import ReactDOM from 'react-dom';
import {MapContainer, Maps, Legend} from 'remaps';
// import { ChinaData, ProvinceData } from 'china-map-geojson';
// import WorldData from 'world-map-geojson';

const newData = [
  {name: 'India', title: 'India － China', value: 4413, index: 0},
  {name: 'South Africa', title: 'South Africa － China', value: 443, index: 1},
  {name: 'China', title: 'China － China', value: 44312, index: 1}
];

const EmptyData = [];

export default React.createClass({

  getInitialState() {
    return {
      value: '世界',
      mapName: '世界',
    };
  },

  handleMapClick(a, b, e) {
    console.log(a, b, e);
  },

  popupContent(data) {
    if (data) {
      return (
        <div>
          <p>
            <span>{data.name}</span>
          </p>
          <p>
            <span>模拟数据：</span>
            <span>{data.value}</span>
          </p>
          <p>
            <span>模拟数据：</span>
            <span>{data.index}</span>
          </p>
        </div>
      );
    } else {
      return null;
    }
  },

  render() {
    const width = 600;
    const {shootData} = this.state;

    return (
      <div className='simple-maps'>
        <MapContainer
          className={"mapContainer"}
          width= {width}
          mapName= {this.state.mapName}
          // geoData={WorldData}
          extData= {newData}
          nameKey= {'name'}
          valueKey= {'value'}
          colorArr= {['#C6C9EE', '#B9BCED', '#AAADF0', '#8C90EF', '#6670F5']}
          defaultColor= {'#CACACA'}
          hoverColor= {'#FCE687'}
          hasLegend= {true}
          legendPos= {[50, 420]}
          popupContent= {this.popupContent}
          onClick={this.handleMapClick}
        >
        </MapContainer>
      </div>
    );
  }
});
