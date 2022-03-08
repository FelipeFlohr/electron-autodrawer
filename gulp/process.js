const gulp = require("gulp")
const ts = require("gulp-typescript")
const babel = require("gulp-babel")
const uglify = require("gulp-uglify")
const htmlmin = require("gulp-htmlmin")
const merge = require("merge-stream")
const concat = require("gulp-concat")
const sass = require("gulp-sass")(require("sass"))
const uglifycss = require("gulp-uglifycss")

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
        .pipe(uglify({
            compress: true
        }))
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest("dist/view/assets/js"))
}

function processFrontendSASS(callback) {
    return gulp.src(["src/view/sass/index.scss", "node_modules/bootstrap/scss/bootstrap.scss"], {
        allowEmpty: true
    })
        .pipe(sass())
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(concat("app.min.css"))
        .pipe(gulp.dest("dist/view/assets/css"))
}

module.exports = {
    processTS,
    processFrontendScripts,
    processFrontendSASS
}

// Process to merge
function processFrontendTS() {
    return gulp.src("src/view/**/*.ts")
        .pipe(ts())
        .pipe(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        }))
}

function processFrontendJS() {
    return gulp.src(["src/view/**/*.js", "node_modules/bootstrap/dist/js/bootstrap.js"])
        .pipe(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        }))
}