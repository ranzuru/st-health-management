import Chip from "@mui/material/Chip";

function StatusBadge({ value, colorMapping }) {
  const bgColor = colorMapping[value]?.bgColor || "bg-gray-300";
  const textColor = colorMapping[value]?.textColor || "text-gray-800";
  const borderColor = colorMapping[value]?.borderColor || "border-transparent";

  return (
    <Chip
      label={value}
      size="small"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px", // Tailwind's rounded-lg utility usually means 8px
      }}
    />
  );
}
export default StatusBadge;
