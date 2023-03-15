// 该类负责创建矩形并处理其拖拽、旋转和缩放事件。
class Rectangle {
  constructor(color, x, y, history) {
    this.history = history;
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, 100, 100);
    this.graphics.endFill();
    this.graphics.interactive = true;
    this.graphics.buttonMode = true;
    this.graphics.x = x;
    this.graphics.y = y;

    this.graphics
      .on("pointerdown", this.onDragStart.bind(this))
      .on("pointerup", this.onDragEnd.bind(this))
      .on("pointerupoutside", this.onDragEnd.bind(this))
      .on("pointermove", this.onDragMove.bind(this));
  }

  onDragStart(event) {
    this.graphics.data = event.data;
    this.graphics.alpha = 0.5;
    this.graphics.dragging = true;
    this.graphics.initialPosition = this.graphics.data.getLocalPosition(
      this.graphics.parent
    );
    this.graphics.initialRotation = this.graphics.rotation;
    this.graphics.initialScale = new PIXI.Point(
      this.graphics.scale.x,
      this.graphics.scale.y
    );
  }

  onDragEnd() {
    if (this.graphics.dragging) {
      const dx = this.graphics.x - this.graphics.initialPosition.x;
      const dy = this.graphics.y - this.graphics.initialPosition.y;
      const dr = this.graphics.rotation - this.graphics.initialRotation;
      const dsx = this.graphics.scale.x - this.graphics.initialScale.x;
      const dsy = this.graphics.scale.y - this.graphics.initialScale.y;

      if (dx !== 0 || dy !== 0) {
        this.history.record({
          undo: () => {
            this.graphics.x = this.graphics.initialPosition.x;
            this.graphics.y = this.graphics.initialPosition.y;
          },
          redo: () => {
            this.graphics.x += dx;
            this.graphics.y += dy;
          },
        });
      }

      if (dr !== 0) {
        this.history.record({
          undo: () => {
            this.graphics.rotation = this.graphics.initialRotation;
          },
          redo: () => {
            this.graphics.rotation += dr;
          },
        });
      }

      if (dsx !== 0 || dsy !== 0) {
        this.history.record({
          undo: () => {
            this.graphics.scale.set(
              this.graphics.initialScale.x,
              this.graphics.initialScale.y
            );
          },
          redo: () => {
            this.graphics.scale.set(
              this.graphics.initialScale.x + dsx,
              this.graphics.initialScale.y + dsy
            );
          },
        });
      }
    }
    this.graphics.alpha = 1;
    this.graphics.dragging = false;
    this.graphics.data = null;
  }

  onDragMove() {
    if (this.graphics.dragging) {
      const newPosition = this.graphics.data.getLocalPosition(
        this.graphics.parent
      );
      if (this.graphics.data.originalEvent.shiftKey) {
        // Rotate
        const dx = newPosition.x - this.graphics.x;
        const dy = newPosition.y - this.graphics.y;
        this.graphics.rotation = Math.atan2(dy, dx);
      } else if (this.graphics.data.originalEvent.altKey) {
        // Scale
        const initialDistance = Math.hypot(
          this.graphics.initialPosition.x - this.graphics.x,
          this.graphics.initialPosition.y - this.graphics.y
        );
        const currentDistance = Math.hypot(
          newPosition.x - this.graphics.x,
          newPosition.y - this.graphics.y
        );
        const scaleFactor = currentDistance / initialDistance;
        this.graphics.scale.set(scaleFactor);
      } else {
        // Normal drag
        this.graphics.x = newPosition.x - this.graphics.width / 2;
        this.graphics.y = newPosition.y - this.graphics.height / 2;
      }
    }
  }
}

export { Rectangle };
