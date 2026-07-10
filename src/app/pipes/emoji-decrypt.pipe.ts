import { Pipe, PipeTransform } from '@angular/core';
import { EmojiCryptoService } from '../services/emoji-crypto.service';

@Pipe({
  name: 'emojiDecrypt',
  standalone: true
})
export class EmojiDecryptPipe implements PipeTransform {
  constructor(private crypto: EmojiCryptoService) {}

  transform(emojiText: string, password: string, salt?: string): string {
    if (!emojiText || !password) return emojiText;
    const result = this.crypto.decrypt(emojiText, password, salt);
    return result || '❌ 解密失敗';
  }
}
