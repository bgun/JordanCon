'use strict';

import _ from 'lodash';
import React from 'react';

import {
  FlatList,
  InteractionManager,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  constructor() {
    super();
    this.state = {
      sortField: 'name'
    }
  }

  handleSort(sortField) {
    this.setState({
      sortField: sortField
    });
  }

  render() {
    const guestsArray = global.Store.getGuests(this.state.sortField);
    return (
      <FlatList
        style={ styles.scroll }
        data={ guestsArray }
        renderItem={ ({item}) => <GuestItem showCount={ true } navigation={ this.props.navigation } key={ item.guest_id } guest_id={ item.guest_id } /> }
        stickyHeaderIndices={[0]}
        ListHeaderComponent={(
          <View style={ styles.listHeader }>
            <TouchableOpacity onPress={ () => this.handleSort('name') } style={[ styles.sortButton, { borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: this.state.sortField === 'name' ? global.Store.getColor('highlight') : '#EEE' }]}>
              <Text style={[ styles.sortButtonText, { color: this.state.sortField === 'name' ? 'white' : '#666' }] }>First Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => this.handleSort('last_name_first') } style={[ styles.sortButton, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: this.state.sortField === 'last_name_first' ? global.Store.getColor('highlight') : '#EEE' }]}>
              <Text style={[ styles.sortButtonText, { color: this.state.sortField === 'last_name_first' ? 'white' : '#666' }] }>Last Name</Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  listHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    height: 44,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sortButton: {
    alignItems: 'center',
    background: '#EEE',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 120
  },
  sortButtonText: {
  }
});
