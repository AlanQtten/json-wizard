# json-wizard

```js
import { Json } from "json-wizard"

let json = new Json("./package.json")
json.set('devDependencies.node', '20.0.0')
json.write()
```