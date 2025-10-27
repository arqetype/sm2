export function SidebarFileDrop() {
  return (
    <div className="px-2">
      <div
        role="presentation"
        className="flex bg-background justify-center items-center w-full p-4 border-dashed border-2 border-foreground/20 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all select-none sticky bottom-0"
      >
        <div className="mx-auto">
          <p className="font-semibold text-center">Create a deck</p>
          <p className="text-xs text-muted-foreground text-center">
            Drag your courses here to create a deck
          </p>
        </div>
      </div>
    </div>
  );
}
