'use strict';

import _ from 'lodash';
import React from 'react';

import {
  InteractionManager,
  ListView,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation'

import Icon from 'react-native-vector-icons/Entypo';

import GuestItem from '../components/GuestItem';

import GuestDetailScreen from './GuestDetailScreen';
import EventDetailScreen from './EventDetailScreen';


class GuestsList extends React.Component {

  static navigationOptions = {
    title: "Guests",
    tabBarLabel: "Guests",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="users" size={ 24 } color={ tintColor } />
    )
  };

  constructor(props) {
    super();
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let sortedGuests = _.sortBy(global.con_data.guests, 'name');
    this.state = {
      dataSource: ds.cloneWithRows(sortedGuests)
    };
  }

  render() {
    return (
      <ListView
        style={ styles.scroll }
        removeClippedSubviews={ false }
        dataSource={ this.state.dataSource }
        renderRow={ rowData => <GuestItem navigation={ this.props.navigation } key={ rowData.guest_id } guest_id={ rowData.guest_id } /> }
      />
    );
  }

}

export default StackNavigator({
  "GuestsList"  : { screen: GuestsList },
  "EventDetail" : { screen: EventDetailScreen },
  "GuestDetail" : { screen: GuestDetailScreen }
}, {
  navigationOptions: {
    tabBarLabel: "Guests",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="users" size={ 24 } color={ tintColor } />
    )
  }
});


const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});
