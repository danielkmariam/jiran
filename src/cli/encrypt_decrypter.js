const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const key = '7b{7Y8R#>8UPheVs2%Yx{Dxwh9MAVzwvV'

class EncryptDecrypter {
  encrypt (text) {
    let cipher = crypto.createCipher(algorithm, key)
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  }

  decrypt (text) {
    let decipher = crypto.createDecipher(algorithm, key)
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')
  }
}

module.exports = new EncryptDecrypter()
