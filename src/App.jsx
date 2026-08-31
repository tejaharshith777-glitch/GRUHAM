import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Team from "@/pages/Team";
import BookingNotifications from "@/pages/BookingNotifications";
import AdminBookings from "@/pages/AdminBookings";
import Sitemap from "@/pages/Sitemap";
import Designer from "@/pages/Designer";
import Pricing from "@/pages/Pricing";
import Contractors from "@/pages/Contractors";
import BlueprintGenerator from "@/pages/BlueprintGenerator";
import InteriorDesign from "@/pages/InteriorDesign";
import ExteriorDesign from "@/pages/ExteriorDesign";
import CompoundDesign from "@/pages/CompoundDesign";
import Materials from "@/pages/Materials";
import DesignLibrary from "@/pages/DesignLibrary";
import ContractorRegister from "@/pages/ContractorRegister";
import NotFound from "@/pages/NotFound";

/** Every screen of the app - the key is the route used by createPageUrl(). */
export const PAGES = {
  Home,
  Services,
  Gallery,
  Contact,
  Team,
  BookingNotifications,
  AdminBookings,
  Sitemap,
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

export default function App() {
  const location = useLocation();
  const currentPageName = location.pathname.slice(1) || "Home";

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        {Object.entries(PAGES).map(([name, Page]) => (
          <Route key={name} path={`/${name}`} element={<Page />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
