import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeMonoPcm16, toTranscriptionWav } from '../src/services/wav.js';

test('encodes mono PCM samples into a valid 16 kHz WAV upload', async () => {
  const wav = encodeMonoPcm16(Float32Array.from([-1, 0, 1]), 16000);
  const buffer = await wav.arrayBuffer();
  const view = new DataView(buffer);
  const text = (offset, length) => String.fromCharCode(...new Uint8Array(buffer, offset, length));

  assert.equal(wav.type, 'audio/wav');
  assert.equal(buffer.byteLength, 50);
  assert.equal(text(0, 4), 'RIFF');
  assert.equal(view.getUint32(4, true), 42);
  assert.equal(text(8, 4), 'WAVE');
  assert.equal(text(12, 4), 'fmt ');
  assert.equal(view.getUint16(20, true), 1);
  assert.equal(view.getUint16(22, true), 1);
  assert.equal(view.getUint32(24, true), 16000);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(text(36, 4), 'data');
  assert.equal(view.getUint32(40, true), 6);
  assert.deepEqual(
    [view.getInt16(44, true), view.getInt16(46, true), view.getInt16(48, true)],
    [-32768, 0, 32767],
  );
});

test('normalizes a WAV recording with the wrong sample rate before transcription', async () => {
  const originalAudioContext = globalThis.AudioContext;
  const originalOfflineAudioContext = globalThis.OfflineAudioContext;
  let decoded = false;
  globalThis.AudioContext = class {
    async decodeAudioData() {
      decoded = true;
      return { duration: 0.01 };
    }
    async close() {}
  };
  globalThis.OfflineAudioContext = class {
    constructor(channels, frames, sampleRate) {
      assert.deepEqual([channels, frames, sampleRate], [1, 160, 16000]);
      this.destination = {};
    }
    createBufferSource() { return { connect() {}, start() {} }; }
    async startRendering() { return { getChannelData: () => new Float32Array(160) }; }
  };

  try {
    const recording = encodeMonoPcm16(new Float32Array(441), 44100);
    const converted = await toTranscriptionWav(recording);
    const view = new DataView(await converted.arrayBuffer());
    assert.equal(decoded, true);
    assert.equal(view.getUint32(24, true), 16000);
    assert.equal(view.getUint16(22, true), 1);
  } finally {
    globalThis.AudioContext = originalAudioContext;
    globalThis.OfflineAudioContext = originalOfflineAudioContext;
  }
});
