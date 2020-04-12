import * as ftp from 'basic-ftp'
import rimraf from 'rimraf'

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASS,
  FTP_LOCAL_DIR,
  FTP_REMOTE_DIR,
} = process.env

async function ftpSync() {
  const client = new ftp.Client()
  // client.ftp.verbose = true
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
    })
    await client.ensureDir(FTP_REMOTE_DIR!)
    await client.uploadFromDir(FTP_LOCAL_DIR!)
    console.info('File successfully uploaded at ' + new Date())
    rimraf(FTP_LOCAL_DIR + '/*', () => {
      console.info('[FTP] Local files cleared')
    })
  } catch (err) {
    console.error(err)
  } finally {
    client.close()
    setTimeout(ftpSync, 1800000) // half an hour
  }
}

ftpSync()
