import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const SARVAM_TTS_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

const ALLOWED_SPEAKERS = new Set([
  'shubh',
  'priya',
  'ritu',
  'kabir',
  'kavya',
  'aditya',
  'neha',
  'amit',
  'roopa',
  'manisha',
]);

const LANGUAGE_MAP: Record<string, string> = {
  gu: 'gu-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

function getSarvamApiKey(): string | null {
  const key = process.env.SARVAM_API_KEY?.trim();
  if (!key || key === 'MY_SARVAM_API_KEY') {
    return null;
  }
  return key;
}

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/tts/status', (_req, res) => {
    res.json({
      sarvamConfigured: Boolean(getSarvamApiKey()),
      model: 'bulbul:v3',
    });
  });

  app.post('/api/tts', async (req, res) => {
    const apiKey = getSarvamApiKey();
    if (!apiKey) {
      res.status(503).json({
        error: 'SARVAM_API_KEY is not configured in server environment secrets.',
        fallback: true,
      });
      return;
    }

    const body = (req.body ?? {}) as {
      text?: unknown;
      language?: unknown;
      speaker?: unknown;
      pace?: unknown;
    };

    if (typeof body.text !== 'string' || !body.text.trim()) {
      res.status(400).json({ error: 'Text is required for speech synthesis.' });
      return;
    }

    const cleanText = body.text.trim().slice(0, 2450);
    const langKey = typeof body.language === 'string' ? body.language : 'gu';
    const targetLanguageCode = LANGUAGE_MAP[langKey] ?? 'gu-IN';

    const requestedSpeaker =
      typeof body.speaker === 'string' ? body.speaker.toLowerCase().trim() : 'priya';
    const speaker = ALLOWED_SPEAKERS.has(requestedSpeaker) ? requestedSpeaker : 'priya';

    const rawPace = typeof body.pace === 'number' ? body.pace : 0.96;
    const pace = Math.max(0.5, Math.min(2.0, rawPace));

    try {
      const upstreamResponse = await fetch(SARVAM_TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          target_language_code: targetLanguageCode,
          model: 'bulbul:v3',
          speaker,
          speech_sample_rate: 24000,
          output_audio_codec: 'mp3',
          pace,
          temperature: 0.55,
        }),
      });

      if (!upstreamResponse.ok) {
        const errBody = await upstreamResponse.text().catch(() => '');
        console.error(
          `[Sarvam TTS] Upstream error ${upstreamResponse.status}: ${errBody.slice(0, 200)}`
        );
        res.status(upstreamResponse.status >= 400 && upstreamResponse.status < 500 ? 400 : 502).json({
          error: 'Sarvam AI voice synthesis failed.',
          status: upstreamResponse.status,
          fallback: true,
        });
        return;
      }

      const data = (await upstreamResponse.json()) as {
        request_id?: string;
        audios?: string[];
      };

      const audioBase64 = Array.isArray(data.audios) ? data.audios[0] : undefined;
      if (!audioBase64) {
        res.status(502).json({
          error: 'Sarvam AI returned empty audio payload.',
          fallback: true,
        });
        return;
      }

      res.json({
        audioBase64,
        mimeType: 'audio/mpeg',
        provider: 'sarvam',
        model: 'bulbul:v3',
        speaker,
      });
    } catch (err) {
      console.error('[Sarvam TTS] Proxy request error:', err instanceof Error ? err.message : err);
      res.status(502).json({
        error: 'Unable to reach Sarvam AI TTS service.',
        fallback: true,
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gujarat District VFX Studio server running on http://0.0.0.0:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
