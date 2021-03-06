import { StyleSheet } from 'react-native';
import { Colors } from 'Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  relativeContainer: {
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
