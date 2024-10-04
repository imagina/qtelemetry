import baseService from 'modules/qcrud/_services/baseService'

export default {
  getSensors(params = {}){
    return new Promise((resolve, reject) => {
      const requestParams = {refresh: true, params}
      baseService.index('apiRoutes.qtelemetry.sensors', requestParams).then(response => {
        resolve(response.data)
      }).catch(error => reject(error));
    })
  },
  getRecords(params = {}){
    return new Promise((resolve, reject) => {
      const requestParams = {refresh: true, params}
      requestParams.params.include = 'device,logs'
      //Request
      baseService.index('apiRoutes.qtelemetry.records', requestParams).then(response => {
        resolve(response.data)
      }).catch(error => reject(error))
    })
  },
}
