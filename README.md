# Buffer functions for Bitcoin applications

## Installation

`npm install bitcoin-buffer

## Example

```javascript
var utils = require('bitcoin-buffer')

var buf = new Buffer(8)

utils.writeUInt64LE(buf, 1, 0)
// buf = 0100000000000000

utils.writeVarInt(buf, 0xffffff, 0)
// buf = feffffff00
```

## API

### writeUInt64LE(buf, value, offset)

### readUInt64LE(buf, offset)

### writeVarInt(buf, value, offset)

### readVarInt(buf, offset)
returns an object of this format `{ res: value, offset: offset }`
