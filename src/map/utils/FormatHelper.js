'use strict';

/**
 * 处理地名后缀“省”，“市”，以及同名
 */
exports.formatName = function(name, regionType) {
  let result,

    // 根据地区缩写返回hash中key对应的值
    search = function (regionType, name) {
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
  if (typeof regionType === 'undefined') {
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
    }
  }

  return result;
};
