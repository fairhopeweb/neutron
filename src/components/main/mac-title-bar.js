/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import CircularProgress from '@material-ui/core/CircularProgress';

import connectComponent from '../../helpers/connect-component';
import getUrlFromText from '../../helpers/get-url-from-text';
import getStaticGlobal from '../../helpers/get-static-global';
import isMacOs11 from '../../helpers/is-mac-os-11';

import themeColors from '../../constants/theme-colors';

import {
  requestLoadUrl,
} from '../../senders';

const loadingSize = isMacOs11() ? 18 : 14;

const useStyles = makeStyles((theme) => {
  // Big Sur increases title bar height: https://github.com/microsoft/vscode/pull/110592 (28px)
  const titleBarHeight = isMacOs11() ? 28 : 22;
  return {
    root: {
      background: (props) => {
        if (props.themeColor != null) {
          return themeColors[props.themeColor][900];
        }
        return theme.palette.type === 'dark' ? '#2a2b2c' : '#efefef';
      },
      borderBottom: '1px solid',
      borderBottomColor: theme.palette.divider,
      height: titleBarHeight,
      WebkitAppRegion: 'drag',
      WebkitUserSelect: 'none',
      textAlign: 'center',
      lineHeight: `${titleBarHeight}px`,
      fontSize: '13px',
      color: (props) => {
        if (props.themeColor != null) {
          return fade(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
        }
        return theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgb(77, 77, 77)';
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 500,
      paddingLeft: 72,
      paddingRight: 72,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    rootMenubar: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    progressContainer: {
      position: 'absolute',
      right: theme.spacing(1),
      top: (titleBarHeight - loadingSize) / 2 - 1,
    },
    progress: {
      color: (props) => {
        if (props.themeColor != null) {
          return fade(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
        }
        return theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgb(77, 77, 77)';
      },
    },
  };
});

const FakeTitleBar = ({
  isLoading,
  navigationBar,
  searchEngine,
  sidebar,
  themeColor,
  title,
}) => {
  const classes = useStyles({ themeColor });

  if (window.process.platform !== 'darwin') return null;

  const appJson = getStaticGlobal('appJson');
  return (
    <div
      className={classnames(classes.root, window.mode === 'menubar' && classes.rootMenubar)}
      onDoubleClick={() => {
        // feature: double click on title bar to expand #656
        // https://github.com/webcatalog/webcatalog-app/issues/656
        const win = window.remote.getCurrentWindow();
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }}
      onDragOver={(window.mode === 'main' || window.mode === 'menubar') ? (e) => {
        e.preventDefault();
      } : null}
      onDrop={(window.mode === 'main' || window.mode === 'menubar') ? (e) => {
        const text = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text');
        if (text) {
          e.preventDefault();
          const processedUrl = getUrlFromText(text, searchEngine);
          requestLoadUrl(processedUrl);
        }
      } : null}
    >
      {(window.mode === 'main' || window.mode === 'menubar') && title ? title : appJson.name}

      {isLoading && !navigationBar && !sidebar && (
        <div className={classes.progressContainer}>
          <CircularProgress size={loadingSize} className={classes.progress} />
        </div>
      )}
    </div>
  );
};

FakeTitleBar.defaultProps = {
  isLoading: false,
  themeColor: null,
  title: '',
};

FakeTitleBar.propTypes = {
  isLoading: PropTypes.bool,
  navigationBar: PropTypes.bool.isRequired,
  searchEngine: PropTypes.string.isRequired,
  sidebar: PropTypes.bool.isRequired,
  themeColor: PropTypes.string,
  title: PropTypes.string,
};

const mapStateToProps = (state) => {
  const activeWorkspace = state.workspaces.workspaces[state.workspaces.activeWorkspaceId];

  return {
    title: state.general.title,
    searchEngine: state.preferences.searchEngine,
    isLoading: activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading)
      : false,
    navigationBar: (window.process.platform === 'linux'
      && state.preferences.attachToMenubar
      && !state.preferences.sidebar)
      || state.preferences.navigationBar,
    sidebar: state.preferences.sidebar,
  };
};

export default connectComponent(
  FakeTitleBar,
  mapStateToProps,
);
