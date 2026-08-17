export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: Record<keyof T, string>,
  filename: string
) {
  if (!data.length) {
    return;
  }

  const headerRow = Object.values(headers);

  const rows = data.map((item) =>
    Object.keys(headers).map((key) => {
      const value = item[key];

      const escapedValue = String(value ?? "").replace(
        /"/g,
        '""'
      );

      return `"${escapedValue}"`;
    })
  );

  const csvContent = [headerRow, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}-${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}