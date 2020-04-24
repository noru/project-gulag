import dayjs from 'dayjs'

export function dateStr(input?: any): string {
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss')
}
