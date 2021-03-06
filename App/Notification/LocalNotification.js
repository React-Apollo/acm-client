import { Component } from 'react';
import PropTypes from 'prop-types';
import { Permissions } from 'expo';
import { withApollo, gql } from 'react-apollo';
import setMyAgendaScheduleAsync from './handler/myAgenda';

import myAgendaQuery from 'Graphql/query/getMyAgenda.graphql';
import myAgendaTransformer from 'Transformer/schedules/myAgenda';

/**
 * Must use React Component for using Apollo Client
 * render return null so there is no big affect to app performance
 */
class LocalNotification extends Component {
  async componentDidMount() {
    let permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (permission.status === 'granted') {
      const { client } = this.props;
      /**
       * Handle my agenda schedule
       */
      // Create new observable query for my agenda
      const observableQuery = await client.watchQuery({
        query: gql(myAgendaQuery),
        notifyOnNetworkStatusChange: true,
      });
      // Listen to whenever the query has changed
      observableQuery.subscribe({
        next: ({ data: { getAllPersonalSchedules } }) => {
          setMyAgendaScheduleAsync(
            myAgendaTransformer(getAllPersonalSchedules, 'start'),
          );
        },
        error: () => {
          /**
           * Required by OservableQuery.subscribe
           * but just a dummy function
           * Other component will handle this
           */
        },
      });

      /**
       * TO DO: Handle other local notifications
       */
    }
  }

  render() {
    return null;
  }
}

LocalNotification.propTypes = {
  client: PropTypes.object,
};

export default withApollo(LocalNotification);
