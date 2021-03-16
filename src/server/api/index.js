import * as global from './global'
import * as systemManage from './systemManage'
import * as caseManage from './caseManage'
import * as monitorManage from './monitorManage'
import * as testTools from './testTools'
import * as envManage from './envManage'
import * as codeManage from './codeManage'
import * as reportManage from './reportManage'
import * as reimburseManage from './reimburseManage'
import * as mockManage from './mockManage'
import * as dataFactory from './dataFactory'
import * as autoManage from './autoManage'
import * as checkMock from './checkMock'

export default {
  ...global,
  ...systemManage,
  ...caseManage,
  ...monitorManage,
  ...testTools,
  ...envManage,
  ...codeManage,
  ...reportManage,
  ...reimburseManage,
  ...mockManage,
  ...dataFactory,
  ...autoManage,
  ...checkMock
}
