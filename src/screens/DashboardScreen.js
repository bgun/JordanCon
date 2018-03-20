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


let window = Dimensions.get('window');


class DashboardScreen extends Component {

  static navigationOptions = {
    title: "Dashboard",
    tabBarLabel: "Home",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" size={ 24 } color={ tintColor } />
    )
  };

  constructor(props) {
    super();
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      todoCount: 999
    };
  }

  render() {
    let dataSource = this.state.dataSource.cloneWithRows(global.Store.getTodosArray());

    return (
      <View style={ styles.container }>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
          <Image style={{ height: 333, width: window.width }} source={{ uri: global.Store.getImage('DASHBOARD') }} />
          <Text style={ styles.todoTitleText }>MY TO-DO LIST</Text>
          { this.state.todoCount > 0 ? (
          <ListView
            tabLabel="My Todo List"
            style={{ flex: 1, width: window.width }}
            removeClippedSubviews={ false }
            dataSource={ dataSource }
            renderRow={ rowData => <EventItem key={ rowData } navigation={ this.props.navigation } event_id={ rowData } /> }
          />
          ) : (
          <View style={ styles.todoEmpty }>
            <Text style={ styles.todoEmptyText }>Your to-do list is empty. Select events from the Schedule to add them here.</Text>
          </View>
          ) }
        </ScrollView>
      </View>
    );
  }

}

export default StackNavigator({
  Dashboard : { screen: DashboardScreen }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#DDE',
    flex: 1,
    justifyContent: 'center'
  },
  todoTitleText: {
    color: '#778',
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 6
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
  }
});
