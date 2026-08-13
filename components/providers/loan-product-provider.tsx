"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type LoanProduct = {
  id: string;
  name: string;
  description?: string;
  cbsProductId: number;
  minPrincipal: number;
  maxPrincipal: number;
  interestRatePerPeriod: number;
  termFrequency: number;
  termFrequencyType: number;
  numberOfRepayments: number;
  active: boolean;
};

interface ProductsContextType {
  products: LoanProduct[];
  loading: boolean;
  reloadProducts: () => Promise<void>;
}

const ProductsContext =
  createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/loan-products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            data?.message ??
            "Failed to fetch loan products"
        );
      }

      console.log("Products response:", data);

      const productData =
        data?.data?.data ??
        data?.data ??
        [];

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        reloadProducts: fetchProducts,
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