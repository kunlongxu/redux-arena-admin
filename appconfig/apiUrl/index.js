import * as apiUrl from './apiUrl'
import * as apiUrlFunc from './apiUrl.func'
import * as apiUrlProd from './apiUrl.prod'

let exportModule = null;

switch (process.env.BUILD_ENV) {
  case 'prod':
    exportModule = apiUrlProd
    break;
  case 'func':
    exportModule = apiUrlFunc
    break;
  case 'dev':
    exportModule = apiUrl
    break;
  default:
    exportModule = apiUrl
}

module.exports=exportModule