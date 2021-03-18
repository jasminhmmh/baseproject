const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream( { match: '**/*.css' } ));
    }
);

gulp.task('sass-lint', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
    }
);

gulp.task('nunjucks', function(){
   return gulp.src('app/pages/**/*.+(html|njk)')
       .pipe(nunjucksRender({
           path: ['app/templates']
       }))
       .pipe(gulp.dest('app'))
});

gulp.task('default', gulp.parallel('sass', 'sass-lint', 'nunjucks'))

//gulp watch series
gulp.task('watch', function() {
    gulp.watch('app/scss/**/*/*.scss', gulp.series('sass'))
    gulp.watch('app/scss/**/*.scss', gulp.series('sass-lint'))
    gulp.watch('app/pages/**/*.+(html|njk)', gulp.series('nunjucks', function (done) {
        browserSync.reload()
        done()
    }))
    browserSync({
        server: {
            baseDir: 'dist'
        }
    })
    }
);


