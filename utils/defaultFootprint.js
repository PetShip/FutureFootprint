// utils/defaultFootprint.js

export const defaultFootprintFactors = {
  male: {
    base: 25, // kg CO₂ per day for middle-aged males
    young: 18, // kg CO₂ per day for young males
    old: 20, // kg CO₂ per day for elderly males
  },
  female: {
    base: 22, // kg CO₂ per day for middle-aged females
    young: 15, // kg CO₂ per day for young females
    old: 18, // kg CO₂ per day for elderly females
  },
  other: {
    base: 23, // kg CO₂ per day for other genders
    young: 16, // kg CO₂ per day for young others
    old: 19, // kg CO₂ per day for elderly others
  },
};

// Optionally, you can add more detailed categories or factors as needed.
