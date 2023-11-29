const { AFS_USER_ROLE_MAPPINGS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    AFS_USER_ROLE_MAPPINGS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.NUMBER
      },
      role_id: {
        type: DataTypes.NUMBER,
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
