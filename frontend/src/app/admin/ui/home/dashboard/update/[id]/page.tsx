"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "~/context/SessionProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

export default function UiHomeDashboardUpdate() {
  const { id } = useParams();
  const router = useRouter();
  const { session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userInterface", id],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/userinterfaces/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            Token: `${session?.user?.token}`,
            Role: `${session?.user?.role}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!id,
  });

  const [formData, setFormData] = useState({
    urutan: "",
    title: "",
    text: "",
    position: "",
  });

  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [imageType, setImageType] = useState<"URL" | "File">("URL");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        urutan: data.urutan || "",
        title: data.title || "",
        text: data.text || "",
        position: data.position || "",
      }));
      setPreviewImage(data.image || "");
      setDescriptions(data.description || []);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      console.log("Data yang dikirim:", formData);
      const formDataToSend = new FormData();
      formDataToSend.append("urutan", formData.urutan);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("text", formData.text);
      formDataToSend.append("position", formData.position || "");
      formDataToSend.append("page", "Home");
      formDataToSend.append("layout", "Dashboard");
      formDataToSend.append("descriptions", JSON.stringify(descriptions));

      if (imageType === "File" && file) {
        formDataToSend.append("image_file", file);
      } else if (imageType === "URL") {
        formDataToSend.append("image_url", previewImage || "");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/userinterfaces/update/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            Token: `${session?.user?.token}`,
            Role: `${session?.user?.role}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        router.push(response.data.navigate);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFile(null);
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const addDescription = () => {
    setDescriptions((prev) => [...prev, ""]);
  };

  const removeDescription = () => {
    setDescriptions((prev) => prev.slice(0, -1));
  };

  const defaultOptions = ["Center", "Left", "Right"];

  const handleDescriptionChange = (index: number, value: string) => {
    setDescriptions((prev) => {
      const newDescriptions = [...prev];
      newDescriptions[index] = value;
      return newDescriptions;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col overflow-hidden">
      <div className="w-full flex justify-center mb-4">
        <h1 className="text-gray-900 text-lg font-semibold">
          Update Ui Dashboard
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-2 max-h-[65vh]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Urutan
            </label>
            <input
              type="text"
              name="urutan"
              value={formData.urutan}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Text
            </label>
            <input
              type="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-gray-700 text-sm font-bold">
                Deskripsi
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addDescription}
                  className="bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md px-4 py-1 md:py-2 text-white font-semibold"
                >
                  + Deskripsi
                </button>
                {descriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={removeDescription}
                    className="bg-red-500 hover:bg-red-600 rounded-lg shadow-md px-4 py-1 md:py-2 text-white font-semibold"
                  >
                    - Deskripsi
                  </button>
                )}
              </div>
            </div>
            {descriptions.map((desc, index) => (
              <input
                type="text"
                value={desc}
                key={index}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                placeholder={`Deskripsi ${index + 1}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            ))}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="position"
            >
              Position
            </label>
            <select
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih Position</option>
              {defaultOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Tipe Gambar
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="URL"
                  checked={imageType === "URL"}
                  onChange={() => setImageType("URL")}
                />
                URL
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="File"
                  checked={imageType === "File"}
                  onChange={() => setImageType("File")}
                />
                File
              </label>
            </div>
          </div>

          {imageType === "URL" && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Masukkan URL Gambar
              </label>
              <input
                type="text"
                name="image"
                value={previewImage || ""}
                onChange={(e) => setPreviewImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}

          {imageType === "File" && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Unggah Gambar (JPG, JPEG, PNG)
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}

          {previewImage && (
            <div className="mb-4 relative w-32">
              <Image
                width={200}
                height={200}
                src={previewImage}
                alt="Preview"
                className="h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                X
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update
        </button>
      </div>
    </div>
  );
}
