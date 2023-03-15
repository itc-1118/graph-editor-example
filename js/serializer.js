// 负责导入和导出编辑器内容
class Serializer {
  constructor(layers) {
    this.layers = layers;
  }

  exportToJson() {
    const jsonData = this.layers.children.map((rectangle) => {
      return {
        x: rectangle.x,
        y: rectangle.y,
        width: rectangle.width,
        height: rectangle.height,
        color: rectangle.color,
        rotation: rectangle.rotation,
        scaleX: rectangle.scale.x,
        scaleY: rectangle.scale.y,
      };
    });

    return JSON.stringify(jsonData, null, 2);
  }

  importFromJson(jsonData) {
    const parsedData = JSON.parse(jsonData);
    this.layers[0].removeChildren();

    parsedData.forEach((data) => {
      const rectangle = new Rectangle(data.color, data.x, data.y, history);
      rectangle.graphics.width = data.width;
      rectangle.graphics.height = data.height;
      rectangle.graphics.rotation = data.rotation;
      rectangle.graphics.scale.set(data.scaleX, data.scaleY);
      this.layers[0].addChild(rectangle.graphics);
    });
  }
}

export { Serializer };
