import * as ftp from 'basic-ftp'
import rimraf from 'rimraf'
import { getLogger } from '../../utils'

const logger = getLogger('FTP')

const { FTP_HOST, FTP_USER, FTP_PASS, FTP_LOCAL_DIR, FTP_REMOTE_DIR } = process.env
const client = new ftp.Client()
client.ftp.log = logger.info
// client.ftp.verbose = true

async function ftpSync() {
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
    })
    await client.ensureDir(FTP_REMOTE_DIR!)
    await client.uploadFromDir(FTP_LOCAL_DIR!)
    logger('File successfully uploaded at ' + new Date())
    rimraf(FTP_LOCAL_DIR + '/*', () => {
      logger('Local files cleared')
    })
  } catch (err) {
    logger.error(err)
  } finally {
    client.close()
    setTimeout(ftpSync, 30000) // 30 sec
  }
}

ftpSync()
