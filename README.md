# PDF 筆記

在瀏覽器裡直接幫 PDF 加筆記：打字、LaTeX 數學公式、直線、螢光筆、矩形、貼圖片，存回原本的檔案。

**👉 立即使用：https://itssswilly.github.io/pdf-note/**

不用安裝、不用註冊。**PDF 只在你的瀏覽器裡處理，不會上傳到任何地方。**

## 功能

- **文字筆記**：在頁面任何位置點一下就能打字，可調整大小與顏色
- **LaTeX 公式**：`$x^2$` 行內公式、`$$\int_0^1 f(x)\,dx$$` 獨立公式
- **直線與螢光筆**：畫重點；按住 Shift 鎖定角度或畫直線
- **矩形**：拉出白、黑或螢光色的色塊，可以蓋掉不要的地方，或當便條在上面打字
- **貼上圖片**：截圖後 `Ctrl+V`，圖片會貼在滑鼠位置
- **框選截圖**：在空白處拖曳框選，一鍵把該區域（含筆記）複製成高解析度圖片
- **直接存檔**：`Ctrl+S` 存回原本的 PDF，不用每次另存新檔
- **可繼續編輯**：重新開啟存過的 PDF，筆記還能移動、修改
- **平滑縮放**：`Ctrl` + 滾輪或觸控板捏合，以游標為中心縮放
- **完全離線**：整個工具就是一個 HTML 檔，下載後沒有網路也能用

## 快捷鍵

| 動作 | 按鍵 |
|---|---|
| 選取／移動 | `V` |
| 文字 | `T` |
| 直線 | `L` |
| 螢光筆 | `H` |
| 矩形 | `B` |
| 儲存／另存新檔 | `Ctrl+S` ／ `Ctrl+Shift+S` |
| 復原／取消復原 | `Ctrl+Z` ／ `Ctrl+Y` |
| 縮放 | `Ctrl` + 滾輪、`Ctrl +` ／ `Ctrl −` |
| 刪除 | `Delete` |

> 建議使用 Chrome 或 Edge：「直接存回原檔」需要這兩個瀏覽器支援的檔案存取功能。其他瀏覽器會改成下載新檔案。

## 開源授權

本工具內嵌了以下開源函式庫，感謝這些專案：

| 函式庫 | 用途 | 授權 |
|---|---|---|
| [PDF.js](https://github.com/mozilla/pdf.js)（Mozilla，v3.11.174） | 顯示 PDF | Apache License 2.0 |
| [pdf-lib](https://github.com/Hopding/pdf-lib) | 產生與儲存 PDF | MIT License |
| [MathJax](https://github.com/mathjax/MathJax) | 顯示 LaTeX 公式 | Apache License 2.0 |
| Adobe CMap 資源（隨 PDF.js 提供） | 顯示中日韓文字 PDF | BSD-3-Clause |

各函式庫的完整授權條款請見其原始專案。
