const path = require('path')
const env = process.env

enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
}
const NODE_ENV = env.NODE_ENV || NodeEnv.DEV

const config = {
  env: NODE_ENV,
  port: env.NODE_PORT || 80,
  prettyLog: NODE_ENV === NodeEnv.DEV,
  rootPath: path.resolve('.'),
  staticContentPath: env.STATIC_CONTENT_PATH || 'static',
  tempFileDir: '/__files',
  OTPSecret: 'HWDMH7PAKUX25GM6CPEI76QUMQWUSEVR',
  volumn: '/fileStorage',
  ftpUrl: '39.105.81.115',
  ftpUser: 'ftp01',
  ftpPass: '1qaz2wsx-ftp',
}

export default config
