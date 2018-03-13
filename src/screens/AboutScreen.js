'use strict';

import React, { Component } from 'react';

import {
  Alert,
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
  
    let aboutText, appText;
    if (global.con_data && global.con_data.content) {
      aboutText = global.con_data.content.aboutText;
      appText   = global.con_data.content.appText;
    };

    // extra view for padding the bottom. very annoying
    return (
      <ScrollView style={ styles.view }>
        <H1>About Mysticon</H1>
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
  }
});
