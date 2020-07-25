import * as ftp from 'basic-ftp'
import rimraf from 'rimraf'
import { getLogger } from '../../utils'
import { CronJob } from 'cron'

const logger = getLogger('FTP')
const { FTP_HOST, FTP_USER, FTP_PASS, FTP_LOCAL_DIR, FTP_REMOTE_DIR } = process.env
const client = new ftp.Client()
client.ftp.log = logger.info
// client.ftp.verbose = true

const ftpSync = new CronJob('*/30 * * * * *', async function () {
  logger('FTP sync started')
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
  }
}, null, true, 'Asia/Shanghai');
ftpSync.start();

