const {
  getBestProfession,
  getBestClients,
} = require("../../controllers/admin");
const { Job, Profile, Contract } = require("../../model");
const { NOT_FOUND } = require("../../utils/httpStatus");
const request = {
  query: {
    start: new Date(),
    end: new Date(),
  },
};

const response = {
  status: jest.fn((x) => x),
  send: jest.fn((x) => x),
  json: jest.fn((x) => x),
  end: jest.fn((x) => x),
};

const profession = {
  profession: "programmer",
  amount: 500,
};

const bestClients = [
  {
    id: 1,
    firstName: "any_name",
    lastName: "any_last_name",
    paid: 100,
  },
  {
    id: 2,
    firstName: "any_name",
    lastName: "any_last_name",
    paid: 159,
  },
];

it("should get best profession", async () => {
  jest.spyOn(Job, "findOne").mockResolvedValueOnce(profession);
  await getBestProfession(request, response);

  expect(response.json).toHaveBeenCalledWith(profession);
});

it("should return not found when best profession does not exist", async () => {
  jest.spyOn(Job, "findOne").mockResolvedValueOnce(null);
  await getBestProfession(request, response);

  expect(response.status).toHaveBeenCalledWith(NOT_FOUND);
});

it("should get best clients", async () => {
  jest.spyOn(Job, "findAll").mockResolvedValueOnce(bestClients);
  await getBestClients(request, response);

  expect(response.json).toHaveBeenCalledWith(bestClients);
});

it("should return not found when best clients does not exist", async () => {
  jest.spyOn(Job, "findAll").mockResolvedValueOnce(null);
  await getBestClients(request, response);

  expect(response.status).toHaveBeenCalledWith(NOT_FOUND);
});
