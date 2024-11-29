import React from 'react';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '../utils/bmiCalculator';

const PhysicalMeasurements = ({ formData, handleChange }) => {
  const bmi = calculateBMI(formData.weight, formData.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Physical Measurements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
            <input
              type="number"
              step="0.1"
              min="0"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter weight in kilograms"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Height (cm)
            <input
              type="number"
              step="0.1"
              min="0"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter height in centimeters"
            />
          </label>
        </div>
      </div>
      
      {/* BMI Display */}
      {bmi && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700">
            BMI: <span className="font-bold">{bmi}</span>
          </p>
          <p className="text-sm text-gray-600">
            Category: <span className={`font-medium ${getBMICategoryColor(bmiCategory)}`}>
              {bmiCategory}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PhysicalMeasurements;
