const moduleName = 'itelemetry';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase: urlBase,
  version: moduleVersion, 
  devices: `${urlBase}/devices`,
  sensors: `${urlBase}/sensors`,
  records: `${urlBase}/records`,
  recordsensors: `${urlBase}/recordsensors`,   
}
