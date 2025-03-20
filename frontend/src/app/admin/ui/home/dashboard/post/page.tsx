"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "~/context/SessionProvider";

interface FormData {
  urutan: string;
  title: string;
  text: string;
  descriptions: string[];
  posisi: string;
  image_url?: string;
  image_file?: FileList;
  page: string;
  layout: string;
}

export default function UiHomeDashboardPost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      urutan: "",
      title: "",
      text: "",
      descriptions: [],
      posisi: "",
    },
  });

  const [imageType, setImageType] = useState<"URL" | "File">("URL");
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { session } = useSession();
  const router = useRouter();

  const addDescription = () => {
    const newDescriptions = [...descriptions, ""];
    setDescriptions(newDescriptions);
    setValue("descriptions", newDescriptions);
  };

  const removeDescription = () => {
    if (descriptions.length > 1) {
      const newDescriptions = descriptions.slice(0, -1);
      setDescriptions(newDescriptions);
      setValue("descriptions", newDescriptions);
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
    setValue("descriptions", newDescriptions);
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("urutan", data.urutan);
      formData.append("title", data.title);
      formData.append("text", data.text);
      formData.append("posisi", data.posisi);
      formData.append("page", "Home");
      formData.append("layout", "Dashboard");
      formData.append("descriptions", JSON.stringify(data.descriptions));

      if (data.image_file && data.image_file.length > 0) {
        formData.append("image_file", data.image_file[0]);
      } else if (data.image_url) {
        formData.append("image_url", data.image_url);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/userinterfaces/post`,
        formData,
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.message || "An error occurred";
          toast.error(errorMessage);
        } else {
          toast.error("Network error: Unable to connect to the server");
        }
      } else {
        const err = error as Error;
        toast.error(err.message);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imageType === "URL") {
      const url = e.target.value;
      setValue("image_url", url);
      setPreviewImage(url);
    } else {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setValue("image_url", "");
    setValue("image_file", undefined);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col overflow-hidden">
      <div className="w-full flex justify-center mb-4">
        <h1 className="text-gray-900 text-lg font-semibold">
          Post Ui Dashboard
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-2 max-h-[65vh]">
        <form onSubmit={handleSubmit(onSubmit)}>
          {[
            {
              label: "Urutan",
              name: "urutan",
              required: "Urutan Wajib Di Isi",
            },
            { label: "Title", name: "title" },
            { label: "Text", name: "text" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={field.name}
                type="text"
                placeholder={`Masukkan ${field.label}`}
                {...register(field.name as keyof FormData, {
                  required: field.required || false,
                })}
              />
              {errors[field.name as keyof FormData] && (
                <p className="text-red-500 text-xs italic">
                  {errors[field.name as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-gray-700 text-sm font-bold ">
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
              htmlFor="posisi"
            >
              Posisi
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="posisi"
              {...register("posisi", { required: "Posisi Wajib Diisi" })}
            >
              <option value="" disabled>
                Silahkan pilih Posisi Layout
              </option>
              <option value="Center">Center</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
            {errors.posisi && (
              <p className="text-red-500 text-xs italic">Posisi Wajib Diisi.</p>
            )}
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

          <div className="">
            {imageType === "URL" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Masukkan URL Gambar
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  {...register("image_url", {
                    required: "URL gambar wajib diisi.",
                    pattern: {
                      value: /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/i,
                      message: "URL harus berupa gambar JPG, JPEG, atau PNG.",
                    },
                  })}
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.image_url && (
                  <p className="text-red-500 text-xs italic">
                    {errors.image_url.message}
                  </p>
                )}
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
                  {...register("image_file", {
                    required: "File gambar wajib diunggah.",
                    validate: (value) => {
                      const file = value?.[0];
                      if (!file) return "File gambar wajib diunggah.";
                      const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                      ];
                      if (!validTypes.includes(file.type)) {
                        return "Format gambar harus JPG, JPEG, atau PNG.";
                      }

                      return true;
                    },
                  })}
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.image_file && (
                  <p className="text-red-500 text-xs italic">
                    {errors.image_file.message}
                  </p>
                )}
              </div>
            )}
            {previewImage && (
              <div className="mb-4 relative w-32">
                <Image
                  width={200}
                  height={200}
                  src={previewImage}
                  alt="Preview"
                  className=" h-32 object-cover rounded"
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
          </div>
        </form>
      </div>
      <div className="w-full flex justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md px-4 py-2 text-white font-semibold"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
