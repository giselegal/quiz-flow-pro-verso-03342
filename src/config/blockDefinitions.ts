import React from 'react';
import { PropertySchema } from './funnelBlockDefinitions';
import { PlaceholderUtils } from '../utils/placeholderUtils';

// Block Definition Interface
export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  propertiesSchema: PropertySchema[];
  defaultProperties: Record<string, any>;
}

// Tipos para ícones Lucide React
export type IconType =
  | 'Type'
  | 'Heading1'
  | 'RectangleHorizontal'
  | 'StretchHorizontal'
  | 'Image'
  | 'Input'
  | 'HelpCircle'
  | 'Award'
  | 'CheckCircle'
  | 'Play'
  | 'LoaderCircle'
  | 'AlignHorizontalDistributeEnd'
  | 'Sparkles'
  | 'Quote'
  | 'TextCursorInput'
  | 'Proportions'
  | 'ChartArea'
  | 'SlidersHorizontal'
  | 'List'
  | 'ArrowRightLeft'
  | 'Rows3'
  | 'CircleDollarSign'
  | 'Code'
  | 'Scale'
  | 'Video'
  | 'ShoppingCart'
  | 'Clock'
  | 'MessageSquare'
  | 'Shield'
  | 'Gift'
  | 'Brain'
  | 'Crown'
  | 'Layers'
  | 'RotateCw'
  | 'Heart'
  | 'Stack'
  | 'Users'
  | 'TriangleAlert'
  | 'Book'
  | 'Mic'
  | 'GalleryHorizontalEnd'
  | 'Zap'
  | 'Target'
  | 'Star'
  | 'Flame'
  | 'TrendingUp'
  | 'Lightbulb'
  | 'Palette'
  | 'Camera'
  | 'FileText'
  | 'Download'
  | 'Upload'
  | 'Settings'
  | 'Edit'
  | 'Trash'
  | 'Copy'
  | 'Move'
  | 'Plus'
  | 'Minus'
  | 'X'
  | 'Check'
  | 'ChevronUp'
  | 'ChevronDown'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Eye'
  | 'EyeOff'
  | 'Lock'
  | 'Unlock'
  | 'Search'
  | 'Filter'
  | 'Sort'
  | 'Grid'
  | 'List as ListIcon'
  | 'Calendar'
  | 'Mail'
  | 'Phone'
  | 'Globe'
  | 'Link'
  | 'ExternalLink'
  | 'Home'
  | 'User'
  | 'Users as UsersIcon'
  | 'Menu'
  | 'MoreHorizontal'
  | 'MoreVertical'
  | 'Info'
  | 'AlertCircle'
  | 'CheckCircle as CheckCircleIcon'
  | 'XCircle'
  | 'AlertTriangle'
  | 'Refresh'
  | 'RotateCcw'
  | 'Volume2'
  | 'VolumeX'
  | 'Wifi'
  | 'WifiOff'
  | 'Battery'
  | 'BatteryLow'
  | 'Bluetooth'
  | 'Cpu'
  | 'HardDrive'
  | 'Monitor'
  | 'Smartphone'
  | 'Tablet'
  | 'Laptop'
  | 'Desktop'
  | 'Server'
  | 'Database'
  | 'Cloud'
  | 'CloudOff'
  | 'Folder'
  | 'FolderOpen'
  | 'File'
  | 'FileText as FileTextIcon'
  | 'Image as ImageIcon'
  | 'Video as VideoIcon'
  | 'Music'
  | 'Headphones'
  | 'Mic as MicIcon'
  | 'Camera as CameraIcon'
  | 'Printer'
  | 'Scanner'
  | 'Gamepad2'
  | 'Joystick'
  | 'MousePointer'
  | 'Keyboard'
  | 'Monitor as MonitorIcon'
  | 'Tv'
  | 'Radio'
  | 'Satellite'
  | 'Antenna'
  | 'Rss'
  | 'Bookmark'
  | 'BookmarkPlus'
  | 'Tag'
  | 'Tags'
  | 'Hash'
  | 'AtSign'
  | 'Percent'
  | 'Dollar'
  | 'Euro'
  | 'Pound'
  | 'Yen'
  | 'Bitcoin'
  | 'CreditCard'
  | 'Banknote'
  | 'Wallet'
  | 'ShoppingBag'
  | 'ShoppingCart as ShoppingCartIcon'
  | 'Package'
  | 'PackageCheck'
  | 'Truck'
  | 'Plane'
  | 'Car'
  | 'Bike'
  | 'Bus'
  | 'Train'
  | 'Ship'
  | 'Rocket'
  | 'Zap as ZapIcon'
  | 'Battery as BatteryIcon'
  | 'Plug'
  | 'PowerOff'
  | 'Power'
  | 'Sun'
  | 'Moon'
  | 'Stars'
  | 'CloudRain'
  | 'CloudSnow'
  | 'CloudLightning'
  | 'Thermometer'
  | 'Droplets'
  | 'Wind'
  | 'Compass'
  | 'MapPin'
  | 'Map'
  | 'Navigation'
  | 'Crosshair'
  | 'Send'
  | 'MessageCircle'
  | 'MessageSquare as MessageSquareIcon'
  | 'Mail as MailIcon'
  | 'Inbox'
  | 'Send as SendIcon'
  | 'Reply'
  | 'ReplyAll'
  | 'Forward'
  | 'Archive'
  | 'Trash2'
  | 'Spam'
  | 'AlertOctagon'
  | 'ShieldAlert'
  | 'ShieldCheck'
  | 'Lock as LockIcon'
  | 'Unlock as UnlockIcon'
  | 'Key'
  | 'Fingerprint'
  | 'Eye as EyeIcon'
  | 'EyeOff as EyeOffIcon'
  | 'UserCheck'
  | 'UserMinus'
  | 'UserPlus'
  | 'UserX'
  | 'Users as UsersIcon2'
  | 'UserCog'
  | 'Contact'
  | 'Contact2'
  | 'Baby'
  | 'Dog'
  | 'Cat'
  | 'Bird'
  | 'Fish'
  | 'Rabbit'
  | 'Squirrel'
  | 'Turtle'
  | 'Bug'
  | 'Flower'
  | 'Flower2'
  | 'Trees'
  | 'TreePine'
  | 'TreeDeciduous'
  | 'Leaf'
  | 'Clover'
  | 'Cherry'
  | 'Apple'
  | 'Grape'
  | 'Orange'
  | 'Banana'
  | 'Strawberry'
  | 'Carrot'
  | 'Pizza'
  | 'Coffee'
  | 'Wine'
  | 'Beer'
  | 'IceCream'
  | 'Cake'
  | 'Sandwich'
  | 'Utensils'
  | 'UtensilsCrossed'
  | 'ChefHat'
  | 'CookingPot'
  | 'Microwave'
  | 'Refrigerator'
  | 'Stove'
  | 'Blender'
  | 'Scale as ScaleIcon'
  | 'Timer'
  | 'AlarmClock'
  | 'Clock as ClockIcon'
  | 'Watch'
  | 'Calendar as CalendarIcon'
  | 'CalendarDays'
  | 'CalendarCheck'
  | 'CalendarX'
  | 'CalendarPlus'
  | 'CalendarMinus'
  | 'CalendarClock'
  | 'Hourglass'
  | 'Timer as TimerIcon'
  | 'Stopwatch'
  | 'Alarm'
  | 'Bell'
  | 'BellRing'
  | 'BellOff'
  | 'Volume'
  | 'Volume1'
  | 'Volume2 as Volume2Icon'
  | 'VolumeX as VolumeXIcon'
  | 'Mute'
  | 'Unmute'
  | 'Play as PlayIcon'
  | 'Pause'
  | 'Stop'
  | 'Rewind'
  | 'FastForward'
  | 'SkipBack'
  | 'SkipForward'
  | 'Repeat'
  | 'Repeat1'
  | 'Shuffle'
  | 'Disc'
  | 'Disc2'
  | 'Disc3'
  | 'Radio as RadioIcon'
  | 'Headphones as HeadphonesIcon'
  | 'Speaker'
  | 'Music2'
  | 'Music3'
  | 'Music4'
  | 'Podcast'
  | 'AudioWaveform'
  | 'AudioLines'
  | 'Waveform'
  | 'Activity'
  | 'BarChart'
  | 'BarChart2'
  | 'BarChart3'
  | 'BarChart4'
  | 'LineChart'
  | 'PieChart'
  | 'TrendingUp as TrendingUpIcon'
  | 'TrendingDown'
  | 'ArrowUpRight'
  | 'ArrowDownRight'
  | 'ArrowUpLeft'
  | 'ArrowDownLeft'
  | 'ArrowBigUp'
  | 'ArrowBigDown'
  | 'ArrowBigLeft'
  | 'ArrowBigRight'
  | 'ArrowUpDown'
  | 'ArrowLeftRight'
  | 'ArrowUpCircle'
  | 'ArrowDownCircle'
  | 'ArrowLeftCircle'
  | 'ArrowRightCircle'
  | 'ChevronsUp'
  | 'ChevronsDown'
  | 'ChevronsLeft'
  | 'ChevronsRight'
  | 'ChevronsUpDown'
  | 'ChevronsLeftRight'
  | 'CornerUpLeft'
  | 'CornerUpRight'
  | 'CornerDownLeft'
  | 'CornerDownRight'
  | 'CornerLeftUp'
  | 'CornerLeftDown'
  | 'CornerRightUp'
  | 'CornerRightDown'
  | 'Move as MoveIcon'
  | 'Move3d'
  | 'MousePointer2'
  | 'MousePointer as MousePointerIcon'
  | 'Crosshair as CrosshairIcon'
  | 'Target as TargetIcon'
  | 'Focus'
  | 'Minimize'
  | 'Maximize'
  | 'Minimize2'
  | 'Maximize2'
  | 'Expand'
  | 'Shrink'
  | 'ZoomIn'
  | 'ZoomOut'
  | 'Scan'
  | 'ScanLine'
  | 'QrCode'
  | 'Barcode'
  | 'Binary'
  | 'Cpu as CpuIcon'
  | 'HardDrive as HardDriveIcon'
  | 'MemoryStick'
  | 'SdCard'
  | 'Usb'
  | 'Ethernet'
  | 'Wifi as WifiIcon'
  | 'WifiOff as WifiOffIcon'
  | 'Bluetooth as BluetoothIcon'
  | 'BluetoothConnected'
  | 'BluetoothOff'
  | 'BluetoothSearching'
  | 'Nfc'
  | 'Radar'
  | 'Satellite as SatelliteIcon'
  | 'Antenna as AntennaIcon'
  | 'Router'
  | 'Network'
  | 'Lan'
  | 'Globe as GlobeIcon'
  | 'Earth'
  | 'MapPin as MapPinIcon'
  | 'Map as MapIcon'
  | 'Navigation as NavigationIcon'
  | 'Navigation2'
  | 'NavigationOff'
  | 'Compass as CompassIcon'
  | 'Route'
  | 'RouteOff'
  | 'MapPinOff'
  | 'Milestone'
  | 'Signpost'
  | 'SignpostBig'
  | 'TreePine as TreePineIcon'
  | 'TreeDeciduous as TreeDeciduousIcon'
  | 'Mountain'
  | 'MountainSnow'
  | 'Waves'
  | 'Sun as SunIcon'
  | 'Moon as MoonIcon'
  | 'Stars as StarsIcon'
  | 'CloudRain as CloudRainIcon'
  | 'CloudSnow as CloudSnowIcon'
  | 'CloudLightning as CloudLightningIcon'
  | 'CloudDrizzle'
  | 'CloudHail'
  | 'CloudSun'
  | 'CloudMoon'
  | 'Cloudy'
  | 'PartlyCloudy'
  | 'Sunrise'
  | 'Sunset'
  | 'Wind as WindIcon'
  | 'Tornado'
  | 'Snowflake'
  | 'Thermometer as ThermometerIcon'
  | 'ThermometerSun'
  | 'ThermometerSnowflake'
  | 'Gauge'
  | 'Droplets as DropletsIcon'
  | 'Droplet'
  | 'Flame as FlameIcon'
  | 'Zap as ZapIcon2'
  | 'Bolt'
  | 'Flashlight'
  | 'FlashlightOff'
  | 'Lightbulb as LightbulbIcon'
  | 'LightbulbOff'
  | 'Candle'
  | 'Lamp'
  | 'LampCeiling'
  | 'LampDesk'
  | 'LampFloor'
  | 'LampWallDown'
  | 'LampWallUp'
  | 'Spotlight'
  | 'SunMedium'
  | 'SunDim'
  | 'MoonStar'
  | 'Eclipse'
  | 'Sunrise as SunriseIcon'
  | 'Sunset as SunsetIcon'
  | 'Clock1'
  | 'Clock2'
  | 'Clock3'
  | 'Clock4'
  | 'Clock5'
  | 'Clock6'
  | 'Clock7'
  | 'Clock8'
  | 'Clock9'
  | 'Clock10'
  | 'Clock11'
  | 'Clock12'
  | 'AlarmClock as AlarmClockIcon'
  | 'AlarmClockOff'
  | 'Timer as TimerIcon2'
  | 'TimerOff'
  | 'TimerReset'
  | 'Stopwatch as StopwatchIcon'
  | 'Hourglass as HourglassIcon'
  | 'Loader'
  | 'Loader2'
  | 'LoaderCircle as LoaderCircleIcon'
  | 'RotateCw as RotateCwIcon'
  | 'RotateCcw as RotateCcwIcon'
  | 'Refresh as RefreshIcon'
  | 'RefreshCw'
  | 'RefreshCcw'
  | 'IterationCw'
  | 'IterationCcw'
  | 'ArrowUp as ArrowUpIcon'
  | 'ArrowDown as ArrowDownIcon'
  | 'ArrowLeft as ArrowLeftIcon'
  | 'ArrowRight as ArrowRightIcon'
  | 'ArrowUpRight as ArrowUpRightIcon'
  | 'ArrowDownRight as ArrowDownRightIcon'
  | 'ArrowUpLeft as ArrowUpLeftIcon'
  | 'ArrowDownLeft as ArrowDownLeftIcon'
  | 'ArrowBigUp as ArrowBigUpIcon'
  | 'ArrowBigDown as ArrowBigDownIcon'
  | 'ArrowBigLeft as ArrowBigLeftIcon'
  | 'ArrowBigRight as ArrowBigRightIcon'
  | 'ArrowUpDown as ArrowUpDownIcon'
  | 'ArrowLeftRight as ArrowLeftRightIcon'
  | 'ArrowUpCircle as ArrowUpCircleIcon'
  | 'ArrowDownCircle as ArrowDownCircleIcon'
  | 'ArrowLeftCircle as ArrowLeftCircleIcon'
  | 'ArrowRightCircle as ArrowRightCircleIcon'
  | 'ChevronUp as ChevronUpIcon'
  | 'ChevronDown as ChevronDownIcon'
  | 'ChevronLeft as ChevronLeftIcon'
  | 'ChevronRight as ChevronRightIcon'
  | 'ChevronsUp as ChevronsUpIcon'
  | 'ChevronsDown as ChevronsDownIcon'
  | 'ChevronsLeft as ChevronsLeftIcon'
  | 'ChevronsRight as ChevronsRightIcon'
  | 'ChevronsUpDown as ChevronsUpDownIcon'
  | 'ChevronsLeftRight as ChevronsLeftRightIcon'
  | 'ChevronFirst'
  | 'ChevronLast'
  | 'Plus as PlusIcon'
  | 'Minus as MinusIcon'
  | 'X as XIcon'
  | 'Check as CheckIcon'
  | 'CheckCircle2'
  | 'XCircle as XCircleIcon'
  | 'AlertCircle as AlertCircleIcon'
  | 'AlertTriangle as AlertTriangleIcon'
  | 'AlertOctagon as AlertOctagonIcon'
  | 'Info as InfoIcon'
  | 'HelpCircle as HelpCircleIcon'
  | 'MessageCircle as MessageCircleIcon'
  | 'MessageSquareText'
  | 'MessageSquareDot'
  | 'MessageSquarePlus'
  | 'MessageSquareMore'
  | 'MessageSquareX'
  | 'MessageSquareWarning'
  | 'MessageSquareCode'
  | 'MessageSquareQuote'
  | 'MessageSquareReply'
  | 'MessageSquareShare'
  | 'MessageSquareHeart'
  | 'MessagesSquare'
  | 'MessageCircleMore'
  | 'MessageCircleX'
  | 'MessageCircleWarning'
  | 'MessageCircleCode'
  | 'MessageCircleQuestion'
  | 'MessageCircleReply'
  | 'MessageCircleHeart'
  | 'BellRing as BellRingIcon'
  | 'BellOff as BellOffIcon'
  | 'BellPlus'
  | 'BellMinus'
  | 'BellDot'
  | 'Notification'
  | 'Inbox as InboxIcon'
  | 'Outbox'
  | 'Send as SendIcon2'
  | 'SendHorizonal'
  | 'Reply as ReplyIcon'
  | 'ReplyAll as ReplyAllIcon'
  | 'Forward as ForwardIcon'
  | 'Archive as ArchiveIcon'
  | 'ArchiveRestore'
  | 'ArchiveX'
  | 'Trash as TrashIcon'
  | 'Trash2 as Trash2Icon'
  | 'Delete'
  | 'Eraser'
  | 'Backspace'
  | 'Undo'
  | 'Undo2'
  | 'Redo'
  | 'Redo2'
  | 'Copy as CopyIcon'
  | 'Clipboard'
  | 'ClipboardCopy'
  | 'ClipboardPaste'
  | 'ClipboardCheck'
  | 'ClipboardX'
  | 'ClipboardList'
  | 'ClipboardType'
  | 'ClipboardEdit'
  | 'Scissors'
  | 'PenTool'
  | 'Pen'
  | 'Pencil'
  | 'Edit as EditIcon'
  | 'Edit2'
  | 'Edit3'
  | 'FileEdit'
  | 'FilePen'
  | 'FilePenLine'
  | 'NotepadText'
  | 'NotepadTextDashed'
  | 'StickyNote'
  | 'BookOpen'
  | 'BookOpenCheck'
  | 'BookOpenText'
  | 'BookText'
  | 'BookCopy'
  | 'BookMarked'
  | 'BookMinus'
  | 'BookPlus'
  | 'BookX'
  | 'BookUp'
  | 'BookDown'
  | 'BookA'
  | 'Library'
  | 'LibraryBig'
  | 'Newspaper'
  | 'FileText as FileTextIcon2'
  | 'FileType'
  | 'FileType2'
  | 'FileImage'
  | 'FileVideo'
  | 'FileAudio'
  | 'FileArchive'
  | 'FileCode'
  | 'FileCode2'
  | 'FileSpreadsheet'
  | 'FilePresentatio';

// Minimal block definitions array to satisfy imports
export const blockDefinitions: BlockDefinition[] = [
  // Blocos de Quiz - Novos componentes das 21 etapas
  {
    type: 'quiz-question',
    name: 'Questão de Quiz',
    description: 'Componente de questão de quiz com opções múltiplas e integração com cálculos',
    icon: 'HelpCircle',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'question',
        label: 'Pergunta',
        type: 'textarea',
        defaultValue: 'Qual dessas opções representa melhor seu estilo?'
      },
      {
        key: 'allowMultiple',
        label: 'Permitir múltiplas seleções',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'maxSelections',
        label: 'Máximo de seleções',
        type: 'number',
        defaultValue: 3
      },
      {
        key: 'showImages',
        label: 'Mostrar imagens',
        type: 'boolean',
        defaultValue: true
      }
    ],
    defaultProperties: {
      question: 'Qual dessas opções representa melhor seu estilo?',
      allowMultiple: true,
      maxSelections: 3,
      showImages: true,
      options: [
        {
          id: '1',
          text: 'Clássico e elegante',
          styleCategory: 'Clássico',
          points: 2,
          keywords: ['elegante', 'sofisticado']
        },
        {
          id: '2',
          text: 'Moderno e descolado',
          styleCategory: 'Contemporâneo',
          points: 3,
          keywords: ['moderno', 'descolado']
        }
      ]
    }
  },
  {
    type: 'quiz-question-configurable',
    name: 'Questão Configurável',
    description: 'Versão avançada da questão com painel de propriedades para configurar imagens, pontuação e categorias',
    icon: 'Brain',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'question',
        label: 'Pergunta',
        type: 'textarea',
        defaultValue: 'Qual dessas opções representa melhor seu estilo?'
      },
      {
        key: 'questionId',
        label: 'ID da Questão',
        type: 'text',
        defaultValue: 'question-1'
      },
      {
        key: 'allowMultiple',
        label: 'Permitir múltiplas seleções',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'maxSelections',
        label: 'Máximo de seleções',
        type: 'number',
        defaultValue: 3
      },
      {
        key: 'showImages',
        label: 'Mostrar imagens',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'autoAdvance',
        label: 'Auto-avanço',
        type: 'boolean',
        defaultValue: false
      }
    ],
    defaultProperties: {
      question: 'Qual dessas opções representa melhor seu estilo?',
      questionId: 'question-1',
      allowMultiple: true,
      maxSelections: 3,
      showImages: true,
      autoAdvance: false,
      options: [
        {
          id: '1',
          text: 'Clássico e elegante',
          imageUrl: '',
          styleCategory: 'Clássico',
          points: 2,
          keywords: ['elegante', 'sofisticado', 'atemporal']
        },
        {
          id: '2',
          text: 'Moderno e descolado',
          imageUrl: '',
          styleCategory: 'Contemporâneo',
          points: 3,
          keywords: ['moderno', 'descolado', 'inovador']
        },
        {
          id: '3',
          text: 'Natural e autêntico',
          imageUrl: '',
          styleCategory: 'Natural',
          points: 1,
          keywords: ['natural', 'autêntico', 'orgânico']
        }
      ]
    }
  },
  {
    type: 'quiz-result-calculated',
    name: 'Resultado Calculado',
    description: 'Componente que mostra o resultado calculado em tempo real com base nas respostas',
    icon: 'Award',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'showPercentages',
        label: 'Mostrar percentuais',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'showSecondaryStyles',
        label: 'Mostrar estilos secundários',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'maxSecondaryStyles',
        label: 'Máximo de estilos secundários',
        type: 'number',
        defaultValue: 2
      }
    ],
    defaultProperties: {
      showPercentages: true,
      showSecondaryStyles: true,
      maxSecondaryStyles: 2
    }
  },
  {
    type: 'quiz-start-page',
    name: 'Página Inicial do Quiz',
    description: 'Página de introdução e início do quiz',
    icon: 'Play',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        defaultValue: 'Descubra Seu Estilo'
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'textarea',
        defaultValue: 'Responda algumas perguntas e descubra qual é o seu estilo predominante'
      },
      {
        key: 'buttonText',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Começar Quiz'
      }
    ],
    defaultProperties: {
      title: 'Descubra Seu Estilo',
      subtitle: 'Responda algumas perguntas e descubra qual é o seu estilo predominante',
      buttonText: 'Começar Quiz'
    }
  },
  {
    type: 'quiz-transition',
    name: 'Transição do Quiz',
    description: 'Página de transição entre questões ou seções',
    icon: 'LoaderCircle',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'message',
        label: 'Mensagem',
        type: 'text',
        defaultValue: 'Analisando suas respostas...'
      },
      {
        key: 'duration',
        label: 'Duração (ms)',
        type: 'number',
        defaultValue: 3000
      }
    ],
    defaultProperties: {
      message: 'Analisando suas respostas...',
      duration: 3000
    }
  },
  {
    type: 'strategic-question',
    name: 'Questão Estratégica',
    description: 'Questões para segmentação e qualificação (etapas 13-18)',
    icon: 'Brain',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'question',
        label: 'Pergunta',
        type: 'textarea',
        defaultValue: 'Qual é o seu maior desafio?'
      },
      {
        key: 'options',
        label: 'Opções',
        type: 'array',
        defaultValue: [
          { id: '1', text: 'Opção 1', weight: 1 },
          { id: '2', text: 'Opção 2', weight: 2 },
          { id: '3', text: 'Opção 3', weight: 3 },
          { id: '4', text: 'Opção 4', weight: 4 }
        ]
      }
    ],
    defaultProperties: {
      question: 'Qual é o seu maior desafio?',
      options: [
        { id: '1', text: 'Opção 1', weight: 1 },
        { id: '2', text: 'Opção 2', weight: 2 },
        { id: '3', text: 'Opção 3', weight: 3 },
        { id: '4', text: 'Opção 4', weight: 4 }
      ]
    }
  },
  {
    type: 'question-multiple',
    name: 'Questão Múltipla Escolha',
    description: 'Questão de múltipla escolha avançada',
    icon: 'CheckCircle',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'question',
        label: 'Pergunta',
        type: 'textarea',
        defaultValue: 'Selecione uma ou mais opções:'
      },
      {
        key: 'options',
        label: 'Opções',
        type: 'array',
        defaultValue: [
          { id: '1', text: 'Opção 1' },
          { id: '2', text: 'Opção 2' },
          { id: '3', text: 'Opção 3' }
        ]
      },
      {
        key: 'allowMultiple',
        label: 'Permitir múltipla seleção',
        type: 'boolean',
        defaultValue: false
      }
    ],
    defaultProperties: {
      question: 'Selecione uma ou mais opções:',
      options: [
        { id: '1', text: 'Opção 1' },
        { id: '2', text: 'Opção 2' },
        { id: '3', text: 'Opção 3' }
      ],
      allowMultiple: false
    }
  },
  {
    type: 'quiz-offer-page',
    name: 'Página de Oferta do Quiz',
    description: 'Página completa de vendas após o resultado (etapa 21)',
    icon: 'ShoppingCart',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título da Oferta',
        type: 'text',
        defaultValue: 'Transforme Seu Estilo Agora'
      },
      {
        key: 'price',
        label: 'Preço',
        type: 'text',
        defaultValue: 'R$ 97,00'
      },
      {
        key: 'originalPrice',
        label: 'Preço Original',
        type: 'text',
        defaultValue: 'R$ 197,00'
      },
      {
        key: 'ctaText',
        label: 'Texto do CTA',
        type: 'text',
        defaultValue: 'Quero Transformar Meu Estilo'
      }
    ],
    defaultProperties: {
      title: 'Transforme Seu Estilo Agora',
      price: 'R$ 97,00',
      originalPrice: 'R$ 197,00',
      ctaText: 'Quero Transformar Meu Estilo'
    }
  },
  {
    type: 'modern-result-page',
    name: 'Página de Resultado Moderna',
    description: 'Página de resultado com design moderno e calculado',
    icon: 'Award',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'resultTitle',
        label: 'Título do Resultado',
        type: 'text',
        defaultValue: 'Seu Estilo Predominante'
      },
      {
        key: 'showCompatibility',
        label: 'Mostrar Compatibilidade',
        type: 'boolean',
        defaultValue: true
      }
    ],
    defaultProperties: {
      resultTitle: 'Seu Estilo Predominante',
      showCompatibility: true
    }
  },
  
  // ✅ COMPONENTES INLINE REAIS DAS 21 ETAPAS
  {
    type: 'quiz-intro-header',
    name: 'Cabeçalho do Quiz',
    description: 'Cabeçalho com logo e barra de progresso',
    icon: 'Play',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'logoUrl',
        label: 'URL do Logo',
        type: 'text',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
      },
      {
        key: 'progressValue',
        label: 'Valor do Progresso',
        type: 'number',
        defaultValue: 0
      }
    ],
    defaultProperties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      progressValue: 0
    }
  },
  {
    type: 'text-inline',
    name: 'Texto Inline',
    description: 'Componente de texto simples inline',
    icon: 'Type',
    category: 'Content',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'textarea',
        defaultValue: 'Texto exemplo'
      },
      {
        key: 'fontSize',
        label: 'Tamanho da Fonte',
        type: 'text',
        defaultValue: 'text-base'
      }
    ],
    defaultProperties: {
      content: 'Texto exemplo',
      fontSize: 'text-base'
    }
  },
  {
    type: 'heading-inline',
    name: 'Título Inline',
    description: 'Componente de título inline',
    icon: 'Heading1',
    category: 'Content',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Título',
        type: 'text',
        defaultValue: 'Título Exemplo'
      },
      {
        key: 'level',
        label: 'Nível (h1-h6)',
        type: 'number',
        defaultValue: 2
      }
    ],
    defaultProperties: {
      content: 'Título Exemplo',
      level: 2
    }
  },
  {
    type: 'image-display-inline',
    name: 'Imagem Inline',
    description: 'Componente de imagem inline',
    icon: 'Image',
    category: 'Content',
    propertiesSchema: [
      {
        key: 'src',
        label: 'URL da Imagem',
        type: 'text',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
      },
      {
        key: 'alt',
        label: 'Texto Alternativo',
        type: 'text',
        defaultValue: 'Imagem'
      }
    ],
    defaultProperties: {
      src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      alt: 'Imagem'
    }
  },
  {
    type: 'button-inline',
    name: 'Botão Inline',
    description: 'Componente de botão inline',
    icon: 'RectangleHorizontal',
    category: 'Interactive',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Clique aqui'
      },
      {
        key: 'variant',
        label: 'Variante',
        type: 'text',
        defaultValue: 'primary'
      }
    ],
    defaultProperties: {
      text: 'Clique aqui',
      variant: 'primary'
    }
  },
  {
    type: 'form-input',
    name: 'Campo de Formulário',
    description: 'Componente de input para formulários',
    icon: 'Keyboard',
    category: 'Interactive',
    propertiesSchema: [
      {
        key: 'label',
        label: 'Label',
        type: 'text',
        defaultValue: 'Nome'
      },
      {
        key: 'placeholder',
        label: 'Placeholder',
        type: 'text',
        defaultValue: 'Digite seu nome'
      },
      {
        key: 'required',
        label: 'Obrigatório',
        type: 'boolean',
        defaultValue: false
      }
    ],
    defaultProperties: {
      label: 'Nome',
      placeholder: 'Digite seu nome',
      required: false
    }
  },
  {
    type: 'options-grid',
    name: 'Grade de Opções',
    description: 'Grade de opções para quiz',
    icon: 'Grid3x3',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'options',
        label: 'Opções',
        type: 'array-of-objects',
        defaultValue: []
      },
      {
        key: 'questionId',
        label: 'ID da Questão',
        type: 'text',
        defaultValue: ''
      }
    ],
    defaultProperties: {
      options: [],
      questionId: ''
    }
  },
  {
    type: 'result-header-inline',
    name: 'Cabeçalho do Resultado',
    description: 'Cabeçalho personalizado para página de resultado',
    icon: 'Crown',
    category: 'Result',
    propertiesSchema: [
      {
        key: 'logoUrl',
        label: 'URL do Logo',
        type: 'text',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
      },
      {
        key: 'userName',
        label: 'Nome do Usuário',
        type: 'text',
        defaultValue: 'Usuário'
      },
      {
        key: 'showProgress',
        label: 'Mostrar Progresso',
        type: 'boolean',
        defaultValue: false
      }
    ],
    defaultProperties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      userName: 'Usuário',
      showProgress: false
    }
  },
  {
    type: 'result-card-inline',
    name: 'Card Principal do Resultado',
    description: 'Card principal mostrando o estilo predominante',
    icon: 'Award',
    category: 'Result',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        defaultValue: 'Seu Estilo Predominante'
      },
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'text',
        defaultValue: 'Clássico'
      },
      {
        key: 'percentage',
        label: 'Porcentagem',
        type: 'number',
        defaultValue: 85
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Baseado nas suas respostas, identificamos características do estilo...'
      },
      {
        key: 'imageUrl',
        label: 'URL da Imagem',
        type: 'text',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'
      }
    ],
    defaultProperties: {
      title: 'Seu Estilo Predominante',
      styleName: 'Clássico',
      percentage: 85,
      description: 'Baseado nas suas respostas, identificamos características do estilo...',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'
    }
  },
  {
    type: 'style-card-inline',
    name: 'Card de Estilo Secundário',
    description: 'Card para mostrar estilos secundários/complementares',
    icon: 'Palette',
    category: 'Result',
    propertiesSchema: [
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'text',
        defaultValue: 'Estilo Secundário'
      },
      {
        key: 'percentage',
        label: 'Porcentagem',
        type: 'number',
        defaultValue: 20
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Características complementares do seu estilo'
      },
      {
        key: 'imageUrl',
        label: 'URL da Imagem',
        type: 'text',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_moderno.webp'
      },
      {
        key: 'compact',
        label: 'Modo Compacto',
        type: 'boolean',
        defaultValue: true
      }
    ],
    defaultProperties: {
      styleName: 'Estilo Secundário',
      percentage: 20,
      description: 'Características complementares do seu estilo',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_moderno.webp',
      compact: true
    }
  },
  
  // Blocos básicos existentes
  {
    type: 'heading',
    name: 'Título',
    description: 'Títulos e subtítulos com diferentes níveis (H1-H4)',
    icon: 'Heading1',
    category: 'content',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'text',
        defaultValue: 'Seu Título Aqui'
      },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4'],
        defaultValue: 'h1'
      }
    ],
    defaultProperties: {
      content: 'Seu Título Aqui',
      level: 'h1'
    }
  },
  {
    type: 'text',
    name: 'Texto',
    description: 'Bloco de texto simples com formatação básica',
    icon: 'Type',
    category: 'content',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'textarea',
        defaultValue: 'Parágrafo de texto editável.'
      }
    ],
    defaultProperties: {
      content: 'Parágrafo de texto editável.'
    }
  },
  {
    type: 'paragraph',
    name: 'Parágrafo',
    description: 'Bloco de parágrafo simples',
    icon: 'Type',
    category: 'content',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'textarea',
        defaultValue: 'Parágrafo de texto editável.'
      }
    ],
    defaultProperties: {
      content: 'Parágrafo de texto editável.'
    }
  },
  {
    type: 'button',
    name: 'Botão',
    description: 'Botão interativo com link ou ação personalizada',
    icon: 'RectangleHorizontal',
    category: 'content',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Clique Aqui'
      },
      {
        key: 'url',
        label: 'URL',
        type: 'url',
        defaultValue: '#'
      }
    ],
    defaultProperties: {
      text: 'Clique Aqui',
      url: '#'
    }
  },
  {
    type: 'image',
    name: 'Image',
    description: 'An image block',
    icon: 'Image',
    category: 'content',
    propertiesSchema: [
      {
        key: 'src',
        label: 'Image URL',
        type: 'image-url',
        defaultValue: PlaceholderUtils.generateContentPlaceholder(400, 300)
      },
      {
        key: 'alt',
        label: 'Alt Text',
        type: 'text',
        defaultValue: 'Image description'
      }
    ],
    defaultProperties: {
      src: PlaceholderUtils.generateContentPlaceholder(400, 300),
      alt: 'Image description'
    }
  },

  // ===========================
  // COMPONENTES MODERNOS PARA PÁGINAS DINÂMICAS
  // Modulares, Independentes, BoxFlex, Reutilizáveis e Editáveis
  // ===========================

  // COMPONENTES DE LAYOUT FLEXÍVEL
  {
    type: 'flex-container-horizontal',
    name: 'Container Horizontal Flex',
    description: 'Container flexível horizontal para organizar componentes em linha (inline/boxflex)',
    icon: 'ArrowRightLeft',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'justifyContent',
        label: 'Alinhamento Horizontal',
        type: 'select',
        options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
        defaultValue: 'space-between'
      },
      {
        key: 'alignItems',
        label: 'Alinhamento Vertical',
        type: 'select',
        options: ['flex-start', 'center', 'flex-end', 'stretch'],
        defaultValue: 'center'
      },
      {
        key: 'gap',
        label: 'Espaçamento (px)',
        type: 'number',
        defaultValue: 16
      },
      {
        key: 'wrap',
        label: 'Quebra de linha',
        type: 'boolean',
        defaultValue: true
      }
    ],
    defaultProperties: {
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      wrap: true,
      className: 'flex flex-wrap items-center justify-between gap-4 p-4'
    }
  },

  {
    type: 'flex-container-vertical',
    name: 'Container Vertical Flex',
    description: 'Container flexível vertical para organizar componentes em coluna',
    icon: 'Rows3',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'alignItems',
        label: 'Alinhamento Horizontal',
        type: 'select',
        options: ['flex-start', 'center', 'flex-end', 'stretch'],
        defaultValue: 'center'
      },
      {
        key: 'justifyContent',
        label: 'Alinhamento Vertical',
        type: 'select',
        options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
        defaultValue: 'flex-start'
      },
      {
        key: 'gap',
        label: 'Espaçamento (px)',
        type: 'number',
        defaultValue: 24
      }
    ],
    defaultProperties: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 24,
      className: 'flex flex-col items-center justify-start gap-6 p-6'
    }
  },

  // COMPONENTES DE VENDAS MODERNOS
  {
    type: 'countdown-timer-real',
    name: 'Timer de Contagem Regressiva',
    description: 'Timer funcional e editável com design moderno para urgência em vendas',
    icon: 'Clock',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'targetDate',
        label: 'Data/Hora Alvo',
        type: 'datetime-local',
        defaultValue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      },
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        defaultValue: 'Esta oferta expira em:'
      },
      {
        key: 'showLabels',
        label: 'Mostrar Labels (dias, horas, etc)',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      },
      {
        key: 'color',
        label: 'Cor do tema',
        type: 'color',
        defaultValue: '#432818'
      }
    ],
    defaultProperties: {
      targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      title: 'Esta oferta expira em:',
      showLabels: true,
      size: 'medium',
      color: '#432818'
    }
  },

  {
    type: 'pricing-card-modern',
    name: 'Card de Preço Moderno',
    description: 'Card de preço responsivo e editável com destaque e call-to-action',
    icon: 'CircleDollarSign',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título da Oferta',
        type: 'text',
        defaultValue: 'Oferta Especial'
      },
      {
        key: 'originalPrice',
        label: 'Preço Original',
        type: 'number',
        defaultValue: 497
      },
      {
        key: 'salePrice',
        label: 'Preço Promocional',
        type: 'number',
        defaultValue: 197
      },
      {
        key: 'currency',
        label: 'Moeda',
        type: 'text',
        defaultValue: 'R$'
      },
      {
        key: 'installments',
        label: 'Parcelamento',
        type: 'text',
        defaultValue: '12x de R$ 16,42'
      },
      {
        key: 'ctaText',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Quero Aproveitar'
      },
      {
        key: 'highlight',
        label: 'Destacar Card',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'badge',
        label: 'Badge de Destaque',
        type: 'text',
        defaultValue: 'MELHOR OFERTA'
      }
    ],
    defaultProperties: {
      title: 'Oferta Especial',
      originalPrice: 497,
      salePrice: 197,
      currency: 'R$',
      installments: '12x de R$ 16,42',
      ctaText: 'Quero Aproveitar',
      highlight: true,
      badge: 'MELHOR OFERTA'
    }
  },

  {
    type: 'cta-button-modern',
    name: 'Botão CTA Moderno',
    description: 'Botão de call-to-action com animações e estados editáveis',
    icon: 'MousePointer',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Comprar Agora'
      },
      {
        key: 'subtext',
        label: 'Subtexto',
        type: 'text',
        defaultValue: 'Pagamento 100% seguro'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: ['small', 'medium', 'large', 'xlarge'],
        defaultValue: 'large'
      },
      {
        key: 'variant',
        label: 'Variante',
        type: 'select',
        options: ['primary', 'secondary', 'gradient', 'outline'],
        defaultValue: 'gradient'
      },
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: ['none', 'arrow', 'check', 'heart', 'star', 'lock'],
        defaultValue: 'arrow'
      },
      {
        key: 'pulse',
        label: 'Animação de Pulso',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'fullWidth',
        label: 'Largura Total',
        type: 'boolean',
        defaultValue: false
      }
    ],
    defaultProperties: {
      text: 'Comprar Agora',
      subtext: 'Pagamento 100% seguro',
      size: 'large',
      variant: 'gradient',
      icon: 'arrow',
      pulse: true,
      fullWidth: false
    }
  },

  // COMPONENTES DE QUIZ MODERNOS
  {
    type: 'quiz-question-modern',
    name: 'Questão de Quiz Moderna',
    description: 'Componente de questão com layout responsivo, imagens e múltiplas seleções',
    icon: 'HelpCircle',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'question',
        label: 'Pergunta',
        type: 'textarea',
        defaultValue: 'Qual dessas opções mais combina com você?'
      },
      {
        key: 'questionNumber',
        label: 'Número da Questão',
        type: 'number',
        defaultValue: 1
      },
      {
        key: 'totalQuestions',
        label: 'Total de Questões',
        type: 'number',
        defaultValue: 10
      },
      {
        key: 'layout',
        label: 'Layout das Opções',
        type: 'select',
        options: ['grid-2', 'grid-3', 'grid-4', 'list', 'horizontal'],
        defaultValue: 'grid-2'
      },
      {
        key: 'allowMultiple',
        label: 'Múltiplas Seleções',
        type: 'boolean',
        defaultValue: false
      },
      {
        key: 'showImages',
        label: 'Mostrar Imagens',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'autoAdvance',
        label: 'Avançar Automaticamente',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'showProgress',
        label: 'Mostrar Progresso',
        type: 'boolean',
        defaultValue: true
      }
    ],
    defaultProperties: {
      question: 'Qual dessas opções mais combina com você?',
      questionNumber: 1,
      totalQuestions: 10,
      layout: 'grid-2',
      allowMultiple: false,
      showImages: true,
      autoAdvance: true,
      showProgress: true,
      options: [
        {
          id: 'opt1',
          text: 'Opção 1',
          image: 'https://via.placeholder.com/300x200',
          value: 'option1'
        },
        {
          id: 'opt2',
          text: 'Opção 2',
          image: 'https://via.placeholder.com/300x200',
          value: 'option2'
        }
      ]
    }
  },

  {
    type: 'progress-bar-modern',
    name: 'Barra de Progresso Moderna',
    description: 'Barra de progresso animada e customizável para quizzes e formulários',
    icon: 'TrendingUp',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'percentage',
        label: 'Porcentagem (%)',
        type: 'number',
        defaultValue: 65
      },
      {
        key: 'showLabel',
        label: 'Mostrar Label',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'label',
        label: 'Texto do Label',
        type: 'text',
        defaultValue: 'Progresso do Quiz'
      },
      {
        key: 'animated',
        label: 'Animação',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'color',
        label: 'Cor',
        type: 'select',
        options: ['primary', 'success', 'warning', 'danger', 'custom'],
        defaultValue: 'primary'
      },
      {
        key: 'customColor',
        label: 'Cor Personalizada',
        type: 'color',
        defaultValue: '#B89B7A'
      },
      {
        key: 'height',
        label: 'Altura (px)',
        type: 'number',
        defaultValue: 8
      }
    ],
    defaultProperties: {
      percentage: 65,
      showLabel: true,
      label: 'Progresso do Quiz',
      animated: true,
      color: 'primary',
      customColor: '#B89B7A',
      height: 8
    }
  },

  // COMPONENTES DE CONTEÚDO FLEXÍVEL
  {
    type: 'image-text-card',
    name: 'Card Imagem + Texto',
    description: 'Card flexível com imagem e texto, layout editável (horizontal/vertical)',
    icon: 'Package',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: ['horizontal', 'vertical', 'image-left', 'image-right', 'image-top', 'image-bottom'],
        defaultValue: 'horizontal'
      },
      {
        key: 'imageUrl',
        label: 'URL da Imagem',
        type: 'image-url',
        defaultValue: PlaceholderUtils.generateContentPlaceholder(400, 300)
      },
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        defaultValue: 'Título do Card'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Descrição detalhada do conteúdo do card.'
      },
      {
        key: 'buttonText',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Saiba Mais'
      },
      {
        key: 'buttonUrl',
        label: 'URL do Botão',
        type: 'url',
        defaultValue: '#'
      },
      {
        key: 'imageRatio',
        label: 'Proporção da Imagem',
        type: 'select',
        options: ['1:1', '4:3', '16:9', '3:2'],
        defaultValue: '4:3'
      },
      {
        key: 'shadow',
        label: 'Sombra',
        type: 'boolean',
        defaultValue: true
      }
    ],
    defaultProperties: {
      layout: 'horizontal',
      imageUrl: PlaceholderUtils.generateContentPlaceholder(400, 300),
      title: 'Título do Card',
      description: 'Descrição detalhada do conteúdo do card.',
      buttonText: 'Saiba Mais',
      buttonUrl: '#',
      imageRatio: '4:3',
      shadow: true
    }
  },

  {
    type: 'stats-counter',
    name: 'Contador de Estatísticas',
    description: 'Contador animado para mostrar números importantes (vendas, clientes, etc.)',
    icon: 'BarChart3',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'number',
        label: 'Número',
        type: 'number',
        defaultValue: 1250
      },
      {
        key: 'label',
        label: 'Label',
        type: 'text',
        defaultValue: 'Clientes Satisfeitos'
      },
      {
        key: 'prefix',
        label: 'Prefixo',
        type: 'text',
        defaultValue: ''
      },
      {
        key: 'suffix',
        label: 'Sufixo',
        type: 'text',
        defaultValue: '+'
      },
      {
        key: 'animationDuration',
        label: 'Duração da Animação (ms)',
        type: 'number',
        defaultValue: 2000
      },
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: ['none', 'users', 'star', 'heart', 'check', 'trophy', 'target'],
        defaultValue: 'users'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      }
    ],
    defaultProperties: {
      number: 1250,
      label: 'Clientes Satisfeitos',
      prefix: '',
      suffix: '+',
      animationDuration: 2000,
      icon: 'users',
      size: 'medium'
    }
  },

  {
    type: 'testimonial-card',
    name: 'Card de Depoimento',
    description: 'Card de depoimento com foto, nome, avaliação e texto editáveis',
    icon: 'Quote',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Depoimento',
        type: 'textarea',
        defaultValue: 'Este produto mudou minha vida! Recomendo para todos.'
      },
      {
        key: 'authorName',
        label: 'Nome do Autor',
        type: 'text',
        defaultValue: 'Maria Silva'
      },
      {
        key: 'authorTitle',
        label: 'Título/Cargo',
        type: 'text',
        defaultValue: 'Cliente Verificada'
      },
      {
        key: 'authorPhoto',
        label: 'Foto do Autor',
        type: 'image-url',
        defaultValue: PlaceholderUtils.generateAvatarPlaceholder(80, '👤')
      },
      {
        key: 'rating',
        label: 'Avaliação (1-5)',
        type: 'number',
        defaultValue: 5
      },
      {
        key: 'showStars',
        label: 'Mostrar Estrelas',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: ['card', 'inline', 'minimal'],
        defaultValue: 'card'
      }
    ],
    defaultProperties: {
      text: 'Este produto mudou minha vida! Recomendo para todos.',
      authorName: 'Maria Silva',
      authorTitle: 'Cliente Verificada',
      authorPhoto: PlaceholderUtils.generateAvatarPlaceholder(80, '👤'),
      rating: 5,
      showStars: true,
      layout: 'card'
    }
  },

  {
    type: 'feature-highlight',
    name: 'Destaque de Recurso',
    description: 'Card para destacar recursos/benefícios com ícone, título e descrição',
    icon: 'Star',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: ['check', 'star', 'heart', 'shield', 'lightning', 'gift', 'target', 'crown'],
        defaultValue: 'check'
      },
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        defaultValue: 'Recurso Incrível'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Descrição detalhada do recurso e seus benefícios.'
      },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: ['vertical', 'horizontal', 'icon-left', 'icon-top'],
        defaultValue: 'vertical'
      },
      {
        key: 'iconColor',
        label: 'Cor do Ícone',
        type: 'color',
        defaultValue: '#B89B7A'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      }
    ],
    defaultProperties: {
      icon: 'check',
      title: 'Recurso Incrível',
      description: 'Descrição detalhada do recurso e seus benefícios.',
      layout: 'vertical',
      iconColor: '#B89B7A',
      size: 'medium'
    }
  },

  {
    type: 'section-divider',
    name: 'Divisor de Seção',
    description: 'Divisor estilizado para separar seções da página',
    icon: 'Minus',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'style',
        label: 'Estilo',
        type: 'select',
        options: ['line', 'dots', 'wave', 'gradient', 'ornament'],
        defaultValue: 'gradient'
      },
      {
        key: 'thickness',
        label: 'Espessura (px)',
        type: 'number',
        defaultValue: 2
      },
      {
        key: 'color',
        label: 'Cor',
        type: 'color',
        defaultValue: '#B89B7A'
      },
      {
        key: 'spacing',
        label: 'Espaçamento Vertical (px)',
        type: 'number',
        defaultValue: 32
      },
      {
        key: 'width',
        label: 'Largura (%)',
        type: 'number',
        defaultValue: 50
      }
    ],
    defaultProperties: {
      style: 'gradient',
      thickness: 2,
      color: '#B89B7A',
      spacing: 32,
      width: 50
    }
  },

  // COMPONENTES INLINE BÁSICOS
  {
    type: 'text-inline',
    name: 'Texto Moderno',
    description: 'Texto responsivo com tipografia moderna',
    icon: 'Type',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'textarea',
        defaultValue: 'Texto editável com formatação elegante.'
      },
      {
        key: 'fontFamily',
        label: 'Família da Fonte',
        type: 'select',
        options: ['Playfair Display', 'Inter', 'system-ui'],
        defaultValue: 'Inter'
      },
      {
        key: 'fontSize',
        label: 'Tamanho',
        type: 'select',
        options: ['text-sm', 'text-base', 'text-lg', 'text-2xl', 'text-3xl'],
        defaultValue: 'text-base'
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: ['text-left', 'text-center', 'text-right'],
        defaultValue: 'text-left'
      },
      {
        key: 'color',
        label: 'Cor do Texto',
        type: 'color',
        defaultValue: '#432818'
      }
    ],
    defaultProperties: {
      content: 'Texto editável com formatação elegante.',
      fontFamily: 'Inter',
      fontSize: 'text-base',
      textAlign: 'text-left',
      color: '#432818'
    }
  },

  {
    type: 'heading-inline',
    name: 'Título Elegante',
    description: 'Títulos com design moderno e destaque de palavras',
    icon: 'Heading',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Título',
        type: 'text',
        defaultValue: 'Título Principal'
      },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4'],
        defaultValue: 'h2'
      },
      {
        key: 'fontWeight',
        label: 'Peso da Fonte',
        type: 'select',
        options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
        defaultValue: 'bold'
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: ['left', 'center', 'right'],
        defaultValue: 'center'
      },
      {
        key: 'color',
        label: 'Cor do Texto',
        type: 'color',
        defaultValue: '#1f2937'
      }
    ],
    defaultProperties: {
      content: 'Título Principal',
      level: 'h2',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#1f2937'
    }
  },

  {
    type: 'button-inline',
    name: 'Botão Elegante',
    description: 'Botão responsivo com design moderno',
    icon: 'MousePointer',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text',
        defaultValue: 'Clique Aqui'
      },
      {
        key: 'href',
        label: 'Link/Ação',
        type: 'text',
        defaultValue: '#'
      },
      {
        key: 'variant',
        label: 'Estilo',
        type: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost'],
        defaultValue: 'primary'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      },
      {
        key: 'fullWidth',
        label: 'Largura Total',
        type: 'boolean',
        defaultValue: false
      }
    ],
    defaultProperties: {
      text: 'Clique Aqui',
      href: '#',
      variant: 'primary',
      size: 'medium',
      fullWidth: false
    }
  }
];

// Utility functions
export function getCategories(): string[] {
  const categories = new Set(blockDefinitions.map(block => block.category));
  return Array.from(categories);
}

export function getBlocksByCategory(category: string): BlockDefinition[] {
  return blockDefinitions.filter(block => block.category === category);
}

export function findBlockDefinition(type: string): BlockDefinition | undefined {
  return blockDefinitions.find(block => block.type === type);
}

export function getNewBlocks(): BlockDefinition[] {
  return blockDefinitions.filter(block => block.category === 'content');
}

export function searchBlocks(searchTerm: string): BlockDefinition[] {
  const term = searchTerm.toLowerCase();
  return blockDefinitions.filter(block => 
    block.name.toLowerCase().includes(term) ||
    block.description.toLowerCase().includes(term) ||
    block.type.toLowerCase().includes(term)
  );
}

export function isValidBlockType(type: string): boolean {
  return blockDefinitions.some(block => block.type === type);
}

export function createDefaultBlock(type: string, id?: string): any | null {
  const definition = findBlockDefinition(type);
  if (!definition) return null;

  const properties: Record<string, any> = {};
  
  definition.propertiesSchema?.forEach(prop => {
    if (prop.defaultValue !== undefined) {
      properties[prop.key] = prop.defaultValue;
    }
  });

  return {
    id: id || `${type}-${Date.now()}`,
    type,
    properties,
    order: 0
  };
}

export function getBlockPropertiesSchema(type: string): PropertySchema[] | undefined {
  const definition = findBlockDefinition(type);
  return definition?.propertiesSchema;
}