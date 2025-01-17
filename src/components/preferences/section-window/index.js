/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import ListItemShortcut from './list-item-shortcut';

const SectionWindow = ({
  alwaysOnTop,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Keep window always on top"
        secondary="The window won't be hidden even when you click outside."
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={alwaysOnTop}
          onChange={(e) => {
            requestSetPreference('alwaysOnTop', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
    <ListItemShortcut />
  </List>
);

SectionWindow.propTypes = {
  alwaysOnTop: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
});

export default connectComponent(
  SectionWindow,
  mapStateToProps,
);
