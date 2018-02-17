/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

export default function destroyPaneItemWithTitle(title: string) {
  for (const item of atom.workspace.getPaneItems()) {
    if (item.getTitle() === title) {
      const pane = atom.workspace.paneForItem(item);
      if (pane != null) {
        pane.destroyItem(item);
        return;
      }
    }
  }
}
