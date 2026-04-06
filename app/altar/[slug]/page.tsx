import { Metadata } from "next";
import AltarRoomClient from "@/components/AltarRoomClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = decodeURIComponent(slug).replace(/-/g, " ");
  return {
    title: `${name} · Digital Altar`,
    description: `A personal altar space for ${name}`,
  };
}

export default async function AltarRoomPage({ params }: Props) {
  const { slug } = await params;
  return <AltarRoomClient slug={slug} />;
}
