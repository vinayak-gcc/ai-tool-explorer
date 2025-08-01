'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Download, Copy, ArrowDown } from 'lucide-react';
import Image from 'next/image';

interface OutputDisplayProps {
  output: string | string[] | Record<string, unknown> | null;
  outputType: 'image' | 'text' | 'json';
  isLoading: boolean;
  error: string | null;
  prompt?: string; 
}

export default function OutputDisplay({
  output,
  outputType,
  isLoading,
  error,
  prompt,
}: OutputDisplayProps) {
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const start = performance.now();
      return () => {
        const end = performance.now();
        setInferenceTime(Math.round(end - start));
      };
    }
  }, [isLoading]);

  const copyPrompt = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-white">
        <div className="h-6 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
    );
  }
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-full overflow-x-auto">
      <h3 className="text-red-800 font-semibold mb-2">Generation Failed</h3>
      <p className="text-red-600 break-words">{error}</p>
    </div>
  );
}


  if (!output) {
    return (
      <div className="w-full h-full rounded-xl bg-[#171717] ">
        <div className='flex flex-col items-center justify-center h-full'>
        <p className="text-2xl text-[#808080] mt-10 md:mt-0">Imagine it. Generate it </p>
      
        <div className='flex flex-col lg:flex-row mt-6 space-x-2 space-y-2 md:space-y0 text-[#808080] bg-[#131313]  p-4 rounded-lg '>

          <div className='rounded-xl text-sm bg-[#212121] p-2 w-[12rem] lg:w-[12rem] '>
            <p className='flex items-center justify-center h-full'>
              A Realistic Woman, orange clothes, Headshot only with some fire effect.
            </p>
          </div>

<ArrowRight className='flex items-center  justify-center h-full hidden lg:block' />
<div className='w-full h-8  w-[12rem] lg:w-[10rem] lg:hidden'>
<ArrowDown className='flex items-center justify-center h-full w-full h-4 w-4 lg:hidden' />
</div>

            <div className='rounded-xl bg-[#212121] p-2  w-[12rem] lg:w-[10rem]'>
          <p
  className=" bg-gradient-to-r from-[#6CB5FF80] to-[#FB5F2080] bg-clip-text text-transparent flex justify-center items-center h-full text-lg"
>
  Imagen 4 Ultra
</p>

          </div>

<ArrowRight className='flex items-center  justify-center h-full hidden lg:block' />
<div className='w-full h-8  w-[12rem] lg:w-[10rem] lg:hidden'>
<ArrowDown className='flex items-center justify-center h-full w-full h-4 w-4  lg:hidden' />
</div>

            <div className='rounded-xl w-[12rem] lg:w-[10rem] '>
           <Image 
           src="/Generate.svg" 
           alt='Next.js Logo'
           width={100}  
            height={100}
            className='w-full h-full p-[0.5px] object-cover'
           />
          </div>

        </div>

        </div>
      </div>
    );
  }

  const renderInferenceInfo = () =>
    inferenceTime !== null && (
      <p className="text-xs text-gray-500 mt-2">
        Inference time: {inferenceTime}ms
      </p>
    );

  const renderPromptSection = () => (
    <div className="w-1/2 bg-neutral-900 rounded-lg p-6 ml-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Your Prompt</h3>
        <button
          onClick={copyPrompt}
          className="inline-flex items-center px-3 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors duration-200 text-sm"
          title="Copy prompt"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-neutral-800 rounded-lg p-4">
        <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">
          {prompt || 'No prompt provided'}
        </p>
      </div>
      {renderInferenceInfo()}
    </div>
  );

  if (outputType === 'image') {
    const images = Array.isArray(output) ? output.map(String) : [String(output)];
    const imageCount = images.length;
    
    // Determine grid layout based on number of images
    const getGridLayout = (count: number) => {
      switch (count) {
        case 1:
          return { containerClass: 'grid grid-cols-1 gap-4', imageClass: 'w-full' };
        case 2:
          return { containerClass: 'grid grid-cols-2 gap-4', imageClass: 'w-full' };
        case 3:
          return { containerClass: 'grid grid-cols-2 gap-4', imageClass: 'w-full' };
        case 4:
          return { containerClass: 'grid grid-cols-2 gap-4', imageClass: 'w-full' };
        default:
          return { containerClass: 'grid grid-cols-1 gap-4', imageClass: 'w-full' };
      }
    };

    const { containerClass, imageClass } = getGridLayout(imageCount);

    return (
      <div className="flex w-full h-full">
        {/* Result Section - Left Half */}
        <div className="w-1/2 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Image{imageCount > 1 ? 's' : ''}
            </h3>
            <div className="flex space-x-2">
              {images.map((imageUrl, index) => (
                <a
                  key={index}
                  href={imageUrl}
                  download={`generated-image-${index + 1}.jpg`}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  title={`Download image ${index + 1}`}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {imageCount > 1 ? (index + 1) : 'Download'}
                </a>
              ))}
            </div>
          </div>
          
          <div className={containerClass}>
            {images.map((imageUrl, index) => (
              <div 
                key={index} 
                className={`${imageClass} ${imageCount === 3 && index === 2 ? 'col-span-2 mx-auto max-w-[50%]' : ''}`}
              >
           <div 
  key={index} 
  className={`${imageClass} relative group overflow-hidden rounded-lg shadow-md ${
    imageCount === 3 && index === 2 ? 'col-span-2 mx-auto max-w-[50%]' : ''
  }`}
>
  <Image
    src={imageUrl}
    alt={`Generated image ${index + 1}`}
    width={400}
    height={400}
    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
  />

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 text-white">
    <a
      href={imageUrl}
      download={`generated-image-${index + 1}.jpg`}
      className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition"
    >
      <Download className="w-4 h-4 inline-block bg-[#181818] hover:bg-black mr-1" />
      Download
    </a>

    <button className=" px-3 py-2 rounded-lg text-sm bg-[#181818] hover:bg-black transition">
      Share
    </button>

   <button
  className="bg-[#181818] hover:bg-black px-3 py-2 rounded-lg text-sm transition"
>
  Regenerate
</button>

<button
  className="bg-[#181818] hover:bg-black px-3 py-2 rounded-lg text-sm transition"
>
  Edit
</button>

  </div>
</div>

              </div>
            ))}
          </div>
        </div>

        {/* Prompt Section - Right Half */}
        {renderPromptSection()}
      </div>
    );
  }

  if (outputType === 'text') {
    const textOutput = Array.isArray(output) ? output.join('') : String(output);
    return (
      <div className="flex w-full h-full">
        {/* Result Section - Left Half */}
        <div className="w-1/2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Text</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{textOutput}</pre>
          </div>
        </div>

        {/* Prompt Section - Right Half */}
        {renderPromptSection()}
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* Result Section - Left Half */}
      <div className="w-1/2 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Output (JSON)</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
          <pre className="text-sm">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      </div>

      {/* Prompt Section - Right Half */}
      {renderPromptSection()}
    </div>
  );
}