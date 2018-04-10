'use strict';

import React, { Component } from 'react';

import {
  Dimensions,
  InteractionManager,
  Modal,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import moment from 'moment';
import _ from 'lodash';

import { StackNavigator } from 'react-navigation';

import EventItem from '../components/EventItem';

import EventDetailScreen from './EventDetailScreen';
import GuestDetailScreen from './GuestDetailScreen';
import FeedbackScreen    from './FeedbackScreen';

import globalStyles from '../globalStyles';

import Icon from 'react-native-vector-icons/Entypo';

let window = Dimensions.get('window');


class TrackItem extends Component {
  render() {
    return (
      <TouchableOpacity key={ this.props.track } onPress={ () => this.props.onPress(this.props.track) } style={ styles.modalTrackItem }>
        <Text style={{ fontSize: 16 }}>{ this.props.track }</Text>
      </TouchableOpacity>
    );
  }
};


class TrackModal extends Component {
  render() {
    return (
      <Modal animationType="fade" transparent={ true } visible={ this.props.isVisible }>
        <View style={ styles.modalContainer }>
          <View style={ styles.modalBody }>
            <ScrollView>
              <View style={ styles.modalTitle }><Text style={{ color: '#333', fontWeight: 'bold' }}>Choose a track to view:</Text></View>
              <TouchableOpacity onPress={ this.props.onCancel } style={ styles.modalCancelBtn }>
                <Text style={{ color: '#E00' }}>Cancel</Text>
              </TouchableOpacity>
              { global.Store.getTrackNames().map(track => <TrackItem track={ track } onPress={ this.props.onTrackChange } /> ) }
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}


class ScheduleScreen extends Component {

  static navigationOptions = {
    title: "Schedule"
  };

  constructor(props) {
    super();

    this.state = {
      currentTrack: global.Store.getDefaultTrack(),
      modalVisible: false,
      searchResults: []
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

  handleFilterInput(text) {
    if (text.length > 2) {
      let filteredEvents = global.Store.searchEvents(text);
      this.setState({
        searchResults: filteredEvents,
        filterText: text
      });
    } else {
      this.setState({
        searchResults: [],
        filterText: text
      });
    }
  }

  onModalCancel() {
    this.setState({
      modalVisible: false
    });
  }

  onTrackChange(track) {
    this.setState({
      currentTrack: track,
      modalVisible: false
    });
  }

  renderSectionHeader(data) {
    if (data && data.section) {
      return (
        <Text style={[styles.sectionHeader, { backgroundColor: global.Store.getColor('highlight') }]}>{ data.section.title }</Text>
      );
    } else {
      return null;
    }
  }

  renderItem(rowData) {
    const item = rowData.item;
    return <EventItem navigation={ this.props.navigation } key={ item.event_id } event_id={ item.event_id } />;
  }

  render() {
    let sections = [];
    let lastDay = null;
    global.Store.getEventsByTrack(this.state.currentTrack).forEach(item => {
      if (lastDay === item.day) {
        sections[sections.length-1].data.push(item);
      } else {
        const title = moment(item.day+" "+item.time).format('dddd, MMMM D').toUpperCase();
        sections.push({
          title: title,
          data: [item]
        });
        lastDay = item.day;
      }
    });

    return (
      <View style={{ flex: 1 }}>
        { this.state.searchResults.length ? (
          <View>
            <View style={[styles.section, { backgroundColor: global.Store.getColor('highlight'), marginTop: 80 }]}><Text style={ styles.sectionText }>SEARCH RESULTS</Text></View>
            <ScrollView style={ styles.searchResults }>
              { this.state.searchResults.map(sr => (
                <EventItem navigation={ this.props.navigation } key={ sr.event_id } event_id={ sr.event_id } />
              ) ) }
            </ScrollView>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={ styles.showTrackModalBtn }
              onPress={() => {
                this.setState({ modalVisible: true });
              }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>{ this.state.currentTrack }</Text>
              <Icon size={ 18 } color={ '#000000AA' } name="chevron-down" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <SectionList
              style={ styles.scroll }
              sections={ sections }
              renderItem={ this.renderItem.bind(this) }
              renderSectionHeader={ this.renderSectionHeader.bind(this) }
              keyExtractor={(item, index) => item.event_id }
            />
          </View>
        ) }
        <View style={ styles.filterContainer }>
          <Icon style={ styles.searchIcon } name="magnifying-glass" size={ 24 } color={ '#00000066' } />
          <TextInput placeholder="Search all events" style={ styles.filterInput } value={ this.state.filterText } onChangeText={ this.handleFilterInput.bind(this) } />
        </View>
 
        <TrackModal isVisible={ this.state.modalVisible } onCancel={ this.onModalCancel.bind(this) } onTrackChange={ this.onTrackChange.bind(this) } />
      </View>
    );
  }
}

export default StackNavigator({
  "Schedule":     { screen: ScheduleScreen },
  "EventDetail" : { screen: EventDetailScreen },
  "GuestDetail" : { screen: GuestDetailScreen },
  "Feedback"    : { screen: FeedbackScreen },
}, {
  navigationOptions: {
    tabBarLabel: "Schedule",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="calendar" size={ 24 } color={ tintColor } />
    )
  }
});




const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: 'white',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    height: 40,
    paddingHorizontal: 10,
    position: 'absolute',
      top: 0,
      left: 0,
    width: window.width
  },
  filterInput: {
    fontSize: 15,
    height: 40,
    paddingLeft: 30
  },
  modal: {
    display: 'flex',
    flexDirection: 'column'
  },
  modalBody: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginTop: 40,
    marginBottom: 40,
    padding: 10
  },
  modalContainer: {
    backgroundColor: '#DDDDDDCC',
    display: 'flex',
    flex: 1,
    padding: 20
  },
  modalCancelBtn: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: 50
  },
  modalTitle: {
    alignItems: 'center',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 5,
    height: 50
  },
  modalTrackItem: {
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 5,
    height: 50
  },
  scroll: {
    backgroundColor: '#DDD',
    flex: 1,
    marginTop: 90
  },
  searchIcon: {
    position: 'absolute',
      top: 7,
      left: 8 
  },
  searchResults: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    height: window.height - 40,
    marginTop: 40,
    position: 'absolute',
      left: 0,
    width: window.width
  },
  sectionHeader: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.85,
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  showTrackModalBtn: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
    position: 'absolute',
      top: 40,
      height: 40,
    width: window.width - 10
  }
});
