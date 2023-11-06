function StatusCell({ value, colorMapping }) {
  const bgColor = colorMapping[value]?.bgColor || "#E0E0E0";
  const textColor = colorMapping[value]?.textColor || "#333333";
  const borderColor = colorMapping[value]?.borderColor || "transparent";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "1px 8px",
          borderRadius: 8,
          backgroundColor: bgColor,
          color: textColor,
          fontSize: "12px",
          border: `1px solid ${borderColor}`,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default StatusCell;
