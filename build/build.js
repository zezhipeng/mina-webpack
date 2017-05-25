require('shelljs/global')

const webpack = require('webpack')
const fs = require('fs')
const _ = require('lodash')
const webpackConf = require('./webpack.conf')
const { resolve } = require('path')
const r = url => resolve(process.cwd(), url)

const config = require(r('./mina-config'))
const { con, watchStyle } = require('./util')

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

watchStyle(config.style)

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

