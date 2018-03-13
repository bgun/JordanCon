'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import _      from 'lodash';
import moment from 'moment';

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';


export default class EventItem extends Component {

  constructor(props) {
    super();

    let event = _.find(global.con_data.events, e => (e.event_id === props.event_id));
    if (!event) {
      throw new Error("Event not found!");
    }

    this.state = {
      event_id: event.event_id,
      title: event.title,
      location: event.location,
      datetime: moment(event.day+" "+event.time).format('dddd h:mma'),
      isTodo: global.todos.has(event.event_id)
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <TouchableOpacity style={[globalStyles.floatingListItem, styles.item]} onPress={ () => navigate("EventDetail", { navigation: this.props.navigation, event_id: this.state.event_id }) }>
        <View style={{ flex: 1 }}>
          <Text style={ styles.titleText }>{ this.state.title }</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={ styles.timeText  }>{ this.state.datetime }</Text>
            <Text style={ styles.locationText  }>{ this.state.location }</Text>
          </View>
        </View>
        { this.state.isTodo ? (
          <Icon name="star" color={ globalStyles.COLORS.highlight } size={20} style={{ paddingTop: 8, paddingRight: 8 }} />
        ) : null }
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12
  },
  titleText: {
    fontSize: 16
  },
  timeText: {
    color: '#666666',
    fontSize: 13
  },
  locationText: {
    color: '#77F',
    fontSize: 13,
    marginLeft: 13
  }
});
