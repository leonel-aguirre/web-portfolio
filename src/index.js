import "./style.scss";
const p5 = require("p5");

let sketch = (p5) => {
  p5.setup = () => {
    let canvas = p5.createCanvas(200, 200);
    canvas.parent("canvasBg");
    p5.smooth();
    p5.background(0);
    p5.noStroke();
    p5.fill(255, 255, 255);
    p5.ellipse(100, 100, 95, 95);
    p5.filter(p5.BLUR, 10);
    p5.noStroke();
    p5.fill(255, 255, 255);
    p5.ellipse(100, 100, 90, 90);
  };

  p5.draw = () => {};
};

const P5 = new p5(sketch);
