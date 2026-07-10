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
        <label>{{ mode === 'encrypt' ? '輸入文字' : '輸入 Emoji' }}</label>
        <div class="input-wrapper">
          <textarea
            [(ngModel)]="inputText"
            (ngModelChange)="copied = false"
            [placeholder]="mode === 'encrypt' ? '輸入要加密的文字...' : '貼上要解密的 emoji...'"
            rows="4"
          ></textarea>
          @if (inputText) {
            <button class="btn-clear" (click)="clearInput()">✕</button>
          }
        </div>
      </div>

      <div class="password-section">
        <label>密碼</label>
        <div class="password-wrapper">
          <input
            [type]="showPassword ? 'text' : 'password'"
            [(ngModel)]="password"
            (ngModelChange)="onPasswordChange()"
            placeholder="輸入密碼..."
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
          [disabled]="!inputText || !password"
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

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
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

  onPasswordChange() {
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

    if (this.mode === 'decrypt') {
      const decrypted = this.crypto.decrypt(this.inputText, this.password);
      if (!decrypted) {
        this.error = '❌ 解密失敗，請確認密碼是否正確';
        return;
      }
    }

    this.result = true;
  }

  async copyResult() {
    const text = this.mode === 'encrypt'
      ? this.crypto.encrypt(this.inputText, this.password)
      : this.crypto.decrypt(this.inputText, this.password);
    
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      }
    }
  }
}
