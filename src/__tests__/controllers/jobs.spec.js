const { getUnpaidJobs, payJob } = require("../../controllers/jobs");
const { Job } = require("../../model");
const { NOT_FOUND } = require("../../utils/httpStatus");

const request = {
  profile: {
    id: 1,
  },
};

const unpaidJobs = [
  {
    id: 1,
    description: "any_description",
    price: 200,
    paid: false,
    contractId: 1,
  },
  {
    id: 2,
    description: "any_description",
    price: 500,
    paid: false,
    contractId: 5,
  },
];

const response = {
  status: jest.fn((x) => x),
  send: jest.fn((x) => x),
  json: jest.fn((x) => x),
  end: jest.fn((x) => x),
};

it("should get unpaid jobs", async () => {
  jest.spyOn(Job, "findAll").mockResolvedValueOnce(unpaidJobs);

  await getUnpaidJobs(request, response);
  expect(response.json).toHaveBeenCalledWith(unpaidJobs);
});

it("should return not foun when does not have unpaid jobs", async () => {
  jest.spyOn(Job, "findAll").mockResolvedValueOnce(null);

  await getUnpaidJobs(request, response);
  expect(response.status).toHaveBeenCalledWith(NOT_FOUND);
});
