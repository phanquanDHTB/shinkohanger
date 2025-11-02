import fs from "fs";
import path from "path";
import { v4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const filePath = path.join(process.cwd(), "public", "products.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);

    if (!body.id) {
      const newId = v4();
      fs.writeFileSync(
        filePath,
        JSON.stringify(
          [
            ...jsonData,
            { id: newId, name: body?.name, details: body?.details, images: [] },
          ],
          null,
          2
        ),
        "utf8"
      );
      return Response.json({
        message: "Cập nhật thành công",
        updatedItem: {
          id: newId,
          name: body?.name,
          details: body?.details,
          images: [],
        },
      });
    }

    // Tìm phần tử có id trùng khớp
    const index = jsonData.findIndex((item) => item.id === body.id);

    if (index === -1) {
      return Response.json({
        message: `Không tìm thấy phần tử có id = ${body.id}`,
      });
    }

    // Cập nhật name
    jsonData[index] = body;

    // Ghi lại file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

    return Response.json({
      message: "Cập nhật thành công",
      updatedItem: jsonData[index],
    });
  } catch (error) {
    return Response.json({
      message: "Lỗi server",
      error: error.message,
    });
  }
}

export async function DELETE(req) {
  const filePath = path.join(process.cwd(), "public", "products.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const jsonData = JSON.parse(fileData);

  const { searchParams } = new URL(req.url);
  if (jsonData.length === 1) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
    return Response.json({
      message: "Cập nhật thành công",
    });
  }

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      jsonData?.filter((item) => item.id !== searchParams.get("id")),
      null,
      2
    ),
    "utf8"
  );
  return Response.json({
    message: "Cập nhật thành công",
  });
}
