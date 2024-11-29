/**
 * Calculate BMI from weight (kg) and height (cm)
 * @param {number} weight - Weight in kilograms
 * @param {number} height - Height in centimeters
 * @returns {number|null} BMI value rounded to 1 decimal place, or null if invalid input
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category based on WHO standards
 * @param {number} bmi - BMI value
 * @returns {string|null} BMI category or null if invalid input
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Get color class for BMI category
 * @param {string} category - BMI category
 * @returns {string} Tailwind CSS color class
 */
export const getBMICategoryColor = (category) => {
  switch (category) {
    case 'Normal weight':
      return 'text-green-600';
    case 'Underweight':
      return 'text-yellow-600';
    case 'Overweight':
      return 'text-orange-600';
    case 'Obese':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
