const path = require('path')

const ejsViewPath = (pathname) => {
  return path.join(__dirname, `../../resources/views/${pathname}.ejs`)
}

module.exports = {
  ejsViewPath
}
