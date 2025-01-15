import Image from "next/image";

interface BackgroundProps {
  imagePath: string;
  alt: string;
}

export default function TizmaBackground({ imagePath, alt }: BackgroundProps) {
  return (
    <div className="fixed inset-0 z-[-1]">
      <Image
        src={imagePath}
        alt={alt}
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
    </div>
  );
}
