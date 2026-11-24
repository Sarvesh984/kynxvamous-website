import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ImageCylinderCarousel from './components/ImageCylinderCarousel';

const mount = document.getElementById('partner-carousel-root');

if (mount) {
  mount.parentElement?.classList.add('has-3d-partner-carousel');
  createRoot(mount).render(
    <StrictMode>
      <ImageCylinderCarousel />
    </StrictMode>,
  );
}
