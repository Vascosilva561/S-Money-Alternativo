
/**
 * Componente "Composição do saldo"
 *
 * Props:
 *  - items: [{ label, value, color }]
 *      value pode ser número (Kz) — a largura de cada segmento
 *      é proporcional ao valor dentro do total.
 *  - formatValue: função opcional para formatar o valor exibido (default: "X,XXM Kz")
 */

export default function ComposicaoSaldoProgressBar({
  items = [
    { label: "Disponível", value: 5.92, color: "#16A34A" }, // verde
    { label: "Pendente", value: 2.8, color: "#F59E0B" }, // laranja
    { label: "Bloqueado", value: 1.46, color: "#EF4444" }, // vermelho
  ],
  formatValue = (v:number) => `${v.toFixed(2).replace(".", ",")}M Kz`,
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        background: "#fff",
        borderRadius: 12,
        //padding: "20px 24px",
        maxWidth: 580,
        //boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        //border: "1px solid #F1F1F1",
      }}
    >
      {/* Título */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#7D8CA6",
          marginBottom: 14,
        }}
      >
        Composição do saldo
      </div>

      {/* Barra */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: 8,
          borderRadius: 999,
          overflow: "hidden",
          gap: 3,
          marginBottom: 16,
        }}
      >
        {items.map((item, i) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div
              key={i}
              style={{
                width: `${pct}%`,
                minWidth: pct > 0 ? 4 : 0,
                backgroundColor: item.color,
                borderRadius: 999,
                transition: "width 0.4s ease",
              }}
              title={`${item.label}: ${formatValue(item.value)}`}
            />
          );
        })}
      </div>

      {/* Legenda */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 20px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#7D8CA6",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: item.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#8A93A0" }}>{item.label}</span>
            <span style={{ fontWeight: 600 }}>{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}