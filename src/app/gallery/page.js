import Navbar from "@/components/Navbar";

const images = [
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
    span: "md:col-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
    span: "md:col-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77",
    span: "md:col-span-2",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white pt-40 px-6 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
            The <span className="text-blue-600">Sanctuary</span>
          </h2>
          <p className="text-zinc-500 mt-4 max-w-xl">
            Step inside the arena where strength is forged. Every corner is
            designed to push limits and build greatness.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[200px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-[2rem] group ${img.span || ""}`}
            >
              {/* Image */}
              <img
                src={img.url}
                className="w-full h-full object-cover scale-100 group-hover:scale-110 transition duration-700 ease-out"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500" />

              {/* Gradient Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70" />

              {/* Content */}
              <div className="absolute bottom-0 p-6 translate-y-6 group-hover:translate-y-0 transition duration-500">
                <p className="text-xs tracking-widest uppercase text-blue-500 font-semibold mb-1">
                  Titan Gym
                </p>
                <h3 className="text-lg font-bold opacity-0 group-hover:opacity-100 transition duration-500">
                  Facility 0{i + 1}
                </h3>
              </div>

              {/* Glow Border Effect */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/5 group-hover:border-blue-500/40 transition duration-500" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
