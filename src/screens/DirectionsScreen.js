'use strict';

import React, { Component} from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation'

import { H1, H2, H3, H4 } from '../components/Headings';

import globalStyles from '../globalStyles';
import ExternalLink from '../components/ExternalLink';


export default class DirectionsView extends Component {

  static navigationOptions = { title: "Address & Directions" };

  render() {
    const { navigate } = this.props.navigation;

    let venue = global.Store.getVenueInfo();
    let phoneUrl = 'tel://'+venue.phone.replace(/[\W]/g, '');

    return (
      <ScrollView style={ styles.view }>
        <View style={{ marginHorizontal: 10 }}>
          <H3>Convention Maps</H3>
        </View>
        <TouchableOpacity style={[ styles.btn, { borderWidth: 0, backgroundColor: global.Store.getColor('highlight') } ]} onPress={ () => navigate("HotelMap") }>
          <Text style={ styles.btnText }>Hotel Map</Text>
        </TouchableOpacity>

        <View style={{ marginHorizontal: 10 }}>
          <H3>Hotel Info</H3>
        </View>
        <View style={ [styles.btn, { borderColor: global.Store.getColor('border') }] }>
          <ExternalLink url={ venue.maps_url }>
            <Text style={[ styles.address, { color: global.Store.getColor('highlightDark'), fontWeight: 'bold' }]}>{ venue.name }</Text>
            { venue.address.map(line => (
              <Text style={[styles.address, { color: global.Store.getColor('highlightDark') }]}>{ line }</Text>
            )) }
          </ExternalLink>
        </View>
        <View style={ [styles.btn, { borderColor: global.Store.getColor('border') }] }>
          <ExternalLink url={ phoneUrl }>
            <Text style={ [styles.phone, { color: global.Store.getColor('highlightDark') }] }>{ venue.phone }</Text>
          </ExternalLink>
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#FAFAFA',
    padding: 20
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center'
  },
  btn: {
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    padding: 10
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  phone: {
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
