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

  componentDidMount() {
    /*
    "Peek" the scroll
    setTimeout(() => {
      this.refs["headerPhotos"].scrollTo({ x: 20, animated: true });
    }, 1000);
    setTimeout(() => {
      this.refs["headerPhotos"].scrollTo({ x: 0, animated: true });
    }, 2000);
    */
  }

  componentWillUnmount() {
    this._focusSub.remove();
  }

  render() {
    let todos = _.sortBy(global.Store.getTodosArray(), ["day", "time"]);
    let dataSource = this.state.dataSource.cloneWithRows(todos);
    let headerPhotos = global.Store.getHeaderPhotos();

    return (
      <View style={ styles.container }>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
          <ScrollView horizontal={ true } snapToInterval={ window.width } decelerationRate="fast" ref="headerPhotos">
            { headerPhotos.map((photo, index) => (
              <View style={{ width: window.width, height: getHeroHeight() }}>
                <Image style={{ height: getHeroHeight(), width: window.width }} source={{
                  uri: photo.src,
                  cache: 'force-cache'
                }} />

                { index < headerPhotos.length - 1 ? (
                  <View style={{ backgroundColor: "#00000088", position: 'absolute', right: 5, top: (getHeroHeight() / 2)-30, paddingHorizontal: 1, paddingVertical: 10, borderRadius: 10 }}>
                    <Icon size={ 20 } name="chevron-right" color="white" />
                  </View>
                ) : null }

                { photo.description ? (
                  <View style={{ backgroundColor: "#000000AA", padding: 10, position: "absolute", bottom: 0 }}>
                    <Text style={{ color: "white" }}>{ photo.description }</Text>
                  </View>
                ) : null }
              </View>
            ))}
          </ScrollView>
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
