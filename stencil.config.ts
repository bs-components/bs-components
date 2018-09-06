/* eslint-disable */
import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'bscomponents',
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
