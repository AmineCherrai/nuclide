/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import UniversalDisposable from '../../commons-node/UniversalDisposable';
import {connectToPackager} from './connectToPackager';
import {connectToIwdp} from './connectToIwdp';
import {ConnectionMultiplexer} from './ConnectionMultiplexer';
import {logger} from './logger';

import type {ConnectableObservable, Observable} from 'rxjs';
import type {DeviceInfo, TargetEnvironment} from './types';

const {log} = logger;
let lastServiceObjectDispose = null;

import {ClientCallback} from '../../nuclide-debugger-common/lib/main';

export class IwdpDebuggerService {
  _clientCallback: ClientCallback;
  _disposables: UniversalDisposable;
  _connectionMultiplexer: ConnectionMultiplexer;

  constructor() {
    if (lastServiceObjectDispose != null) {
      lastServiceObjectDispose();
    }
    lastServiceObjectDispose = this.dispose.bind(this);
    this._clientCallback = new ClientCallback();
    this._connectionMultiplexer = new ConnectionMultiplexer(
      message => this._clientCallback.sendChromeMessage(JSON.stringify(message)),
    );
    this._disposables = new UniversalDisposable(
      this._clientCallback,
      this._connectionMultiplexer,
    );
  }

  getServerMessageObservable(): ConnectableObservable<string> {
    return this._clientCallback.getServerMessageObservable().publish();
  }

  attach(targetEnvironment: TargetEnvironment): Promise<string> {
    const connection = connectToTarget(targetEnvironment);
    this._disposables.add(
      connection.subscribe(deviceInfo => {
        log(`Got device info: ${JSON.stringify(deviceInfo)}`);
        this._connectionMultiplexer.add(deviceInfo);
      }),
    );
    return Promise.resolve('IWDP Connected');
  }

  sendCommand(message: string): Promise<void> {
    this._connectionMultiplexer.sendCommand(JSON.parse(message));
    return Promise.resolve();
  }

  dispose(): Promise<void> {
    if (this._disposables != null) {
      this._disposables.dispose();
    }
    return Promise.resolve();
  }
}

function connectToTarget(targetEnvironment: TargetEnvironment): Observable<DeviceInfo> {
  if (targetEnvironment === 'iOS') {
    return connectToIwdp();
  } else if (targetEnvironment === 'Android') {
    return connectToPackager();
  }
  throw new Error(`Unrecognized environment: ${targetEnvironment}`);
}
