"use client";

import React from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { AdminUserSummary } from "./types";

type AdminUserTableProps = {
  users: AdminUserSummary[];
  selectedUserId: string | null;
  onSelect: (userId: string) => void;
  onDelete: (userId: string) => void;
  loading?: boolean;
};

export default function AdminUserTable({
  users,
  selectedUserId,
  onSelect,
  onDelete,
  loading,
}: AdminUserTableProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Users
        </Typography>
        <TableContainer sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name / Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created Events</TableCell>
                <TableCell>Reservations</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {loading ? "Loading users..." : "No users found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    selected={selectedUserId === user.id}
                    onClick={() => onSelect(user.id)}
                    sx={{
                      cursor: "pointer",
                      "&.Mui-selected": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.name || user.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === "ADMIN" ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell>{user.createdEventsCount}</TableCell>
                    <TableCell>{user.reservationsCount}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(user.id)
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
