// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { HomeRedirect } from "./components/auth/HomeRedirect";
import ProtectedPermissionRoute from "./components/auth/ProtectedPermissionRoute";
import ProtectedRoleRoute from "./components/auth/ProtectedRoleRoute";
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
import RegistrationSuccess from "./pages/AuthPages/RegistrationSuccess";
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
import AssignedToMe from "./main pages/Request Management/AssignedToMe";
import Unassigned from "./main pages/Request Management/Unassigned";
import Resolved from "./main pages/Request Management/Resolved";
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
          <Route path="/registration-success" element={
            <PublicRoute>
              <RegistrationSuccess />
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
          
          {/* Dashboard Routes */}
          <Route path="/ecommerce/dashboard" element={<ProtectedRoute><AppLayout><Ecommerce /></AppLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
          <Route path="/marketing" element={<ProtectedRoute><AppLayout><Marketing /></AppLayout></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><AppLayout><Crm /></AppLayout></ProtectedRoute>} />
          <Route path="/stocks" element={<ProtectedRoute><AppLayout><Stocks /></AppLayout></ProtectedRoute>} />
          <Route path="/saas" element={<ProtectedRoute><AppLayout><Saas /></AppLayout></ProtectedRoute>} />
          <Route path="/logistics" element={<ProtectedRoute><AppLayout><Logistics /></AppLayout></ProtectedRoute>} />
          
          <Route path="/calendar" element={<ProtectedRoute><AppLayout><Calendar /></AppLayout></ProtectedRoute>} />
          <Route path="/invoice" element={<ProtectedRoute><AppLayout><Invoices /></AppLayout></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><AppLayout><Invoices /></AppLayout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><AppLayout><Chats /></AppLayout></ProtectedRoute>} />
          <Route path="/file-manager" element={<ProtectedRoute><AppLayout><FileManager /></AppLayout></ProtectedRoute>} />
          
          {/* E-commerce */}
          <Route path="/products-list" element={<ProtectedRoute><AppLayout><ProductList /></AppLayout></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute><AppLayout><AddProduct /></AppLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><AppLayout><Billing /></AppLayout></ProtectedRoute>} />
          <Route path="/single-invoice" element={<ProtectedRoute><AppLayout><SingleInvoice /></AppLayout></ProtectedRoute>} />
          <Route path="/create-invoice" element={<ProtectedRoute><AppLayout><CreateInvoice /></AppLayout></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><AppLayout><Transactions /></AppLayout></ProtectedRoute>} />
          <Route path="/single-transaction" element={<ProtectedRoute><AppLayout><SingleTransaction /></AppLayout></ProtectedRoute>} />
          
          {/* Support */}
          <Route path="/support-tickets" element={<ProtectedRoute><AppLayout><TicketList /></AppLayout></ProtectedRoute>} />
          <Route path="/support-ticket-reply" element={<ProtectedRoute><AppLayout><TicketReply /></AppLayout></ProtectedRoute>} />
          
          {/* Others Page */}
          <Route path="/profile" element={<ProtectedRoute><AppLayout><UserProfiles /></AppLayout></ProtectedRoute>} />
          <Route path="/faq" element={<ProtectedRoute><AppLayout><Faqs /></AppLayout></ProtectedRoute>} />
          <Route path="/pricing-tables" element={<ProtectedRoute><AppLayout><PricingTables /></AppLayout></ProtectedRoute>} />
          <Route path="/integrations" element={<ProtectedRoute><AppLayout><Integrations /></AppLayout></ProtectedRoute>} />
          <Route path="/api-keys" element={<ProtectedRoute><AppLayout><ApiKeys /></AppLayout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoleRoute><AppLayout><UsersList /></AppLayout></ProtectedRoleRoute>} />
          <Route path="/send-invitation" element={<ProtectedRoleRoute><AppLayout><SendInvitation /></AppLayout></ProtectedRoleRoute>} />
          <Route path="/organizations" element={<ProtectedRoleRoute><AppLayout><Organizations /></AppLayout></ProtectedRoleRoute>} />
          <Route path="/request-management/all-open" element={<ProtectedRoute><AppLayout><AllOpen /></AppLayout></ProtectedRoute>} />
          <Route path="/request-management/assigned-to-me" element={<ProtectedRoute><AppLayout><AllOpen /></AppLayout></ProtectedRoute>} />
          <Route path="/request-management/unassigned" element={<ProtectedRoute><AppLayout><AllOpen /></AppLayout></ProtectedRoute>} />
          <Route path="/request-management/resolved" element={<ProtectedRoute><AppLayout><AllOpen /></AppLayout></ProtectedRoute>} />
          <Route path="/request-management/:issueKey" element={<ProtectedPermissionRoute requiredPermissions={[Permission.VIEW_ISSUES]}><AppLayout><RequestSplitView /></AppLayout></ProtectedPermissionRoute>} />
          <Route path="/request-management" element={<ProtectedRoute><AppLayout><AllOpen /></AppLayout></ProtectedRoute>} />
          <Route path="/vendor-management/list" element={<ProtectedRoute><AppLayout><VendorList /></AppLayout></ProtectedRoute>} />
          <Route path="/vendor-management/contracts" element={<ProtectedRoute><AppLayout><VendorAgreements /></AppLayout></ProtectedRoute>} />
          <Route path="/vendor-management/contract-details" element={<ProtectedRoute><AppLayout><VendorAgreementDetails /></AppLayout></ProtectedRoute>} />
          <Route path="/vendor-management/VendorRenewal/Renewal_vendor" element={<ProtectedRoute><AppLayout><RenewalVendor /></AppLayout></ProtectedRoute>} />
          <Route path="/procurement/renewal" element={<ProtectedRoute><AppLayout><ProcurementRenewal /></AppLayout></ProtectedRoute>} />
          <Route path="/blank" element={<ProtectedRoute><AppLayout><Blank /></AppLayout></ProtectedRoute>} />
          
          {/* Forms */}
          <Route path="/form-elements" element={<ProtectedRoute><AppLayout><FormElements /></AppLayout></ProtectedRoute>} />
          <Route path="/form-layout" element={<ProtectedRoute><AppLayout><FormLayout /></AppLayout></ProtectedRoute>} />
          
          {/* Applications */}
          <Route path="/task-list" element={<ProtectedRoute><AppLayout><TaskList /></AppLayout></ProtectedRoute>} />
          <Route path="/task-kanban" element={<ProtectedRoute><AppLayout><TaskKanban /></AppLayout></ProtectedRoute>} />
          
          {/* Email */}
          <Route path="/inbox" element={<ProtectedRoute><AppLayout><EmailInbox /></AppLayout></ProtectedRoute>} />
          <Route path="/inbox-details" element={<ProtectedRoute><AppLayout><EmailDetails /></AppLayout></ProtectedRoute>} />
          
          {/* Tables */}
          <Route path="/basic-tables" element={<ProtectedRoute><AppLayout><BasicTables /></AppLayout></ProtectedRoute>} />
          <Route path="/data-tables" element={<ProtectedRoute><AppLayout><DataTables /></AppLayout></ProtectedRoute>} />
          
          {/* Ui Elements */}
          <Route path="/alerts" element={<ProtectedRoute><AppLayout><Alerts /></AppLayout></ProtectedRoute>} />
          <Route path="/avatars" element={<ProtectedRoute><AppLayout><Avatars /></AppLayout></ProtectedRoute>} />
          <Route path="/badge" element={<ProtectedRoute><AppLayout><Badges /></AppLayout></ProtectedRoute>} />
          <Route path="/breadcrumb" element={<ProtectedRoute><AppLayout><BreadCrumb /></AppLayout></ProtectedRoute>} />
          <Route path="/buttons" element={<ProtectedRoute><AppLayout><Buttons /></AppLayout></ProtectedRoute>} />
          <Route path="/buttons-group" element={<ProtectedRoute><AppLayout><ButtonsGroup /></AppLayout></ProtectedRoute>} />
          <Route path="/cards" element={<ProtectedRoute><AppLayout><Cards /></AppLayout></ProtectedRoute>} />
          <Route path="/carousel" element={<ProtectedRoute><AppLayout><Carousel /></AppLayout></ProtectedRoute>} />
          <Route path="/dropdowns" element={<ProtectedRoute><AppLayout><Dropdowns /></AppLayout></ProtectedRoute>} />
          <Route path="/images" element={<ProtectedRoute><AppLayout><Images /></AppLayout></ProtectedRoute>} />
          <Route path="/links" element={<ProtectedRoute><AppLayout><Links /></AppLayout></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute><AppLayout><Lists /></AppLayout></ProtectedRoute>} />
          <Route path="/modals" element={<ProtectedRoute><AppLayout><Modals /></AppLayout></ProtectedRoute>} />
          {/* <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} /> */}
          <Route path="/pagination" element={<ProtectedRoute><AppLayout><Pagination /></AppLayout></ProtectedRoute>} />
          <Route path="/popovers" element={<ProtectedRoute><AppLayout><Popovers /></AppLayout></ProtectedRoute>} />
          <Route path="/progress-bar" element={<ProtectedRoute><AppLayout><Progressbar /></AppLayout></ProtectedRoute>} />
          <Route path="/ribbons" element={<ProtectedRoute><AppLayout><Ribbons /></AppLayout></ProtectedRoute>} />
          <Route path="/spinners" element={<ProtectedRoute><AppLayout><Spinners /></AppLayout></ProtectedRoute>} />
          <Route path="/tabs" element={<ProtectedRoute><AppLayout><Tabs /></AppLayout></ProtectedRoute>} />
          <Route path="/tooltips" element={<ProtectedRoute><AppLayout><Tooltips /></AppLayout></ProtectedRoute>} />
          <Route path="/videos" element={<ProtectedRoute><AppLayout><Videos /></AppLayout></ProtectedRoute>} />
          
          {/* Charts */}
          <Route path="/line-chart" element={<ProtectedRoute><AppLayout><LineChart /></AppLayout></ProtectedRoute>} />
          <Route path="/bar-chart" element={<ProtectedRoute><AppLayout><BarChart /></AppLayout></ProtectedRoute>} />
          <Route path="/pie-chart" element={<ProtectedRoute><AppLayout><PieChart /></AppLayout></ProtectedRoute>} />

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