const { AFS_ROLE_MODULE_MAPPINGS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  const TmsRoleModuleMappings = sequelize.define(
    AFS_ROLE_MODULE_MAPPINGS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.NUMBER,
      },
      module_id: {
        type: DataTypes.NUMBER,
      },
      permission: {
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
  TmsRoleModuleMappings.associate = function (models) {
    TmsRoleModuleMappings.belongsTo(models.afs_master_modules, { foreignKey: 'module_id' });
  };
  return TmsRoleModuleMappings;
};
