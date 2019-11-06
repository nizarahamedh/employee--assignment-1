var AWS = require("aws-sdk");
AWS.config.update({
    region: "me-south-1",
    endpoint: "http://localhost:8000"
});
module.exports