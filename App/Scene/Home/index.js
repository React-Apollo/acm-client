import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Button, Image } from 'react-native';
import { Text } from '~/Component';
import { ImagePicker } from 'expo';
import { Colors } from '~/Theme';
import styles from './styles';
import { S3 } from '~/Provider';

const text = [
  'Welcome to acm!',
  'We are under developement.',
  'Shake your phone to open the developer menu.',
  'Press Menu button on the top left corner',
  'to connect to other scene.',
];

class HomeScene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
    };
    this._handleImagePicker = this._handleImagePicker.bind(this);
  }

  async componentDidMount() {
    // Name of the key
    const Key = 'girl.jpg';
    const image = await S3.get({ Key });
    this.setState({ image });
  }

  async _handleImagePicker() {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true, // Required. S3 need base64 source
    });

    if (!result.cancelled) {
      const { Key } = await S3.put(result);

      const image = await S3.get({ Key });
      this.setState({ image });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View marginTop={24} />
        <View style={styles.centerText}>
          {text.map((text, index) => <Text key={index}>{text}</Text>)}
        </View>
        {/*
        Amazon S3 put file
        */}
        <View marginBottom={24} />
        <Button
          title="Pick image to Submit to S3"
          onPress={this._handleImagePicker}
        />
        <View marginBottom={24} />
        <Image style={{ width: 150, height: 250 }} source={this.state.image} />
      </View>
    );
  }
}
HomeScene.drawer = {
  primary: true,
};

HomeScene.header = {
  leftIcon: 'drawer',
  float: true,
  title: null,
  theme: 'dark',
  backgroundColor: Colors.primary,
  statusBarBackgroundColor: Colors.primary,
  actions: [
    {
      icon: {
        name: 'lock',
      },
      onPress: dispatch => {
        dispatch({
          type: 'LOCK_ACTION',
          payload: 'Lock the account',
        });
      },
    },
  ],
};

HomeScene.propTypes = {
  showSearch: PropTypes.func,
  hideSearch: PropTypes.func,
};

export default HomeScene;
