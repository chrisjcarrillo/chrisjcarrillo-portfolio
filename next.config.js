const path = require('path')

module.exports = {
  turbopack: {
    root: __dirname,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}