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

import dataStore from '../dataStore';
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
      con_data: global.con_data || {},
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      todoCount: 999
    };
    this.getTodos();
  }

  componentWillUpdate() {
    this.getTodos();
  }

  getTodos() {
    if (global.con_data) {
      dataStore.fetchTodos()
        .then(todos => {
          let todosArray = Array.from(todos);
          todosArray = _(todosArray).map(todo => {
            return _.find(global.con_data.events, e => e.event_id === todo);
          }).filter(todo => !!todo).sortBy(["day", "time"]).value();

          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(todosArray),
            todoCount: todosArray.length
          });
        }).done();
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
          <Image style={{ height: 333, width: window.width }} source={{ uri: global.con_data.images.DASHBOARD }} />
          <Text style={ styles.todoTitleText }>MY TO-DO LIST</Text>
          { this.state.todoCount > 0 ? (
          <ListView
            tabLabel="My Todo List"
            style={{ flex: 1, width: window.width }}
            removeClippedSubviews={ false }
            dataSource={ this.state.dataSource }
            renderRow={ rowData => <EventItem key={ rowData.event_id } navigation={ this.props.navigation } event_id={ rowData.event_id } /> }
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
