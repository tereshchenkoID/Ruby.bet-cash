var gulp = require('gulp'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    concat = require("gulp-concat"),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano');

var paths = {
    dirs: {
        build: './build'
    },
    html: {
        src1: './dev/pages/**/*.pug',
        src2: './dev/modules/**/*.pug',
        dest1: './build',
        dest2: './build/modules/',
        watch: [
            './dev/pages/**/*.pug', 
            './dev/modules/**/*.pug'
        ]
    },
    css: {
        src: ['./dev/style/style.scss'],
        dest: './build/css',
        watch: [
            './dev/style/**/*.scss',
            './dev/**/*.scss',
            './dev/**/*.css'
        ],
    },
    js: {
        src1: './dev/js/**/*.js',
        src2: './dev/modules/**/*.js',
        dest1: './build/js/',
        dest2: './build/modules/',
        watch: [
            './dev/js/**/*.js', 
            './dev/modules/**/*.js'
        ]
    },
    img: {
        src: [
            './dev/img/**/*',
            './dev/modules/**/img/*', 
        ],
        dest: './build/img/',
        watch: [
            './dev/**/img/**/*',
            './dev/modules/**/img/**/*'
        ]
    },
    fonts: {
        src: './dev/fonts/**/*',
        dest: './build/fonts',
        watch: './dev/fonts/**/*' 
    },
    json: {
        src: './dev/**/*.json',
        dest: './build',
        watch: './dev/**/*.json' 
    }
};


gulp.task('clean', function () {
    return del(paths.dirs.build);
});


// == HTML TASK ==
var htmlPath = [
    {src: paths.html.src1, dest: paths.html.dest1},
    {src: paths.html.src2, dest: paths.html.dest2}
];
gulp.task('html', function(done) {
    htmlPath.map(function(file) {
        return gulp.src([
            file.src
        ])
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(file.dest))
        .pipe(browserSync.reload({stream: true}));
    });
    done();
});
// == END HTML TASK ==



gulp.task('css', function(){
    return gulp.src(paths.css.src)
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 20 versions']}))
        .pipe(concat('style.css'))
        .pipe(cssnano('style.css'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.reload({stream: true}));
});



// == JS TASK ==
var jsPath = [
    {src: paths.js.src1, dest: paths.js.dest1},
    {src: paths.js.src2, dest: paths.js.dest2}
];
gulp.task('js', function (done) {
    jsPath.map(function(file) {
        return gulp.src([
            file.src
        ])
        .pipe(plumber())
        .pipe(gulp.dest(file.dest))
        .pipe(browserSync.reload({stream: true}));
    });
    done();
});
// == END JS TASK ==








gulp.task('img', function () {
    return gulp.src(paths.img.src)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest));
});

gulp.task('fonts', function () {
    return gulp.src(paths.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('json', function () {
    return gulp.src(paths.json.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.json.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('server', function () {
    browserSync.init({
        server: { 
            baseDir: paths.dirs.build
        },
        browser: 'chrome',
        host: 'localhost',
        port: 8080,
        open: true,
        watch: true,
        tunnel: false,
        reloadOnRestart: true
    });
    gulp.watch(paths.html.watch, gulp.parallel('html'));
    gulp.watch(paths.css.watch, gulp.parallel('css'));
    gulp.watch(paths.js.watch, gulp.parallel('js'));
    gulp.watch(paths.img.watch, gulp.parallel('img'));
    gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
    gulp.watch(paths.json.watch, gulp.parallel('json'));
});


gulp.task('build', gulp.series(
    'clean',
    'html',
    'css',
    'js',
    'img',
    'fonts',
    'json'
));

gulp.task('dev', gulp.series(
    'build', 'server'
));