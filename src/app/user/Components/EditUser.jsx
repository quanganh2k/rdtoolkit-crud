import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserDetails,
  getUserDetails,
  saveUserEdit,
} from "../../../reducers/userReducer";

export default function EditUser(props) {
  //! State
  const { userId } = props;
  const dataUser = useSelector((state) => state.user);
  const { user, isLoadingDetail, errorDetail } = dataUser;

  const dispatch = useDispatch();
  const [userEdit, setUserEdit] = useState();

  //! Function
  const handleChange = (event) => {
    setUserEdit({ ...userEdit, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    let shouldSetData = true;

    dispatch(
      getUserDetails({
        id: userId,
        onError: (message) => {
          alert(message);
        },
      })
    );

    return () => {
      shouldSetData = false;
      return () => {
        dispatch(clearUserDetails());
      };
    };
  }, [userId]);

  useEffect(() => {
    setUserEdit(user);
  }, [user]);

  useEffect(() => {
    if (userEdit) {
      dispatch(
        saveUserEdit({ ...userEdit, [event.target.name]: event.target.value })
      );
    }
  }, [userEdit]);

  if (isLoadingDetail) {
    return <div>Loading...</div>;
  }

  //! Render
  return (
    <div>
      <form onSubmit={() => {}}>
        <div style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="First name"
            name="firstName"
            value={userEdit?.firstName}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Last name"
            name="lastName"
            value={userEdit?.lastName}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Email"
            name="email"
            value={userEdit?.email}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
}
