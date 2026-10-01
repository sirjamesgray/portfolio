import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/work-detail";
import { WorkModal } from "@/components/work-modal";
import { getWork } from "@/lib/work-catalog";

export default async function InterceptedWork({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <WorkModal slug={slug} title={work.name}>
      <WorkDetail slug={slug} />
    </WorkModal>
  );
}
