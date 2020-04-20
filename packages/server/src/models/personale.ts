// export interface Certificate {
//   id: string
//   name: string
//   validUntil: Date
// }

// export interface Personale {
//   // 序号	字段名称	属性说明
//   // 0	人员卡编码	25 位编码，参看人员卡编码，唯一
//   // 1	姓名	不超过 10 个汉字长度
//   // 2	身份证号码	18 个十进制数字长度
//   // 3	工种或职务	不超过 6 个汉字长度。
//   // 4	队组班组/部门	不超过 15 个汉字长度
//   // 5	是否是本单位人员	1个汉字字符，是/否
//   // 6	性别	1个汉字字符,男/女
//   // 7	学历	2个汉字长度，从博士、硕士、本科、大专、中专、高中、初中选择。
//   // 8	婚姻状况	2个汉字长度，从“已婚”、“未婚”选择
//   // 9	手机号码
//   // 10	家庭地址
//   // 11 工种证件名称及编号	名称与编码之间用”/”进行分隔，多证之间用“&连接。
//   // 12 工种证件有效日期	日期型，YYYY-MM-DD，共 10 位字符；多证之间用“&”连接
//   imei: string
//   id: string
//   name: string
//   nationalId: string
//   jobTitle: string
//   department: string
//   isExternal: boolean
//   sex: string
//   education: string
//   maritalStatus: string
//   phone: string
//   address: string
//   vehicleId: string
//   vehicleTerminalId: string
//   certificates: Certificate[]
// }

// export class Personale implements Personale {}
