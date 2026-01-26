import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const fetchCourses = async (
    search: string = "",
    categoryFilter: string = "all",
  ) => {
    try {
      let url = "http://localhost:3000/courses?";
      const params: string[] = [];

      if (search) params.push(`q=${search}`);
      if (categoryFilter !== "all")
        params.push(`category=${encodeURIComponent(categoryFilter)}`);

      url += params.join("&");

      const { data } = await axios.get(url);
      setCourses(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCourses(keyword, category);
    }, 500);

    return () => clearTimeout(delay);
  }, [keyword, category]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      alert("Xóa thành công!");
      fetchCourses(keyword, category);
    } catch (error) {
      console.log(error);
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách khóa học</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên môn học..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">Tất cả</option>
          <option value="Cơ sở">Cơ sở</option>
          <option value="Chuyên ngành">Chuyên ngành</option>
          <option value="Đại cương">Đại cương</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tên khóa học</th>
              <th className="px-4 py-2 border">Tín chỉ</th>
              <th className="px-4 py-2 border">Danh mục</th>
              <th className="px-4 py-2 border">Giáo viên</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.id}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.credit}</td>
                <td className="px-4 py-2 border">{item.category}</td>
                <td className="px-4 py-2 border">{item.teacher}</td>
                <td className="px-4 py-2 border space-x-3">
                  <Link
                    to={`/edit/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPage;
