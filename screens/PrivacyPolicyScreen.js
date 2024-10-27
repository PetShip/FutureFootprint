// screens/PrivacyPolicyScreen.js
import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function PrivacyPolicyScreen({ navigation }) {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll to the top when the component mounts
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.content}>
          This Privacy Policy explains how FutureFootprint collects, uses, and shares your personal information. We
          value your privacy and are committed to protecting it in accordance with GDPR (EU) and CCPA (California, US) standards.

          {"\n\n"}**1. Information We Collect**{"\n"}
          - **Personal Information:** Name, email, birthday, and profile picture.
          - **Usage Data:** Details about your app activity and interactions.

          {"\n\n"}**2. How We Use Your Information**{"\n"}
          - To provide and improve our services.
          - To personalize user experience and send notifications.
          - To comply with legal obligations and prevent fraud.

          {"\n\n"}**3. Data Sharing**{"\n"}
          - We do not sell or share personal data with third parties, except for essential service providers under strict conditions.

          {"\n\n"}**4. User Rights**{"\n"}
          - **Access & Rectification:** You can access and modify your personal data at any time.
          - **Deletion & Portability:** Request deletion or transfer of your data.

          {"\n\n"}For any questions about our Privacy Policy, please contact us at privacy@futurefootprint.com.
        </Text>
      </ScrollView>
      
      {/* Return Button */}
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Accept & Return
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    marginVertical: 20,
    paddingVertical: 10,
  },
});
