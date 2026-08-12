"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy, Eye, EyeOff } from "lucide-react";

import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProviderSetting = {
  key: string;
  value: unknown;
  encrypted: boolean;
};

export default function ProviderDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [provider, setProvider] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Guards against setting state after the component has unmounted or
    // the id has changed mid-request (e.g. fast navigation between pages).
    let cancelled = false;

    async function fetchProvider() {
      try {
        setLoading(true);

        const response = await fetch("/api/providers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const payload = await response.json();
        const providerList = payload?.providers?.data?.data ?? [];

        const selectedProvider = providerList.find((item: any) => {
          return (
            String(item?.ID ?? item?.id ?? item?.provider_id ?? "") ===
            String(id)
          );
        });

        if (!cancelled) {
          setProvider(selectedProvider ?? null);
        }
      } catch (error) {
        console.error("Error fetching provider:", error);

        if (!cancelled) {
          notify.error("Failed to load provider details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchProvider();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const settingRows = extractSettings(provider);
  const isActive = resolveActive(provider);
  const isDefault = resolveDefault(provider);

  const toggleReveal = (index: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const copySettingValue = async (value: unknown) => {
    if (value === null || value === undefined) {
      notify.error("Nothing to copy");

      return;
    }

    const valueText = String(value);

    if (!valueText) {
      notify.error("Nothing to copy");

      return;
    }

    try {
      await navigator.clipboard.writeText(valueText);
      notify.success("Setting value copied");
    } catch (error) {
      console.error("Unable to copy value:", error);
      notify.error("Unable to copy value");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Provider Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Provider configuration and settings overview
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader text="Loading provider details..." />
        </div>
      ) : !provider ? (
        <div className="rounded-md border bg-white p-6">
          <p className="text-sm text-red-600">Provider not found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Overview</h2>
            </div>

            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>
                      {provider?.name ?? provider?.Name ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Driver</TableCell>
                    <TableCell>
                      {provider?.driver ?? provider?.Driver ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Category</TableCell>
                    <TableCell>
                      {provider?.category ?? provider?.Category ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Environment</TableCell>
                    <TableCell>
                      {provider?.environment ?? provider?.Environment ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Priority</TableCell>
                    <TableCell>
                      {provider?.priority ?? provider?.Priority ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>
                      {isActive === undefined
                        ? "N/A"
                        : isActive
                          ? "Active"
                          : "Inactive"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Default</TableCell>
                    <TableCell>{isDefault ? "Yes" : "No"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>

            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Setting</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Encrypted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settingRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No settings are available for this provider.
                      </TableCell>
                    </TableRow>
                  ) : (
                    settingRows.map((row, index) => {
                      const hasValue =
                        row.value !== null && row.value !== undefined;

                      const isHidden = row.encrypted && !revealed.has(index);

                      return (
                        <TableRow key={`${row.key}-${index}`}>
                          <TableCell className="font-medium">
                            {row.key}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">
                                {!hasValue
                                  ? "—"
                                  : isHidden
                                    ? "••••••••"
                                    : String(row.value)}
                              </span>

                              {hasValue && !isHidden && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger
                                      render={
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() =>
                                            copySettingValue(row.value)
                                          }
                                          aria-label="Copy setting value"
                                        >
                                          <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                      }
                                    />
                                    <TooltipContent side="top">
                                      Copy value
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              {row.encrypted && hasValue && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => toggleReveal(index)}
                                  aria-label={
                                    isHidden ? "Show value" : "Hide value"
                                  }
                                >
                                  {isHidden ? (
                                    <Eye className="h-3.5 w-3.5" />
                                  ) : (
                                    <EyeOff className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{row.encrypted ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Backend responses have been observed with inconsistent key casing
 * (e.g. `Name` vs `name`, `Settings` vs `settings`). These helpers
 * normalize field access in one place instead of repeating fallback
 * chains — and fixing a bug — throughout the component.
 */

function resolveActive(
  provider: Record<string, any> | null,
): boolean | undefined {
  if (!provider) return undefined;

  if (typeof provider.active === "boolean") return provider.active;
  if (typeof provider.Active === "boolean") return provider.Active;

  if (typeof provider.status === "string") {
    return provider.status.toLowerCase() === "active";
  }
  if (typeof provider.Status === "string") {
    return provider.Status.toLowerCase() === "active";
  }

  return undefined;
}

function resolveDefault(provider: Record<string, any> | null): boolean {
  if (!provider) return false;

  return Boolean(
    provider.is_default ?? provider.IsDefault ?? provider.default ?? false,
  );
}

function extractSettings(
  provider: Record<string, any> | null,
): ProviderSetting[] {
  if (!provider) {
    return [];
  }

  const settingSource = provider.settings ?? provider.Settings ?? [];

  if (Array.isArray(settingSource)) {
    if (settingSource.length > 0) {
      // Helps diagnose field-name/casing mismatches straight from devtools —
      // safe to remove once you've confirmed the real shape.
      console.debug("[ProviderDetails] raw setting item:", settingSource[0]);
    }

    return settingSource.map((item) => {
      const normalizedSetting = item && typeof item === "object" ? item : {};

      return {
        key: normalizeString(
          getField(normalizedSetting, [
            "key",
            "name",
            "setting",
            "setting_key",
            "settingKey",
            "key_name",
            "keyName",
            "field",
            "field_name",
            "label",
          ]),
        ),
        value:
          getField(normalizedSetting, [
            "value",
            "setting_value",
            "settingValue",
            "val",
          ]) ?? "",
        encrypted: Boolean(
          getField(normalizedSetting, [
            "encrypted",
            "is_encrypted",
            "isEncrypted",
            "secret",
            "is_secret",
          ]) ?? false,
        ),
      };
    });
  }

  if (settingSource && typeof settingSource === "object") {
    return Object.entries(settingSource).map(([key, value]) => {
      const valueObject =
        value && typeof value === "object"
          ? (value as Record<string, any>)
          : undefined;

      return {
        key,
        value: valueObject
          ? (getField(valueObject, [
              "value",
              "setting_value",
              "settingValue",
            ]) ?? "")
          : value,
        encrypted: valueObject
          ? Boolean(
              getField(valueObject, [
                "encrypted",
                "is_encrypted",
                "isEncrypted",
              ]) ?? false,
            )
          : false,
      };
    });
  }

  return [];
}

/**
 * Looks up a value on an object by trying each candidate name, matched
 * case-insensitively against the object's actual keys. This covers APIs
 * that mix casing conventions (e.g. `Key` vs `key` vs `setting_key`).
 */
function getField(obj: Record<string, any>, candidates: string[]) {
  const lowerToActualKey = new Map(
    Object.keys(obj).map((k) => [k.toLowerCase(), k]),
  );

  for (const candidate of candidates) {
    const actualKey = lowerToActualKey.get(candidate.toLowerCase());

    if (actualKey !== undefined && obj[actualKey] !== undefined) {
      return obj[actualKey];
    }
  }

  return undefined;
}

function normalizeString(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return String(value);
}
