const { processTS, processFrontendScripts, processFrontendSASS, processFrontendHTML, processBootstrapJS, processBootstrapSASS } = require("./gulp/process")
const { parallel } = require("gulp")

module.exports.default = parallel(
    processTS,
    processFrontendScripts,
    processFrontendSASS,
    processFrontendHTML,
    processBootstrapJS)