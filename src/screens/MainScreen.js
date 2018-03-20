import React from 'react';

import {
  Alert,
  AsyncStorage,
  Dimensions,
  Navigator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


import { StackRouter, TabNavigator, StackNavigator } from 'react-navigation';

import DashboardStack from './DashboardScreen';
import ScheduleStack  from './ScheduleScreen';
import GuestsStack    from './GuestsScreen';
import MoreStack      from './MoreScreen';

import Toast from '../components/Toast';

import DataStore from '../DataStore';
import globalStyles from '../globalStyles';

let MainNavigator = TabNavigator({
  Home: {
    screen: DashboardStack,
    path: ''
  },
  Schedule: {
    screen: ScheduleStack,
    path: 'schedule'
  },
  Guests: {
    screen: GuestsStack,
    path: 'guests'
  },
  More: {
    screen: MoreStack,
    path: 'more'
  }
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    labelStyle: {
    },
    tabStyle: {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
});

export default class MainScreen extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    global.Store = new DataStore(resp => {
      let msg = resp.msg;

      console.log("msg", msg);

      global.makeToast(msg);
      this.setState({
        loaded: true
      });
    });
  }

  render() {
    let main;
    if (this.state.loaded) {
      main = <MainNavigator />
    } else {
      main = <Text>Loading...</Text>
    }
    return (
      <View style={[ styles.mainView, { paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight } ]}>
        { main }
        <Toast />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'gray',
    flex: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 12
  },
  loading: {
    backgroundColor: 'white',
    opacity: 0.5,
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0
  },
  navbar: {
    backgroundColor: globalStyles.COLORS.headerBg,
    borderBottomColor: '#324',
    borderBottomWidth: 1,
  },
  scene: {
    paddingTop: 63
  }
});
