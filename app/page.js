"use client";
import { useEffect, useState } from "react";
import { AutoComplete, Button, Form, Input } from "antd";
import UploadImg from "./components/uploadImg";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(true);

  const [value, setValue] = useState({});

  const [options, setOptions] = useState([]);

  const handleInputChange = (fieldName, value) => {
    setValue((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const readJSONFromPublic = async () => {
    try {
      const response = await fetch("/products.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Lỗi đọc file JSON từ public:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    await axios.delete("/api/json", {
      params: { id: value.id },
    });
    setValue({});
    setOptions([]);
    readJSONFromPublic();
    toast.success("OK", {
      position: "top-right",
    });
  };

  const onSave = async (value) => {
    const res = await axios.post("/api/json", value);
    setValue(res.data.updatedItem);
    setIsEdit(true);
    readJSONFromPublic();
    toast.success("OK", {
      position: "top-right",
    });
  };
  useEffect(() => {
    readJSONFromPublic();
  }, []);
  return (
    <div className="min-h-full">
      <ToastContainer />
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0 pr-[100px]">
                <img
                  src="/images/logo.png"
                  alt="Your Company"
                  className="h-[60px] logo"
                />
              </div>
              <AutoComplete
                classNames={{
                  popup: { root: "certain-category-search-dropdown" },
                }}
                popupMatchSelectWidth={400}
                style={{ width: 400 }}
                options={options?.map((item) => {
                  item.label = item.name;
                  item.value = item.name;
                  return item;
                })}
                onSelect={(__value, option) => {
                  setValue(option);
                }}
                onChange={(e) => {
                  if (e.length === 0) {
                    setOptions([]);
                  } else {
                    console.log("ssss", data);
                    setOptions(data?.filter((item) => item?.name?.includes(e)));
                  }
                }}
              >
                <Input.Search size="large" placeholder="品名" />
              </AutoComplete>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Button
            className="mr-4"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEdit(false);
              setValue({});
            }}
          />
          <Button
            className="mx-4"
            icon={<EditOutlined />}
            disabled={!value?.id}
            onClick={() => {
              setIsEdit(false);
            }}
          />
          <Button
            className="mx-4"
            icon={<SaveOutlined />}
            disabled={isEdit}
            onClick={() => {
              if (
                value?.name === undefined ||
                value?.name?.length === 0 ||
                (data.some((item) => item.name === value?.name) && !value.id)
              ) {
                toast.error("名前は空欄や重複にしてはいけません。", {
                  position: "top-right",
                });
              } else {
                onSave(value);
              }
            }}
          />
          <Button
            className="mx-4"
            icon={<DeleteOutlined />}
            disabled={!value?.id}
            onClick={handleDelete}
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Form>
            <div className="">
              <div>
                <Form.Item label="品名">
                  <Input
                    style={{ width: 400 }}
                    disabled={isEdit}
                    value={value?.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </Form.Item>
              </div>
              <Form.Item label="情報">
                <TextArea
                  autoSize={{
                    minRows: 15,
                  }}
                  disabled={isEdit}
                  value={value.details}
                  onChange={(e) => handleInputChange("details", e.target.value)}
                />
              </Form.Item>
            </div>
          </Form>
          <label>写真</label>
          <UploadImg value={value} updateJson={onSave} />
        </div>
      </main>
    </div>
  );
};

export default Home;
