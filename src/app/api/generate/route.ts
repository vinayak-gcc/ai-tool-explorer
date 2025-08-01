import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN ?? '',
});

interface ReplicateRequest {
  model: string;
  input: Record<string, unknown>;
}

interface ReplicateResponse {
  prediction: unknown;
  status: string;
  startedAt: string;
  endedAt: string;
  durationInSeconds: string;
}

// ✅ Validate the model format using regex
function isValidModelName(model: string): model is `${string}/${string}` | `${string}/${string}:${string}` {
  return /^.+?\/.+?(:.+)?$/.test(model);
}

export async function POST(req: Request): Promise<Response> {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: 'Missing REPLICATE_API_TOKEN in environment.' },
      { status: 500 }
    );
  }

  let body: ReplicateRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON format.' }, { status: 400 });
  }

  const { model, input } = body;

  if (!isValidModelName(model)) {
    return NextResponse.json(
      { error: 'Invalid model format. Use "owner/model" or "owner/model:version".' },
      { status: 400 }
    );
  }

  if (!input || typeof input !== 'object') {
    return NextResponse.json({ error: 'Invalid input format.' }, { status: 400 });
  }

  try {
    const startTime = Date.now();

    const prediction = await replicate.run(model, { input });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    const response: ReplicateResponse = {
      prediction,
      status: typeof prediction === 'object' && prediction !== null && 'status' in prediction
        ? String((prediction as Record<string, unknown>).status)
        : 'completed',
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date(endTime).toISOString(),
      durationInSeconds: duration,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error('🔴 Replicate API Error:', error);

    let message = 'An unexpected error occurred.';

    if (typeof error === 'object' && error !== null) {
      const err = error as {
        response?: { data?: { detail?: string } };
        message?: string;
      };

      if (err.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err.message) {
        message = err.message;
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}