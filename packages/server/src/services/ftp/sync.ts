import rimraf from 'rimraf'
import { getLogger } from '../../utils'
import { CronJob } from 'cron'
import SFTPClient from 'sftp-promises'

const sftp = new SFTPClient();
const logger = getLogger('FTP')
const { FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS, FTP_LOCAL_DIR, FTP_REMOTE_DIR } = process.env

const ftpSync = new CronJob('*/30 * * * * *', async function () {
  logger('FTP sync started')
  let session
  try {
    session = sftp.session({
      host: FTP_HOST,
      port: Number(FTP_PORT),
      user: FTP_USER,
      password: FTP_PASS,
    })
    let success = await sftp.put(FTP_LOCAL_DIR, FTP_REMOTE_DIR, session)
    if (success) {
      logger('File successfully uploaded at ' + new Date())
      rimraf(FTP_LOCAL_DIR + '/*', () => {
        logger('Local files cleared')
      })
    } else {
      logger('File upload failed')
    }
  } catch (err) {
    logger.error(err)
  } finally {
    session && session.end()
  }
}, null, true, 'Asia/Shanghai');
ftpSync.start();

