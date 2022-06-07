import React from 'react';

import { CreatorProvider } from '../../../context/creator/creatorState';

import { Wrapper } from './Wrapper'

export const Creator = () => {

  return (
    <CreatorProvider>
      <Wrapper />
    </ CreatorProvider>
  )
}