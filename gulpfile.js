const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const connect = require("gulp-connect");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const fileInclude = require("gulp-file-include");
const rename = require("gulp-rename");

// Paths
const paths = {
  html: "./site/src/*.html",
  partials: "./site/src/views/**/*.html",
  scripts: "./site/src/scripts/**/*.js",
  styles: "./site/src/css/**/*.scss",
  output: "./site/dist",
};

// Task: Merge HTML Partials
gulp.task("html", function () {
  return gulp
    .src("./site/src/**/*.html") // Process all HTML files
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./site/src/views/",
      })
    )
    .pipe(gulp.dest(paths.output))
    .pipe(connect.reload());
});

// Task: Compile and Minify SCSS
gulp.task("styles", function () {
  return gulp
    .src(paths.styles)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.output + "/css"))
    .pipe(connect.reload());
});

// Task: Bundle and Minify JavaScript
gulp.task("js", function () {
  return gulp
    .src([
        "node_modules/jquery/dist/jquery.min.js", 
        "node_modules/jquery-ui/dist/jquery-ui.min.js", 
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", 
        "node_modules/datatables.net/js/dataTables.min.js", 
        "node_modules/datatables.net-rowreorder/js/dataTables.rowReorder.min.js", 
        "node_modules/datatables.net-responsive/js/dataTables.responsive.min.js", 
        "node_modules/datatables.net-colreorder/js/dataTables.colreorder.min.js", 
        "node_modules/datatables.net-buttons/js/dataTables.buttons.min.js", 
        "node_modules/datatables.net-buttons/js/buttons.colVis.min.js", 
        "node_modules/datatables.net-buttons/js/buttons.html5.min.js", 
        "node_modules/datatables.net-autofill/js/dataTables.autoFill.min.js", 
        "node_modules/datatables.net-select/js/dataTables.select.min.js", 
        paths.scripts])
    .pipe(concat("bundle.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.output + "/scripts"))
    .pipe(connect.reload());
});

// Task: Start Live Server
gulp.task("server", function () {
  connect.server({
    root: "dist",
    livereload: true,
    port: 8080,
  });
});

// Task: Copy JavaScript Files
gulp.task("scripts", function () {
  return gulp
    .src("./site/src/scripts/**/*.js") // Copy all JS files
    .pipe(gulp.dest("./site/dist/scripts")) // Output to dist/scripts
    .pipe(connect.reload());
});

// Task: Watch Files for Changes
gulp.task("watch", function () {
  gulp.watch(paths.html, gulp.series("html"));
  gulp.watch(paths.partials, gulp.series("html"));
  gulp.watch(paths.styles, gulp.series("styles"));
  gulp.watch(paths.scripts, gulp.series("scripts"));
  gulp.watch(paths.scripts, gulp.series("js"));
  gulp.watch("./site/src/scripts/**/*.js", gulp.series("scripts")); // Watch JS files
});

// Default Task (Run All Tasks)
gulp.task("default", gulp.parallel("html", "styles", "js", "scripts", "server", "watch"));
