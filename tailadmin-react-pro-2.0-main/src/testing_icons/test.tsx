import React from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import BugReportIcon from '@mui/icons-material/BugReport';
import CachedIcon from '@mui/icons-material/Cached';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import ExtensionIcon from '@mui/icons-material/Extension';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Airplane,
  Atom,
  Bell,
  Bookmark,
  BookOpen,
  Camera,
  ChartLine,
  Chat,
  CheckCircle,
  Clock,
  Cloud,
  Code,
  Coffee,
  Compass,
  Database,
  Desktop,
  Download,
  Envelope,
  Eye,
  Flag,
  Folder,
  Gear,
  Heart,
  House,
  Image,
  Key,
  Lightning,
  Lock as PhosphorLock,
  MapPin,
  MusicNotes,
  Notebook,
  Palette,
  PaperPlane,
  Phone,
  PushPin,
  Rocket,
  Shield,
  ShoppingCart as PhosphorShoppingCart,
  Star,
  Sun,
  Tag,
  Tree,
  User,
  Users,
  Warning,
  XCircle,
} from 'phosphor-react';
import { HiHome, HiUser, HiFolder, HiDocument, HiChartBar, HiCog, HiBell, HiStar, HiHeart, HiLightningBolt, HiLockClosed, HiMail, HiPhone, HiLocationMarker, HiSearch, HiPencil, HiTrash, HiPlus, HiX, HiCheck, HiArrowRight, HiDotsHorizontal, HiTemplate, HiShieldCheck, HiCurrencyDollar, HiPhotograph, HiCalendar, HiClock, HiClipboardList, HiDesktopComputer, HiCube, HiMenu, HiUserGroup, HiGlobeAlt, HiLightBulb, HiCloudDownload, HiPaperClip, HiChatAlt, HiShare, HiShoppingCart, HiCreditCard, HiTicket, HiColorSwatch, HiAnnotation, HiFire, HiScissors, HiSparkles, HiEmojiHappy, HiHand, HiBan, HiExclamation, HiInformationCircle, HiQuestionMarkCircle } from "react-icons/hi";


const TestingIconsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Google -Material UI</h1>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HomeIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Home</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <DashboardIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Dashboard</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <AccountTreeIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">AccountTree</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <AssessmentIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Assessment</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <AssignmentIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Assignment</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <AttachMoneyIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">AttachMoney</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <BarChartIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">BarChart</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <BugReportIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">BugReport</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <CachedIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Cached</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <DescriptionIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Description</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <ExtensionIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Extension</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FavoriteIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Favorite</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HelpIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Help</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <InfoIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Info</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <LockIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Lock</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <NotificationsIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Notifications</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <PeopleIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">People</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <PersonIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Person</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <SettingsIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Settings</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <ShoppingCartIcon className="text-gray-700 dark:text-gray-300 mb-2" fontSize="large" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ShoppingCart</span>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Phosphor Icons</h1>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <House weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">House</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Atom weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Atom</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Bell weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Bell</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Bookmark weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Bookmark</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <BookOpen weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">BookOpen</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Camera weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Camera</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <ChartLine weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ChartLine</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Chat weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Chat</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <CheckCircle weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">CheckCircle</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Clock weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Clock</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Cloud weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Cloud</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Code weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Code</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Coffee weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Coffee</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Compass weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Compass</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Database weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Database</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Desktop weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Desktop</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Download weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Download</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Envelope weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Envelope</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Eye weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Eye</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Flag weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Flag</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Folder weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Folder</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Gear weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Gear</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Heart weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Heart</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Image weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Image</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Key weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Key</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Lightning weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Lightning</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <PhosphorLock weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Lock</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <MapPin weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">MapPin</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <MusicNotes weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">MusicNotes</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Notebook weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Notebook</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Palette weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Palette</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <PaperPlane weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">PaperPlane</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Phone weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Phone</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <PushPin weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">PushPin</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Rocket weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Rocket</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Shield weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Shield</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <PhosphorShoppingCart weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ShoppingCart</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Star weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Star</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Sun weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Sun</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Tag weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Tag</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Tree weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Tree</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <User weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">User</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Users weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Users</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Warning weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Warning</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <XCircle weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">XCircle</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Airplane weight="regular" className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Airplane</span>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Iconear</h1>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiHome className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Home</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiUser className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">User</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiFolder className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Folder</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiDocument className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Document</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiChartBar className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ChartBar</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCog className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Cog</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiBell className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Bell</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiStar className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Star</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiHeart className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Heart</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiLightningBolt className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">LightningBolt</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiLockClosed className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">LockClosed</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiMail className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Mail</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiPhone className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Phone</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiLocationMarker className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">LocationMarker</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiSearch className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Search</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiPencil className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Pencil</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiTrash className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Trash</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiPlus className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Plus</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiX className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">X</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCheck className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Check</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiArrowRight className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ArrowRight</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiDotsHorizontal className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">DotsHorizontal</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiTemplate className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Template</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiShieldCheck className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ShieldCheck</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCurrencyDollar className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">CurrencyDollar</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiPhotograph className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Photograph</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCalendar className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Calendar</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiClock className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Clock</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiClipboardList className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ClipboardList</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiDesktopComputer className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">DesktopComputer</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCube className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Cube</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiMenu className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Menu</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiUserGroup className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">UserGroup</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiGlobeAlt className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">GlobeAlt</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiLightBulb className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">LightBulb</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCloudDownload className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">CloudDownload</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiPaperClip className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">PaperClip</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiChatAlt className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ChatAlt</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiShare className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Share</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiShoppingCart className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ShoppingCart</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiCreditCard className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">CreditCard</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiTicket className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Ticket</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiColorSwatch className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">ColorSwatch</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiAnnotation className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Annotation</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiFire className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Fire</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiScissors className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Scissors</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiSparkles className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Sparkles</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiEmojiHappy className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">EmojiHappy</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiHand className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Hand</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiBan className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Ban</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiExclamation className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">Exclamation</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiInformationCircle className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">InformationCircle</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HiQuestionMarkCircle className="text-gray-700 dark:text-gray-300 mb-2" size={24} />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">QuestionMarkCircle</span>
        </div>
      </div>
    </div>
  );
};

export default TestingIconsPage;