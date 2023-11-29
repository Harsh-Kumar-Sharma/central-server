const { AFS_MASTER_ROLES } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  const TmsMasterRoles = sequelize.define(
    AFS_MASTER_ROLES,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
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
  TmsMasterRoles.associate = function (models) {
    TmsMasterRoles.hasMany(models.afs_role_module_mappings, { foreignKey: 'role_id' })
  };
  return TmsMasterRoles;
};
