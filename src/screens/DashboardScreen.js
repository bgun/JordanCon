'use strict';

import React, { Component } from 'react';

import {
  AsyncStorage,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Icon from 'react-native-vector-icons/Entypo';

import _ from 'lodash';

import EventItem from '../components/EventItem';

import CustomEventScreen from './CustomEventScreen';
import EventDetailScreen from './EventDetailScreen';

import globalStyles from '../globalStyles';


let window = Dimensions.get('window');

let getHeroHeight = function() {
  return window.width * 0.9;
}


class DashboardScreen extends Component {

  static navigationOptions = {
    title: "Dashboard"
  };

  constructor(props) {
    super();
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
  }

  componentWillMount() {
    this._focusSub = this.props.navigation.addListener('didFocus', () => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this._focusSub.remove();
  }

  render() {
    let dataSource = this.state.dataSource.cloneWithRows(global.Store.getTodosArray());

    return (
      <View style={ styles.container }>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
          <Image style={{ height: getHeroHeight(), width: window.width }} source={{
            uri: global.Store.getImage('DASHBOARD'),
            cache: 'force-cache'
          }} />
          <Text style={ styles.todoTitleText }>MY TO-DO LIST</Text>
          { global.Store.getTodosArray().length > 0 ? (
          <ListView
            tabLabel="My Todo List"
            style={{ flex: 1, width: window.width }}
            removeClippedSubviews={ false }
            dataSource={ dataSource }
            renderRow={ rowData => <EventItem key={ rowData.event_id } navigation={ this.props.navigation } event_id={ rowData.event_id } /> }
          />
          ) : (
          <View style={ styles.todoEmpty }>
            <Text style={ styles.todoEmptyText }>Your to-do list is empty. Select events from the Schedule to add them here.</Text>
          </View>
          ) }
          <TouchableOpacity style={ [styles.customEventButton, { backgroundColor: global.Store.getColor('highlightAlt') }] } onPress={ () => { this.props.navigation.navigate("CustomEvent", { subject: this.props.subject }) } }>
            <Text style={ styles.customEventButtonText }>Add Custom To-Do</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

}

export default StackNavigator({
  "Dashboard"   : { screen: DashboardScreen },
  "CustomEvent" : { screen: CustomEventScreen },
  "EventDetail" : { screen: EventDetailScreen }
}, {
  navigationOptions: {
    tabBarLabel: "Home",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" size={ 24 } color={ tintColor } />
    )
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#DDE',
    flex: 1,
    justifyContent: 'center'
  },
  todoTitleText: {
    borderBottomWidth: 1,
    borderBottomColor: '#F00',
    color: '#778',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  todoEmpty: {
    backgroundColor: 'white',
    borderTopColor: '#AAA',
    borderBottomColor: '#AAA',
    alignItems: 'center',
    flex: 1,
    height: 100,
    padding: 30,
    width: window.width
  },
  todoEmptyText: {
    color: '#777',
    textAlign: 'center'
  },
  customEventButton: {
    alignItems: 'center',
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
    margin: 10
  },
  customEventButtonText: {
    color: 'white'
  }
});
