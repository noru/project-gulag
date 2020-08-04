import rimraf from 'rimraf'
import { getLogger } from '../../utils'
import { CronJob } from 'cron'
import SFTPClient from 'sftp-promises'
import fs from 'fs'

const sftp = new SFTPClient();
const logger = getLogger('FTP')
const { FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS, FTP_LOCAL_DIR, FTP_REMOTE_DIR } = process.env

const ftpSync = new CronJob('*/30 * * * * *', async function () {
  let list = fs.readdirSync(FTP_LOCAL_DIR!)
  if (list.length === 0) return
  logger('FTP sync started')
  let session
  try {
    session = await sftp.session({
      host: FTP_HOST,
      port: Number(FTP_PORT),
      user: FTP_USER,
      password: FTP_PASS,
    })
    for (let file of list) {
      await sftp.put(FTP_LOCAL_DIR + '/' + file, FTP_REMOTE_DIR + '/' + file, session)
    }
    rimraf(FTP_LOCAL_DIR + '/*', () => {
      logger('Local files cleared')
    })
  } catch (err) {
    logger.error(err)
  } finally {
    session && session.end()
  }
}, null, true, 'Asia/Shanghai');
ftpSync.start();

