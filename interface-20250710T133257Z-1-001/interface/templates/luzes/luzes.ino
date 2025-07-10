#include <FastLED.h>

#define DATA_PIN 2
#define NUM_LEDS 1

CRGB leds[NUM_LEDS];
unsigned long previous = millis();
unsigned long actual = millis();
int increment = 0;
bool fadein_on = false;
CRGB color = CRGB::Black;
int d = 100;

void setup() {
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  Serial.begin(9600);
  Serial.setTimeout(10);

}

void loop() {
  if(fadein_on && previous+d > actual){
    increment += 1;
    fadeIn(color);
    if(increment == 255){
      increment = 0;
      fadein_on = false;
    }
    previous = actual;
  }

  if (Serial.available() > 0) {
    String texto = Serial.readStringUntil('\n');
    texto.trim();
    if(texto.substring(0,6) == "emo,0,") handle_emotion(texto.substring(6, texto.length())) ;
  }

  actual = millis();
 
}

void handle_emotion(String emocao) {
  if (emocao == "sad") {
    color =  CRGB::Blue;
  } else if (emocao == "happy") {
    color =  CRGB::Green;
  } else if (emocao == "angry") {
    color =  CRGB::Red;
  } else if (emocao == "funny") {
    color =  CRGB::Yellow;
  } else {
    color =  CRGB::White;
  }
  fadein_on = true;
  previous = millis();
}


void fadeIn(CRGB color) {
  fill_solid(leds, NUM_LEDS, color);
  
    for (int j = 0; j < NUM_LEDS; j++) {
      leds[j].fadeToBlackBy(255 - increment); 
    }
  
  FastLED.show();
  
}