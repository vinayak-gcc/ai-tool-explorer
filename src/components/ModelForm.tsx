'use client';

import { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';

interface ModelInputConfig {
  type: 'string' | 'integer' | 'number';
  default?: string | number;
  description?: string;
  required?: boolean;
  minimum?: number;
  maximum?: number;
  enum?: string[];
}

interface ModelSchema {
  name?: string;
  inputs: Record<string, ModelInputConfig>;
}

type ModelInputValue = string | number | undefined;

interface ModelFormProps {
  model: ModelSchema;
  onGenerate: (data: Record<string, ModelInputValue>) => void;
  isLoading: boolean;
}

export default function ModelForm({ model, onGenerate, isLoading }: ModelFormProps) {
  const [formData, setFormData] = useState<Record<string, ModelInputValue>>(() => {
    const initial: Record<string, ModelInputValue> = {};
    Object.entries(model.inputs).forEach(([key, cfg]) => {
      if (cfg.default !== undefined) initial[key] = cfg.default;
      else if (cfg.type === 'string') initial[key] = '';
      else initial[key] = cfg.minimum ?? 0;
    });
    return initial;
  });

  const [images, setImages] = useState<string[]>([]);
  const [isEditingPrompt, setIsEditingPrompt] = useState<boolean>(false);
  const [promptError, setPromptError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (key: string, value: ModelInputValue) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const promptKey = Object.keys(model.inputs).find(key => 
    key.toLowerCase().includes('prompt')
  );

  const validatePrompt = (prompt: string): string => {
    if (!prompt || prompt.trim().length === 0) {
      return 'Prompt cannot be empty';
    }
    if (prompt.length > 500) {
      return 'Prompt cannot exceed 500 characters';
    }
    return '';
  };

  const handlePromptChange = (value: string) => {
    if (promptKey) {
      handleInputChange(promptKey, value);
      const error = validatePrompt(value);
      setPromptError(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate prompt before submission
    if (promptKey) {
      const promptValue = formData[promptKey] as string || '';
      const error = validatePrompt(promptValue);
      if (error) {
        setPromptError(error);
        return;
      }
    }

    const data: Record<string, ModelInputValue> = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) data[k] = v;
    });
    onGenerate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length && images.length + newImages.length < 4; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }

    e.target.value = ''; // Reset input
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditPrompt = () => {
    setIsEditingPrompt(true);
  };

  const renderInput = (key: string, config: ModelInputConfig) => {
    const base =
      'w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-sm placeholder:text-neutral-400 text-white focus:ring-2 focus:ring-blue-500 outline-none transition';

    // Check if this is an output count/number field
    const isOutputField = key.toLowerCase().includes('num') || 
                         key.toLowerCase().includes('count') || 
                         key.toLowerCase().includes('output') ||
                         key.toLowerCase().includes('image');

    switch (config.type) {
      case 'string':
        if (config.enum) {
          return (
            <select
              title="Select an option"
              className={base}
              disabled={isLoading}
              value={formData[key] ?? config.default ?? config.enum[0]}
              onChange={e => handleInputChange(key, e.target.value)}
            >
              {config.enum.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        }
        return (
          <textarea
            className={base}
            rows={2}
            placeholder={config.description}
            disabled={isLoading}
            value={formData[key] as string}
            onChange={e => handleInputChange(key, e.target.value)}
          />
        );

      case 'integer':
      case 'number':
        // Apply output constraints for relevant fields
        const minValue = isOutputField ? Math.max(1, config.minimum ?? 1) : config.minimum;
        const maxValue = isOutputField ? Math.min(4, config.maximum ?? 4) : config.maximum;
        
        return (
          <input
            title="Enter a number"
            className={base}
            type="number"
            disabled={isLoading}
            min={minValue}
            max={maxValue}
            step={config.type === 'integer' ? 1 : 0.01}
            value={formData[key] ?? ''}
            onChange={e => {
              const val = e.target.value;
              let parsed = config.type === 'integer' ? parseInt(val) : parseFloat(val);
              
              // Enforce output constraints
              if (isOutputField && !isNaN(parsed)) {
                parsed = Math.min(Math.max(parsed, 1), 4);
              }
              
              handleInputChange(key, val === '' ? undefined : parsed);
            }}
          />
        );

      default:
        return (
          <input
            className={base}
            type="text"
            disabled={isLoading}
            placeholder={config.description}
            value={formData[key] as string}
            onChange={e => handleInputChange(key, e.target.value)}
          />
        );
    }
  };

  const hasReferenceImage = Object.keys(model.inputs).some(key =>
    key.toLowerCase().includes('image')
  );

  const currentPrompt = (promptKey && formData[promptKey]) ? formData[promptKey] as string : '';
  const isPromptValid = !promptError && currentPrompt.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-neutral-900 text-white p-5 rounded-xl border border-neutral-700 overflow-hidden"
    >
      <div className='overflow-y-auto max-h-[86vh] 2xl:max-h-[88vh] pr-2 -mr-2 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500'>

        <div className='border-b-neutral-700'>
          Properties
        </div>
        {model.name && (
          <div>
        
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
              Model
            </label>
            <div className="flex px-3 py-2 gap-2 bg-neutral-800 border border-neutral-600 rounded text-sm">
                  <Image 
            src="/model-name.svg"
            alt="Model Name"
            width={20}
            height={20}
            />
              {model.name}
            </div>
          </div>
        )}

        {!hasReferenceImage && (
          <div>
            <div className='flex gap-2'>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
              Reference Images
            </label>
                         <Image 
            src="/i.svg"
            alt="information"
            width={16}
            height={16}
            className='-mt-1 -ml-1'
            />
</div>

            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded overflow-hidden border border-neutral-600"
                >
                  <Image
                    src={img}
                    alt={`upload-${idx}`}
                    className="object-cover w-full h-full"
                    fill
                    sizes="64px"
                    style={{ objectFit: 'cover' }}
                    priority={true}
                  />
                  <button
                    title="Remove image"
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 p-0.5 rounded-bl"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <button
                  title='Upload an image'
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 border-2 border-dashed border-neutral-600 rounded flex items-center justify-center hover:bg-neutral-800 transition"
                >
                  <UploadCloud className="w-5 h-5 text-neutral-400" />
                </button>
              )}
            </div>

            <input
              title='Upload an image'
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Render all inputs except prompt */}
        {Object.entries(model.inputs)
          .filter(([key]) => !key.toLowerCase().includes('prompt'))
          .map(([key, config]) => (
            <div key={key}>
              <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              {isLoading ? (
                <div className="h-10 bg-neutral-700 rounded animate-pulse" />
              ) : (
                renderInput(key, config)
              )}
            </div>
          ))}
      </div>

{/* Input Field with Edit and Generate Button */}
<div className='md:absolute left-1/2 transform md:-translate-x-1/2 bottom-6 md:max-w-[36rem] w-full p-[1px] rounded-xl'
     style={{
       background: 'linear-gradient(90.63deg, #FFFFFF 2.03%, #707070 31.92%, #3E3E3E 52.37%, #FFFFFF 97.97%)'
     }}
     >
  <div className='flex p-1.5 w-full items-center justify-center bg-[#0a0a0a] px-2 rounded-xl'>
    <div className='flex flex-col my-1 sm:flex-row sm:my-0 items-center w-full'>
   
      <div className="flex flex-col w-4/5 max-w-[26.5rem]">
        {isEditingPrompt && promptKey ? (
          <div className="flex flex-col w-full">
            <textarea
              className={`flex w-full max-w-[25rem] h-auto px-3 py-2.5 bg-[#0a0a0a] text-white text-sm border-none focus:ring-0 focus:outline-none rounded-lg placeholder:text-white/60 resize-none min-h-[2.5rem] transition-all duration-200 ${
                promptError ? 'border-red-500 border' : ''
              }`}
              placeholder="Describe Your Scene"
              disabled={isLoading}
              value={currentPrompt}
              onChange={e => handlePromptChange(e.target.value)}
              onBlur={() => setIsEditingPrompt(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  setIsEditingPrompt(false);
                }
                if (e.key === 'Escape') {
                  setIsEditingPrompt(false);
                }
              }}
              rows={1}
              autoFocus
              style={{
                overflow: 'hidden',
                resize: 'none',
              }}
              onInput={(e) => {
                // Auto-resize textarea
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <div className="flex justify-between items-center mt-1 px-1">
              {promptError && (
                <span className="text-red-400 text-xs">{promptError}</span>
              )}
              <span className={`text-xs ml-auto mr-7 ${
                currentPrompt.length > 500 ? 'text-red-400' : 
                currentPrompt.length > 450 ? 'text-yellow-400' : 'text-neutral-400'
              }`}>
                {currentPrompt.length}/500
              </span>
            </div>
          </div>
        ) : (
          <div 
            className="flex w-full max-w-[25rem] h-auto px-3 py-2 text-sm text-white/80 cursor-pointer hover:text-white/90 transition-colors duration-200 min-h-[2.5rem] items-center rounded-lg hover:bg-white/5"
            onClick={handleEditPrompt}
          >
            <span className="line-clamp-3 break-words ">
              {currentPrompt || 'Describe Your Scene'}
            </span>
          </div>
        )}
      </div>

      <div className='flex space-x-2 w-1/5 items-center justify-center '>
        <div className="relative p-[1.5px] rounded-lg bg-gradient-to-r from-[#4F41D5] via-[#915EDA] to-[#DC683E]">
          <button
            type="button"
            onClick={handleEditPrompt}
            className="flex items-center justify-center bg-[#0f151c] rounded-lg w-9 h-10 hover:bg-[#4179b2] transition-colors duration-200"
            title="Edit Prompt"
          >
            <Image 
              src="/edit.svg" 
              alt="Edit" 
              width={16} 
              height={16}
              className="w-5 h-5"
            />
          </button>
        </div>

        <div className="relative flex items-center space-x-2">
          <div className="p-[1.5px] rounded-lg bg-gradient-to-r from-[#4F41D5] via-[#915EDA] to-[#DC683E]">
            <button
              type="submit"
              disabled={isLoading || !isPromptValid}
              className="flex text-white/90 items-center px-5 py-2 bg-[#0f151c] rounded-[calc(0.5rem-1px)] hover:bg-[#4179b2] transition-colors duration-200 font-medium disabled:opacity-50 max-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className='py-1 px-6 max-w-[120px] rounded-[calc(0.5rem-1px)] '>
                                      <LoadingSpinner size="sm" />
                  </div>
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

    </form>
  );
} 