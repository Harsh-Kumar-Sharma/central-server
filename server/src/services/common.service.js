const { db, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllMaster = async () => {


  //   get module master
  const getModuleMaster = await sequelize.query(`SELECT * FROM afs_master_modules`);

  //   get report master
  const getReportMaster = await sequelize.query(`SELECT * FROM afs_master_reports`);

  //   get roles master
  const getRolesMaster = await sequelize.query(`SELECT * FROM afs_master_roles`);


  return {
    moduleMaster: getModuleMaster[0],
    reportMaster: getReportMaster[0],
    roleMaster: getRolesMaster[0]
  };
};

module.exports = {
  getAllMaster,
};
