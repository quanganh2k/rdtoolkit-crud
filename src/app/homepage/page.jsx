"use client";
import { Button, Input } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../reducers/userReducer";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Homepage() {
  const [userCreate, setUserCreate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const dipatch = useDispatch();

  const handleChange = (event) => {
    setUserCreate({ ...userCreate, [event.target.name]: event.target.value });
  };

  const handleCreateUser = (event) => {
    event.preventDefault();
    dipatch(
      addUser({
        data: userCreate,
        callback: {
          onSuccess: (status) => {
            if (status) {
              toast.success("Sign up successfully");
              router.push("/user");
            }
          },
          onError: (status, message) => {
            if (!status) {
              toast.error(message);
            }
          },
        },
      })
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "400px" }}>
        <form onSubmit={handleCreateUser}>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              placeholder="First name"
              name="firstName"
              value={userCreate.firstName}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              placeholder="Last name"
              name="lastName"
              value={userCreate.lastName}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              placeholder="Email"
              name="email"
              value={userCreate.email}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              placeholder="Password"
              name="password"
              value={userCreate.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
