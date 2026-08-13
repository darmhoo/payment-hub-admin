"use client";

import { useProducts } from "@/components/providers/loan-product-provider";

export default function LoanProduct() {
  const {
    products,
    loading,
    reloadProducts,
  } = useProducts();

  return (
    <div>
      <h1>Loan Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          Total Loan Products: {products.length}
        </p>
      )}
    </div>
  );
}