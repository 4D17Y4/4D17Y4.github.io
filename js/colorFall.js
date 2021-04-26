const canvas = document.getElementById("canvas1");
const colider = document.getElementById("frame");
const links = document.getElementById("link");
const ctx = canvas.getContext("2d");
var colorArray = [];
const particleArray = [];
var numberOfItems;
const noOfParticles = 700;
var frameObj;
var colorPoint = 0;
var startFall;
var widthFall;
var heidhtFall;
var partition;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class frame {
  constructor(x, y, width, height, baseX) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.baseX = baseX;
  }
}

// particles
class particle {
  constructor(x, y, size, weight, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.weight = weight;
    this.color = color;
  }

  update() {
    if (
      this.x < frameObj.x + frameObj.width &&
      this.x > frameObj.x &&
      this.y < frameObj.y + 20 &&
      this.y > frameObj.y
    ) {
      this.weight = 0;
      if (this.x < partition) this.x -= 12;
      else this.x += 12;
    } else {
      if (this.weight == 0) this.weight = Math.random() * 5 + 10;
      this.weigh += 0.1;
    }
    if (this.y - this.size > canvas.height) {
      this.x = Math.random() * widthFall + startFall;
      this.y = heidhtFall;
      this.weight = Math.random() * 5 + 10;
    }
    this.y += this.weight;
  }
  draw() {
    ctx.fillStyle = colorArray[colorPoint];
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function createParticles() {
  for (var i = 0; i < noOfParticles; i++) {
    const x = -100;
    var size = Math.random() * 20 + 5;
    var color = colorArray[0];
    if (i % 5 == 0) {
      size = Math.random() * 2 + 5;
      color = colorArray[1];
    }

    const weight = Math.random() * 5 + 10;
    const y = Math.random() * 600;
    particleArray.push(new particle(x, y, size, weight, color));
  }
}

var updateparam = 1;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
  }
  if (colorPoint == numberOfItems - 1 && updateparam == 1) {
    updateparam = -1;
  }
  if (colorPoint == 0 && updateparam == -1) {
    updateparam = 1;
  }
  colorPoint = colorPoint + updateparam;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", function (e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function positionFlow() {
  var rect = colider.getBoundingClientRect();
  frameObj = new frame(rect.x, rect.y, rect.width, rect.height, 0);
  var source = links.getBoundingClientRect();
  startFall = source.x + 0.2 * source.width;
  widthFall = source.width * 0.6;
  heidhtFall = source.y + source.height - 20;
  partition = source.x + source.width / 2;
}

// color change in fall
function Rainbow() {
  "use strict";
  var gradients = null;
  var minNum = 0;
  var maxNum = 100;
  var colours = ["ff0000", "ffff00", "00ff00", "0000ff"];
  setColours(colours);

  function setColours(spectrum) {
    if (spectrum.length < 2) {
      throw new Error("Rainbow must have two or more colours.");
    } else {
      var increment = (maxNum - minNum) / (spectrum.length - 1);
      var firstGradient = new ColourGradient();
      firstGradient.setGradient(spectrum[0], spectrum[1]);
      firstGradient.setNumberRange(minNum, minNum + increment);
      gradients = [firstGradient];

      for (var i = 1; i < spectrum.length - 1; i++) {
        var colourGradient = new ColourGradient();
        colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
        colourGradient.setNumberRange(
          minNum + increment * i,
          minNum + increment * (i + 1)
        );
        gradients[i] = colourGradient;
      }

      colours = spectrum;
    }
  }

  this.setSpectrum = function () {
    setColours(arguments);
    return this;
  };

  this.setSpectrumByArray = function (array) {
    setColours(array);
    return this;
  };

  this.colourAt = function (number) {
    if (isNaN(number)) {
      throw new TypeError(number + " is not a number");
    } else if (gradients.length === 1) {
      return gradients[0].colourAt(number);
    } else {
      var segment = (maxNum - minNum) / gradients.length;
      var index = Math.min(
        Math.floor((Math.max(number, minNum) - minNum) / segment),
        gradients.length - 1
      );
      return gradients[index].colourAt(number);
    }
  };

  this.colorAt = this.colourAt;

  this.setNumberRange = function (minNumber, maxNumber) {
    if (maxNumber > minNumber) {
      minNum = minNumber;
      maxNum = maxNumber;
      setColours(colours);
    } else {
      throw new RangeError(
        "maxNumber (" +
          maxNumber +
          ") is not greater than minNumber (" +
          minNumber +
          ")"
      );
    }
    return this;
  };
}

function ColourGradient() {
  "use strict";
  var startColour = "ff0000";
  var endColour = "0000ff";
  var minNum = 0;
  var maxNum = 100;

  this.setGradient = function (colourStart, colourEnd) {
    startColour = getHexColour(colourStart);
    endColour = getHexColour(colourEnd);
  };

  this.setNumberRange = function (minNumber, maxNumber) {
    if (maxNumber > minNumber) {
      minNum = minNumber;
      maxNum = maxNumber;
    } else {
      throw new RangeError(
        "maxNumber (" +
          maxNumber +
          ") is not greater than minNumber (" +
          minNumber +
          ")"
      );
    }
  };

  this.colourAt = function (number) {
    return (
      calcHex(number, startColour.substring(0, 2), endColour.substring(0, 2)) +
      calcHex(number, startColour.substring(2, 4), endColour.substring(2, 4)) +
      calcHex(number, startColour.substring(4, 6), endColour.substring(4, 6))
    );
  };

  function calcHex(number, channelStart_Base16, channelEnd_Base16) {
    var num = number;
    if (num < minNum) {
      num = minNum;
    }
    if (num > maxNum) {
      num = maxNum;
    }
    var numRange = maxNum - minNum;
    var cStart_Base10 = parseInt(channelStart_Base16, 16);
    var cEnd_Base10 = parseInt(channelEnd_Base16, 16);
    var cPerUnit = (cEnd_Base10 - cStart_Base10) / numRange;
    var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
    return formatHex(c_Base10.toString(16));
  }

  function formatHex(hex) {
    if (hex.length === 1) {
      return "0" + hex;
    } else {
      return hex;
    }
  }

  function isHexColour(string) {
    var regex = /^#?[0-9a-fA-F]{6}$/i;
    return regex.test(string);
  }

  function getHexColour(string) {
    if (isHexColour(string)) {
      return string.substring(string.length - 6, string.length);
    } else {
      var name = string.toLowerCase();
      if (colourNames.hasOwnProperty(name)) {
        return colourNames[name];
      }
      throw new Error(string + " is not a valid colour.");
    }
  }

  // Extended list of CSS colornames s taken from
  // http://www.w3.org/TR/css3-color/#svg-color
  var colourNames = {
    aliceblue: "F0F8FF",
    antiquewhite: "FAEBD7",
    aqua: "00FFFF",
    aquamarine: "7FFFD4",
    azure: "F0FFFF",
    beige: "F5F5DC",
    bisque: "FFE4C4",
    black: "000000",
    blanchedalmond: "FFEBCD",
    blue: "0000FF",
    blueviolet: "8A2BE2",
    brown: "A52A2A",
    burlywood: "DEB887",
    cadetblue: "5F9EA0",
    chartreuse: "7FFF00",
    chocolate: "D2691E",
    coral: "FF7F50",
    cornflowerblue: "6495ED",
    cornsilk: "FFF8DC",
    crimson: "DC143C",
    cyan: "00FFFF",
    darkblue: "00008B",
    darkcyan: "008B8B",
    darkgoldenrod: "B8860B",
    darkgray: "A9A9A9",
    darkgreen: "006400",
    darkgrey: "A9A9A9",
    darkkhaki: "BDB76B",
    darkmagenta: "8B008B",
    darkolivegreen: "556B2F",
    darkorange: "FF8C00",
    darkorchid: "9932CC",
    darkred: "8B0000",
    darksalmon: "E9967A",
    darkseagreen: "8FBC8F",
    darkslateblue: "483D8B",
    darkslategray: "2F4F4F",
    darkslategrey: "2F4F4F",
    darkturquoise: "00CED1",
    darkviolet: "9400D3",
    deeppink: "FF1493",
    deepskyblue: "00BFFF",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1E90FF",
    firebrick: "B22222",
    floralwhite: "FFFAF0",
    forestgreen: "228B22",
    fuchsia: "FF00FF",
    gainsboro: "DCDCDC",
    ghostwhite: "F8F8FF",
    gold: "FFD700",
    goldenrod: "DAA520",
    gray: "808080",
    green: "008000",
    greenyellow: "ADFF2F",
    grey: "808080",
    honeydew: "F0FFF0",
    hotpink: "FF69B4",
    indianred: "CD5C5C",
    indigo: "4B0082",
    ivory: "FFFFF0",
    khaki: "F0E68C",
    lavender: "E6E6FA",
    lavenderblush: "FFF0F5",
    lawngreen: "7CFC00",
    lemonchiffon: "FFFACD",
    lightblue: "ADD8E6",
    lightcoral: "F08080",
    lightcyan: "E0FFFF",
    lightgoldenrodyellow: "FAFAD2",
    lightgray: "D3D3D3",
    lightgreen: "90EE90",
    lightgrey: "D3D3D3",
    lightpink: "FFB6C1",
    lightsalmon: "FFA07A",
    lightseagreen: "20B2AA",
    lightskyblue: "87CEFA",
    lightslategray: "778899",
    lightslategrey: "778899",
    lightsteelblue: "B0C4DE",
    lightyellow: "FFFFE0",
    lime: "00FF00",
    limegreen: "32CD32",
    linen: "FAF0E6",
    magenta: "FF00FF",
    maroon: "800000",
    mediumaquamarine: "66CDAA",
    mediumblue: "0000CD",
    mediumorchid: "BA55D3",
    mediumpurple: "9370DB",
    mediumseagreen: "3CB371",
    mediumslateblue: "7B68EE",
    mediumspringgreen: "00FA9A",
    mediumturquoise: "48D1CC",
    mediumvioletred: "C71585",
    midnightblue: "191970",
    mintcream: "F5FFFA",
    mistyrose: "FFE4E1",
    moccasin: "FFE4B5",
    navajowhite: "FFDEAD",
    navy: "000080",
    oldlace: "FDF5E6",
    olive: "808000",
    olivedrab: "6B8E23",
    orange: "FFA500",
    orangered: "FF4500",
    orchid: "DA70D6",
    palegoldenrod: "EEE8AA",
    palegreen: "98FB98",
    paleturquoise: "AFEEEE",
    palevioletred: "DB7093",
    papayawhip: "FFEFD5",
    peachpuff: "FFDAB9",
    peru: "CD853F",
    pink: "FFC0CB",
    plum: "DDA0DD",
    powderblue: "B0E0E6",
    purple: "800080",
    red: "FF0000",
    rosybrown: "BC8F8F",
    royalblue: "4169E1",
    saddlebrown: "8B4513",
    salmon: "FA8072",
    sandybrown: "F4A460",
    seagreen: "2E8B57",
    seashell: "FFF5EE",
    sienna: "A0522D",
    silver: "C0C0C0",
    skyblue: "87CEEB",
    slateblue: "6A5ACD",
    slategray: "708090",
    slategrey: "708090",
    snow: "FFFAFA",
    springgreen: "00FF7F",
    steelblue: "4682B4",
    tan: "D2B48C",
    teal: "008080",
    thistle: "D8BFD8",
    tomato: "FF6347",
    turquoise: "40E0D0",
    violet: "EE82EE",
    wheat: "F5DEB3",
    white: "FFFFFF",
    whitesmoke: "F5F5F5",
    yellow: "FFFF00",
    yellowgreen: "9ACD32",
  };
}

if (typeof module !== "undefined") {
  module.exports = Rainbow;
}

function generateColors() {
  var allColor = [
    "#ff0000",
    "#ffa500",
    "#ffff00",
    "#008000",
    "#0000ff",
    "#4b0082",
    "#ee82ee",
  ];

  var range = 100;
  for (var i = 0; i < allColor.length - 1; i++) {
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, range);
    rainbow.setSpectrum(allColor[i], allColor[i + 1]);
    for (var j = 0; j < range; j++) {
      colorArray.push("#" + rainbow.colorAt(j));
    }
  }

  numberOfItems = colorArray.length;
}
window.addEventListener("resize", function () {
  positionFlow();
});

generateColors();
positionFlow();
createParticles();
animate();
