import {NextRequest} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
   try {
       const requestBody = await req.json();
       const {data} = requestBody;

       if (!data) {
           return dataTemplate({error: "Không có dữ liệu cập nhật"}, 400);
       }

       if (!data.name) return dataTemplate({error: "Tên sản phẩm không được để trống"}, 400);
       if (!data.price) return dataTemplate({error: "Giá sản phẩm không được để trống"}, 400);
       if (!data.description) return dataTemplate({error: "Mô tả sản phẩm không được để trống"}, 400);
       if (!data.image) return dataTemplate({error: "Ảnh sản phẩm không được để trống"}, 400);
       if (!data.type) return dataTemplate({error: "Danh mục sản phẩm không được để trống"}, 400);

       const productDefault = {
           name: data.name || "",
           price: data.price || 0,
           description: data.description || "",
           image: data.image || "",
           discount: data.discount || 0,
           address: data.address || "",
           total_sold: data.total_sold || 0,
           type: data.type || "",
           createdAt: new Date(),
           updatedAt: new Date()
       }

       const client = await clientPromise;
       const MenuCollection = client.db(process.env.DB_NAME).collection(data.type);
       const updateMenu = await MenuCollection.insertOne({...productDefault});

       if (!updateMenu.acknowledged) {
           return dataTemplate({error: "Cập nhật món thất bại"}, 500);
       }

       return dataTemplate({message: "Cập nhật món thành công"}, 200);
   } catch (e: any) {

   }
}