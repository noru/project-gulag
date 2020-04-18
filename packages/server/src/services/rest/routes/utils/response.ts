export enum ErrorCode {
  NotFound = 'not_found',
  InvalidParams = 'invalid_params',
  DuplicatedId = 'duplicated_id',
  Unauthorized = 'unauthorized',
  Unknown = 'unknown',
}

function messageBuilder(code: ErrorCode, msg?: string, e?: Error) {
  return {
    error: code,
    msg,
    detail: e,
  }
}

export function responseHelper(ctx, code: ErrorCode, e?: any) {
  switch (code) {
    case ErrorCode.NotFound:
      ctx.status = 404
      ctx.body = messageBuilder(code, 'Not Found', e)
      break
    case ErrorCode.DuplicatedId:
    case ErrorCode.InvalidParams:
      ctx.status = 400
      ctx.body = messageBuilder(code, 'Invalid parameters, check input', e)
      break
    case ErrorCode.Unauthorized:
      ctx.status = 401
      ctx.body = messageBuilder(code, 'Unauthorized', e)
      break
    case ErrorCode.Unknown:
    // fall through
    default:
      ctx.status = 500
      ctx.body = messageBuilder(ErrorCode.Unknown, 'Something bad happened, very bad')
      break
  }
}
