'use strict';

import React from 'react';

import {
  Text,
  StyleSheet
} from 'react-native';


let Heading1 = (props) => (
  <Text style={ styles.h1 }>{ props.children }</Text>
);
let Heading2 = (props) => (
  <Text style={ styles.h2 }>{ props.children }</Text>
);
let Heading3 = (props) => (
  <Text style={ styles.h3 }>{ props.children }</Text>
);
let Heading4 = (props) => (
  <Text style={ styles.h4 }>{ props.children }</Text>
);

let styles = StyleSheet.create({
  h1: {
    color: '#444444',
    fontSize: 32,
    marginBottom: 10,
    marginTop: 20
  },
  h2: {
    color: '#444444',
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20
  },
  h3: {
    color: '#666666',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 20
  },
  h4: {
    color: '#888888',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20
  }
});

module.exports = {
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  H4: Heading4
}
