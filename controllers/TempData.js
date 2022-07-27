const TempDataModel = require("../models/TempData.js");

const TempData = {
  /**
   *
   *
   */
  get: async ({
    query = {},
    projection = {},
    options = { lean: true },
    sort = { date: -1 },
    limit = 1000,
  }) => {
    let tempData = await TempDataModel.find(query, projection, options)
      .sort(sort)
      .limit(limit);

    tempData = tempData.sort(({ date: a }, { date: b }) => a - b);
    return tempData;
  },
};

module.exports = TempData;
