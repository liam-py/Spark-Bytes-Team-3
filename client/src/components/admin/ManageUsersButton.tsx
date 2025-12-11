"use client";

import React from "react";
import { Button } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useRouter } from "next/navigation";

export default function ManageUsersButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin/users");
  };

  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<ManageAccountsIcon />}
      onClick={handleClick}
    >
      Manage
    </Button>
  );
}
