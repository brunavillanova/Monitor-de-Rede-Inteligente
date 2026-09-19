interface Props {
  title: string;
  value: number;
}

export function StatsCard({
  title,
  value,
}: Props) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "12px",
        padding: "20px",
        minWidth: "220px",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          fontSize: "20px",
          color: "white",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        {value}
      </div>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        Equipamentos
      </p>
    </div>
  );
}