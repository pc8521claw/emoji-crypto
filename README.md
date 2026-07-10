# 😂😜😭 Emoji Crypto 🐷🐮🐥

將文字加密成 emoji 表情符號，增加趣味性！

🔗 **Live Demo:** https://emoji-crypto-nu.vercel.app/

---

## 📌 重點功能

| 功能 | 說明 |
|------|------|
| 🔒 文字 → Emoji | 輸入文字 + 密碼，加密成 Emoji |
| 🔓 Emoji → 文字 | 輸入 Emoji + 密碼，解密回原始文字 |
| 🔐 密碼保護 | 密碼打亂 Emoji 排序，增加破解難度 |
| 💾 密碼記憶 | 密碼自動存入 localStorage |
| 📋 一鍵複製 | 加密/解密結果一鍵複製到剪貼簿 |
| 📱 響應式設計 | 支援桌面和手機 |

---

## 📖 詳細功能說明

### 加密模式
- 輸入要加密的文字
- 輸入密碼（將用於打亂 Emoji 映射）
- 點擊「加密」按鈕
- 複製生成的 Emoji 字符串

### 解密模式
- 切換到「解密」模式
- 貼上加密的 Emoji 字符串
- 輸入加密時使用的密碼
- 點擊「解密」按鈕
- 如密碼正確，顯示原始文字

### 加密原理
1. **文字 → Base64** - 將中文字、其他字符轉換為 Base64
2. **Base64 → Emoji** - 根據密碼生成的映射表替換為 Emoji
3. **密碼打亂** - 不同密碼產生不同 Emoji 排序

---

## 🛠 技術棧

| 技術 | 用途 |
|------|------|
| **Angular 19** | 前端框架 |
| **TypeScript** | 程式語言 |
| **Standalone Components** | 無需 NgModule |
| **Standalone Pipes** | 可复用的轉換管道 |
| **Service (DI)** | 核心加密邏輯 |
| **localStorage** | 密碼持久化 |
| **Vercel** | 靜態網站托管 |

---

## 🏗 架構

```
emoji-crypto/
├── src/app/
│   ├── services/
│   │   └── emoji-crypto.service.ts   ← 核心加密/解密邏輯
│   ├── pipes/
│   │   ├── emoji-encrypt.pipe.ts     ← 加密管道
│   │   └── emoji-decrypt.pipe.ts     ← 解密管道
│   ├── pages/home/
│   │   └── home.component.ts         ← UI 頁面
│   └── app.ts                        ← 根組件
└── dist/emoji-crypto/                ← 建構輸出
```

### 核心服務 (EmojiCryptoService)

```typescript
// 生成密碼映射表
generateMapping(password: string, salt?: string): EmojiMapping

// 加密：文字 → Emoji
encrypt(text: string, password: string, salt?: string): string

// 解密：Emoji → 文字
decrypt(emojiText: string, password: string, salt?: string): string | null
```

### Standalone Pipes

```typescript
// Template 中使用
{{ text | emojiEncrypt:password }}
{{ emoji | emojiDecrypt:password }}
```

---

## 🎨 Emoji 庫

優先使用表情和動物系列 Emoji：

- **表情系列** 😀 😃 😄 😁 😆 😅 🤣 😂 😊 🥰 😍
- **動物系列** 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵
- **備用物件** 💯 🔥 ⭐ ✨ ⚡ 💥 💬 👋 👍

---

## ⚠️ 注意事項

- 本應用為興趣/示範用途，不適合加密機密文件
- 加密算法為簡單替換密碼，專家用工具可破解
- 適合 WhatsApp 群組等場景的簡單隱私保護
- 請勿用作重要密碼或敏感資料加密

---

## 📝 License

MIT License
