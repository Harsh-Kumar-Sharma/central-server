const { db, sequelize } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
var csvWriter = require('csv-write-stream');
const pdf = require('pdf-creator-node');
const logger = require('../config/logger');




// create generate reports
const generateReports = async (filterBody) => {
  const report = await db.tms_reports.create({
    from: new Date(filterBody.fromDate),
    to: new Date(filterBody.toDate),
    status: 'Pending',
    created_at: new Date(),
  });

  const { reportsId } = filterBody;
  try {
    for (let id of reportsId) {
      if (id === 1) await excelDataFilter(filterBody, report);
      if (id === 2) await summaryCountReport(filterBody, report);
      if (id === 3) await summaryRevenueReport(filterBody, report);
      if (id === 4) await getRevenueDateWiseAndLaneWiseReport(filterBody, report);
      if (id === 5) await getCountWithRevenueReport(filterBody, report);
      if (id === 6) await getRevenueDateWiseReport(filterBody, report);
      if (id === 7) await getCountLaneAndDateWiseReport(filterBody, report);
      if (id === 8) await getCountvehicleWiseAndDateWiseReport(filterBody, report);
      if (id === 9) await getAvcReport(filterBody, report);
      if (id === 10) await reportShiftCollection(filterBody, report)
      if (id === 11) await reportForShortExcess(filterBody, report)

    }

    await db.tms_reports.update(
      {
        status: 'Done',
      },
      {
        where: {
          id: report.id,
        },
      }
    );
  } catch (e) {
    await db.tms_reports.update(
      {
        status: 'Failed',
      },
      {
        where: {
          id: report.id,
        },
      }
    );
    throw new Error(e);
  }
};

// Excel Report Generate service
const excelDataFilter = async (filterBody, reportData) => {
  const body = filterBody;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += `PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
  if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
  if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
    condition += `ABNORMALITY = '${body.abnormality}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `VEH_CLASS = '${body.vehicleClass}' AND `;
  if (body.avcClass && body.avcClass !== 'null' && body.avcClass !== 'All')
    condition += `AVC_CLASS = '${body.avcClass}' AND `;
  if (body.operater && body.operater !== 'null' && body.operater !== 'All')
    condition += `OPERATOR_ID = '${body.operater.USERNAME}' AND `;
  if (body.paymentSubtype && body.paymentSubtype !== 'null' && body.paymentSubtype !== 'All')
    condition += `PAYMENT_SUBTYPE = '${body.paymentSubtype}' AND `;

  // Fetch the total count of data
  const totalCountData = await sequelize.query(
    `SELECT COUNT(*) as totalCount FROM TBL_SLAVE_TRANS [TBL_SLAVE_TRANS]
    LEFT OUTER JOIN [TBL_MASTER_CLASS] AS [VEH] ON [TBL_SLAVE_TRANS].[VEH_CLASS] = [VEH].[CLASS_NO]
		LEFT OUTER JOIN [TBL_MASTER_CLASS] AS [REVEH] ON [TBL_SLAVE_TRANS].[RE_VEH_CLASS] = [REVEH].[CLASS_NO]
		LEFT OUTER JOIN [TBL_MASTER_CLASS] AS [AVC] ON [TBL_SLAVE_TRANS].[AVC_CLASS] = [AVC].[CLASS_NO]
		INNER JOIN [PAYMENTTYPE] AS [PAY] ON [TBL_SLAVE_TRANS].[PAYMENT_TYPE] = [PAY].[PAYMENTTYPE] AND [PAY].[status] = 1
		INNER JOIN [PAYMENTSUBTYPE] AS [PAYSUB] ON [TBL_SLAVE_TRANS].[PAYMENT_SUBTYPE] = [PAYSUB].[PAYMENTSUBTYPE] 
		AND [PAYSUB].[status] = 1 where ${condition} 1=1`
  );
  const totalCount = totalCountData[0][0].totalCount;
  if (totalCount === 0) {
    throw new Error('Data is not available into db');
  }
  var file = Math.ceil(totalCount / 1005000);
  let currentpageno = 1;
  for (let i = 0; i < file; i++) {
    let fixNumber = i + 1;
    const reportGenerate = await addDataInExcel(condition, totalCount, filterBody, currentpageno, fixNumber);
    currentpageno = reportGenerate.printPage;

    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.dataValues.id,
      type_id: 1,
      download_url: reportGenerate.filePath,
    });
  }

  return true;
};

const addDataInExcel = async (condition, totalCount, filterBody, currentpageno, fixNumber) => {
  try {
    const body = filterBody;
    const timeZone = 'Asia/Kolkata';
    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    fromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    toDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    const filename =
      'tms_allReport_' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());
    const fixNo = fixNumber;
    const fileNumber = `_file_${fixNo}`;
    const ext = '.csv';

    const filePath = path.join(require('os').homedir(), 'downloads', filename + fileNumber + ext);

    const pageSize = 1500; // Number of records to fetch from the database per chunk
    const totalPages = 670 * fixNo;
    let current = currentpageno;
    let printPage = 1;
    const writer = csvWriter({
      headers: [
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
      ],
    });
    writer.pipe(fs.createWriteStream(filePath));

    // Write data with empty value for the second column to skip it
    writer.write(['        ', '        ', '        ', 'ALL TRANSACTION REPORT', '']);
    writer.write(['        ', '        ', '        ', `FROM : ${fromDate}`]);
    writer.write(['        ', '        ', '        ', `TO : ${toDate}`]);
    if (body.lane && body.lane !== 'null') writer.write(['        ', '        ', '        ', `LANE : ${body.lane}`]);
    if (body.laneType && body.laneType !== 'null')
      writer.write(['        ', '        ', '        ', `LANE TYPE : ${body.laneType}`]);
    if (body.abnormality && body.abnormality !== 'null')
      writer.write(['        ', '        ', '        ', `ABNORMALITY : ${body.abnormality}`]);
    if (body.paymentType && body.paymentType !== 'null')
      writer.write(['        ', '        ', '        ', `PAYMENT TYPE : ${body.paymentType}`]);
    if (body.paymentSubType && body.paymentSubType !== 'null')
      writer.write(['        ', '        ', '        ', `PAYMENT SUBTYPE : ${body.paymentSubType}`]);
    if (body.vehicleClass && body.vehicleClass !== 'null')
      writer.write(['        ', '        ', '        ', `VEH_CLASS :  ${body.vehicleClass}`]);
    if (body.avcClass && body.avcClass !== 'null')
      writer.write(['        ', '        ', '        ', `AVC_CLASS : ${body.avcClass}`]);
    if (body.loginUser && body.loginUser !== 'null')
      writer.write(['        ', '        ', '        ', `GENERATED BY : ${body.loginUser}`]);

    writer.write(['        ', '        ', '        ', `TOTAL : ${totalCount}`]);
    if (body.tagid && body.tagid !== 'null') {
      writer.write(['        ', '        ', '        ', `TAGID : ${body.tagId}`]);
    }
    if (body.txnid && body.txnid !== 'null') {
      writer.write(['        ', '        ', '        ', `TRANSACTIONID : ${body.transactionId}`]);
    }
    if (body.plateno && body.plateno !== 'null') {
      writer.write(['        ', '        ', '        ', `PLATE NUMBER:  ${body.plateNumber}`]);
    }
    writer.write(['        ', '        ', '        ']);
    writer.write(['        ', '        ', '        ']);
    writer.write(['        ', '        ', '        ']);
    writer.write([
      'Plaza_Code',
      'Trxns_Id',
      'Tag Id',
      'Lane_Type',
      'Direction',
      'Passage_Time',
      'Tc_Id',
      'Payment_Type',
      'Payment_SubType',
      'Veh Plate',
      'Toll_Class',
      'Avc_Class',
      'Toll_Fee',
      'OW_Fee',
      'Total_Fee',
      'Abnormal',
      'Op_Comment',
      'Review_Class',
      'Review_Fee',
      'IsReviewed',
      'Review_Comment',
      'Weight',
    ]);

    for (let currentPage = current; currentPage <= totalPages; currentPage++) {
      const data = await sequelize.query(
        `select
      PLAZA_CODE,
      LANE_TRANS_ID,
      API_TRANS_ID,
      LANE_ID,
      LANE_TYPE,
      OPERATOR_ID,
      FORMAT(PASSAGE_TIME, 'M/d/yyyy, hh:mm:ss tt') AS PASSAGE_TIME,
      PAN,
      VEH_PLATE,
      VEH_CLASS,
      AVC_CLASS, 
      WEIGHT,
      DIRECTION,
      PAYMENT_TYPE,
      PAYMENT_SUBTYPE,
      CLASS_FARE,
      PENALTY_FARE,
      OW_FARE,
      TOTAL_FARE,
      OPERATOR_COMMENT,
      ABNORMALITY,
      REVIEWER_ID,
      RE_VEH_PLATE,
      RE_VEH_CLASS,
      RE_VEH_FEE,
      RE_TIME,
      RE_PAYMENT_TYPE,
      RE_PAYMENT_SUBTYPE,
      RE_COMMENT,
      RE_STATUS,
      CS_COMMENT,
      MODE,
      VALID_ID,
      [VEH].CLASS_DESCRIPTION,
      [AVC].CLASS_DESCRIPTION as 'Avc',
     [REVEH].CLASS_DESCRIPTION as 'REVEH_CLASS_DESCRIPTION',
      [PAY].DESCRIPTION,
      [PAYSUB].DESCRIPTION as 'Sub_DESCRIPTION'
      from TBL_SLAVE_TRANS [TBL_SLAVE_TRANS]
      LEFT OUTER JOIN [TBL_MASTER_CLASS] AS [VEH] ON [TBL_SLAVE_TRANS].[VEH_CLASS] = [VEH].[CLASS_NO]
  LEFT OUTER JOIN [TBL_MASTER_CLASS] AS [REVEH] ON [TBL_SLAVE_TRANS].[RE_VEH_CLASS] = [REVEH].[CLASS_NO]
  LEFT OUTER JOIN [TBL_MASTER_CLASS] AS [AVC] ON [TBL_SLAVE_TRANS].[AVC_CLASS] = [AVC].[CLASS_NO]
  INNER JOIN [PAYMENTTYPE] AS [PAY] ON [TBL_SLAVE_TRANS].[PAYMENT_TYPE] = [PAY].[PAYMENTTYPE] AND [PAY].[status] = 1
  INNER JOIN [PAYMENTSUBTYPE] AS [PAYSUB] ON [TBL_SLAVE_TRANS].[PAYMENT_SUBTYPE] = [PAYSUB].[PAYMENTSUBTYPE] 
  AND [PAYSUB].[status] = 1 where ${condition} 1=1 ORDER BY PASSAGE_TIME ASC OFFSET ${(currentPage - 1) * pageSize
        } ROWS FEtCH NEXT ${pageSize} ROWS ONLY 
        `
      );

      // Write data to the worksheet
      data[0].forEach((obj, index) => {
        const row = [
          obj.PLAZA_CODE,
          obj.LANE_TRANS_ID,
          obj.TAG,
          obj.LANE_TYPE,
          obj.DIRECTION,
          obj.PASSAGE_TIME,
          obj.OPERATOR_ID,
          obj.DESCRIPTION,
          obj.Sub_DESCRIPTION,
          obj.VEH_PLATE,
          obj.CLASS_DESCRIPTION,
          obj.Avc,
          obj.CLASS_FARE,
          obj.OW_FARE,
          obj.TOTAL_FARE,
          obj.ABNORMALITY,
          obj.OPERATOR_COMMENT,
          obj.REVEH_CLASS_DESCRIPTION,
          obj.RE_VEH_FEE,
          obj.IS_SAME_DIR,
          obj.RE_COMMENT,
          obj.WEIGHT,
        ];
        writer.write(row);
      });
      printPage++;
      if (data[0].length === 0) {
        break;
      }
    }
    writer.end();
    const reportData = {
      printPage: printPage,
      filePath: filePath,
    };

    return reportData;
  } catch (error) {
    throw new Error('Error creating Excel file:', error);
  }
};

// Get all transaction count Payment Type Wise
const getTransactionCount = async (filterBody) => {
  const body = filterBody;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
  if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
  if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
    condition += `ABNORMALITY = '${body.abnormality}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

  const countObject = await sequelize.query(`SELECT
  PS.DESCRIPTION AS PAYMENT_TYPE,
   SUM(CASE WHEN RE_VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
   SUM(CASE WHEN RE_VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS',
   SUM(CASE WHEN RE_VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
   SUM(CASE WHEN RE_VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
   SUM(CASE WHEN RE_VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
   SUM(CASE WHEN RE_VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
   SUM(CASE WHEN RE_VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle'
FROM TBL_SLAVE_TRANS AS TS
INNER JOIN PAYMENTTYPE AS PS ON TS.RE_PAYMENT_TYPE = PS.PAYMENTTYPE
WHERE
 ${condition}
   TS.RE_PAYMENT_TYPE IS NOT NULL AND
   PS.STATUS = 1
GROUP BY PS.DESCRIPTION
ORDER BY PAYMENT_TYPE;
`)
  for (let i = 0; i < countObject[0].length; i++) {
    countObject[0][i].Total = countObject[0][i].CARJEEPVAN + countObject[0][i].LCVMINIBUS
      + countObject[0][i].BUS2AXLES + countObject[0][i].TRUCK2AXLES + countObject[0][i].MAV3AXLES +
      countObject[0][i].MAV4to6AXLES + countObject[0][i].Oversized_vehicle
  }

  const obj1 = {
    PAYMENT_TYPE: 'TotalCount',
    CARJEEPVAN: 0,
    LCVMINIBUS: 0,
    BUS2AXLES: 0,
    TRUCK2AXLES: 0,
    MAV3AXLES: 0,
    MAV4to6AXLES: 0,
    Oversized_vehicle: 0,
    Total: 0
  };
  for (let val of countObject[0]) {
    (obj1.CARJEEPVAN += val.CARJEEPVAN),
      (obj1.LCVMINIBUS += val.LCVMINIBUS),
      (obj1.BUS2AXLES += val.BUS2AXLES),
      (obj1.TRUCK2AXLES += val.TRUCK2AXLES),
      (obj1.MAV3AXLES += val.MAV3AXLES),
      (obj1.MAV4to6AXLES += val.MAV4to6AXLES),
      (obj1.Oversized_vehicle += val.Oversized_vehicle),
      (obj1.Total += val.Total)
  }
  countObject[0].push(obj1);

  return countObject[0];
}
// Get Count Class Vehicle Class and Date Wise
const getCountClassWiseAndDateWise = async (filterBody) => {
  const body = filterBody;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
  if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
  if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
    condition += `ABNORMALITY = '${body.abnormality}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

  const countObjects = await sequelize.query(` SELECT
  SUM(CASE WHEN RE_VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
  SUM(CASE WHEN RE_VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS',
  SUM(CASE WHEN RE_VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle',
  SUM(1) AS 'Total',
  CAST(TS.PASSAGE_TIME AS DATE) AS Day
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} 1=1 
GROUP BY CAST(TS.PASSAGE_TIME AS DATE)
ORDER BY CAST(TS.PASSAGE_TIME AS DATE) DESC;
`)
  return countObjects[0];
}
// Get Count  Lane Wise And Date Wise
const getCountLaneAndDateWise = async (filterBody) => {
  const body = filterBody;;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;


  const countObject = await sequelize.query(`SELECT
  LANE_ID AS LANE_NAME,
  CAST(TS.PASSAGE_TIME AS DATE) AS Day,
  COUNT(*) AS TotalCount
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} 1=1
GROUP BY LANE_ID, CAST(TS.PASSAGE_TIME AS DATE)
ORDER BY LANE_ID, Day;
`)

  const result = countObject[0].reduce((acc, obj) => {
    const { LANE_NAME, Day, TotalCount } = obj;

    if (!acc[Day]) {
      acc[Day] = { Day };
    }

    acc[Day][LANE_NAME] = TotalCount;

    return acc;
  }, {});

  const transformedData = Object.values(result);
  transformedData.forEach(obj => {
    let sum = 0;
    // Calculate the sum of all lanes except "Day"
    for (const key in obj) {
      if (key !== "Day") {
        sum += obj[key];
      }
    }
    // Add a new key "total" with the summed value to the object
    obj.total = sum;
  });
  return transformedData;
}
// Generate Count Report Lane Wise And Date Wise
const getCountLaneAndDateWiseReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';

    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;


    const countObject = await sequelize.query(`SELECT
   LANE_ID AS LANE_NAME,
   CAST(TS.PASSAGE_TIME AS DATE) AS Day,
   COUNT(*) AS TotalCount
 FROM TBL_SLAVE_TRANS AS TS
 WHERE ${condition} 1=1
 GROUP BY LANE_ID, CAST(TS.PASSAGE_TIME AS DATE)
 ORDER BY LANE_ID, Day;
 `)

    const result = countObject[0].reduce((acc, obj) => {
      const { LANE_NAME, Day, TotalCount } = obj;

      if (!acc[Day]) {
        acc[Day] = { Day };
      }

      acc[Day][LANE_NAME] = TotalCount;
      return acc;
    }, {});

    const transformedData = Object.values(result);
    // Iterate through each object in the array
    transformedData.forEach(obj => {
      let sum = 0;
      // Calculate the sum of all lanes except "Day"
      for (const key in obj) {
        if (key !== "Day") {
          sum += obj[key];
        }
      }
      // Add a new key "total" with the summed value to the object
      obj.total = sum;
    });
    //return transformedData;

    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/laneWiseAndDateWiseCount.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      timeout: 300000
    };

    const fileName =
      'tms_' +
      'CountDateWiseAndLaneWise' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: transformedData,
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result1 = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };

    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 7,
      download_url: filePath,
    });

    return result1;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
//Generate Report Count vehicle And Date Wise
const getCountvehicleWiseAndDateWiseReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';

    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
    if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
    if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
      condition += `ABNORMALITY = '${body.abnormality}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

    const countObject = await sequelize.query(` SELECT
     SUM(CASE WHEN RE_VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
     SUM(CASE WHEN RE_VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS',
     SUM(CASE WHEN RE_VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle',
     SUM(1) AS 'Total',
     CAST(TS.PASSAGE_TIME AS DATE) AS Day
   FROM TBL_SLAVE_TRANS AS TS
   WHERE ${condition} 1=1 
   GROUP BY CAST(TS.PASSAGE_TIME AS DATE)
   ORDER BY CAST(TS.PASSAGE_TIME AS DATE) DESC;
   `)


    //return countObject[0];  

    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/countVehicleClassWise.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      timeout: 300000
    };

    const fileName =
      'tms_' +
      'CountDateWiseAndVehicleClass' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: countObject[0],
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };

    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 8,
      download_url: filePath,
    });
    return result;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
// Generate Report for count summary with vehicle class and payment type
const summaryCountReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';
    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
    if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
    if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
      condition += `ABNORMALITY = '${body.abnormality}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

    const countObject = await sequelize.query(`SELECT
    PS.DESCRIPTION AS PAYMENT_SUBTYPE,
     SUM(CASE WHEN RE_VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
     SUM(CASE WHEN RE_VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS',
     SUM(CASE WHEN RE_VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
     SUM(CASE WHEN RE_VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle'
  FROM TBL_SLAVE_TRANS AS TS
  INNER JOIN PAYMENTSUBTYPE AS PS ON TS.RE_PAYMENT_SUBTYPE = PS.PAYMENTSUBTYPE
  WHERE
   ${condition}
     TS.RE_PAYMENT_SUBTYPE IS NOT NULL AND
     PS.STATUS = 1
  GROUP BY PS.DESCRIPTION
  ORDER BY PAYMENT_SUBTYPE;
  `)
    for (let i = 0; i < countObject[0].length; i++) {
      countObject[0][i].Total = countObject[0][i].CARJEEPVAN + countObject[0][i].LCVMINIBUS
        + countObject[0][i].BUS2AXLES + countObject[0][i].TRUCK2AXLES + countObject[0][i].MAV3AXLES +
        countObject[0][i].MAV4to6AXLES + countObject[0][i].Oversized_vehicle
    }

    const obj1 = {
      PAYMENT_SUBTYPE: 'TotalCount',
      CARJEEPVAN: 0,
      LCVMINIBUS: 0,
      BUS2AXLES: 0,
      TRUCK2AXLES: 0,
      MAV3AXLES: 0,
      MAV4to6AXLES: 0,
      Oversized_vehicle: 0,
      Total: 0
    };
    for (let val of countObject[0]) {
      (obj1.CARJEEPVAN += val.CARJEEPVAN),
        (obj1.LCVMINIBUS += val.LCVMINIBUS),
        (obj1.BUS2AXLES += val.BUS2AXLES),
        (obj1.TRUCK2AXLES += val.TRUCK2AXLES),
        (obj1.MAV3AXLES += val.MAV3AXLES),
        (obj1.MAV4to6AXLES += val.MAV4to6AXLES),
        (obj1.Oversized_vehicle += val.Oversized_vehicle),
        (obj1.Total += val.Total)
    }
    countObject[0].push(obj1);

    // return countObject[0];
    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/countSummary.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: '10mm',
      timeout: 300000,
    };

    const fileName =
      'tms_' +
      'CountSummaryReport' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: countObject[0],
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };
    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 2,
      download_url: filePath,
    });

    return result;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
// Generate for Revenue summary with vehicle class and payment type
const summaryRevenueReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';
    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
    if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
    if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
      condition += `ABNORMALITY = '${body.abnormality}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

    const countObject = await sequelize.query(`SELECT
      PS.DESCRIPTION AS PAYMENT_SUBTYPE,
      sum(case when RE_VEH_CLASS=1 then RE_VEH_FEE else 0 end) as 'CAR\JEEP\VAN',
      sum(case when RE_VEH_CLASS=2 then RE_VEH_FEE else 0 end) as 'LCV\MINIBUS',
      sum(case when RE_VEH_CLASS=3 then RE_VEH_FEE else 0 end) as 'BUS2AXLES',
      sum(case when RE_VEH_CLASS=4 then RE_VEH_FEE else 0 end) as 'TRUCK2AXLES',
      sum(case when RE_VEH_CLASS=5 then RE_VEH_FEE else 0 end) as 'MAV3AXLES',
      sum(case when RE_VEH_CLASS=6 then RE_VEH_FEE else 0 end) as 'MAV4to6AXLES',
      sum(case when RE_VEH_CLASS=7 then RE_VEH_FEE else 0 end) as 'Oversized_vehicle'
    FROM TBL_SLAVE_TRANS AS TS
    INNER JOIN PAYMENTSUBTYPE AS PS ON TS.RE_PAYMENT_SUBTYPE = PS.PAYMENTSUBTYPE
    WHERE
     ${condition}
       TS.RE_PAYMENT_SUBTYPE IS NOT NULL AND
       PS.STATUS = 1
    GROUP BY PS.DESCRIPTION
    ORDER BY PAYMENT_SUBTYPE;
    `)
    for (let i = 0; i < countObject[0].length; i++) {
      countObject[0][i].Total = countObject[0][i].CARJEEPVAN + countObject[0][i].LCVMINIBUS
        + countObject[0][i].BUS2AXLES + countObject[0][i].TRUCK2AXLES + countObject[0][i].MAV3AXLES +
        countObject[0][i].MAV4to6AXLES + countObject[0][i].Oversized_vehicle
    }

    const obj1 = {
      PAYMENT_SUBTYPE: 'TotalRevenue',
      CARJEEPVAN: 0,
      LCVMINIBUS: 0,
      BUS2AXLES: 0,
      TRUCK2AXLES: 0,
      MAV3AXLES: 0,
      MAV4to6AXLES: 0,
      Oversized_vehicle: 0,
      Total: 0
    };
    for (let val of countObject[0]) {
      (obj1.CARJEEPVAN += val.CARJEEPVAN),
        (obj1.LCVMINIBUS += val.LCVMINIBUS),
        (obj1.BUS2AXLES += val.BUS2AXLES),
        (obj1.TRUCK2AXLES += val.TRUCK2AXLES),
        (obj1.MAV3AXLES += val.MAV3AXLES),
        (obj1.MAV4to6AXLES += val.MAV4to6AXLES),
        (obj1.Oversized_vehicle += val.Oversized_vehicle),
        (obj1.Total += val.Total)
    }
    countObject[0].push(obj1);

    // return countObject[0];
    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/revenueSummary.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: '10mm',
      timeout: 300000,
    };

    const fileName =
      'tms_' +
      'RevenueSummaryReport' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: countObject[0],
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };
    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 3,
      download_url: filePath,
    });

    return result;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
// Get Revenue Transaction Payment Type Wise
const getRevenueTransaction = async (filterBody) => {
  const body = filterBody;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
  if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
  if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
    condition += `ABNORMALITY = '${body.abnormality}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

  const countObject = await sequelize.query(`SELECT
  PS.DESCRIPTION AS PAYMENT_SUBTYPE,
  sum(case when RE_VEH_CLASS=1 then RE_VEH_FEE else 0 end) as 'CAR\JEEP\VAN',
  sum(case when RE_VEH_CLASS=2 then RE_VEH_FEE else 0 end) as 'LCV\MINIBUS',
  sum(case when RE_VEH_CLASS=3 then RE_VEH_FEE else 0 end) as 'BUS2AXLES',
  sum(case when RE_VEH_CLASS=4 then RE_VEH_FEE else 0 end) as 'TRUCK2AXLES',
  sum(case when RE_VEH_CLASS=5 then RE_VEH_FEE else 0 end) as 'MAV3AXLES',
  sum(case when RE_VEH_CLASS=6 then RE_VEH_FEE else 0 end) as 'MAV4to6AXLES',
  sum(case when RE_VEH_CLASS=7 then RE_VEH_FEE else 0 end) as 'Oversized_vehicle'
FROM TBL_SLAVE_TRANS AS TS
INNER JOIN PAYMENTSUBTYPE AS PS ON TS.RE_PAYMENT_SUBTYPE = PS.PAYMENTSUBTYPE
WHERE
 ${condition}
   TS.RE_PAYMENT_SUBTYPE IS NOT NULL AND
   PS.STATUS = 1
GROUP BY PS.DESCRIPTION
ORDER BY PAYMENT_SUBTYPE;
`)
  for (let i = 0; i < countObject[0].length; i++) {
    countObject[0][i].Total = countObject[0][i].CARJEEPVAN + countObject[0][i].LCVMINIBUS
      + countObject[0][i].BUS2AXLES + countObject[0][i].TRUCK2AXLES + countObject[0][i].MAV3AXLES +
      countObject[0][i].MAV4to6AXLES + countObject[0][i].Oversized_vehicle
  }

  const obj1 = {
    PAYMENT_SUBTYPE: 'TotalRevenue',
    CARJEEPVAN: 0,
    LCVMINIBUS: 0,
    BUS2AXLES: 0,
    TRUCK2AXLES: 0,
    MAV3AXLES: 0,
    MAV4to6AXLES: 0,
    Oversized_vehicle: 0,
    Total: 0
  };
  for (let val of countObject[0]) {
    (obj1.CARJEEPVAN += val.CARJEEPVAN),
      (obj1.LCVMINIBUS += val.LCVMINIBUS),
      (obj1.BUS2AXLES += val.BUS2AXLES),
      (obj1.TRUCK2AXLES += val.TRUCK2AXLES),
      (obj1.MAV3AXLES += val.MAV3AXLES),
      (obj1.MAV4to6AXLES += val.MAV4to6AXLES),
      (obj1.Oversized_vehicle += val.Oversized_vehicle),
      (obj1.Total += val.Total)
  }
  countObject[0].push(obj1);

  return countObject[0];

}

// Get Revenue  Data  Date Wise
const getRevenueDateWise = async (filterBody) => {
  const body = filterBody;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
  if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
  if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
    condition += `ABNORMALITY = '${body.abnormality}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

  const countObjects = await sequelize.query(` SELECT
  SUM(CASE WHEN RE_VEH_CLASS = 1 THEN RE_VEH_FEE ELSE 0 END) AS 'CAR\JEEP\VAN',
  SUM(CASE WHEN RE_VEH_CLASS = 2 THEN RE_VEH_FEE ELSE 0 END) AS 'LCV\MINIBUS',
  SUM(CASE WHEN RE_VEH_CLASS = 3 THEN RE_VEH_FEE ELSE 0 END) AS 'BUS2AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 4 THEN RE_VEH_FEE ELSE 0 END) AS 'TRUCK2AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 5 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV3AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 6 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV4to6AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 7 THEN RE_VEH_FEE ELSE 0 END) AS 'Oversized_vehicle',
  SUM(RE_VEH_FEE) AS 'Total',
  CAST(TS.PASSAGE_TIME AS DATE) AS Day
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} 1=1
GROUP BY CAST(TS.PASSAGE_TIME AS DATE)
ORDER BY CAST(TS.PASSAGE_TIME AS DATE) DESC;
`)
  return countObjects[0];
}

// Get Revenue Lane Wise With Date
const getRevenueLaneWise = async (filterBody) => {
  const body = filterBody;;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;


  const countObject = await sequelize.query(`SELECT
  LANE_ID AS LANE_NAME,
  CAST(TS.PASSAGE_TIME AS DATE) AS Day,
   SUM(RE_VEH_FEE) AS 'Total'
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} 1=1
GROUP BY LANE_ID, CAST(TS.PASSAGE_TIME AS DATE)
ORDER BY LANE_ID, Day;
`)

  const result = countObject[0].reduce((acc, obj) => {
    const { LANE_NAME, Day, Total } = obj;

    if (!acc[Day]) {
      acc[Day] = { Day };
    }

    acc[Day][LANE_NAME] = Total;

    return acc;
  }, {});

  const transformedData = Object.values(result);
  // Iterate through each object in the array
  transformedData.forEach(obj => {
    let sum = 0;
    // Calculate the sum of all lanes except "Day"
    for (const key in obj) {
      if (key !== "Day") {
        sum += obj[key];
      }
    }
    // Add a new key "total" with the summed value to the object
    obj.total = sum;
  });
  return transformedData;
}
//Get Revenue With Count 
const getCountWithRevenue = async (filterBody) => {

  const body = filterBody;;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;


  const countObject = await sequelize.query(`SELECT
  PS.DESCRIPTION AS PAYMENT_TYPE,
  SUM(CASE WHEN RE_VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN_Count',
  SUM(CASE WHEN RE_VEH_CLASS = 1 THEN RE_VEH_FEE ELSE 0 END) AS 'CAR\JEEP\VAN_Fee',
  SUM(CASE WHEN RE_VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS_Count',
  SUM(CASE WHEN RE_VEH_CLASS = 2 THEN RE_VEH_FEE ELSE 0 END) AS 'LCV\MINIBUS_Fee',
  SUM(CASE WHEN RE_VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES_Count',
  SUM(CASE WHEN RE_VEH_CLASS = 3 THEN RE_VEH_FEE ELSE 0 END) AS 'BUS2AXLES_Fee',
  SUM(CASE WHEN RE_VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES_Count',
   SUM(CASE WHEN RE_VEH_CLASS = 4 THEN RE_VEH_FEE ELSE 0 END) AS 'TRUCK2AXLES_Fee',
  SUM(CASE WHEN RE_VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES_Count',
  SUM(CASE WHEN RE_VEH_CLASS = 5 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV3AXLES_Fee',
  SUM(CASE WHEN RE_VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES_Count',
   SUM(CASE WHEN RE_VEH_CLASS = 6 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV4to6AXLES_Fee',
  SUM(CASE WHEN RE_VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle_Count',
  SUM(CASE WHEN RE_VEH_CLASS = 7 THEN RE_VEH_FEE ELSE 0 END) AS 'Oversized_vehicle_Fee',
  sum(1) as 'totalCount',
   sum(RE_VEH_FEE) as 'totalRevanue'
FROM TBL_SLAVE_TRANS AS TS
INNER JOIN PAYMENTTYPE AS PS ON TS.RE_PAYMENT_TYPE = PS.PAYMENTTYPE
WHERE ${condition} 1=1
  AND TS.RE_PAYMENT_TYPE IS NOT NULL
  AND PS.STATUS = 1
GROUP BY PS.DESCRIPTION
ORDER BY PAYMENT_TYPE;
`)

  const obj1 = {
    PAYMENT_TYPE: 'TotalCount',
    CARJEEPVAN_Count: 0,
    CARJEEPVAN_Fee: 0,
    LCVMINIBUS_Count: 0,
    LCVMINIBUS_Fee: 0,
    BUS2AXLES_Count: 0,
    BUS2AXLES_Fee: 0,
    TRUCK2AXLES_Count: 0,
    TRUCK2AXLES_Fee: 0,
    MAV3AXLES_Count: 0,
    MAV3AXLES_Fee: 0,
    MAV4to6AXLES_Count: 0,
    MAV4to6AXLES_Fee: 0,
    Oversized_vehicle_Count: 0,
    Oversized_vehicle_Fee: 0,
    totalCount: 0,
    totalRevanue: 0
  };
  for (let val of countObject[0]) {
    (obj1.CARJEEPVAN_Count += val.CARJEEPVAN_Count),
      (obj1.CARJEEPVAN_Fee += val.CARJEEPVAN_Fee),
      (obj1.LCVMINIBUS_Count += val.LCVMINIBUS_Count),
      (obj1.LCVMINIBUS_Fee += val.LCVMINIBUS_Fee),
      (obj1.BUS2AXLES_Count += val.BUS2AXLES_Count),
      (obj1.BUS2AXLES_Fee += val.BUS2AXLES_Fee),
      (obj1.TRUCK2AXLES_Count += val.TRUCK2AXLES_Count),
      (obj1.TRUCK2AXLES_Fee += val.TRUCK2AXLES_Fee),
      (obj1.MAV3AXLES_Count += val.MAV3AXLES_Count),
      (obj1.MAV3AXLES_Fee += val.MAV3AXLES_Fee),
      (obj1.MAV4to6AXLES_Count += val.MAV4to6AXLES_Count),
      (obj1.MAV4to6AXLES_Fee += val.MAV4to6AXLES_Fee),
      (obj1.Oversized_vehicle_Count += val.Oversized_vehicle_Count),
      (obj1.Oversized_vehicle_Fee += val.Oversized_vehicle_Fee),
      (obj1.totalCount += val.totalCount),
      (obj1.totalRevanue += val.totalRevanue)
  }
  countObject[0].push(obj1);

  return countObject[0];

}

// Generate Report for Revenue summary with vehicle class and payment type Report
const getCountWithRevenueReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';

    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;


    const countObject = await sequelize.query(`SELECT
    PS.DESCRIPTION AS PAYMENT_TYPE,
    SUM(CASE WHEN RE_VEH_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN_Count',
    SUM(CASE WHEN RE_VEH_CLASS = 1 THEN RE_VEH_FEE ELSE 0 END) AS 'CAR\JEEP\VAN_Fee',
    SUM(CASE WHEN RE_VEH_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS_Count',
    SUM(CASE WHEN RE_VEH_CLASS = 2 THEN RE_VEH_FEE ELSE 0 END) AS 'LCV\MINIBUS_Fee',
    SUM(CASE WHEN RE_VEH_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES_Count',
    SUM(CASE WHEN RE_VEH_CLASS = 3 THEN RE_VEH_FEE ELSE 0 END) AS 'BUS2AXLES_Fee',
    SUM(CASE WHEN RE_VEH_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES_Count',
     SUM(CASE WHEN RE_VEH_CLASS = 4 THEN RE_VEH_FEE ELSE 0 END) AS 'TRUCK2AXLES_Fee',
    SUM(CASE WHEN RE_VEH_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES_Count',
    SUM(CASE WHEN RE_VEH_CLASS = 5 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV3AXLES_Fee',
    SUM(CASE WHEN RE_VEH_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES_Count',
     SUM(CASE WHEN RE_VEH_CLASS = 6 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV4to6AXLES_Fee',
    SUM(CASE WHEN RE_VEH_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle_Count',
    SUM(CASE WHEN RE_VEH_CLASS = 7 THEN RE_VEH_FEE ELSE 0 END) AS 'Oversized_vehicle_Fee',
    sum(1) as 'totalCount',
     sum(RE_VEH_FEE) as 'totalRevanue'
  FROM TBL_SLAVE_TRANS AS TS
  INNER JOIN PAYMENTTYPE AS PS ON TS.RE_PAYMENT_TYPE = PS.PAYMENTTYPE
  WHERE ${condition} 1=1
    AND TS.RE_PAYMENT_TYPE IS NOT NULL
    AND PS.STATUS = 1
  GROUP BY PS.DESCRIPTION
  ORDER BY PAYMENT_TYPE;
  `)

    const obj1 = {
      PAYMENT_TYPE: 'TotalCount',
      CARJEEPVAN_Count: 0,
      CARJEEPVAN_Fee: 0,
      LCVMINIBUS_Count: 0,
      LCVMINIBUS_Fee: 0,
      BUS2AXLES_Count: 0,
      BUS2AXLES_Fee: 0,
      TRUCK2AXLES_Count: 0,
      TRUCK2AXLES_Fee: 0,
      MAV3AXLES_Count: 0,
      MAV3AXLES_Fee: 0,
      MAV4to6AXLES_Count: 0,
      MAV4to6AXLES_Fee: 0,
      Oversized_vehicle_Count: 0,
      Oversized_vehicle_Fee: 0,
      totalCount: 0,
      totalRevanue: 0
    };
    for (let val of countObject[0]) {
      (obj1.CARJEEPVAN_Count += val.CARJEEPVAN_Count),
        (obj1.CARJEEPVAN_Fee += val.CARJEEPVAN_Fee),
        (obj1.LCVMINIBUS_Count += val.LCVMINIBUS_Count),
        (obj1.LCVMINIBUS_Fee += val.LCVMINIBUS_Fee),
        (obj1.BUS2AXLES_Count += val.BUS2AXLES_Count),
        (obj1.BUS2AXLES_Fee += val.BUS2AXLES_Fee),
        (obj1.TRUCK2AXLES_Count += val.TRUCK2AXLES_Count),
        (obj1.TRUCK2AXLES_Fee += val.TRUCK2AXLES_Fee),
        (obj1.MAV3AXLES_Count += val.MAV3AXLES_Count),
        (obj1.MAV3AXLES_Fee += val.MAV3AXLES_Fee),
        (obj1.MAV4to6AXLES_Count += val.MAV4to6AXLES_Count),
        (obj1.MAV4to6AXLES_Fee += val.MAV4to6AXLES_Fee),
        (obj1.Oversized_vehicle_Count += val.Oversized_vehicle_Count),
        (obj1.Oversized_vehicle_Fee += val.Oversized_vehicle_Fee),
        (obj1.totalCount += val.totalCount),
        (obj1.totalRevanue += val.totalRevanue)
    }
    countObject[0].push(obj1);

    // return countObject[0];
    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/revenueWithCount.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: '10mm',
      timeout: 300000,
    };

    const fileName =
      'tms_' +
      'RevenueWithCountReport' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: countObject[0],
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };

    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 5,
      download_url: filePath,
    });

    return result;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
// Generate Report for Revenue summary with vehicle class and Date Wise Report
const getRevenueDateWiseReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';

    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.tagId && body.tagId !== 'null') condition += `TAG = '${body.tagId}' AND `;
    if (body.transactionId && body.transactionId !== 'null') condition += `LANE_TRANS_ID = '${body.transactionId}' AND `;
    if (body.plateNumber && body.plateNumber !== 'null') condition += `VEH_PLATE LIKE '%${body.plateNumber}' AND `;
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
      condition += `ABNORMALITY = '${body.abnormality}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `VEH_CLASS = '${body.vehicleClass}' AND `;

    const countObject = await sequelize.query(` SELECT
  SUM(CASE WHEN RE_VEH_CLASS = 1 THEN RE_VEH_FEE ELSE 0 END) AS 'CAR\JEEP\VAN',
  SUM(CASE WHEN RE_VEH_CLASS = 2 THEN RE_VEH_FEE ELSE 0 END) AS 'LCV\MINIBUS',
  SUM(CASE WHEN RE_VEH_CLASS = 3 THEN RE_VEH_FEE ELSE 0 END) AS 'BUS2AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 4 THEN RE_VEH_FEE ELSE 0 END) AS 'TRUCK2AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 5 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV3AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 6 THEN RE_VEH_FEE ELSE 0 END) AS 'MAV4to6AXLES',
  SUM(CASE WHEN RE_VEH_CLASS = 7 THEN RE_VEH_FEE ELSE 0 END) AS 'Oversized_vehicle',
  SUM(RE_VEH_FEE) AS 'Total',
  CAST(TS.PASSAGE_TIME AS DATE) AS Day
FROM TBL_SLAVE_TRANS AS TS
WHERE ${condition} 1=1
GROUP BY CAST(TS.PASSAGE_TIME AS DATE)
ORDER BY CAST(TS.PASSAGE_TIME AS DATE) DESC;
`)


    //return countObject[0];  

    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/revenueVehicleClassWise.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      timeout: 300000
    };

    const fileName =
      'tms_' +
      'RevenueDateWiseAndVehicleClass' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: countObject[0],
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };

    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 6,
      download_url: filePath,
    });

    return result;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
// Generate Report for Revenue summary with Lane Wise and Date Wise Report
const getRevenueDateWiseAndLaneWiseReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const { fromDate, toDate } = body;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.paymentType = body.paymentType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';

    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;
    if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
      condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;
    if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
      condition += `PAYMENT_TYPE = '${body.paymentType}' AND `;


    const countObject = await sequelize.query(`SELECT
   LANE_ID AS LANE_NAME,
   CAST(TS.PASSAGE_TIME AS DATE) AS Day,
    SUM(RE_VEH_FEE) AS 'Total'
 FROM TBL_SLAVE_TRANS AS TS
 WHERE ${condition} 1=1
 GROUP BY LANE_ID, CAST(TS.PASSAGE_TIME AS DATE)
 ORDER BY LANE_ID, Day;
 `)

    const result = countObject[0].reduce((acc, obj) => {
      const { LANE_NAME, Day, Total } = obj;

      if (!acc[Day]) {
        acc[Day] = { Day };
      }

      acc[Day][LANE_NAME] = Total;

      return acc;
    }, {});

    const transformedData = Object.values(result);
    // Iterate through each object in the array
    transformedData.forEach(obj => {
      let sum = 0;
      // Calculate the sum of all lanes except "Day"
      for (const key in obj) {
        if (key !== "Day") {
          sum += obj[key];
        }
      }
      // Add a new key "total" with the summed value to the object
      obj.total = sum;
    });
    //return transformedData;

    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = new Intl.DateTimeFormat('en-US', option).format(new Date(fromDate));
    data.ToDate = new Intl.DateTimeFormat('en-US', option).format(new Date(toDate));

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/laneWiseAndDateWiseRevenue.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      timeout: 300000
    };

    const fileName =
      'tms_' +
      'RevenueDateWiseAndLaneWise' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: transformedData,
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result1 = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };
    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 4,
      download_url: filePath,
    });

    return result1;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
};
// Get Avc Details Transaction 
const getAvcTransaction = async (filterBody) => {
  const body = filterBody;
  const data = {};
  data.lane = body.lane;
  data.laneType = body.laneType;
  data.paymentType = body.paymentType;
  data.loginUser = body.loginUser;
  const timeZone = 'Asia/Kolkata';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
  const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
  let condition = '';
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
  }
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
    condition += `LANE_TYPE = '${body.laneType}' AND `;
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition += `RE_VEH_CLASS = '${body.vehicleClass}' AND `;


  const countObject = await sequelize.query(`SELECT
  CASE 
      WHEN CL.CLASS_DESCRIPTION IS NOT NULL THEN CL.CLASS_DESCRIPTION
      ELSE 'Total'
  END AS CLASS_DESCRIPTION,

  SUM(CASE WHEN AVC_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
  SUM(CASE WHEN AVC_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
  SUM(CASE WHEN AVC_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS',
  SUM(CASE WHEN AVC_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
  SUM(CASE WHEN AVC_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
  SUM(CASE WHEN AVC_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
  SUM(CASE WHEN AVC_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
  SUM(CASE WHEN AVC_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle',
sum(case when RE_VEH_CLASS=cl.CLASS_NO then 1 else 0 end) as 'Total'

FROM TBL_SLAVE_TRANS AS TS
RIGHT JOIN TBL_MASTER_CLASS CL ON TS.RE_VEH_CLASS = CL.CLASS_NO
where ${condition} 1=1
GROUP BY ROLLUP (CL.CLASS_DESCRIPTION);

`)

  const total = countObject[0][countObject[0].length - 1];

  for (let val of countObject[0]) {
    val.Percentage = ((val.Total / total.Total) * 100).toFixed(2) + '%'
  }
  countObject[0][countObject[0].length - 1].Percentage = null;
  const obj = {
    CLASS_DESCRIPTION: "Accuracy",
  }
  // const obj ={
  //   CLASS_DESCRIPTION: "Accuracy",
  //   CARJEEPVAN: Math.floor(((countObject[0][0].CARJEEPVAN/total.CARJEEPVAN)*100)*100)/100 + "%",
  //   LCVMINIBUS: Math.floor(((countObject[0][1].LCVMINIBUS/total.LCVMINIBUS)*100)*100)/100 + '%',
  //   BUS2AXLES: Math.floor(((countObject[0][2].BUS2AXLES/total.BUS2AXLES)*100)*100)/100 + '%',
  //   TRUCK2AXLES: Math.floor(((countObject[0][3].TRUCK2AXLES/total.TRUCK2AXLES)*100)*100)/100 + '%',
  //   MAV3AXLES: Math.floor(((countObject[0][4].MAV3AXLES/total.MAV3AXLES)*100)*100)/100 + '%',
  //   MAV4to6AXLES: Math.floor(((countObject[0][5].MAV4to6AXLES/total.MAV4to6AXLES)*100)*100)/100 + '%',
  //   Oversized_vehicle: Math.floor(((countObject[0][6].Oversized_vehicle/total.Oversized_vehicle)*100)*100)/100 + '%',  
  // }
  const keyOfObject = Object.keys(total)
  keyOfObject.shift();
  keyOfObject.pop();
  keyOfObject.pop();
  for (const prop of keyOfObject) {
    obj[prop] = `${Math.floor(
      ((countObject[0][keyOfObject.indexOf(prop)][prop] / total[prop]) * 100) * 100
    ) / 100}%`;
  }

  countObject[0].push(obj)
  return countObject[0];

}
//Get Avc Report  in pdf
const getAvcReport = async (filterBody, reportData) => {
  try {
    const body = filterBody;
    const data = {};
    data.lane = body.lane;
    data.laneType = body.laneType;
    data.loginUser = body.loginUser;
    const timeZone = 'Asia/Kolkata';
    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const startDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', option).format(new Date(body.toDate));
    let condition = '';
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` TS.PASSAGE_TIME BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition += `LANE_ID = '${body.lane}' AND `;
    if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All')
      condition += `LANE_TYPE = '${body.laneType}' AND `;

    const countObject = await sequelize.query(`SELECT
    CASE 
        WHEN CL.CLASS_DESCRIPTION IS NOT NULL THEN CL.CLASS_DESCRIPTION
        ELSE 'Total'
    END AS CLASS_DESCRIPTION,
  
    SUM(CASE WHEN AVC_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
    SUM(CASE WHEN AVC_CLASS = 1 THEN 1 ELSE 0 END) AS 'CAR\JEEP\VAN',
    SUM(CASE WHEN AVC_CLASS = 2 THEN 1 ELSE 0 END) AS 'LCV\MINIBUS',
    SUM(CASE WHEN AVC_CLASS = 3 THEN 1 ELSE 0 END) AS 'BUS2AXLES',
    SUM(CASE WHEN AVC_CLASS = 4 THEN 1 ELSE 0 END) AS 'TRUCK2AXLES',
    SUM(CASE WHEN AVC_CLASS = 5 THEN 1 ELSE 0 END) AS 'MAV3AXLES',
    SUM(CASE WHEN AVC_CLASS = 6 THEN 1 ELSE 0 END) AS 'MAV4to6AXLES',
    SUM(CASE WHEN AVC_CLASS = 7 THEN 1 ELSE 0 END) AS 'Oversized_vehicle',
  sum(case when RE_VEH_CLASS=cl.CLASS_NO then 1 else 0 end) as 'Total'
  
  FROM TBL_SLAVE_TRANS AS TS
  RIGHT JOIN TBL_MASTER_CLASS CL ON TS.RE_VEH_CLASS = CL.CLASS_NO
  where ${condition} 1=1
  GROUP BY ROLLUP (CL.CLASS_DESCRIPTION);
  
  `)

    const total = countObject[0][countObject[0].length - 1];

    for (let val of countObject[0]) {

      val.Percentage = ((val.Total / total.Total) * 100).toFixed(2) + '%'

    }
    countObject[0][countObject[0].length - 1].Percentage = null;
    const obj1 = {
      CLASS_DESCRIPTION: "Accuracy",
      CARJEEPVAN: Math.floor(((countObject[0][0].CARJEEPVAN / total.CARJEEPVAN) * 100) * 100) / 100 + "%",
      LCVMINIBUS: Math.floor(((countObject[0][1].LCVMINIBUS / total.LCVMINIBUS) * 100) * 100) / 100 + '%',
      BUS2AXLES: Math.floor(((countObject[0][2].BUS2AXLES / total.BUS2AXLES) * 100) * 100) / 100 + '%',
      TRUCK2AXLES: Math.floor(((countObject[0][3].TRUCK2AXLES / total.TRUCK2AXLES) * 100) * 100) / 100 + '%',
      MAV3AXLES: Math.floor(((countObject[0][4].MAV3AXLES / total.MAV3AXLES) * 100) * 100) / 100 + '%',
      MAV4to6AXLES: Math.floor(((countObject[0][5].MAV4to6AXLES / total.MAV4to6AXLES) * 100) * 100) / 100 + '%',
      Oversized_vehicle: Math.floor(((countObject[0][6].Oversized_vehicle / total.Oversized_vehicle) * 100) * 100) / 100 + '%',
    }

    countObject[0].push(obj1)
    const allCount = (countObject[0][0].CARJEEPVAN + countObject[0][1].LCVMINIBUS + countObject[0][2].BUS2AXLES + countObject[0][3].TRUCK2AXLES +
      countObject[0][4].MAV3AXLES + countObject[0][5].MAV4to6AXLES + countObject[0][6].Oversized_vehicle)
    data.allAccuracy = Math.floor(((allCount / total.Total) * 100) * 100) / 100 + '%'
    //return countObject[0];
    const Operater = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=1 AND STATUS=1`)
    const Collection = await sequelize.query(`SELECT COMPANY_NAME FROM tms_company_master where CLIENT_ID=4 AND STATUS=1`)
    data.Operator = Operater[0][0].COMPANY_NAME
    data.collection = Collection[0][0].COMPANY_NAME
    const formattedDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const Plaza_Code = await sequelize.query(`SELECT PLAZA_NAME FROM TBL_PLAZA_MASTER`)
    data.Code = Plaza_Code[0][0].PLAZA_NAME;
    data.FromDate = startDate;
    data.ToDate = endDate;

    data.GeneratedDate = formattedDate;


    const html = fs.readFileSync(path.join(__dirname, '../../assests/avcreport.html'), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: '10mm',
      timeout: 300000,
    };

    const fileName =
      'tms_' +
      'AvcReport' +
      new Date(startDate).getDate() +
      '_' +
      new Date(startDate).getMonth() +
      '_' +
      new Date(startDate).getYear() +
      '_to_' +
      new Date(endDate).getDate() +
      '_' +
      new Date(endDate).getMonth() +
      '_' +
      new Date(endDate).getYear() +
      '_' +
      Number(new Date());

    const ext = '.pdf';
    const type = 2;
    const filePath = path.join(require('os').homedir(), 'downloads', fileName + ext);
    const obj = {
      alldata: countObject[0],
      ...data,
    };
    const document = {
      html: html,
      data: {
        users: obj,
      },
      path: filePath,
      type: '',
    };

    const pdfPromise = new Promise((resolve, reject) => {
      const pdfData = pdf.create(document, options);
      pdfData
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const pdfResult = await pdfPromise;

    const result = {
      message: 'PDF conversion completed.',
      filePath: pdfResult.filePath,
    };
    // generate report link
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 9,
      download_url: filePath,
    });

    return result;
  } catch (error) {
    return 'Error converting to PDF:', error;
  }
}
//  Get all report url and details
const getAllReports = async () => {
  const allReports = await sequelize.query(` select * from  [tms_report_links]
  inner join [tms_reports] on [tms_reports].id = [tms_report_links].report_id
  inner join [tms_master_reports] on [tms_master_reports].id= [tms_report_links].[type_id] 
  where download_Status=1 ORDER BY tms_reports.id DESC`);
  return allReports[0];
};


const deleteFile = async () => {

  const timeZone = 'Asia/Kolkata';

  const option = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const data = await sequelize.query(`select  FORMAT(created_at, 'M/d/yyyy, hh:mm:ss') AS created_at , download_url from  [tms_report_links]
inner join [tms_reports] on [tms_reports].id = [tms_report_links].report_id
inner join [tms_master_reports] on [tms_master_reports].id= [tms_report_links].[type_id] where download_Status=1 `)

  const currentDate = new Date();
  const twentyFourHoursAgo = new Date(currentDate - 24 * 60 * 60 * 1000);
  const endDate = new Intl.DateTimeFormat('en-US', option).format(twentyFourHoursAgo);
  const startDate = data[0][0].created_at


  const map1 = data[0].map((x) => (x.created_at <= endDate) ? x : null);


  await sequelize.query(`
  UPDATE tms_report_links
  SET download_Status = 0
  FROM tms_report_links
  INNER JOIN [tms_reports] ON [tms_reports].id = [tms_report_links].report_id
  INNER JOIN [tms_master_reports] ON [tms_master_reports].id = [tms_report_links].[type_id]
  WHERE created_at BETWEEN '${startDate.replace(",", " ")}' AND '${endDate.replace(",", " ")}'
`);

  for (let val of map1) {
    if (val) {
      fs.unlink(val.download_url, (err) => {
        if (err) {
          logger.error(`Error deleting the file: ${err}`);
          return;
        }

        logger.info(`File ${val.download_url} has been deleted`);
      });
    }
  }


  return "delete file sucessfully"
}


const reportShiftCollection = async (body, reportData) => {
  try {

    const { fromDate, toDate, loginUser, collectorID, cashierID } = body;

    const timeZone = 'Asia/Kolkata';
    const options = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
    let condition = '';

    // this for cashup table filter 
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` tms_cashup.created_at BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.Shift && body.Shift !== 'null' && body.Shift !== 'All') condition += `shift= '${body.Shift}' AND `;
    if (body.collectorID && body.collectorID !== 'null' && body.collectorID !== 'All') condition += `tc_id = '${body.collectorID}' AND `;
    if (body.cashierID && body.cashierID !== 'null' && body.cashierID !== 'All') condition += `cashier_id = '${body.cashierID}' AND `;

    const filename =
      'tms_Shift_collection_' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());
    const ext = '.csv';

    const filePath = path.join(require('os').homedir(), 'downloads', filename + ext);
    const writer = csvWriter({
      headers: [
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
      ],
    });
    writer.pipe(fs.createWriteStream(filePath));

    // Write data with empty value for the second column to skip it
    writer.write(['        ', '        ', '        ', 'Shift Collection CashUp Report', '']);
    writer.write(['        ', '        ', '        ', `FROM : ${startDate}`]);
    writer.write(['        ', '        ', '        ', `TO : ${endDate}`]);
    if (body.Shift && body.Shift !== 'null') {
      writer.write(['        ', '        ', '        ', `TO : ${endDate}`]);
    }
    if (body.collectorID && body.collectorID !== 'null' && body.collectorID !== 'All') {
      const name = await sequelize.query(`	select username from tms_logins where user_id=${collectorID}`)
      writer.write(['        ', '        ', '        ', `Collecter Name : ${name[0][0]}`]);
    }
    if (body.cashierID && body.cashierID !== 'null' && body.cashierID !== 'All') {
      const name = await sequelize.query(`	select username from tms_logins where user_id=${cashierID}`)
      writer.write(['        ', '        ', '        ', `Cashier Name : ${name[0][0]}`]);
    }
    writer.write(['        ', '        ', '        ', `Generate By : ${loginUser}`]);
    writer.write(['        ', '        ', '        ']);
    writer.write(['        ', '        ', '        ']);
    writer.write(['        ', '        ', '        ']);
    writer.write([
      'CashUp ID',
      'Shift',
      'CashUp Date',
      'Tc Name',
      'CashUp Amount',
      'System Amount',
      'Difference',
      'Remarks'
    ]);

    const cashUp = await sequelize.query(`select 
   tms_cashup.id,
      shift,
	  cashier.username as 'cashierName',
	    tcName.username as 'tcName'
      ,role_id
      ,cashup_amount
      ,status
      ,tms_cashup.created_at
      ,cashup_method
  from tms_cashup 
  inner join tms_logins as cashier on  cashier.user_id = tms_cashup.cashier_id
  inner join tms_logins as tcName on  tcName.user_id = tms_cashup.tc_id
  where ${condition} 1=1`)

    for (let val of cashUp[0]) {
      let day = val.created_at.getDate()
      let month = val.created_at.getMonth() + 1
      let year = val.created_at.getFullYear()
      let startDate = `${year}-${month}-${day} 00:00:00`;
      let endDate = `${year}-${month}-${day} 23:59:59`;
      console.log(startDate, endDate)
      const systemAmount = await sequelize.query(` SELECT
      OPERATOR_ID,
      SHIFT_CODE,
      SUM(RE_VEH_FEE) AS System_amount
    FROM TBL_SLAVE_TRANS AS TS
    WHERE   PASSAGE_TIME >= '${startDate}' 
    AND PASSAGE_TIME < '${endDate}' 
    AND SHIFT_CODE ='${val.shift}' 
    AND  OPERATOR_ID = '${val.tcName}' 
    GROUP BY SHIFT_CODE,OPERATOR_ID;`)
      let date = val.created_at.toISOString();
      val.created_at = date.replace(/[TZ.]/g, ' ').replace("000", '').trim()
      if (systemAmount[0][0]) {
        val.systemAmount = systemAmount[0][0].System_amount;
        val.difference = val.cashup_amount - systemAmount[0][0].System_amount;
        if (systemAmount[0][0].System_amount == val.cashup_amount) {
          val.remark = 'ok'
        }
        if (systemAmount[0][0].System_amount < val.cashup_amount) {
          val.remark = 'Excess'
        }
        if (systemAmount[0][0].System_amount > val.cashup_amount) {
          val.remark = 'Short'
        }
      }
    }
    console.log('here')
    // Write data to the worksheet
    cashUp[0].forEach((obj, index) => {
      const row = [
        obj.id,
        obj.shift,
        obj.created_at,
        obj.tcName,
        obj.cashup_amount,
        obj.systemAmount,
        obj.difference,
        obj.remark
      ];
      writer.write(row);
    });
    writer.end();
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 10,
      download_url: filePath,
    });
    return "true";
  }
  catch (error) {
    console.log(error)
  }
}

const reportForShortExcess = async (body, reportData) => {
  try {

    const { fromDate, toDate, loginUser, collectorID, cashierID } = body;

    const timeZone = 'Asia/Kolkata';
    const options = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const startDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.fromDate));
    const endDate = new Intl.DateTimeFormat('en-US', options).format(new Date(body.toDate));
    let condition = '';

    // this for cashup table filter 
    if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
      condition += ` tms_cashup.created_at BETWEEN'${startDate.replace(',', ' ')}' AND '${endDate.replace(',', ' ')}' AND `;
    }
    if (body.Shift && body.Shift !== 'null' && body.Shift !== 'All') condition += `shift= '${body.Shift}' AND `;
    if (body.collectorID && body.collectorID !== 'null' && body.collectorID !== 'All') condition += `tc_id = '${body.collectorID}' AND `;
    if (body.cashierID && body.cashierID !== 'null' && body.cashierID !== 'All') condition += `cashier_id = '${body.cashierID}' AND `;

    const filename =
      'tms_Short_Excess_report_' +
      new Date(fromDate).getDate() +
      '_' +
      new Date(fromDate).getMonth() +
      '_' +
      new Date(fromDate).getYear() +
      '_to_' +
      new Date(toDate).getDate() +
      '_' +
      new Date(toDate).getMonth() +
      '_' +
      new Date(toDate).getYear() +
      '_' +
      Number(new Date());
    const ext = '.csv';

    const filePath = path.join(require('os').homedir(), 'downloads', filename + ext);
    const writer = csvWriter({
      headers: [
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
        '        ',
        '        ',
        '        ',
        '      ',
        '      ',
      ],
    });
    writer.pipe(fs.createWriteStream(filePath));

    // Write data with empty value for the second column to skip it
    writer.write(['        ', '        ', '        ', 'Short Excess CashUp Report', '']);
    writer.write(['        ', '        ', '        ', `FROM : ${startDate}`]);
    writer.write(['        ', '        ', '        ', `TO : ${endDate}`]);
    if (body.Shift && body.Shift !== 'null') {
      writer.write(['        ', '        ', '        ', `TO : ${endDate}`]);
    }
    if (body.collectorID && body.collectorID !== 'null' && body.collectorID !== 'All') {
      const name = await sequelize.query(`	select username from tms_logins where user_id=${collectorID}`)
      writer.write(['        ', '        ', '        ', `Collecter Name : ${name[0][0]}`]);
    }
    if (body.cashierID && body.cashierID !== 'null' && body.cashierID !== 'All') {
      const name = await sequelize.query(`	select username from tms_logins where user_id=${cashierID}`)
      writer.write(['        ', '        ', '        ', `Cashier Name : ${name[0][0]}`]);
    }
    writer.write(['        ', '        ', '        ', `Generate By : ${loginUser}`]);
    writer.write(['        ', '        ', '        ']);
    writer.write(['        ', '        ', '        ']);
    writer.write(['        ', '        ', '        ']);
    writer.write([
      'Tc Name',
      'Shift',
      'CashUp Date',
      'Short',
      'Excess'
    ]);

    const cashUp = await sequelize.query(`  select 
    shift,
    tcName.username as 'tcName'
    ,cashup_amount
    ,tms_cashup.created_at
    ,cashup_method
from tms_cashup 
inner join tms_logins as tcName on  tcName.user_id = tms_cashup.tc_id
where ${condition} 1=1`)

    for (let val of cashUp[0]) {
      let day = val.created_at.getDate()
      let month = val.created_at.getMonth() + 1
      let year = val.created_at.getFullYear()
      let startDate = `${year}-${month}-${day} 00:00:00`;
      let endDate = `${year}-${month}-${day} 23:59:59`;
      console.log(startDate, endDate)
      const systemAmount = await sequelize.query(` SELECT
    OPERATOR_ID,
    SHIFT_CODE,
    SUM(RE_VEH_FEE) AS System_amount
  FROM TBL_SLAVE_TRANS AS TS
  WHERE   PASSAGE_TIME >= '${startDate}' 
  AND PASSAGE_TIME < '${endDate}' 
  AND SHIFT_CODE ='${val.shift}' 
  AND  OPERATOR_ID = '${val.tcName}' 
  GROUP BY SHIFT_CODE,OPERATOR_ID;`)
      let date = val.created_at.toISOString();
      val.created_at = date.replace(/[TZ.]/g, ' ').replace("000", '').trim()
      val.Excess = 0
      val.short = 0
      if (systemAmount[0][0]) {
        let difference = val.cashup_amount - systemAmount[0][0].System_amount;
        if (systemAmount[0][0].System_amount < val.cashup_amount) {
          val.Excess = difference
        }
        if (systemAmount[0][0].System_amount > val.cashup_amount) {
          val.short = difference
        }
      }
    }
    // Write data to the worksheet
    cashUp[0].forEach((obj, index) => {
      const row = [
        obj.tcName,
        obj.shift,
        obj.created_at,
        obj.short,
        obj.Excess,
      ];
      writer.write(row);
    });
    writer.end();
    await db.tms_report_links.create({
      report_id: reportData.id,
      type_id: 11,
      download_url: filePath,
    });
    return "true";
  }
  catch (error) {
    console.log(error)
  }
}




module.exports = {
  getAllReports,
  generateReports,
  excelDataFilter,
  addDataInExcel,
  summaryCountReport,
  summaryRevenueReport,
  getTransactionCount,
  getRevenueTransaction,
  getAvcTransaction,
  getAvcReport,
  getCountLaneAndDateWiseReport,
  getRevenueDateWise,
  getCountClassWiseAndDateWise,
  getRevenueLaneWise,
  getCountWithRevenue,
  getCountWithRevenueReport,
  getRevenueDateWiseReport,
  getRevenueDateWiseAndLaneWiseReport,
  getCountvehicleWiseAndDateWiseReport,
  getCountLaneAndDateWise,
  deleteFile,
  reportShiftCollection,
  reportForShortExcess
};
