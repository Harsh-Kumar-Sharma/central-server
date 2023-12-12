const { db, sequelize } = require('../models');
const { Op } = require('sequelize');

// get Transactions
const getTransactions = async (filterBody, page) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const body = filterBody;
  let condition = [];
  if (body.fromDate && body.toDate && !String(body.fromDate).includes('1970') && !String(body.toDate).includes('1970')) {
    condition.push({ PASSAGE_TIME: { [Op.between]: [body.fromDate, body.toDate] } });
  }
  if (!body.fromDate && !body.toDate) {
    const timeZone = 'Asia/Kolkata';
    const option = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const option1 = {
      timeZone: timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const currentDate = new Intl.DateTimeFormat('en-US', option).format(new Date());
    const currentTime = new Intl.DateTimeFormat('en-US', option1).format(new Date());
    const fromDate = currentDate + ' 00:00:00 AM';
    const toDate = currentDate + ' ' + currentTime;
    condition.push({ PASSAGE_TIME: { [Op.between]: [fromDate, toDate] } });
  }
  if (body.tagId && body.tagId !== 'null') condition.push({ TAG: body.tagId });
  if (body.transactionId && body.transactionId !== 'null') condition.push({ LANE_TRANS_ID: body.transactionId });
  if (body.plateNumber && body.plateNumber !== 'null') condition.push({ VEH_PLATE: body.plateNumber });
  if (body.lane && body.lane !== 'null' && body.lane !== 'All') condition.push({ LANE_ID: body.lane });
  if (body.laneType && body.laneType !== 'null' && body.laneType !== 'All') condition.push({ LANE_TYPE: body.laneType });
  if (body.abnormality && body.abnormality !== 'null' && body.abnormality !== 'All')
    condition.push({ ABNORMALITY: body.abnormality });
  if (body.paymentType && body.paymentType !== 'null' && body.paymentType !== 'All')
    condition.push({ RE_PAYMENT_TYPE: body.paymentType });
  if (body.vehicleClass && body.vehicleClass !== 'null' && body.vehicleClass !== 'All')
    condition.push({ VEH_CLASS: body.vehicleClass });
  const transactions = await db.TBL_SLAVE_TRANS.findAll({
    attributes: [
      'PLAZA_CODE',
      'LANE_TRANS_ID',
      'TAG',
      'LANE_TYPE',
      'LANE_ID',
      'DIRECTION',
      [sequelize.literal("FORMAT(PASSAGE_TIME, 'M/d/yyyy, hh:mm:ss tt')"), 'PASSAGE_TIME'],
      'OPERATOR_ID',
      [sequelize.col('PAY.DESCRIPTION'), 'PAY_DESCRIPTION'],
      [sequelize.col('PAYSUB.DESCRIPTION'), 'PAYSUB_DESCRIPTION'],
      'VEH_PLATE',
      'VEH_CLASS',
      'CLASS_FARE',
      'OW_FARE',
      'VALID_ID',
      'REVIEWER_ID',
      'TOTAL_FARE',
      'ABNORMALITY',
      'OPERATOR_COMMENT',
      'AVC.CLASS_DESCRIPTION',
      'REVEH.CLASS_DESCRIPTION',
      [sequelize.col('AVC.CLASS_DESCRIPTION'), 'AVC_CLASS_DESCRIPTION'],
      [sequelize.col('REVEH.CLASS_DESCRIPTION'), 'REVEH_CLASS_DESCRIPTION'],
      [sequelize.col('VEH.CLASS_DESCRIPTION'), 'VEH_CLASS_DESCRIPTION'],
      'RE_VEH_FEE',
      'IS_SAME_DIR',
      'RE_COMMENT',
      'WEIGHT',
    ],
    include: [
      {
        model: db.TBL_MASTER_CLASS,
        as: 'VEH',
        attributes: [],
      },
      {
        model: db.TBL_MASTER_CLASS,
        as: 'REVEH',
        attributes: [],
      },
      {
        model: db.TBL_MASTER_CLASS,
        as: 'AVC',
        attributes: [],
      },
      {
        model: db.PAYMENTTYPE,
        as: 'PAY',
        attributes: [],
        where: { status: 1 },
      },
      {
        model: db.PAYMENTSUBTYPE,
        as: 'PAYSUB',
        attributes: [],
        where: { status: 1 },
      },
    ],
    offset,
    limit,
    where: { [Op.and]: [...condition, { PAYMENT_TYPE: { [Op.ne]: 'TG' } }, { RE_STATUS: 0 }] },
    order: [['PASSAGE_TIME', 'DESC']],
  });
  // Fetch the total count of all transactions
  const count = await db.TBL_SLAVE_TRANS.count({
    where: { [Op.and]: [...condition, { PAYMENT_TYPE: { [Op.ne]: 'TG' } }, { RE_STATUS: 0 }] },
  });
  const totalCount = count;
  return {
    totalCount,
    transactions,
  };
};

// get Transaction by TxnId
const getTransactionByTXnId = async (laneTransId) => {
  const transaction = await db.TBL_SLAVE_TRANS.findOne({
    where: { LANE_TRANS_ID: laneTransId },
    attributes: [
      'PLAZA_CODE',
      'LANE_TRANS_ID',
      'TAG',
      'LANE_TYPE',
      'LANE_ID',
      'DIRECTION',
      [sequelize.literal("FORMAT(PASSAGE_TIME, 'M/d/yyyy, hh:mm:ss tt')"), 'PASSAGE_TIME'],
      'OPERATOR_ID',
      [sequelize.col('PAY.DESCRIPTION'), 'PAY_DESCRIPTION'],
      [sequelize.col('PAYSUB.DESCRIPTION'), 'PAYSUB_DESCRIPTION'],
      'VEH_PLATE',
      'VEH_CLASS',
      'CLASS_FARE',
      'OW_FARE',
      'VALID_ID',
      'REVIEWER_ID',
      'TOTAL_FARE',
      'ABNORMALITY',
      'OPERATOR_COMMENT',
      'AVC.CLASS_DESCRIPTION',
      'REVEH.CLASS_DESCRIPTION',
      [sequelize.col('AVC.CLASS_DESCRIPTION'), 'AVC_CLASS_DESCRIPTION'],
      [sequelize.col('REVEH.CLASS_DESCRIPTION'), 'REVEH_CLASS_DESCRIPTION'],
      [sequelize.col('VEH.CLASS_DESCRIPTION'), 'VEH_CLASS_DESCRIPTION'],
      'RE_VEH_FEE',
      'RE_VEH_CLASS',
      'IS_SAME_DIR',
      'RE_COMMENT',
      'RE_STATUS',
      'WEIGHT',
    ],
    include: [
      {
        model: db.TBL_MASTER_CLASS,
        as: 'VEH',
        attributes: [],
      },
      {
        model: db.TBL_MASTER_CLASS,
        as: 'REVEH',
        attributes: [],
      },
      {
        model: db.TBL_MASTER_CLASS,
        as: 'AVC',
        attributes: [],
      },
      {
        model: db.PAYMENTTYPE,
        as: 'PAY',
        attributes: [],
      },
      {
        model: db.PAYMENTSUBTYPE,
        as: 'PAYSUB',
        attributes: [],
        where: { status: 1 },
      },
    ],
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  return transaction;
};


// Report Filter Service
const tmsFillterReport = async (filterBody, page) => {
  const limit = 50;
  const offset = (page - 1) * limit;
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
  if (body.plazaCode && body.plazaCode !== 'null' && body.plazaCode !== 'All')
    condition += `PLAZA_CODE = '${body.plazaCode}' AND `;
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
INNER JOIN [PAYMENTTYPE] AS [PAY] ON [TBL_SLAVE_TRANS].[PAYMENT_TYPE] = [PAY].[PAYMENTTYPE]
INNER JOIN [PAYMENTSUBTYPE] AS [PAYSUB] ON [TBL_SLAVE_TRANS].[PAYMENT_SUBTYPE] = [PAYSUB].[PAYMENTSUBTYPE] 
 where ${condition} 1=1 ORDER BY PASSAGE_TIME ASC OFFSET ${offset} ROWS FEtCH NEXT ${limit} ROWS ONLY 
      `
  );
  // Fetch the total count of all transactions
  const count = await sequelize.query(`select count(*) as total from TBL_SLAVE_TRANS where ${condition} 1=1`)
  const totalCount = count[0][0].total;
  return {
    data: data[0],
    totalCount: totalCount
  };
};

// Get All Payment Type
const getAllPaymentType = async () => {
  const paymentType = await db.PAYMENTTYPE.findAll({ where: { STATUS: 1 } });
  return paymentType;
};

// Get All Payment Sub type
const getAllPaymentSubType = async () => {
  const paymentSubType = await db.PAYMENTSUBTYPE.findAll({ where: { STATUS: 1 } });
  return paymentSubType;
};

const getAllVehicleClass = async () => {
  const data = await db.TBL_MASTER_CLASS.findAll({
    where: { CLASS_STATUS: 1 },
  });
  return data;
};




module.exports = {
  getAllVehicleClass,
  getTransactions,
  getTransactionByTXnId,
  tmsFillterReport,
  getAllPaymentType,
  getAllPaymentSubType
};
