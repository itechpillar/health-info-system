import React from 'react';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '../utils/bmiCalculator';

const BMIDisplay = ({ weight, height }) => {
  const bmi = calculateBMI(weight, height);
  const category = getBMICategory(bmi);

  if (!bmi) return null;

  return (
    <div className="text-sm">
      <span className="font-medium">BMI: </span>
      <span className="font-bold">{bmi}</span>
      <span className="mx-2">|</span>
      <span className={`font-medium ${getBMICategoryColor(category)}`}>{category}</span>
    </div>
  );
};

export default BMIDisplay;
