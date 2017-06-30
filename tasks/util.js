const fs = require('fs')
const postcss = require('postcss')

const { resolve } = require('path')
const r = url => resolve(process.cwd(), url)

var con = {
  stylus: file => new Promise(resolve => {
    var data = fs.readFileSync(file, 'utf8')

    require('stylus').render(data, { filename: file }, (err, css) => {
      if (err) throw err     
      resolve(css)
    }) 
  }),
  less: file => new Promise(resolve => {
    var data = fs.readFileSync(file, 'utf8')

    require('less').render(data, {}, (err, result) => {
      if (err) throw err     

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
      if (err) throw err     

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
      if (err) throw err     

      resolve(result.css)
    }) 
  })
}

module.exports = {
  con,
  async watchStyle ({ lang, url }) {
    var result = await con[lang](url)

    result = await postcss([
      require('postcss-inline-base64')({
        baseDir: r('./static'),
        useCache: false
      }),
      require('autoprefixer')()
      ])
      .process(result)

    fs.writeFileSync(r('./dist/app.wxss'), result.css, 'utf8')
  }
}