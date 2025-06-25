// Mock for lucide-react icons
import React from 'react';

// Generic icon component mock
const MockIcon = ({ className, ...props }) => (
  React.createElement('svg', {
    className,
    'data-testid': 'mock-icon',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props,
  }, React.createElement('rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }))
);

// Export commonly used icons
export const Search = MockIcon;
export const Menu = MockIcon;
export const X = MockIcon;
export const Home = MockIcon;
export const User = MockIcon;
export const Settings = MockIcon;
export const ChevronDown = MockIcon;
export const ChevronUp = MockIcon;
export const ChevronLeft = MockIcon;
export const ChevronRight = MockIcon;
export const Plus = MockIcon;
export const Minus = MockIcon;
export const Edit = MockIcon;
export const Trash = MockIcon;
export const Save = MockIcon;
export const Cancel = MockIcon;
export const Check = MockIcon;
export const AlertCircle = MockIcon;
export const Info = MockIcon;
export const Sun = MockIcon;
export const Moon = MockIcon;
export const Star = MockIcon;
export const Heart = MockIcon;
export const Share = MockIcon;
export const Download = MockIcon;
export const Upload = MockIcon;
export const Send = MockIcon;
export const MessageCircle = MockIcon;
export const Bell = MockIcon;
export const Clock = MockIcon;
export const Calendar = MockIcon;
export const MapPin = MockIcon;
export const Phone = MockIcon;
export const Mail = MockIcon;
export const Lock = MockIcon;
export const Unlock = MockIcon;
export const Eye = MockIcon;
export const EyeOff = MockIcon;
export const ArrowLeft = MockIcon;
export const ArrowRight = MockIcon;
export const ArrowUp = MockIcon;
export const ArrowDown = MockIcon;
export const ExternalLink = MockIcon;
export const Copy = MockIcon;
export const Clipboard = MockIcon;
export const FileText = MockIcon;
export const Image = MockIcon;
export const Video = MockIcon;
export const Music = MockIcon;
export const Folder = MockIcon;
export const FolderOpen = MockIcon;
export const Paperclip = MockIcon;
export const Link = MockIcon;
export const Wifi = MockIcon;
export const WifiOff = MockIcon;
export const Bluetooth = MockIcon;
export const Battery = MockIcon;
export const Volume = MockIcon;
export const VolumeX = MockIcon;
export const Play = MockIcon;
export const Pause = MockIcon;
export const Stop = MockIcon;
export const SkipBack = MockIcon;
export const SkipForward = MockIcon;
export const Repeat = MockIcon;
export const Shuffle = MockIcon;

// Default export for dynamic imports
export default {
  Search,
  Menu,
  X,
  Home,
  User,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Edit,
  Trash,
  Save,
  Cancel,
  Check,
  AlertCircle,
  Info,
  Sun,
  Moon,
  Star,
  Heart,
  Share,
  Download,
  Upload,
  Send,
  MessageCircle,
  Bell,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  Clipboard,
  FileText,
  Image,
  Video,
  Music,
  Folder,
  FolderOpen,
  Paperclip,
  Link,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  Volume,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
};
