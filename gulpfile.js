const { processTS,
    processFrontendSASS,
    processFrontendHTML,
    processOtherFiles, 
    processFrontendScripts} = require("./gulp/process")
const { parallel } = require("gulp")

module.exports.default = parallel(
    processTS,
    processFrontendScripts,
    processFrontendSASS,
    processFrontendHTML,
    processOtherFiles)