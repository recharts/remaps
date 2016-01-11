"use strict";

import React, {Component, PropTypes} from 'react';

let clientHeight = 0;

export default class Popup extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    // contentPopup: PropTypes.array,
    mapWidth: PropTypes.number,
    mapHeight: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = {
    width: 150,
    height: 50
  };

  constructor (props) {
    super(props);
  }

  componentDidMount() {
    this._updateHeight();
  }

  componentDidUpdate() {
    this._updateHeight();
  }

  getPos(obj) {
    let pos = {left:0, top:0};
    while(obj) {
      pos.left += obj.offsetLeft;
      pos.top += obj.offsetTop;
      obj = obj.offsetParent;
    }
    return pos;
  }

  _updateHeight() {
    const {
      x,
      y,
      mapWidth,
      mapHeight,
      mapId
    } = this.props;

    let contentDOM = this.refs.popupContentWrapper;
    let contentForeign = this.refs.popupContentForeignObject;

    const mapContainer = document.getElementById(mapId);

    const halfMapWidth = mapWidth / 2,
          halfMapHeight = mapHeight / 2;

    let popupX, popupY;

    let newX = x - this.getPos(mapContainer).left;
    let newY = y;

    if (newX > halfMapWidth) {
      popupX = newX - contentDOM.clientWidth - 10;
      contentForeign.setAttribute('x', popupX);
    } else {
      popupX = newX + 10;
      contentForeign.setAttribute('x', popupX);
    }

    if (newY > halfMapHeight) {
      popupY = newY - contentDOM.clientHeight - 10;
      contentForeign.setAttribute('y', popupY);
    } else {
      popupY = newY + 10;
      contentForeign.setAttribute('y', popupY);
    }
  }

  _mkContent() {
    const {
      contentPopup
    } = this.props;

    const popupContentStyle= {
      backgroundColor: '#FFF',
      padding: '5px',
      lineHeight: 1
    }

    return (
      <div className="popup_content" style= {popupContentStyle}>
        {contentPopup}
      </div>
    )
  }

  render() {
    const {
      x,
      y,
      contentPopup,
      mapWidth,
      mapHeight,
      width,
      height,
    } = this.props;

    let cvContent;

    if(contentPopup) {
      cvContent = this._mkContent();
    }

    const popupGroupStyle = {
      position: 'relative'
    }

    const popupStyle = {
      pointerEvents: 'none',
      boxShadow: '0 3px 14px rgba(0,0,0,0.4)',
      textAlign: 'center',
      // backgroundColor: '#FFF',
      width: 'auto',
      height: 'auto'
    };

    return (
      <g style={popupGroupStyle}
        className= "remaps_popup"
        ref= "popup"
        >

          <foreignObject
            ref="popupContentForeignObject"
            x= {x}
            y= {y}
            width= {width}
            height= {height}
          >
            <div className= "remaps_popup_contentWrapper" style={popupStyle} ref="popupContentWrapper">
              {cvContent}
            </div>
          </foreignObject>
        </g>
    )
  }
}
