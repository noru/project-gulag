import dayjs from 'dayjs'

export function dateStr(input?: any, offset = 0) {
  return dayjs(input).add(offset, 'h').format('YYYY-MM-DD HH:mm:ss')
}

export function getLogger(name: string) {
  return (...args) => console.info(`[${name}]`, ...args)
}
