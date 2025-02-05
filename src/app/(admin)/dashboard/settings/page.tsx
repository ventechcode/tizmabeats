"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Button } from "@heroui/react";
import { Input } from "@heroui/input";
import { useRef } from "react";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const testRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto h-max">
      <DashboardHeader text="Settings" subtext="Manage your settings" />

      <div className="pt-20 flex flex-col items-center space-y-4">
        <Input type="file" accept=".mp3" ref={fileRef} />
        <Button
          onPress={async () => {
            const file = fileRef?.current?.files?.[0];
            if (!file) {
              return;
            }
            const formData = new FormData();
            formData.append("beatId", new Date().getTime().toString());
            formData.append("fileName", file.name);
            formData.append("fileType", file.type);
            formData.append("fileSize", file.size.toString());
            formData.append("dir", "public");

            try {
              const response = await fetch("/api/dashboard/upload", {
                method: "POST",
                body: formData,
              });

              const { url, error } = await response.json();

              if (error) {
                console.error("Upload failed:", error);
                return;
              }

              const xhr = new XMLHttpRequest();
              xhr.open('PUT', url);
        
              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const percent = Math.round((event.loaded / event.total) * 100);
                  console.log('Upload progress:', percent);
                }
              };
        
              xhr.send(file);
            } catch (error) {
              console.error("Upload failed:", error);
            }
          }}
        >
          Upload Public
        </Button>
        <Input type="file" accept="audio/*" ref={testRef} />
        <Button
          onPress={async () => {
            const file = testRef?.current?.files?.[0];
            if (!file) {
              return;
            }
            const formData = new FormData();
            formData.append("beatId", new Date().getTime().toString());
            formData.append("fileName", file.name);
            formData.append("fileType", file.type);
            formData.append("fileSize", file.size.toString());
            formData.append("dir", "private");

            try {
              const response = await fetch("/api/dashboard/upload", {
                method: "POST",
                body: formData,
              });

              const { url } = await response.json();


              const xhr = new XMLHttpRequest();
              xhr.open('PUT', url);
        
              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const percent = Math.round((event.loaded / event.total) * 100);
                  console.log('Upload progress:', percent);
                }
              };
        
              xhr.onload = () => {
                if (xhr.status === 200) {
                  console.log('Upload completed');
                  alert('Upload successful!');
                }
              };
        
              xhr.onerror = () => {
                console.error('Upload failed');
              };
        
              xhr.send(file);
            } catch (error) {
              console.error("Upload failed:", error);
            }
          }}
        >
          Upload Private
        </Button>
      </div>
    </div>
  );
}
