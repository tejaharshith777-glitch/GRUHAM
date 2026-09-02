import { lazy, Suspense, useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Preloader from "@/components/Preloader";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";

// Code-split every page except Home (keep initial bundle small)
const HowItWorks       = lazy(() => import("@/pages/HowItWorks"));
const About            = lazy(() => import("@/pages/About"));
const Legal            = lazy(() => import("@/pages/Legal"));
const Gallery          = lazy(() => import("@/pages/Gallery"));
const Contact          = lazy(() => import("@/pages/Contact"));
const Designer         = lazy(() => import("@/pages/Designer"));
const Pricing          = lazy(() => import("@/pages/Pricing"));
const Contractors      = lazy(() => import("@/pages/Contractors"));
const BlueprintGenerator = lazy(() => import("@/pages/BlueprintGenerator"));
const InteriorDesign   = lazy(() => import("@/pages/InteriorDesign"));
const ExteriorDesign   = lazy(() => import("@/pages/ExteriorDesign"));
const CompoundDesign   = lazy(() => import("@/pages/CompoundDesign"));
const Materials        = lazy(() => import("@/pages/Materials"));
const DesignLibrary    = lazy(() => import("@/pages/DesignLibrary"));
const ContractorRegister = lazy(() => import("@/pages/ContractorRegister"));
const NotFound         = lazy(() => import("@/pages/NotFound"));

/** Gold spinner shown while a lazy page chunk is loading. */
function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="w-12 h-12 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin" />
    </div>
  );
}

/** Every screen of the app - the key is the route used by createPageUrl(). */
export const PAGES = {
  Home,
  HowItWorks,
  About,
  Legal,
  Gallery,
  Contact,
  Designer,
  Pricing,
  Contractors,
  BlueprintGenerator,
  InteriorDesign,
  ExteriorDesign,
  CompoundDesign,
  Materials,
  DesignLibrary,
  ContractorRegister,
};

import { ToastProvider } from "@/components/Toast";

import React, { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(true);
  const currentPageName = location.pathname.slice(1) || "Home";

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  // Hard safety fallback: guarantee preloader is dismissed after 1.5s max
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setShowPreloader(false);
    }, 1500);
    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <ToastProvider>
      <ErrorBoundary>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <Layout currentPageName={currentPageName}>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {Object.entries(PAGES).map(([name, Page]) => (
              <Route key={name} path={`/${name}`} element={<Page />} />
            ))}
            {/* Legacy redirects */}
            <Route path="/Services" element={<HowItWorks />} />
            <Route path="/Team" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
    </ToastProvider>
  );
}
