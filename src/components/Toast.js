import React from 'react';

import {
  Animated,
  View,
  StyleSheet,
  Text
} from 'react-native';


export default class Toast extends React.Component {

  constructor() {
    super();
    this.state = {
      bgColor: this.getBgColor(),
      bottom: new Animated.Value(-60),
      text: 'ERROR'
    }
  }

  getBgColor(type) {
    let colorsMap = {
      default: "black",
      error: '#C00'
    };
    if (type && colorsMap[type]) {
      return colorsMap[type];
    } else {
      return colorsMap["default"];
    }
  }

  componentWillMount() {
    global.makeToast = (text, type) => {
      this.setState({
        text: text,
        bgColor: this.getBgColor(type)
      });

      // add
      Animated.timing(
        this.state.bottom,
        { toValue: 90 }
      ).start();

      // remove
      setTimeout(() => {
        Animated.timing(
          this.state.bottom,
          { toValue: -100 }
        ).start();
      }, 2000);
    }
  }

  render() {
    return (
      <Animated.View style={[ styles.toast, { backgroundColor: this.state.bgColor, bottom: this.state.bottom } ]}>
        <Text style={ styles.text }>{ this.state.text }</Text>
      </Animated.View>
    );
  }

}


let styles = StyleSheet.create({
  toast: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    opacity: 0.9,
    paddingHorizontal: 30,
    paddingVertical: 10,
    position: 'absolute',
      left: 50,
      right: 50,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  text: {
    backgroundColor: 'transparent',
    color: 'white',
    flex: 1,
    fontSize: 14
  }
});
