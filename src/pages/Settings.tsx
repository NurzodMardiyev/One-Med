import { FiPlus } from "react-icons/fi";
import { TbCategoryPlus } from "react-icons/tb";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  GetProp,
  Input,
  Spin,
  TreeSelect,
  TreeSelectProps,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { useEffect, useState } from "react";

type ServiceType = {
  id: string;
  name: string;
  price: number;
};

type DataCategoryType = {
  id: string;
  name: string;
  services: ServiceType[];
};

type CategoryResponse = {
  success: boolean;
  data: DataCategoryType;
};
type CategoryRequest = {
  name: string;
};

type Service = {
  id: string;
  name: string;
  price: number;
};

type CategoryData = {
  id: string;
  name: string;
  services: Service[];
};

type ServicesResponse = {
  success: boolean;
  data: CategoryData;
};

type ServiceRequest = {
  name: string;
  price: number;
};

type CreateCategoryServiceRequest = {
  category: string; // category id
  services: ServiceRequest[];
};

type DefaultOptionType = GetProp<TreeSelectProps, "treeData">[number];

export default function Settings() {
  const [form] = Form.useForm();
  const [checkAddCategoryName, setCheckCategoryName] =
    useState<DataCategoryType>();
  const [closeCat, setCloseCat] = useState(true);

  const queryClient = useQueryClient();
  const { mutate: categoryNameMutate, isLoading: categoryNameLoading } =
    useMutation<CategoryResponse, Error, CategoryRequest>(
      (obj) => OneMedAdmin.addCategory(obj),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(["getCategorylist"]);
          form.setFieldsValue({
            items: [...(form.getFieldValue("items") || []), { list: [] }],
          });
          setCheckCategoryName(data.data);
        },
      }
    );

  console.log(checkAddCategoryName);

  const addCategoryName = (value: { name: string }) => {
    categoryNameMutate(value);
  };

  const { mutate: addServicesMutate, isLoading: addServicesLoading } =
    useMutation<ServicesResponse, Error, CreateCategoryServiceRequest>(
      (obj) => OneMedAdmin.addServices(obj),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(["addServices"]);
          refetch();
          console.log(data);

          // 🔥 Qayta bosh holatga qaytarish
          setCheckCategoryName(undefined);
          form.resetFields();
          setCloseCat(true);
        },
      }
    );
  // Safe handler — Form'dan olingan values'ni to'g'rilaymiz va validate qilamiz
  const addCategoryWithServices = (values: any) => {
    // values.items - formdan keladi. Hamma holatni tekshirib olamiz.
    const items = values?.items;
    if (!items || items.length === 0) {
      console.warn("Hech qanday item topilmadi");
      return;
    }

    // Formda bir yoki bir nechta item bo'lsa, ularning ichidan servislarni yig'ish:
    // (siz form tuzilishingizga qarab moslang)
    const servicesRaw = items[0]?.list ?? [];

    // Agar service bo'lmasa, chiqamiz
    if (!servicesRaw || servicesRaw.length === 0) {
      console.warn("Hech qanday servis topilmadi");
      return;
    }

    // ensure category id exists
    if (!checkAddCategoryName?.id) {
      console.warn("Category tanlanmagan (checkAddCategoryName.id yo'q)");
      return;
    }

    // Map qilib to'g'ri tipga keltiramiz (price — number bo'lishi kerak)
    const servicesPayload: ServiceRequest[] = servicesRaw.map((s: any) => ({
      name: String(s.name ?? ""),
      price: Number(s.price ?? 0),
    }));

    // Optional: filter out invalid servislar
    const servicesFiltered = servicesPayload.filter(
      (s) => s.name.trim().length > 0 && !Number.isNaN(s.price)
    );

    if (servicesFiltered.length === 0) {
      console.warn("Yaroqsiz servis ma'lumotlari");
      return;
    }

    const payload: CreateCategoryServiceRequest = {
      category: checkAddCategoryName.id,
      services: servicesFiltered,
    };

    // Endi mutate chaqiramiz
    addServicesMutate(payload);
  };

  // Select uchun categoriyalarni olish
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const per_page = 14;

  const {
    data: getCategoryList,
    isLoading: getCatLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["getCategorylist", page, per_page],
    queryFn: () => OneMedAdmin.getCategorylist(page, per_page),
    keepPreviousData: true,
  });

  const [value, setValue] = useState<string>();
  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, "label">[]>(
    []
  );

  useEffect(() => {
    if (getCategoryList?.data) {
      const formatted = getCategoryList.data.flatMap(
        (cat: DataCategoryType) => {
          const parentNode = {
            id: cat.id,
            pId: 0,
            value: cat.id,
            title: cat.name,
            selectable: true,
          };

          const serviceNodes = cat.services.map((srv) => ({
            id: srv.id,
            pId: cat.id,
            value: srv.id,
            title: `${srv.name} - ${srv.price} so'm`,
            selectable: false,
          }));

          return [parentNode, ...serviceNodes];
        }
      );

      setTreeData((prev) => [...prev, ...formatted]);

      // ❗️ agar oxirgi page bo‘lsa, page oshmasligi uchun belgi qo‘yamiz
      if (getCategoryList.data.length < per_page) {
        setHasMore(false);
      }
    }
  }, [getCategoryList]);

  // scroll event
  const handlePopupScroll: TreeSelectProps["onPopupScroll"] = (e) => {
    const target = e.target as HTMLDivElement;

    if (
      hasMore && // faqat hali malumot qolgan bo‘lsa
      !isFetching && // hozir fetch bo‘lmayotgan bo‘lsa
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 5
    ) {
      console.log("Scroll pastga yetdi, keyingi sahifa yuklanmoqda...");
      setPage((prev) => prev + 1);
    }
  };

  const onChangeSelect = (newValue: string) => {
    console.log("Selected:", newValue);
    setValue(newValue);
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-[30px]">
        <div>
          <h1 className="text-[22px] font-[600]">Sozlamalar paneli</h1>
          <p className="text-[#8F99A3]">
            Profile sozlamalari va kategoriyalar boshqaruvi
          </p>
        </div>

        <button className="flex gap-2 items-center py-2 px-4 rounded-md text-white cursor-pointer bg-[#2B7FFF]">
          <FiPlus className="text-[20px]" />
          Accountni sozlash
        </button>
      </div>

      <div className="border md:w-full w-full border-[#e3e3e3] rounded-[10px] px-6 py-4 mb-3 mt-6">
        <div className="flex items-center gap-3">
          <TbCategoryPlus className="text-[20px] text-[#2B7FFF] mb-1" />
          <h2 className="text-[18px] font-[500]">Kategoriyalar qo'shish</h2>
        </div>
        <div>
          <div className="grid w-full grid-cols-12 mt-4 gap-4">
            <div className="!col-span-4 border rounded-xl border-[#F0F0F0] px-4 py-2">
              <h3 className="font-[500] mb-3 text-[14px] mt-3">
                Mavjud Kategoriyalarni tanlash
              </h3>

              <div>
                <TreeSelect
                  treeDataSimpleMode
                  style={{ width: "100%" }}
                  value={value}
                  placeholder="Please select"
                  onChange={onChangeSelect}
                  treeData={treeData}
                  loading={getCatLoading && page === 1} // faqat birinchi page uchun umumiy spin
                  onPopupScroll={handlePopupScroll}
                  dropdownStyle={{ maxHeight: 300, overflow: "auto" }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {isFetching && hasMore && (
                        <div style={{ textAlign: "center", padding: 8 }}>
                          <Spin size="small" />
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="!col-span-8">
              {checkAddCategoryName ? (
                ""
              ) : (
                <div className=" border rounded-xl border-[#F0F0F0] px-4 py-2">
                  <h3 className="font-[500] mb-3 text-[14px] mt-3">
                    Yangi kategoriya qo'shish
                  </h3>

                  <Form layout="vertical" onFinish={addCategoryName}>
                    <Form.Item name="name" label="Kategoriya nomi">
                      <Input />
                    </Form.Item>

                    <Form.Item>
                      <button className="!bg-[#4D94FF] hover:!bg-[#2B7FFF] !h-[40px] !text-white cursor-pointer w-full rounded-md">
                        {categoryNameLoading ? (
                          <Spin
                            className="!text-white"
                            indicator={<LoadingOutlined spin />}
                          />
                        ) : (
                          "+ Yangi kategoriya qo'shish"
                        )}
                      </button>
                    </Form.Item>
                  </Form>
                </div>
              )}

              {checkAddCategoryName ? (
                <div className="border rounded-xl border-[#F0F0F0] px-4 py-2">
                  <h3 className="font-[500] mb-3 text-[14px] mt-3">
                    Yangi kategoriya qo'shish
                  </h3>
                  <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                    name="dynamic_form_complex"
                    autoComplete="off"
                    className="!w-full"
                    onFinish={(value) => addCategoryWithServices(value)}
                  >
                    <Form.List name="items">
                      {(fields, { add, remove }) => (
                        <div
                          style={{
                            display: "flex",
                            rowGap: 16,
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          {fields.map((field) => (
                            <Card
                              size="small"
                              title={`${checkAddCategoryName?.name}`}
                              key={field.key}
                              extra={
                                <CloseOutlined
                                  onClick={() => {
                                    remove(field.name);
                                    setCloseCat(false);
                                  }}
                                />
                              }
                            >
                              <Form.Item label="Servis">
                                <Form.List name={[field.name, "list"]}>
                                  {(subFields, subOpt) => (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 16,
                                      }}
                                    >
                                      {subFields.map((subField) => (
                                        <div
                                          className="!flex justify-between gap-5"
                                          key={subField.key}
                                        >
                                          <Form.Item
                                            noStyle
                                            name={[subField.name, "name"]}
                                          >
                                            <Input placeholder="Servis nomi" />
                                          </Form.Item>
                                          <Form.Item
                                            noStyle
                                            name={[subField.name, "price"]}
                                          >
                                            <Input
                                              type="number"
                                              placeholder="Servis narxi"
                                            />
                                          </Form.Item>
                                          <CloseOutlined
                                            onClick={() =>
                                              subOpt.remove(subField.name)
                                            }
                                          />
                                        </div>
                                      ))}
                                      <Button
                                        onClick={() => subOpt.add()}
                                        block
                                      >
                                        + Servis qo'shish
                                      </Button>
                                    </div>
                                  )}
                                </Form.List>
                              </Form.Item>
                            </Card>
                          ))}

                          {checkAddCategoryName && closeCat ? (
                            <Button
                              className="!bg-[#4D94FF] hover:!bg-[#2B7FFF] !h-[40px] !text-white"
                              htmlType="submit"
                              block
                            >
                              {addServicesLoading ? (
                                <Spin
                                  className="!text-white"
                                  indicator={<LoadingOutlined spin />}
                                />
                              ) : (
                                "+ Ma'lumotlarni yuborish"
                              )}
                            </Button>
                          ) : (
                            <Button
                              className="!bg-[#4D94FF] hover:!bg-[#2B7FFF] !h-[40px] !text-white"
                              onClick={() => {
                                setCloseCat(true);
                                add();
                              }}
                              block
                            >
                              + Yangi kategoriya qo'shish
                            </Button>
                          )}
                        </div>
                      )}
                    </Form.List>
                  </Form>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
