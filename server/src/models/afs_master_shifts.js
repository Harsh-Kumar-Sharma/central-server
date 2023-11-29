const { AFS_MASTER_SHIFTS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    AFS_MASTER_SHIFTS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      shift_name: {
        type: DataTypes.STRING,
      },
      shift_start_time: {
        type: DataTypes.STRING,
      },
      shift_end_time: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
    }
  );
};
