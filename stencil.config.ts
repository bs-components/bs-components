import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'bosscomponents',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
