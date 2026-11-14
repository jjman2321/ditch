import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ChargesBody, HUBS } from '@/components/tools/ChargesBody';
import { fitDesc, pageTitle, og } from '@/lib/site';

export function generateStaticParams() {
  return Object.keys(HUBS).map((biller) => ({ biller }));
}

export async function generateMetadata({ params }: PageProps<'/charges/[biller]'>): Promise<Metadata> {
  const { biller } = await params;
  const h = HUBS[biller];
  if (!h) return {};
  return { title: pageTitle(h.meta), description: fitDesc(h.lead, 'Free, runs in your browser, nothing is sent anywhere.', 'Free, runs in your browser.'), alternates: { canonical: `/charges/${biller}` }, openGraph: og(`/charges/${biller}`) };
}

export default async function Page({ params }: PageProps<'/charges/[biller]'>) {
  const { biller } = await params;
  if (!HUBS[biller]) notFound();
  return <ChargesBody hub={biller} />;
}
