const gulp = require("gulp")
const ts = require("gulp-typescript")
const babel = require("gulp-babel")
const uglify = require("gulp-uglify")
const htmlmin = require("gulp-htmlmin")
const merge = require("merge-stream")
const concat = require("gulp-concat")
const sass = require("gulp-sass")(require("sass"))
const uglifycss = require("gulp-uglifycss")
const purgecss = require("gulp-purgecss")
const { extensions } = require("./extensions.json")

function processTS(callback) {
    return gulp.src(["src/**/*.ts", "!src/view/**/*.ts"])
        .pipe(ts())
        .pipe(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        }))
        .pipe(gulp.dest("dist"))
}

function processFrontendScripts(callback) {
    const js = processFrontendJS()
    const ts = processFrontendTS()

    return merge(js, ts)
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

function processFrontendSASS(callback) {
    return gulp.src("src/view/assets/sass/index.scss", {
        allowEmpty: true
    })
        .pipe(sass())
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(concat("app.min.css"))
        // .pipe(purgecss({
        //     content: ["src/view/**/*.html"]
        // }))
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

// Process to merge
function processFrontendTS() {
    return gulp.src("src/view/**/*.ts")
        .pipe(ts())
}

function processFrontendJS() {
    return gulp.src(["src/view/**/*.js", "node_modules/bootstrap/dist/js/bootstrap.js"])
}