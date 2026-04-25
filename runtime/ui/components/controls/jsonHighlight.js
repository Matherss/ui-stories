/**
 * Escape for safe insertion into HTML (outside of text nodes we still only
 * place escaped content inside spans).
 */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Lenient JSON-like syntax highlighting for editor backdrop (invalid / partial
 * input is still colored token-by-token).
 */
export function highlightJson(code) {
  const n = code.length;
  let i = 0;
  let out = '';

  while (i < n) {
    const c = code[i];

    if (c === ' ' || c === '\n' || c === '\r' || c === '\t') {
      let j = i;
      while (j < n && /[\s]/.test(code[j])) j++;
      out += `<span class="uis-json__ws">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    if ('{}[],:'.includes(c)) {
      out += `<span class="uis-json__punct">${escapeHtml(c)}</span>`;
      i++;
      continue;
    }

    if (c === '"') {
      let j = i + 1;
      while (j < n) {
        if (code[j] === '\\') {
          j += 2;
          continue;
        }
        if (code[j] === '"') {
          j++;
          break;
        }
        j++;
      }
      out += `<span class="uis-json__string">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    if (c === '-' || (c >= '0' && c <= '9')) {
      let j = i;
      if (code[j] === '-') j++;
      while (j < n && code[j] >= '0' && code[j] <= '9') j++;
      if (code[j] === '.') {
        j++;
        while (j < n && code[j] >= '0' && code[j] <= '9') j++;
      }
      if (code[j] === 'e' || code[j] === 'E') {
        j++;
        if (code[j] === '+' || code[j] === '-') j++;
        while (j < n && code[j] >= '0' && code[j] <= '9') j++;
      }
      out += `<span class="uis-json__number">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    if (c >= 'a' && c <= 'z') {
      let j = i;
      while (j < n && code[j] >= 'a' && code[j] <= 'z') j++;
      const word = code.slice(i, j);
      const kw = word === 'true' || word === 'false' || word === 'null';
      out += kw
        ? `<span class="uis-json__keyword">${escapeHtml(word)}</span>`
        : `<span class="uis-json__plain">${escapeHtml(word)}</span>`;
      i = j;
      continue;
    }

    out += `<span class="uis-json__plain">${escapeHtml(c)}</span>`;
    i++;
  }

  return out;
}