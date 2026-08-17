"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Requirement = {
  productId: string;
  minBalance: number;
};

export type RequiredSavingsProducts = {
  mode: "all" | "any";
  requirements: Requirement[];
};

export type LoanProduct = {
  name: string;
  description: string;
  cbsProductId: number;
  minPrincipal: number;
  maxPrincipal: number;
  interestRatePerPeriod: number;
  termFrequency: number;
  termFrequencyType: number;
  numberOfRepayments: number;
  repaymentEvery: number;
  repaymentFrequencyType: number;
  minActiveMonths: number;
  maxActiveLoans: number;
  noLoansInArrears: boolean;
  autoDisburse: boolean;
  requiredSavingsProducts: RequiredSavingsProducts;
};

interface ProductsContextType {
  products: LoanProduct[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  reloadProducts: () => Promise<void>;
}

const ProductsContext =
  createContext<ProductsContextType | null>(null);

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<LoanProduct[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/loan-products", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ??
            result?.message ??
            "Failed to fetch loan products"
        );
      }

      const productData =
        result?.products?.data?.data ??
        result?.data?.products ??
        result?.products ??
        [];

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching loan products:",
        error
      );

      setProducts([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch loan products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        reloadProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used within ProductsProvider"
    );
  }

  return context;
}