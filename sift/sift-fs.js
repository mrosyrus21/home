// Sift — real file-system access: scan a folder, build review items,
// move files on disk (File System Access API), or emit a .bat fallback script.
window.SiftFS = (function () {
  const IMG_RE = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;
  const SKIP = { 'sorted': 1, '_trash': 1, 'archive': 1 };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MAX_FILES = 1500;
  const STACK_MS = 4000; // shots within 4s of each other = burst / near-dupes

  function toPhoto(f) {
    const url = URL.createObjectURL(f.file);
    const d = new Date(f.mtime);
    const mName = MONTHS[d.getMonth()];
    return {
      id: f.path,
      src: url,
      thumb: url,
      name: f.name,
      date: d.getDate() + ' ' + mName.slice(0, 3) + ' ' + d.getFullYear(),
      month: mName + ' ' + d.getFullYear(),
      sortKey: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
      meta: (f.size >= 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB'),
      _file: f
    };
  }

  function buildItems(files) {
    files.sort(function (a, b) { return a.path < b.path ? -1 : 1; });
    const items = [];
    let i = 0;
    while (i < files.length) {
      const group = [files[i]];
      while (i + group.length < files.length && group.length < 6) {
        const next = files[i + group.length];
        const prev = group[group.length - 1];
        if (next.dir === prev.dir && Math.abs(next.mtime - prev.mtime) <= STACK_MS) group.push(next);
        else break;
      }
      if (group.length > 1) items.push({ id: 'st-' + group[0].path, kind: 'stack', photos: group.map(toPhoto) });
      else items.push({ id: group[0].path, kind: 'photo', photos: [toPhoto(group[0])] });
      i += group.length;
    }
    return items;
  }

  function finishLib(name, handle, files, mode) {
    const items = buildItems(files);
    return {
      source: mode, name: name, handle: handle, items: items,
      allPhotos: items.reduce(function (acc, it) { return acc.concat(it.photos); }, [])
    };
  }

  // ---- FSA mode (Chrome / Edge): full read-write ----
  async function scanDir(dir, path, out, depth) {
    for await (const entry of dir.values()) {
      if (out.length >= MAX_FILES) return;
      if (entry.kind === 'directory') {
        if (depth < 3 && !SKIP[entry.name.toLowerCase()]) await scanDir(entry, path + entry.name + '/', out, depth + 1);
      } else if (IMG_RE.test(entry.name)) {
        const file = await entry.getFile();
        out.push({ path: path + entry.name, name: entry.name, dir: path, file: file, handle: entry, parent: dir, mtime: file.lastModified, size: file.size });
      }
    }
  }

  async function pickFolder() {
    const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
    const out = [];
    await scanDir(dir, '', out, 0);
    return finishLib(dir.name, dir, out, 'fs');
  }

  // ---- Fallback mode (any browser): read-only + .bat script ----
  function fromFileList(fileList) {
    const files = [];
    let root = 'folder';
    for (let i = 0; i < fileList.length && files.length < MAX_FILES; i++) {
      const file = fileList[i];
      const rel = file.webkitRelativePath || file.name;
      const parts = rel.split('/');
      if (parts.length > 1) { root = parts[0]; parts.shift(); }
      const path = parts.join('/');
      const top = (parts[0] || '').toLowerCase();
      if (!IMG_RE.test(path) || SKIP[top]) continue;
      files.push({
        path: path, name: parts[parts.length - 1],
        dir: parts.slice(0, -1).join('/') + (parts.length > 1 ? '/' : ''),
        file: file, handle: null, parent: null, mtime: file.lastModified, size: file.size
      });
    }
    return finishLib(root, null, files, 'plan');
  }

  // ---- Apply: physically move files (copy + delete original) ----
  async function ensureDir(root, pathStr) {
    let d = root;
    const segs = pathStr.split('/');
    for (let i = 0; i < segs.length; i++) d = await d.getDirectoryHandle(segs[i], { create: true });
    return d;
  }

  async function applyMoves(root, moves, onProgress) {
    const result = { moved: 0, failed: [] };
    const dirCache = {};
    for (let i = 0; i < moves.length; i++) {
      const m = moves[i];
      if (onProgress) onProgress(i + 1, moves.length);
      try {
        const f = m.photo._file;
        if (!(m.dest in dirCache)) dirCache[m.dest] = await ensureDir(root, m.dest);
        const destDir = dirCache[m.dest];
        let destName = f.name;
        try { await destDir.getFileHandle(destName); destName = destName.replace(/(\.[^.]+)?$/, function (ext) { return '-' + Date.now() % 10000 + (ext || ''); }); } catch (e) { /* free */ }
        const srcFile = await f.handle.getFile();
        const writable = await (await destDir.getFileHandle(destName, { create: true })).createWritable();
        await srcFile.stream().pipeTo(writable);
        await f.parent.removeEntry(f.name);
        result.moved++;
      } catch (e) {
        result.failed.push(m.photo.name + ' (' + (e && e.message ? e.message.slice(0, 60) : 'error') + ')');
      }
    }
    return result;
  }

  // ---- Fallback: generate a Windows .bat that performs the same moves ----
  function buildBatScript(moves) {
    const lines = ['@echo off', 'chcp 65001 >nul', 'cd /d "%~dp0"', 'echo Sift organize script — moving ' + moves.length + ' files...'];
    const dirs = {};
    moves.forEach(function (m) { dirs[m.dest] = 1; });
    Object.keys(dirs).forEach(function (d) { lines.push('if not exist "' + d.replace(/\//g, '\\') + '" mkdir "' + d.replace(/\//g, '\\') + '"'); });
    moves.forEach(function (m) {
      lines.push('move /Y "' + m.photo._file.path.replace(/\//g, '\\') + '" "' + m.dest.replace(/\//g, '\\') + '\\" >nul && echo   moved ' + m.photo.name);
    });
    lines.push('echo Done.', 'pause');
    return lines.join('\r\n');
  }

  function downloadText(text, filename) {
    const blob = new Blob([text], { type: 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return {
    supported: !!window.showDirectoryPicker,
    pickFolder: pickFolder,
    fromFileList: fromFileList,
    applyMoves: applyMoves,
    buildBatScript: buildBatScript,
    downloadText: downloadText
  };
})();
