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
    
    // 移除 Base64 填充字符 '='，解密時唔需要
    const base64Clean = base64.replace(/=+$/, '');
    
    // 將 Base64 字符合併成一個字串以便批量處理
    let result = '';
    
    for (const char of base64Clean) {
      const emoji = mapping.charToEmoji.get(char);
      result += emoji || char;
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
      
      // 正確分割 emoji（處理多字符 emojis）
      const emojis = this.splitEmojis(emojiText);
      
      for (const emoji of emojis) {
        const original = mapping.emojiToChar.get(emoji);
        if (original) {
          base64Chars.push(original);
        } else if (emoji.trim()) {
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
   * 將 emoji 文字正確分割為單個 emoji 陣列
   * 處理多字符 emojis（ZWJ 序列、肌膚色修飾、旗幟等）
   */
  private splitEmojis(text: string): string[] {
    const emojis: string[] = [];
    
    // 使用 Intl.Segmenter（現代瀏覽器）
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        const segments = segmenter.segment(text);
        for (const segment of segments) {
          if (segment.segment.trim()) {
            emojis.push(segment.segment);
          }
        }
        return emojis;
      } catch {
        // Fallback to regex approach
      }
    }
    
    // Fallback：正則表達式匹配完整 emoji
    const emojiRegex = /(?:[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}])+(?:\u{FE0F}\u{20E3}|[\u{FE0F}]|[\u{200D}][\u{1F300}-\u{1F9FF}][\u{FE0F}]?|[\u{1F3FB}-\u{1F3FF}])*|[\p{Emoji_Presentation}=\p{Emoji}]+/gu;
    
    const matches = text.match(emojiRegex);
    if (matches) {
      return matches;
    }
    
    // 最後 fallback：按字符拆分
    return [...text];
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
