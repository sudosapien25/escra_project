// Point class for drawing
interface PointLike {
  x: number;
  y: number;
  timestamp: number;
}

export class Point implements PointLike {
  public x: number;
  public y: number;
  public timestamp: number;

  constructor(x: number, y: number, timestamp?: number) {
    this.x = x;
    this.y = y;
    this.timestamp = timestamp ?? Date.now();
  }

  public static fromEvent(
    event: React.MouseEvent | React.PointerEvent | React.TouchEvent,
    dpi = 1,
    el?: HTMLElement | null,
  ): Point {
    const target = el ?? event.target;
    if (!(target instanceof HTMLElement)) {
      throw new Error('Event target is not an HTMLElement.');
    }

    const { top, bottom, left, right } = target.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    let x = Math.min(Math.max(left, clientX), right) - left;
    let y = Math.min(Math.max(top, clientY), bottom) - top;

    x *= dpi;
    y *= dpi;

    return new Point(x, y);
  }

  public distanceTo(point: Point): number {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
} 