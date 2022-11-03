const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { NOT_FOUND } = require("../utils/httpStatus");

const TERMINATED = "terminated";

const getContract = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const profileId = req.profile.id;

  const contract = await Contract.findOne({
    where: { id, ClientId: profileId },
  });

  if (!contract) return res.status(NOT_FOUND).end();

  res.json(contract);
};

const getContracts = async (req, res) => {
  const { Contract } = req.app.get("models");
  const profileId = req.profile.id;

  const contracts = await Contract.findAll({
    where: { ClientId: profileId, status: { [Op.not]: TERMINATED } },
  });

  if (!contracts) return res.status(NOT_FOUND).end();

  res.json(contracts);
};

module.exports = {
  getContract,
  getContracts,
};
