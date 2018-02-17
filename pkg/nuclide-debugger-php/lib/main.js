/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {HomeFragments} from '../../nuclide-home/lib/types';
import type {
  NuclideDebuggerProvider,
} from '../../nuclide-debugger-interfaces/service';
import type {OutputService} from '../../nuclide-console/lib/types';
import type {DebuggerLaunchAttachProvider} from '../../nuclide-debugger-base';
import type {NuclideUri} from '../../commons-node/nuclideUri';

import {setOutputService} from '../../nuclide-debugger-base';
import {HhvmLaunchAttachProvider} from './HhvmLaunchAttachProvider';
import nuclideUri from '../../commons-node/nuclideUri';

export function consumeOutputService(api: OutputService): void {
  setOutputService(api);
}

export function createDebuggerProvider(): NuclideDebuggerProvider {
  return {
    name: 'hhvm',
    getLaunchAttachProvider(connection: NuclideUri): ?DebuggerLaunchAttachProvider {
      if (nuclideUri.isRemote(connection)) {
        return new HhvmLaunchAttachProvider('PHP', connection);
      }
      return null;
    },
  };
}

export function getHomeFragments(): HomeFragments {
  return {
    feature: {
      title: 'PHP Debugger',
      icon: 'nuclicon-debugger',
      description: 'Connect to a PHP server process and debug Hack code from within Nuclide.',
      command: 'nuclide-debugger:toggle',
    },
    priority: 6,
  };
}
