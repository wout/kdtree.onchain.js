import {KdTree} from '../kdtree.onchain.js'

describe('KdTree', () => {
  const k2points = [
    [2, 3],
    [5, 4],
    [4, 7],
    [7, 2],
    [8, 1],
    [9, 6],
  ]

  const k3points = [
    [2.0, 3.0, 0.0],
    [5.0, 4.0, 0.0],
    [4.0, 7.0, 0.0],
    [7.0, 2.0, 0.0],
    [8.0, 1.0, 0.0],
    [9.0, 6.0, 0.1],
  ]

  describe('.build', () => {
    it('creates a new kd-tree from the given points', () => {
      let tree = KdTree.build(k2points)

      expect(tree).toBeInstanceOf(Map)
      expect(tree.get('p')).toEqual([7, 2])
      expect(tree.get('a')).toEqual(0)
      expect(tree.get('l')).toBeInstanceOf(Map)
      expect(tree.get('r')).toBeInstanceOf(Map)
    })

    it('returns null given and empty list', () => {
      expect(KdTree.build([])).toBe(null)
    })
  })

  describe('.sort', () => {
    it('sorts all points on a given axis', () => {
      expect(KdTree.sort(k2points, 0))
        .toEqual([[2, 3], [4, 7], [5, 4], [7, 2], [8, 1], [9, 6]])
      expect(KdTree.sort(k2points, 1))
        .toEqual([[8, 1], [7, 2], [2, 3], [5, 4], [9, 6], [4, 7]])
    })

    it('returns a new array', () => {
      expect(KdTree.sort(k2points, 0)).not.toBe(k2points)
    })
  })

  describe('.near', () => {
    describe('with 2-d points', () => {
      const tree = KdTree.build(k2points)

      it('finds the nearest one', () => {
        expect(KdTree.near(tree, [1, 1])).toEqual([[2, 3]])
      })

      it('finds the nearest many', () => {
        expect(KdTree.near(tree, [1, 1], 2)).toEqual([[2, 3], [5, 4]])
      })

      it('finds the nearest too many', () => {
        expect(KdTree.near(tree, [1, 1], 100).length).toEqual(k2points.length)
      })
    })

    describe('with 3-d points', () => {
      const tree = KdTree.build(k3points)

      it('finds the nearest one', () => {
        expect(KdTree.near(tree, [1, 1, 0])).toEqual([[2, 3, 0]])
      })

      it('finds the nearest many', () => {
        expect(KdTree.near(tree, [1, 1, 0], 2)).toEqual([[2, 3, 0], [5, 4, 0]])
      })
    })
  })
})
