import { Form, Input, Spin } from "antd";
import Container from "../components/Container";
import { FaMedrt } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

export default function Login() {
  const navigate = useNavigate();
  type AuthPayload = {
    phone: string;
    password: string;
  };
  type AuthResponse = {
    data: { role: string };
  };

  const queryClient = useQueryClient();

  const { mutate: loginMutate, isLoading: loginLoading } = useMutation<
    AuthResponse,
    Error,
    AuthPayload
  >((obj) => OneMedAdmin.authLogin(obj), {
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      console.log("Access olindi Loginniki. Data:", data);
      if (data?.data.role === "admin") {
        navigate("/dashboard");
      } else if (data?.data.role === "doctor") {
        navigate("/doctor");
      } else if (data?.data.role === "registrator") {
        navigate("/register");
      } else {
        navigate("/");
      }
    },
    onError: () => {
      console.log("Mutation Xato");
    },
  });

  const authTakeValue = (value: AuthPayload) => {
    console.log(value);
    loginMutate(value);
  };

  // const phoneMask = [
  //   "+",
  //   "9",
  //   "9",
  //   "8",
  //   " ",
  //   "(",
  //   /[1-9]/,
  //   /\d/,
  //   ")",
  //   " ",
  //   /\d/,
  //   /\d/,
  //   /\d/,
  //   "-",
  //   /\d/,
  //   /\d/,
  //   "-",
  //   /\d/,
  //   /\d/,
  // ];

  return (
    <div className="bg-[#ececec]">
      <Container className="flex justify-center items-center min-h-screen ">
        <div className="border border-[#D9D9D9] flex flex-col items-center gap-10 md:w-md w-full px-3 md:p-10 rounded-md bg-white">
          <div className=" flex flex-col items-center">
            <div className="bg-blue-200 p-4 rounded-full">
              <FaMedrt className="text-[30px] text-blue-500" />
            </div>
            <div className="flex flex-col items-center mt-4">
              <h1 className="text-[24px] font-semibold">Tizimga kirish</h1>
              <p>Telefon raqamingiz va parolingizni kiriting!</p>
            </div>
          </div>
          <Form
            onFinish={authTakeValue}
            layout="vertical"
            className="inline-block  w-full "
          >
            <Form.Item name="login" label="Username yoki Telefon raqam">
              <Input
                // mask={phoneMask}
                placeholder="Faydalanuvchi Ismi yoki tel raqami"
                className="w-full px-2 outline-none border-[0.5px] border-[#D9D9D9] !py-2 !rounded-[4px] hover:border-[#1677ff] focus:border-[#1677ff] focus:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] transition"
              />
            </Form.Item>
            <Form.Item name="password" label="Pasword">
              <Input.Password
                type="password"
                className="!py-2 !rounded-[4px]"
              />
            </Form.Item>
            <button
              className="w-full !rounded-[4px]  !h-[39px] !bg-[#2B7FFF] !text-[#fff] flex justify-center items-center cursor-pointer"
              // to="/dashboard"
            >
              {loginLoading ? (
                <div>
                  <Spin
                    indicator={<LoadingOutlined spin />}
                    className="!text-white"
                  />
                </div>
              ) : (
                "Kirish"
              )}
            </button>
          </Form>
        </div>
      </Container>
    </div>
  );
}
