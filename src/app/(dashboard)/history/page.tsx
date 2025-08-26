"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataEntry {
  id: string;
  value1: number;
  value2: number;
  value3: number;
  createdAt: string;
  updatedAt: string;
}

export default function HistoryPage() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data-entries");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch data entries");
        }

        setData(result.dataEntries || []);
      } catch (err) {
        console.error("Error fetching data entries:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load data entries"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-muted-foreground">
          View all your previous data entries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Entry History</CardTitle>
          <CardDescription>
            All your tracked data entries in chronological order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">
              Loading data entries...
            </p>
          ) : data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No data entries found. Start by adding some data.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Value 1</TableHead>
                  <TableHead>Value 2</TableHead>
                  <TableHead>Value 3</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.createdAt)}</TableCell>
                    <TableCell className="font-medium">
                      {entry.value1.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.value2.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.value3.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Recorded</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
