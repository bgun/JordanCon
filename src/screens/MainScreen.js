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


import { StackRouter, createAppContainer, createBottomTabNavigator } from 'react-navigation';

import { Entypo } from '@expo/vector-icons';

import DashboardStack from './DashboardScreen';
import ScheduleStack  from './ScheduleScreen';
import GuestsStack    from './GuestsScreen';
import MoreStack      from './MoreScreen';
import LoadingScreen  from './LoadingScreen';

import Toast from '../components/Toast';

import DataStore from '../DataStore';
import globalStyles from '../globalStyles';

const iconNameMap = {
  "Home" : "home",
  "Schedule": "calendar",
  "Panelists": "users",
  "More": "dots-three-horizontal"
};

let MainNavigator = createBottomTabNavigator({
  Home: {
    screen: DashboardStack,
    path: ''
  },
  Schedule: {
    screen: ScheduleStack,
    path: 'schedule'
  },
  Panelists: {
    screen: GuestsStack,
    path: 'guests'
  },
  More: {
    screen: MoreStack,
    path: 'more'
  }
}, {
  tabBarPosition: 'bottom',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      return <Entypo name={ iconNameMap[routeName] } size={ 24 } color={ tintColor } />;
    },
  }),
  tabBarOptions: {
    activeTintColor: "#333",
    style: {
      height: 50
    },
    labelStyle: {
      paddingLeft: 0,
      marginLeft: 0,
      marginRight: 0
    },
    tabStyle: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      paddingTop: 10,
      paddingLeft: 0,
      paddingRight: 0
    } 
  }
});
const AppContainer = createAppContainer(MainNavigator);

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
      main = <AppContainer />
    } else {
      main = <LoadingScreen />
    }
    return (
      <View style={[ styles.mainView, { paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight } ]}>
        <StatusBar barStyle="dark-content" />
        { main }
        <Toast />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#AAA',
    flex: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 12
  },
  scene: {
    paddingTop: 63
  }
});
