import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmojiCryptoService } from '../../services/emoji-crypto.service';
import { EmojiEncryptPipe } from '../../pipes/emoji-encrypt.pipe';
import { EmojiDecryptPipe } from '../../pipes/emoji-decrypt.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiEncryptPipe, EmojiDecryptPipe],
  template: `
    <div class="container">
      <header>
        <h1>😂😜😭 Emoji Crypto 🐷🐮🐥</h1>
        <p class="subtitle">將文字加密成 emoji 表情符號</p>
      </header>

      <div class="mode-toggle">
        <button 
          [class.active]="mode === 'encrypt'"
          (click)="mode = 'encrypt'"
        >
          🔒 加密
        </button>
        <button 
          [class.active]="mode === 'decrypt'"
          (click)="mode = 'decrypt'"
        >
          🔓 解密
        </button>
      </div>

      <div class="input-section">
        <div class="label-row">
          <label>{{ mode === 'encrypt' ? '輸入文字' : '輸入 Emoji' }}</label>
          @if (mode === 'encrypt') {
            <span class="char-count" [class.overLimit]="inputText.length > 500">
              {{ inputText.length }}/500
            </span>
          }
        </div>
        <div class="input-wrapper">
          <textarea
            [(ngModel)]="inputText"
            (ngModelChange)="onInputChange()"
            [placeholder]="mode === 'encrypt' ? '輸入要加密的文字...' : '貼上要解密的 emoji...'"
            rows="4"
          ></textarea>
          @if (inputText) {
            <button class="btn-clear" (click)="clearInput()">✕</button>
          }
        </div>
        @if (mode === 'encrypt' && inputText.length > 500) {
          <p class="warning">⚠️ 超過500字元，解密可能失敗</p>
        }
      </div>

      <div class="password-section">
        <div class="label-row">
          <label>自訂密碼</label>
          <span class="char-count">{{ password.length }}/20</span>
        </div>
        <div class="password-wrapper">
          <input
            [type]="showPassword ? 'text' : 'password'"
            [(ngModel)]="password"
            (ngModelChange)="onPasswordChange()"
            placeholder="輸入密碼..."
            maxlength="20"
          />
          <button class="btn-toggle-password" (click)="togglePassword()">
            {{ showPassword ? '隱藏' : '顯示' }}
          </button>
        </div>
      </div>

      <div class="action-section">
        <button 
          class="btn-primary"
          (click)="process()"
          [disabled]="!inputText || !password || (mode === 'encrypt' && inputText.length > 500)"
        >
          {{ mode === 'encrypt' ? '🔒 加密' : '🔓 解密' }}
        </button>
      </div>

      @if (result) {
        <div class="result-section">
          <label>結果</label>
          <div class="result-box">
            <p class="result-text">{{ mode === 'encrypt' ? (inputText | emojiEncrypt:password) : (inputText | emojiDecrypt:password) }}</p>
          </div>
          <button 
            class="btn-copy" 
            [class.copied]="copied"
            (click)="copyResult()"
          >
            {{ copied ? '✓ 已複製' : '📋 複製' }}
          </button>
        </div>
      }

      @if (error) {
        <div class="error-message">
          ❌ {{ error }}
        </div>
      }

      <div class="disclaimer">
        <p>⚠️ 注意事項</p>
        <ul>
          <li>本應用為興趣/示範用途，不適合加密機密文件</li>
          <li>加密算法為簡單替換密碼，專家用工具可破解</li>
          <li>適合 WhatsApp 群組等場景的簡單隱私保護</li>
          <li>請勿用作重要密碼或敏感資料加密</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }

    .subtitle {
      color: #666;
      margin-top: 0.5rem;
    }

    .mode-toggle {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      background: #f5f5f5;
      padding: 0.5rem;
      border-radius: 0.75rem;
    }

    .mode-toggle button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      background: transparent;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .mode-toggle button.active {
      background: #6366f1;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .input-section,
    .password-section,
    .result-section {
      margin-bottom: 1.5rem;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    label {
      font-weight: 500;
      color: #333;
    }

    .char-count {
      font-size: 0.75rem;
      color: #666;
    }

    .char-count.overLimit {
      color: #dc2626;
      font-weight: 600;
    }

    textarea,
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      box-sizing: border-box;
    }

    textarea:focus,
    input:focus {
      outline: none;
      border-color: #6366f1;
    }

    textarea.overLimit,
    input.overLimit {
      border-color: #dc2626;
    }

    .warning {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .action-section {
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .result-box {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .result-text {
      margin: 0;
      word-break: break-all;
      font-size: 1.25rem;
      line-height: 1.5;
    }

    .btn-copy {
      padding: 0.5rem 1rem;
      background: #e5e5e5;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-copy:hover {
      background: #d5d5d5;
    }

    .password-wrapper {
      position: relative;
    }

    .password-wrapper input {
      padding-right: 2.5rem;
    }

    .btn-toggle-password {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: #e5e5e5;
      cursor: pointer;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .btn-toggle-password:hover {
      background: #d5d5d5;
    }

    .btn-copy.copied {
      background: #22c55e;
      color: white;
    }

    .input-wrapper {
      position: relative;
    }

    .input-wrapper textarea {
      padding-right: 2.5rem;
    }

    .btn-clear {
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border: none;
      background: #ddd;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-clear:hover {
      background: #ccc;
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #dc2626;
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .disclaimer {
      margin-top: 2rem;
      padding: 1rem;
      background: #fef3c7;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      color: #92400e;
    }

    .disclaimer p {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }

    .disclaimer ul {
      margin: 0;
      padding-left: 1.25rem;
    }

    .disclaimer li {
      margin-bottom: 0.25rem;
    }

    @media (max-width: 640px) {
      .container {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class HomeComponent {
  mode: 'encrypt' | 'decrypt' = 'encrypt';
  inputText = '';
  password = '';
  showPassword = false;
  result = false;
  error = '';
  copied = false;

  constructor(private crypto: EmojiCryptoService) {
    // Load saved password from localStorage
    const saved = localStorage.getItem('emoji-crypto-password');
    if (saved) this.password = saved;
  }

  onInputChange() {
    this.copied = false;
    this.error = '';
  }

  onPasswordChange() {
    // Limit password to 20 characters
    if (this.password.length > 20) {
      this.password = this.password.substring(0, 20);
    }
    // Save password to localStorage
    if (this.password) {
      localStorage.setItem('emoji-crypto-password', this.password);
    } else {
      localStorage.removeItem('emoji-crypto-password');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  clearInput() {
    this.inputText = '';
    this.result = false;
    this.error = '';
    this.copied = false;
  }

  process() {
    this.error = '';
    this.result = false;

    if (!this.inputText || !this.password) {
      this.error = '請輸入文字和密碼';
      return;
    }

    if (this.inputText.length > 500) {
      this.error = '輸入文字太長，建議少於500字元';
      return;
    }

    if (this.mode === 'decrypt') {
      const decrypted = this.crypto.decrypt(this.inputText, this.password);
      if (!decrypted) {
        this.error = '❌ 解密失敗，請確認密碼是否正確';
        return;
      }
    }

    this.result = true;
  }

  copyResult() {
    const text = this.mode === 'encrypt'
      ? this.crypto.encrypt(this.inputText, this.password)
      : this.crypto.decrypt(this.inputText, this.password);
    
    if (!text) return;

    // Use the modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      }).catch((err) => {
        console.error('Clipboard API failed:', err);
        // Fallback
        this.copyWithExecCommand(text);
      });
    } else {
      // Fallback for older browsers
      this.copyWithExecCommand(text);
    }
  }

  private copyWithExecCommand(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    } catch (err) {
      console.error('execCommand copy failed:', err);
      this.copied = false;
    }
    document.body.removeChild(textArea);
  }
}
