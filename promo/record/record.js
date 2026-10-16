// 把 ../index.html 逐格截圖錄成影片（頁面用 ?record 開，之後由這裡呼叫 renderAt(t) 一格一格畫）
//   node record.js record [輸出.mp4]    錄影，預設輸出 ../PDF筆記-宣傳.mp4
//   node record.js shots 6.5 22 ...     截出指定秒數的畫面（shot-<秒>.png）
//   node record.js clicks               檢查每次點擊時游標尖端底下是哪個元素
// 瀏覽器：環境變數 CHROME 指定 chrome.exe；沒設就找 Playwright 下載的 Chromium（npx playwright-core install chromium）
const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const ffmpeg = require('ffmpeg-static');

const PROMO = path.resolve(__dirname, '..');
const url = pathToFileURL(path.join(PROMO, 'index.html')).href + '?record';
const [mode = 'record', ...args] = process.argv.slice(2);

// 要和 index.html 的 CLICKS 對應（另外加了拖曳的終點）
const CHECK = [8.58, 9.15, 11.95, 18.45, 19.0, 19.5, 20.2, 20.75, 21.2, 22.8, 24.1, 24.9, 25.55];

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  const dirs = fs.existsSync(base) ? fs.readdirSync(base).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => b.split('-')[1] - a.split('-')[1]) : [];
  for (const d of dirs) for (const sub of ['chrome-win64', 'chrome-win']) {
    const exe = path.join(base, d, sub, 'chrome.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return undefined; // 交給 playwright-core 自己找
}

(async () => {
  const browser = await chromium.launch({ executablePath: findChrome() });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('[頁面錯誤]', e.message));
  await page.goto(url);
  // 等 MathJax 和字型載完
  await page.waitForFunction(() => window.__ready, null, { timeout: 60000 });
  await page.waitForTimeout(300);

  if (mode === 'shots') {
    for (const t of args) {
      await page.evaluate(t => renderAt(t), +t);
      await page.screenshot({ path: path.join(__dirname, `shot-${t}.png`) });
      console.log(`shot-${t}.png`);
    }
  } else if (mode === 'clicks') {
    const rows = await page.evaluate(times => {
      document.querySelector('#cursor').style.pointerEvents = 'none';
      document.querySelector('#ripple').style.pointerEvents = 'none';
      return times.map(t => {
        renderAt(t);
        const r = document.querySelector('#cursor').getBoundingClientRect();
        // 游標箭頭尖端在 svg 的 (5, 3.1) / 30
        let el = document.elementFromPoint(r.left + r.width * 5 / 30, r.top + r.height * 3.1 / 30);
        const d = [];
        for (let i = 0; el && i < 3; i++, el = el.parentElement)
          d.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.dataset && el.dataset.k ? `[${el.dataset.k}]` : ''));
        return t.toFixed(2).padStart(6) + '  ' + d.join(' < ');
      });
    }, CHECK);
    console.log(rows.join('\n'));
  } else if (mode === 'record') {
    const out = path.resolve(args[0] || path.join(PROMO, 'PDF筆記-宣傳.mp4'));
    const fps = 30, total = await page.evaluate(() => window.TOTAL), N = Math.round(total * fps);
    const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < N; i++) {
      await page.evaluate(t => renderAt(t), i / fps);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`第 ${i} / ${N} 格`);
    }
    ff.stdin.end();
    const code = await new Promise(r => ff.on('close', r));
    console.log(code === 0 ? `完成：${out}` : `ffmpeg 失敗（${code}）`);
  } else {
    console.log('用法：node record.js record [輸出.mp4] | shots <秒數…> | clicks');
  }
  await browser.close();
})();
