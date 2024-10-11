// data/carbonData.js

// Emission factors compiled from CCaLC, Ecoinvent, and Defra Conversion Factors.
// Values are illustrative examples for the purpose of this app.

export const emissionFactors = {
  transport: {
    car: {
      petrol: 0.192,  // kg CO₂ per km
      diesel: 0.171,  // kg CO₂ per km
      electric: 0.050  // kg CO₂ per km
    },
    bus: 0.105,        // kg CO₂ per km
    train: 0.041,      // kg CO₂ per km
    bicycle: 0,        // kg CO₂ per km
    walking: 0         // kg CO₂ per km
  },
  energy: {
    electricity: 0.233,  // kg CO₂ per kWh
    gas: 0.184,          // kg CO₂ per kWh
    renewable: 0         // kg CO₂ per kWh
  },
  waste: {
    recycling: {
      paper: -0.79,    // kg CO₂ per kg
      plastic: -1.42,
      glass: -0.32
    },
    composting: -0.05,  // kg CO₂ per kg
    landfill: 0.21      // kg CO₂ per kg
  },
  food: {
    meat: 27.0,          // kg CO₂ per kg
    vegetarian: 9.0,
    vegan: 6.0,
    foodWaste: 2.5       // kg CO₂ per kg
  },
  purchases: {
    clothing: 22.0,      // kg CO₂ per item
    electronics: 70.0,
    furniture: 100.0,
    otherGoods: 10.0
  }
};

export default emissionFactors;
