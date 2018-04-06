'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  Dimensions,
  Image,
  MapView,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';

let window = Dimensions.get('window');


export default class HotelMapScreen extends React.Component {

  static navigationOptions = {
    title: "Hotel Map"
  };

  constructor() {
    super();
    this.state = {
      scale: 1,
      mapX: -global.Store.getDimension('HOTEL_MAP_WIDTH') / 4,
      mapY: -global.Store.getDimension('HOTEL_MAP_HEIGHT') / 4
    }
  }

  onMapZoomIn() {
    let newScale = this.scale * 1.2;
    if (newScale > 2) {
      newScale = 2;
    }
    this.setState({
      scale: newScale
    });
  }

  onMapZoomOut() {
    console.log("out");
    let newScale = this.scale * 0.8;
    if (newScale < 0.5) {
      newScale = 0.5;
    }
    this.setState({
      scale: newScale
    });
  }

  componentWillMount() {
    this._lastLeft = this.state.mapX;
    this._lastTop  = this.state.mapY;

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        this.setState({
          mapX: this._lastLeft + gestureState.dx,
          mapY: this._lastTop  + gestureState.dy
        });
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderEnd: (evt, gestureState) => {
        this._lastLeft += gestureState.dx;
        this._lastTop  += gestureState.dy;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  render() {
    const HOTEL_MAP_WIDTH  = global.Store.getDimension('HOTEL_MAP_WIDTH');
    const HOTEL_MAP_HEIGHT = global.Store.getDimension('HOTEL_MAP_HEIGHT');
    const scale = this.state.scale;
    
    return (
      <ScrollView style={ styles.container }
        {...this._panResponder.panHandlers}
        maximumZoomScale={ 2 }
        bounces={ false }
      >
        <Image
          style={[ styles.map, { width: HOTEL_MAP_WIDTH * scale, height: HOTEL_MAP_HEIGHT * scale, left: this.state.mapX, top: this.state.mapY } ]}
          source={{ uri: global.Store.getImage('HOTEL_MAP'), cache: 'force-cache' }}
        />
      </ScrollView>
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
