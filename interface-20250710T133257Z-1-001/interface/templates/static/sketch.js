let personagens = {};
let json_file;
let cenaAtual = 0;
let tempoCena = 25000; 
let mySounds = []
let tempoInicioCena;


let port;
let writer;

const posicoes = {
    "left": () => width * 0.2,
    "center": () => width * 0.5,
    "right": () => width * 0.8,
    "offstage-left": () => -width * 0.2,
    "offstage-right": () => width + width * 0.2,
    "default": () => -width * 0.2
};

const inclinacoes = {
    "tilted-left": () => -PI/5,
    "none": () => 0,
    "tilted-right": () => PI/5
};

function preload() {
  console.log("Preloading...");

  soundFormats('mp3', 'ogg');
  json_file = loadJSON("static/resposta.json", (data) => {
    json_file = data;
    console.log("JSON loaded ");

    for (let i = 0; i < data.story.length; i++) {
      let para = data.story[i].paragraph || "";
      if (para !== "") {
        mySounds[i] = loadSound('static/audio/fala_' + (i + 1) + ".mp3", () => {
          console.log(`Sound ${i+1} loaded`);
        });
      } else {
        mySounds[i] = null;
      }
    }
  });

}

async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const encoder = new TextEncoderStream();
    const writableStreamClosed = encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    console.log("Serial connected");
  } catch (err) {
    console.error("Error connecting to serial:", err);
  }
}

async function sendToArduino(message) {
  if (writer) {
    await writer.write(message + "\n");
    console.log("Sent:", message);
  } else {
    console.warn("Writer not ready. Connect first.");
  }
}

function setup() {
    console.log("Sketch loaded!");

    document.getElementById("connectBtn").addEventListener("click", connectSerial);

    let myDiv = createDiv();
    myDiv.position(300, 50);
    myDiv.id('container');
    canvas = createCanvas(600, 400);
    canvas.parent('container');
    tempoInicioCena = millis();
    textAlign(CENTER, CENTER);
    textSize(16);

    let cena = json_file.story[cenaAtual];
    let proximaCena = json_file.story[(cenaAtual + 1) % json_file.story.length];
    for (let chave in json_file.characters) {
        personagens[chave] = new Personagem(json_file.characters[chave], chave);
        personagens[chave].startScene(cena.characters[chave], proximaCena.characters[chave]);
    }
    
}

function draw() {
    //desenha background
    background(51);
    fill(102);
    rect(0, height - 120, width, 200);
    fill(255);

    //atualiza cena
    if (millis() - tempoInicioCena > tempoCena) {
        cenaAtual = (cenaAtual + 1) % json_file.story.length;
        if(mySounds[cenaAtual] != null)
          mySounds[cenaAtual].play()
        tempoInicioCena = millis();
        let cena = json_file.story[cenaAtual];
        let proximaCena = json_file.story[(cenaAtual + 1) % json_file.story.length];
        for (let chave in cena.characters) {
            personagens[chave].startScene(cena.characters[chave], proximaCena.characters[chave]);
        }
        sendToArduino("emo,25,"+cena.emotion);
    }

    let cena = json_file.story[cenaAtual];
    let proximaCena = json_file.story[(cenaAtual + 1) % json_file.story.length];

    let t = (millis() - tempoInicioCena) / tempoCena;

    for (let chave in cena.characters) {
        personagens[chave].atualizar(t);
        personagens[chave].desenhar();
    }

    //desenha extras
    drawMood(cena.emotion);
    fill(255);
    textWrap(WORD);
    text(cena.paragraph, 20, 60, width - 40);

    
}

function drawMood(emocao) {
  let color_;
  switch (emocao) {
    case "sad":
      color_ = color(0, 0, 255, 50);
      break;
    case "funny":
      color_ = color(255, 255, 0, 50);
      break;
    case "angry":
      color_ = color(255, 0, 0, 50);
      break;
    case "happy":
      color_ = color(0, 255, 0, 50);
      break;
    default:
      color_ = color(255, 255, 255, 50);
      break;
  }
  fill(color_);
  noStroke();
  beginShape();
  vertex(width/3, 0);
  vertex(2*width/3, 0);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  rect(0, 0, width, height); 
}

function getPos(pos) {
    return (posicoes[pos] || posicoes["default"])();
}

function getAngle(angle) {
    return (inclinacoes[angle] || inclinacoes["none"])();
}


