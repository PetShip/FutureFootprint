// screens/ImpactTrackerScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Modal, Portal, IconButton, useTheme } from 'react-native-paper';
import Background from '../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LineChart from '../components/ImpactChart';
import BadgeComponent from '../components/BadgeComponent';
import MetricExplanationModal from '../components/MetricExplanationModal';
import WeekNavigation from '../components/WeekNavigation';
import { getStartOfCurrentWeek } from '../utils/dateHelpers';
import { defaultFootprintFactors } from '../utils/defaultFootprint';
import ImpactChart from '../components/ImpactChart';  // <-- Import ImpactChart

export default function ImpactTrackerScreen({ navigation }) {
  const theme = useTheme();
  const [impactData, setImpactData] = useState({
    totalEmissions: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [badges, setBadges] = useState([]);
  const [metric, setMetric] = useState('CO₂');
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(getStartOfCurrentWeek());
  const [userProfile, setUserProfile] = useState(null);

  // Function to calculate default impact based on age and sex
  const calculateDefaultImpact = (profile) => {
    const { age, sex } = profile;
    let baseImpact = defaultFootprintFactors[sex]?.base || 23; // Default to 'other' if sex is undefined

    if (age < 18) {
      baseImpact = defaultFootprintFactors[sex]?.young || 16;
    } else if (age > 65) {
      baseImpact = defaultFootprintFactors[sex]?.old || 19;
    }

    return baseImpact; // kg CO₂ per day based on age and sex
  };

  // Function to fetch user profile
  const getUserProfile = async () => {
    const userProfile = await AsyncStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  };

  const loadImpactData = useCallback(async () => {
    try {
      const existingActions = await AsyncStorage.getItem('userActions');
      const actions = existingActions ? JSON.parse(existingActions) : [];

      // Get user profile
      const profile = userProfile || (await getUserProfile());

      // If no actions, use default impact based on age and sex
      if (actions.length === 0 && profile) {
        const defaultImpact = calculateDefaultImpact(profile);
        actions.push({
          id: 'default',
          date: new Date().toISOString(),
          impactValue: defaultImpact,
          isDefault: true,
        });
      }

      // Filter actions for the current week
      const weekStart = currentWeekStartDate;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekActions = actions.filter(action => {
        const actionDate = new Date(action.date);
        return actionDate >= weekStart && actionDate < weekEnd;
      });

      let dailyEmissions = [0, 0, 0, 0, 0, 0, 0];
      weekActions.forEach(action => {
        const actionDate = new Date(action.date);
        const dayIndex = (actionDate.getDay() + 6) % 7; // Monday = 0
        dailyEmissions[dayIndex] += action.impactValue;
      });

      setChartData(dailyEmissions.map(value => convertMetric(value)));
      setImpactData({ totalEmissions: dailyEmissions.reduce((a, b) => a + b, 0) });
    } catch (error) {
      console.error(error);
    }
  }, [currentWeekStartDate, userProfile]);

  const loadBadges = useCallback(() => {
    // Implement badge loading logic here
    // Example:
    // setBadges([...]);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getUserProfile();
      setUserProfile(profile);
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadImpactData();
      loadBadges();
    });
    return unsubscribe;
  }, [navigation, loadImpactData, loadBadges]);

  const convertMetric = (value) => {
    if (metric === 'CO₂') {
      return value;
    } else if (metric === 'Miles Driven') {
      return value * 0.621371; // Convert kg CO₂ to miles driven (approximation)
    } else if (metric === 'Trees Planted') {
      return value / 20; // Approximate number of trees required to absorb this CO₂
    } else {
      return value;
    }
  };

  const toggleMetric = () => {
    if (metric === 'CO₂') {
      setMetric('Miles Driven');
    } else if (metric === 'Miles Driven') {
      setMetric('Trees Planted');
    } else {
      setMetric('CO₂');
    }
  };

  const previousWeek = () => {
    const newStartDate = new Date(currentWeekStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setCurrentWeekStartDate(newStartDate);
  };

  const nextWeek = () => {
    const newStartDate = new Date(currentWeekStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setCurrentWeekStartDate(newStartDate);
  };

  useEffect(() => {
    loadImpactData();
  }, [currentWeekStartDate, loadImpactData]);

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Impact Tracker</Text>
          <IconButton
            icon="information"
            size={24}
            onPress={() => setShowExplanation(true)}
          />
        </View>

        <MetricExplanationModal visible={showExplanation} onDismiss={() => setShowExplanation(false)} />

        {/* Toggle Metric Button */}
        <TouchableOpacity onPress={toggleMetric} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>Switch Metric ({metric})</Text>
        </TouchableOpacity>

        {/* Display Default Footprint Information */}
        {userProfile && (
          <View style={styles.defaultFootprintContainer}>
            <Text style={[styles.defaultFootprintTitle, { color: theme.colors.text }]}>
              Your Default Footprint
            </Text>
            <Text style={[styles.defaultFootprintText, { color: theme.colors.text }]}>
              Based on your profile:
            </Text>
            <Text style={[styles.defaultFootprintText, { color: theme.colors.text }]}>
              Age: {userProfile.age}
            </Text>
            <Text style={[styles.defaultFootprintText, { color: theme.colors.text }]}>
              Sex: {userProfile.sex.charAt(0).toUpperCase() + userProfile.sex.slice(1)}
            </Text>
            <Text style={[styles.defaultFootprintText, { color: theme.colors.text }]}>
              Default Daily CO₂ Emissions: {calculateDefaultImpact(userProfile).toFixed(2)} kg
            </Text>
          </View>
        )}

        {/* Display Total Emissions */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.metricText, { color: theme.colors.text }]}>
            Total {metric} this week: {convertMetric(impactData.totalEmissions).toFixed(2)}{' '}
            {metric === 'CO₂' ? 'kg' : metric === 'Miles Driven' ? 'miles' : 'trees'}
          </Text>
        </View>

        {/* Week Navigation */}
        <WeekNavigation
          previousWeek={previousWeek}
          nextWeek={nextWeek}
          currentWeekStartDate={currentWeekStartDate}
          getStartOfCurrentWeek={getStartOfCurrentWeek}
          theme={theme}
        />

        {/* Impact Chart */}
        <ImpactChart chartData={chartData} metric={metric} />

        {/* Buttons to Log Action and View Goals */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LogAction')}
          style={styles.button}
        >
          Log New Action
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Goals')}
          style={styles.button}
        >
          View Goals
        </Button>

        {/* Display Badges */}
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Your Badges</Text>
        <ScrollView horizontal contentContainerStyle={styles.badgesContainer}>
          {badges.map(badge => (
            <BadgeComponent key={badge.id} badge={badge} />
          ))}
        </ScrollView>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  toggleButton: {
    marginVertical: 10,
    backgroundColor: '#81C784',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  metricsContainer: {
    marginVertical: 10,
  },
  metricText: {
    fontSize: 18,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
  subtitle: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgesContainer: {
    paddingVertical: 10,
  },
  defaultFootprintContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  defaultFootprintTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  defaultFootprintText: {
    fontSize: 16,
    marginBottom: 3,
  },
});
