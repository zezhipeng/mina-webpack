require('shelljs/global')

const webpack = require('webpack')
const fs = require('fs')
const _ = require('lodash')
const webpackConf = require('./webpack.conf')
const { resolve } = require('path')
const r = url => resolve(process.cwd(), url)

const config = require(r('./mina-config'))
const con = {
  stylus: file => new Promise(resolve => {
    var data = fs.readFileSync(file, 'utf8')

    require('stylus').render(data, { filename: file }, (err, css) => {        
      resolve(css)
    }) 
  }),
  less: file => new Promise(resolve => {
    var data = fs.readFileSync(file, 'utf8')

    require('less').render(data, {}, (err, result) => {
      resolve(result.css)
    }) 
  }),
  scss: file => new Promise(resolve => {
    var data = fs.readFileSync(file, 'utf8')

    require('node-sass').render({
      file, 
      data,
      outputStyle: 'compressed'
    }, (err, result) => {
      resolve(result.css)
    }) 
  }),
  sass: file => new Promise(resolve => {
    var data = fs.readFileSync(file, 'utf8')

    require('node-sass').render({
      file, 
      data,
      outputStyle: 'compressed',
      indentedSyntax: true
    }, (err, result) => {
      resolve(result.css)
    }) 
  })
}

const assetsPath = r('./dist')

rm('-rf', assetsPath)
mkdir(assetsPath)

var renderConf = webpackConf

var entry = () => _.reduce(config.json.pages, (en, i) => {
  en[i] = resolve(process.cwd(), './', `${i}.mina`)

  return en
}, {})

renderConf.output = {
  path: r('./dist'),
  filename: '[name].js'
}

renderConf.entry = entry()
renderConf.entry.app = config.app

var compiler = webpack(renderConf)

fs.writeFileSync(r('./dist/app.json'), JSON.stringify(config.json), 'utf8')

con[config.style.lang](config.style.url)
  .then(function (result) {
    fs.writeFileSync(r('./dist/app.wxss'), result, 'utf8')
  })

compiler.watch({
  aggregateTimeout: 300, // wait so long for more changes
  poll: true // use polling instead of native watchers
}, (err, stats) => {
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: true,
    chunks: true,
    chunkModules: true
  }) + '\n\n')
})
