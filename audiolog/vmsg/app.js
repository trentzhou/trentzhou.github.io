import { record } from "./vmsg.js";

window.showRecord = function (wasm_url) {
  return record({wasmURL: wasm_url});
}

