const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { NOT_FOUND } = require("../utils/httpStatus");

const { Job, Profile, Contract } = require("../model");

const DEFAULT_LIMIT = 2;

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  const bestProfession = await Job.findOne({
    attributes: [
      "Contract.Contractor.profession",
      [Sequelize.fn("sum", Sequelize.col("price")), "paid"],
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
          [Op.gte]: start,
          [Op.lte]: end,
        },
      },
    },
    group: ["Contract.Contractor.profession"],
    order: [["paid", "DESC"]],
  });

  if (!bestProfession) return res.status(NOT_FOUND).end();

  res.json(bestProfession);
};

const getBestClients = async (req, res) => {
  let { start, end, limit } = req.query;

  if (!limit) {
    limit = DEFAULT_LIMIT;
  }

  const bestClients = await Job.findAll({
    attributes: [
      [Sequelize.col("Contract.Client.id"), "id"],
      [Sequelize.col("Contract.Client.firstName"), "firstNames"],
      [Sequelize.col("Contract.Client.lastName"), "lastName"],
      [Sequelize.fn("sum", Sequelize.col("price")), "paid"],
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
          [Op.gte]: start,
          [Op.lte]: end,
        },
      },
    },
    limit: limit,
    group: ["Contract.Client.firstName"],
    order: [["id", "ASC"]],
  });

  if (!bestClients) return res.status(NOT_FOUND).end();

  res.json(bestClients);

  res.json();
};

module.exports = {
  getBestProfession,
  getBestClients,
};
