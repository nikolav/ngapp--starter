// represent position on screen
export class Point {
  constructor(public x: number, public y: number) {}
  static from(p: { x: number; y: number }) {
    return new Point(p.x, p.y);
  }
  static fromEvent(event: PointerEvent | MouseEvent) {
    return new Point(event.clientX, event.clientY);
  }
}
