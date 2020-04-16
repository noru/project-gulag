import * as Koa from 'koa'
import { getLogger } from '../../utils'

export const logger = getLogger('KOA')

interface ILogData {
  method: string
  url: string
  query: string
  remoteAddress: string
  host: string
  userAgent: string
  statusCode: number
  errorMessage: string
  errorStack: string
  data: any
  responseTime: number
}

function outputLog(data: Partial<ILogData>, thrownError: any) {
  if (process.env.NODE_ENV === 'production') {
    logger(
      `${data.statusCode} ${data.method} ${data.url} - ${data.responseTime}ms`,
    )
    if (thrownError) {
      logger.error(thrownError)
    }
  } else if (data.statusCode! < 400) {
    process.stdout.write(JSON.stringify(data) + '\n')
  } else {
    process.stderr.write(JSON.stringify(data) + '\n')
  }
}

export async function koaLogger(ctx: Koa.Context, next: () => Promise<any>) {
  const start = new Date().getMilliseconds()

  const logData: Partial<ILogData> = {
    method: ctx.method,
    url: ctx.url,
    query: ctx.query,
    remoteAddress: ctx.request.ip,
    host: ctx.headers['host'],
    userAgent: ctx.headers['user-agent'],
  }

  let errorThrown: any = null
  try {
    await next()
    logData.statusCode = ctx.status
  } catch (e) {
    errorThrown = e
    logData.errorMessage = e.message
    logData.errorStack = e.stack
    logData.statusCode = e.status || 500
    if (e.data) {
      logData.data = e.data
    }
  }

  logData.responseTime = new Date().getMilliseconds() - start
  outputLog(logData, errorThrown)

  if (errorThrown) {
    throw errorThrown
  }
}
