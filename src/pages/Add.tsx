import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type CourseForm = {
  name: string;
  level: string;
  teacher: string;
};

function AddPage() {
  const { register, handleSubmit, reset } = useForm<CourseForm>();
  const navigate = useNavigate();

  const onSubmit = async (values: CourseForm) => {
    try {
      await axios.post("http://localhost:3000/courses", values);
      alert("Thêm khóa học thành công!");
      reset();

      navigate("/courses");
    } catch (error) {
      console.log(error);
      alert("Thêm thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới khóa học</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên khóa học */}
        <div>
          <label className="block font-medium mb-1">Tên khóa học</label>
          <input
            {...register("name", { required: true })}
            type="text"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tên giáo viên</label>
          <input
            {...register("teacher", { required: true })}
            type="text"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Cấp độ */}
        <div>
          <label className="block font-medium mb-1">Cấp độ</label>
          <select
            {...register("level")}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="basic">Cơ bản</option>
            <option value="medium">Trung bình</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Thêm mới
        </button>
      </form>
    </div>
  );
}

export default AddPage;
