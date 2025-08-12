import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/ui/image-uploader';
import { toast } from '@/components/ui/use-toast';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';

export const AppearanceTab: React.FC = () => {
  const { globalStyles, updateGlobalStyles } = useGlobalStyles();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Appearance</CardTitle>
        <CardDescription>Customize the global appearance of your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={globalStyles.backgroundColor || '#fff'}
            onChange={e => updateGlobalStyles({ backgroundColor: e.target.value })}
            className="h-10 w-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <Input
            id="textColor"
            type="color"
            value={globalStyles.textColor || '#432818'}
            onChange={e => updateGlobalStyles({ textColor: e.target.value })}
            className="h-10 w-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <ImageUploader
            currentImage={globalStyles.logo}
            onImageUpload={url => updateGlobalStyles({ logo: url })}
          />
        </div>

        <Button
          className="bg-[#B89B7A] hover:bg-[#A38A69]"
          onClick={() => {
            toast({
              title: 'Settings saved',
              description: 'Appearance settings have been updated successfully.',
            });
          }}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};
