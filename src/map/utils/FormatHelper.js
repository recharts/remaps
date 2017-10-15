'use strict';

/**
 * 处理地名后缀“省”，“市”，以及同名
 */
exports.formatName = function(name, regionType) {
  let result;

    // 根据地区缩写返回hash中key对应的值
  const search = function(regionType, name) {
    // 返回2个字
    let shortName = name.substr(0, 2);

    if (regionType === 'province') {
      // 内蒙古，黑龙江，返回3个字
      if (shortName === '内蒙' || shortName === '黑龙') {
        shortName = name.substr(0, 3);
      }
    }

    if (regionType === 'city') {
      // 张家口市、张家界市、阿拉善盟、阿拉尔市，返回3个字区分
      if (shortName === '阿拉' || shortName === '张家') {
        shortName = name.substr(0, 3);
      }
    }

    return shortName;
  };

  // 如果 regionType 省略，先找省，再找市
  if (regionType === '世界') {
    result = name;
  } else if (typeof regionType === 'undefined' || (regionType !== 'province' || regionType !== 'city')) {
    if (name === '吉林市' || name === '海南藏族自治州') {
      // 吉林省、吉林市；海南省、海南藏族自治州（省市重名，特殊处理）
      result = search('city', name);
    } else {
      result = search('province', name) || search('city', name);
    }
  } else {
    if (regionType === 'province') {
      // 找省
      result = search('province', name);
    } else if (regionType === 'city') {
      // 找市
      result = search('city', name);
    } else {
      result = name;
    }
  }

  return result;
};

const NAME_CH = [
  '安徽', '澳门', '北京', '重庆', '福建', '贵州', '广西', '广东',
  '甘肃', '湖南', '湖北', '黑龙江', '河北', '河南', '海南', '江西', '江苏', '吉林',
  '辽宁', '宁夏', '内蒙古', '青海', '四川', '上海', '山东', '山西',
  '陕西', '天津', '台湾', '新疆', '香港', '西藏', '云南', '浙江'
];
const NAME_EN = [
  'Anhui', 'Aomen', 'Beijing', 'Chongqing', 'Fujian', 'Guizhou', 'Guangxi', 'Guangdong',
  'Gansu', 'Hunan', 'Hubei', 'Heilongjiang', 'Hebei', 'Henan', 'Hainan', 'Jiangxi', 'Jiangsu', 'Jilin',
  'Liaoning', 'Ningxia', 'Neimenggu', 'Qinghai', 'Sichuan', 'Shanghai', 'Shandong', 'Shanxi_1',
  'Shanxi_3', 'Tianjin', 'Taiwan', 'Xinjiang', 'Xianggang', 'Xizang', 'Yunnan', 'Zhejiang'
];
const NAME_CH_CONVERT_EN = {
  '安徽': 'Anhui',
  '澳门': 'Aomen',
  '北京': 'Beijing',
  '重庆': 'Chongqing',
  '福建': 'Fujian',
  '贵州': 'Guizhou',
  '广西': 'Guangxi',
  '广东': 'Guangdong',
  '甘肃': 'Gansu',
  '湖南': 'Hunan',
  '湖北': 'Hubei',
  '黑龙江': 'Heilongjiang',
  '河北': 'Hebei',
  '河南': 'Henan',
  '海南': 'Hainan',
  '江西': 'Jiangxi',
  '江苏': 'Jiangsu',
  '吉林': 'Jilin',
  '辽宁': 'Liaoning',
  '宁夏': 'Ningxia',
  '内蒙古': 'Neimenggu',
  '青海': 'Qinghai',
  '四川': 'Sichuan',
  '上海': 'Shanghai',
  '山东': 'Shandong',
  '山西': 'Shanxi_1',
  '陕西': 'Shanxi_3',
  '天津': 'Tianjin',
  '台湾': 'Taiwan',
  '新疆': 'Xinjiang',
  '香港': 'Xianggang',
  '西藏': 'Xizang',
  '云南': 'Yunnan',
  '浙江': 'Zhejiang'
};
exports.formatProvinceName = function(name) {
  if (name) {
    if (NAME_CH.indexOf(name) !== -1) {
      return NAME_CH_CONVERT_EN[name];
    }
    if (NAME_EN.indexOf(name) !== -1) {
      return name;
    }
    return null;
  }

  return null;
};
