export default function MetricBig({ label, value, customClass }) {
  return (
    <div className={`metric-big ${customClass}`}>
      <div className="metric-big-value">{value}</div>
      <div className="metric-big-label">{label}</div>
    </div>
  );
}