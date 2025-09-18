export interface CloudinaryOptions {
    cloudName: string;
    uploadPreset: string;
}

declare global {
    interface Window {
        cloudinary?: any;
        __USE_CLOUDINARY__?: boolean;
    }
}

export function openCloudinaryWidget(opts: CloudinaryOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudinary) return reject(new Error('Cloudinary widget indisponível'));
            const widget = window.cloudinary.createUploadWidget(
                { cloudName: opts.cloudName, uploadPreset: opts.uploadPreset },
                (error: any, result: any) => {
                    if (error) return reject(error);
                    if (result && result.event === 'success') {
                        resolve(result.info.secure_url as string);
                    }
                }
            );
            widget.open();
        } catch (e) {
            reject(e);
        }
    });
}
