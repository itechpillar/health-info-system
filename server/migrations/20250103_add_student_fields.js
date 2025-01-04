'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Students', 'motherName', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Students', 'contactNumber', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Students', 'address', {
      type: DataTypes.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Students', 'motherName');
    await queryInterface.removeColumn('Students', 'contactNumber');
    await queryInterface.removeColumn('Students', 'address');
  }
};
