const { db, sequelize } = require('../models');

// transaction status service deshboard
const plazaWiseCountExit = async (duration) => {
  let condition = '';
  let condition1 = '';
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
    condition1 += ` TS.EXIT_PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
    condition1 += ` TS.EXIT_PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
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
WHERE ${condition} LANE_TYPE ='EX' AND IS_DUPLICATE=0;`)
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
WHERE ${condition1} 1=1;`)

  return {
    plazaWiseCountExit: plazaWiseCountExit[0][0],
    merageTransaction: merageTransaction[0][0]
  };
};
// transaction status service deshboard
const plazaWiseCountEntry = async (duration) => {
  let condition = '';
  let condition1 = '';
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
    condition1 += ` TS.ENTRY_PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` TS.PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
    condition1 += ` TS.ENTRY_PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
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
WHERE ${condition} LANE_TYPE ='EN' AND IS_DUPLICATE=0;`)

  const merageTransaction = await sequelize.query(`SELECT
SUM(CASE WHEN ENTRY_PLAZA_CODE = '311003' THEN 1 ELSE 0 END) AS 'SaraKaleKhan',
SUM(CASE WHEN ENTRY_PLAZA_CODE = '311005' THEN 1 ELSE 0 END) AS 'Indirapuram',
SUM(CASE WHEN ENTRY_PLAZA_CODE = '320100' THEN 1 ELSE 0 END) AS 'Dundahera',
SUM(CASE WHEN ENTRY_PLAZA_CODE = '320101' THEN 1 ELSE 0 END) AS 'Dasna',
SUM(CASE WHEN ENTRY_PLAZA_CODE = '320102' THEN 1 ELSE 0 END) AS 'RasoolpurSikrod',
SUM(CASE WHEN ENTRY_PLAZA_CODE = '320103' THEN 1 ELSE 0 END) AS 'Bhojpur',
SUM(CASE WHEN ENTRY_PLAZA_CODE = '320112' THEN 1 ELSE 0 END) AS 'Kashi',
COUNT(EXIT_PLAZA_CODE) AS 'totalCount'
FROM TBL_MASTER_TRANS AS TS
WHERE ${condition1} 1=1;`)


  return {
    plazaWiseCountEntry: plazaWiseCountEntry[0][0],
    merageTransaction: merageTransaction[0][0]
  }
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

const apiFetchStatus = async () => {
  const data = await sequelize.query(`DECLARE @now DATETIME = CURRENT_TIMESTAMP
  SELECT 
   tm1.PLAZA_NAME, 
   max(passage_time) as "LAST_DATA_RCVD",
   DATEDIFF(SECOND,0,(@now - MAX(passage_time))) as "DELAY"
   from 
     TBL_SLAVE_TRANS
     INNER JOIN TBL_PLAZA_MASTER AS tm1 ON tm1.PLAZA_CODE = [TBL_SLAVE_TRANS].[PLAZA_CODE]
     WHERE PASSAGE_TIME >= GETDATE()-1
     GROUP BY 
   tm1.PLAZA_NAME`)
  return data[0]
}

const getRevenueData = async (duration) => {
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
    condition += ` EXIT_PASSAGE_TIME BETWEEN'${duration.fromDate.replace(',', ' ')}' AND '${duration.toDate.replace(',', ' ')}' AND `
  }
  else {
    const fromDate = current1 + " " + "00:00:00";
    condition += ` EXIT_PASSAGE_TIME BETWEEN'${fromDate.replace(',', ' ')}' AND '${toDate.replace(',', ' ')}' AND `
  }

  const data = await sequelize.query(`SELECT
  SUM(CASE WHEN VEH_CLASS = 4 THEN TOLL_FARE ELSE 0 END) AS 'CAR\JEEP\VAN1',
SUM(CASE WHEN VEH_CLASS = 5 THEN TOLL_FARE ELSE 0 END) AS 'LCV1',
SUM(CASE WHEN VEH_CLASS = 6 THEN TOLL_FARE ELSE 0 END) AS 'MAV3AXLES1',
SUM(CASE WHEN VEH_CLASS = 7 THEN TOLL_FARE ELSE 0 END) AS 'BusTruck1',
SUM(CASE WHEN VEH_CLASS = 8 THEN TOLL_FARE ELSE 0 END) AS 'MAV3AXLES2',
SUM(CASE WHEN VEH_CLASS = 9 THEN TOLL_FARE ELSE 0 END) AS 'LCV2',
SUM(CASE WHEN VEH_CLASS = 10 THEN TOLL_FARE ELSE 0 END) AS 'BusTruck2',
SUM(CASE WHEN VEH_CLASS = 11 THEN TOLL_FARE ELSE 0 END) AS 'MAV3AXLES3',
SUM(CASE WHEN VEH_CLASS = 12 THEN TOLL_FARE ELSE 0 END) AS 'MAV4to6Axles1',
SUM(CASE WHEN VEH_CLASS = 13 THEN TOLL_FARE ELSE 0 END) AS 'MAV4to6Axles2',
SUM(CASE WHEN VEH_CLASS = 14 THEN TOLL_FARE ELSE 0 END) AS 'MAV4to6Axles3',
SUM(CASE WHEN VEH_CLASS = 15 THEN TOLL_FARE ELSE 0 END) AS 'OSV1',
SUM(CASE WHEN VEH_CLASS = 16 THEN TOLL_FARE ELSE 0 END) AS 'OSV2',
SUM(CASE WHEN VEH_CLASS = 17 THEN TOLL_FARE ELSE 0 END) AS 'OSV3',
SUM(CASE WHEN VEH_CLASS = 18 THEN TOLL_FARE ELSE 0 END) AS 'CAR\JEEP\VAN2',
SUM(CASE WHEN VEH_CLASS = 19 THEN TOLL_FARE ELSE 0 END) AS 'LCV3',
SUM(CASE WHEN VEH_CLASS = 20 THEN TOLL_FARE ELSE 0 END) AS 'LCV4',
 SUM(TOLL_FARE) AS 'Total'
FROM TBL_RESP_API
WHERE ${condition} 1=1`);

  const object = {
    CARJEEPVAN: data[0][0].CARJEEPVAN1 + data[0][0].CARJEEPVAN2,
    LCV: data[0][0].LCV1 + data[0][0].LCV2 + data[0][0].LCV3 + data[0][0].LCV4,
    MAV3AXLES: data[0][0].MAV3AXLES1 + data[0][0].MAV3AXLES2 + data[0][0].MAV3AXLES3,
    BusTruck: data[0][0].BusTruck1 + data[0][0].BusTruck2,
    MAV4to6Axles: Number(data[0][0].MAV4to6Axles1) + Number(data[0][0].MAV4to6Axles2) + Number(data[0][0].MAV4to6Axles3),
    OverSizeVehicle: data[0][0].OSV1 + data[0][0].OSV2 + data[0][0].OSV3,
    Total: data[0][0].Total
  }

  return object;
}

module.exports = {
  plazaWiseCountExit,
  plazaWiseCountEntry,
  plazaWiseCount,
  merageTransaction,
  merageTransactionVehicle,
  apiFetchStatus,
  getRevenueData
}