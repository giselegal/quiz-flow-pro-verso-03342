import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTabProps {
  analyticsData: any;
  loading: boolean;
}

export const DataTab: React.FC<DataTabProps> = ({ analyticsData, loading }) => {
  const events = analyticsData?.events?.slice(0, 50) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados Brutos de Analytics</CardTitle>
          <CardDescription>Explore todos os eventos rastreados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Evento</TableHead>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{event.type}</TableCell>
                    <TableCell>{new Date(event.timestamp).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{event.userName || 'N/A'}</TableCell>
                    <TableCell>{event.userEmail || event.email || 'N/A'}</TableCell>
                    <TableCell className="max-w-[12rem] truncate">
                      {Object.entries(event)
                        .filter(
                          ([key]) =>
                            ![
                              'type',
                              'timestamp',
                              'userName',
                              'userEmail',
                              'email',
                              'sessionId',
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium">{key}:</span> {JSON.stringify(value)}
                          </div>
                        ))}
                    </TableCell>
                  </TableRow>
                ))}
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      {loading ? 'Carregando dados...' : 'Nenhum dado de analytics encontrado'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {analyticsData?.events?.length > 50 && (
            <div style={{ color: '#8B7355' }}>
              Mostrando os 50 eventos mais recentes. Exporte o CSV para visualizar todos os dados.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => analyticsData?.onExportData?.()}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar todos os dados
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
