# json-wizard

```js
import { Json } from "json-wizard"

new Json("./package.json")
  .set('devDependencies.node', '20.0.0')
  .write()
  // or .write('./someOtherFinder')
```