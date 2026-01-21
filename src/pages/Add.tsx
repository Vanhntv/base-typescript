import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type CourseForm = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function AddPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseForm>();

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;

    const getDetail = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/courses/${id}`);
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };

    getDetail();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: CourseForm) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/courses/${id}`, values);
        alert("Cập nhật khóa học thành công!");
      } else {
        await axios.post("http://localhost:3000/courses", values);
        alert("Thêm khóa học thành công!");
        reset();
      }

      navigate("/courses");
    } catch (error) {
      console.log(error);
      alert("Thao tác thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Chỉnh sửa khóa học" : "Thêm mới khóa học"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Tên khóa học</label>
          <input
            {...register("name", {
              required: "Tên khóa học bắt buộc",
              minLength: {
                value: 3,
                message: "Tên khóa học phải lớn hơn 3 ký tự",
              },
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Số tín chỉ</label>
          <input
            type="number"
            {...register("credit", {
              required: "Số tín chỉ bắt buộc",
              min: {
                value: 1,
                message: "Số tín chỉ phải lớn hơn 0",
              },
              valueAsNumber: true,
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.credit && (
            <p className="text-red-500 text-sm">{errors.credit.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Danh mục</label>
          <select
            {...register("category")}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Cơ sở">Cơ sở</option>
            <option value="Đại cương">Đại cương</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Tên giáo viên</label>
          <input
            {...register("teacher", {
              required: "Tên giáo viên bắt buộc",
              minLength: {
                value: 3,
                message: "Tên giáo viên phải lớn hơn 3 ký tự",
              },
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.teacher && (
            <p className="text-red-500 text-sm">{errors.teacher.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>
    </div>
  );
}

export default AddPage;
