import { Injectable } from '@angular/core';

export interface EmojiMapping {
  charToEmoji: Map<string, string>;
  emojiToChar: Map<string, string>;
}

// 英文數字字符集
const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// 運算符號
const OPERATORS = '+-*/=<>!@#$%^&()[]{}|;:,.';

// Emoji 池（優先表情、動物系列）
const EMOJI_POOL = [
  // 表情系列
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
  '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
  '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
  '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳',
  '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯',
  '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭',
  '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡',
  '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺',
  '👻', '👽', '👾', '🤖',
  // 動物系列
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨',
  '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊',
  '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉',
  '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌',
  '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷️', '🕸️', '🦂',
  '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀',
  '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
  '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒',
  '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙',
  '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜',
  '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥',
  '🐁', '🐀', '🐿️', '🦔',
  // 物件系列（備用）
  '💯', '🔥', '⭐', '🌟', '✨', '💫', '⚡', '💥', '💢', '💦',
  '💨', '🕳️', '💣', '💬', '👋', '🤚', '🖐️', '✋', '🖖', '👌',
  '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
  '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏',
];

@Injectable({
  providedIn: 'root'
})
export class EmojiCryptoService {
  private allChars: string;

  constructor() {
    // 組合所有需要映射的字符（不重複）
    // Base64 字符集 = A-Za-z0-9 + '+' + '/'
    this.allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  }

  /**
   * 用密碼生成 emoji mapping
   */
  generateMapping(password: string, salt: string = ''): EmojiMapping {
    // 用密碼 + salt 決定 shuffle 順序
    const seed = this.hashCode(password + salt);
    const emojis = this.shuffleArray([...EMOJI_POOL], seed);
    const chars = this.shuffleArray([...this.allChars], seed + 1);

    const charToEmoji = new Map<string, string>();
    const emojiToChar = new Map<string, string>();

    for (let i = 0; i < chars.length && i < emojis.length; i++) {
      charToEmoji.set(chars[i], emojis[i]);
      emojiToChar.set(emojis[i], chars[i]);
    }

    return { charToEmoji, emojiToChar };
  }

  /**
   * 加密：文字 -> emoji
   */
  encrypt(text: string, password: string, salt?: string): string {
    const mapping = this.generateMapping(password, salt);
    
    // 將文字轉換為 Base64（處理中文和其他字符）
    const base64 = btoa(unescape(encodeURIComponent(text)));
    
    // 將 Base64 字符合併成一個字串以便批量處理
    let result = '';
    
    for (const char of base64) {
      const emoji = mapping.charToEmoji.get(char);
      result += emoji || char; // 如果找不到就用原字符
    }
    
    return result;
  }

  /**
   * 解密：emoji -> 文字
   */
  decrypt(emojiText: string, password: string, salt?: string): string | null {
    try {
      const mapping = this.generateMapping(password, salt);
      
      // 將 emoji 逐個轉回 Base64 字元
      // 需要正確分割 emoji（每個 emoji 可能是 1-4 個 code point）
      const base64Chars: string[] = [];
      const iterator = emojiText[Symbol.iterator]();
      let currentCodePoint = '';
      
      // 簡化處理：假設每個 emoji 都是單一字符
      // 實際上複雜 emoji 需要更好的分割邏輯
      for (const char of emojiText) {
        const original = mapping.emojiToChar.get(char);
        if (original) {
          base64Chars.push(original);
        } else if (char.trim()) {
          // 非空白字符但找不到對應，密碼可能錯誤
          return null;
        }
      }
      
      const base64 = base64Chars.join('');
      
      // Base64 -> 原始文字
      const decoded = decodeURIComponent(escape(atob(base64)));
      return decoded;
    } catch {
      return null; // 解密失敗（密碼錯誤）
    }
  }

  /**
   * 簡單 hash function
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉為 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * 用 seed 進行確定性 shuffle
   */
  private shuffleArray<T>(array: T[], seed: number): T[] {
    const result = [...array];
    let currentSeed = seed;
    
    for (let i = result.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
      const j = currentSeed % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
  }

  /**
   * 驗證密碼是否正確（通過嘗試解密）
   */
  validatePassword(emojiText: string, password: string, salt?: string): boolean {
    return this.decrypt(emojiText, password, salt) !== null;
  }

  /**
   * 生成隨機 salt
   */
  generateSalt(): string {
    return Math.random().toString(36).substring(2, 10);
  }
}
