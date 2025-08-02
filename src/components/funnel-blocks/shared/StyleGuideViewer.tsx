import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

interface StyleGuideViewerProps {
  className?: string;
}

/**
 * StyleGuideViewer - Visualizador de Guia de Estilos
 * 
 * Este componente exibe uma variedade de elementos de estilo
 * para garantir consistência visual em toda a aplicação.
 */
export const StyleGuideViewer: React.FC<StyleGuideViewerProps> = ({ className = '' }) => {
  return (
    <div className={cn("container py-10", className)}>
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Guia de Estilos
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Este guia apresenta os estilos e componentes reutilizáveis da aplicação.
        Use-o como referência para manter a consistência visual.
      </p>

      {/* Cores */}
      <section className="mt-8">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight">
          Cores
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Paleta de cores principal da aplicação.
        </p>
        <div className="style-viewer-grid">
          <div className="p-4 rounded-lg shadow-sm bg-primary text-primary-foreground">
            Primary
          </div>
          <div className="p-4 rounded-lg shadow-sm bg-secondary text-secondary-foreground">
            Secondary
          </div>
          <div className="p-4 rounded-lg shadow-sm bg-muted text-muted-foreground">
            Muted
          </div>
          <div className="p-4 rounded-lg shadow-sm bg-accent text-accent-foreground">
            Accent
          </div>
          <div className="p-4 rounded-lg shadow-sm bg-destructive text-destructive-foreground">
            Destructive
          </div>
        </div>
      </section>

      {/* Tipografia */}
      <section className="mt-8">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight">
          Tipografia
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Estilos de texto comuns.
        </p>
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Título H1
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Este é um exemplo de parágrafo com o estilo padrão.
          </p>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Título H2
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Este é um exemplo de parágrafo com o estilo padrão.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Título H3
          </h3>
          <p className="mt-2 text-lg text-muted-foreground">
            Este é um exemplo de parágrafo com o estilo padrão.
          </p>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Título H4
          </h4>
          <p className="mt-2 text-lg text-muted-foreground">
            Este é um exemplo de parágrafo com o estilo padrão.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Este é um parágrafo de texto normal. Ele deve ser legível e
            confortável para leitura prolongada.
          </p>
          <small className="text-sm font-medium leading-none">
            Este é um texto pequeno.
          </small>
        </div>
      </section>

      {/* Componentes */}
      <section className="mt-8">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight">
          Componentes
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Exemplos de componentes reutilizáveis.
        </p>

        {/* Botões */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Botões
          </h3>
          <div className="style-viewer-grid">
            <Button>Padrão</Button>
            <Button variant="primary">Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Desabilitado</Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Inputs
          </h3>
          <div className="space-y-2">
            <Label htmlFor="input">Label</Label>
            <Input id="input" placeholder="Digite algo..." />
            <Textarea placeholder="Digite um texto longo..." />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Cards
          </h3>
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold">Título do Card</h4>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do card. Pode conter texto, imagens, etc.</p>
            </CardContent>
            <CardFooter>
              <Button>Ação</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Badges */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Badges
          </h3>
          <div className="style-viewer-grid">
            <Badge>Padrão</Badge>
            <Badge variant="secondary">Secundário</Badge>
            <Badge variant="outline">Contorno</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Progress Bar
          </h3>
          <Progress value={66} />
        </div>

        {/* Checkbox */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Checkbox
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Aceito os termos e condições</Label>
          </div>
        </div>

        {/* Radio Group */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Radio Group
          </h3>
          <RadioGroup defaultValue="default" className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Opção 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="secondary" id="r2" />
              <Label htmlFor="r2">Opção 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="destructive" id="r3" />
              <Label htmlFor="r3">Opção 3</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Switch */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Switch
          </h3>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Modo avião</Label>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Slider
          </h3>
          <Slider defaultValue={[33]} max={100} step={1} />
        </div>

        {/* Avatar */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Avatar
          </h3>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Alert */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Alert
          </h3>
          <Alert>
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Esta é uma mensagem de alerta.
            </AlertDescription>
          </Alert>
        </div>

        {/* Table */}
        <div className="mt-4">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Table
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV003</TableCell>
                <TableCell>Unpaid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$300.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .style-viewer-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
          }
        ` }} />
    </div>
  );
};

export default StyleGuideViewer;
