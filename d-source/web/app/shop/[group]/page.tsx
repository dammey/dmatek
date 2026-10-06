import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Listing from "@/components/Listing";
import { GROUPS, INTRO, groupName } from "@/lib/shop";

export function generateStaticParams() {
  return GROUPS.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }): Promise<Metadata> {
  const { group } = await params;
  return { title: groupName(group), description: INTRO[group] };
}

export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (!GROUPS.some((g) => g.slug === group)) notFound();
  return <Listing group={group} />;
}
