const getContract = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const profileId = req.profile.id;

  const contract = await Contract.findOne({
    where: { id, ClientId: profileId },
  });

  if (!contract) return res.status(404).end();

  res.json(contract);
};

module.exports = {
  getContract,
};
