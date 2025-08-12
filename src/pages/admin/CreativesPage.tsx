import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Image, Video, FileText } from "lucide-react";

const CreativesPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-bold text-[#432818]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Biblioteca de Criativos
          </h1>
          <p className="text-[#8F7A6A] mt-2">Gerencie suas imagens, vídeos e materiais criativos</p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Upload de Arquivo
        </Button>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Imagens</CardTitle>
            <Image className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">47</div>
            <p className="text-xs text-[#8F7A6A]">arquivos de imagem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Vídeos</CardTitle>
            <Video className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">12</div>
            <p className="text-xs text-[#8F7A6A]">arquivos de vídeo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">8</div>
            <p className="text-xs text-[#8F7A6A]">documentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Biblioteca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Arquivos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: "#E5DDD5" }}>
                <Image className="w-8 h-8 text-[#B89B7A]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreativesPage;
