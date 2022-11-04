const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Contract } = require("../model");

const { NOT_FOUND } = require("../utils/httpStatus");

const TERMINATED = "terminated";

const getContract = async (req, res) => {
  const { id } = req.params;
  const profileId = req.profile.id;

  const contract = await Contract.findOne({
    where: { id, ClientId: profileId },
  });

  if (!contract) {
    res.status(NOT_FOUND);
    return res.end();
  }

  res.json(contract);
};

const getContracts = async (req, res) => {
  const profileId = req.profile.id;

  const contracts = await Contract.findAll({
    where: { ClientId: profileId, status: { [Op.not]: TERMINATED } },
  });

  if (!contracts) {
    res.status(NOT_FOUND);
    return res.end();
  }

  res.json(contracts);
};

module.exports = {
  getContract,
  getContracts,
};
