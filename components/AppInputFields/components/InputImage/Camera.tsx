import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, CameraIcon, XIcon } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImageCropper } from "./ImageCropper";

interface CameraProps {
  onCapture: (file: File) => void;
}

export interface CameraRef {
  stopCamera: () => void;
}

export const Camera = forwardRef<CameraRef, CameraProps>(
  ({ onCapture }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const cleanupCamera = useCallback(() => {
      if (!videoRef.current) return;

      try {
        const stream = videoRef.current.srcObject as MediaStream | null;
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
            stream.removeTrack(track);
          });
        }
        videoRef.current.srcObject = null;
        setIsCameraActive(false);
      } catch (error) {
        console.error("Error cleaning up camera:", error);
      }
    }, []);

    const startCamera = useCallback(async () => {
      try {
        cleanupCamera();

        const constraints = {
          video: {
            width: { ideal: 720 },
            height: { ideal: 720 },
            facingMode: "user",
            aspectRatio: 1,
          },
        };

        const newStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        if (!videoRef.current) return;

        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
          setCameraError(null);
        };

        newStream.getTracks().forEach((track) => {
          track.onended = () => {
            console.log("Track ended");
            cleanupCamera();
          };
        });
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(
          "Unable to access the camera. Please check your permissions and try again."
        );
        setIsCameraActive(false);
        cleanupCamera();
      }
    }, [cleanupCamera]);

    useImperativeHandle(ref, () => ({
      stopCamera: cleanupCamera,
    }));

    useEffect(() => {
      startCamera();
      return () => {
        cleanupCamera();
      };
    }, [startCamera]);

    const takeSelfie = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;

      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        video,
        sx,
        sy,
        size,
        size,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imageUrl = canvas.toDataURL("image/jpeg", 1.0);
      setCapturedImage(imageUrl);
      cleanupCamera();
    };

    const handleCropComplete = (croppedFile: File) => {
      onCapture(croppedFile);
      setCapturedImage(null);
    };

    const handleCropCancel = () => {
      setCapturedImage(null);
      startCamera();
    };

    if (cameraError) {
      return (
        <Alert variant="destructive" className="animate-in fade-in-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Error</AlertTitle>
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      );
    }

    if (capturedImage) {
      return (
        <ImageCropper
          imageUrl={capturedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-square">
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="rounded-full w-28 h-28 animate-in zoom-in-50 z-10"
                onClick={startCamera}
              >
                <CameraIcon className="h-10 w-10" />
              </Button>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              !isCameraActive && "opacity-0"
            )}
          />
          {isCameraActive && (
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full w-10 h-10 bg-white/80 hover:bg-white"
                onClick={cleanupCamera}
              >
                <XIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90"
                onClick={takeSelfie}
              >
                <div className="w-5 h-5 rounded-full border-2 border-white" />
              </Button>
            </div>
          )}
        </div>
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width={720}
          height={720}
        />
      </div>
    );
  }
);

Camera.displayName = "Camera";
