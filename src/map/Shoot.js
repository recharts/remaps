"use strict"

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

let requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
let cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;

const keys = {
  from: 'from',
  to: 'to',
  x: 'province',
  y: 'value'
};
const foreignList = {
  '欧洲': {'x': 0.18, 'y': 0.2},
  '非洲': {'x': 0.18, 'y': 0.75},
  '亚洲': {'x': 0.08, 'y': 0.5},
  '大洋洲': {'x': 0.78, 'y': 0.93},
  '北美洲': {'x': 0.89, 'y': 0.3},
  '南美洲': {'x': 0.87, 'y': 0.55}
};
const PI = Math.PI,
      shootType = 'oneByOne',
      // shootType = 'random',
      areaDimension = 'province',
      // 出发点爆炸圆半径
      fromRadius = 10,
      // 达到点爆炸圆半径
      toRadius = 10,
      // 出发点爆炸圆描边
      fromBorder = 1.5,
      // 出发点爆炸圆描边
      toBorder = 2,
      lineWidth = 1,
      lineColor = 'rgba(95,102,222,';

let finish = false,
    hasShootDataChange = false;

CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
  // default interval distance -> 5px
  if (typeof pattern === "undefined") {
    pattern = 5;
  }

  // calculate the delta x and delta y
  const dx = (toX - fromX);
  const dy = (toY - fromY);
  let distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
  let dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
  let deltay = (dy / distance) * pattern;
  let deltax = (dx / distance) * pattern;

  // draw dash line
  this.beginPath();
  for(let dl = 0; dl < dashlineInteveral; dl ++) {
    if(dl%2) {
      this.lineTo(fromX + dl * deltax, fromY + dl * deltay);
    } else {
      this.moveTo(fromX + dl * deltax, fromY + dl * deltay);
    }
  }
  this.stroke();
};

export default class Shoot extends Component {
  static defaultProps = {
    duration: 8000,
    shootDuration: 4000,
  };

  constructor(props) {
    super(props);

    this.state = {
      duration: props.shootDuration * 2,
      shootDuration: props.shootDuration,
      canvasShow: true
    };
  }

  calRadius() {
    var self = this;
    var fr = 10,
        tr = 10;

    if(typeof fr !== 'number'){
      if(fr.domain && fr.range){
        self.fromRadiusScale = d3.scale.linear()
                                  .domain(fr.domain)
                                  .range(fr.range)
                                  .clamp(true);
      }
    }

    if(typeof tr !== 'number'){
      if(tr.domain && tr.range){
        self.toRadiusScale = d3.scale.linear()
                                      .domain(tr.domain)
                                      .range(tr.range)
                                      .clamp(true);
      }
    }
  }

  /**
   * 绘制攻击效果
   */
  draw(shootData) {
    var self = this;
    const {
      mapName,
      ChinaGeoOpt,
      projection,
      shootFinish,
      hasShootLoop,
    } = this.props;

    const {
      duration,
      shootDuration
    } = this.state;

    // 由于要保证interval时间内完成全部动画
    let times = (duration / shootDuration) >> 0,
        shootCtx = this.shootCtx,
        shoots = [],
        shootMap = {},
        len = shootData.length,
        fCo, tCo, s;

    if (shootType === 'oneByOne') {
      times = Math.ceil(0.2 * len + 1);
    }

    // 先清除画布
    this.clear(shootCtx);

    for (let i = 0; i < len; i++) {
      let d = shootData[i],
          fromCityName = d[keys.from],
          toCityName = d[keys.to];

      // 获取出发城市在画布上的坐标
      fCo = self.getCoord(fromCityName);

      // 获取到达城市在画布上的坐标
      if (fromCityName === toCityName) {
        tCo = self.getCoord(toCityName, 'pole');
      } else {
        tCo = self.getCoord(toCityName);
      }

      if(fCo && tCo) {
        s = self.emit(fCo, tCo, d);

        if (shootType === 'oneByOne') {
          s.index = 0.2 * i;
        } else {
          s.index = (times - 1) * Math.random();
        }

        // 判断是否是多点同时射击一个点
        if(!shootMap[s.index]){
          shootMap[s.index] = [];
        }

        shootMap[s.index].forEach(function(city){
          if(city === toCityName){
            // 正在被攻击
            s.shooting = true;
          }
        });

        if(!s.shooting){
          shootMap[s.index].push(toCityName);
        }

        shoots.push(s);
      } else {
        continue;
      }
    }

    if (shoots.length) {
      self.animate(shootType === 'oneByOne' ? times * shootDuration : duration, function (t) {
        self.clear(shootCtx);

        shoots.forEach(function(s, i){
          s(t * times - s.index);
        });

        // if (t >= 1 && !finish)
        if (t >= 1) {
          if (hasShootLoop) {
            self.dispose();
          } else {
            if (!finish) {
              finish = true;
              self.dispose();
              shootFinish(finish);
            }
          }
        }
      });
    }
  }

  /**
   * 清除画布
   */
  clear(ctx){
    const {width, height} = this.props;

    ctx.clearRect(0, 0, width, height);
  }

  /**
   * 获取当前画布中的城市坐标
   * @param name {String} 城市名称
   */
  getCoord(name, type) {
    var self = this;
    type = type || 'center';
    const {width, height, projection, ChinaGeoOpt} = this.props;
    let location, loc;

    if(!name){
      return;
    }

    if(foreignList[name]){
      return {
        x: foreignList[name].x * width,
        y: foreignList[name].y * height
      }
    }

    // 张家口市,张家界市，阿拉善盟, 阿拉尔市，内蒙古，黑龙江
    if (name === '阿拉' || name === '张家' || name === '内蒙古' || name === '黑龙江') {
      name = name.substr(0, 3);
    } else {
      name = name.substr(0, 2);
    }

    if (areaDimension === 'city') {
      if (ChinaGeoOpt.cityIndex[name]){
        location = self.getCityCenter(name);
      }
    } else {
      if (ChinaGeoOpt.provinceIndex[name]) {
        location = type === 'center' ? self.getProvinceCenter(name) : self.getProvincePole(name);
      }
    }

    if (location) {
      loc = projection(location);

      return {x: loc[0], y: loc[1]};
    }
  }

  /**
   * 发射动画
   * @param fCo {Array}   出发城市坐标
   * @param tCo {Array}   到达城市坐标
   * @param data{Object}  json数据
   * @private
   */
  emit(fCo, tCo, data){
    var self = this;
    var shootCtx = this.shootCtx,
        // 发射出现的时间段
        fromBegin = 0.1,
        // 发射动画的持续时间
        fromDuration = 0.5,
        // 发射消失时间段
        fromFadeDuration = 0.1,

        // 击中开始时间点
        toBegin = 0.3,
        // 击中出现时间段
        toDuration = 0.3,
        // 击中停留持续时间
        toStopDuration = 0.1,
        // 击中消失动画的持续时间
        toFadeDuration = 0.15,

        // 发射消失时间点
        fromFadeBegin = fromBegin + fromDuration,
        // 命中消失时间点
        toFadeBegin = toBegin + toDuration + toStopDuration,
        s, fr, tr;

    // 发射半径
    if (this.fromRadiusScale) {
      fr = self.fromRadiusScale(data[keys.fromValue]);
    } else {
      fr = fromRadius;
    }

    // 到达半径
    if(this.toRadiusScale){
      tr = self.toRadiusScale(data[keys.toValue]);
    }else{
      tr = toRadius;
    }

    s = function(t){
      if(fCo){
        // 出发:
        // 1. 出现
        if( t < fromBegin){
          self.from(fCo, fr)(t / fromBegin);
        // 2. 停留
        }else if(t > fromBegin && t < fromFadeBegin){
          self.from(fCo, fr)(1);
        // 3. 消失
        }else if(t > fromFadeBegin){
          self.from(fCo, fr, true)((t - fromFadeBegin) / fromFadeDuration);
        }
      }

      if(tCo){
        // 轨迹
        if(t >= fromBegin && t < toBegin){
          self.track(fCo, tCo)((t - fromBegin) / (toBegin - fromBegin));
        }else if(t > toBegin && t < fromFadeBegin){
          self.track(fCo, tCo, true)(0);
        }else if(t > fromFadeBegin && t < fromFadeBegin + fromFadeDuration){
          self.track(fCo, tCo, true)((t - fromFadeBegin) / fromFadeDuration);
        }


        // 如果不是正在被射击
        if(!s.shooting){
          // 到达:
          // 1. 放大
          if(t >= toBegin && t < (toBegin + toDuration)){
            if(!s.to){
              // this.trigger('to', {fromPos: fCo, toPos: tCo, data: data});
              s.to = true;
            }

            self.to(tCo, tr)((t - toBegin) / toDuration);
          // 2. 停留
          }else if(t > (toBegin + toDuration) && t < toFadeBegin){
            self.to(tCo, tr)(1);
          // 3. 消失
          }else if(t >= toFadeBegin && t <= (toFadeBegin + toFadeDuration)){
            if (s.to) {
              // self.trigger('toFade', {fromPos: fCo, toPos: tCo, data: data});
              s.to = false;
            }

            self.to(tCo, tr, true)((t - toFadeBegin) / toFadeDuration);
          }
        }
      }
    }

    return s;
  }

  /**
   * 画飞线
   * @param fCo   {Object}    出发点坐标
   * @param tCo   {Object}    抵达点坐标
   * @param fade  {Boolean}   是否消失
   * @private
   */
  track(fCo, tCo, fade){
    var self = this;
    var shootCtx = this.shootCtx,
        abs = Math.abs,
        sin = Math.sin,
        cos = Math.cos,
        atan = Math.atan,
        pow2 = function(x){
          return Math.pow(x, 2);
        },
        sqrt = Math.sqrt,
        fColor = lineColor,
        tColor = lineColor,
        // fColor = 'rgba(4,139,245,',
        // tColor = 'rgba(53,222,226,',

        // (x1, y1) 出发点，(x2, y2) 到达点
        // 求直线方程
        // y = m * x + n
        x1 = fCo.x,
        y1 = fCo.y,
        x2 = tCo.x,
        y2 = tCo.y,
        controlPoint = this.getControlPoint(fCo, tCo),
        x3 = controlPoint.x,
        y3 = controlPoint.y,
        // 渐变
        gradient = shootCtx.createLinearGradient(x1, y1, x2, y2);

    return function(t){
      // 移动点坐标
      var x0, y0,
        pi = 2 * Math.PI,
        // 贝塞尔曲线切线斜率
        kx, ky,
        // 蒙板起始坐标
        rx, ry,
        // 蒙板半径
        r,
        gradientOpacity = 0.7;

      if(t > 1 || t < 0){
        return;
      }

      if(fade){
        // 避免出现科学计数法，rgba中的透明值不能设为科学计数法
        gradientOpacity = (1-t) < 0.01 ? 0.01 : (1-t);
      }else{
        gradientOpacity = t < 0.01 ? 0.01 : t;
      }

      // 贝塞尔曲线方程
      x0 = (1-t)*(1-t) * x1 + 2*t*(1-t) * x3 + t*t * x2,
      y0 = (1-t)*(1-t) * y1 + 2*t*(1-t) * y3 + t*t * y2

      // 贝塞尔曲线切线方程
      kx = -2 * x1 *(1-t) + 2 * x3 * (1 - 2 * t) + 2 * x2 * t;
      ky = -2 * y1 *(1-t) + 2 * y3 * (1 - 2 * t) + 2 * y2 * t;

      rx = (x1 + x0) / 2;
      ry = (y1 + y0) / 2;

      r = sqrt(pow2(x1 - x0) + pow2(y1 - y0)) / 2;

      shootCtx.save();

      gradient.addColorStop(0, fColor + gradientOpacity + ')');
      gradient.addColorStop(1, tColor + gradientOpacity + ')');

      if(!fade){
        // 创建圆形蒙板
        shootCtx.arc(rx, ry, r, 0, pi);
        shootCtx.clip();
      }

      shootCtx.beginPath();
      shootCtx.globalCompositeOperation = 'lighter';
      shootCtx.strokeStyle = gradient;
      shootCtx.lineWidth = lineWidth;

      // 画虚线
      // for(let i = 0; i < 10; i ++) {
      //   let delta = i * 20;
      //   let pattern = i * 2 + 1;
      //   shootCtx.dashedLineTo(x1, y1, x2, y2, pattern);
      // }

      shootCtx.moveTo(x1, y1);
      shootCtx.quadraticCurveTo(x3, y3, x2, y2);
      shootCtx.stroke();
      shootCtx.restore();

      var a = atan(ky / kx);

      // 计算旋转角度
      if(ky > 0 && kx < 0){
        a = a + pi / 2;
      }else if(ky < 0 && kx < 0){
        a = a - pi / 2;
      }

      if(!fade){
        // ky/kx 为切线斜率
        self.drawBullet(x0, y0, a);
      }
    };
  }

  /**
   * 获取二次贝塞尔曲线的控制点
   * @param {Object} fromPoint 起点坐标
   * @param {Object} toPoint 终点坐标
   * @return {Object} 控制点
   */
  getControlPoint(fromPoint, toPoint) {
    var self = this;
    var x1 = fromPoint.x,
        y1 = fromPoint.y,
        x2 = toPoint.x,
        y2 = toPoint.y,
        // 中点的横坐标
        midX = (x1 + x2) / 2,
        // 中点的纵坐标
        midY = (y1 + y2) / 2,
        ratio = 0.2;

    if (x1 === x2 && y1 === y2) {
      //起点和终点重合
      return {
        x: x1,
        y: y2,
      };
    } else if (x1 === x2) {
      //起点和终点的横坐标相同
      return {
        x: x1 - ratio * Math.abs(y2 - y1),
        y: midY
      };
    } else if (y1 === y2) {
      //起点和终点的纵坐标相同
      return {
        x: midX,
        y: y1 + ratio * Math.abs(x2 - x1)
      };
    }
        // 法线的斜率，经过中点的垂直平分线方程 y = normalSlope * (x - midX) + midY
    var normalSlope = -(x2 - x1) / (y2 - y1),
        // 控制点和中点的线段长度
        delta = ratio * Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)),
        deltaX = - self.mathSign(normalSlope) * delta / Math.sqrt( 1 + Math.pow(normalSlope, 2));

    return {
      x: midX + deltaX,
      y: midY + normalSlope * deltaX
    };
  }

  mathSign(value) {
    if (value === +value) {
      if (value > 0) {
        return 1;
      } else if (value < 0) {
        return -1;
      } else {
        return 0;
      }
    }

    return NaN;
  }

  /**
   * 画子弹
   * @param x     {Number}  坐标x
   * @param y     {Number}  坐标y
   * @param a     {Number}  子弹旋转角度
   * @private
   */
  drawBullet(x, y, a){
    var pi = 2 * Math.PI,
        shootCtx = this.shootCtx;

    shootCtx.save();

    shootCtx.translate(x, y);
    shootCtx.rotate(a);
    shootCtx.translate(-x, -y);

    shootCtx.beginPath();

    shootCtx.globalCompositeOperation = 'lighter';

    // shadow
    shootCtx.shadowColor = '#f00';
    shootCtx.shadowBlur = 20;
    shootCtx.shadowOffsetX = 0;
    shootCtx.shadowOffsetY = 0;

    // shootCtx.fillStyle = lineColor + '1)';
    shootCtx.fillStyle = 'rgba(248,191,96,1)';
    shootCtx.arc(x, y, 2.5, -pi / 4, pi / 4);

    shootCtx.lineTo(x - 20, y);

    shootCtx.closePath();

    shootCtx.fill();

    shootCtx.restore();
  }

  /**
   * 画出发点
   * @param co    {Object}  出发城市坐标
   * @param r   {Number}  半径
   * @param zoom  {Boolean} 是否缩小
   * @private
   */
  from(co, r, zoom){
    var shootCtx = this.shootCtx;

    return function(t) {
      if(t > 1 || t < 0){
        return;
      }

      if (zoom){
        t = 1 - t;
      }

      shootCtx.save();

      var gradient = shootCtx.createRadialGradient(co.x, co.y, 0, co.x, co.y, r * t);

      gradient.addColorStop(0, lineColor + '1)');
      gradient.addColorStop(1, lineColor + '0)');
      // gradient.addColorStop(0, 'rgba(184, 246, 253, 1)');
      // gradient.addColorStop(1, 'rgba(184, 246, 253, 0)');

      // 画背景部分
      shootCtx.beginPath();
      shootCtx.fillStyle = gradient;
      shootCtx.arc(co.x, co.y, r * t, 0, 2 * PI);
      shootCtx.fill();
      // 中间白色的部分只占40%
      shootCtx.beginPath();
      shootCtx.fillStyle = '#fff';
      shootCtx.arc(co.x, co.y, 0.4 * r * t, 0, 2 * PI);
      shootCtx.fill();

      shootCtx.restore();
    };
  }

  /**
   * 画抵达点
   * @param co        {Object}    抵达点坐标
   * @param r   {Number}  半径
   * @param isZoomIn      {Boolean}   是否放大
   * @private
   */
  to(co, r, isZoomIn){
    var c = 'rgba(66,173,255,',
        b = toBorder,
        shootCtx = this.shootCtx,
        pi = 2 * Math.PI,
        cos = Math.cos;

    return function(t){
      var opacity;

      if(t > 1 || t < 0){
        return;
      }

      shootCtx.save();

      // 是否放大
      if (isZoomIn) {
        opacity = 1 - t;
        t = 1 + t;
      }

      var gradient = shootCtx.createRadialGradient(co.x, co.y, 0, co.x, co.y, r * t);

      if (isZoomIn) {
        gradient.addColorStop(0, lineColor + opacity + ')');
        gradient.addColorStop(1, lineColor + '0)');
        // gradient.addColorStop(0, 'rgba(184, 246, 253, ' + opacity + ')');
        // gradient.addColorStop(1, 'rgba(184, 246, 253, 0)');
      } else {
        gradient.addColorStop(0, lineColor + '1)');
        gradient.addColorStop(1, lineColor + '0)');
        // gradient.addColorStop(0, 'rgba(184, 246, 253, 1)');
        // gradient.addColorStop(1, 'rgba(184, 246, 253, 0)');
      }

      // 画背景部分
      shootCtx.beginPath();
      shootCtx.fillStyle = gradient;
      shootCtx.arc(co.x, co.y, r * t, 0, 2 * PI);
      shootCtx.fill();
      // 中间白色的部分只占40%
      shootCtx.beginPath();
      shootCtx.fillStyle = 'rgba(255, 255, 255, ' + (isZoomIn ? opacity : 1) + ')';
      shootCtx.arc(co.x, co.y, 0.4 * r * t, 0, 2 * PI);
      shootCtx.fill();
      // 画中心圆
      shootCtx.beginPath();
      shootCtx.fillStyle = lineColor + (isZoomIn ? opacity * 0.7 : 0.7) + ')';
      // shootCtx.fillStyle = 'rgba(53, 222, 226, ' + (isZoomIn ? opacity * 0.7 : 0.7) + ')';
      shootCtx.arc(co.x, co.y, 0.4 * r * t, 0, 2 * PI);
      shootCtx.fill();
      // 画前景圆
      shootCtx.beginPath();
      shootCtx.fillStyle = lineColor + (isZoomIn ? 0.2 * opacity : 0.2)  + ')';
      shootCtx.strokeStyle = lineColor + (isZoomIn ? 0.48 * opacity : 0.48) + ')';
      // shootCtx.fillStyle = 'rgba(53, 222, 226, ' + (isZoomIn ? 0.2 * opacity : 0.2)  + ')';
      // shootCtx.strokeStyle = 'rgba(53, 222, 226, ' + (isZoomIn ? 0.48 * opacity : 0.48) + ')';
      shootCtx.arc(co.x, co.y, 1.5 * r * t, 0, 2 * PI);
      shootCtx.fill();
      shootCtx.stroke();

      shootCtx.restore();
    };
  }

  animate(duration, handler) {
    var self = this;
    var begin = +(new Date());

    var fn = function () {
      var now = +(new Date());

      if (now - begin >= duration) {
        handler(1);
      } else {
        handler((now - begin) / duration);

        self.frameId = requestFrame(fn);
      }
    };

    fn();
  }

  stopAnimate(argument) {
    if (this.frameId) {
      cancelFrame(this.frameId);
    }
  }

  dispose() {
    const {shootData, hasShootLoop} = this.props;
    this.stopAnimate();

    if (hasShootLoop) {
      this.initialize(shootData);
    } else {
      if (!hasShootDataChange && this.state.canvasShow) {
          this.setState({
          canvasShow: false
        });
      }
    }
    // this.shootCanvas.remove();
  }

  // 工具函数
  searchIndex(key, name, regionType) {
    const {ChinaGeoOpt} = this.props;
    var result,

      // 根据地区缩写返回hash中key对应的值
      search = function (regionType, name) {
        var shortName = name.substr(0, 2),
          hash,
          result;

        if (regionType === 'province') {
          // 内蒙古，黑龙江
          if (shortName === '内蒙' || shortName === '黑龙') {
            shortName = name.substr(0, 3);
          }
        }

        if (regionType === 'city') {
          //prevent duplicate，张家口市,张家界市，阿拉善盟, 阿拉尔市
          if (shortName === '阿拉' || shortName === '张家') {
            shortName = name.substr(0, 3);
          }
        }

        // 根据类型判断取省或市的hash
        hash = (regionType === 'city' ? ChinaGeoOpt.cityIndex : ChinaGeoOpt.provinceIndex);

        result = hash[shortName];

        if (typeof result === 'undefined') {
          return undefined;
        }

        return result[key];
      };


    // 如果regionType省略，先找省，再找市
    if (typeof regionType === 'undefined') {
      if (name === '吉林市' || name === '海南藏族自治州') {
        // 这两个市和省重名，所以要加特殊处理
        //吉林省， 吉林市； 海南省，海南藏族自治州
        result = search('city', name);
      } else {
        result = search('province', name) || search('city', name);
      }
    } else {
      if (regionType === 'province') {
        //province
        result = search('province', name);
      } else if (regionType === 'city') {
        //city
        result = search('city', name);
      }
    }

    return result;
  }

  getProvinceCenter(name) {
    return this.searchIndex('center', name, 'province');
  }

  getCityCenter(name) {
    return this.searchIndex('center', name, 'city');
  }

  getProvincePole(name) {
    return this.searchIndex('pole', name, 'city');
  }

  initialize(shootData) {
    const {
      mapName,
      ChinaGeoOpt,
      projection,
    } = this.props;

    let shootCanvas = ReactDOM.findDOMNode(this.refs.canvas);
    let shootCtx = shootCanvas.getContext('2d');

    let backingStoreRatio = shootCtx.webkitBackingStorePixelRatio ||
                            shootCtx.mozBackingStorePixelRatio ||
                            shootCtx.msBackingStorePixelRatio ||
                            shootCtx.oBackingStorePixelRatio ||
                            shootCtx.backingStorePixelRatio || 1,
        dpr = Math.max(window.devicePixelRatio || 1, 1),
        ratio = dpr / backingStoreRatio;

    // 解决高清屏绘制的图形模糊的问题
    // if (ratio !== 1) {
    //   shootCanvas.width = width * ratio;
    //   shootCanvas.height = height * ratio;

    //   shootCanvas.style.width = width + 'px';
    //   shootCanvas.style.height = height + 'px';

    //   shootCtx.scale(ratio, ratio);
    // } else {
    //   shootCanvas.width = width;
    //   shootCanvas.height = width;
    // }

    // if (hasShootDataChange) {
    //   this.stopAnimate();
    // }

    this.shootCanvas = shootCanvas;
    this.shootCtx = shootCtx;
    this.shootCtx.lineWidth = lineWidth;

    this.calRadius();

    this.draw(shootData);
  }

  componentDidMount() {
    const {shootData} = this.props;
    this.initialize(shootData);
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    const {shootFinish} = this.props;
    if (nextProps.shootData !== this.props.shootData) {
      hasShootDataChange = true;
      finish = false;
      this.stopAnimate();
      shootFinish(finish);
    }
  }

  componentWillUpdate() {
    if (hasShootDataChange && !this.state.canvasShow) {
      this.setState({
        canvasShow: true
      });
    }
  }

  componentDidUpdate() {
    this.initialize(this.props.shootData);
    hasShootDataChange = false;
  }

  render() {
    const {width, height} = this.props;

    const {canvasShow} = this.state;

    const style = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      display: canvasShow ? 'block' : 'none'
    };

    return (
      <div>
        <canvas ref="canvas" width={width} height={height} style={style}></canvas>
      </div>
    );
  }
}