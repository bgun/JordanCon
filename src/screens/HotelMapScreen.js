'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  Dimensions,
  Image,
  MapView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import globalStyles from '../globalStyles';
import ImageViewer from 'react-native-image-zoom-viewer';

let window = Dimensions.get('window');


export default class HotelMapScreen extends React.Component {

  static navigationOptions = {
    title: "Hotel Map"
  };

  render() {
    const HOTEL_MAP_WIDTH  = global.Store.getDimension('HOTEL_MAP_WIDTH');
    const HOTEL_MAP_HEIGHT = global.Store.getDimension('HOTEL_MAP_HEIGHT');
    
    return (
      <View style={ styles.container }>
        <ImageViewer
          renderIndicator={ () => {} }
          imageUrls={[{ url: global.Store.getImage('HOTEL_MAP') }]}
        />
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#BBBBBB',
    flex: 1
  },
  map: {
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 5,
    position: 'absolute'
  },
  zoomButton: {
    display: 'none',
    position: 'absolute',
      right: 10
  }
});
