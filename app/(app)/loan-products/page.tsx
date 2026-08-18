"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

import { useProducts } from "@/components/providers/loan-product-provider";
import PageContainer from "@/components/app-page-container";
import AppPageHeader from "@/components/app-page-header";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

export default function LoanProduct() {
  const {
    products,
    loading,
    error,
    fetchProducts,
  } = useProducts();

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <PageContainer className="min-h-screen space-y-4 p-4">
      <AppPageHeader
        title="Loan Products"
        description="Manage available loan products."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchProducts()}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="rounded-lg border bg-background p-6">
          <p className="text-sm text-muted-foreground">
            Total Loan Products
          </p>

          <p className="mt-1 text-3xl font-bold">
            {products.length}
          </p>
        </div>
      )}
    </PageContainer>
  );
}