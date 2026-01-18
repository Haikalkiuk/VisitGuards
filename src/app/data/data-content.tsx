"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { getLeafData, type LeafData } from "@/lib/data-sync";
import { useSearchParams } from "next/navigation";

export default function DataPageContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<LeafData[]>([]);

  // Load URL parameters on component mount
  useEffect(() => {
    const locationParam = searchParams.get("location");

    if (locationParam) {
      setSearchTerm(locationParam);
      setError(`🔍 Menampilkan data untuk lokasi: ${locationParam}`);
      setTimeout(() => setError(null), 5000);
    }
  }, [searchParams]);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = getLeafData();
        setTableData(
          data.length > 0
            ? data
            : [
                {
                  id: "1",
                  date: new Date("2024-01-15T08:30:00"),
                  plantId: "VINE-001",
                  status: "healthy" as const,
                  confidence: 0.95,
                  location: "Area A - Plot 1",
                },
              ],
        );
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Gagal memuat data");
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTableData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;
      const matchesSearch =
        item.plantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchTerm, tableData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div
          className={`mb-6 rounded-lg p-4 flex items-center gap-3 ${
            error.includes("✅")
              ? "bg-green-50 border border-green-200"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div
            className={`w-5 h-5 flex-shrink-0 ${error.includes("✅") ? "text-green-600" : "text-blue-600"}`}
          >
            {error.includes("✅") ? "✓" : "🔍"}
          </div>
          <p
            className={`flex-1 font-medium ${error.includes("✅") ? "text-green-800" : "text-blue-800"}`}
          >
            {error}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Daun</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Plant ID atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Semua Status</option>
            <option value="healthy">Sehat</option>
            <option value="diseased">Sakit</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Tanggal</th>
                <th className="px-6 py-3 text-left">Plant ID</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Confidence</th>
                <th className="px-6 py-3 text-left">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                filteredTableData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 font-medium">{item.plantId}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">{item.location}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
