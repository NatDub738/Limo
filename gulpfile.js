import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import csso from 'gulp-csso';
import include from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import { deleteAsync } from 'del';
import concat from 'gulp-concat';
import autoPrefixer from 'gulp-autoprefixer';
import sync from 'browser-sync';

const server = sync.create();
const sass = gulpSass(dartSass);
const { src, dest, watch, series, parallel } = gulp;

const html = () => {
    return src('src/**/*.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'));
};

const scss = () => {
    return src('src/scss/style.scss')
        .pipe(sass())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(csso())
        .pipe(concat('style.min.css'))
        .pipe(dest('dist/css'));
};

const img = () => {
    return src(`./src/img/**/*.{jpg,png,jpeg,ico,svg}`)
        .pipe(dest('./dist/img'));
}

const fonts = () => {
    return src(`./src/fonts/**/*.{ttf,woff,woff2}`)
        .pipe(dest('./dist/fonts'));
}

const clear = () => {
    return deleteAsync('dist');
};

const serverSync = () => {
    server.init({
        server: './dist/',
    });

    watch('src/**.html', series(html)).on('change', server.reload);
    watch('src/scss/**/*.scss', series(scss)).on('change', server.reload);
};

export const build = series(clear, scss, parallel(img, fonts, html));
export const serve = series(clear, scss, parallel(img, fonts, html), serverSync);