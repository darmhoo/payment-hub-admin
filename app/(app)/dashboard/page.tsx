"use client";

import { Button } from "@/components/ui/button";
import PageContainer from "@/components/app-page-container";
import AppPageHeader from "@/components/app-page-header";
import AppStatCard from "@/components/app-stat-card";
import { ArrowLeftRight, CreditCard, SquareUser } from "lucide-react";
import DashboardModal from "@/components/dashboard-modal";

export default function Dashboard() {

  return (
    <PageContainer className="min-h-screen bg-slate-100">
      <AppPageHeader
        title="Dashboard"
        description="Overview of your Payment Gateway and SMS platform."
        action={<Button>Export</Button>}
      />

      <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-3 bg-slate-100">
        <AppStatCard
          title="Users"
          value="12,486"
          icon={<SquareUser className="h-5 w-5" />}
          subtitle="All users"
        />
        <AppStatCard
          title="Providers"
          value="12,486"
          icon={<CreditCard className="h-5 w-5" />}
          subtitle="All providers"
        />
        <AppStatCard
          title="Transactions"
          value="12,486"
          icon={<ArrowLeftRight  className="h-5 w-5" />}
          subtitle="All transactions"
        />
        
        {/* <AppStatCard
          title="Loan Products"
          value="12,486"
          icon={<FolderKanban  className="h-5 w-5" />}
          subtitle="All loan products"
        /> */}
      </div>

      {/* <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-3 bg-slate-100"> */}
        <div className="grid gap-6 lg:grid-cols-3">
      <DashboardModal />
      </div>
    </PageContainer>
  );
}
