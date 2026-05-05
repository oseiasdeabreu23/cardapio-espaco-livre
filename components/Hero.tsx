import Image from 'next/image';

export default function Hero() {
  return (
    <header
      className="relative overflow-hidden rounded-b-hero px-5 pb-7 pt-[max(env(safe-area-inset-top),20px)] text-white"
      style={{
        background:
          'linear-gradient(140deg, #C8141C 0%, #E5611B 60%, #F08A2E 100%)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-60px] top-[-60px] h-[180px] w-[180px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-40px] bottom-[-70px] h-[160px] w-[160px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-white shadow-logo">
          <Image
            src="/logo.png"
            alt="Logo Espaço Livre"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </div>

        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-semibold backdrop-blur-md"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.28)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-brand-green opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
          </span>
          Aberto agora
        </div>
      </div>

      <div className="relative mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/85">
          Cardápio Digital
        </p>
        <h1 className="mt-1 text-[34px] font-extrabold leading-[1.05] tracking-tight">
          Churrascaria
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #FFE8B0 0%, #FFC677 100%)',
            }}
          >
            Espaço Livre
          </span>
        </h1>
        <p className="mt-3 text-[13.5px] font-medium text-white/90">
          Churrasco, pizza e petiscos da casa
        </p>
      </div>
    </header>
  );
}
