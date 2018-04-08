import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const LABEL_COLORS = [
  '#2C73D2',
  '#D65DB1',
  '#00C9A7',
  '#FFC75F',
  '#C34A36'
];

export default class LabelColorPicker extends React.Component {

  constructor(props) {
    super();
    this.state = {
      labelColor: props.initialColor || null
    }
  }

  onColorChange(color) {
    this.props.onColorChange(color);
    this.setState({
      labelColor: color
    });
  }

  render() {
    const state = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        { [null].concat(LABEL_COLORS).map(color => {
          const isCur = state.labelColor === color;
          return (
            <TouchableOpacity
              onPress={ () => this.onColorChange(color) }
              style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 7, borderWidth: isCur ? 3 : 1, borderColor: isCur ? '#555' : '#DDD', marginRight: 5 }}>
              <View style={{ borderRadius: 4, backgroundColor: color, height: 30, margin: 2, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                { color === null ? (<Text style={{ fontSize: 20, color: '#AAA', position: 'relative', top: -2 }}>x</Text>) : null }
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}
