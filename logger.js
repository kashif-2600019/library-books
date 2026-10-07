const fs = require("fs");

function logRequest(method, url)
{
    const time = new Date().toISOString();
    fs.appendFileSync("requests.log", time + " " + method + " " + url + "\n");
}

module.exports = logRequest;
