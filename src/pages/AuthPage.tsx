import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const registerSchema = z
  .object({
    username: z.string().min(5, "Username phải > 4 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(7, "Password phải > 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password không khớp",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(7, "Password phải > 6 ký tự"),
});

type Props = {
  isLogin?: boolean;
};

function AuthPage({ isLogin }: Props) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:3000/login", data);
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success("Đăng nhập thành công");
        navigate("/list");
      } else {
        await axios.post("http://localhost:3000/register", data);
        toast.success("Đăng ký thành công");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl mb-4">{isLogin ? "Login" : "Register"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {!isLogin && (
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className="w-full border p-2"
            />
            <p className="text-red-500 text-sm">
              {errors.username?.message?.toString()}
            </p>
          </div>
        )}

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-2"
          />
          <p className="text-red-500 text-sm">
            {errors.email?.message?.toString()}
          </p>
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border p-2"
          />
          <p className="text-red-500 text-sm">
            {errors.password?.message?.toString()}
          </p>
        </div>

        {!isLogin && (
          <div>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="w-full border p-2"
            />
            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message?.toString()}
            </p>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-2">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
