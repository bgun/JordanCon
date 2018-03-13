import React, { Component } from 'react';

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { StackNavigator } from 'react-navigation'

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';

let window = Dimensions.get('window');

import AboutScreen      from './AboutScreen';
import DirectionsScreen from './DirectionsScreen';
import FeedbackScreen   from './FeedbackScreen';
import HotelMapScreen   from './HotelMapScreen';


class MenuItem extends React.Component {

  render() {
    return (
      <TouchableOpacity style={ styles.menuItem } onPress={ () => this.props.navigation.navigate(this.props.link) }>
        <Icon name={ this.props.icon } size={16} />
        <View style={{ width: 16 }} />
        <Text style={ styles.menuItemText }>{ this.props.text }</Text>
      </TouchableOpacity>
    )
  }
}

class MoreScreen extends React.Component {

  render() {
    return (
      <ScrollView style={ styles.container }>
        <MenuItem key="directions" link="Directions" text="Address & Directions" icon="pin"    { ...this.props } />
        <MenuItem key="hotelmap"   link="HotelMap"   text="Hotel Map"            icon="map"    { ...this.props } />
        <MenuItem key="feedback"   link="Feedback"   text="Feedback"             icon="pencil" { ...this.props } />
        <MenuItem key="about"      link="About"      text="About"                icon="help"   { ...this.props } />
      </ScrollView>
    )
  }

}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    height: window.height,
  },
  menuItem: {
    borderBottomColor: '#00000033',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 16,
    width: window.width,
  },
  menuItemText: {
    fontSize: 16
  }
});


export default StackNavigator({
  MoreScreen :  { screen: MoreScreen },
  Directions : { screen: DirectionsScreen },
  About      : { screen: AboutScreen },
  HotelMap   : { screen: HotelMapScreen },
  Feedback   : { screen: FeedbackScreen }
}, {
  navigationOptions: {
    title: "More",
    tabBarLabel: "More",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="dots-three-horizontal" size={ 24 } color={ tintColor } />
    )
  }
});
