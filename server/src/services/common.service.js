const { db, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllMaster = async () => {
  // get vehicle class
  const getVehicleClass = await sequelize.query(`SELECT * FROM TBL_MASTER_CLASS where CLASS_STATUS=1`);

  // get client master
  const getClientMaster = await sequelize.query(`SELECT * FROM TBL_CLIENT_MASTER WHERE STATUS=1`);

  //   get fare master
  const getFareMaster = await sequelize.query(`SELECT * FROM TBL_FARE_MASTER WHERE STATUS=1`);

  // get config master
  const getConfigMaster = await sequelize.query(`SELECT * FROM TBL_MASTER_CONFIG WHERE STATUS=1`);


  //   get plaza master
  const getPlazaMaster = await sequelize.query(`SELECT * FROM TBL_PLAZA_MASTER WHERE STATUS=1`);

  //   get project master
  const getProjectMaster = await sequelize.query(`SELECT * FROM TBL_PROJECT_MASTER WHERE STATUS=1`);

  //   get VRN master
  const getVrnMaster = await sequelize.query(`SELECT * FROM TBL_VRN_MASTER WHERE STATUS=1`);

  //   get lane master
  const getLaneMaster = await sequelize.query(`SELECT * FROM TBL_LANE_MASTER WHERE LANE_STATUS=1`);

  //   get module master
  const getModuleMaster = await sequelize.query(`SELECT * FROM afs_master_modules`);

  //   get report master
  const getReportMaster = await sequelize.query(`SELECT * FROM afs_master_reports`);

  //   get roles master
  const getRolesMaster = await sequelize.query(`SELECT * FROM afs_master_roles`);



  //   get payment type master
  const getPaymentTypeMaster = await sequelize.query(`SELECT * FROM PAYMENTTYPE WHERE REPORT_STATUS=1`);

  // get sub payment type master
  const getPaymentSubTypeMaster = await sequelize.query(`SELECT * FROM PAYMENTSUBTYPE WHERE STATUS=1`);
  // get sub payment type master
  const getCollector = await sequelize.query(`SELECT username,afs_users.id FROM [afs_users]
  inner join afs_logins on afs_logins.user_id=afs_users.id
where role_id=3`);
  // get sub payment type master
  const getCashier = await sequelize.query(`SELECT username,afs_users.id FROM [afs_users]
  inner join afs_logins on afs_logins.user_id=afs_users.id
  where role_id=7 `);

  return {
    vehicleClass: getVehicleClass[0],
    clientMaster: getClientMaster[0],
    fareMaster: getFareMaster[0],
    configMaster: getConfigMaster[0],
    plazaMaster: getPlazaMaster[0],
    projectMaster: getProjectMaster[0],
    vrnMaster: getVrnMaster[0],
    laneMaster: getLaneMaster[0],
    moduleMaster: getModuleMaster[0],
    reportMaster: getReportMaster[0],
    roleMaster: getRolesMaster[0],
    paymentTypeMaster: getPaymentTypeMaster[0],
    subPaymentTypeMaster: getPaymentSubTypeMaster[0],
    getCollector: getCollector[0],
    getCashier: getCashier[0]
  };
};

module.exports = {
  getAllMaster,
};
