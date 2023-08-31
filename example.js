import { MML } from "./MML.js";

//const mml = "CDE2";
//const mml = "T800CDEFGAB<CDEFGABRBAGFEDC>BAGEDC";
//const mml = "T180O5EEE2EEE2EGC.D8E2.R8 FFF.F8FEEEEDDCD2G2 EEE2EEE2EGC.D8E2.R8 FFF.F8FEEEGGFDC2.R";
//const mml = "CDE2CDE2GEDCDED2";
const mml = "GDCT800$CDE";
const wav = MML.encode(mml, 30); // max30sec
await Deno.writeFile("example.wav", wav);
