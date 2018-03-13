import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Entypo';


class TabIcon extends React.Component {
  render() {
    return (
      <TouchableOpacity style={ styles.tab } onPress={ this.props.onPress }>
        <Icon name={ this.props.icon } color='#558' size={ this.props.iconSize || 20 } />
        <Text style={{ color: '#335' }}>{ this.props.text }</Text>
      </TouchableOpacity>
    );
  }
}

export default class Tabbers extends React.Component {

  constructor() {
    super();
    this.state = {
      selected: 0
    }
  }

  handlePress(action) {
    if (action === "menu") {
      this.props.onPressMenuButton();
      return;
    } else {
      Actions[action]();
    }
    this.setState({
      selected: action
    });
  }

  render() {
    return (
      <View style={ styles.container }>
        <TabIcon onPress={ this.handlePress.bind(this, "dashboard") } icon="home"                  text="Home" />
        <TabIcon onPress={ this.handlePress.bind(this, "schedule" ) } icon="calendar"              text="Schedule" />
        <TabIcon onPress={ this.handlePress.bind(this, "guests"   ) } icon="users"                 text="Guests" />
        <TabIcon onPress={ this.handlePress.bind(this, "menu"     ) } icon="dots-three-horizontal" text="More" />
      </View>
    );
  }

}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 54
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 8
  }
});