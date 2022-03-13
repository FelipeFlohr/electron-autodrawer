const { processTS,
    processFrontendSASS,
    processFrontendHTML,
    processBootstrapJS,
    processOtherFiles, 
    processFrontendScripts} = require("./gulp/process")
const { parallel } = require("gulp")

module.exports.default = parallel(
    processTS,
    processFrontendScripts,
    processFrontendSASS,
    processFrontendHTML,
    processBootstrapJS,
    processOtherFiles)