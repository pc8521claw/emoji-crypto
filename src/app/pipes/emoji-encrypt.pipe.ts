import { Pipe, PipeTransform } from '@angular/core';
import { EmojiCryptoService } from '../services/emoji-crypto.service';

@Pipe({
  name: 'emojiEncrypt',
  standalone: true
})
export class EmojiEncryptPipe implements PipeTransform {
  constructor(private crypto: EmojiCryptoService) {}

  transform(text: string, password: string, salt?: string): string {
    if (!text || !password) return text;
    return this.crypto.encrypt(text, password, salt);
  }
}
