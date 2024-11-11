// components/ErrorBoundary.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log error
    console.error('ErrorBoundary caught an error', error, info);
  }

  reloadApp = () => {
    this.setState({ hasError: false });
    // Implement logic to reload the app or navigate to the initial screen
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Button mode="contained" onPress={this.reloadApp}>
            Reload App
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
