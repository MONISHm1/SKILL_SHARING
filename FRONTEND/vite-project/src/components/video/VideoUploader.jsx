import { useState } from "react";
import API from "../../api/axios";

const VideoUpload = ({ setVideoUrl, setIsUploading }) => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //  Preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      setIsUploading?.(true);

      const res = await API.post("/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      // url extraction
      const url =
        res.data?.videoUrl ||
        res.data?.url ||
        res.data?.data?.videoUrl ||
        "";

      if (!url) {
        alert("Video uploaded but URL missing");
        return;
      }

      
      setVideoUrl(url);

      console.log("🎥 FINAL VIDEO URL:", url);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
      setIsUploading?.(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    setVideoUrl(""); 
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      {!preview ? (
        <>
          <p className="opacity-60">Upload Skill Video</p>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideo}
          />
        </>
      ) : (
        <>
         
          <video
            src={preview}
            controls
            className="w-full rounded-lg max-h-64"
          />

          {loading && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}

          {!loading && (
            <button
              onClick={handleRemove}
              className="text-xs text-red-500"
            >
              Remove video
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default VideoUpload;