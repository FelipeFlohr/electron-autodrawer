const { backendTypescript, backendOtherFiles } = require("./build/gulp/backend")
const { parallel } = require("gulp")
const { frontendHTML, frontendSASS, frontendScripts, frontendOtherFiles } = require("./build/gulp/frontend")

module.exports.default = parallel(
    frontendScripts,
    frontendHTML,
    frontendSASS,
    frontendOtherFiles,
    backendTypescript,
    backendOtherFiles
)