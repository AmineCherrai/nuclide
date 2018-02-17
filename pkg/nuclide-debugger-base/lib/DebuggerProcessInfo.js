/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type DebuggerInstanceBase from './DebuggerInstance';
import type {NuclideUri} from '../../commons-node/nuclideUri';
import type {ControlButtonSpecification} from '../../nuclide-debugger/lib/types';

export default class DebuggerProcessInfo {
  _serviceName: string;
  _targetUri: NuclideUri;

  constructor(serviceName: string, targetUri: NuclideUri) {
    this._serviceName = serviceName;
    this._targetUri = targetUri;
  }

  getServiceName(): string {
    return this._serviceName;
  }

  getTargetUri(): NuclideUri {
    return this._targetUri;
  }

  // Whether or not this ProcessInfo supports threading or not.
  // TODO: move this into chrome protocol after we move threads window
  // to Nuclide UI.
  supportThreads(): boolean {
    return false;
  }

  supportSingleThreadStepping(): boolean {
    return false;
  }

  singleThreadSteppingEnabled(): boolean {
    return false;
  }

  customControlButtons(): Array<ControlButtonSpecification> {
    return [];
  }

  async debug(): Promise<DebuggerInstanceBase> {
    throw new Error('abstract method');
  }
}
