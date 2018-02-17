/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {
  NuclideDebuggerProvider,
} from '../../nuclide-debugger-interfaces/service';
import type {DebuggerLaunchAttachProvider} from '../../nuclide-debugger-base';
import type {NuclideUri} from '../../commons-node/nuclideUri';

import logger from './utils';
import {getConfig} from './utils';
import {NodeLaunchAttachProvider} from './NodeLaunchAttachProvider';

export function activate(state: mixed): void {
  logger.setLogLevel(getConfig().clientLogLevel);
}

export function createDebuggerProvider(): NuclideDebuggerProvider {
  return {
    name: 'Node',
    getLaunchAttachProvider(connection: NuclideUri): ?DebuggerLaunchAttachProvider {
      return new NodeLaunchAttachProvider('NodeJS', connection);
    },
  };
}
