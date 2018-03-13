'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  Dimensions,
  Image,
  MapView,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native';

import globalStyles from '../globalStyles';

let window = Dimensions.get('window');


export default class HotelMapScreen extends React.Component {

  static navigationOptions = {
    title: "Hotel Map"
  };

  constructor() {
    super();
    this.state = {
      mapX: -200,
      mapY: -30
    }
  }

  componentWillMount() {
    this._lastLeft = this.state.mapX;
    this._lastTop  = this.state.mapY;

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        console.log(gestureState);
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
    const HOTEL_MAP_WIDTH  = global.con_data.dimensions.HOTEL_MAP_WIDTH;
    const HOTEL_MAP_HEIGHT = global.con_data.dimensions.HOTEL_MAP_HEIGHT;
    
    return (
      <View style={ styles.container } {...this._panResponder.panHandlers}>
        <Image
          style={[ styles.map, { width: HOTEL_MAP_WIDTH, height: HOTEL_MAP_HEIGHT, left: this.state.mapX, top: this.state.mapY } ]}
          source={{ uri: global.con_data.images.HOTEL_MAP }}
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
    borderColor: globalStyles.COLORS.border,
    borderWidth: 5,
    position: 'absolute'
  }
});
