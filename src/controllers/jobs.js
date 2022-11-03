const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getUnpaidJobs = async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const profileId = req.profile.id;

  const jobs = await Job.findAll({
    include: [
      {
        model: Contract,
        where: {
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        },
      },
    ],
  });

  if (!jobs) return res.status(404).end();

  res.json(jobs);
};

module.exports = {
  getUnpaidJobs,
};
