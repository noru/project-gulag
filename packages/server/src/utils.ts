import dayjs from 'dayjs'

export function dateStr(input?: any, offset = 0) {
  return dayjs(input).add(offset, 'h').format('YYYY-MM-DD HH:mm:ss')
}

type LogFunc = (message?: any, ...optionalParams: any[]) => void
interface Logger {
  log: LogFunc
  info: LogFunc
  warn: LogFunc
  error: LogFunc
}
export function getLogger(name: string): LogFunc & Logger {
  let TAG = `[${name}]`
  let log = (...args) => console.info(TAG, ...args)
  let warn = (...args) => console.warn(TAG, ...args)
  let error = (...args) => console.error(TAG, ...args)

  let logger: LogFunc & Logger = log as any
  logger.log = log
  logger.info = log
  logger.warn = warn
  logger.error = error
  return logger
}
