import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import axios from "axios";
import { v4 } from "uuid";
import { toast } from "react-toastify";

const UploadImg = ({ value, updateJson }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const id = v4();
  const [fileList, setFileList] = useState(value.images);
  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
  };
  //delete file
  const handleDelete = async (fileName, fileList) => {
    await axios.delete("/api/upload", {
      params: { fileName },
    });
    await updateJson({
      ...value,
      images: fileList,
    });
  };
  // Khi người dùng upload file
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success && fileList?.length) {
        setFileList([
          ...fileList,
          {
            uid: id,
            name: "image.png",
            status: "done",
            url: res.data.url,
          },
        ]);
        updateJson({
          ...value,
          images: [
            ...fileList,
            {
              uid: id,
              name: "image.png",
              status: "done",
              url: res.data.url,
            },
          ],
        });
      } else {
        setFileList([
          {
            uid: id,
            name: "image.png",
            status: "done",
            url: res.data.url,
          },
        ]);
        updateJson({
          ...value,
          images: [
            {
              uid: id,
              name: "image.png",
              status: "done",
              url: res.data.url,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Lỗi khi kết nối tới server!");
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  useEffect(() => {
    setFileList(value?.images);
  }, [value]);
  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        customRequest={handleUpload}
        onRemove={(e) => {
          const newFileList = fileList.filter((item) => item.uid !== e.uid);
          handleDelete(e.url, newFileList);
          setFileList(newFileList);
        }}
        disabled={value.id ? false : true}
      >
        {fileList?.length >= 100 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};
export default UploadImg;
