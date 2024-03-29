const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const minify = require("gulp-minify");

// Static server
gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "dist",
        },
    });

    gulp.watch("src/*.html").on("all", browserSync.reload);
});

gulp.task("styles", function () {
    return gulp
        .src("src/scss/**/*.+(scss|sass)")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(rename({ suffix: ".min" }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("watch", function () {
    gulp.watch("src/scss/**/*.+(scss|sass|css)", gulp.parallel("styles"));
    gulp.watch("src/*.html").on("all", gulp.parallel("html"));
    gulp.watch("src/js/**/*.js").on("all", gulp.parallel("scripts"));
    gulp.watch("src/fonts/**/*").on("all", gulp.parallel("fonts"));
    gulp.watch("src/icons/**/*").on("all", gulp.parallel("icons"));
    gulp.watch("src/img/**/*").on("all", gulp.parallel("images"));
    gulp.watch("src/**/*.php").on("all", gulp.parallel("php"));
});

gulp.task("html", function () {
    return gulp
        .src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("scripts", function () {
    return gulp
        .src("src/js/**/*.js")
        .pipe(
            minify({
                ext: {
                    min: ".min.js",
                },
                noSource: true,
                ignoreFiles: ["*min.js"],
            })
        )
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

gulp.task("fonts", function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(browserSync.stream());
});

gulp.task("icons", function () {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
});

gulp.task("mailer", function () {
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest("dist/mailer"))
        .pipe(browserSync.stream());
});

gulp.task("images", function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
});

gulp.task("php", function () {
    return gulp.src("src/**/*.php")
        .pipe(gulp.dest("dist"));
});

gulp.task("default", gulp.parallel("watch", "styles", "server", "scripts", "fonts", "icons", "mailer", "html", "images", "php"));
