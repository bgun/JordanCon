import React, { Component } from 'react';

import {
  Linking,
  View,
  TouchableOpacity
} from 'react-native';

export default class ExternalLink extends React.Component {

  handlePress() {
    Linking.openURL(this.props.url);
  }

  render() {
    return (
      <TouchableOpacity onPress={ this.handlePress.bind(this) }>
        { this.props.children }
      </TouchableOpacity>
    );
  }

}
