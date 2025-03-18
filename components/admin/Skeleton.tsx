import { Card, Skeleton as HeroSkeleton } from "@heroui/react";

export default function SkeletonCard() {
  return (
    <Card className="w-[200px] space-y-5 p-4" radius="lg">
      <HeroSkeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300" />
      </HeroSkeleton>

      <div className="space-y-3">
        <HeroSkeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </HeroSkeleton>
        <HeroSkeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </HeroSkeleton>
        <HeroSkeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </HeroSkeleton>
      </div>
    </Card>
  );
}
