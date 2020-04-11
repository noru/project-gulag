import dayjs from 'dayjs'

export function dateStr(input?: any) {
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss')
}
