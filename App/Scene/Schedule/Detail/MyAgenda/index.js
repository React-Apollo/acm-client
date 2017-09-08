import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList } from 'react-native';
import { Colors } from '~/Theme';
import ListView from '../ListView';
import Fixture from '~/Scene/Schedule/fixture';
import styles from './styles';

const calendarIcon = {
  type: 'material-community',
  name: 'calendar-check',
  color: Colors.black,
  size: 30,
};

class Detail extends Component {
  _renderScheduleOfDate({ item, index }) {
    return (
      <View key={index}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {item.date}
          </Text>
        </View>
        <ListView detail={item.activities} calendarIcon={calendarIcon} />
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={Fixture}
        keyExtractor={(item, index) => index}
        renderItem={this._renderScheduleOfDate}
      />
    );
  }
}

Detail.propTypes = {
  schedule: PropTypes.object,
};

export default Detail;
