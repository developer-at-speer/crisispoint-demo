export function getIntakeScrollOffset(): number {
  const sticky = document.getElementById("intake-sticky-header");
  return (sticky?.offsetHeight ?? 128) + 16;
}

export function scrollToIntakeElement(
  elementId: string,
  scrollRootId = "workspace-scroll",
): void {
  const scrollRoot = document.getElementById(scrollRootId);
  const el = document.getElementById(elementId);
  if (!scrollRoot || !el) return;

  const rootRect = scrollRoot.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const offset = getIntakeScrollOffset();

  scrollRoot.scrollTo({
    top: scrollRoot.scrollTop + elRect.top - rootRect.top - offset,
    behavior: "smooth",
  });
}
