import { MdOutlinePersonAddAlt } from "react-icons/md";
import { AutoComplete, DatePicker, Form, Input, Select, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

import "../App.css";

// ------- Types ---------
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

type PatientOption = {
  key: string;
  value: string;
  label: React.ReactNode;
};
type Document = {
  series: string;
  number: string;
  jshr: string;
  issued_by: string;
  issued_date: string;
  expiry_date: string;
};

type DriverLicense = {
  number: string;
  jshr: string;
};

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  home_phone: string | null;
  gender: "male" | "female";
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  date_of_birth: string; // backend string qaytaradi
  country: string;
  region: string;
  address: string;
  height: number;
  weight: number;
  status: string;
  document_type: "pasport" | "idcard" | "driver_license";
  pasport: Document | null;
  idcard: Document | null;
  driver_license: DriverLicense | null;
  created_at: string;
  updated_at: string;
};
type PatientSelectResponse = {
  success: boolean;
  data: Patient; // bunda date_of_birth, pasport.issued_date ham string edi
};

type PatientResponse = {
  success: boolean;
  message: string;
  data: Patient;
};
type PatientRequest = Omit<
  sendResponseValuesType,
  "date_of_birth" | "pasport" | "idcard"
> & {
  date_of_birth: string;
  pasport?: Omit<Document, "issued_date" | "expiry_date"> & {
    issued_date: string;
    expiry_date: string;
  };
  idcard?: Omit<Document, "issued_date" | "expiry_date"> & {
    issued_date: string;
    expiry_date: string;
  };
  driver_license?: DriverLicense;
};

// ------- Component ---------
export default function Registration() {
  const [form] = Form.useForm();
  const [docType, setDocType] = useState("");
  const queryClient = useQueryClient();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  // const { message } = App.useApp();
  // const showMessage = (text: string) => {
  //   message.success(text);
  // };

  // Yangi bemor qo‘shish
  const { mutate: addPatientMutate, isLoading: addPatientLoading } =
    useMutation<PatientResponse, Error, PatientRequest>(
      (obj) => OneMedAdmin.addPatient(obj),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries();
          // showMessage("Yangi bemor muvaffaqqiyatli qo'shildi!");
          // ✅ Forma tozalash
          form.resetFields();
          setSelectedPatientId(null);
          console.log("Yangi bemor qo‘shildi:", data);
          console.log("ishlavotti");
        },
        onError: () => {
          console.log("Error");
          // showMessage("Yangi bemor muvaffaqqiyatli qo'shildi!");
          // error("Xatolik yuz berdi!");
        },
      }
    );

  // Eski bemorni yangilash
  const { mutate: updatePatientMutate, isLoading: updatePatientLoading } =
    useMutation<PatientResponse, Error, { id: string; obj: PatientRequest }>(
      ({ id, obj }) => OneMedAdmin.updatePatient(id, obj),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries();
          console.log("Bemor yangilandi:", data);
          // success("Bemor muvaffaqqiyatli yangilandi!");
        },
        onError: () => {
          // error("Xatolik yuz berdi!");
        },
      }
    );

  // Submit qilganda POST/PUT aniqlash
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
      idcard: value.idcard
        ? {
            ...value.idcard,
            issued_date: value.idcard.issued_date?.format("YYYY-MM-DD"),
            expiry_date: value.idcard.expiry_date?.format("YYYY-MM-DD"),
          }
        : undefined,
    };

    if (selectedPatientId) {
      // Agar ID bor → update
      updatePatientMutate({ id: selectedPatientId, obj: object });
    } else {
      // Agar ID yo‘q → yangi create
      addPatientMutate(object);
    }
  };

  // Search
  const [options, setOptions] = useState<PatientOption[]>([]);
  const [value, setValue] = useState("");
  const { mutate: searchMutate } = useMutation<any, Error, string>(
    (search) => OneMedAdmin.searchPatient(search),
    {
      onSuccess: (data) => {
        const mapped = data.data.map((item: any) => ({
          key: item.id,
          value: item.first_name + " " + item.last_name,
          label: (
            <div key={item.id}>
              {item.first_name} {item.last_name}
            </div>
          ),
        }));
        setOptions(mapped);
      },
    }
  );

  const handleSearch = (text: string) => {
    setValue(text);
    if (text.trim() !== "") {
      searchMutate(text);
    } else {
      setOptions([]);
    }
  };

  // Select qilganda eski bemorni olish
  const { mutate: selectMutate } = useMutation<
    PatientSelectResponse,
    Error,
    string
  >((id: string) => OneMedAdmin.selectPatient(id), {
    onSuccess: (data) => {
      // setSelectedPatientId(data.data.id);
      setDocType(data.data.document_type);
      form.setFieldsValue({
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        middle_name: data.data.middle_name,
        phone: data.data.phone,
        gender: data.data.gender,
        blood_group: data.data.blood_group,
        document_type: data.data.document_type,
        country: data.data.country,
        region: data.data.region,
        address: data.data.address,
        height: data.data.height,
        weight: data.data.weight,
        date_of_birth: data.data.date_of_birth
          ? dayjs(data.data.date_of_birth)
          : null,
        pasport: data.data.pasport
          ? {
              series: data.data.pasport.series,
              number: data.data.pasport.number,
              jshr: data.data.pasport.jshr,
              issued_by: data.data.pasport.issued_by,
              issued_date: data.data.pasport.issued_date
                ? dayjs(data.data.pasport.issued_date)
                : null,
              expiry_date: data.data.pasport.expiry_date
                ? dayjs(data.data.pasport.expiry_date)
                : null,
            }
          : undefined,
        idcard: data.data.idcard
          ? {
              series: data.data.idcard.series,
              number: data.data.idcard.number,
              jshr: data.data.idcard.jshr,
              issued_by: data.data.idcard.issued_by,
              issued_date: data.data.idcard.issued_date
                ? dayjs(data.data.idcard.issued_date)
                : null,
              expiry_date: data.data.idcard.expiry_date
                ? dayjs(data.data.idcard.expiry_date)
                : null,
            }
          : undefined,
        driver_license: data.data.driver_license
          ? {
              number: data.data.driver_license.number,
              jshr: data.data.driver_license.jshr,
            }
          : undefined,
      });
    },
    onError: () => {
      console.error("Bemor topilmadi, yangi kiritish kerak.");
      // setSelectedPatientId(null);
      form.resetFields();
    },
  });

  const handleSelect = (val: string, option: any) => {
    console.log("Tanlangan:", val);
    console.log("ID:", option.key);
    setSelectedPatientId(option.key);
    selectMutate(option.key);
  };

  const handleDocType = (value: string) => {
    setDocType(value);
  };

  if (addPatientLoading || updatePatientLoading) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-2 flex-col register">
      {/* Search */}
      <div className="border md:w-full w-full border-[#e3e3e3] rounded-[10px] px-6 py-4 mb-3">
        <Form className="flex items-center">
          <Form.Item name="search" className="!m-0 relative flex-1">
            <AutoComplete
              value={value}
              options={options}
              onSelect={handleSelect}
              onSearch={handleSearch}
              onChange={(data) => setValue(data)}
              placeholder="Bemor qidiring..."
              className="!w-full !h-[40px]"
              notFoundContent="Bemor topilmadi!"
            />
          </Form.Item>
          <button className="px-[30px] bg-[#2B7FFF] !h-[40px] rounded-l-[0px] rounded-md text-white font-[500] cursor-pointer">
            Izlash
          </button>
        </Form>
      </div>

      {/* Forma */}
      <Form
        form={form}
        onFinish={handleSendPatientValues}
        layout="vertical"
        className="border md:w-full w-full border-[#e3e3e3] rounded-[20px]"
      >
        <div className="flex items-center text-[22px] font-[600] gap-2 bg-[#F4FCF9] rounded-t-[20px] px-[24px] py-[10px]">
          <MdOutlinePersonAddAlt className="text-[#2B7FFF] text-[25px] mt-[1px]" />
          <h2>
            {selectedPatientId
              ? "Bemor ma’lumotlarini yangilash"
              : "Bemorni ro'yxatga olish"}
          </h2>
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
              rules={[{ required: true, message: "Otasining ismini kiriting" }]}
            >
              <Input className="w-full !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon raqam"
              className="col-span-2"
              rules={[{ required: true, message: "Telefon raqam kiriting" }]}
            >
              <Input className="w-full  !h-[40px]" />
            </Form.Item>
            <Form.Item
              name="blood_group"
              label="Qon guruhi"
              className="col-span-2"
              rules={[{ required: true, message: "Qon guruhi kiriting" }]}
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
                  { value: "male", label: "Erkak" },
                  { value: "female", label: "Ayol" },
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
                onChange={handleDocType}
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
          {docType === "pasport" ? (
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
                  <Input
                    placeholder="JSHR raqami"
                    className="w-full !h-[40px]"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-6 gap-3">
                <Form.Item
                  name={["pasport", "issued_by"]}
                  className="col-span-2"
                >
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
          ) : docType === "idcard" ? (
            <div>
              <h4 className="text-[16px] font-[500] mb-2">Id Carta</h4>
              <div className="grid grid-cols-7 gap-3">
                <Form.Item name={["idcard", "series"]} className="col-span-1">
                  <Input placeholder="Seriasi" className="w-full !h-[40px]" />
                </Form.Item>
                <Form.Item name={["idcard", "number"]} className="col-span-3">
                  <Input placeholder="Raqami" className="w-full !h-[40px]" />
                </Form.Item>
                <Form.Item name={["idcard", "jshr"]} className="col-span-3">
                  <Input
                    placeholder="JSHR raqami"
                    className="w-full !h-[40px]"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-6 gap-3">
                <Form.Item
                  name={["idcard", "issued_by"]}
                  className="col-span-2"
                >
                  <Input
                    placeholder="Kim tomonidan berilgan"
                    className="w-full !h-[40px]"
                  />
                </Form.Item>
                <Form.Item
                  name={["idcard", "issued_date"]}
                  className="col-span-2"
                >
                  <DatePicker className="w-full !h-[40px]" />
                </Form.Item>
                <Form.Item
                  name={["idcard", "expiry_date"]}
                  className="col-span-2"
                >
                  <DatePicker className="w-full !h-[40px]" />
                </Form.Item>
              </div>
            </div>
          ) : docType === "driver_license" ? (
            <div>
              <h4 className="text-[16px] font-[500] mb-2">
                Haydovchilik guvohnomasi
              </h4>
              <div className="grid grid-cols-6 gap-3">
                <Form.Item
                  name={["driver_license", "number"]}
                  className="col-span-3"
                >
                  <Input
                    placeholder="Card number"
                    className="w-full  !h-[40px]"
                  />
                </Form.Item>
                <Form.Item
                  name={["driver_license", "jshr"]}
                  className="col-span-3"
                >
                  <Input
                    placeholder="Card JSHR"
                    className="w-full  !h-[40px]"
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            ""
          )}
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
        <div className="px-[24px] pb-4 flex gap-4 justify-end">
          <button
            onClick={() => form.resetFields()}
            className="px-[30px] bg-[#d7d7d753] py-2.5 rounded-md text-black font-[500] cursor-pointer"
          >
            Formani tozalash
          </button>
          <button className="px-[30px] bg-[#2B7FFF] py-2.5 rounded-md text-white font-[500] cursor-pointer">
            {selectedPatientId ? "Yangilash" : "Qo'shsih"}
          </button>
        </div>
      </Form>
    </div>
  );
}
