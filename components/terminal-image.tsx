import Image from "next/image";

interface TerminalImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Add image rendering component
const TerminalImageRenderer: React.FC<TerminalImage> = ({
  src,
  alt,
  width,
  height,
}) => {
  return (
    <div className="terminal-image mt-4 ml-4">
      <Image
        src={src}
        alt={alt}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          opacity: 0.8,
        }}
        width={width}
        height={height}
        className="rounded-lg object-cover"
        draggable={false}
      />
    </div>
  );
};

export default TerminalImageRenderer;
