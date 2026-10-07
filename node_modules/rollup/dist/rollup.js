/*
  @license
	Rollup.js v4.64.2
	Wed, 07 Oct 2026 17:38:44 GMT - commit 19e0dcbf5aaeab7cc8efd92f7604ca3a20406cd2

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const rollup = require('./shared/rollup.js');
const rollup_js = require('./shared/node-entry.js');
require('./shared/parseAst.js');
require('./native.js');
require('node:path');
require('node:process');
require('path');
require('node:perf_hooks');
require('node:fs/promises');
require('./shared/fsevents-importer.js');



exports.defineConfig = rollup.defineConfig;
exports.rollup = rollup.rollup;
exports.VERSION = rollup_js.VERSION;
exports.watch = rollup_js.watch;
//# sourceMappingURL=rollup.js.map
