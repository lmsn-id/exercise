"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "~/context/SessionProvider";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface UserInterface {
  id: string;
  urutan: string;
  image: string;
  status: boolean;
}

export default function UiHomeDashboard() {
  const router = useRouter();
  const baseurl = usePathname();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userInterfaces"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/userinterfaces/get`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            Token: `${session?.user?.token}`,
            Role: `${session?.user?.role}`,
          },
        }
      );
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/userinterfaces/delete/${id}`,
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

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userInterfaces"] });
      Swal.fire("Deleted!", data.message, "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete data.", "error");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      try {
        console.log("Sending request with:", { id, status: !status });

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/userinterfaces/status/${id}`,
          { status: !status }, // Kirim dalam bentuk { "status": true/false }
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
              Token: `${session?.user?.token}`,
              Role: `${session?.user?.role}`,
            },
          }
        );

        return response.data;
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
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userInterfaces"] });
      toast.success(data.message);
    },
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Apakah Anda Yakin Akan Menghapus Ui Ini?",
      text: "Anda tidak dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-md">
        <div className="p-6 min-h-[calc(100vh-8rem)] flex flex-col">
          <h1 className="text-gray-900 text-lg font-semibold text-center mb-4">
            User Interfaces Dashboard
          </h1>
          <div className="flex justify-end items-center mb-4">
            <button
              onClick={() => router.push(`${baseurl}/post`)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg font-semibold"
            >
              Add Ui Dashboard
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[max-content] border-collapse text-left text-xs md:text-sm text-gray-700">
              <thead className="bg-gray-200 text-gray-800 uppercase text-[10px] md:text-xs font-semibold">
                <tr>
                  {["No", "Image", "Urutan", "Status", "Action"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-3 md:px-6 py-2 md:py-3 border-b text-center"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item: UserInterface, index: number) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-1 md:px-6 py-2 md:py-3 text-center font-semibold text-xs md:text-sm">
                      {index + 1}
                    </td>
                    <td className="flex w-full justify-center px-1 md:px-6 py-2 md:py-3 text-center font-semibold text-xs md:text-sm">
                      <Image
                        src={item.image}
                        width={100}
                        height={100}
                        alt={item.image}
                        className="w-36 h-16 object-cover rounded-md border"
                      />
                    </td>
                    <td className="px-1 md:px-6 py-2 md:py-3 text-center font-semibold text-xs md:text-sm">
                      {item.urutan}
                    </td>
                    <td className="px-1 md:px-6 py-2 md:py-3 text-center font-semibold text-xs md:text-sm">
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: item.id,
                            status: item.status,
                          })
                        }
                        disabled={toggleStatusMutation.status === "pending"} // Hindari spam klik saat loading
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                          item.status ? "bg-green-500" : "bg-red-500"
                        } ${
                          toggleStatusMutation.status === "pending"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                            item.status ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-3 text-center font-semibold text-lg space-x-6">
                      <button
                        onClick={() =>
                          router.push(`${baseurl}/update/${item.id}`)
                        }
                        className="p-2 bg-blue-500 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
