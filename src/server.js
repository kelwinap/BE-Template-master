const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { sequelize } = require("./model");

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

const contracts_routes = require("./routes/contracts");
const jobs_routes = require("./routes/jobs");
const admin_routes = require("./routes/admin");

init();

async function init() {
  try {
    app.listen(3001, () => {
      console.log("Express App Listening on Port 3001");
    });
    app.use("/contracts", contracts_routes);
    app.use("/jobs", jobs_routes);
    app.use("/admin", admin_routes);
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
