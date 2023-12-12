const { db, sequelize } = require('../models');
const { Op } = require('sequelize');
const si = require('systeminformation');

// transaction status service deshboard
const plazaWiseCountExit = async (duration) => {
  let condition = '';
  const day = new Date();
  const timeZone = "Asia/Kolkata";
  const option = {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const option1 = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const current1 = new Intl.DateTimeFormat("en-US", option).format(day);
  const currentTime = new Intl.DateTimeFormat("en-US", option1).format(day);
  const toDate = current1 + " " + currentTime

  if (duration.fromDate && duration.toDate) {

    condition += ` TS.PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
  }

  const plazaWiseCountExit = await sequelize.query(`SELECT
  SUM(CASE WHEN PLAZA_CODE = '311003' THEN 1 ELSE 0 END) AS 'SaraiKaleKhan',
  SUM(CASE WHEN PLAZA_CODE = '311005' THEN 1 ELSE 0 END) AS 'Indirapuram',
  SUM(CASE WHEN PLAZA_CODE = '320100' THEN 1 ELSE 0 END) AS 'Dundahera',
  SUM(CASE WHEN PLAZA_CODE = '320101' THEN 1 ELSE 0 END) AS 'Dasna',
  SUM(CASE WHEN PLAZA_CODE = '320102' THEN 1 ELSE 0 END) AS 'RasoolpurSikrod',
  SUM(CASE WHEN PLAZA_CODE = '320103' THEN 1 ELSE 0 END) AS 'Bhojpur',
SUM(CASE WHEN PLAZA_CODE = '320112' THEN 1 ELSE 0 END) AS 'Kashi',
  COUNT(PLAZA_CODE) AS 'totalCount'
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} LANE_TYPE ='EX';`)

  return plazaWiseCountExit[0][0];
};
// transaction status service deshboard
const plazaWiseCountEntry = async (duration) => {
  let condition = '';
  const day = new Date();
  const timeZone = "Asia/Kolkata";
  const option = {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const option1 = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const current1 = new Intl.DateTimeFormat("en-US", option).format(day);
  const currentTime = new Intl.DateTimeFormat("en-US", option1).format(day);
  const toDate = current1 + " " + currentTime

  if (duration.fromDate && duration.toDate) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
  }


  const plazaWiseCountEntry = await sequelize.query(`SELECT
  SUM(CASE WHEN PLAZA_CODE = '311003' THEN 1 ELSE 0 END) AS 'SaraiKaleKhan',
  SUM(CASE WHEN PLAZA_CODE = '311005' THEN 1 ELSE 0 END) AS 'Indirapuram',
  SUM(CASE WHEN PLAZA_CODE = '320100' THEN 1 ELSE 0 END) AS 'Dundahera',
  SUM(CASE WHEN PLAZA_CODE = '320101' THEN 1 ELSE 0 END) AS 'Dasna',
  SUM(CASE WHEN PLAZA_CODE = '320102' THEN 1 ELSE 0 END) AS 'RasoolpurSikrod',
  SUM(CASE WHEN PLAZA_CODE = '320103' THEN 1 ELSE 0 END) AS 'Bhojpur',
SUM(CASE WHEN PLAZA_CODE = '320112' THEN 1 ELSE 0 END) AS 'Kashi',
  COUNT(PLAZA_CODE) AS 'totalCount'
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} LANE_TYPE ='EN';`)

  return plazaWiseCountEntry[0][0];
};


const plazaWiseCount = async (duration) => {
  let condition = '';
  const day = new Date();
  const timeZone = "Asia/Kolkata";
  const option = {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const option1 = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const current1 = new Intl.DateTimeFormat("en-US", option).format(day);
  const currentTime = new Intl.DateTimeFormat("en-US", option1).format(day);
  const toDate = current1 + " " + currentTime

  if (duration.fromDate && duration.toDate) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
  }

  const plazaWiseCount = await sequelize.query(`SELECT
  SUM(CASE WHEN PLAZA_CODE = '311003' THEN 1 ELSE 0 END) AS 'SaraiKaleKhan',
  SUM(CASE WHEN PLAZA_CODE = '311005' THEN 1 ELSE 0 END) AS 'Indirapuram',
  SUM(CASE WHEN PLAZA_CODE = '320100' THEN 1 ELSE 0 END) AS 'Dundahera',
  SUM(CASE WHEN PLAZA_CODE = '320101' THEN 1 ELSE 0 END) AS 'Dasna',
  SUM(CASE WHEN PLAZA_CODE = '320102' THEN 1 ELSE 0 END) AS 'RasoolpurSikrod',
  SUM(CASE WHEN PLAZA_CODE = '320103' THEN 1 ELSE 0 END) AS 'Bhojpur',
SUM(CASE WHEN PLAZA_CODE = '320112' THEN 1 ELSE 0 END) AS 'Kashi',
  COUNT(PLAZA_CODE) AS 'totalCount'
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} 1=1;`)

  return plazaWiseCount[0][0];
};


const merageTransaction = async (duration) => {
  let condition = '';
  const day = new Date();
  const timeZone = "Asia/Kolkata";
  const option = {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const option1 = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const current1 = new Intl.DateTimeFormat("en-US", option).format(day);
  const currentTime = new Intl.DateTimeFormat("en-US", option1).format(day);
  const toDate = current1 + " " + currentTime

  if (duration.fromDate && duration.toDate) {
    condition += ` TS.EXIT_PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.EXIT_PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
  }

  const merageTransaction = await sequelize.query(`SELECT
  SUM(CASE WHEN EXIT_PLAZA_CODE = '311003' THEN 1 ELSE 0 END) AS 'SaraKaleKhan',
  SUM(CASE WHEN EXIT_PLAZA_CODE = '311005' THEN 1 ELSE 0 END) AS 'Indirapuram',
  SUM(CASE WHEN EXIT_PLAZA_CODE = '320100' THEN 1 ELSE 0 END) AS 'Dundahera',
  SUM(CASE WHEN EXIT_PLAZA_CODE = '320101' THEN 1 ELSE 0 END) AS 'Dasna',
  SUM(CASE WHEN EXIT_PLAZA_CODE = '320102' THEN 1 ELSE 0 END) AS 'RasoolpurSikrod',
  SUM(CASE WHEN EXIT_PLAZA_CODE = '320103' THEN 1 ELSE 0 END) AS 'Bhojpur',
SUM(CASE WHEN EXIT_PLAZA_CODE = '320112' THEN 1 ELSE 0 END) AS 'Kashi',
  COUNT(EXIT_PLAZA_CODE) AS 'totalCount'
FROM TBL_MASTER_TRANS AS TS
WHERE ${condition} 1=1;`)

  return merageTransaction[0][0];
};

const merageTransactionVehicle = async (duration) => {
  let condition = '';
  const day = new Date();
  const timeZone = "Asia/Kolkata";
  const option = {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const option1 = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const current1 = new Intl.DateTimeFormat("en-US", option).format(day);
  const currentTime = new Intl.DateTimeFormat("en-US", option1).format(day);
  const toDate = current1 + " " + currentTime

  if (duration.fromDate && duration.toDate) {
    condition += ` TS.EXIT_PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.EXIT_PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
  }

  const merageTransactionVehicle = await sequelize.query(`SELECT
  SUM(CASE WHEN VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\\JEEP\\VAN',
  SUM(CASE WHEN VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\\MINIBUS',
  SUM(CASE WHEN VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
  SUM(CASE WHEN VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
  SUM(CASE WHEN VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
  SUM(CASE WHEN VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
  SUM(CASE WHEN VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized vehicle'
FROM TBL_MASTER_TRANS AS TS
WHERE ${condition} 1=1;`)

  return merageTransactionVehicle[0][0];
};
module.exports = {
  plazaWiseCountExit,
  plazaWiseCountEntry,
  plazaWiseCount,
  merageTransaction,
  merageTransactionVehicle
}