"use strict";

import React, {Component, PropTypes} from 'react';

export default class Popup extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    // contentPopup: PropTypes.array,
  };

  constructor (props) {
    super(props);
  }

  _mkContent() {
    const {
      contentPopup
    } = this.props;

    const popupContentStyle= {
      backgroundColor: '#FFF',
      padding: '5px',
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
      mapId,
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

    let popupStyle = {
      position: 'absolute',
      pointerEvents: 'none',
      boxShadow: '0 3px 14px rgba(0,0,0,0.4)',
      textAlign: 'center',
      width: 'auto',
      height: 'auto',
      top: y + 10 + 'px',
      left: x + 10 + 'px',
      whiteSpace: 'nowrap',
    };

    return (
      <div className= "remaps_popup"
           style={popupStyle}
           ref="popupContentWrapper">
        {cvContent}
      </div>
    )
  }
}
