import { MdOutlinePersonAddAlt } from "react-icons/md";
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
} from "antd";
import { Dayjs } from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

type pasport = {
  series: string;
  number: string;
  jshr: string;
  issued_by: string;
  issued_date: Dayjs;
  expiry_date: Dayjs;
};
type driver = {
  number: string;
  jshr: string;
};
type sendResponseValuesType = {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  document_type: string;
  pasport?: pasport;
  idcard?: pasport;
  driver_license?: driver;
  gender: string;
  date_of_birth: Dayjs;
  blood_group: string;
  country: string;
  height: number;
  weight: number;
};
type PatientResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    document_type: string;
    gender: string;
    date_of_birth: string; // backend string qaytaradi
    blood_group: string;
    country: string;
    region: string;
    address: string;
    height: number;
    weight: number;
    status: string;
    pasport: {
      series: string;
      number: string;
      jshr: string;
      issued_by: string;
      issued_date: string;
      expiry_date: string;
    } | null;
    idcard: any; // agar keladigan structure aniq bo‘lsa yozib beramiz
    driver_license: any;
    home_phone: string | null;
    created_at: string;
    updated_at: string;
  };
};
type PatientRequest = Omit<
  sendResponseValuesType,
  "date_of_birth" | "pasport"
> & {
  date_of_birth: string;
  pasport?: Omit<pasport, "issued_date" | "expiry_date"> & {
    issued_date: string;
    expiry_date: string;
  };
};
export default function Registration() {
  const queryClient = useQueryClient();
  const { mutate: addPatientMutate, isLoading: addPatientLoading } =
    useMutation<PatientResponse, Error, PatientRequest>(
      (obj) => OneMedAdmin.addPatient(obj),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries();
          console.log(data);
        },
        onError: () => {
          console.log("Error");
        },
      }
    );
  const handleSendPatientValues = (value: sendResponseValuesType) => {
    const object: PatientRequest = {
      ...value,
      date_of_birth: value.date_of_birth?.format("YYYY-MM-DD"),
      pasport: value.pasport
        ? {
            ...value.pasport,
            issued_date: value.pasport.issued_date?.format("YYYY-MM-DD"),
            expiry_date: value.pasport.expiry_date?.format("YYYY-MM-DD"),
          }
        : undefined,
    };
    addPatientMutate(object);
  };

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [value, setValue] = useState("");
  const { mutate: searchMutate } = useMutation<any, Error, string>(
    (search) => OneMedAdmin.searchPatient(search),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        const mapped = data.data.map((item: any) => ({
          value: item.id, // value sifatida id ishlatamiz
          label: item.first_name + " " + item.last_name, // foydalanuvchi ismi
        }));
        setOptions(mapped);
      },
    }
  );

  const handleSerachPatient = (value: { search: string }) => {
    console.log(value);
    searchMutate(value.search);
  };

  const handleSearch = (text: string) => {
    setValue(text);
    if (text.trim() !== "") {
      searchMutate(text); // API chaqiramiz
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (val: string) => {
    console.log("Tanlangan:", val);
  };
  if (addPatientLoading) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center py-2 flex-col">
      <div className="border md:w-full w-full border-[#e3e3e3] rounded-[10px] px-6 py-4 mb-3">
        <Form className="flex items-center" onFinish={handleSerachPatient}>
          <Form.Item name="search" className="!m-0 relative flex-1">
            {/* <Input
              prefix={<IoSearch className="text-[#717171]" />}
              className="w-full border border-[#eaeaea] pr-3 py-2 rounded-l-[6px] !rounded-r-[0px] focus:outline-[#2D80FF] bg-[#F9FAFB] text-[14px] md:h-[41px]"
              placeholder="Ism, bo'lim yoki ID bo'yicha qidirish..."
            /> */}
            <AutoComplete
              value={value}
              options={options}
              style={{ width: 250 }}
              onSelect={handleSelect}
              onSearch={handleSearch}
              onChange={(data) => setValue(data)}
              placeholder="Bemor qidiring..."
              className="!w-full !border !border-[#eaeaea] pr-3 !h-[40px] !rounded-l-[6px] !rounded-r-[0px] !focus:outline-[#2D80FF] !bg-[#F9FAFB] !text-[14px] md:h-[41px]"
            />
          </Form.Item>
          <Button
            htmlType="submit"
            className="!bg-[#2B7FFF] !text-white !h-[40px] border !border-[#2B7FFF] !px-8 !rounded-r-[6px] !font-[500] !rounded-l-[0px]"
          >
            Izlash
          </Button>
        </Form>
      </div>
      <div></div>
      <Form
        onFinish={handleSendPatientValues}
        layout="vertical"
        className="border md:w-full w-full border-[#e3e3e3] rounded-[20px]"
      >
        <div className="flex items-center text-[22px] font-[600] gap-2 bg-[#F4FCF9] rounded-t-[20px] px-[24px] py-[10px]">
          <MdOutlinePersonAddAlt className="text-[#2B7FFF] text-[25px] mt-[1px]" />
          <h2>Bemorni ro'yxatga olish</h2>
        </div>
        <div className="px-[24px] py-4">
          <h3 className="text-[18px] text-red-500 font-[500]">
            Majburiy ma'lumotlar
          </h3>
          <div className="grid grid-cols-6 gap-3">
            <Form.Item
              name="first_name"
              label="Ism"
              rules={[{ required: true, message: "Ismni kiriting" }]}
              className="col-span-2"
            >
              <Input className="w-full !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Familiya"
              rules={[{ required: true, message: "Familyani kiriting" }]}
              className="col-span-2"
            >
              <Input className="w-full  !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="date_of_birth"
              label="Tug'ilgan sana"
              rules={[{ required: true, message: "Tug'ilgan sanani kiriting" }]}
              className="col-span-2"
            >
              <DatePicker className="w-full !h-[40px]" />
            </Form.Item>
          </div>
        </div>

        <div className="px-[24px] pb-4">
          <h3 className="text-[18px] text-red-500 font-[500]">
            Muhim ma'lumotlar
          </h3>
          <div className="grid grid-cols-6 gap-3">
            <Form.Item
              name="middle_name"
              label="Otasining ismi"
              className="col-span-2"
            >
              <Input className="w-full !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon raqam"
              className="col-span-2"
            >
              <Input className="w-full  !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="blood_group"
              label="Qon guruhi"
              className="col-span-2"
            >
              <Select
                className="w-full  !h-[40px]"
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  {
                    value: "B+",
                    label: "B+",
                  },
                  {
                    value: "B-",
                    label: "B-",
                  },
                  {
                    value: "AB+",
                    label: "AB+",
                  },
                  {
                    value: "AB-",
                    label: "AB-",
                  },
                  {
                    value: "O+",
                    label: "O-",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name="gender" label="Jinsi" className="col-span-2">
              <Select
                className="w-full  !h-[40px]"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="document_type"
              label="Document turi"
              className="col-span-2"
            >
              <Select
                className="w-full  !h-[40px]"
                options={[
                  { value: "pasport", label: "Pasport" },
                  { value: "idcard", label: "IdCard" },
                  {
                    value: "driver_license",
                    label: "Haydovchilik guvohnomasi",
                  },
                ]}
              />
            </Form.Item>
          </div>

          {/* pasport  */}
          <div>
            <h4 className="text-[16px] font-[500] mb-2">Pasport</h4>
            <div className="grid grid-cols-7 gap-3">
              <Form.Item name={["pasport", "series"]} className="col-span-1">
                <Input placeholder="Seriasi" className="w-full !h-[40px]" />
              </Form.Item>
              <Form.Item name={["pasport", "number"]} className="col-span-3">
                <Input placeholder="Raqami" className="w-full !h-[40px]" />
              </Form.Item>
              <Form.Item name={["pasport", "jshr"]} className="col-span-3">
                <Input placeholder="JSHR raqami" className="w-full !h-[40px]" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-6 gap-3">
              <Form.Item name={["pasport", "issued_by"]} className="col-span-2">
                <Input
                  placeholder="Kim tomonidan berilgan"
                  className="w-full !h-[40px]"
                />
              </Form.Item>
              <Form.Item
                name={["pasport", "issued_date"]}
                className="col-span-2"
              >
                <DatePicker className="w-full !h-[40px]" />
              </Form.Item>
              <Form.Item
                name={["pasport", "expiry_date"]}
                className="col-span-2"
              >
                <DatePicker className="w-full !h-[40px]" />
              </Form.Item>
            </div>
          </div>

          {/* driver_license  */}
          {/* <div>
            <h4 className="text-[16px] font-[500] mb-2">
              Haydovchilik guvohnomasi
            </h4>
            <div className="grid grid-cols-6 gap-3">
              <Form.Item name="number" className="col-span-3">
                <Input
                  placeholder="Card number"
                  className="w-full  !h-[40px]"
                />
              </Form.Item>
              <Form.Item name="jshr" className="col-span-3">
                <Input placeholder="Card JSHR" className="w-full  !h-[40px]" />
              </Form.Item>
            </div>
          </div> */}
        </div>

        <div className="px-[24px] pb-4">
          <h3 className="text-[18px] font-[600]">Qo'shimcha ma'lumotlar</h3>
          <div className="grid grid-cols-6 gap-3">
            <Form.Item name="country" label="Davlati" className="col-span-2">
              <Input className="w-full !h-[40px]" />
            </Form.Item>
            <Form.Item name="region" label="Shahar" className="col-span-2">
              <Input className="w-full  !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Tuman, qishloq"
              className="col-span-2"
            >
              <Input className="w-full  !h-[40px]" />
            </Form.Item>

            <Form.Item name="height" label="Bo'yi" className="col-span-2">
              <Input className="w-full  !h-[40px]" />
            </Form.Item>
            <Form.Item name="weight" label="Og'irligi" className="col-span-2">
              <Input className="w-full  !h-[40px]" />
            </Form.Item>
          </div>
        </div>
        <div className="px-[24px] pb-4 flex justify-end">
          <button className="px-[30px] bg-[#2B7FFF] py-2.5 rounded-md text-white font-[500] cursor-pointer">
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
