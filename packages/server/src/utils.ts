import dayjs from 'dayjs'
import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'

const { ES_HOST, ES_PORT, ES_USER, ES_PASS, NODE_ENV } = process.env

const streamToElastic = NODE_ENV === 'production' ? pinoElastic({
  index: 'gulag-server-log',
  type: 'log',
  consistency: 'one',
  node: `http://${ES_HOST}:${ES_PORT}`,
  auth: {
    username: ES_USER,
    password: ES_PASS,
  },
  'es-version': 7,
  'bulk-size': 200,
  ecs: true,
  base: null,
}) : undefined

const PinoLogger = pino({ level: 'info' }, streamToElastic)

export function dateStr(input?: any, offset = 8) {
  return dayjs(input).add(offset, 'h').format('YYYY-MM-DD HH:mm:ss')
}

export function dateStrOnlyNum(input?: any, offset = 8) {
  return dateStr(input, offset).replace(/(:|\s|-)/g, '')
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
