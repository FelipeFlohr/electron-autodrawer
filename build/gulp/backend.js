const gulp = require("gulp")
const babel = require("gulp-babel")
const ts = require("gulp-typescript").createProject("tsconfig.json")
const uglify = require("gulp-uglify")
const { extensions } = require("../extensions.json")

function backendTypescript(cb) {
    gulp.src(["src/**/*.ts", "!src/view/**/*.ts"])
        .pipe(ts())
        .pipe(babel({
            comments: false,
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify({
            compress: true
        }))
        .pipe(gulp.dest("dist"))

    cb()
}

function backendOtherFiles(cb) {
    const extensionsPath = []
    extensions.forEach(extension => {
        if (!extension.startsWith(".")) extension = `.${extension}`
        extensionsPath.push(`src/**/*${extension}`)
        extensionsPath.push(`!src/view/**/*${extension}`)
    })

    gulp.src(extensionsPath)
        .pipe(gulp.dest("dist"))

    cb()
}

module.exports = {
    backendTypescript,
    backendOtherFiles
}