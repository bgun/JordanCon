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


export default class MoreContentScreen extends Component {

  render() {
    const label = this.props.navigation.state.params.label;
    const content = global.Store.getContentByLabel(label);

    return (
      <ScrollView style={ styles.view }>
        { content.header_image ? (
          <View style={{ flex: 1, width: window.width, height: 70, marginBottom: 20 }}>
            <Image
              resizeMode="contain" style={ styles.canvas }
              source={{ uri: content.header_image, cache: 'force-cache' }}
            />
          </View>
        ) : null }

        { content.content_sections.map(section => (
          <HtmlView value={ section } stylesheet={ htmlStyles } />
        ) ) }

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
const htmlStyles = StyleSheet.create({
  h3: {
    fontSize: 25,
    paddingTop: 20
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderColor: '#DDD',
    paddingTop: 20,
    marginTop: 20
  },
  p: {
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 5,
    margin: 0
  },
  strong: {
    fontWeight: 'bold'
  }
});
