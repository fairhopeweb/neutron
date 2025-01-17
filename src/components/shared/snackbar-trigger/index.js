/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { SnackbarProvider } from 'notistack';

import connectComponent from '../../../helpers/connect-component';

import Inner from './inner';

const styles = (theme) => ({
  notistackContainerRoot: {
    marginTop: theme.spacing(1),
  },
});

const SnackbarTrigger = ({ classes }) => {
  const notistackRef = useRef(null);
  const action = useCallback((key) => {
    const onClickDismiss = () => {
      notistackRef.current.closeSnackbar(key);
    };

    return (
      <Button color="inherit" onClick={onClickDismiss}>
        Dismiss
      </Button>
    );
  }, notistackRef);

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      dense
      preventDuplicate
      classes={{
        containerRoot: classes.notistackContainerRoot,
      }}
      action={action}
    >
      <Inner />
    </SnackbarProvider>
  );
};

SnackbarTrigger.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  SnackbarTrigger,
  null,
  null,
  styles,
);
