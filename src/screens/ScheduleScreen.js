'use strict';

import React, { Component } from 'react';

import {
  Dimensions,
  InteractionManager,
  ListView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
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

let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


class ScheduleScreen extends Component {

  static navigationOptions = {
    title: "Schedule"
  };

  constructor(props) {
    super();

    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };

    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID+':'+rowID];
    };

    let dataBlob = {};
    let sectionIDs = [];
    let rowIDs     = [];
    let currentDay = null;

    _.sortBy(global.con_data.events, ["day", "time"]).forEach(e => {
      let d = moment(e.day+e.time, "YYYY-MM-DDThh:mm:ss");
      let day = days[d.day()];
      if (day !== currentDay) {
        console.log("new day", d, d.day());
        sectionIDs.push(day);
        dataBlob[day] = d;
        rowIDs.push([]);
        currentDay = day;
      }
      rowIDs[rowIDs.length-1].push(e.event_id);
      dataBlob[day+':'+e.event_id] = e;
    });

    let ds = new ListView.DataSource({
      getRowData     : getRowData,
      getSectionData : getSectionData,
      rowHasChanged           : (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      modalVisible: false,
      searchResults: []
    };
  }

  handleFilterInput(text) {
    if (text.length > 2) {
      let filteredEvents = global.con_data.events.filter(e => {
        return e.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      this.setState({
        searchResults: filteredEvents,
        filterText: text
      });
      console.log("Displaying events", filteredEvents);
    } else {
      this.setState({
        searchResults: [],
        filterText: text
      });
    }
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionText }>
          { sectionData.format('dddd, MMMM D').toUpperCase() }
        </Text>
      </View>
    );
  }

  renderRow(rowData) {
    return <EventItem navigation={ this.props.navigation } key={ rowData.event_id } event_id={ rowData.event_id } />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        { this.state.searchResults.length ? (
          <View>
            <View style={[styles.section, { marginTop: 39 }]}><Text style={ styles.sectionText }>SEARCH RESULTS</Text></View>
            <ScrollView style={ styles.searchResults }>
              { this.state.searchResults.map(sr => (
                <EventItem navigation={ this.props.navigation } key={ sr.event_id } event_id={ sr.event_id } />
              ) ) }
            </ScrollView>
          </View>
        ) : (
          <ListView
            style={ styles.scroll }
            dataSource={ this.state.dataSource }
            renderRow={ this.renderRow.bind(this) }
            renderSectionHeader={ this.renderSectionHeader }
          />
        ) }
        <View style={ styles.filterContainer }>
          <Icon style={ styles.searchIcon } name="magnifying-glass" size={ 24 } color={ '#00000066' } />
          <TextInput placeholder="Search for an event" style={ styles.filterInput } value={ this.state.filterText } onChangeText={ this.handleFilterInput.bind(this) } />
        </View>
        
        <Modal
          animationType="fade"
          transparent={ true }
          visible={ this.state.modalVisible }>
          <View style={{ backgroundColor: '#FFF', flex: 1, display: 'flex', padding: 20, marginLeft: 20, marginRight: 20, marginTop: 40, marginBottom: 40 }}>
            <View>
              <TouchableHighlight
                onPress={ () => {
                  this.setState({ modalVisible: !this.state.modalVisible })
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
              <ScrollView style={ styles.container }>
                <MenuItem key="directions" link="Directions" text="Address & Directions" icon="pin"    { ...this.props } />
                <MenuItem key="hotelmap"   link="HotelMap"   text="Hotel Map"            icon="map"    { ...this.props } />
                <MenuItem key="feedback"   link="Feedback"   text="Feedback"             icon="pencil" { ...this.props } />
                <MenuItem key="about"      link="About"      text="About"                icon="help"   { ...this.props } />
              </ScrollView>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={{ position: 'absolute', width: window.width, top: 39, backgroundColor: 'red' }}
          onPress={() => {
            this.setState({ modalVisible: true });
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default StackNavigator({
  "Schedule":     { screen: ScheduleScreen },
  "EventDetail" : { screen: EventDetailScreen },
  "GuestDetail" : { screen: GuestDetailScreen },
  "Feedback"    : { screen: FeedbackScreen }
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
    borderBottomColor: '#DDDDDD',
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
  scroll: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginTop: 80
  },
  searchIcon: {
    position: 'absolute',
      top: 7,
      left: 8 
  },
  searchResults: {
    backgroundColor: '#F8F8F8',
    height: window.height - 40,
    marginTop: 39,
    position: 'absolute',
      left: 0,
    width: window.width
  },
  searchResultsHeader: {
    backgroundColor: globalStyles.COLORS.highlight,
    marginTop: 39,
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  section: {
    backgroundColor: globalStyles.COLORS.highlight,
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  sectionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.85
  }
});
