const { processTS,
    processFrontendScripts,
    processFrontendSASS,
    processFrontendHTML,
    processBootstrapJS,
    processOtherFiles } = require("./gulp/process")
const { parallel } = require("gulp")

module.exports.default = parallel(
    processTS,
    processFrontendScripts,
    processFrontendSASS,
    processFrontendHTML,
    processBootstrapJS,
    processOtherFiles)