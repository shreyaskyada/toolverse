import { Metadata } from 'next';
import { AgeCalculatorTool } from '@/modules/tools/age-calculator/AgeCalculatorTool';
import { TOOL_METADATA, TOOL_FAQS } from '@repo/engines/age-calculator';

export const metadata: Metadata = {
  title: `${TOOL_METADATA.title} Online - Exact Years, Months & Days | Jumpytools`,
  description: TOOL_METADATA.description,
  alternates: {
    canonical: `https://jumpytools.app/tools/${TOOL_METADATA.slug}`,
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: TOOL_METADATA.title,
    description: TOOL_METADATA.description,
    url: `https://jumpytools.app/tools/${TOOL_METADATA.slug}`,
    applicationCategory: 'CalculationApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TOOL_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AgeCalculatorTool />
    </>
  );
}
