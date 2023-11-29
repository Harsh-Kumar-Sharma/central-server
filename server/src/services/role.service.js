const { db } = require('../models');

// create Role
const createRole = async (record) => {
  // Role Existence Check
  const existsRole = await db.tms_master_roles.findOne({
    where: {
      role_name: record.role_name,
    },
  });

  if (existsRole) {
    throw new Error('Role name already exists');
  }

  const roleModules = record.modules;

  for (const moduleData of roleModules) {
    // Module Existence Check
    const module = await db.tms_master_modules.findOne({ where: { id: moduleData.module_id } });
    if (!module) {
      throw new Error(`Module with ID ${moduleData.module_id} does not exist`);
    }
    const moduleId = moduleData.module_id;
  }

  const roleRes = await db.tms_master_roles.create({
    role_name: record.role_name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const roleId = roleRes.dataValues.id;

  const moduleMappings = [];

  for (const moduleData of roleModules) {
    const module = await db.tms_master_modules.findOne({ where: { id: moduleData.module_id } });
    const moduleId = moduleData.module_id;
    const moduleName = module.module_name;
    const modulePermission = moduleData.module_permission;

    await db.tms_role_module_mappings.create({
      role_id: roleId,
      module_id: moduleId,
      permission: modulePermission,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    moduleMappings.push({
      module_id: moduleId,
      module_name: moduleName,
      module_permission: modulePermission
    });
  }

  const role = {
    role_id: roleId,
    role_name: record.role_name,
    modules: moduleMappings,
  };

  return role;
};

// get Roles
const getRoles = async () => {
  const allroles = await db.tms_master_roles.findAll({
    include: [{
      model: db.tms_role_module_mappings,
      attributes: ['id', 'role_id', 'module_id', 'permission'],
      include: [{ model: db.tms_master_modules, attributes: ['id', 'module_name'] }],
    }]
  });

  const roles = []
  for (let role of allroles) {
    roles.push({
      id: role.id,
      role_name: role.role_name,
      created_at: role.created_at,
      updated_at: role.updated_at,
      modules: role.tms_role_module_mappings.map(m => {
        return {
          module_id: m.module_id,
          permission: m.permission
        }
      })
    })
  }

  return roles;
};

// get role by id
const getRoleById = async (id) => {
  const role = await db.tms_master_roles.findOne({ where: { id } });
  if (!role) {
    throw new Error('Role not found');
  }
  return role;
};

// update role
const updateRole = async (roleId, updatedRecord) => {
  // Role Existence Check
  const existingRole = await db.tms_master_roles.findOne({ where: { id: roleId } });
  if (!existingRole) {
    throw new Error(`Role with ID ${roleId} does not exist`);
  }

  // Check if role with same name already exists
  const existsUsername = await db.tms_master_roles.findOne({
    where: {
      role_name: updatedRecord.role_name,
    },
  });

  if (existsUsername.id != roleId) {
    throw new Error('Role is already exists');
  }

  // Update Role Name
  if (updatedRecord.role_name) {
    await db.tms_master_roles.update(
      {
        role_name: updatedRecord.role_name,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: roleId,
        },
      }
    );
  }

  // Check if modules data is provided and it is an array
  if (updatedRecord.modules && Array.isArray(updatedRecord.modules)) {
    const roleModules = updatedRecord.modules;

    // Clear existing module and sub-module mappings
    await db.tms_role_module_mappings.destroy({ where: { role_id: roleId } });

    const moduleMappings = [];

    for (const moduleData of roleModules) {
      const module = await db.tms_master_modules.findOne({ where: { id: moduleData.module_id } });
      const moduleId = moduleData.module_id;
      const moduleName = module.module_name;
      const modulePermission = moduleData.permission;

      await db.tms_role_module_mappings.create({
        role_id: roleId,
        module_id: moduleId,
        permission: modulePermission,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      moduleMappings.push({
        module_id: moduleId,
        module_name: moduleName,
        module_permission: modulePermission,
      });
    }

    return {
      role_id: roleId,
      role_name: updatedRecord.role_name,
      modules: moduleMappings,
    };
  } else {
    return {
      role_id: roleId,
      role_name: updatedRecord.role_name,
    };
  }
};

// delete_role
const deleteRole = async (roleId) => {
  const role = await db.tms_master_roles.findOne({ where: { id: roleId } });
  if (!role) {
    throw new Error('Role not found');
  }

  //Check if the role is assigned to any user
  const roleAssignment = await db.tms_user_role_mappings.findOne({ where: { role_id: roleId } });
  if (roleAssignment) {
    throw new Error('Cannot delete role. It is assigned to a user.');
  }

  // Delete the role
  await db.tms_master_roles.destroy({ where: { id: roleId } });
  await db.tms_role_module_mappings.destroy({ where: { role_id: roleId } });
  return true;
};

// get permission by Id
const getPermissionByRoleId = async (id) => {
  const permissions = await db.tms_master_roles.findOne({
    where: { id: id },
    include: [
      {
        model: db.tms_role_module_mappings,
        attributes: ['id', 'role_id', 'module_id', 'permission'],
        include: [{ model: db.tms_master_modules, attributes: ['id', 'module_name'] }],
      }
    ],
  });
  if (!permissions) {
    throw new Error('Role not found');
  }

  const rolePermissions = {
    role_id: permissions.id,
    role_name: permissions.role_name,
    modules: [],
  };

  permissions.tms_role_module_mappings.forEach((moduleMapping) => {
    const module = {
      module_id: moduleMapping.module_id,
      module_name: moduleMapping.module_name,
      module_permission: moduleMapping.permission,
      sub_modules: [],
    };

    rolePermissions.modules.push(module);
  });

  return rolePermissions;
};

// get all modules and submodules
const getAllModulesAndSubmodules = async () => {
  const moduleData = [];

  // Retrieve all module data
  const modules = await db.tms_master_modules.findAll();

  for (const module of modules) {
    const moduleId = module.id;
    const moduleName = module.module_name;

    moduleData.push({
      module_id: moduleId,
      module_name: moduleName
    });
  }

  return moduleData;
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getPermissionByRoleId,
  getAllModulesAndSubmodules,
};
