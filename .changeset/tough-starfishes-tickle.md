---
"@apollo/graphql-testing-library": patch
---

Use 50ms as the delay value in Node processes, since 20ms was still resulting in occasional batched renders.
