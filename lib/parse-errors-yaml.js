const fs = require('fs')
module.exports = {
  load (filename) {
    const manifest = fs.readFileSync(filename, 'utf8')
    let map = {}
    let key
    const lines = manifest.split('\n')
    for (const line of lines) {
        // Parse: E100: This is error message
        if (/^\S/.test(line)) {
            let parts = line.split(':')
            key = parts[0]
            if (parts[1]) map[key] = parts[1].trim()
        }
        // Parse:
        // E100:
        //   message: This is error message
        if (/^\s+message:/.test(line)) {
            let parts = line.split(':')
            if (parts[1]) map[key] = parts[1].trim()
        }
    }
    return map
  },
  append (filename, code, message) {
    let manifest = fs.readFileSync(filename, 'utf8').trim()
    manifest += `\n${code}: ${message}\n`
    fs.writeFileSync(filename, manifest, 'utf8')
  }
}
