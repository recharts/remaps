"use strict"

import React, {Component, PropTypes} from 'react';

export default class ZoomControl extends Component {
  static propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    zoomInClick: PropTypes.func,
    zoomOutClick: PropTypes.func
  };

  static defaultProps = {
    left: 0,
    top: 0
  };

  constructor (props) {
    super(props);
  }

  render() {
    const {
      zoomInClick,
      zoomOutClick,
      top,
      left
    } = this.props;

    const zoomControlStyle = {
      left: left,
      top: top,
      position: 'absolute',
      border: '2px solid rgba(0,0,0,0.2)',
      backgroundClip: 'padding-box',
      boxShadow: 'none',
      marginLeft: '10px',
      marginTop: '10px',
      cursor: 'pointer'
    }

    const zoomInStyle = {
      width: '30px',
      height: '30px',
      lineHeight: '30px',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      fontSize: '22px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #CCC',
      textAlign: 'center',
      textDecoration: 'none',
      color: 'black',
      display: 'block'
    }

    const zoomOutStyle = {
      width: '30px',
      height: '30px',
      lineHeight: '30px',
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px',
      fontSize: '24px',
      backgroundColor: '#fff',
      textAlign: 'center',
      textDecoration: 'none',
      color: 'black',
      display: 'block'
    }

    return (
      <div className="remaps_zoomControl" style= {zoomControlStyle}>
        <a className="remaps_zoomIn" style={zoomInStyle} onClick={zoomInClick}>+</a>
        <a className="remaps_zoomOut" style={zoomOutStyle} onClick={zoomOutClick}>-</a>
      </div>
    )
  }
}
