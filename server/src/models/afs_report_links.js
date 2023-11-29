const { AFS_REPORT_LINKS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  const afs_report_links = sequelize.define(
    AFS_REPORT_LINKS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      report_id: {
        type: DataTypes.NUMBER,
      },
      type_id: {
        type: DataTypes.NUMBER,
      },
      download_url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
    }
  );
  afs_report_links.associate = function (models) {
    afs_report_links.belongsTo(models.afs_master_reports, { foreignKey: 'type_id' });
  };
  return afs_report_links;
};
