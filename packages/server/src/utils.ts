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
  ecs: true,
  base: null,
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
export function getLogger(tag: string): LogFunc & Logger {
  let builder = (logFunc) => {
    return (...args) => logFunc({ tag, msg: args[0], rest: args.slice(1) })
  }
  let log = builder(PinoLogger.info.bind(PinoLogger))
  let logger: LogFunc & Logger = log as any
  logger.log = log
  logger.info = log
  logger.warn = builder(PinoLogger.warn.bind(PinoLogger))
  logger.error = builder(PinoLogger.error.bind(PinoLogger))
  return logger
}
