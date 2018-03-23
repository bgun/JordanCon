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

import Icon from 'react-native-vector-icons/Entypo';

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
        <TouchableOpacity style={ styles.btn } onPress={ () => navigate("HotelMap") }>
          <Text style={ styles.btnText }>Hotel Map</Text>
        </TouchableOpacity>

        <View style={{ marginHorizontal: 10 }}>
          <H3>Hotel Info</H3>
        </View>
        <View style={ styles.btn }>
          <ExternalLink url={ venue.maps_url }>
            <Text style={[ styles.address, { fontWeight: 'bold' }]}>{ venue.name }</Text>
            { venue.address.map(line => (
              <Text style={ styles.address }>{ line }</Text>
            )) }
          </ExternalLink>
        </View>
        <View style={ styles.btn }>
          <ExternalLink url={ phoneUrl }>
            <Text style={ styles.phone }>{ venue.phone }</Text>
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
    color: globalStyles.COLORS.highlightDark,
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center'
  },
  btn: {
    borderColor: globalStyles.COLORS.border,
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    padding: 10
  },
  btnText: {
    color: '#548',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  phone: {
    color: globalStyles.COLORS.highlightDark,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
