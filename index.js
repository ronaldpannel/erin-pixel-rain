/**@type{HTMLCanvasElement} */
class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.random() * this.effect.width;
    this.y = 0;
    this.speed = 0;
    this.velocity = Math.random() * 0.5;
    this.size = Math.random() * 1.5 + 1;
    this.position1 = Math.floor(this.y);
    this.position2 = Math.floor(this.x);
    this.movement = 0;
  }
  update() {
    this.position1 = Math.floor(this.y);
    this.position2 = Math.floor(this.x);
    this.speed = this.effect.mappedImage[this.position1][this.position2][0];

    this.movement = 2.5 - this.speed + this.velocity;

    this.y += this.movement;
    if (this.y > this.height) {
      this.y = 0;
      this.x = Math.random() * this.effect.width;
    }
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = "white";
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particleArray = [];
    this.numOfParticles = 2000;
    this.image = document.getElementById("erinImg");
    this.mappedImage = [];
    this.cellBrightness = 0;
    this.brightness = 0;
  }
  init(context) {
    context.drawImage(this.image, 0, 0, this.width, this.height);
    const pixels = context.getImageData(0, 0, this.width, this.height);
    for (let y = 0; y < this.height; y++) {
      let row = [];
      for (let x = 0; x < this.width; x++) {
        const red = pixels.data[y * 4 * pixels.width + x * 4];
        const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
        const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];

        this.brightness = this.calcRelativeBrightness(red, green, blue);

        const cell = [(this.cellBrightness = this.brightness)];
        row.push(cell);
      }
      this.mappedImage.push(row);
    }

    for (let i = 0; i < this.numOfParticles; i++) {
      this.particleArray.push(new Particle(this));
    }
  }
  calcRelativeBrightness(red, green, blue) {
    return (
      Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
      ) / 100
    );
  }
  draw(context) {
    //context.drawImage(this.image, 0, 0, this.width, this.height);

    for (let i = 0; i < this.particleArray.length; i++) {
      this.particleArray[i].update();
      context.globalAlpha = this.particleArray[i].speed * 0.5;
      this.particleArray[i].draw(context);
    }
  }
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = 240;
  canvas.height = 320;
  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);

  function animate() {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    effect.draw(ctx);

    requestAnimationFrame(animate);
  }
  animate();
});
