import {NextRequest} from "next/server";
import {dataTemplate} from "@/helpers/returned_response_template";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
   try {
       const requestBody = await req.json();
       const {orderId, data} = requestBody;
       if (!orderId) {
           return dataTemplate({error:"Không tìm thấy id"}, 400);
       }
       if (!data) {
           return dataTemplate({error: "Không có dữ liệu cập nhật"}, 400);
       }

       if (!data.name) return dataTemplate({error: "Tên sản phẩm không được để trống"}, 400);
       if (!data.price) return dataTemplate({error: "Giá sản phẩm không được để trống"}, 400);
       if (!data.description) return dataTemplate({error: "Mô tả sản phẩm không được để trống"}, 400);
       if (!data.images) return dataTemplate({error: "Ảnh sản phẩm không được để trống"}, 400);
       if (!data.type) return dataTemplate({error: "Danh mục sản phẩm không được để trống"}, 400);

       const productDefault = {
           name: data.name || "",
           price: data.price || 0,
           description: data.description || "",
           images: data.images || [],
           discount: data.discount || 0,
           address: data.address || "",
           total_sold: data.total_sold || 0,
           type: data.type || "",
       }

       const client = await clientPromise;
       const orderCollection = client.db(process.env.DB_NAME).collection("orders");
       const updateOrder = await orderCollection.insertOne({...productDefault});

       if (!updateOrder.acknowledged) {
           return dataTemplate({error: "Cập nhật đơn hàng thất bại"}, 500);
       }

       return dataTemplate({message: "Cập nhật đơn hàng thành công"}, 200);
   } catch (e: any) {

   }
}