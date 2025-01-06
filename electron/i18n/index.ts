import zhCN from './zh_cn.js'
import en from './en.js'
import zhHK from './zh_hk'
import ja from './ja.js'

export default function (app: Electron.App) {
  if (app.getLocale() === 'zh-CN')
    return zhCN
  else if (app.getLocale() === 'zh-HK' || app.getLocale() === 'zh-HK')
    return zhHK
  else if (app.getLocale() === 'ja')
    return ja
  else return en
}
