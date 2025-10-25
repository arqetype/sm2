import { SIDEBAR_WIDTH, useSidebar } from '../ui/sidebar';

const TRAFFIC_LIGHT_WIDTH = '5rem';

export function TitlebarSpace() {
  const { open } = useSidebar();
  return (
    <>
      <div
        className="h-full border-r border-border transition-[width] duration-200 ease-linear"
        style={{ width: open ? SIDEBAR_WIDTH : 0 }}
      ></div>
      <div
        style={{ width: open ? 0 : TRAFFIC_LIGHT_WIDTH }}
        className="transition-[width] duration-200"
      ></div>
    </>
  );
}
