import client from '../../clients/mongo'
import { dateStrOnlyNum, getLogger, dateStr } from '../../utils'
import fs from 'fs'
import { TENANT } from './location'
import { IPersonaleDoc, Certificate } from '#/clients/mongo/models/personale'
import { isEmpty } from '@drewxiu/utils/cjs'

const logger = getLogger('Personale Worker')

class PersonaleDataGenerator {
  static Interval = 60000 * 60 * 24 // 1 day

  constructor() {
    this.generate()
  }

  generate() {
    setTimeout(async () => {
      try {
        logger(`Generating Personales File ...`)
        let date = dateStrOnlyNum()
        let fileName = `${TENANT}_RYCS_${date}.txt`
        let personales = await client.personale.find({})

        // 系统型号;系统名称;生产厂家;文件内容更新时间;人员数量
        let headLine = `${'MK-2'};${'扎尼河露天矿人员定位系统'};${'矩时智合'};${dateStr()};${personales.length}~`
        let fileBody = headLine + this.getLines(personales) + '~||'
        fs.writeFile(process.env.FTP_LOCAL_DIR + '/' + fileName, fileBody, function (e) {
          if (e) {
            logger.error('WriteFileError', fileName, e)
          } else {
            logger(`Personale File Generated: ${fileName}`)
          }
        })
      } catch (e) {
        logger.error('GenerationError', e)
      }
      this.generate()
    }, PersonaleDataGenerator.Interval)
  }

  getLines(personales: IPersonaleDoc[]) {
    let lines = new Array()
    for (let i = 0; i < personales.length; i++) {
      let p = personales[i]
      lines.push(PersonaleLineFormatter(p))
    }
    return lines.join('~')
  }
}

export const personaleDataGenerator = new PersonaleDataGenerator()

const PersonaleLineFormatter = (personale: IPersonaleDoc) => {
  // 0	人员卡编码	25 位编码，参看人员卡编码，唯一
  // 1	姓名	不超过 10 个汉字长度
  // 2	身份证号码	18 个十进制数字长度
  // 3	工种或职务	不超过 6 个汉字长度。
  // 4	队组班组/部门	不超过 15 个汉字长度
  // 5	是否是本单位人员	1个汉字字符，是/否
  // 6	性别	1个汉字字符,男/女
  // 7	学历	2个汉字长度，从博士、硕士、本科、大专、中专、高中、初中选择。
  // 8	婚姻状况	2个汉字长度，从“已婚”、“未婚”选择
  // 9	手机号码
  // 10	家庭地址
  // 11	工种证件名称及编号	名称与编码之间用”/”进行分隔，多证之间用“&连接。
  // 12 工种证件有效日期	日期型，YYYY-MM-DD，共 10 位字符；多证之间用“&”连接
  let {
    id,
    name,
    nationalId,
    jobTitle,
    department,
    isExternal,
    sex,
    education,
    maritalStatus,
    phone,
    address,
    certificates,
  } = personale

  isExternal = isExternal ? '否' : '是'

  let certStr = formatCerts(certificates)
  return `${id};${name};${nationalId};${jobTitle};${department};${isExternal};${sex};${education};${maritalStatus};${phone};${address};${certStr}`
}

function formatCerts(certificates: Certificate[]) {
  if (isEmpty(certificates)) {
    return ';'
  }
  let certs = certificates.map((c) => `${c.name}/${c.id}`).join('&')
  let dates = certificates.map((c) => c.validUntil).join('&')
  return `${certs};${dates}`
}
