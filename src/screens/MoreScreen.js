import React, { Component } from 'react';

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { StackNavigator } from 'react-navigation'

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';

let window = Dimensions.get('window');

import MoreContentScreen from './MoreContentScreen';
import DirectionsScreen  from './DirectionsScreen';
import FeedbackScreen    from './FeedbackScreen';
import HotelMapScreen    from './HotelMapScreen';


const SETTINGS_DESC = {
  "hidePastEvents_true":  "ON. Events and to-do items more than 2 hours old are hidden.",
  "hidePastEvents_false": "OFF. All events in the Schedule and on your to-do list are displayed."
};


class MenuItem extends React.Component {
  render() {
    return (
      <TouchableOpacity style={ styles.menuItem } onPress={ () => this.props.navigation.navigate(this.props.link) }>
        <Icon name={ this.props.icon } size={16} color={ global.Store.getColor('highlightDark') } />
        <View style={{ width: 16 }} />
        <Text style={ styles.menuItemText }>{ this.props.label }</Text>
      </TouchableOpacity>
    )
  }
}

class MoreContentMenuItem extends React.Component {
  render() {
    return (
      <TouchableOpacity style={ styles.menuItem } onPress={ () => this.props.navigation.navigate('MoreContent', { label: this.props.label }) }>
        <Icon name={ this.props.icon } size={16} color={ global.Store.getColor('highlightDark') } />
        <View style={{ width: 16 }} />
        <Text style={ styles.menuItemText }>{ this.props.label }</Text>
      </TouchableOpacity>
    )
  }
}

class MoreScreen extends React.Component {

  constructor() {
    super();
    this.state = Object.assign({}, global.Store.getSettings());
  }

  onHidePastEventsSwitch(bool) {
    const update = { hidePastEvents: bool };
    this.setState(update);
    global.Store.updateSettings(update);
  }

  render() {
    return (
      <ScrollView style={ styles.container }>
        <MenuItem key="directions" link="Directions" label="Address & Directions" icon="pin"    { ...this.props } />
        <MenuItem key="hotelmap"   link="HotelMap"   label="Hotel Map"            icon="map"    { ...this.props } />
        <MenuItem key="feedback"   link="Feedback"   label="Feedback"             icon="pencil" { ...this.props } />
        { global.Store.getSortedContentItems().map(item => (
          <MoreContentMenuItem key={ item.label } label={ item.label } icon={ item.label_icon } { ...this.props } />
        ) ) }

        <Text style={ styles.settingsTitle }>SETTINGS</Text>
        <View style={ styles.settingContainer }>
          <View style={ styles.switchContainer }>
            <Text style={{ fontSize: 18 }}>Hide past events</Text>
            <Switch value={ this.state.hidePastEvents } onValueChange={ this.onHidePastEventsSwitch.bind(this) } />
          </View>
          <Text style={ styles.settingDescriptionText }>
            { SETTINGS_DESC["hidePastEvents_"+this.state.hidePastEvents] }
          </Text>
        </View>
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
    fontSize: 18
  },
  settingsTitle: {
    backgroundColor: '#DDD',
    borderBottomWidth: 1,
    borderBottomColor: '#F00',
    color: '#778',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  settingContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    padding: 15
  },
  switchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  settingDescriptionText: {
    fontSize: 15,
    paddingVertical: 5,
    width: window.width * 0.7
  }
});


export default StackNavigator({
  MoreScreen : { screen: MoreScreen },
  Directions : { screen: DirectionsScreen },
  MoreContent: { screen: MoreContentScreen },
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
