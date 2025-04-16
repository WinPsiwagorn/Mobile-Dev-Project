const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Add any custom configuration here
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json']
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf', 'otf']

// Add vector icons to the asset extensions
config.resolver.assetExts.push('ttf')
config.resolver.assetExts.push('otf')

// Add vector icons to the source extensions
config.resolver.sourceExts.push('ttf')
config.resolver.sourceExts.push('otf')

// Add vector icons to the asset directories
config.watchFolders.push(path.resolve(__dirname, 'node_modules/@expo/vector-icons'))

module.exports = config 