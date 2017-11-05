import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { View, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { S3_GET_PREFIX } from '~/env';

import { Colors, Metrics, Images } from '~/Theme';
import { Text, UserAvatar, TouchableView } from '~/Component';
import Comments from './Comments';
import styles from './styles';

import MUTATION_INSERT_NEWS_LIKE from '~/Graphql/mutation/insertNewsLike.graphql';
import MUTATION_DELETE_NEWS_LIKE from '~/Graphql/mutation/deleteNewsLike.graphql';

const defaultAvatar = Images.avatar['male08'];

const formatCreatedAt = createdAt =>
  moment(createdAt).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'DD/MM/YYYY',
  });

class News extends Component {
  static propTypes = {
    item: PropTypes.object,
    newsContainerStyle: PropTypes.object,
    userId: PropTypes.string,
    newsLikeById: PropTypes.object,
    insertNewsLike: PropTypes.func,
    deleteNewsLike: PropTypes.func,
    onRefresh: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showCommentBox: false,
      isLove: false,
      numberOfLove: 0,
    };
    this._onPressComment = this._onPressComment.bind(this);
    this._onPressLove = this._onPressLove.bind(this);
  }

  componentDidMount() {
    const { userId, item } = this.props;
    let isLove = item.newsLikes.some(newsLike => newsLike.user.id === userId);

    if (isLove) {
      this.setState({ isLove: true, numberOfLove: item.newsLikes.length });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.item !== this.props.item ||
  //     nextState.isLove !== this.state.isLove
  //   );
  // }

  _renderIcon(name, type, color) {
    return (
      <Icon
        name={name}
        type={type}
        color={color}
        marginRight={Metrics.smallMargin}
      />
    );
  }

  _renderNewsHeader(item, createdAt) {
    return (
      <View style={styles.postHeader}>
        <View style={styles.rightPostHeader}>
          <UserAvatar
            small
            avatar={
              item.user.avatar === null ? defaultAvatar : item.user.avatar
            }
            containerStyle={styles.avatar}
          />
          <View>
            <Text style={styles.username}>
              {`${item.user.firstname} ${item.user.lastname}`}
            </Text>
            <Text style={styles.secondaryText}>{createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="chevron-down" type="material-community" />
        </TouchableOpacity>
      </View>
    );
  }

  _renderPhotoView(imageUrl) {
    if (imageUrl.length === 1)
      return (
        <Image
          source={{ uri: S3_GET_PREFIX + imageUrl[0] }}
          style={styles.coverSingleImage}
        />
      );
    if (imageUrl.length === 2)
      return (
        <View style={styles.photoViewTwoImage}>
          <Image
            source={{ uri: S3_GET_PREFIX + imageUrl[0] }}
            style={styles.firstMediumImage}
          />
          <Image
            source={{ uri: S3_GET_PREFIX + imageUrl[1] }}
            style={styles.secondMediumImage}
          />
        </View>
      );
    if (imageUrl.length > 2)
      return (
        <View style={styles.photoViewContainer}>
          <View style={{ flex: 2 }}>
            <Image
              source={{ uri: S3_GET_PREFIX + imageUrl[0] }}
              style={styles.coverImage}
            />
          </View>

          <View style={styles.photoViewSubContainer}>
            <Image
              source={{ uri: S3_GET_PREFIX + imageUrl[1] }}
              style={styles.smallImage}
            />
            {imageUrl.length > 2 ? (
              <TouchableView>
                <Image
                  source={{ uri: S3_GET_PREFIX + imageUrl[2] }}
                  style={styles.smallImage}
                />
                <Text
                  medium
                  style={styles.moreImages}
                >{`+ ${imageUrl.length}`}</Text>
              </TouchableView>
            ) : (
              <Image
                source={{ uri: S3_GET_PREFIX + imageUrl[2] }}
                style={styles.smallImage}
              />
            )}
          </View>
        </View>
      );
  }

  _renderStatus(item) {
    const url = item.newsPhotos.map(newsPhoto => newsPhoto.url);

    return (
      <View>
        <Text>{item.content}</Text>
        {this._renderPhotoView(url)}
      </View>
    );
  }

  _renderInteraction(onPressHandler, icon, text) {
    return (
      <TouchableOpacity onPress={onPressHandler} style={styles.interaction}>
        {icon}
        <Text style={styles.secondaryText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  _renderInteractionBar(item) {
    let { isLove, numberOfLove } = this.state;

    return (
      <View style={styles.interactionBarContainer}>
        {this._renderInteraction(
          this._onPressLove,
          isLove
            ? this._renderIcon('ios-heart', 'ionicon', Colors.red)
            : this._renderIcon('ios-heart-outline', 'ionicon'),
          numberOfLove,
        )}
        {this._renderInteraction(
          this._onPressComment,
          this._renderIcon('comment', 'evilicon'),
          item.newsComments.length,
        )}
      </View>
    );
  }

  _onPressComment() {
    this.setState({ showCommentBox: !this.state.showCommentBox });
  }

  _onPressLove() {
    const { item, userId, onRefresh } = this.props;
    const { isLove, numberOfLove } = this.state;

    if (isLove === false) {
      this.setState({
        isLove: true,
        numberOfLove: numberOfLove + 1,
      });
      this.props
        .insertNewsLike({
          news_id: item.id,
          user_id: userId,
        })
        .then(onRefresh());
    } else {
      this.setState({
        isLove: false,
        numberOfLove: numberOfLove - 1,
      });
      this.props
        .deleteNewsLike({
          newsLike_id: item.newsLikes.map(
            newsLike => (newsLike.user.id === userId ? newsLike.id : undefined),
          ),
        })
        .then(onRefresh());
    }
  }

  render() {
    const { item, newsContainerStyle, userId, onRefresh } = this.props;
    let createdAt = formatCreatedAt(item.updated_at);

    return (
      <View style={[styles.container, newsContainerStyle]}>
        {this._renderNewsHeader(item, createdAt)}
        <View>
          {this._renderStatus(item)}
          {this._renderInteractionBar(item)}
          {this.state.showCommentBox ? (
            <Comments
              comments={item.newsComments}
              userAvatar={
                item.user.avatar === null ? defaultAvatar : item.user.avatar
              }
              createdAt={createdAt}
              newsId={item.id}
              userId={userId}
              onRefresh={onRefresh}
            />
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}

const InsertNewsLikeWithMutation = graphql(gql(MUTATION_INSERT_NEWS_LIKE), {
  props: ({ mutate }) => ({
    insertNewsLike: ({ news_id, user_id }) =>
      mutate({
        variables: { news_id, user_id },
      }),
  }),
});

const DeleteNewsLikeWithMutation = graphql(gql(MUTATION_DELETE_NEWS_LIKE), {
  props: ({ mutate }) => ({
    deleteNewsLike: ({ newsLike_id }) =>
      mutate({
        variables: { newsLike_id },
      }),
  }),
});

export default compose(InsertNewsLikeWithMutation, DeleteNewsLikeWithMutation)(
  News,
);
