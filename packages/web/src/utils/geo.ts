interface Point {
  x: number
  y: number
}

export interface LineSegment {
  p1: Point
  p2: Point
}

function Area(a: Point, b: Point, c: Point) {
  // determinant of {AB, AC}
  return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)
}

function isOppositeSigns(a: number, b: number) {
  return (a ^ b) < 0
}

export function isIntersect(seg1: LineSegment, seg2: LineSegment) {
  return (
    isOppositeSigns(Area(seg1.p1, seg1.p2, seg2.p1), Area(seg1.p1, seg1.p2, seg2.p2)) &&
    isOppositeSigns(Area(seg2.p1, seg2.p2, seg1.p1), Area(seg2.p1, seg2.p2, seg1.p2))
  )
}

export function isPointInPolygon(p: Point, polygon: LineSegment[], farPoint: Point = { x: 160, y: 90 }) {
  let helperSeg = { p1: p, p2: farPoint }
  return (polygon.filter((seg) => isIntersect(seg, helperSeg)).length & 1) > 0
}
