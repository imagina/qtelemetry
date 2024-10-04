import baseService from 'modules/qcrud/_services/baseService'

export default {
  getSensors(){
    return new Promise((resolve, reject) => {
      baseService.index('apiRoutes.qtelemetry.sensors', {refresh: true}).then(response => {
        resolve(response.data)
      }).catch(error => reject(error));
    })
  }
}
