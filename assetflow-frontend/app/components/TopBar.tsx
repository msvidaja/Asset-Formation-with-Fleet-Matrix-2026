const NAV = ["Overview", "Fleet", "Assets", "Maintenance", "Reports"];

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--hair)] bg-[rgba(10,10,10,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-6 px-5 sm:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="fist" aria-hidden>✊</span>
          <span className="display text-lg">
            Asset<span className="text-[var(--brand)]">Flow</span>
          </span>
        </a>

        <nav className="ml-4 hidden items-center gap-6 md:flex">
          {NAV.map((item, i) => (
            <a key={item} href="#" className="nav-link" data-active={i === 0}>
              {item}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="pill pill-up hidden sm:inline-flex">
            <span aria-hidden>●</span> All systems go
          </span>
          <button className="btn-brand text-sm">✊ Deploy Unit</button>
        </div>
      </div>
    </header>
  );
}
