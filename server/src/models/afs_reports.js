const { AFS_REPORTS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  const afs_reports = sequelize.define(
    AFS_REPORTS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      from: {
        type: DataTypes.DATE,
      },
      to: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
    }
  );
  afs_reports.associate = function (models) {
    afs_reports.hasMany(models.afs_report_links, { foreignKey: 'report_id' });
  };
  return afs_reports;
};
