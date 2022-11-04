const Sequelize = require("sequelize");
const { NOT_FOUND, BAD_REQUEST, OK } = require("../utils/httpStatus");
const { Profile, Job, Contract } = require("../model");
const Op = Sequelize.Op;

const IN_PROGRESS = "in_progress";
const CLIENT = "client";
const BALANCE = "balance";
const PAID = true;

const getUnpaidJobs = async (req, res) => {
  const profileId = req.profile.id;

  const jobs = await Job.findAll({
    include: [
      {
        model: Contract,
        where: {
          status: IN_PROGRESS,
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        },
      },
    ],
  });

  if (!jobs) {
    res.status(NOT_FOUND);
    return res.end();
  }

  res.json(jobs);
};

const payJob = async (req, res) => {
  const profile = req.profile;
  const { job_id } = req.params;

  if (profile.type != CLIENT)
    return res.status(BAD_REQUEST).send("Contractor can't pay jobs");

  const job = await Job.findOne({
    where: { id: job_id },
    include: [
      {
        model: Contract,
        where: { ClientId: profile.id },
      },
    ],
  });

  if (!job) return res.status(BAD_REQUEST).send("Job not found");
  if (job.paid) return res.status(BAD_REQUEST).send("Job already paid");

  if (job.price > profile.balance)
    return res.status(BAD_REQUEST).send("Balance not suffient to pay the job");

  await Profile.decrement(BALANCE, {
    by: job.price,
    where: { id: job.Contract.ClientId },
  });

  await Profile.increment(BALANCE, {
    by: job.price,
    where: { id: job.Contract.ContractorId },
  });

  job.paid = PAID;
  await job.save();

  res.status(OK).send("Job payed");
};

module.exports = {
  getUnpaidJobs,
  payJob,
};
