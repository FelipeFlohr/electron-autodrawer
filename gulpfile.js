const { backendTypescript, backendOtherFiles } = require("./build/gulp/backend")
const { parallel, series } = require("gulp")
const { frontendTypescript, frontendJavascript, frontendHTML, frontendSASS, frontendScripts } = require("./build/gulp/frontend")

module.exports.default = parallel(
    frontendScripts,
    frontendHTML,
    frontendSASS,
    backendTypescript,
    backendOtherFiles
)