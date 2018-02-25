module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './src/index.js'
    config.entry.initialize = './src/initialize.js'
    return config
  }
}
