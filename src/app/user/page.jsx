"use client";
import { useDispatch, useSelector } from "react-redux";
import React, { Fragment, useEffect, useState } from "react";
import {
  clearListUsers,
  clearUserDetails,
  deleteUser,
  editUser,
  getListUsers,
} from "../../reducers/userReducer";
import useFiltersHandler from "../../hooks/useFiltersHandler";
import { Button, Input } from "antd";
import { Table } from "antd";
import { useRouter } from "next/navigation";
import useToggleDialog from "../../hooks/useToggleDialog";
import DialogEditUser from "./Dialog/DialogEditUser";
import EditUser from "./Components/EditUser";
import { toast } from "react-toastify";

const initialFilters = {
  page: 1,
  pageSize: 10,
  search: "",
};

export default function User() {
  //! State
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { filters, handleSearch, handleChangePage } =
    useFiltersHandler(initialFilters);

  const [formSearch, setFormSearch] = useState({
    search: "",
  });
  const [userId, setUserId] = useState();
  const { toggle, open, shouldRender } = useToggleDialog();

  const { users, paging, isLoadingList, userEdit } = data;

  const columns = [
    {
      title: "Id",
      key: "id",
      render: (_, row) => {
        const offset = (filters.page - 1) * filters.pageSize;
        return <div>{users.indexOf(row) + 1 + offset}</div>;
      },
    },
    {
      title: "User Id",
      dataIndex: "id",
      key: "userId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, row) => {
        return (
          <div>
            {row.firstName} {row.lastName}
          </div>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, row) => (
        <div>
          <Button
            type="primary"
            style={{ marginRight: "1rem" }}
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "red" }}
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  //! Function
  useEffect(() => {
    let shouldSetData = true;

    dispatch(getListUsers(filters));

    return () => {
      shouldSetData = false;
      dispatch(clearListUsers());
    };
  }, [filters]);

  const handleDelete = (row) => {
    dispatch(
      deleteUser({
        id: row.id,
        callback: {
          onSuccess: (status) => {
            if (status) {
              toast.success("Delete user successfully");
            }
            dispatch(getListUsers(filters));
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

  const onEdit = () => {
    dispatch(
      editUser({
        id: userId,
        data: userEdit,
        callback: {
          onSuccess: (status) => {
            if (status) {
              dispatch(getListUsers({ page: 1, pageSize: 10, search: "" }));
              toast.success("Edit user successfully");
              toggle();
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

  const handleEdit = (row) => {
    setUserId(row.id);
    toggle();
  };

  const handleTableChange = (pagination) => {
    handleChangePage(pagination.current);
  };

  return (
    <Fragment>
      {shouldRender && (
        <DialogEditUser
          title="Edit user"
          content={<EditUser userId={userId} />}
          open={open}
          okText="Submit"
          onOk={() => onEdit()}
          onCancel={() => {
            dispatch(clearUserDetails());
            toggle();
          }}
        />
      )}
      <div style={{ padding: "3rem 2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", width: "50%" }}>
            <div style={{ width: "70%" }}>
              <Input
                name="search"
                value={formSearch.search}
                placeholder="Enter keywords"
                onChange={(event) => {
                  setFormSearch({ search: event.target.value });
                }}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch({
                    ...filters,
                    search: formSearch.search.trim(),
                  })
                }
              >
                Search
              </Button>
            </div>
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                router.push("/");
              }}
            >
              Add user
            </Button>
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={users}
            pagination={{
              current: filters.page,
              pageSize: filters.pageSize,
              total: paging?.total,
            }}
            loading={isLoadingList}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Fragment>
  );
}
