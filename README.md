# MML.js

MML.js is a library of the music macro language on IchigoJam.

## demo

- [WebMML](https://ichigojam.github.io/MML/)

## Usage on Deno

```js
import { MML } from "https://ichigojam.github.io/MML/MML.js";

const mml = "T180O5EEE2EEE2EGC.D8E2.R8 FFF.F8FEEEEDDCD2G2 EEE2EEE2EGC.D8E2.R8 FFF.F8FEEEGGFDC2.R";
const wav = MML.encode(mml, 30); // max30sec
await Deno.writeFile("example.wav", wav);
```
