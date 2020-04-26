import dayjs from 'dayjs'
import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'

const { ES_HOST } = process.env

const streamToElastic = pinoElastic({
  index: 'gulag-server-log',
  type: 'log',
  consistency: 'one',
  node: `http://${ES_HOST}:9200`,
  'es-version': 7,
  'bulk-size': 200,
  ecs: true
})

const PinoLogger = pino({ level: 'info' }, streamToElastic)

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
  let log = (...args) => PinoLogger.info([TAG, ...args].join(';'))
  let warn = (...args) => PinoLogger.warn([TAG, ...args].join(';'))
  let error = (...args) => PinoLogger.error([TAG, ...args].join(';'))

  let logger: LogFunc & Logger = log as any
  logger.log = log
  logger.info = log
  logger.warn = warn
  logger.error = error
  return logger
}
