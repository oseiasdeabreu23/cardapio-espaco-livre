export default function ClosedBanner({ message }: { message: string }) {
  return (
    <div
      className="sticky top-0 z-30 px-5 py-2.5 text-center text-[12.5px] font-bold text-white"
      style={{
        background:
          'linear-gradient(90deg, #C8141C 0%, #E5611B 70%, #F08A2E 100%)',
      }}
      role="status"
    >
      ⏸ {message}
    </div>
  );
}
