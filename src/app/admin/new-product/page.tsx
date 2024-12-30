"use client";

import { useRef, useState } from "react";

export default function NewProductPage() {
  const initialFormData = {
    name: "",
    bpm: 0,
    songKey: "",
    audioSrc: "",
    price: 0,
    producer: "",
    genre: "",
    length: 0.0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [uploading, setUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);

    try {
      if (!inputFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const file = inputFileRef.current.files[0];

      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      await response.json().then((data) => {
        const audioSrc = data.url;
        console.log("audioSrc", audioSrc);
        setFormData({ ...formData, audioSrc });

        fetch("/api/beats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        });

        alert("Beat created successfully!");
        setUploading(false);
        setFormData(initialFormData);
      });
    } catch (error) {
      console.error("Error creating beat:", error);
      alert("Error creating beat. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-2">Create new Beat</h1>

      {uploading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-surface0 py-2 px-6 rounded"
        >
          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="bpm"
            >
              BPM
            </label>
            <input
              type="number"
              id="bpm"
              name="bpm"
              value={formData.bpm}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="songKey"
            >
              Song Key
            </label>
            <input
              type="text"
              id="songKey"
              name="songKey"
              value={formData.songKey}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="producerId"
            >
              Producer
            </label>
            <input
              type="text"
              id="producer"
              name="producer"
              value={formData.producer}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="genre"
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="length"
            >
              Length (in seconds)
            </label>
            <input
              type="number"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
              required
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
          </div>

          <div className="form-group">
            <label
              className="block text-sm font-medium text-text mb-2"
              htmlFor="audioSrc"
            >
              Audio Source (File Upload)
            </label>
            <input
              type="file"
              ref={inputFileRef}
              required
              accept="audio/*"
              className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-blue text-white px-6 py-2 rounded shadow hover:bg-bright-blue"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
