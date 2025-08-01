import ModelCard from '@/components/ModelCard';
import { MODELS } from '@/lib/models';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">

      <div >
       <div className="w-full overflow-x-auto lg:overflow-visible">
  <div className="flex lg:flex-wrap gap-x-6 gap-y-6 mt-8 max-w-[1024px] 2xl:mx-auto mb-12 px-2 lg:px-0 ">
    <div className="flex-shrink-0">
      <Image
        src="/Img1.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-14 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img2.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-14 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img3.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-8 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img4.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-4 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img5.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-0 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img6.svg"
        alt="Logo"
        width={80}
        height={80}
        className="-mt-4 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img7.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-2 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img8.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-8 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img9.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-14 rounded-lg bg-white w-20 h-20"
      />
    </div>
    <div className="flex-shrink-0">
      <Image
        src="/Img10.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mt-8 rounded-lg bg-white w-20 h-20"
      />
    </div>
  </div>
</div>

      </div>


        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
         <h1
  className="text-[52.01px] mb-8 font-medium leading-[120%] text-center text-white/90 max-w-[26rem]"
  style={{
    background: "linear-gradient(93.37deg, #8F8F8F -5.79%, #FFFFFF 42.73%, #999999 114.02%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  AI Multi Model Image Generator
</h1>

          </div>
          <p className="text-lg text-white/80 max-w-2xl mt-8 mx-auto">
Generate high-quality, unique images using multiple AI models.
          </p>
          <button className=' mt-8 px-8 py-2 rounded-2xl bg-[#171717] hover:bg-purple-600 border border-white/20'>
            Start now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mt-8 md:mt-[8rem] mx-auto gap-8">
          {MODELS.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}