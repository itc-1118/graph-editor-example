import { Layer } from "./layer.js";
import { Rectangle } from "./rectangle.js";
import { History } from "./history.js";
import { Serializer } from "./serializer.js";

class App {
  constructor() {
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });
    document.body.appendChild(this.app.view);

    this.layerContainer = new PIXI.Container();
    this.app.stage.addChild(this.layerContainer);

    this.layers = [new Layer(), new Layer()];
    this.layers.forEach((layer) =>
      this.layerContainer.addChild(layer.container)
    );

    this.serializer = new Serializer(this.layerContainer);

    this.history = new History();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 设置按钮事件监听器
    const createRectangleButton = document.getElementById("create-rectangle");
    const undoButton = document.getElementById("undo");
    const redoButton = document.getElementById("redo");
    const exportJsonButton = document.getElementById("export-json");
    const importJsonButton = document.getElementById("import-json");

    createRectangleButton.addEventListener("click", () =>
      this.createRandomRectangle()
    );
    undoButton.addEventListener("click", () => this.history.undo());
    redoButton.addEventListener("click", () => this.history.redo());
    exportJsonButton.addEventListener("click", () =>
      console.log(this.serializer.exportToJson(),'------exportToJson----')
    );
    // importJsonButton.addEventListener("click", () =>
    //   this.serializer.importFromJson()
    // );
    this.serializer;
  }

  createRandomRectangle() {
    const color = Math.random() * 0xffffff;
    const x = Math.random() * (this.app.view.width - 100);
    const y = Math.random() * (this.app.view.height - 100);
    const rectangle = new Rectangle(color, x, y, this.history);
    const layer = this.layers[Math.floor(Math.random() * this.layers.length)];
    layer.addRectangle(rectangle);
  }
}

export { App };
