"use strict"

import React from 'react';
import ReactDOM from 'react-dom';
import {MapContainer, Maps, Legend} from 'remaps';

// const newData = {
//   '甘肃': {title: '浙江省 － 四川省', value: 4413, index: 0},
//   '青海': {title: '浙江省 － 四川省', value: 443, index: 1},
//   '广西': {title: '浙江省 － 四川省', value: 3213, index: 2},
//   '贵州': {title: '浙江省 － 四川省', value: 3213, index: 3},
//   '重庆': {title: '浙江省 － 四川省', value: 3343, index: 4},
//   '北京': {title: '浙江省 － 四川省', value: 3213, index: 5},
//   '福建': {title: '浙江省 － 四川省', value: 3413, index: 6},
//   '安徽': {title: '浙江省 － 四川省', value: 323, index: 7},
//   '广东': {title: '浙江省 － 四川省', value: 3223, index: 8},
//   '西藏': {title: '浙江省 － 四川省', value: 344, index: 9},
//   '新疆': {title: '浙江省 － 四川省', value: 3233, index: 10},
//   '海南': {title: '浙江省 － 四川省', value: 3213, index: 11},
//   '宁夏': {title: '浙江省 － 四川省', value: 3213, index: 13},
//   '陕西': {title: '浙江省 － 四川省', value: 313, index: 14},
//   '山西': {title: '浙江省 － 四川省', value: 13, index: 15},
//   '湖北': {title: '浙江省 － 四川省', value: 1213, index: 16},
//   '湖南': {title: '浙江省 － 四川省', value: 8413, index: 17},
//   '四川': {title: '浙江省 － 四川省', value: 9413, index: 18},
//   '云南': {title: '浙江省 － 四川省', value: 4543, index: 19},
//   '河北': {title: '浙江省 － 四川省', value: 1113, index: 20},
//   '河南': {title: '浙江省 － 四川省', value: 2213, index: 21},
//   '辽宁': {title: '浙江省 － 四川省', value: 433, index: 22},
//   '山东': {title: '浙江省 － 四川省', value: 1213, index: 23},
//   '天津': {title: '浙江省 － 四川省', value: 233, index: 24},
//   '江西': {title: '浙江省 － 四川省', value: 11113, index: 25},
//   '江苏': {title: '浙江省 － 四川省', value: 653, index: 26},
//   '上海': {title: '浙江省 － 四川省', value: 7713, index: 27},
//   '浙江': {title: '浙江省 － 四川省', value: 554, index: 28},
//   '吉林': {title: '浙江省 － 四川省', value: 231, index: 29},
//   '内蒙古': {title: '浙江省 － 四川省', value: 3213, index: 30},
//   '黑龙江': {title: '浙江省 － 四川省', value: 4343, index: 31},
//   '台湾': {title: '浙江省 － 四川省', value: 665, index: 32},
//   '香港': {title: '浙江省 － 四川省', value: 4544, index: 33},
//   '澳门': {title: '浙江省 － 四川省', value: 2321, index: 34}
// };
const newData = [
  {name: '甘肃', title: '浙江省 － 四川省', value: 4413, index: 0},
  {name: '青海', title: '浙江省 － 四川省', value: 443, index: 1},
  {name: '广西', title: '浙江省 － 四川省', value: 3213, index: 2},
  {name: '贵州', title: '浙江省 － 四川省', value: 3213, index: 3},
  {name: '重庆', title: '浙江省 － 四川省', value: 3343, index: 4},
  {name: '北京', title: '浙江省 － 四川省', value: 3213, index: 5},
  {name: '福建', title: '浙江省 － 四川省', value: 3413, index: 6},
  {name: '安徽', title: '浙江省 － 四川省', value: 323, index: 7},
  {name: '广东', title: '浙江省 － 四川省', value: 3223, index: 8},
  {name: '西藏', title: '浙江省 － 四川省', value: 344, index: 9},
  {name: '新疆', title: '浙江省 － 四川省', value: 3233, index: 10},
  {name: '海南', title: '浙江省 － 四川省', value: 3213, index: 11},
  {name: '宁夏', title: '浙江省 － 四川省', value: 3213, index: 13},
  {name: '陕西', title: '浙江省 － 四川省', value: 313, index: 14},
  {name: '山西', title: '浙江省 － 四川省', value: 13, index: 15},
  // {name: '湖北', title: '浙江省 － 四川省', value: 1213, index: 16},
  // {name: '湖南', title: '浙江省 － 四川省', value: 8413, index: 17},
  {name: '四川', title: '浙江省 － 四川省', value: 9413, index: 18},
  {name: '云南', title: '浙江省 － 四川省', value: 4543, index: 19},
  {name: '河北', title: '浙江省 － 四川省', value: 1113, index: 20},
  {name: '河南', title: '浙江省 － 四川省', value: 2213, index: 21},
  {name: '辽宁', title: '浙江省 － 四川省', value: 433, index: 22},
  {name: '山东', title: '浙江省 － 四川省', value: 1213, index: 23},
  {name: '天津', title: '浙江省 － 四川省', value: 233, index: 24},
  {name: '江西', title: '浙江省 － 四川省', value: 11113, index: 25},
  {name: '江苏', title: '浙江省 － 四川省', value: 653, index: 26},
  {name: '上海', title: '浙江省 － 四川省', value: 7713, index: 27},
  {name: '浙江', title: '浙江省 － 四川省', value: 554, index: 28},
  {name: '吉林', title: '浙江省 － 四川省', value: 231, index: 29},
  {name: '内蒙古', title: '浙江省 － 四川省', value: 3213, index: 30},
  {name: '黑龙江', title: '浙江省 － 四川省', value: 4343, index: 31},
  {name: '台湾', title: '浙江省 － 四川省', value: 665, index: 32},
  {name: '香港', title: '浙江省 － 四川省', value: 4544, index: 33},
  {name: '澳门', title: '浙江省 － 四川省', value: 2321, index: 34}
];

const EmptyData = [];

let shootData = [
  {
    "from": "浙江",
    "to": "四川",
    "value": 13361
  },
];

export default React.createClass({

  getInitialState() {
    return {
      value: '中国',
      mapName: '中国',
      shootData: shootData,
    };
  },

  handleClick(e) {
    shootData = [
      {
        "from": "浙江",
        "to": e.target.value,
        "value": 13361
      },
    ];
    this.setState({
      areaValue: e.target.value,
      shootData: shootData
    });
  },

  popupContent(name) {
    let flag = false;
    let item = newData.map(d => {
      if (d['name'] === name) {
        flag = true;
        return (
          <div>
            <p>
              <span>{name}</span>
            </p>
            <p>
              <span>模拟数据：</span>
              <span>{d['value']}</span>
            </p>
            <p>
              <span>模拟数据：</span>
              <span>{d['index']}</span>
            </p>
          </div>
        );
      }
    })
    return flag ? item : null;
  },

  render() {
    const width = 600;
    const {shootData} = this.state;

    return (
      <div className='simple-maps'>

        <span>切换起止地点：</span>
        <select value={this.state.areaValue} onChange={this.handleClick}>
          <option value="安徽">安徽</option>
          <option value="北京">北京</option>
          <option value="重庆">重庆</option>
          <option value="福建">福建</option>
          <option value="甘肃">甘肃</option>
          <option value="广东">广东</option>
          <option value="广西">广西</option>
          <option value="贵州">贵州</option>
          <option value="海南">海南</option>
          <option value="河北">河北</option>
          <option value="黑龙江">黑龙江</option>
          <option value="河南">河南</option>
          <option value="香港">香港</option>
          <option value="湖北">湖北</option>
          <option value="湖南">湖南</option>
          <option value="江苏">江苏</option>
          <option value="江西">江西</option>
          <option value="吉林">吉林</option>
          <option value="辽宁">辽宁</option>
          <option value="澳门">澳门</option>
          <option value="内蒙古">内蒙古</option>
          <option value="宁夏">宁夏</option>
          <option value="青海">青海</option>
          <option value="山西">山西</option>
          <option value="陕西">陕西</option>
          <option value="山东">山东</option>
          <option value="上海">上海</option>
          <option value="四川">四川</option>
          <option value="台湾">台湾</option>
          <option value="天津">天津</option>
          <option value="新疆">新疆</option>
          <option value="西藏">西藏</option>
          <option value="云南">云南</option>
          <option value="浙江" selected>浙江</option>
        </select>

        <MapContainer
          className={"mapContainer"}
          width= {width}
          shootData= {shootData}
          mapName= {this.state.mapName}
        >
          <Maps
            data= {newData}
            nameKey= {'name'}
            valueKey= {'value'}
            colorArr= {['#C6C9EE', '#B9BCED', '#AAADF0', '#8C90EF', '#6670F5']}
            defaultColor= {'#CACACA'}
            shootColor= {'#FCE687'}
            hoverColor= {'#86C899'}
            hasLegend= {true}
            legendPos= {[50, 420]}
            popupContent= {this.popupContent}
          />
        </MapContainer>
      </div>
    );
  }
});
