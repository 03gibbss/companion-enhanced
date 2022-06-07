import React, { useContext, useEffect, useState } from 'react';

import { CreatorContext } from '../../../context/creator/creatorState';

import { Streamdeck } from './Streamdeck'

export const Wrapper = () => {

  const { getAvailableCommands, getStreamdeckConfig, loadingCommands, loadingConfig } = useContext(CreatorContext);

  useEffect(() => {
    getStreamdeckConfig();
    getAvailableCommands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!loadingCommands && !loadingConfig ? <Streamdeck /> : <></>}
    </>
  )
}