// screens/ImpactTrackerScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import { Text, Button, Modal, Portal, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import Background from '../components/Background';
import BadgeComponent from '../components/BadgeComponent';
import MetricExplanationModal from '../components/MetricExplanationModal';
import WeekNavigation from '../components/WeekNavigation';
import ImpactChart from '../components/ImpactChart';
import { getStartOfCurrentWeek } from '../utils/dateHelpers';
import { defaultFootprintFactors } from '../utils/defaultFootprint';
import { supabase } from '../supabase';

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
  const [loading, setLoading] = useState(false);

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

  // Function to fetch user profile from Supabase
  const getUserProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, sex, birthday')
        .eq('id', supabase.auth.user().id)
        .single();

      if (error) throw error;

      // Calculate age from birthday
      const today = new Date();
      const birthDate = new Date(data.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const profile = { ...data, age };
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error fetching user profile', error.message);
    }
  }, []);

  // Function to load impact data from Supabase
  const loadImpactData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: actions, error } = await supabase
        .from('actions')
        .select('*')
        .eq('user_id', supabase.auth.user().id);

      if (error) throw error;

      // Get user profile
      if (!userProfile) {
        await getUserProfile();
      }

      // If no actions, use default impact based on age and sex
      let allActions = actions;
      if (actions.length === 0 && userProfile) {
        const defaultImpact = calculateDefaultImpact(userProfile);
        allActions = [
          {
            id: 'default',
            date: new Date().toISOString(),
            impact_value: defaultImpact,
            isDefault: true,
          },
        ];
      }

      // Filter actions for the current week
      const weekStart = currentWeekStartDate;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekActions = allActions.filter((action) => {
        const actionDate = new Date(action.date);
        return actionDate >= weekStart && actionDate < weekEnd;
      });

      let dailyEmissions = [0, 0, 0, 0, 0, 0, 0];
      weekActions.forEach((action) => {
        const actionDate = new Date(action.date);
        const dayIndex = (actionDate.getDay() + 6) % 7; // Monday = 0
        dailyEmissions[dayIndex] += action.impact_value;
      });

      setChartData(dailyEmissions.map((value) => convertMetric(value)));
      setImpactData({ totalEmissions: dailyEmissions.reduce((a, b) => a + b, 0) });
    } catch (error) {
      console.error('Error loading impact data:', error.message);
      Alert.alert('Error loading impact data', error.message);
    } finally {
      setLoading(false);
    }
  }, [currentWeekStartDate, userProfile, getUserProfile]);

  // Function to load earned badges from Supabase
  const loadBadges = useCallback(async () => {
    try {
      const { data: earnedBadges, error } = await supabase
        .from('user_badges')
        .select('badge_id, badges(name, description, icon_url)')
        .eq('user_id', supabase.auth.user().id)
        .order('awarded_at', { ascending: false });

      if (error) throw error;

      setBadges(earnedBadges.map((ub) => ub.badges));
    } catch (error) {
      console.error('Error loading badges:', error.message);
      Alert.alert('Error loading badges', error.message);
    }
  }, []);

  // Function to check and award new badges
  const checkForNewBadges = useCallback(async () => {
    try {
      // Example: Award 'First Action' badge
      const { data: actions, error: actionsError } = await supabase
        .from('actions')
        .select('*')
        .eq('user_id', supabase.auth.user().id);

      if (actionsError) throw actionsError;

      if (actions.length === 1) {
        // User has logged their first action
        // Award 'First Action' badge
        const { data: badgeData, error: badgeError } = await supabase
          .from('badges')
          .select('id')
          .eq('name', 'First Action')
          .single();

        if (badgeError) throw badgeError;

        // Check if badge already awarded
        const { data: userBadgeData, error: userBadgeError } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', supabase.auth.user().id)
          .eq('badge_id', badgeData.id)
          .single();

        if (userBadgeError && userBadgeError.code !== 'PGRST116') { // PGRST116: no rows found
          throw userBadgeError;
        }

        if (!userBadgeData) {
          // Award the badge
          const { error: awardError } = await supabase.from('user_badges').insert([
            {
              user_id: supabase.auth.user().id,
              badge_id: badgeData.id,
            },
          ]);

          if (awardError) throw awardError;

          Alert.alert('Congratulations!', 'You have earned the "First Action" badge!');
          loadBadges(); // Refresh badges
        }
      }

      // Add more badge checks here based on your badge criteria
    } catch (error) {
      console.error('Error checking for new badges:', error.message);
      Alert.alert('Error checking for new badges', error.message);
    }
  }, [loadBadges]);

  // Effect to fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      await getUserProfile();
    };

    fetchUserProfile();
  }, [getUserProfile]);

  // Effect to load data when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadImpactData();
      loadBadges();
      checkForNewBadges();
    });
    return unsubscribe;
  }, [navigation, loadImpactData, loadBadges, checkForNewBadges]);

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
        <Pressable onPress={toggleMetric} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>Switch Metric ({metric})</Text>
        </Pressable>

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
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <ImpactChart chartData={chartData} metric={metric} />
        )}

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
          {badges.map((badge) => (
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
  toggleButton: {
    marginVertical: 10,
    backgroundColor: '#81C784',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Replace shadow props
  },
  toggleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    verticalAlign: 'middle', // Replace textAlignVertical
  },
  metricsContainer: {
    marginVertical: 10,
  },
  metricText: {
    fontSize: 18,
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
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Replace shadow props
  },
  defaultFootprintTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    verticalAlign: 'middle', // Replace textAlignVertical
  },
  defaultFootprintText: {
    fontSize: 16,
    marginBottom: 3,
    verticalAlign: 'middle', // Replace textAlignVertical
  },
});
