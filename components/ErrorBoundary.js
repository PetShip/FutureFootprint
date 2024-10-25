import React from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    let errorMessage = '';

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && error.toString) {
      errorMessage = error.toString();
    } else {
      errorMessage = 'An unknown error occurred.';
    }

    return { hasError: true, errorMessage };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong:</Text>
          <Text>{this.state.errorMessage}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
