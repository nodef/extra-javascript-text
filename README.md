Utilities for processing JavaScript text.<br>
📦 [Node.js](https://www.npmjs.com/package/extra-javascript-text),
🌐 [Web](https://www.npmjs.com/package/extra-javascript-text.web),
📜 [Files](https://unpkg.com/extra-javascript-text/),
📰 [Docs](https://nodef.github.io/extra-javascript-text/).

This package is available in both *Node.js* and *Web* formats. The web format
is exposed as `extra_javascript_text` standalone variable and can be loaded from
[jsDelivr CDN].

> Stability: [Experimental](https://www.youtube.com/watch?v=L1j93RnIxEo).

[jsDelivr CDN]: https://cdn.jsdelivr.net/npm/extra-javascript-text.web/index.js

<br>

```javascript
const fs         = require('fs');
const javascript = require('extra-javascript-text');


function main() {
  var txt = fs.readFileSync('src/index.ts', 'utf8').replace(/\r?\n/, '\n');

  javascript.importSymbols(txt);
  // []

  javascript.exportSymbols(txt);
  // [
  //   {
  //     full: 'export function tagStrings',
  //     name: 'tagStrings',
  //     kind: 'function',
  //     isDefault: false
  //   },
  //   {
  //     full: 'export function untagStrings',
  //     name: 'untagStrings',
  //     kind: 'function',
  //     isDefault: false
  //   },
  //   ...
  // ]

  javascript.jsdocSymbols(txt);
  // [
  //   {
  //     full: '/**\r\n' +
  //       ' * Get index of string end.\r\n' +
  //       ' * @param txt javascript text\r\n' +
  //       ' * @param i index of string begin\r\n' +
  //       ' */\r\n' +
  //       ' function indexOfClosingString',
  //     jsdoc: '/**\r\n' +
  //       ' * Get index of string end.\r\n' +
  //       ' * @param txt javascript text\r\n' +
  //       ' * @param i index of string begin\r\n' +
  //       ' */',
  //     name: 'indexOfClosingString',
  //     kind: 'function',
  //     isExported: false,
  //     isDefault: false
  //   },
  //   {
  //     full: '/**\r\n' +
  //       ' * Tag strings in javascript text and remove them.\r\n' +
  //       ' * @param txt javascript text\r\n' +
  //       ' * @returns [updated javascript text, tags]\r\n' +
  //       ' */\r\n' +
  //       'export function tagStrings',
  //     jsdoc: '/**\r\n' +
  //       ' * Tag strings in javascript text and remove them.\r\n' +
  //       ' * @param txt javascript text\r\n' +
  //       ' * @returns [updated javascript text, tags]\r\n' +
  //       ' */',
  //     name: 'tagStrings',
  //     kind: 'function',
  //     isExported: true,
  //     isDefault: false
  //   },
  //   ...
  // ]
}
main();
```

<br>
<br>


## Index

| Property | Description |
|  ----  |  ----  |
| [tagStrings] | Tag strings in javascript text and remove them. |
| [untagStrings] | Untag strings in javascript text by adding them back. |
| [forEachComment] | Match links in javascript text. |
| [comments] | Get comments in javascript text. |
| [replaceComments] | Replace comments in javascript text. |
| [tagComments] | Tag comments in javascript text and remove them. |
| [untagComments] | Untag comments in javascript text by adding them back. |
| [uncomment] | Remove comments from javascript text. |
| [forEachJsdocSymbol] | Match jsdoc symbols in javascript text. |
| [jsdocSymbols] | Get jsdoc symbols in javascript text. |
| [replaceJsdocSymbols] | Replace jsdoc symbols in javascript text. |
| [forEachExportSymbol] | Match export symbols in javascript text. |
| [exportSymbols] | Get export symbols in javascript text. |
| [replaceExportSymbols] | Replace export symbols in javascript text. |
| [forEachImportSymbol] | Match import symbols in javascript text. |
| [importSymbols] | Get import symbols in javascript text. |
| [replaceImportSymbols] | Replace import symbols in javascript text. |
| [correctDeclarations] | Correct type declarations after generation. |

<br>
<br>

[![](https://img.youtube.com/vi/rJYcZX8na_Q/maxresdefault.jpg)](https://www.youtube.com/watch?v=rJYcZX8na_Q)<br>
[![DOI](https://zenodo.org/badge/476759917.svg)](https://zenodo.org/badge/latestdoi/476759917)


[tagStrings]: https://nodef.github.io/extra-javascript-text/modules.html#tagStrings
[untagStrings]: https://nodef.github.io/extra-javascript-text/modules.html#untagStrings
[forEachComment]: https://nodef.github.io/extra-javascript-text/modules.html#forEachComment
[comments]: https://nodef.github.io/extra-javascript-text/modules.html#comments
[replaceComments]: https://nodef.github.io/extra-javascript-text/modules.html#replaceComments
[tagComments]: https://nodef.github.io/extra-javascript-text/modules.html#tagComments
[untagComments]: https://nodef.github.io/extra-javascript-text/modules.html#untagComments
[uncomment]: https://nodef.github.io/extra-javascript-text/modules.html#uncomment
[forEachJsdocSymbol]: https://nodef.github.io/extra-javascript-text/modules.html#forEachJsdocSymbol
[jsdocSymbols]: https://nodef.github.io/extra-javascript-text/modules.html#jsdocSymbols
[replaceJsdocSymbols]: https://nodef.github.io/extra-javascript-text/modules.html#replaceJsdocSymbols
[forEachExportSymbol]: https://nodef.github.io/extra-javascript-text/modules.html#forEachExportSymbol
[exportSymbols]: https://nodef.github.io/extra-javascript-text/modules.html#exportSymbols
[replaceExportSymbols]: https://nodef.github.io/extra-javascript-text/modules.html#replaceExportSymbols
[forEachImportSymbol]: https://nodef.github.io/extra-javascript-text/modules.html#forEachImportSymbol
[importSymbols]: https://nodef.github.io/extra-javascript-text/modules.html#importSymbols
[replaceImportSymbols]: https://nodef.github.io/extra-javascript-text/modules.html#replaceImportSymbols
[correctDeclarations]: https://nodef.github.io/extra-javascript-text/modules.html#correctDeclarations
