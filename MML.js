import { WaveFile } from "https://code4fukui.github.io/wavefile-es/index.js";
import { bincat } from "https://js.sabae.cc/binutil.js";

const encode = (mml, maxs = 3 * 60, samp = 48000, vol = .05) => {
  const nvol = Math.floor(255 * vol);
  const maxms = maxs * 1000;
  const waves = [];
  const addWave = (freq, ms) => {
    const len = Math.floor(samp * ms / 1000)
    const wave = new Uint8Array(len);
    let t = 0;
    let value = 1;
    const wt = samp / freq;
    for (let i = 0; i < wave.length; i++) {
      wave[i] = 127 - Math.floor(value * nvol * 30);
      if (t++ > wt) {
        value = 1 - value;
        t = 0;
      }
    }
    waves.push(wave);
  };
  let summs = 0;
  let nmml = 0;
  let oct = 4;
  let deflen = 4;
  let t = 120;
  let nrepeat = -1;
  A: for (;;) {
    let n = -2;
    let l = 8;
    let rest = false;
    for (;;) {
      if (mml.length == nmml) {
        if (nrepeat >= 0) {
          nmml = nrepeat;
          continue;
        }
        break A;
      }
      let c = mml.substring(nmml, nmml + 1).toUpperCase();
      nmml++;
      if (c == ' ') {
        c = mml.substring(nmml, nmml + 1).toUpperCase();
        nmml++;
        continue;
      }
      if (c == "O") {
        const c2 = mml.substring(nmml, nmml + 1);
        const no = parseInt(c2);
        if (no > 0) {
          nmml++;
          oct = no;
        }
        continue;
      }
      if (c == "T") {
        const c2 = mml.substring(nmml); //, nmml + 1);
        t = parseInt(c2);
        continue;
      }
      if (c == "L") {
        const c2 = mml.substring(nmml); //, nmml + 1);
        const nl = parseInt(c2);
        if (nl > 0) {
//            deflen = 32 / nl;
          deflen = nl;
          /*
          int c3 = *_g.psgmml++;
          if (c3 == '.')
            _g.psgdeflen += _g.psgdeflen / 2;
          else
            _g.psgmml--;
          */
        }
        continue;
      }
      if (c == ">") {
        oct--; // ver 1.2
        continue;
      } else if (c == "<") {
        oct++; // ver 1.2
        continue;
      } else if (c == "$") {
        nrepeat = nmml;
        continue;
      }
      n = "C D EF G A BR".indexOf(c);
      if (n < 0)
        continue;
      if (n == 12)
        rest = true;
      
      const c2 = mml.substring(nmml, nmml + 1);
      if (c2 == '-') {
        n--;
        nmml++;
      } else if (c2 == '+') {
        n++;
        nmml++;
      }

      if (nmml < mml.length) {
        let nl = deflen;
        const nl2 = parseInt(mml.substring(nmml, nmml + 1));
        if (nl2 > 0) {
          nmml++;
          nl = nl2;
          if (nl2 == 1) {
            const nl3 = parseInt(mml.substring(nmml, nmml + 1));
            if (nl3 > 0) {
              nl = nl2 * 10 + nl3;
            }
          }
        }
        l = 32 / nl;
        const c2 = mml.substring(nmml, nmml + 1);
        if (c2 == '.') {
          nmml++;
          l += l / 2;
        }
      }
      if (n >= 0) {
        n += 3 + (oct - 4) * 12;
      }
      break;
    }
    const ms = (60 * 1000) / (t * 8) * l;
    if (rest) {
      addWave(0, ms);
    } else {
      const freq = 440 * Math.pow(2, n / 12);
      addWave(freq, ms);
    }
    summs += ms;
    if (summs > maxms) {
      break;
    }
  };
  const wav = new WaveFile();
  wav.fromScratch(1, samp, '8', bincat(...waves));
  const bin = wav.toBuffer();
  return bin;
};

export const MML = { encode };
