// ========================= IMPORTS =========================
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Empty,
  Modal,
  Spin,
  Form,
  Select,
  TreeSelect,
  Pagination,
  Card,
  Input,
  Button,
  Divider,
  notification,
  Space,
} from "antd";
import {
  AppstoreOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// ===== Icons =====
import { IoMdArrowBack } from "react-icons/io";
// import { BiSolidEditAlt } from "react-icons/bi";
import { RiUser3Line } from "react-icons/ri";
import { LuUser, LuHeart } from "react-icons/lu";
import { BsCalendar4, BsTelephone } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
// import { FiPlus } from "react-icons/fi";

import "../App.css";
import { DiagnosisResponse, OneMedAdmin } from "../queries/query";

// ========================= TYPES =========================
// Pasport, ID, hujjatlar uchun
type Document = {
  series: string;
  number: string;
  jshr: string;
  issued_by: string;
  issued_date: string;
  expiry_date: string;
};

// Haydovchilik guvohnomasi uchun
type DriverLicense = {
  number: string;
  jshr: string;
};

// Bemor modeli
type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  home_phone: string | null;
  gender: "male" | "female";
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  date_of_birth: string;
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

// Patientni select qilganda qaytadigan API javobi
type PatientSelectResponse = {
  success: boolean;
  data: Patient;
};

// Servis modeli
type Service = {
  id: string;
  name: string;
  price: number;
};

// Vizit modeli
type Visit = {
  id: string;
  doctor: string;
  services: Service[];
  total_price: number;
  diagnosis: string | null;
  created_at: string;
  status: "pending" | "completed" | "cancelled" | string;
};

// Pagination meta ma'lumotlari
type Meta = {
  total_pages: number;
  total_items: number;
  current_page: number;
};

// Vizitlarni olish uchun response
type VisitsResponse = {
  success: boolean;
  message: string;
  data: Visit[];
  meta: Meta;
};

// Doktor kategoriyalari
export type Category = {
  id: string;
  name: string;
  services: Service[];
};

// Doktor statistikasi
export type PatientsStats = {
  total_visits: number;
  total_patients: number;
  total_revenue: number;
  daily_stats: number[];
};

// Doktor modeli
export type Doctor = {
  id: string;
  fio: string;
  username: string;
  phone: string;
  role: "doctor" | "admin" | string;
  status: "active" | "inactive" | string;
  experience_year: number | null;
  more: string | null;
  categories: Category[];
  patients_stats: PatientsStats;
};

// Doktor API response
export type DoctorResponse = {
  success: boolean;
  message: string;
  data: Doctor;
};

export interface Recipe {
  id: string;
  name: string;
  description: string;
}

// Response turi
export interface RecipesResponse {
  success: boolean;
  message: string;
  data: {
    recipes: Recipe[];
  };
}

type NotificationType = "success" | "info" | "warning" | "error";
// ========================= COMPONENT =========================
export default function PatientsInfo() {
  // Segment (Tashriflar / Dorilar) uchun state
  const [segmentValue, setSegmentValue] = useState(true);

  const [form] = Form.useForm();
  // Modal (yangi tashrif qo‘shish)
  const [isVisitOpen, setIsVisitOpen] = useState(false);

  // Shifokor tanlaganda ID ni ushlab turadigan state
  const [handleSelectDoctorState, setHandleSelectDoctorState] = useState("");

  // URL'dan bemor ID sini olish
  const { id } = useParams<{ id: string }>();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    descriptioon: string
  ) => {
    api[type]({
      message: message,
      description: descriptioon,
    });
  };

  // Modal ochish-yopish handlerlari
  const showModal = () => {
    setIsVisitOpen(true);
    setSegmentValue(true);
  };
  const handleCancel = () => setIsVisitOpen(false);

  // ========================= QUERIES =========================
  // 1. Bemor ma’lumotlari
  const {
    data: patientData,
    isLoading,
    error,
  } = useQuery<PatientSelectResponse, Error>({
    queryKey: ["patient", id],
    queryFn: () => OneMedAdmin.selectPatient(id!),
    staleTime: Infinity, // data abadiy fresh
    cacheTime: Infinity,
  });

  // 2. Bemor tashriflari
  const [visitesPage, setvisitespage] = useState(1);
  const { data: patientVisitesData, refetch: visitsFetch } = useQuery<
    VisitsResponse,
    Error
  >({
    queryKey: ["patientVisitesData", id, visitesPage, 10],
    queryFn: () => OneMedAdmin.patientVisitesData(id!, visitesPage, 10),
    enabled: !!id,
  });

  // 3. Xodimlar (shifokorlar) ro‘yxati
  const { data: employeesData } = useQuery({
    queryKey: ["employees", 1, 20, "", "doctor"],
    queryFn: () => OneMedAdmin.getEmployeesFilter(1, 20, "", "doctor"),
    keepPreviousData: true,
    enabled: isVisitOpen, // faqat modal ochilganda chaqiriladi
  });

  // Select uchun shifokor options
  const employeeOptions =
    employeesData?.data?.map((item: any) => ({
      value: item.id,
      label: item.fio,
    })) || [];

  // 4. Doktordan xizmatlar olish
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["services", handleSelectDoctorState],
    queryFn: () => OneMedAdmin.getServicesFromDoctor(handleSelectDoctorState),
    enabled: !!handleSelectDoctorState,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // ========================= MUTATION =========================
  const queryClient = useQueryClient();
  const { mutate: addEmployeMutate, isLoading: addEmpLoading } = useMutation<
    any,
    Error,
    { doctor: string; services: string[] }
  >((obj) => OneMedAdmin.addNewVisit(id!, obj), {
    onSuccess: () => {
      queryClient.invalidateQueries(["patient", id]); // bemorni qayta chaqirish
      visitsFetch();
      openNotificationWithIcon(
        "success",
        "Bemorga tashrif qo'shildi",
        "Yangi tashrif qo'shish operatsiyasi muvaffaqiyatli bajarildi!"
      );
      form.resetFields();
      setIsVisitOpen(false); // modal yopish
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Form submit (yangi tashrif)
  const handleNewVisit = (value: { doctor: string; services: string[] }) => {
    if (!id) return;
    addEmployeMutate(value);
  };

  // Doktor tanlash
  const handleSelectDoctor = (value: string) => {
    setHandleSelectDoctorState(value);
  };

  const [diagnosModal, setDiagnosModal] = useState(false);

  const { mutate: diagnosMuatate, isLoading: diagnosLoading } = useMutation<
    DiagnosisResponse, // success response type
    Error, // error type
    { id: string; obj: any } // mutate fn param type
  >(({ id, obj }) => OneMedAdmin.addDiagnosis(id, obj), {
    onSuccess: () => {
      // Diagnos qo‘shilganda cache yangilash
      queryClient.invalidateQueries(["Recipes", id, visitId]);
      console.log("diagnos qo'shildi");

      // ❌ setDiagnosModal(false);   // <-- buning o‘rniga modalni yopma
    },
  });

  const [visitId, setVisitId] = useState("");

  const { data: visitRecipes } = useQuery<RecipesResponse>({
    queryKey: ["Recipes", id, visitId], // paramlarni key ichiga qo‘shamiz
    queryFn: ({ queryKey }) => {
      const [, id, vId] = queryKey as [string, string, string];
      return OneMedAdmin.recipesList(id, vId);
    },
    enabled: !!id && !!visitId, // faqat id va visitId bo‘lsa ishlaydi
  });

  const handleTextDiagnos = (visitId: string) => {
    console.log("visitid", visitId);
    setVisitId(visitId);
    setDiagnosModal(true);
  };

  const handleOkDiagnos = () => {
    setDiagnosModal(false);
  };
  const handleCancelDiagnos = () => setDiagnosModal(false);

  const sendDiagnos = (values: any) => {
    console.log(values.diagnosis);
    diagnosMuatate({
      id: visitId,
      obj: values,
    });
  };

  // ========================= DERIVED DATA =========================
  // Yoshni hisoblash
  const age =
    new Date().getFullYear() -
    Number(patientData?.data.date_of_birth.slice(0, 4));

  // Ism familiya bosh harflari (avatar uchun)
  const logo1 = patientData?.data.first_name.slice(0, 1);
  const logo2 = patientData?.data.last_name.slice(0, 1);

  // Gender
  const gender = patientData?.data.gender === "male" ? "Erkak" : "Ayol";

  // TreeSelect uchun service daraxti

  const treeData2 = categories
    ? categories.map((category: Category) => ({
        value: category.id,
        title: category.name,
        selectable: false,
        children: category.services.map((srv: Service) => ({
          value: srv.id,
          title: srv.name,
        })),
      }))
    : [];

  const location = useLocation();

  // Show confirm

  // const { mutate: updateStatus } = useMutation<any, Error, { status: string }>(
  //   (obj) => OneMedAdmin.statusPatch(id, visitId, obj),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(["Visit", id, visitId]);
  //       Modal.success({ content: "Holat yangilandi!" });
  //       Modal.destroyAll();
  //     },
  //     onError: () => {
  //       Modal.error({ content: "Xatolik yuz berdi!" });
  //     },
  //   }
  // );

  // Component ichida
  const { mutate: updateStatus, isLoading: updateStatusLoading } = useMutation<
    any,
    Error,
    { id: string; visitId: string; obj: { status: string } }
  >(({ id, visitId, obj }) => OneMedAdmin.statusPatch(id, visitId, obj), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["Visit", variables.id, variables.visitId]);
      Modal.success({ content: "Holat yangilandi!" });
      Modal.destroyAll();
      visitsFetch();
      setDiagnosModal(false);
    },
    onError: () => {
      Modal.error({ content: "Xatolik yuz berdi!" });
    },
  });

  // Funksiya chaqiradigan joy
  const updateStatusFunc = (id: string, visitId: string, status: string) => {
    updateStatus({ id, visitId, obj: { status } });
  };

  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Amalni tanlang",
      icon: <ExclamationCircleOutlined />,
      content: "Iltimos, kerakli tugmani tanlang.",
      footer: () => (
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            className="!border-red-500 !text-red-500 cursor-pointer"
            onClick={() => {
              if (!id || !visitId) {
                Modal.error({ content: "ID yoki Visit ID topilmadi!" });
                return;
              }
              updateStatusFunc(id, visitId, "cancelled");
            }}
          >
            {updateStatusLoading ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              "Bekor qildim"
            )}
          </Button>
          <Button
            className="!border-blue-500 !text-blue-500 cursor-pointer"
            onClick={() => {
              if (!id || !visitId) {
                Modal.error({ content: "ID yoki Visit ID topilmadi!" });
                return;
              }
              updateStatusFunc(id, visitId, "in_progress");
            }}
          >
            {updateStatusLoading ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              "Ko'ryabman"
            )}
          </Button>
          <Button
            className="!border-green-500 !text-green-500 cursor-pointer"
            onClick={() => {
              if (!id || !visitId) {
                Modal.error({ content: "ID yoki Visit ID topilmadi!" });
                return;
              }
              updateStatusFunc(id, visitId, "completed");
            }}
          >
            {updateStatusLoading ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              "Ko'rib bo'ldim"
            )}
          </Button>
        </Space>
      ),
    });
  };

  // ========================= LOADING / ERROR =========================
  if (isLoading) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
      </div>
    );
  }

  // ========================= RENDER =========================
  return (
    <div className="pr-[10px] md:pr-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between my-4">
        {/* Orqaga qaytish */}
        {contextHolder}
        <div className="flex items-center gap-4">
          <Link
            to={`${
              location.pathname.slice(1, 7) === "doctor"
                ? "/doctor/patients"
                : location.pathname.slice(1, 7) === "regist"
                ? "/register/patients"
                : "/patients"
            }`}
            className="items-center hidden md:flex gap-1 px-6 py-2.5 text-[14px] font-[500] rounded-md hover:bg-[#E6F4FF]"
          >
            <IoMdArrowBack className="text-[16px]" />
            Orqaga
          </Link>

          {/* Patient ismi + avatar */}
          <div className="flex items-center gap-3">
            <div className="flex uppercase justify-center items-center w-[60px] h-[60px] font-[600] text-[18px] rounded-full bg-[#DBEAFE] text-[#2B7FFF]">
              {logo1}
              {logo2}
            </div>
            <div>
              <h2 className="md:text-[22px] text-[18px] font-[600] mb-[-5px]">
                {patientData?.data.first_name} {patientData?.data.last_name}
              </h2>
              <p className="text-[#9D99AB] font-[300] md:text-[14px] text-[12px]">
                {age} yosh, {gender}
              </p>
            </div>
          </div>
        </div>

        {/* Edit tugmasi */}
        <div>
          {/* <button className="cursor-pointer px-6 py-2.5 bg-[#4d94ff] text-[#fff] rounded-md text-[14px] flex gap-2 hover:bg-[#2B7FFF] transition-all duration-150">
            <BiSolidEditAlt className="text-[18px]" />
            Tahrirlash
          </button> */}
        </div>
      </div>

      {/* MA’LUMOT BLOKLARI */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        {/* LEFT: Asosiy ma'lumotlar */}
        <div className="md:col-span-4 col-span-12 flex flex-col gap-3">
          <div className="border bg-[#fff] border-[#E8E8E8] p-[25px] rounded-[10px]">
            <div className="flex items-center gap-2">
              <RiUser3Line className="text-[#2B7FFF] md:text-[22px] text-[18px]" />
              <h3 className="md:text-[20px] text-[16px] font-[500]">
                Asosiy ma'lumotlar
              </h3>
            </div>

            {/* Avatar */}
            <div className="flex justify-center flex-col text-center mt-[20px]">
              <div className="mx-auto uppercase w-[80px] h-[80px] mb-2 flex items-center justify-center rounded-full bg-[#DBEAFE] font-[600] text-[18px] text-[#2B7FFF]">
                {logo1}
                {logo2}
              </div>
              <h4 className="font-[500]">
                {patientData?.data.first_name} {patientData?.data.last_name}
              </h4>
              <p className="text-[#b6b6b6]">{age} yosh</p>
            </div>

            {/* Qo‘shimcha info */}
            <div className="flex flex-col gap-3 mt-[40px] text-[12px] md:text-[16px]">
              <div className="flex items-center gap-4">
                <BsCalendar4 />
                <p>{patientData?.data.date_of_birth}</p>
              </div>
              <div className="flex items-center gap-4">
                <LuUser />
                <p>{gender}</p>
              </div>
              <div className="flex items-center gap-4">
                <LuHeart />
                <p>{patientData?.data.blood_group}</p>
              </div>
              <div className="flex items-center gap-4">
                <BsTelephone />
                <p>{patientData?.data.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Tibbiy tarix */}
        <div className="md:col-span-8 col-span-12">
          <div className="border bg-[#fff] border-[#E8E8E8] p-[25px] rounded-[10px]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <GrDocumentText className="md:text-[22px] text-[18px]" />
              <h3 className="md:text-[20px] text-[16px] font-[500]">
                Tibbiy tarix
              </h3>
            </div>

            {/* Tabs */}
            {/* <Segmented
              onChange={() => setSegmentValue(!segmentValue)}
              options={["Tashriflar", "Dorilar"]}
              className="!p-1 seg"
              block
            /> */}

            {/* Tashriflar bo‘limi */}
            <div>
              {/* Header */}
              <div className="flex justify-between items-center my-4">
                <h3 className="font-[500] text-[14px] md:text-[16px]">
                  Tashriflar tarixi
                </h3>
                {location.pathname.slice(1, 7) === "doctor" ? (
                  ""
                ) : (
                  <button
                    onClick={showModal}
                    className="flex items-center text-white bg-[#4D94FF] text-[12px] px-4 py-2.5 gap-2 rounded-md cursor-pointer"
                  >
                    <AppstoreOutlined className="text-[#4D94FF] hidden md:block" />{" "}
                    Yangi tashrif qo'shish
                  </button>
                )}
              </div>

              {/* Modal  yangi tashrif*/}

              <Modal
                title={
                  <div className="flex text-[12px] md:text-[16px] items-center gap-2 text-lg font-semibold">
                    <AppstoreOutlined className="text-[#4D94FF]" />
                    <span>Yangi tashrif qo'shish</span>
                  </div>
                }
                open={isVisitOpen}
                onCancel={handleCancel}
                footer={false}
                centered
              >
                <Form
                  onFinish={handleNewVisit}
                  layout="vertical"
                  className="space-y-4"
                  form={form}
                >
                  {/* Doctor select */}
                  <Form.Item
                    name="doctor"
                    label={
                      <div className="flex items-center gap-1">
                        <UserOutlined className="text-[#4D94FF]" />
                        <span>Shifokor</span>
                      </div>
                    }
                    rules={[{ required: true, message: "Shifokorni tanlang!" }]}
                  >
                    <Select
                      className="w-full"
                      placeholder="Shifokorni tanlang"
                      onChange={handleSelectDoctor}
                      options={employeeOptions}
                    />
                  </Form.Item>

                  {/* Services tree */}
                  {handleSelectDoctorState && (
                    <Form.Item
                      name="services"
                      label={
                        <div className="flex items-center gap-1">
                          <AppstoreOutlined className="text-[#4D94FF]" />
                          <span>Servislar</span>
                        </div>
                      }
                      rules={[
                        { required: true, message: "Servislarni tanlang!" },
                      ]}
                    >
                      <TreeSelect
                        showSearch
                        style={{ width: "100%" }}
                        multiple
                        allowClear
                        placeholder="Servislarni tanlang"
                        treeCheckable
                        treeDefaultExpandAll
                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                        treeData={treeData2}
                      />
                    </Form.Item>
                  )}

                  {/* Submit */}
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      className="h-11 rounded-md"
                    >
                      {addEmpLoading ? (
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          className="!text-white"
                        />
                      ) : (
                        "Saqlash"
                      )}
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="🩺 Tashhis qo'yish"
                open={diagnosModal}
                onOk={handleOkDiagnos}
                onCancel={handleCancelDiagnos}
                footer={false}
                width={700}
                className="rounded-xl"
              >
                {diagnosLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                  </div>
                ) : (
                  <Form
                    name="dynamic_form_nest_item"
                    onFinish={sendDiagnos}
                    layout="vertical"
                    autoComplete="off"
                  >
                    {/* Avval mavjud retseptlar */}
                    {(visitRecipes?.data?.recipes?.length ?? 0) > 0 && (
                      <div className="mb-6">
                        <h3 className="text-[16px] font-semibold mb-3">
                          📋 Mavjud retseptlar
                        </h3>
                        <div className="space-y-2">
                          {visitRecipes?.data?.recipes.map(
                            (r: any, idx: number) => (
                              <Card
                                key={r.id}
                                size="small"
                                className="rounded-md border border-gray-200 shadow-sm "
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <div>
                                    <p className="font-medium">
                                      {idx + 1}. {r.name}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                      {r.description}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Yangi retsept qo'shish formi */}
                    {location.pathname.slice(1, 7) === "doctor" && (
                      <>
                        <Form.List name="recipes">
                          {(fields, { add, remove }) => (
                            <div className="space-y-4">
                              <h3 className="text-[16px] font-semibold">
                                ➕ Yangi retsept qo'shish
                              </h3>
                              {fields.map(({ key, name, ...restField }) => (
                                <Card
                                  key={key}
                                  className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                                >
                                  <div className="flex gap-3 items-start">
                                    <Form.Item
                                      {...restField}
                                      name={[name, "name"]}
                                      className="flex-1"
                                      label="💊 Dori nomi"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Dori nomini kiriting",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Masalan: Paracetamol" />
                                    </Form.Item>

                                    <Form.Item
                                      {...restField}
                                      name={[name, "description"]}
                                      className="flex-1"
                                      label="📄 Tavsifi"
                                    >
                                      <Input placeholder="Masalan: Kuniga 2 mahal" />
                                    </Form.Item>

                                    <Button
                                      danger
                                      type="text"
                                      onClick={() => remove(name)}
                                      icon={<MinusCircleOutlined />}
                                    />
                                  </div>
                                </Card>
                              ))}

                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                  className="rounded-lg border-dashed"
                                >
                                  Yangi retsept qo'shish
                                </Button>
                              </Form.Item>
                            </div>
                          )}
                        </Form.List>
                        <Divider />

                        <Form.Item className="!flex justify-end">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={showConfirm}
                              type="button"
                              className="rounded-md !px-10 border !h-[36px] flex justify-center items-center cursor-pointer"
                            >
                              Statusni o'zgartirish
                            </button>
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="rounded-md !px-10 !h-[36px]"
                            >
                              Saqlash
                            </Button>
                          </div>
                        </Form.Item>
                      </>
                    )}
                  </Form>
                )}
              </Modal>
              {/* Tashriflar ro‘yxati */}
              {segmentValue ? (
                !patientVisitesData?.data?.length ? (
                  <Empty />
                ) : (
                  patientVisitesData?.data.map((item) => {
                    const formatted = dayjs(item.created_at).format(
                      "YYYY-MM-DD HH:mm"
                    );
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleTextDiagnos(item.id)}
                        className={`border cursor-pointer border-[#c9c9c9] rounded-[10px] border-l-[4px] border-l-[#4D94FF] px-6 py-4 mb-4`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="md:text-[17px] text-[13px] font-[500]">
                            {item.doctor}
                          </h4>
                          <span className="md:text-[14px] text-[10px] text-[#676767]">
                            {formatted}
                          </span>
                        </div>

                        <ul className="mt-3 flex flex-col gap-1">
                          <li className="flex items-center md:text-[14px] text-[12px] gap-2 text-[#676767]">
                            <span className="font-[400] text-[#000]">
                              Status:
                            </span>
                            <div
                              className={`${
                                item.status === "pending"
                                  ? "bg-[#afc4d9]"
                                  : item.status === "in_progress"
                                  ? "bg-[#CDF4E4]"
                                  : item.status === "cancelled"
                                  ? "bg-[#c47d7d]"
                                  : "bg-[#2ef6a3]"
                              } px-3 py-0.5 text-white rounded-[4px]`}
                            >
                              {item.status}
                            </div>
                          </li>
                          <li className="flex items-center md:text-[14px] text-[12px] gap-2 text-[#676767]">
                            <span className="font-[400] text-[#000]">
                              Tashhis:
                            </span>
                            {item.diagnosis}
                          </li>
                          <li className="flex items-center md:text-[14px] text-[12px] gap-2 text-[#676767]">
                            <span className="font-[400] text-[#000]">
                              To'lov:
                            </span>
                            {item.total_price} so'm
                          </li>
                        </ul>
                      </div>
                    );
                  })
                )
              ) : (
                // Agar "Dorilar" segmenti tanlansa
                <div className="border border-[#c9c9c9] rounded-[10px] border-l-[4px] border-l-[#A855F7] px-6 py-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[17px] font-[500]">Metformin 500mg</h4>
                    <span className="text-[14px] text-[#676767]">
                      2024-12-15
                    </span>
                  </div>
                  <p className="text-[14px] text-[#676767] mt-[-3px]">
                    Kuniga 2 marta
                  </p>
                </div>
              )}
              {/* Pagination */}
              {segmentValue &&
                patientVisitesData?.meta?.total_items &&
                patientVisitesData.meta.total_items > 10 && (
                  <div className="px-6 py-4 border bg-[#F9FAFB] border-[#E0E6EB] flex items-center justify-end rounded-[10px]">
                    <Pagination
                      current={visitesPage}
                      pageSize={10}
                      onChange={(p) => setvisitespage(p)}
                      total={patientVisitesData.meta.total_items}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
