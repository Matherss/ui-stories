/**
 * Strips `//` and `/* *\/` comments from SCSS source (string-aware for //).
 * @param {string} src
 * @returns {string}
 */
export function stripScssComments(src) {
  let out = '';
  let i = 0;
  let inString = null;
  let escape = false;

  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];

    if (inString) {
      out += c;
      if (escape) {
        escape = false;
      } else if (c === '\\' && inString !== '`') {
        escape = true;
      } else if (c === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    if (c === '/' && next === '/') {
      i += 2;
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }

    if (c === '/' && next === '*') {
      i += 2;
      while (i < src.length - 1) {
        if (src[i] === '*' && src[i + 1] === '/') {
          i += 2;
          break;
        }
        i++;
      }
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      out += c;
      i++;
      continue;
    }

    out += c;
    i++;
  }

  return out;
}

/**
 * Reads value until a top-level `;` (respects parens, brackets, strings).
 * @param {string} src
 * @param {number} start
 * @returns {{ value: string, end: number }}
 */
export function parseValueUntilSemicolon(src, start) {
  let depthParen = 0;
  let depthBracket = 0;
  let inString = null;
  let escape = false;
  let i = start;

  while (i < src.length) {
    const c = src[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === '\\' && inString !== '`') {
        escape = true;
      } else if (c === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      i++;
      continue;
    }

    if (c === '(') depthParen++;
    else if (c === ')') depthParen = Math.max(0, depthParen - 1);
    else if (c === '[') depthBracket++;
    else if (c === ']') depthBracket = Math.max(0, depthBracket - 1);
    else if (
      c === ';' &&
      depthParen === 0 &&
      depthBracket === 0
    ) {
      return { value: src.slice(start, i).trim(), end: i + 1 };
    }

    i++;
  }

  return { value: src.slice(start).trim(), end: src.length };
}

/**
 * @param {string} src
 * @returns {Map<string, string>}
 */
export function extractScssVariableMap(src) {
  const cleaned = stripScssComments(src);
  /** @type {Map<string, string>} */
  const map = new Map();
  let i = 0;

  while (i < cleaned.length) {
    if (cleaned[i] !== '$') {
      i++;
      continue;
    }

    let j = i + 1;
    const nameStart = j;
    while (j < cleaned.length && /[\w-]/.test(cleaned[j])) j++;
    if (j === nameStart) {
      i++;
      continue;
    }

    const name = cleaned.slice(nameStart, j);
    while (j < cleaned.length && /\s/.test(cleaned[j])) j++;
    if (cleaned[j] !== ':') {
      i++;
      continue;
    }
    j++;
    while (j < cleaned.length && /\s/.test(cleaned[j])) j++;

    const { value, end } = parseValueUntilSemicolon(cleaned, j);
    map.set(name, value);
    i = end;
  }

  return map;
}

const VAR_REF = /^\$[\w-]+$/;

/**
 * @param {string} s
 */
export function isBareVariableRef(s) {
  return VAR_REF.test(s.trim());
}

/**
 * Resolves a chain of variable references to a literal string or null.
 * @param {string} name without $
 * @param {Map<string, string>} rawMap
 * @param {Set<string>} [stack]
 * @returns {string | null}
 */
export function resolveVariableChain(name, rawMap, stack = new Set()) {
  if (stack.has(name)) return null;
  stack.add(name);
  const raw = rawMap.get(name);
  if (raw === undefined) return null;
  const trimmed = raw.trim();
  if (isBareVariableRef(trimmed)) {
    return resolveVariableChain(trimmed.slice(1), rawMap, stack);
  }
  return trimmed;
}

/**
 * @param {string} name without $
 * @param {Map<string, string>} rawMap
 */
export function resolveDisplay(name, rawMap) {
  const raw = rawMap.get(name)?.trim();
  if (raw === undefined) {
    return { immediateRef: null, resolved: null };
  }
  if (isBareVariableRef(raw)) {
    const refName = raw.slice(1);
    const resolved = resolveVariableChain(refName, rawMap, new Set());
    return { immediateRef: raw, resolved };
  }
  return { immediateRef: null, resolved: raw };
}

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_RE = /^rgba?\(/i;
const HSL_RE = /^hsla?\(/i;

const NAMED_COLORS = new Set([
  'transparent',
  'black',
  'white',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
]);

/**
 * @param {string | null} s
 */
export function isColorLiteral(s) {
  if (s == null || !s.length) return false;
  const t = s.trim();
  if (HEX_RE.test(t)) return true;
  if (RGB_RE.test(t) || HSL_RE.test(t)) return true;
  if (NAMED_COLORS.has(t.toLowerCase())) return true;
  return false;
}

const TYPO_NAME_RE = /font|typography|text-|line-height|letter-spacing|font-weight|weight|size|spacing|leading|tracking/i;

/**
 * @param {string} name
 * @param {string | null} resolved
 */
export function isTypographyLike(name, resolved) {
  if (resolved == null) return false;
  const t = resolved.trim();
  if (t.startsWith('(') && !t.startsWith('((')) return false;
  if (TYPO_NAME_RE.test(name)) return true;
  if (/\d+(?:\.\d+)?(?:px|rem|em|pt|%)/.test(t)) return true;
  if (/serif|sans|mono|system-ui|Arial|Helvetica|Georgia|Times|Menlo|Consolas/i.test(t)) {
    return true;
  }
  return false;
}

/**
 * Merges multiple file maps (later files override).
 * @param {Map<string, string>[]} maps
 */
export function mergeVariableMaps(maps) {
  const out = new Map();
  for (const m of maps) {
    for (const [k, v] of m) {
      out.set(k, v);
    }
  }
  return out;
}

/**
 * @param {Map<string, string>} rawMap
 */
/** Declarations we apply to the sample text (kebab-case). */
const TYPO_DECL_KEYS = new Set([
  'font',
  'font-size',
  'line-height',
  'font-weight',
  'font-family',
  'font-style',
  'font-variant',
  'letter-spacing',
  'text-transform',
  'font-feature-settings',
  'font-variation-settings',
]);

/**
 * Finds the index of the closing `}` that matches `{` at `openBraceIdx`.
 * @param {string} src
 * @param {number} openBraceIdx
 */
export function findMatchingBrace(src, openBraceIdx) {
  let depth = 1;
  let inString = null;
  let escape = false;

  for (let i = openBraceIdx + 1; i < src.length; i++) {
    const c = src[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === '\\' && inString !== '`') {
        escape = true;
      } else if (c === inString) {
        inString = null;
      }
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      continue;
    }

    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

/**
 * Parses `prop: value` pairs at brace depth 0 (skips nested `{ ... }`).
 * @param {string} body
 * @returns {Record<string, string>}
 */
export function parseDeclarationBlock(body) {
  /** @type {Record<string, string>} */
  const out = {};
  let i = 0;
  let depth = 0;
  let segStart = 0;
  let inString = null;
  let escape = false;

  const flush = (end) => {
    const seg = body.slice(segStart, end).trim();
    if (seg) applyDeclSegment(seg, out);
    segStart = end + 1;
  };

  while (i < body.length) {
    const c = body[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === '\\' && inString !== '`') {
        escape = true;
      } else if (c === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      i++;
      continue;
    }

    if (c === '{') {
      depth++;
      i++;
      continue;
    }
    if (c === '}') {
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }

    if (c === ';' && depth === 0) {
      flush(i);
      i++;
      continue;
    }

    i++;
  }

  const tail = body.slice(segStart).trim();
  if (tail) applyDeclSegment(tail, out);

  return out;
}

/**
 * @param {string} seg
 * @param {Record<string, string>} out
 */
function applyDeclSegment(seg, out) {
  const m = /^([\w-]+)\s*:\s*(.+)$/s.exec(seg.trim());
  if (!m) return;
  const prop = m[1].toLowerCase();
  let val = m[2].trim();
  val = val.replace(/;+\s*$/, '');
  if (TYPO_DECL_KEYS.has(prop)) {
    out[prop] = val;
  }
}

/**
 * Extracts `.class-name { ... }` rules whose body includes font/line declarations.
 * @param {string} src
 * @returns {Array<{ selector: string, properties: Record<string, string> }>}
 */
export function extractTypographyClassBlocks(src) {
  const cleaned = stripScssComments(src);
  /** @type {Array<{ selector: string, properties: Record<string, string> }>} */
  const out = [];
  let i = 0;
  let inString = null;
  let escape = false;

  while (i < cleaned.length) {
    const c = cleaned[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === '\\' && inString !== '`') {
        escape = true;
      } else if (c === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      i++;
      continue;
    }

    if (c !== '.') {
      i++;
      continue;
    }

    const prev = i === 0 ? '\n' : cleaned[i - 1];
    if (prev !== undefined && !/[\s\n{;]/.test(prev)) {
      i++;
      continue;
    }

    let j = i + 1;
    const idStart = j;
    while (j < cleaned.length && /[\w-]/.test(cleaned[j])) j++;
    if (j === idStart) {
      i++;
      continue;
    }

    const selector = cleaned.slice(i, j);
    let k = j;
    while (k < cleaned.length && /\s/.test(cleaned[k])) k++;
    if (cleaned[k] !== '{') {
      i++;
      continue;
    }

    const close = findMatchingBrace(cleaned, k);
    if (close === -1) break;

    const body = cleaned.slice(k + 1, close);
    const properties = parseDeclarationBlock(body);
    if (Object.keys(properties).length > 0) {
      out.push({ selector, properties });
    }

    i = close + 1;
  }

  return out;
}

export function buildTokenLists(rawMap) {
  /** @type {Array<{ name: string, immediateRef: string | null, resolved: string }>} */
  const colorTokens = [];
  /** @type {Array<{ name: string, immediateRef: string | null, resolved: string }>} */
  const typographyTokens = [];

  for (const name of rawMap.keys()) {
    const display = resolveDisplay(name, rawMap);
    const resolved = display.resolved;
    if (resolved == null) continue;

    const fullName = `$${name}`;
    const entry = {
      name: fullName,
      immediateRef: display.immediateRef,
      resolved,
    };

    if (isColorLiteral(resolved)) {
      colorTokens.push(entry);
    } else if (isTypographyLike(name, resolved)) {
      typographyTokens.push(entry);
    }
  }

  colorTokens.sort((a, b) => a.name.localeCompare(b.name));
  typographyTokens.sort((a, b) => a.name.localeCompare(b.name));

  return { colorTokens, typographyTokens };
}
