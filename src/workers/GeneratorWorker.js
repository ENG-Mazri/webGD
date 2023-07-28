import {testWorker} from './GeneratorWorker'
  
onmessage = (event) => {
  console.log('[Worker: test] ', testWorker())
  postMessage('helokojm');
};