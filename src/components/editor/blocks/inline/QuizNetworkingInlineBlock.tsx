import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Users, MessageCircle, Calendar, MapPin, Star, ExternalLink, UserPlus, Network, Coffee, Briefcase, Globe, Award, TrendingUp, ChevronRight, Mail, Phone, Linkedin, ArrowRight, Clock, Heart } from 'lucide-react';

interface QuizNetworkingInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de networking
}

/**
 * Componente inline para networking e conexões (Etapa 17)
 * Sistema de networking profissional e conexões baseadas em compatibilidade
 */
export const QuizNetworkingInlineBlock: React.FC<QuizNetworkingInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedConnectionType, setSelectedConnectionType] = useState('suggested');
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Sua Rede Profissional';
  const subtitle = properties.subtitle || 'Conecte-se com profissionais que compartilham objetivos similares e acelere seu crescimento';
  const userProfile = properties.userProfile || {
    name: 'João Silva',
    role: 'Gerente de Projetos',
    company: 'TechCorp',
    competencies: ['Liderança', 'Inovação', 'Estratégia'],
    score: 85,
    location: 'São Paulo, SP',
    avatar: '/api/placeholder/60/60'
  };
  const suggestedConnections = properties.suggestedConnections || [
    {
      id: 1,
      name: 'Maria Santos',
      role: 'Diretora de Marketing',
      company: 'Growth Co.',
      compatibilityScore: 92,
      mutualConnections: 8,
      competencies: ['Liderança', 'Comunicação', 'Estratégia'],
      location: 'São Paulo, SP',
      avatar: '/api/placeholder/60/60',
      matchReasons: [
        'Perfil de liderança similar',
        '8 conexões em comum',
        'Mesma região geográfica'
      ],
      online: true,
      lastActivity: '2h atrás'
    },
    {
      id: 2,
      name: 'Carlos Lima',
      role: 'CTO',
      company: 'InnovaTech',
      compatibilityScore: 88,
      mutualConnections: 5,
      competencies: ['Inovação', 'Estratégia', 'Tecnologia'],
      location: 'Rio de Janeiro, RJ',
      avatar: '/api/placeholder/60/60',
      matchReasons: [
        'Alto score em Inovação',
        'Experiência em liderança tech',
        'Objetivos de crescimento similares'
      ],
      online: false,
      lastActivity: '1 dia atrás'
    },
    {
      id: 3,
      name: 'Ana Costa',
      role: 'Head de RH',
      company: 'People First',
      compatibilityScore: 85,
      mutualConnections: 12,
      competencies: ['Liderança', 'Comunicação', 'Gestão de Pessoas'],
      location: 'São Paulo, SP',
      avatar: '/api/placeholder/60/60',
      matchReasons: [
        'Forte em desenvolvimento de pessoas',
        '12 conexões em comum',
        'Interesse em liderança transformacional'
      ],
      online: true,
      lastActivity: '30min atrás'
    }
  ];
  const networkingEvents = properties.networkingEvents || [
    {
      id: 1,
      title: 'Workshop: Liderança Digital',
      type: 'workshop',
      date: '2025-02-15',
      time: '19:00',
      location: 'Online',
      attendees: 45,
      maxAttendees: 50,
      organizer: 'TechLeaders SP',
      tags: ['Liderança', 'Digital', 'Transformação'],
      price: 'Gratuito',
      description: 'Desenvolva suas habilidades de liderança na era digital'
    },
    {
      id: 2,
      title: 'Networking Coffee: Inovação',
      type: 'networking',
      date: '2025-02-18',
      time: '08:00',
      location: 'Café Central, São Paulo',
      attendees: 20,
      maxAttendees: 25,
      organizer: 'Innovation Hub',
      tags: ['Inovação', 'Startups', 'Networking'],
      price: 'R$ 15',
      description: 'Café da manhã com profissionais de inovação'
    },
    {
      id: 3,
      title: 'Conferência: Estratégias 2025',
      type: 'conference',
      date: '2025-03-05',
      time: '09:00',
      location: 'Centro de Convenções',
      attendees: 200,
      maxAttendees: 300,
      organizer: 'Strategic Leaders',
      tags: ['Estratégia', 'Planejamento', 'Liderança'],
      price: 'R$ 150',
      description: 'As principais tendências estratégicas para 2025'
    }
  ];
  const networkStats = properties.networkStats || {
    totalConnections: 247,
    newThisMonth: 18,
    eventsAttended: 12,
    recommendationsSent: 34,
    influenceScore: 78,
    networkGrowth: 15.2
  };
  const mentorshipOpportunities = properties.mentorshipOpportunities || [
    {
      id: 1,
      type: 'mentor',
      name: 'Roberto Silva',
      role: 'VP de Inovação',
      company: 'Global Tech',
      expertise: ['Liderança Executiva', 'Transformação Digital', 'Inovação'],
      availability: 'Quinzenal',
      rating: 4.9,
      sessions: 156,
      price: 'R$ 200/sessão'
    },
    {
      id: 2,
      type: 'mentee',
      name: 'Julia Martins',
      role: 'Analista Jr.',
      company: 'StartUp Pro',
      needsHelp: ['Desenvolvimento de Carreira', 'Liderança Inicial'],
      commitment: 'Mensal',
      motivation: 'Alto interesse em crescimento'
    }
  ];
  const showCompatibilityScore = properties.showCompatibilityScore || true;
  const showNetworkStats = properties.showNetworkStats || true;
  const showEvents = properties.showEvents || true;
  const showMentorship = properties.showMentorship || true;
  const layoutStyle = properties.layoutStyle || 'cards'; // cards, list, grid
  const theme = properties.theme || 'professional';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getEventIcon = (type: string) => {
    const icons = {
      workshop: Briefcase,
      networking: Coffee,
      conference: Users,
      webinar: Globe
    };
    return icons[type as keyof typeof icons] || Calendar;
  };

  const getThemeClasses = () => {
    const themes = {
      professional: {
        bg: 'from-slate-50 to-blue-50',
        border: 'border-slate-200',
        accent: 'text-slate-700',
        button: 'bg-slate-700 hover:bg-slate-800'
      },
      social: {
        bg: 'from-blue-50 to-indigo-100',
        border: 'border-blue-200',
        accent: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      creative: {
        bg: 'from-purple-50 to-pink-100',
        border: 'border-purple-200',
        accent: 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return themes[theme as keyof typeof themes] || themes.professional;
  };

  const themeClasses = getThemeClasses();
  const filteredConnections = suggestedConnections.filter(connection => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high-match') return connection.compatibilityScore >= 85;
    if (selectedFilter === 'same-area') return connection.competencies.some(comp => 
      userProfile.competencies.includes(comp)
    );
    if (selectedFilter === 'same-location') return connection.location === userProfile.location;
    return true;
  });

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[900px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && 'ring-2 ring-blue-500',
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        {isEditMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título do networking"
              className="w-full text-3xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <textarea
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              rows={2}
              className="w-full text-center p-2 border border-gray-300 rounded resize-none"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-3', themeClasses.accent)}>
              {title}
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Estatísticas da Rede */}
      {showNetworkStats && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sua Rede em Números
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {networkStats.totalConnections}
                </div>
                <div className="text-xs text-gray-600">Total Conexões</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center gap-1">
                  +{networkStats.newThisMonth}
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-xs text-gray-600">Novas/Mês</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {networkStats.eventsAttended}
                </div>
                <div className="text-xs text-gray-600">Eventos</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {networkStats.recommendationsSent}
                </div>
                <div className="text-xs text-gray-600">Recomendações</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {networkStats.influenceScore}
                </div>
                <div className="text-xs text-gray-600">Influência</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  +{networkStats.networkGrowth}%
                </div>
                <div className="text-xs text-gray-600">Crescimento</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abas de Navegação */}
      <div className="mb-6">
        <div className="flex bg-white rounded-lg border shadow-sm p-1">
          {[
            { key: 'suggested', label: 'Sugestões', icon: UserPlus },
            { key: 'events', label: 'Eventos', icon: Calendar },
            { key: 'mentorship', label: 'Mentoria', icon: Award }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedConnectionType(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  selectedConnectionType === tab.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                )}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo por Aba */}
      {selectedConnectionType === 'suggested' && (
        <div>
          {/* Filtros */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'high-match', label: 'Alta Compatibilidade' },
                { key: 'same-area', label: 'Mesma Área' },
                { key: 'same-location', label: 'Mesma Região' }
              ].map((filter) => (
                <Badge
                  key={filter.key}
                  variant={selectedFilter === filter.key ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter(filter.key)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conexões Sugeridas */}
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
              <div key={connection.id} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar e Status */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {connection.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {connection.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {connection.role} • {connection.company}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{connection.location}</span>
                          <Clock className="w-3 h-3 text-gray-400 ml-2" />
                          <span className="text-xs text-gray-500">{connection.lastActivity}</span>
                        </div>
                      </div>

                      {/* Score de Compatibilidade */}
                      {showCompatibilityScore && (
                        <div className="text-center">
                          <div className={cn(
                            'px-3 py-1 rounded-full text-sm font-medium',
                            getCompatibilityColor(connection.compatibilityScore)
                          )}>
                            {connection.compatibilityScore}% match
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {connection.mutualConnections} em comum
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Competências */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {connection.competencies.map((comp) => (
                        <Badge
                          key={comp}
                          variant={userProfile.competencies.includes(comp) ? "default" : "outline"}
                          className="text-xs"
                        >
                          {comp}
                        </Badge>
                      ))}
                    </div>

                    {/* Razões do Match */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Por que vocês são compatíveis:</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {connection.matchReasons.map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Conectar
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Mensagem
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eventos de Networking */}
      {selectedConnectionType === 'events' && showEvents && (
        <div className="space-y-4">
          {networkingEvents.map((event) => {
            const EventIconComponent = getEventIcon(event.type);
            const spotsLeft = event.maxAttendees - event.attendees;
            
            return (
              <div key={event.id} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <EventIconComponent className="text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendees} participantes
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {event.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          {spotsLeft} vagas restantes
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Mais Info
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Participar
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Oportunidades de Mentoria */}
      {selectedConnectionType === 'mentorship' && showMentorship && (
        <div className="space-y-6">
          {/* Seção de Mentores */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Encontre um Mentor
            </h3>
            <div className="space-y-4">
              {mentorshipOpportunities
                .filter(opp => opp.type === 'mentor')
                .map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {mentor.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {mentor.role} • {mentor.company}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{mentor.rating}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {mentor.sessions} sessões
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {mentor.expertise.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Disponibilidade:</span> {mentor.availability}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-green-600">
                              {mentor.price}
                            </span>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Agendar Sessão
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Seção de Mentorados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Seja um Mentor
            </h3>
            <div className="space-y-4">
              {mentorshipOpportunities
                .filter(opp => opp.type === 'mentee')
                .map((mentee) => (
                  <div key={mentee.id} className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {mentee.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {mentee.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {mentee.role} • {mentee.company}
                            </p>
                          </div>

                          <Badge className="bg-green-100 text-green-700">
                            {mentee.motivation}
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Precisa de ajuda com:</span>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {mentee.needsHelp.map((need) => (
                              <Badge key={need} variant="outline" className="text-xs">
                                {need}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Compromisso:</span> {mentee.commitment}
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Heart className="w-4 h-4 mr-1" />
                            Oferecer Mentoria
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Ação Principal */}
      {!isEditMode && (
        <div className="text-center mt-8">
          <Button
            size="lg"
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              themeClasses.button
            )}
          >
            Expandir Minha Rede
            <Network className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showCompatibilityScore ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCompatibilityScore', !showCompatibilityScore)}
            >
              Mostrar Compatibilidade
            </Badge>
            
            <Badge
              variant={showNetworkStats ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showNetworkStats', !showNetworkStats)}
            >
              Mostrar Estatísticas
            </Badge>

            <Badge
              variant={showEvents ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showEvents', !showEvents)}
            >
              Mostrar Eventos
            </Badge>

            <Badge
              variant={showMentorship ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showMentorship', !showMentorship)}
            >
              Mostrar Mentoria
            </Badge>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <div className="flex gap-2">
              {['cards', 'list', 'grid'].map((layout) => (
                <Badge
                  key={layout}
                  variant={layoutStyle === layout ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('layoutStyle', layout)}
                >
                  {layout}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="flex gap-2">
              {['professional', 'social', 'creative'].map((themeOption) => (
                <Badge
                  key={themeOption}
                  variant={theme === themeOption ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', themeOption)}
                >
                  {themeOption}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizNetworkingInlineBlock;
