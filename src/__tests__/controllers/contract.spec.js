const { getContract, getContracts } = require("../../controllers/contracts");
const { Contract } = require("../../model");
const { NOT_FOUND } = require("../../utils/httpStatus");

const request = {
  params: {
    id: 1,
  },
  profile: {
    id: 1,
  },
};

const contracts = [
  {
    id: 1,
    terms: "any_terms",
    status: "in_progress",
  },
  { id: 2, terms: "any_terms 2", status: "in_progress" },
];

const response = {
  status: jest.fn((x) => x),
  send: jest.fn((x) => x),
  json: jest.fn((x) => x),
  end: jest.fn((x) => x),
};

it("should get contract", async () => {
  jest.spyOn(Contract, "findOne").mockResolvedValueOnce(contracts[0]);
  await getContract(request, response);

  expect(response.json).toHaveBeenCalledWith(contracts[0]);
});

it("should return not found when contract does not exists", async () => {
  jest.spyOn(Contract, "findOne").mockResolvedValueOnce(null);
  await getContract(request, response);

  expect(response.status).toHaveBeenCalledWith(NOT_FOUND);
});

it("should get contracts", async () => {
  jest.spyOn(Contract, "findAll").mockResolvedValueOnce(contracts);
  await getContracts(request, response);

  expect(response.json).toHaveBeenCalledWith(contracts);
});

it("should return not found when contracts does not exists", async () => {
  jest.spyOn(Contract, "findAll").mockResolvedValueOnce(null);
  await getContracts(request, response);

  expect(response.status).toHaveBeenCalledWith(NOT_FOUND);
});
