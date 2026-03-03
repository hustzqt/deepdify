export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-14 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2026 Deepdify. rights reserved.
          All </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with React + TypeScript + Tailwind CSS
        </p>
      </div>
    </footer>
  )
}
