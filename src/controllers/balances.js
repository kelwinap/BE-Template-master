const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { Job, Contract, Profile } = require("../model");
const { OK, BAD_REQUEST } = require("../utils/httpStatus");

const BALANCE = "balance";
const JOBS_TO_PAY_AMOUNT = "jobsToPayAmount";

const deposit = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  const jobs = await Job.findOne({
    attributes: [
      [Sequelize.col("Contract.ClientId"), "id"],
      [Sequelize.fn("sum", Sequelize.col("price")), JOBS_TO_PAY_AMOUNT],
    ],
    include: [
      {
        model: Contract,
        attributes: [],
        where: {
          ClientId: userId,
        },
      },
    ],
    group: ["ClientId"],
  });

  const twentyFivePercenteOfJobsToPay =
    (jobs.dataValues[JOBS_TO_PAY_AMOUNT] * 25) / 100;

  console.log(twentyFivePercenteOfJobsToPay);
  console.log(amount);

  if (amount >= twentyFivePercenteOfJobsToPay)
    return res.status(BAD_REQUEST).send("Amount not permitted");

  await Profile.increment(BALANCE, {
    by: amount,
    where: { id: userId },
  });

  res.status(OK).send();
};

module.exports = {
  deposit,
};
