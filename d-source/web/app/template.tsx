/** Re-mounts on every navigation: each page fades up 24px over .55s. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="ds-page">{children}</div>;
}
