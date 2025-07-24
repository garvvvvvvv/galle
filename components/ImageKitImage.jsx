// components/ImageKitImage.jsx
import { IKImage, IKContext } from 'imagekitio-react';

const ImageKitImage = ({ src, width, height, alt }) => {
  return (
    <IKContext urlEndpoint="https://ik.imagekit.io/garvchaudhary">
      <IKImage
        path={src}
        transformation={[{ width, height }]}
        loading="lazy"
        lqip={{ active: true }}
        alt={alt}
      />
    </IKContext>
  );
};

export default ImageKitImage;
