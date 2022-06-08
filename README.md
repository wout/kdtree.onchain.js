# kdtree.onchain.js
A micro JS library (820 bytes) for building K-Dimensional Trees with N-Nearest
Neighbours search.

This library is intended for use in environments where the available storage
space is very limited; like blockchains for example. Everything is stripped down
to the bare essentials.

![GitHub](https://img.shields.io/github/license/onchainjs/kdtree.onchain.js)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/onchainjs/kdtree.onchain.js)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/onchainjs/kdtree.onchain.js/kdtree.onchain.js%20CI)

## Usage
Build a new kd-tree from an arbitrary number of points:

```js
let tree = KdT.ree([
  [2, 3],
  [5, 4],
  [4, 7],
  [7, 2],
  [8, 1],
  [9, 6],
])
```

Then query the nearest point:

```js
tree.near([1, 1])
// [[2, 3]]
```

Or the n-nearest points:

```js
tree.near([1, 1], 2)
// [[2, 3], [5, 4]]
```

Build a tree with points of any dimension, as long as the dimensions of the
points are all the same:

```js
tree = KdT.ree([
  [2.0, 3.0, 0.0],
  [5.0, 4.0, 0.0],
  [4.0, 7.0, 0.0],
  [7.0, 2.0, 0.0],
  [8.0, 1.0, 0.0],
  [9.0, 6.0, 0.1],
])
```

Querying the nearest should also be done with a point of the same dimension:

```js
tree.near([1, 1, 1])
// [[2, 3, 0]]
```

## License
kdtree.onchain.js is licensed under the terms of the MIT License.
