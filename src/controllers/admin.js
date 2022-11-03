const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { NOT_FOUND } = require("../utils/httpStatus");

const { Job, Profile, Contract } = require("../model");

const getBestProfession = async (req, res) => {
  const { startDate, endDate } = req.query;

  const bestProfession = await Job.findOne({
    attributes: [
      "Contract.Contractor.profession",
      [Sequelize.fn("sum", Sequelize.col("price")), "total_amount"],
    ],
    raw: true,
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            required: true,
            model: Profile,
            as: "Contractor",
            attributes: [],
          },
          {
            required: true,
            model: Profile,
            as: "Client",
            attributes: [],
          },
        ],
      },
    ],
    where: {
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    },
    group: ["Contract.Contractor.profession"],
    order: [["total_amount", "DESC"]],
  });

  if (!bestProfession) return res.status(NOT_FOUND).end();

  res.json(bestProfession);
};

module.exports = {
  getBestProfession,
};
