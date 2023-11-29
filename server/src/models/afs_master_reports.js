const { AFS_MASTER_REPORTS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  const tms_master_reports = sequelize.define(
    AFS_MASTER_REPORTS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      report_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return tms_master_reports;
};
