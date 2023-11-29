const { AFS_MASTER_MODULES } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    AFS_MASTER_MODULES,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      module_name: {
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
