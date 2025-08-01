import Image from 'next/image';
import Link from 'next/link';

export interface Model {
  id: string;
  name: string;
  description: string;
  owner: string;
  outputType: string;
  imageUrl: string; 
}

interface ModelCardProps {
  model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="flex w-full bg-neutral-900 text-white rounded-xl overflow-hidden shadow-lg border border-neutral-700">
      {/* Image Section */}
      <div className="relative w-1/2 h-40">
        <Image
          src="/model.svg"
          alt={model.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Text Content */}
      <div className="w-1/2 px-4 bg-[#262626] pt-3 pb-3 flex flex-col justify-between">
        <div>
          <h2 className="text-md font-semibold">{model.name}</h2>
          <p className="text-sm text-neutral-300 line-clamp-3 mt-1">
            {model.description}
          </p>
        </div>
        <Link
          href={`/model/${model.id}`}
          className="text-md text-blue-400"
        >
          <button className="px-3 py-1 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 flex items-center justify-end">
          Try Now
          </button>
        </Link>
      </div>
    </div>
  );
}