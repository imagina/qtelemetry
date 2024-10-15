import baseService from 'modules/qcrud/_services/baseService'

export default {
  getDevices(){
    return new Promise((resolve, reject) => {
      const requestParams = {
        refresh: true, 
        params: {
          include: 'sensors'
        }
      }
      
      baseService.index('apiRoutes.qtelemetry.devices', requestParams).then(response => {
        resolve(response.data)
      }).catch(error => reject(error));
    })
  }
}
