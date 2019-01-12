# TechKids Edu Rabbit Queue
## User guide
### Connect
```

import { connect as tkQueueConnect } from 'tk-queue';
tkQueueConnect(rabbitConfig.USERNAME, rabbitConfig.PASSWORD, rabbitConfig.HOST, rabbitConfig.PORT);

```

### Producer
```
import { RbProducer } from 'tk-queue';
// Initialize
const rbUserProducer = RbProducer('user');

// Send message
rbUserProducer('upsert', <new user data>);
```

### Consumer
```
// Initialize
import { RbConsumer } from 'tk-queue';

const rbUserConsumer = new RbConsumer(
  "tk-lm",
  "user",
  (data) => new Promise((resolve, reject) => {
    // Upsert user here
    resolve();
  }),
  (_id) => new Promise((resolve, reject) => {
    // Delete user here
    resolve();
  })
//
```

## Developer guide
### Develop
`index.ts`: The whole lib
### Publish
- Change version in [package.json](package.json) file:
```
{
  "name": "tk-queue",
  "version": "x.x.x",
  ...
}
```
- Build
`npm run build`

- Publish
`npm publish`