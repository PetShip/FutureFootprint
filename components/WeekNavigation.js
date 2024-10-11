// components/WeekNavigation.js
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const WeekNavigation = ({ previousWeek, nextWeek, currentWeekStartDate, getStartOfCurrentWeek, theme }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
      <Button onPress={previousWeek}>Previous Week</Button>
      <Text style={{ color: theme.colors.text, marginHorizontal: 10 }}>
        {currentWeekStartDate.toDateString()} - {new Date(currentWeekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toDateString()}
      </Text>
      <Button onPress={nextWeek} disabled={currentWeekStartDate >= getStartOfCurrentWeek()}>Next Week</Button>
    </View>
  );
};

export default WeekNavigation;
