import { useState, useEffect } from "react";
import style from "./home.module.css";
import Table from "../components/table";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import UpdateForm from "../components/updateform";
import { User } from "../model/user.model";

export default function Home() {
  const [data, setData] = useState([]);
  const [user, setuser] = useState({
    name: "",
    lastname: "",
    birthdate: "",
    age: 0,
    gender: "men",
  });

  const [updateform, setupdateform] = useState(false);
  const [userSpec, setuserSpec] = useState<User>({} as User);
  const fetchData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
    res.data.map((item: any) => {
      item.birthdate = new Date(item.birthdate).toLocaleDateString();
    });
    setData(res.data);
  };

  const handlesubmit = async (event: any) => {
    event.preventDefault();

    if (
      user.name === "" ||
      user.lastname === "" ||
      user.birthdate === "" ||
      user.age === 0
    ) {
      withReactContent(Swal).fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
      });
      return;
    }
    withReactContent(Swal).fire({});
    try {
      const res = await axios.post("http://localhost:3000/user", user);
      if (res.status === 201) {
        withReactContent(Swal).fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
        });
      }
    } catch (e) {
      const error = e as AxiosError;
      console.clear();
      if (error?.response?.status === 409) {
        withReactContent(Swal).fire({
          icon: "error",
          title: "ชื่อซ้ำ",
        });
      } else {
        withReactContent(Swal).fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
        });
      }
    } finally {
      fetchData();
    }
  };

  const handleInput = (event: any) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name, value);
    setuser({ ...user, [name]: value });
    console.log(user);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {updateform && (
        <UpdateForm
          User={userSpec}
          setupdateform={setupdateform}
          fetchData={fetchData}
        />
      )}
      <div className={style.sumContainer}>
        <div className={style.container}>
          <h1>input form</h1>
          <form onSubmit={handlesubmit}>
            <div className={style.containerInner}>
              <div>
                <span>ชื่อ</span>
                <input
                  type="text"
                  value={user.name}
                  name="name"
                  onChange={handleInput}
                />
              </div>
              <div>
                <span>นามสกุล</span>
                <input
                  type="text"
                  value={user.lastname}
                  onChange={handleInput}
                  name="lastname"
                />
              </div>
              <div>
                <span>วันเดือนปีเกิด</span>
                <input
                  type="date"
                  value={user.birthdate}
                  onChange={handleInput}
                  name="birthdate"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <span>อายุ</span>
                <input
                  type="number"
                  value={user.age}
                  onChange={handleInput}
                  name="age"
                />
              </div>
              <div>
                <span>เพศ</span>
                <div className={style.selectGroup}>
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInput}
                    className={style.selectGender}
                  >
                    <option value="men">ชาย</option>
                    <option value="woman">หญิง</option>
                  </select>
                  <span></span>
                </div>
              </div>
            </div>

            <input type="submit" value="เพิ่ม" />
          </form>
        </div>
        <Table
          data={data}
          fetchData={fetchData}
          setUser={setuserSpec}
          setupdateform={setupdateform}
        />
      </div>
    </>
  );
}
