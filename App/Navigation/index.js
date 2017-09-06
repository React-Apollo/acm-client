import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import styles from './styles';
import { AppNavigator, KEY } from '../Redux/Navigation';
import Header from './Header/Wrapper';

/**
 * DO NOT edit this file if you want to add new Scene
 * If you want to add a new one, take a look at ./routes.js
 */

const AppNavigation = ({ navigation, dispatch }) =>
  <View style={styles.container}>
    <Header>
      <AppNavigator
        navigation={addNavigationHelpers({ dispatch, state: navigation })}
      />
    </Header>
  </View>;

AppNavigation.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  navigation: state[KEY],
});

export default connect(mapStateToProps)(AppNavigation);
