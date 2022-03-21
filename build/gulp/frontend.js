const gulp = require("gulp")
const babel = require("gulp-babel")
const buffer = require("vinyl-buffer")
const concat = require("gulp-concat")
const htmlmin = require("gulp-htmlmin")
const merge = require("merge-stream")
const sass = require("gulp-sass")(require("sass"))
const size = require("gulp-size")
const source = require("vinyl-source-stream")
const uglify = require("gulp-uglify")
const uglifycss = require("gulp-uglifycss")

const glob = require("glob")
const browserify = require("browserify")
const tsify = require("tsify")


function frontendHTML(cb) {
    gulp.src("src/view/**/*.html")
        .pipe(htmlmin({ caseSensitive: true, collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest("dist/view"))

    cb()
}

function frontendSASS(cb) {
    gulp.src("src/view/assets/sass/index.scss", { allowEmpty: true })
        .pipe(sass())
        .pipe(uglifycss({ uglyComments: true }))
        .pipe(concat("app.min.css"))
        .pipe(gulp.dest("dist/view/assets/css"))

    cb()
}

function frontendScripts(cb) {
    const tsStream = () => {
        const entryFiles = glob.sync("src/view/assets/**/*.ts")
        return browserify({
            debug: true,
            entries: entryFiles
        })
            .plugin(tsify)
            .bundle()
            .pipe(source("app.js"))
            .pipe(buffer())
    }
    const jsStream = () => {
        return gulp.src("node_modules/bootstrap/dist/js/bootstrap.bundle.js")
            .pipe(babel({ presets: ["@babel/preset-env"] }))
    }

    merge(tsStream(), jsStream())
        .pipe(uglify({ compress: true }))
        .pipe(concat("app.min.js", { newLine: false }))
        .pipe(size({
            title: "Frontend scripts"
        }))
        .pipe(gulp.dest("dist/view/assets/js"))

    cb()
}

module.exports = {
    frontendScripts,
    frontendHTML,
    frontendSASS
}