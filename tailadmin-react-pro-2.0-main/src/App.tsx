// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { HomeRedirect } from "./components/auth/HomeRedirect";
import ProtectedPermissionRoute from "./components/auth/ProtectedPermissionRoute";
import { Permission } from "./config/permissions";
import CreateIssueModal from "./main pages/Request Creation/CreateIssueModal";
import { useState, useEffect, useRef } from 'react';
import Ecommerce from "./pages/Dashboard/Ecommerce";
import Stocks from "./pages/Dashboard/Stocks";
import Crm from "./pages/Dashboard/Crm";
import Marketing from "./pages/Dashboard/Marketing";
import Analytics from "./pages/Dashboard/Analytics";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import CompleteInvitation from "./pages/AuthPages/CompleteInvitation";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Carousel from "./pages/UiElements/Carousel";
import Maintenance from "./pages/OtherPage/Maintenance";
import FiveZeroZero from "./pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "./pages/OtherPage/FiveZeroThree";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Pagination from "./pages/UiElements/Pagination";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import ButtonsGroup from "./pages/UiElements/ButtonsGroup";
// import Notifications from "./pages/UiElements/Notifications";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import PieChart from "./pages/Charts/PieChart";
import Invoices from "./pages/Invoices";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import FileManager from "./pages/FileManager";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import DataTables from "./pages/Tables/DataTables";
import PricingTables from "./pages/PricingTables";
import Faqs from "./pages/Faqs";
import Chats from "./pages/Chat/Chats";
import FormElements from "./pages/Forms/FormElements";
import FormLayout from "./pages/Forms/FormLayout";
import Blank from "./pages/Blank";
import EmailInbox from "./pages/Email/EmailInbox";
import EmailDetails from "./pages/Email/EmailDetails";

import TaskKanban from "./pages/Task/TaskKanban";
import BreadCrumb from "./pages/UiElements/BreadCrumb";
import Cards from "./pages/UiElements/Cards";
import Dropdowns from "./pages/UiElements/Dropdowns";
import Links from "./pages/UiElements/Links";
import Lists from "./pages/UiElements/Lists";
import Popovers from "./pages/UiElements/Popovers";
import Progressbar from "./pages/UiElements/Progressbar";
import Ribbons from "./pages/UiElements/Ribbons";
import Spinners from "./pages/UiElements/Spinners";
import Tabs from "./pages/UiElements/Tabs";
import Tooltips from "./pages/UiElements/Tooltips";
import Modals from "./pages/UiElements/Modals";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import TwoStepVerification from "./pages/AuthPages/TwoStepVerification";
import Success from "./pages/OtherPage/Success";
import AppLayout from "./layout/AppLayout";
import AlternativeLayout from "./layout/AlternativeLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import TaskList from "./pages/Task/TaskList";
import Saas from "./pages/Dashboard/Saas";
import Logistics from "./pages/Dashboard/Logistics";
import TextGeneratorPage from "./pages/Ai/TextGenerator";
import ImageGeneratorPage from "./pages/Ai/ImageGenerator";
import CodeGeneratorPage from "./pages/Ai/CodeGenerator";
import VideoGeneratorPage from "./pages/Ai/VideoGenerator";
import ProductList from "./pages/Ecommerce/ProductList";
import AddProduct from "./pages/Ecommerce/AddProduct";
import Billing from "./pages/Ecommerce/Billing";
import SingleInvoice from "./pages/Ecommerce/SingleInvoice";
import CreateInvoice from "./pages/Ecommerce/CreateInvoice";
import Transactions from "./pages/Ecommerce/Transactions";
import SingleTransaction from "./pages/Ecommerce/SingleTransaction";
import TicketList from "./pages/Support/TicketList";
import TicketReply from "./pages/Support/TicketReply";
import Integrations from "./pages/OtherPage/Integrations";
import ApiKeys from "./pages/OtherPage/ApiKeys";
import UsersList from "./pages/UsersList";
import SendInvitation from "./pages/SendInvitation";
import Organizations from "./pages/Organizations";
import AllOpen from "./main pages/Request Management/AllOpen";
import RequestSplitView from "./main pages/Request Management/RequestSplitView";
import VendorList from "./main pages/Vendor Management/VendorList";
import VendorAgreements from "./main pages/Vendor Management/VendorAgreements";
import VendorAgreementDetails from "./main pages/Vendor Management/VendorAgreementDetails";
import RenewalVendor from "./main pages/Vendor Management/VendorRenewal/Renewal_vendor";
import ProcurementRenewal from "./main pages/Procurement Request/procurement-renewal";

export default function App() {
  console.log('App: Component rendered');
  
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const initialExistingContractIdRef = useRef<string | null>(null);
  
  // Listen for the custom event to open the modal
  useEffect(() => {
    const handleOpenCreateIssueModal = () => {
      setIsCreateIssueModalOpen(true);
    };
    
    window.addEventListener('openCreateIssueModal', handleOpenCreateIssueModal);
    
    return () => {
      window.removeEventListener('openCreateIssueModal', handleOpenCreateIssueModal);
    };
  }, []);
  
  // Listen for the custom event from procurement renewal page to open the modal
  useEffect(() => {
    const handleOpenCreateModal = (event: CustomEvent) => {
      // Set initial contract type to 'existing' and pass the existing contract ID
      const existingContractId = event.detail?.existingContractId || null;
      if (existingContractId) {
        // We'll need to pass this to the modal, but we'll handle it by storing in a ref
        // and using it when the modal opens
        initialExistingContractIdRef.current = existingContractId;
      }
      setIsCreateIssueModalOpen(true);
    };
    
    window.addEventListener('openCreateModal', handleOpenCreateModal as EventListener);
    
    return () => {
      window.removeEventListener('openCreateModal', handleOpenCreateModal as EventListener);
    };
  }, []);
  
  return (
    <>
      
      <AuthProvider>
      <NotificationProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes - No Auth Required */}
          <Route path="/signin" element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          <Route path="/complete-invitation" element={
            <PublicRoute>
              <CompleteInvitation />
            </PublicRoute>
          } />
          <Route path="/reset-password" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
          <Route path="/two-step-verification" element={
            <PublicRoute>
              <TwoStepVerification />
            </PublicRoute>
          } />
          
          {/* Root route - redirect to dashboard if authenticated, otherwise to signin */}
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Alternative Layout - for special pages (public) */}
          <Route element={<AlternativeLayout />}>
            <Route path="/text-generator" element={<TextGeneratorPage />} />
            <Route path="/image-generator" element={<ImageGeneratorPage />} />
            <Route path="/code-generator" element={<CodeGeneratorPage />} />
            <Route path="/video-generator" element={<VideoGeneratorPage />} />
          </Route>
          
          {/* Protected Routes - Wrapped in AppLayout */}
          <Route element={<AppLayout />}>
            {/* Dashboard Routes */}
            <Route path="/ecommerce/dashboard" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute><Crm /></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
            <Route path="/saas" element={<ProtectedRoute><Saas /></ProtectedRoute>} />
            <Route path="/logistics" element={<ProtectedRoute><Logistics /></ProtectedRoute>} />

            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/invoice" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
            <Route path="/file-manager" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />

            {/* E-commerce */}
            <Route path="/products-list" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
            <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/single-invoice" element={<ProtectedRoute><SingleInvoice /></ProtectedRoute>} />
            <Route path="/create-invoice" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/single-transaction" element={<ProtectedRoute><SingleTransaction /></ProtectedRoute>} />

            {/* Support */}
            <Route path="/support-tickets" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
            <Route path="/support-ticket-reply" element={<ProtectedRoute><TicketReply /></ProtectedRoute>} />

            {/* Others Page */}
            <Route path="/profile" element={<ProtectedRoute><UserProfiles /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><Faqs /></ProtectedRoute>} />
            <Route path="/pricing-tables" element={<ProtectedRoute><PricingTables /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            <Route path="/api-keys" element={<ProtectedRoute><ApiKeys /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
            <Route path="/send-invitation" element={<ProtectedRoute><SendInvitation /></ProtectedRoute>} />
            <Route path="/organizations" element={<ProtectedRoute><Organizations /></ProtectedRoute>} />
            <Route path="/request-management/all-open" element={<ProtectedRoute><AllOpen /></ProtectedRoute>} />
            <Route path="/request-management/assigned-to-me" element={<ProtectedRoute><AllOpen /></ProtectedRoute>} />
            <Route path="/request-management/unassigned" element={<ProtectedRoute><AllOpen /></ProtectedRoute>} />
            <Route path="/request-management/resolved" element={<ProtectedRoute><AllOpen /></ProtectedRoute>} />
            <Route path="/request-management/:issueKey" element={<ProtectedPermissionRoute requiredPermissions={[Permission.VIEW_ISSUES]}><RequestSplitView /></ProtectedPermissionRoute>} />
            <Route path="/request-management" element={<ProtectedRoute><AllOpen /></ProtectedRoute>} />
            <Route path="/vendor-management/list" element={<ProtectedRoute><VendorList /></ProtectedRoute>} />
            <Route path="/vendor-management/contracts" element={<ProtectedRoute><VendorAgreements /></ProtectedRoute>} />
            <Route path="/vendor-management/contract-details" element={<ProtectedRoute><VendorAgreementDetails /></ProtectedRoute>} />
            <Route path="/vendor-management/VendorRenewal/Renewal_vendor" element={<ProtectedRoute><RenewalVendor /></ProtectedRoute>} />
            <Route path="/procurement/renewal" element={<ProtectedRoute><ProcurementRenewal /></ProtectedRoute>} />
            <Route path="/blank" element={<ProtectedRoute><Blank /></ProtectedRoute>} />

            {/* Forms */}
            <Route path="/form-elements" element={<ProtectedRoute><FormElements /></ProtectedRoute>} />
            <Route path="/form-layout" element={<ProtectedRoute><FormLayout /></ProtectedRoute>} />

            {/* Applications */}
            <Route path="/task-list" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
            <Route path="/task-kanban" element={<ProtectedRoute><TaskKanban /></ProtectedRoute>} />

            {/* Email */}
            <Route path="/inbox" element={<ProtectedRoute><EmailInbox /></ProtectedRoute>} />
            <Route path="/inbox-details" element={<ProtectedRoute><EmailDetails /></ProtectedRoute>} />

            {/* Tables */}
            <Route path="/basic-tables" element={<ProtectedRoute><BasicTables /></ProtectedRoute>} />
            <Route path="/data-tables" element={<ProtectedRoute><DataTables /></ProtectedRoute>} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/avatars" element={<ProtectedRoute><Avatars /></ProtectedRoute>} />
            <Route path="/badge" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
            <Route path="/breadcrumb" element={<ProtectedRoute><BreadCrumb /></ProtectedRoute>} />
            <Route path="/buttons" element={<ProtectedRoute><Buttons /></ProtectedRoute>} />
            <Route path="/buttons-group" element={<ProtectedRoute><ButtonsGroup /></ProtectedRoute>} />
            <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
            <Route path="/carousel" element={<ProtectedRoute><Carousel /></ProtectedRoute>} />
            <Route path="/dropdowns" element={<ProtectedRoute><Dropdowns /></ProtectedRoute>} />
            <Route path="/images" element={<ProtectedRoute><Images /></ProtectedRoute>} />
            <Route path="/links" element={<ProtectedRoute><Links /></ProtectedRoute>} />
            <Route path="/list" element={<ProtectedRoute><Lists /></ProtectedRoute>} />
            <Route path="/modals" element={<ProtectedRoute><Modals /></ProtectedRoute>} />
            {/* <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} /> */}
            <Route path="/pagination" element={<ProtectedRoute><Pagination /></ProtectedRoute>} />
            <Route path="/popovers" element={<ProtectedRoute><Popovers /></ProtectedRoute>} />
            <Route path="/progress-bar" element={<ProtectedRoute><Progressbar /></ProtectedRoute>} />
            <Route path="/ribbons" element={<ProtectedRoute><Ribbons /></ProtectedRoute>} />
            <Route path="/spinners" element={<ProtectedRoute><Spinners /></ProtectedRoute>} />
            <Route path="/tabs" element={<ProtectedRoute><Tabs /></ProtectedRoute>} />
            <Route path="/tooltips" element={<ProtectedRoute><Tooltips /></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />

            {/* Charts */}
            <Route path="/line-chart" element={<ProtectedRoute><LineChart /></ProtectedRoute>} />
            <Route path="/bar-chart" element={<ProtectedRoute><BarChart /></ProtectedRoute>} />
            <Route path="/pie-chart" element={<ProtectedRoute><PieChart /></ProtectedRoute>} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/success" element={<Success />} />
          <Route path="/five-zero-zero" element={<FiveZeroZero />} />
          <Route path="/five-zero-three" element={<FiveZeroThree />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CreateIssueModal
          isOpen={isCreateIssueModalOpen}
          onClose={() => {
            setIsCreateIssueModalOpen(false);
            // Reset the ref after closing
            initialExistingContractIdRef.current = null;
          }}
          initialContractType={initialExistingContractIdRef.current ? 'existing' : undefined}
          initialExistingContractId={initialExistingContractIdRef.current || undefined}
        />
      </Router>
      </NotificationProvider>
      </AuthProvider>
    </>
  );
}