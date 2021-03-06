import {KdT} from '../kdtree.onchain.js'

describe('KdT', () => {
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

  describe('.ree', () => {
    it('creates a new kd-tree from the given points', () => {
      let tree = KdT.ree(k2points)

      expect(tree).toBeInstanceOf(Map)
      expect(tree.get('p')).toEqual([7, 2])
      expect(tree.get('a')).toEqual(0)
      expect(tree.get('l')).toBeInstanceOf(Map)
      expect(tree.get('r')).toBeInstanceOf(Map)
    })

    it('returns null given and empty list', () => {
      expect(KdT.ree([])).toBe(null)
    })
  })

  describe('.sort', () => {
    it('sorts all points on a given axis', () => {
      expect(KdT.sort(k2points, 0))
        .toEqual([[2, 3], [4, 7], [5, 4], [7, 2], [8, 1], [9, 6]])
      expect(KdT.sort(k2points, 1))
        .toEqual([[8, 1], [7, 2], [2, 3], [5, 4], [9, 6], [4, 7]])
    })

    it('returns a new array', () => {
      expect(KdT.sort(k2points, 0)).not.toBe(k2points)
    })
  })

  describe('.near', () => {
    describe('with 2-d points', () => {
      const tree = KdT.ree(k2points)

      it('finds the nearest one', () => {
        expect(KdT.near(tree, [1, 1])).toEqual([[2, 3]])
      })

      it('finds the nearest many', () => {
        expect(KdT.near(tree, [1, 1], 2)).toEqual([[2, 3], [5, 4]])
      })

      it('finds the nearest too many', () => {
        expect(KdT.near(tree, [1, 1], 100).length).toEqual(k2points.length)
      })
    })

    describe('with 3-d points', () => {
      const tree = KdT.ree(k3points)

      it('finds the nearest one', () => {
        expect(KdT.near(tree, [1, 1, 0])).toEqual([[2, 3, 0]])
      })

      it('finds the nearest many', () => {
        expect(KdT.near(tree, [1, 1, 0], 2)).toEqual([[2, 3, 0], [5, 4, 0]])
      })
    })
  })
})
