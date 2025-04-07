import { BundledLanguage, BundledTheme, codeToHtml } from 'shiki';
type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
};

export default async function Code({
  code,
  lang: lang,
  theme = 'everforest-dark',
}: Props) {
  const html = await codeToHtml(code, {
    lang: lang ?? 'typescript',
    theme,
  });

  return (
    <>
      <div
        className="text-sm max-md:hidden min-w-md"
        dangerouslySetInnerHTML={{ __html: html }}>
      </div>
    </>
  );
}
