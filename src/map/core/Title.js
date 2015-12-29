"use strict";

import {
  default as React,
  Component,
  PropTypes,
} from 'react';

export default class Title extends Component {
  constructor(props) {
    super (props);
  }

  static propTypes = {
    width: PropTypes.number.isRequired,
    title: PropTypes.string,
    titleClassName: PropTypes.string
  }

  render() {
    const {
      titleClassName,
      title,
      width,
     } = this.props;

    const titleStyle = {
      width: width,
      textAlign: 'center',
      fontSize: '2em',
      paddingBottom: '1.3em'
    }

    return (
      <div
        style= {titleStyle}
        className={titleClassName}
      >
        {title}
      </div>
    )
  }
}
