/** Fixed, GPU-friendly gradient blobs that sit behind the whole page. */
export default function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="blob -left-[10vw] -top-[10vh] h-[48vmax] w-[48vmax] bg-violet/45" />
      <div
        className="blob -right-[12vw] top-[18vh] h-[42vmax] w-[42vmax] bg-electric/35"
        style={{ animationDelay: "-6s", animationDuration: "26s" }}
      />
      <div
        className="blob -bottom-[15vh] left-[20vw] h-[40vmax] w-[40vmax] bg-pink/30"
        style={{ animationDelay: "-12s", animationDuration: "30s" }}
      />
      <div
        className="blob -bottom-[5vh] -right-[8vw] h-[30vmax] w-[30vmax] bg-orange/20"
        style={{ animationDelay: "-3s", animationDuration: "24s" }}
      />
      <div className="grid-bg absolute inset-0 opacity-70" />
    </div>
  );
}
