const { AFS_LOGINS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    AFS_LOGINS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.NUMBER,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
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
