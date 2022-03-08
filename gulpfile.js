const { processTS, processFrontendScripts, processFrontendSASS } = require("./gulp/process")
const { parallel } = require("gulp")

module.exports.default = parallel(processTS, processFrontendScripts, processFrontendSASS)