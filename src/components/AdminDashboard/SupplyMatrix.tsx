import React from "react";
import { Width, Length } from "../../types";

interface SupplyMatrixProps {
  summary: Record<string, Record<string, number>>;
  widths: Width[];
  lengths: Length[];
}

export const SupplyMatrix: React.FC<SupplyMatrixProps> = ({
  summary,
  widths,
  lengths,
}) => {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-black">
        Supply Summary (Size Matrix)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-emerald-300 bg-emerald-100 p-2 font-semibold text-black text-sm">
                Length
              </th>
              {widths.map((width) => (
                <th
                  key={width}
                  className="border border-emerald-300 bg-emerald-100 p-2 font-semibold text-black text-sm w-16"
                >
                  {width}
                </th>
              ))}
              <th className="border border-emerald-300 bg-emerald-100 p-2 font-semibold text-black text-sm w-16">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {lengths.map((length) => {
              const rowTotal = widths.reduce(
                (sum, width) => sum + summary[length][width],
                0,
              );
              return (
                <tr key={length}>
                  <td className="border border-gray-300 bg-white p-2 font-semibold text-black text-sm">
                    {length}
                  </td>
                  {widths.map((width) => {
                    const count = summary[length][width];
                    return (
                      <td
                        key={`${length}-${width}`}
                        className={`border border-gray-300 p-2 text-center font-bold text-sm ${
                          count > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-white text-gray-400"
                        }`}
                      >
                        {count > 0 ? count : "—"}
                      </td>
                    );
                  })}
                  <td className="border border-gray-300 bg-blue-50 p-2 text-center font-bold text-sm text-blue-700">
                    {rowTotal > 0 ? rowTotal : "—"}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-black/5">
              <td className="border border-emerald-300 bg-black font-bold text-white p-2 text-sm">
                Total
              </td>
              {widths.map((width) => {
                const colTotal = lengths.reduce(
                  (sum, length) => sum + summary[length][width],
                  0,
                );
                return (
                  <td
                    key={`total-${width}`}
                    className="border border-emerald-300 bg-black text-center font-bold text-white p-2 text-sm"
                  >
                    {colTotal}
                  </td>
                );
              })}
              <td className="border border-emerald-300 bg-black text-center font-bold text-white p-2 text-sm">
                {lengths.reduce((sum, length) => {
                  return (
                    sum +
                    widths.reduce(
                      (widthSum, width) => widthSum + summary[length][width],
                      0,
                    )
                  );
                }, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
