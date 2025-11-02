import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "Không có file nào được gửi lên" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    // Lấy phần mở rộng từ file gốc
    const originalExtension = path.extname(file.name);
    const fileNameWithoutExt = path.basename(file.name, originalExtension);

    // Tạo tên file mới với phần mở rộng gốc
    const newFileName = id + fileNameWithoutExt + originalExtension;

    // Chuyển file sang Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo thư mục
    const uploadDir = path.join(process.cwd(), "public/images");
    await fs.mkdir(uploadDir, { recursive: true });

    // Đường dẫn file
    const filePath = path.join(uploadDir, newFileName);
    await fs.writeFile(filePath, buffer);

    // Trả lại đường dẫn (sửa lại cho đúng với thư mục images)
    return Response.json({
      success: true,
      filename: newFileName,
      url: `/images/${newFileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("fileName"); // Sửa thành fileName

    if (!filename) {
      return Response.json(
        { error: "Thiếu tên file cần xóa" },
        { status: 400 }
      );
    }

    // Đảm bảo filename an toàn, tránh path traversal
    const safeFilename = path.basename(filename);

    // Đường dẫn đến file cần xóa
    const uploadDir = path.join(process.cwd(), "public/images");
    const filePath = path.join(uploadDir, safeFilename);

    // Kiểm tra file có tồn tại không
    try {
      await fs.access(filePath);
    } catch {
      return Response.json({ error: "File không tồn tại" }, { status: 404 });
    }

    // Xóa file
    await fs.unlink(filePath);

    return Response.json({
      success: true,
      message: `Đã xóa file ${safeFilename} thành công`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { error: error.message || "Lỗi server nội bộ" },
      { status: 500 }
    );
  }
}
