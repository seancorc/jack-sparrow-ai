export default function BackgroundVideo({ isStarted }: { isStarted: boolean }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {isStarted && (
        <video
          className="min-w-full min-h-full object-cover opacity-30 scale-150"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/jack-sparrow.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

