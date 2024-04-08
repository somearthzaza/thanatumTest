import style from "./table.module.css";
import { User } from "../model/user.model";

import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Table({
  data,
  fetchData,
  setUser,
  setupdateform,
}: {
  data: User[];
  fetchData: any;
  setUser: any;
  setupdateform: any;
}) {
  const host = import.meta.env.VITE_API_KEY;
  const deleteData = async (id: number) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/user/${id}`);
    fetchData();
  };

  const swal = (id: number) => {
    withReactContent(Swal)
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteData(id);
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
        }
      });
  };

  const handleEdit = (userId: number) => {
    const item = data.find((item) => item.user_id === userId);
    setUser(item);
    setupdateform(true);
  };

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>นามสกุล</th>
          <th>วันเดือนปีเกิด</th>
          <th>อายุ</th>
          <th>เพศ</th>
          <th>ตัวเลือก</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.lastname}</td>
            <td>{item.birthdate}</td>
            <td>{item.age}</td>
            <td>{item.gender}</td>
            <td>
              <button onClick={() => handleEdit(item.user_id)}>แก้ไข</button>
              <button onClick={() => swal(item.user_id)}>ลบ</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
