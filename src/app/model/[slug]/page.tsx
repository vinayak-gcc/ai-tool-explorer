'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getModelById } from '@/lib/models';
import ModelForm from '@/components/ModelForm';
import OutputDisplay from '@/components/OutputDisplay';
import Link from 'next/link';

export default function ModelPage() {
  const params = useParams();
  const model = typeof params.slug === 'string' ? getModelById(params.slug) : null;

  const [output, setOutput] = useState<string | string[] | Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!model) {
    return (
      <div className="min-h-screen bg-[#191919] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Model Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerate = async (formData: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `${model.owner}/${model.model}`,
          input: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(
          (typeof data.output === 'string' ||
            Array.isArray(data.output) ||
            (data.output && typeof data.output === 'object'))
            ? data.output
            : 'Unsupported output format'
        );
      } else {
        setError(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black  text-white">
      <div className="container  mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:h-[92vh] mt-2 gap-4">

            <div className="flex md:w-4/5 rounded-xl shadow-md border border-neutral-700">
            <OutputDisplay
              output={output}
              outputType={
                ['image', 'text', 'json'].includes(model.outputType)
                  ? (model.outputType as 'image' | 'text' | 'json')
                  : 'text'
              }
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="flex md:w-1/4">
            <ModelForm
              model={model}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

        
        </div>
      </div>
    </div>
  );
}