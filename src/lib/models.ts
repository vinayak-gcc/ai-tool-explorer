export type ModelInputType = 'string' | 'integer' | 'number';

export interface ModelInputConfig {
  type: ModelInputType;
  default?: string | number;
  description?: string;
  required?: boolean;
  minimum?: number;
  maximum?: number;
  enum?: string[];
}

export interface ModelSchema {
  id: string;
  name: string;
  description: string;
  owner: string;
  model: string;
   imageUrl: string;
  inputs: Record<string, ModelInputConfig>;
  outputType: 'image' | 'text' | 'json';
}

export const MODELS: ModelSchema[] = [
  {
    id: 'sdxl',
    name: 'Stable Diffusion XL',
    description: 'High-resolution text-to-image generation with Stable diffusion ( SDXL )',
    owner: 'stability-ai',
    model: 'sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
   imageUrl: '/model.svg',
    inputs: {
      prompt: { type: 'string', required: true },
      width: { type: 'integer', default: 768, minimum: 512, maximum: 1024 },
      height: { type: 'integer', default: 768, minimum: 512, maximum: 1024 },
      num_outputs: { type: 'integer', default: 1, minimum: 1, maximum: 4 },
      guidance_scale: { type: 'number', default: 7.5 },
      num_inference_steps: { type: 'integer', default: 25 },
      refine: {
        type: 'string',
        default: 'expert_ensemble_refiner',
        enum: ['no_refiner', 'expert_ensemble_refiner', 'base_image_refiner'],
      },
      scheduler: { type: 'string', default: 'K_EULER' },
      lora_scale: { type: 'number', default: 0.6, minimum: 0, maximum: 1 },
      apply_watermark: { type: 'string', default: 'false', enum: ['true', 'false'] },
      high_noise_frac: { type: 'number', default: 0.8, minimum: 0, maximum: 1 },
      negative_prompt: { type: 'string', default: '' },
      prompt_strength: { type: 'number', default: 0.8, minimum: 0, maximum: 1 },
    },
    outputType: 'image',
  },
  {
    id: 'anything-v3',
    name: 'Anything V3 (Anime)',
    description: 'Anime-style image generator fine-tuned from stable diffusion',
    owner: 'cjwbw',
    model: 'anything-v3.0:f410ed4c6a0c3bf8b76747860b3a3c9e4c8b5a827a16eac9dd5ad9642edce9a2',
   imageUrl: '/model.svg',
    inputs: {
      prompt: { type: 'string', required: true },
      width: { type: 'integer', default: 512 },
      height: { type: 'integer', default: 512 },
      num_outputs: { type: 'integer', default: 1, minimum: 1, maximum: 4 },
      guidance_scale: { type: 'number', default: 12 },
      num_inference_steps: { type: 'integer', default: 50 },
    },
    outputType: 'image',
  },
  {
    id: 'dreamshaper',
    name: 'DreamShaper',
    description: 'General-purpose image generator supporting stylized output',
    owner: 'cjwbw',
    model: 'dreamshaper:ed6d8bee9a278b0d7125872bddfb9dd3fc4c401426ad634d8246a660e387475b',
   imageUrl: '/model.svg',
    inputs: {
      prompt: { type: 'string', required: true },
      negative_prompt: { type: 'string', default: '' },
      width: { type: 'integer', default: 512 },
      height: { type: 'integer', default: 768 },
      scheduler: { type: 'string', default: 'K_EULER_ANCESTRAL' },
      num_outputs: { type: 'integer', default: 1, minimum: 1, maximum: 4 },
      guidance_scale: { type: 'number', default: 7.5 },
      num_inference_steps: { type: 'integer', default: 50 },
    },
    outputType: 'image',
  },
  {
    id: 'lcm-sdxl',
    name: 'LCM SDXL (Fast)',
    description: 'Fast SDXL generation with LCM (Latent Consistency Model)',
    owner: 'dhanushreddy291',
    model: 'lcm-sdxl:5998ad9525e76b3cbb51798800d6f31353d8b726cb2af928a062cc8ade79465f',
   imageUrl: '/model.svg',
    inputs: {
      prompt: { type: 'string', required: true },
      negative_prompt: {
        type: 'string',
        default: '3d, cgi, render, bad quality, normal quality',
      },
      num_outputs: { type: 'integer', default: 1, minimum: 1, maximum: 4 },
      num_inference_steps: { type: 'integer', default: 7, minimum: 1, maximum: 50 },
    },
    outputType: 'image',
  },
];

export function getModelById(id: string): ModelSchema | undefined {
  return MODELS.find((model) => model.id === id);
}

export function getModelString(model: Pick<ModelSchema, 'owner' | 'model'>): `${string}/${string}` {
  return `${model.owner}/${model.model}`;
}