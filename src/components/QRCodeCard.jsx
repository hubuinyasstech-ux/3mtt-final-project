import QRCode from "react-qr-code";

export default function QRCodeCard({ value = "", size = 128 }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow text-center">
      <QRCode value={value || ""} size={size} />
      <p className="mt-3 text-sm text-gray-600 wrap-break-words">{value}</p>
    </div>
  );
}
