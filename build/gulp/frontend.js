const gulp = require("gulp")
const babel = require("gulp-babel")
const concat = require("gulp-concat")
const htmlmin = require("gulp-htmlmin")
const merge = require("merge-stream")
const sass = require("gulp-sass")(require("sass"))
const uglify = require("gulp-uglify-es").default
const uglifycss = require("gulp-uglifycss")

const webpack = require("webpack")
const gulpWebpack = require("webpack-stream")
const nodeExternals = require("webpack-node-externals")
const { extensions } = require("../extensions.json")


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
        return gulp.src("src/view/assets/ts/navigation.ts")
            .pipe(gulpWebpack({
                mode: "production",
                target: "web",
                node: {
                    __dirname: false
                },
                module: {
                    rules: [
                        {
                            test: /\.ts$/,
                            use: "ts-loader",
                            exclude: /node_modules/,
                        },
                        {
                            test: /\.node$/,
                            use: "node-loader"
                        }
                    ]
                },
                resolve: {
                    extensions: [".ts", ".js", ".node"]
                },
                output: {
                    filename: "app.min.js"
                },
                externals: [nodeExternals()],
                externalsPresets: { node: true }
            }, webpack))
    }
    const jsStream = () => {
        return gulp.src("node_modules/bootstrap/dist/js/bootstrap.bundle.js")
            .pipe(babel({ presets: ["@babel/preset-env"] }))
    }

    merge(tsStream(), jsStream())
        .pipe(uglify({ compress: true }))
        .pipe(concat("app.min.js", { newLine: false }))
        .pipe(gulp.dest("dist/view/assets/js"))

    cb()
}

function frontendOtherFiles(cb) {
    const extensionsPath = []
    extensions.forEach(extension => {
        if (!extension.startsWith(".")) extension = `.${extension}`
        extensionsPath.push(`src/view/**/*${extension}`)
    })

    gulp.src(extensionsPath)
        .pipe(gulp.dest("dist"))

    cb()
}

module.exports = {
    frontendScripts,
    frontendHTML,
    frontendSASS,
    frontendOtherFiles
}