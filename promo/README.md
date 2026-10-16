# 宣傳動畫

- `index.html`：動畫本體，直接用瀏覽器開會一直循環播放。
  - `?t=12.5` 停在第 12.5 秒的畫面
  - `?record` 只畫第 0 秒，讓錄影程式一格一格控制
- `PDF筆記-宣傳*.mp4`：錄好的影片（1920×1080、30fps）
- `record/`：錄影程式

## 重新錄影

需要 Node.js（18 以上）。第一次先安裝：

```bash
cd promo/record
npm install
node node_modules/ffmpeg-static/install.js
npx playwright-core install chromium
```

`ffmpeg-static` 的安裝腳本會被 npm 擋住，所以要自己跑第二行把 ffmpeg 下載下來；已經有 Playwright 的 Chromium 的話，第三行可以省略。

錄影（輸出到 `promo/PDF筆記-宣傳.mp4`，可以在後面加檔名改輸出位置）：

```bash
node record.js record
```

約 1000 多格，幾分鐘就錄完。原理是用無頭 Chromium 開 `index.html?record`，每一格呼叫 `renderAt(t)` 再截圖，送進 ffmpeg 壓成 H.264，所以畫面不會掉格，每次錄出來都一樣。

## 改動畫時順便檢查

```bash
node record.js shots 6.5 20 29.5
node record.js clicks
```

- `shots`：把指定秒數截成 `record/shot-<秒>.png`，不用整支重錄就能看畫面。
- `clicks`：列出每次點擊時游標尖端下面的元素，確認有點在按鈕上（例如 `div[text] < div < div#win` 就是點到「文字」按鈕）。

游標要點的按鈕位置是開頁時從實際排版量出來的（`index.html` 裡的 `buildCursor()`），所以改工具列不用手動調座標；但如果改了時間軸，`index.html` 的 `CLICKS` 和 `record.js` 的 `CHECK` 要一起改。
