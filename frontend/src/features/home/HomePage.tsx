import { useTranslation } from 'react-i18next';

// Slice 1.6 builds the real Home screen. Until then it is only the page heading.
export function HomePage() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-semibold">{t('home.title')}</h1>;
}
