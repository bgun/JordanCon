'use strict';

import React, { Component } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import HtmlView from 'react-native-htmlview';

import { H1, H2, H3, H4 } from '../components/Headings';

import globalStyles from '../globalStyles';


export default class AboutView extends Component {

  static navigationOptions = { title: "About" };

  render() {
  
    let aboutText = global.Store.getContent('aboutText');
    let appText   = global.Store.getContent('appText');

    // extra view for padding the bottom. very annoying
    return (
      <ScrollView style={ styles.view }>
        <View style={{ flex: 1, width: window.width, height: 70, marginBottom: 10 }}>
          <Image resizeMode="contain" style={ styles.canvas } source={{ uri: global.Store.getImage('LOGO') }} />
        </View>
        <HtmlView value={ aboutText } />

        <View style={{ borderTopColor: globalStyles.COLORS.border, borderTopWidth: 1, paddingTop: 10, marginTop: 30 }} />

        <H3>About This App</H3>

        <HtmlView value={ appText } />

        <View style={{ height: 50 }} />
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#FAFAFA',
    flex: 1,
    padding: 20
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
