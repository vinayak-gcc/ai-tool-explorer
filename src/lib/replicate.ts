import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

interface RunBody {
  owner: string;
  model: string;
  input: Record<string, unknown>;
}

// Validate model string format like: "owner/model" or "owner/model:version"
function isValidModelFormat(modelPath: string): modelPath is `${string}/${string}` | `${string}/${string}:${string}` {
  return /^.+?\/.+?(:.+)?$/.test(modelPath);
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: RunBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { owner, model, input } = body;

  if (!owner || !model || !input || Object.keys(input).length === 0) {
    return NextResponse.json(
      { error: 'Missing required parameters: owner, model, and non-empty input' },
      { status: 400 }
    );
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'API token not configured' }, { status: 500 });
  }

  const modelPath = `${owner}/${model}`;

  if (!isValidModelFormat(modelPath)) {
    return NextResponse.json({ error: 'Invalid model path format' }, { status: 400 });
  }

  const replicate = new Replicate({ auth: token });

  try {
    const startedAt = Date.now();

    const output = await replicate.run(modelPath, { input });

    const endedAt = Date.now();
    const durationInSeconds = ((endedAt - startedAt) / 1000).toFixed(2);

    return NextResponse.json({
      output,
      status: (output as Record<string, unknown>)?.status ?? 'completed',
      startedAt: new Date(startedAt).toISOString(),
      endedAt: new Date(endedAt).toISOString(),
      durationInSeconds,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Model inference failed';
    console.error('[Replicate Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'API token not configured' }, { status: 500 });
  }

  if (action === 'health') {
    return NextResponse.json({
      status: 'ok',
      hasToken: true,
    });
  }

  const owner = url.searchParams.get('owner');
  const model = url.searchParams.get('model');

  if (!owner || !model) {
    return NextResponse.json({ error: 'Missing owner or model parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.replicate.com/v1/models/${owner}/${model}`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      valid: true,
      model: data.name,
      latestVersion: data.latest_version?.id ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[GET /generate] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}