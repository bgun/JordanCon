'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import globalStyles from '../globalStyles';


export default class GuestItem extends Component {

  render() {
    let { navigate } = this.props.navigation;

    let guest = global.Store.getGuestById(this.props.guest_id);
    return (
      <TouchableOpacity style={[globalStyles.floatingListItem, styles.item]} onPress={ () => navigate("GuestDetail", { guest_id: guest.guest_id }) }>
        <Text style={ styles.text }>{ guest.name }</Text>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  text: {
    fontSize: 16,
  }
});
