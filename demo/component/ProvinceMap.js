"use strict"

import React from 'react';
import ReactDOM from 'react-dom';
import {MapContainer, Maps} from 'remaps';

const newData = [
  {name: '杭州市', title: '浙江省 － 四川省', value: 4413, index: 0},
  {name: '绍兴市', title: '浙江省 － 四川省', value: 443, index: 1},
  {name: '嘉兴市', title: '浙江省 － 四川省', value: 3213, index: 2},
  {name: '丽水市', title: '浙江省 － 四川省', value: 3213, index: 3},
  {name: '宁波市', title: '浙江省 － 四川省', value: 3343, index: 4},
  {name: '温州市', title: '浙江省 － 四川省', value: 3213, index: 5},
];

export default React.createClass({

  getInitialState() {
    return {
      value: '浙江',
      mapName: '浙江',
    };
  },

  handleChange(e) {
    this.setState({
      value: e.target.value,
      mapName: e.target.value
    });
  },

  onPolygonMouseOut(dom , d, i) {
  },

  onPolygonMouseOver(dom, d, i) {
  },

  onPolygonClick(dom, d, i) {
  },

  onPolygonCloseClick(id) {
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

    return (
      <div className='simple-maps'>
        <span>切换省份地图：</span>
        <select value={this.state.value} onChange={this.handleChange}>
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
          width= {width}
          zoom= {false}
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
            hasName= {false}
            popupContent= {this.popupContent}
            // onClick= {this.onPolygonClick}
            // onCloseClick= {this.onPolygonCloseClick}
            // onMouseOver= {this.onPolygonMouseOver}
            // onMouseOut= {this.onPolygonMouseOut}
          />
        </MapContainer>
      </div>
    );
  }
});
