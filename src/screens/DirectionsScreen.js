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
          <ExternalLink url="https://www.google.com/maps/place/Holiday+Inn+Roanoke-Tanglewood-Rt+419%26i581/@37.2252603,-79.986239,17z">
            <Text style={[ styles.address, { fontWeight: 'bold' }]}>Holiday Inn – Tanglewood</Text>
            <Text style={ styles.address }>4468 Starkey Road, SW</Text>
            <Text style={ styles.address }>Roanoke, VA 24018</Text>
          </ExternalLink>
        </View>
        <View style={ styles.btn }>
          <ExternalLink url="tel://5407744400">
            <Text style={ styles.phone }>540-774-4400</Text>
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
