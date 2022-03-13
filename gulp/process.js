const gulp = require("gulp")
const babel = require("gulp-babel")
const concat = require("gulp-concat")
const htmlmin = require("gulp-htmlmin")
const sass = require("gulp-sass")(require("sass"))
const streamify = require("gulp-streamify")
const ts = require("gulp-typescript")
const uglify = require("gulp-uglify")
const uglifycss = require("gulp-uglifycss")
const browserify = require("browserify")
const glob = require("glob")
const merge = require("merge-stream")
const tsify = require("tsify")
const source = require("vinyl-source-stream")
const { extensions } = require("./extensions.json")

function processTS(callback) {
    return gulp.src(["src/**/*.ts", "!src/view/**/*.ts"])
        .pipe(ts({
            isolatedModules: true,
            target: "ES5",
            module: "CommonJS"
        }))
        .pipe(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify({
            compress: true
        }))
        .pipe(gulp.dest("dist"))
}

function processFrontendScripts(callback) {
    const js = processFrontendJS()
    const ts = processFrontendTS()

    return merge(js, ts)
        .pipe(streamify(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        })))
        .pipe(streamify(uglify({
            compress: true
        })))
        .pipe(streamify(concat("app.min.js")))
        .pipe(gulp.dest("dist/view/assets/js"))
}

function processFrontendSASS(callback) {
    return gulp.src("src/view/assets/sass/index.scss", {
        allowEmpty: true
    })
        .pipe(sass())
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(concat("app.min.css"))
        .pipe(gulp.dest("dist/view/assets/css"))
}

function processFrontendHTML(callback) {
    return gulp.src("src/view/**/*.html")
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest("dist/view"))
}

function processBootstrapJS(callback) {
    return gulp.src("node_modules/bootstrap/dist/js/bootstrap.js")
        .pipe(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify({
            compress: true
        }))
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest("dist/view/assets/js"))
}

function processOtherFiles(callback) {
    const extensionsPath = []
    extensions.forEach(extension => {
        extensionsPath.push(extension.startsWith(".") ? `src/**/*${extension}` : `src/**/*.${extension}`)
    })

    return gulp.src(extensionsPath)
        .pipe(gulp.dest("dist"))
}

module.exports = {
    processTS,
    processFrontendScripts,
    processFrontendSASS,
    processFrontendHTML,
    processBootstrapJS,
    processOtherFiles
}

// Processes to merge
function processFrontendTS() {
    const entryFiles = glob.sync("src/view/assets/ts/**/*.ts")
    return browserify({
        debug: true,
        entries: entryFiles
    })
        .plugin(tsify)
        .bundle()
        .pipe(source("app.min.js"))
}

function processFrontendJS() {
    return gulp.src(["src/view/assets/**/*.js", "node_modules/bootstrap/dist/js/bootstrap.js"])
}