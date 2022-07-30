// STRING
// ------

/**
 * Get index of string end.
 * @param txt javascript text
 * @param i index of string begin
 */
function indexOfClosingString(txt: string, i: number): number {
  var q = txt.charAt(i);
  while (true) {
    var I = txt.indexOf(q, i + 1);
    if (txt.charAt(I - 1) != "\\") return I;
    i = I + 1;
  }
}


/**
 * String match function.
 * @param full full string
 */
export type StringMatchFunction = (full: string) => void;

/**
 * Match string in javascript text.
 * @param txt javascript text
 * @param fn match function
 */
export function forEachString(txt: string, fn: StringMatchFunction): void {
  var RCOMSTR = /\/\/|\/\*|(?:[=(]\s*)(\/[^\n]+\/[gimsuy]*)|['"`]/g, m = null;
  while ((m = RCOMSTR.exec(txt)) != null) {
    var i = m.index, I = 0;
    if (m[0] === "//")      I = txt.indexOf("\n", i + 1);
    else if (m[0] === "/*") I = txt.indexOf("*/", i + 1);
    else if (m[1] != null)  I = i + m[0].length;
    else {
      I = indexOfClosingString(txt, i);
      fn(txt.substring(i, I + 1));
    }
    RCOMSTR.lastIndex = I + 1;
  }
}


/**
 * Get strings in javascript text.
 * @param txt javascript text
 * @returns strings
 */
export function strings(txt: string): string[] {
  var a = [];
  forEachString(txt, full => a.push(full));
  return a;
}


/**
 * String replace function.
 * @param full full string
 * @returns updated string
 */
export type StringReplaceFunction = (full: string) => string;

/**
 * Replace strings in javascript text.
 * @param txt javascript text
 * @param fn replace function
 * @returns updated javascript text
 */
export function replaceStrings(txt: string, fn: StringReplaceFunction): string {
  var RCOMSTR = /\/\/|\/\*|['"`]/g, m = null, a = "", ai = 0;
  while ((m = RCOMSTR.exec(txt)) != null) {
    var i = m.index, I = 0;
    if (m[0] === "//")      I = txt.indexOf("\n", i + 1);
    else if (m[0] === "/*") I = txt.indexOf("*/", i + 1);
    else {
      I  = indexOfClosingString(txt, i);
      a += txt.substring(ai, i) + fn(txt.substring(i, I + 1));
      ai = I + 1;
    }
    RCOMSTR.lastIndex = I + 1;
  }
  a += txt.substring(ai);
  return a;
}


/**
 * Tag strings in javascript text and remove them.
 * @param txt javascript text
 * @returns [updated javascript text, tags]
 */
export function tagStrings(txt: string): [string, Map<string, string>] {
  var tags = new Map(), i = -1;
  var txt  = replaceStrings(txt, full => {
    var k  = `AUTO_STRING_${++i}`;
    tags.set(k, full);
    return `"${k}"`;
  });
  return [txt, tags];
}


/**
 * Untag strings in javascript text by adding them back.
 * @param txt javascript text
 * @param tags tags
 * @returns updated javascript text
 */
export function untagStrings(txt: string, tags: Map<string, string>): string {
  for (var [tag, full] of tags)
    txt = txt.replace(`"${tag}"`, full);
  return txt;
}




// COMMENT
// -------

/** Regex for comment. */
const RCOMMENT = /\/\/[\s\S]*?$|\/\*[\s\S]*?\*\//gm;


/**
 * Comment match function.
 * @param full full comment
 */
export type CommentMatchFunction = (full: string) => void;

/**
 * Match links in javascript text.
 * @param txt javascript text
 * @param fn match function
 */
export function forEachComment(txt: string, fn: CommentMatchFunction): void {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"'), m = null;
  while ((m = RCOMMENT.exec(txt)) != null)
    fn(m[0]);
}


/**
 * Get comments in javascript text.
 * @param txt javascript text
 * @returns comments
 */
export function comments(txt: string): string[] {
  var a = [];
  forEachComment(txt, full => a.push(full));
  return a;
}


/**
 * Comment replace function.
 * @param full full comment
 * @returns updated comment
 */
export type CommentReplaceFunction = (full: string) => string;

/**
 * Replace comments in javascript text.
 * @param txt javascript text
 * @param fn replace function
 * @returns updated javascript text
 */
export function replaceComments(txt: string, fn: CommentReplaceFunction): string {
  var [txt, tags] = tagStrings(txt);
  txt = txt.replace(RCOMMENT, fn);
  return untagStrings(txt, tags);
}


/**
 * Tag comments in javascript text and remove them.
 * @param txt javascript text
 * @returns [updated javascript text, tags]
 */
export function tagComments(txt: string): [string, Map<string, string>] {
  var tags = new Map(), i = -1;
  var txt  = replaceComments(txt, full => {
    var k  = `AUTO_COMMENT_${++i}`;
    tags.set(k, full);
    return `/* ${k} */`;
  });
  return [txt, tags];
}


/**
 * Untag comments in javascript text by adding them back.
 * @param txt javascript text
 * @param tags tags
 * @returns updated javascript text
 */
export function untagComments(txt: string, tags: Map<string, string>): string {
  for (var [tag, full] of tags)
    txt = txt.replace(`/* ${tag} */`, full);
  return txt;
}


/**
 * Remove comments from javascript text.
 * @param {string} txt javascript text
 * @param {boolean} empty keep empty lines?
 */
export function uncomment(txt: string, empty: boolean=false): string {
  txt = replaceComments(txt, () => "").replace(/[ \t]+$/gm, "");
  if (empty) txt = txt.replace(/\n\n+/g, "\n");
  return txt.trim() + "\n";
}




// JSDOC-SYMBOL
// ------------

/** Regex for jsdoc and attached symbol: [jsdoc, export, default, kind, name]. */
const RJSDOCSYMBOL = /(\/\*\*[\s\S]*?\*\/)(?:\s+(?:(export)\s+(?:(default)\s+)?)?(?:declare\s+)?(type|enum|interface|const|var|let|(?:async\s+)?function\*?|class)\s+([\w$]+))?/g;


/**
 * JSDoc symbol match function.
 * @param full full jsdoc symbol match
 * @param jsdoc jsdoc attached to symbol
 * @param name symbol name
 * @param kind symbol kind
 * @param isExported symbol is exported?
 * @param isDefault symbol is default?
 */
export type JsdocSymbolMatchFunction = (full: string, jsdoc: string, name: string, kind: string, isExported: boolean, isDefault: boolean) => void;

/**
 * Match jsdoc symbols in javascript text.
 * @param txt javascript text
 * @param fn match function
 */
export function forEachJsdocSymbol(txt: string, fn: JsdocSymbolMatchFunction): void {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"'), m = null;
  while ((m = RJSDOCSYMBOL.exec(txt)) != null)
    fn(m[0], m[1] || "", m[5] || "", (m[4] || "").replace(/\s+/g, " "), m[2] === "export", m[3] === "default");
}


/** JSDoc symbol. */
export interface JsdocSymbol {
  /** Full jsdoc symbol match. */
  full: string,
  /** JSDoc attached to symbol. */
  jsdoc: string,
  /** Symbol name. */
  name: string,
  /** Symbol kind. */
  kind: string,
  /** Symbol is exported? */
  isExported: boolean,
  /** Symbol is default? */
  isDefault: boolean,
}

/**
 * Get jsdoc symbols in javascript text.
 * @param txt javascript text
 * @returns jsdoc symbols
 */
export function jsdocSymbols(txt: string): JsdocSymbol[] {
  var a = [];
  forEachJsdocSymbol(txt, (full, jsdoc, name, kind, isExported, isDefault) => {
    a.push({full, jsdoc, name, kind, isExported, isDefault});
  });
  return a;
}


/**
 * Jsdoc symbol replace function.
 * @param full full jsdoc symbol match
 * @param jsdoc jsdoc attached to symbol
 * @param name symbol name
 * @param kind symbol kind
 * @param isExported symbol is exported?
 * @param isDefault symbol is default?
 * @returns updated jsdoc symbol
 */
export type JsdocSymbolReplaceFunction = (full: string, jsdoc: string, name: string, kind: string, isExported: boolean, isDefault: boolean) => string;

/**
 * Replace jsdoc symbols in javascript text.
 * @param txt javascript text
 * @param fn replace function
 * @returns updated javascript text
 */
export function replaceJsdocSymbols(txt: string, fn: JsdocSymbolReplaceFunction): string {
  var [txt, tags] = tagStrings(txt);
  txt = txt.replace(RJSDOCSYMBOL, (m, p1, p2, p3, p4, p5) => {
    return fn(m, p1 || "", p5 || "", (p4 || "").replace(/\s+/g, " "), p2 === "export", p3 === "default");
  });
  return untagStrings(txt, tags);
}




// EXPORT-SYMBOL
// -------------

/** Regex for export symbol: [symbol1, symbol2, default1, kind, symbol3, default2, symbol4; symbol5, symbol6, module1, symbols?, module2]. */
const REXPORTSYMBOL = /export\s+\{\s*(?:(\S+)|(?:\S+\s+as\s+(\S+)))\s*\}|export\s+(?:(default)\s+)?(type|enum|interface|const|var|let|(?:async\s+)?function\*?|class)\s+([\w$]+)|export\s+(default)\s+([\w$]+)|module\s*\.\s*([\w$]+)|module\s*\[\s*['"`](.*?)['"`]\s*\]|(module)\s*\.\s*exports\s*=\s*\{(.*?)\}|(module)\s*\.\s*exports\s*=/g;


/**
 * Export symbol match function.
 * @param full full export symbol match
 * @param name symbol name
 * @param kind symbol kind
 * @param isDefault symbol is default?
 */
export type ExportSymbolMatchFunction = (full: string, name: string, kind: string, isDefault: boolean) => void;

/**
 * Match export symbols in javascript text.
 * @param txt javascript text
 * @param fn match function
 */
export function forEachExportSymbol(txt: string, fn: ExportSymbolMatchFunction): void {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"');
  var txt = replaceComments(txt, () => `/* AUTO_COMMENT */`), m = null;
  while ((m = REXPORTSYMBOL.exec(txt)) != null)
    fn(m[0], m[11] || m[9] || m[8] || m[7] || m[5] || m[2] || m[1] || "", (m[4] || "").replace(/\s+/g, " "), (m[6] || m[3]) === "default" || (m[12] || m[10]) === "module");
}


/** Export symbol. */
export interface ExportSymbol {
  /** Full export symbol match. */
  full: string,
  /** Symbol name. */
  name: string,
  /** Symbol kind. */
  kind: string,
  /** Symbol is default? */
  isDefault: boolean,
}

/**
 * Get export symbols in javascript text.
 * @param txt javascript text
 * @returns export symbols
 */
export function exportSymbols(txt: string): ExportSymbol[] {
  var a = [];
  forEachExportSymbol(txt, (full, name, kind, isDefault) => {
    a.push({full, name, kind, isDefault});
  });
  return a;
}


/**
 * Export symbol replace function.
 * @param full full export symbol match
 * @param name symbol name
 * @param kind symbol kind
 * @param isDefault symbol is default?
 * @returns updated export symbol
 */
export type ExportSymbolReplaceFunction = (full: string, name: string, kind: string, isDefault: boolean) => string;

/**
 * Replace export symbols in javascript text.
 * @param txt javascript text
 * @param fn replace function
 * @returns updated javascript text
 */
export function replaceExportSymbols(txt: string, fn: ExportSymbolReplaceFunction): string {
  var [txt, stags] = tagStrings(txt);
  var [txt, ctags] = tagComments(txt);
  txt = txt.replace(REXPORTSYMBOL, (m, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12) => {
    return fn(m, p11 || p9 || p8 || p7 || p5 || p2 || p1 || "", (p4 || "").replace(/\s+/g, " "), (p6 || p3) === "default" || (p12 || p10) === "module");
  });
  txt = untagComments(txt, ctags);
  txt = untagStrings(txt,  stags);
  return txt;
}




// IMPORT-SYMBOL
// -------------

/** Regex for import symbol: [file1, file2]. */
const RIMPORTSYMBOL = /(?:import|export).*?from\s*['"`](.*?)['"`]|require\s*\(\s*['"`](.*?)['"`]\s*\)/g;


/**
 * Import symbol match function.
 * @param full full import symbol match
 * @param file import file
 */
export type ImportSymbolMatchFunction = (full: string, file: string) => void;

/**
 * Match import symbols in javascript text.
 * @param txt javascript text
 * @param fn match function
 */
export function forEachImportSymbol(txt: string, fn: ImportSymbolMatchFunction): void {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"');
  var txt = replaceComments(txt, () => `/* AUTO_COMMENT */`), m = null;
  while ((m = RIMPORTSYMBOL.exec(txt)) != null)
    fn(m[0], m[2] || m[1] || "");
}


/** Import symbol. */
export interface ImportSymbol {
  /** Full import symbol match. */
  full: string,
  /** Import file. */
  file: string,
}

/**
 * Get import symbols in javascript text.
 * @param txt javascript text
 * @returns export symbols
 */
export function importSymbols(txt: string): ImportSymbol[] {
  var a = [];
  forEachImportSymbol(txt, (full, file) => a.push({full, file}));
  return a;
}


/**
 * Import symbol replace function.
 * @param full full import symbol match
 * @param file import file
 * @returns updated import symbol
 */
export type ImportSymbolReplaceFunction = (full: string, file: string) => string;

/**
 * Replace import symbols in javascript text.
 * @param txt javascript text
 * @param fn replace function
 * @returns updated javascript text
 */
export function replaceImportSymbols(txt: string, fn: ImportSymbolReplaceFunction): string {
  var [txt, stags] = tagStrings(txt);
  var [txt, ctags] = tagComments(txt);
  txt = txt.replace(RIMPORTSYMBOL, (m, p1, p2) => fn(m, p2 || p1 || ""));
  txt = untagComments(txt, ctags);
  txt = untagStrings(txt,  stags);
  return txt;
}




// DECLARATION
// -----------

/**
 * Correct type declarations after generation.
 * @param txt javascript text
 * @param module module name
 * @returns corrected javascript text
 */
export function correctDeclarations(txt: string, module: string=null): string {
  var [txt, stags] = tagStrings(txt);
  var [txt, ctags] = tagComments(txt);
  txt = txt.replace(/export\s+declare/g,   "export");
  txt = txt.replace(/export\s+default\s+/, "export = ");
  txt = txt.replace(/declare\s+module\s+['"`](.*?)['"`]/g, (m, p1) => {
    return module != null? `declare module "${module}"` : m;
  });
  txt = untagComments(txt, ctags);
  txt = untagStrings(txt,  stags);
  return txt;
}
