export const exportProjectAsJson = (config: any) => {
  try {
    // Create a blob with the JSON data
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // Use the styleType or a default name for the file
    const fileName = config.styleType
      ? `${config.styleType.toLowerCase()}-config-${new Date().toISOString().split('T')[0]}.json`
      : `project-config-${new Date().toISOString().split('T')[0]}.json`;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return false;
  }
};

export const parseJsonConfig = (jsonText: string): any => {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON format');
  }
};
