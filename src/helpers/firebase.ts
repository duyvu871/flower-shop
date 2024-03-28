import {storage} from '@/firebase/firebase';
import {deleteObject, ref} from "@firebase/storage";

// Function to delete a file in Firebase Storage by download URL
export async function deleteFileByDownloadUrl(downloadUrl: string) {
    let path: string;
    try {
        path = decodeURIComponent(downloadUrl.split("o/")[1].split("?")[0]);
        // Lấy đường dẫn của tệp từ URL tải xuống
        const fileRef = ref(storage, path);
        return deleteObject(fileRef);

    } catch (error) {
        console.error("Error deleting file:", error);
    }
}
