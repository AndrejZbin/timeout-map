# Install

```sh
npm install @gfxpulse/timeout-map
```


# Example

```js
const TimeoutMap = require('@gfxpulse/timeout-map');

let map = new TimeoutMap([['key1', 'value1']], {
    autodelete: true,
    timeout: 5000,
    margin: 100,
    additional_arguments: ['some argument'],
    handler: function (key, value, map, additional_argument1) {
        console.log(`${key}: ${value} - ${additional_argument1}`);
        console.log(`${key} in map - ${map.has(key)}`);
    }
});

map.set('key2', 'value2', {
    autodelete: false,
});
```
Output:
```
key1: value1 - some argument
key1 in map - false
key2: value2 - some argument
key2 in map - true
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autodelete` | `bool` | `true` | Key automatically deleted from map before handler is called |
| `timeout` | `int` | `null` | How long until handler is called (null = never) |
| `margin` | `int` | `0` | Minimum time interval between set of handler calls |
| `additional_arguments` | `array` | `[]` | Additional arguments passed to handler |
| `handler` | `Function` | `(key, value, map) => {}` | Function called after timeout. Key, value, map and additional arguments are passed as parameters |
