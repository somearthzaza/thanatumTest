import style from "./updateform.module.css";
import { useState } from "react";
import { User } from "../model/user.model";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function UpdateForm({
  User,
  setupdateform,
  fetchData,
}: {
  User: User;
  setupdateform: any;
  fetchData: any;
}) {
  const host = process.env.REACT_APP_HOST;
  const [user, setuser] = useState({
    user_id: User.user_id,
    name: User.name,
    lastname: User.lastname,
    birthdate: (User.birthdate = new Date(User.birthdate)
      .toISOString()
      .split("T")[0]),
    age: User.age,
    gender: User.gender,
  });

  const handleInput = (event: any) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name, value);
    setuser({ ...user, [name]: value });
    console.log(user);
  };
  const updateData = async (id: number) => {
    if (areObjectsEqual(User, user)) {
      withReactContent(Swal).fire({
        icon: "error",
        title: "ไม่สามารถแก้ไขข้อมูล",
        text: "ข้อมูลที่แก้ไขไม่มีการเปลี่ยนแปลง",
      });
      return;
    }

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/user/${id}`,
      user
    );
    if (res.status === 200) {
      setupdateform(false);
      withReactContent(Swal).fire({
        icon: "success",
        title: "แก้ไขข้อมูลสำเร็จ",
      });
    }
    fetchData();
  };

  return (
    <>
      <div className={style.backcontainer}></div>
      <div className={style.sumContainer}>
        <div className={style.container}>
          <h1>edit form</h1>
          <form>
            <div className={style.containerInner}>
              <div>
                <span>ชื่อ</span>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInput}
                />
              </div>
              <div>
                <span>นามสกุล</span>
                <input
                  type="text"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleInput}
                />
              </div>
              <div>
                <span>วันเดือนปีเกิด</span>
                <input
                  type="date"
                  name="birthdate"
                  value={user.birthdate}
                  onChange={handleInput}
                />
              </div>
              <div>
                <span>อายุ</span>
                <input
                  type="number"
                  name="age"
                  value={user.age}
                  onChange={handleInput}
                />
              </div>
              <div>
                <span>เพศ</span>
                <div className={style.selectGroup}>
                  <select
                    name="gender"
                    className={style.selectGender}
                    value={user.gender}
                    onChange={handleInput}
                  >
                    <option value="men">ชาย</option>
                    <option value="woman">หญิง</option>
                  </select>
                </div>
              </div>
              <input
                type="button"
                onClick={() => updateData(user.user_id)}
                value="แก้ไข"
                className={style.buttonedit}
              />

              <button
                className={style.cancelButton}
                onClick={() => {
                  setupdateform(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function areObjectsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj2[key] !== obj1[key]) {
      return false;
    }
  }

  return true;
}
