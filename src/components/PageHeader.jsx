export default function PageHeader({ children }) {
  if (!children) return null;

  return <div className="mb-4 flex justify-end">{children}</div>;
}
