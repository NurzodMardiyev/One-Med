import { Form, Input } from "antd";
import Container from "../components/Container";
import { FaMedrt } from "react-icons/fa";
import MaskedInput from "react-text-mask";
import { Link } from "react-router-dom";

export default function Login() {
  const authTakeValue = (value: { number: string; password: string }) => {
    console.log(value);
  };

  const phoneMask = [
    "+",
    "9",
    "9",
    "8",
    " ",
    "(",
    /[1-9]/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];

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
            <Form.Item name="number" label="Tel Number">
              <MaskedInput
                mask={phoneMask}
                placeholder="+998 (__) ___-__-__"
                className="w-full px-2 outline-none border-[0.5px] border-[#D9D9D9] py-2 rounded-[4px] hover:border-[#1677ff] focus:border-[#1677ff] focus:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] transition"
              />
            </Form.Item>
            <Form.Item name="password" label="Pasword">
              <Input.Password
                type="password"
                className="!py-2 !rounded-[4px]"
              />
            </Form.Item>
            <Form.Item>
              <Link
                className="w-full !rounded-[4px]  !h-[39px] !bg-[#2B7FFF] !text-[#fff] flex justify-center items-center"
                to="/dashboard"
              >
                Kirish
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Container>
    </div>
  );
}
