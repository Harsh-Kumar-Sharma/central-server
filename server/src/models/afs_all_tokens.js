const { AFS_ALL_TOKENS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    AFS_ALL_TOKENS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
      },
      expiry: {
        type: DataTypes.DATE,
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
