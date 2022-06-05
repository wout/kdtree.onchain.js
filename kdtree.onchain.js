/**
 * @typedef {Map<string, KdPoint[]|number|null>} KdNode
 * @property {KdPoint} p - Pivot point on axis.
 * @property {number} a - The axis on which to operate.
 * @property {KdNode|null} l - Left side of the node.
 * @property {KdNode|null} r - Right side of the node.
 */

/**
 * @typedef {number[]} KdPoint
 */

export const KdT = {
  /**
    * Builds a KD-Tree from an array of points.
    *
    * @param {KdPoint[]} ps - Array of points.
    * @param {number} k - Dimension of the points (for internal use only).
    * @param {number} d - Current depth (for internal use only).
    * @param {number} l - Numberof points (for internal use only).
    * @returns {KdNode|null} A node within the KD-Tree.
    */
  build(ps, k = (ps[0] || []).length, d = 0, l = ps.length) {
    return !l ? null : this.node(this.sort(ps, d % k), ~~(l / 2), k, d)
  },

  /**
   * Creates a new node. 
   *
   * @param {KdPoint[]} ps - Array of points.
   * @param {number} m - The median pivot point on the current axis.
   * @param {number} k - Dimension of the points.
   * @param {number} d - The current depth.
   * @returns {KdNode} A new KD-Tree node.
   */
  node(ps, m, k, d) {
    return (new Map)
      .set('p', ps[m])
      .set('a', d % k)
      .set('l', !m ? null : this.build(ps.slice(0, m), k, d + 1))
      .set('r', !m ? null : this.build(ps.slice(m), k, d + 1))
  },

  /**
    * Sorts points on the given axis.
    *
    * @param {KdPoint[]} ps - Array of points.
    * @param {number} a - Axis on which should be sorted.
    * @returns {KdPoint[]} - A new sorted array of points.
    */
  sort(ps, a) {
    return ps.slice().sort((m, n) => m[a] < n[a] ? -1 : m[a] > n[a] ? 1 : 0)
  },

  /**
   * Calculates the distance between two given points.
   * 
   * @param {KdPoint} a - Reference point. 
   * @param {KdPoint} b - Query point.
   * @returns {number} The squared euclidean distance.
   */
  d(a, b) {
    return a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0)
  },

  /**
   * Get the nearest point to the queried one.
   * 
   * @param {KdNode|null} c - The current node. 
   * @param {KdPoint} q - Query point.
   * @param {number} n - Number of nearest points to get.
   * @param {KdPoint[]} ps - Nearest points found (for internal use only).
   * @returns {KdPoint[]} The nearest point(s).
   */
  near(c, q, n = 1, ps = []) {
    if (!c) return ps
    this.reg(ps, c.get('p'), q, n)
    return this.s(ps, q, n, c.get('p'), c.get('a'), this.nf(q, ...c.values()))
  },

  /**
   * Search the nearer branch, then the farther one.
   * 
   * @param {KdPoint[]} ps - Nearest points found.
   * @param {KdPoint} q - Query point.
   * @param {number} n - Number of nearest points to get.
   * @param {KdPoint} p - Pivot point on axis.
   * @param {number} a - The axis on which to operate.
   * @param {[KdNode, KdNode]} nf - The nearer and farther nodes.
   * @returns {KdPoint[]} The nearest point(s).
   */
  s(ps, q, n, p, a, nf) {
    return this.sf(
      this.near(nf[0], q, n, ps), q, n, this.d([p[a]], [q[a]]), nf[1]
    )
  },

  /**
   * Searches the farther branch if the distance to the hyperplane is less than
   * any nearest so far.
   * 
   * @param {KdPoint[]} ps - Nearest points found.
   * @param {KdPoint} q - Query point.
   * @param {number} n - Number of nearest points to get.
   * @param {KdPoint} d - Distance threshold.
   * @param {KdNode} f - Te farther node.
   * @returns {KdPoint[]} The nearest point(s).
   */
  sf(ps, q, n, d, f) {
    return ps.find(p => this.d(p, q) >= d) ? this.near(f, q, n, ps) : ps
  },

  /**
    * Registers the given point in the given array.
    *
    * @param {KdPoint[]} ps - The array to register the point in.
    * @param {KdPoint} p - Point to register.
    * @param {KdPoint} q - Query point.
    * @param {number} n - the maximum number of points to find.
    * @returns {undefined}
    */
  reg(ps, p, q, n) {
    ps.length < n ? this.push(ps, p) : this.put(ps, p, q, this.d(p, q))
  },

  /**
    * Adds the given point to the array if it isn't already present.
    *
    * @param {KdPoint[]} ps - The array to register the point in.
    * @param {KdPoint} p - Point to register.
    * @returns {undefined}
    */
  push(ps, p) {
    if (ps.map(x => String(x)).indexOf(String(p)) == -1) ps.push(p)
  },

  /**
    * Replaces a point at the found index if the given one has a smaller distance.
    *
    * @param {KdPoint[]} ps - The array to register the point in.
    * @param {KdPoint} p - Point to register.
    * @param {KdPoint} q - Query point.
    * @param {number} d - The maximum number of points to find.
    * @param {number|null} i - Index variable (for internal use only).
    * @returns {undefined}
    */
  put(ps, p, q, d, i) {
    if ((i = ps.findIndex(p => d < this.d(p, q))) > -1) ps[i] = p
  },

  /**
   * Determines which branch contains the query along the split dimension.
   * 
   * @param {KdPoint} q - Query point. 
   * @param {KdPoint} p - Pivot point on axis.
   * @param {number} a - The axis on which to operate.
   * @param {KdNode|null} l - Branch on the left.
   * @param {KdNode|null} r - Branch on the right.
   * @returns {[KdNode, KdNode]} A tuple containing the nearer and farther nodes.
   */
  nf(q, p, a, l, r) { return q[a] <= p[a] ? [l, r] : [r, l] }
}
